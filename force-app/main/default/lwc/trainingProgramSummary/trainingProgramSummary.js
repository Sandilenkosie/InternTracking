import { LightningElement, api, wire, track } from 'lwc';
import getTrainingProgramDetails from '@salesforce/apex/TrainingProgramController.getTrainingProgramDetails';

export default class TrainingProgramSummary extends LightningElement {
    @api recordId;
    trainingProgram;
    phases = [];
    interns = [];
    examSchedules = [];
    filteredSchedules = [];
    error;
    selectedFilter = 'Week';
    currentPeriodRange = '';
    nextPeriodRange = '';
    ongoingPeriodRange = '';

    @track selectedInternId = '';
    @track selectedInternDetails = {};
    @track internOptions = [];
    @track isLoading = false;

    // Wire function to fetch data
    @wire(getTrainingProgramDetails, { trainingProgramId: '$recordId' })
    wiredTrainingProgram({ error, data }) {
        if (data) {
            console.log('Training Program Data:', data);  // Log the data to check if interns are fetched
            this.trainingProgram = data.trainingProgram;
            this.phases = data.phases;
            this.interns = data.interns;
            this.examSchedules = data.examSchedules;
            this.filteredSchedules = data.examSchedules;

            // Create options for the intern filter combobox
            this.internOptions = [
                { label: 'All Interns', value: '' },
                ...data.interns.map(intern => ({
                    label: intern.User__r.Name, 
                    value: intern.User__c
                })) // Map User__c here
            ];

            // Apply Week filter by default after fetching data
            this.handleWeekFilter();
        } else if (error) {
            console.error('Error fetching data:', error);  // Log the error if there's an issue
            this.error = error;
        }
    }

    // Getter to check if there are any interns available
    get hasInterns() {
        return this.interns && this.interns.length > 0;
    }

    // Getter for dynamic button variants
    get weekVariant() {
        return this.selectedFilter === 'Week' ? 'brand' : 'neutral';
    }

    get monthVariant() {
        return this.selectedFilter === 'Month' ? 'brand' : 'neutral';
    }

    get quarterVariant() {
        return this.selectedFilter === 'Quarter' ? 'brand' : 'neutral';
    }

    // Handle filter by Calendar Week
    handleWeekFilter() {
        this.isLoading = true;
        this.selectedFilter = 'Week';
        const startOfWeek = this.getStartOfWeek(new Date());
        const endOfWeek = new Date(startOfWeek);
        endOfWeek.setDate(startOfWeek.getDate() + 6); // End of the week (7 days)

        this.applyFilter(startOfWeek, endOfWeek, 'Week');
    }

    // Handle filter by Calendar Month
    handleMonthFilter() {
        this.isLoading = true;
        this.selectedFilter = 'Month';
        const today = new Date();
        const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1); // First day of the month
        const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0); // Last day of the month

        this.applyFilter(startOfMonth, endOfMonth, 'Month');
    }

    // Handle filter by Calendar Quarter
    handleQuarterFilter() {
        this.isLoading = true;
        this.selectedFilter = 'Quarter';
        const today = new Date();
        const startOfQuarter = new Date(today.getFullYear(), this.getQuarterStartMonth(today.getMonth()), 1);
        const endOfQuarter = new Date(today.getFullYear(), this.getQuarterStartMonth(today.getMonth()) + 3, 0); // Last day of the quarter

        this.applyFilter(startOfQuarter, endOfQuarter, 'Quarter');
    }

    // Helper method to get the start month of the quarter based on the current month
    getQuarterStartMonth(month) {
        if (month < 3) return 0;    // Q1
        if (month < 6) return 3;    // Q2
        if (month < 9) return 6;    // Q3
        return 9;                   // Q4
    }

    // Helper method to get the start of the week (Sunday by default)
    getStartOfWeek(date) {
        const day = date.getDay();
        const diff = date.getDate() - day + (day === 0 ? -6 : 0); // Adjust for Sunday
        const startOfWeek = new Date(date.setDate(diff));
        startOfWeek.setHours(0, 0, 0, 0); // Ensure the time is at midnight
        return startOfWeek;
    }

    // Helper method to get the end of the week (Saturday)
    getEndOfWeek(date) {
        const day = date.getDay();
        const diff = date.getDate() - day + (day === 0 ? 6 : 6); // Adjust for Saturday
        const endOfWeek = new Date(date.setDate(diff));
        endOfWeek.setHours(23, 59, 59, 999); // Ensure the time is at 11:59 PM
        return endOfWeek;
    }

    // Apply filters based on intern and selected time period
    applyFilter(startDate, endDate, filterType) {
        this.isLoading = true; // Set loading state to true before processing
    
        let filteredSchedules = this.examSchedules;
    
        // Filter by intern if selected
        if (this.selectedInternId) {
            filteredSchedules = filteredSchedules.filter(schedule => schedule.Assigned_To__c === this.selectedInternId);
        }
    
        // Filter by date range (current period)
        this.filteredSchedules = filteredSchedules.map(schedule => {
            const scheduledDate = new Date(schedule.Scheduled_Date__c);
    
            const isInCurrentPeriod = scheduledDate >= startDate && scheduledDate <= endDate;
            const isOngoing = scheduledDate > endDate;
    
            return {
                ...schedule,
                isInCurrentPeriod,
                isOngoing,
                formattedDate: this.formatDate(scheduledDate)
            };
        });
    
        this.updateDateRanges(startDate, endDate, filterType);
    
        setTimeout(() => {
            this.isLoading = false; // Set loading state to false after processing
        }, 500);
    }

    // Update date ranges for the current, next, and ongoing periods
    updateDateRanges(startDate, endDate, filterType) {
        const periodString = `${this.formatDate(startDate)} - ${this.formatDate(endDate)}`;
        this.currentPeriodRange = `(${periodString})`;

        // Next period
        const nextPeriodStart = new Date(endDate);
        nextPeriodStart.setDate(endDate.getDate() + 1);
        let nextPeriodEnd = new Date(nextPeriodStart);

        if (filterType === 'Week') {
            nextPeriodEnd.setDate(nextPeriodStart.getDate() + 6);
        } else if (filterType === 'Month') {
            nextPeriodEnd = new Date(nextPeriodStart.getFullYear(), nextPeriodStart.getMonth() + 1, 0);
        } else if (filterType === 'Quarter') {
            nextPeriodEnd = new Date(nextPeriodStart.getFullYear(), this.getQuarterStartMonth(nextPeriodStart.getMonth()) + 3, 0);
        }

        this.nextPeriodRange = `(${this.formatDate(nextPeriodStart)} - ${this.formatDate(nextPeriodEnd)})`;

        // Ongoing period
        const ongoingStart = new Date(nextPeriodEnd);
        ongoingStart.setDate(nextPeriodEnd.getDate() + 1);
        this.ongoingPeriodRange = `(Due After - ${this.formatDate(ongoingStart)})`;
    }

    // Format date for display
    formatDate(date) {
        const options = { month: 'short', day: 'numeric' };
        return date.toLocaleDateString('en-US', options);
    }

    // Handle intern filter change
    handleInternChange(event) {
        this.selectedInternId = event.target.value;
        this.selectedInternDetails = this.interns.find(
            intern => intern.User__c === this.selectedInternId
        ) || {};
        // Re-apply the filter based on selected intern and current period
        this.applyFilter(this.getStartOfWeek(new Date()), this.getEndOfWeek(new Date()), this.selectedFilter);
    }

    // Handle reset (refresh)
    handleRefresh() {
        this.selectedInternId = ''; // Reset the intern filter
        this.handleWeekFilter();
        this.isLoading = true;
        this.applyFilter(this.getStartOfWeek(new Date()), this.getEndOfWeek(new Date()), this.selectedFilter); // Re-apply filter for the current period
        
    }
}
