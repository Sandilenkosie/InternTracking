import { LightningElement, api, wire } from 'lwc';
import getTrainingProgramDetails from '@salesforce/apex/TrainingProgramController.getTrainingProgramDetails';
import { refreshApex } from '@salesforce/apex';

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
            this.handleWeekFilter(); // Apply Week filter by default
        } else if (error) {
            console.error('Error fetching data:', error);  // Log the error if there's an issue
            this.error = error;
        }
    }
    
    get hasInterns() {
        return this.interns && this.interns.length > 0;
    }
    // Handle filter by Calendar Week
    handleWeekFilter() {
        this.selectedFilter = 'Week';
        const startOfWeek = this.getStartOfWeek(new Date());
        const endOfWeek = new Date(startOfWeek);
        endOfWeek.setDate(startOfWeek.getDate() + 6); // End of the week (7 days)

        this.applyFilter(startOfWeek, endOfWeek, 'Week');
    }

    // Handle filter by Calendar Month
    handleMonthFilter() {
        this.selectedFilter = 'Month';
        const today = new Date();
        const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1); // First day of the month
        const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0); // Last day of the month

        this.applyFilter(startOfMonth, endOfMonth, 'Month');
    }

    // Handle filter by Calendar Quarter
    handleQuarterFilter() {
        this.selectedFilter = 'Quarter';
        const today = new Date();
        const startOfQuarter = new Date(today.getFullYear(), this.getQuarterStartMonth(today.getMonth()), 1);
        const endOfQuarter = new Date(today.getFullYear(), this.getQuarterStartMonth(today.getMonth()) + 3, 0); // Last day of the quarter

        this.applyFilter(startOfQuarter, endOfQuarter, 'Quarter');
    }

    // Helper method to get the start month of the quarter based on current month
    getQuarterStartMonth(month) {
        if (month < 3) return 0;    // Q1
        if (month < 6) return 3;    // Q2
        if (month < 9) return 6;    // Q3
        return 9;                   // Q4
    }

    // General function to apply filters to schedules and update ranges
    applyFilter(startDate, endDate, filterType) {
        this.filteredSchedules = this.examSchedules.filter(schedule => {
            const scheduledDate = new Date(schedule.Scheduled_Date__c);
            return scheduledDate >= startDate && scheduledDate <= endDate;
        });

        this.updateDateRanges(startDate, endDate, filterType);
    }

    // Function to update the date ranges in the column names
    updateDateRanges(startDate, endDate, filterType) {
        const periodString = `${this.formatDate(startDate)} - ${this.formatDate(endDate)}`;
        if (filterType === 'Week') {
            this.currentPeriodRange = `(${periodString})`;
        } else if (filterType === 'Month') {
            this.currentPeriodRange = `(${periodString})`;
        } else if (filterType === 'Quarter') {
            this.currentPeriodRange = `(${periodString})`;
        }

        // For "Next Period", use the next week/month/quarter
        const nextPeriodStart = new Date(endDate);
        nextPeriodStart.setDate(endDate.getDate() + 1); // Next day after current period
        let nextPeriodEnd = new Date(nextPeriodStart);

        if (filterType === 'Week') {
            nextPeriodEnd.setDate(nextPeriodStart.getDate() + 6);
        } else if (filterType === 'Month') {
            nextPeriodEnd = new Date(nextPeriodStart.getFullYear(), nextPeriodStart.getMonth() + 1, 0);
        } else if (filterType === 'Quarter') {
            nextPeriodEnd = new Date(nextPeriodStart.getFullYear(), this.getQuarterStartMonth(nextPeriodStart.getMonth()) + 3, 0);
        }

        this.nextPeriodRange = `(${this.formatDate(nextPeriodStart)} - ${this.formatDate(nextPeriodEnd)})`;

        // Ongoing Period (i.e., after the current filter period)
        const ongoingStart = new Date(nextPeriodEnd);
        ongoingStart.setDate(nextPeriodEnd.getDate() + 1);
        this.ongoingPeriodRange = `(${this.formatDate(ongoingStart)})`;
    }


    applyFilter(startDate, endDate, filterType) {
        // Calculate next period dates based on filter type
        const nextPeriodStart = new Date(endDate);
        nextPeriodStart.setDate(endDate.getDate() + 1); // Start the next period right after the current period ends
        let nextPeriodEnd = new Date(nextPeriodStart);
    
        if (filterType === 'Week') {
            nextPeriodEnd.setDate(nextPeriodStart.getDate() + 6); // Next week (7 days)
        } else if (filterType === 'Month') {
            nextPeriodEnd = new Date(nextPeriodStart.getFullYear(), nextPeriodStart.getMonth() + 1, 0); // End of next month
        } else if (filterType === 'Quarter') {
            nextPeriodEnd = new Date(nextPeriodStart.getFullYear(), this.getQuarterStartMonth(nextPeriodStart.getMonth()) + 3, 0); // End of next quarter
        }
    
        // Map over the schedules and add flags for the periods
        this.filteredSchedules = this.examSchedules.map(schedule => {
            const scheduledDate = new Date(schedule.Scheduled_Date__c);
            const isInCurrentPeriod = scheduledDate >= startDate && scheduledDate <= endDate;
            const isInNextPeriod = scheduledDate >= nextPeriodStart && scheduledDate <= nextPeriodEnd;
            
            // Ongoing check (schedule is ongoing if its date is after the current period)
            const isOngoing = scheduledDate > endDate && !isInNextPeriod;
    
            // Create a new schedule object with the added flags
            return {
                ...schedule,
                isInCurrentPeriod, 
                isInNextPeriod,  // Flag for Next Period
                isOngoing // Flag for Ongoing, ensuring it doesn't overlap with Next Period
            };
        });
    
        this.updateDateRanges(startDate, endDate, filterType);
    }
    
    updateDateRanges(startDate, endDate, filterType) {
        const periodString = `${this.formatDate(startDate)} - ${this.formatDate(endDate)}`;
        this.currentPeriodRange = `(${periodString})`;
    
        // Calculate the next period's start and end dates
        const nextPeriodStart = new Date(endDate);
        nextPeriodStart.setDate(endDate.getDate() + 1); // Start next period
        let nextPeriodEnd = new Date(nextPeriodStart);
    
        if (filterType === 'Week') {
            nextPeriodEnd.setDate(nextPeriodStart.getDate() + 6); // End of the next week
        } else if (filterType === 'Month') {
            nextPeriodEnd = new Date(nextPeriodStart.getFullYear(), nextPeriodStart.getMonth() + 1, 0); // End of the next month
        } else if (filterType === 'Quarter') {
            nextPeriodEnd = new Date(nextPeriodStart.getFullYear(), this.getQuarterStartMonth(nextPeriodStart.getMonth()) + 3, 0); // End of the next quarter
        }
    
        this.nextPeriodRange = `(${this.formatDate(nextPeriodStart)} - ${this.formatDate(nextPeriodEnd)})`;
    
        // Ongoing Period starts after the next period
        const ongoingStart = new Date(nextPeriodEnd);
        ongoingStart.setDate(nextPeriodEnd.getDate() + 1);
        this.ongoingPeriodRange = `(Due Date - ${this.formatDate(ongoingStart)})`;
    }
    
    // Helper function to format the date as "Month Day" (e.g., "November 18")
    formatDate(date) {
        const options = { month: 'short', day: 'numeric' }; // Month as full name, day as numeric
        return new Intl.DateTimeFormat('en-US', options).format(date);
    }

    // Refresh function to reset the filter and show all data
    handleRefresh() {
        // Apply the default Week filter
        const today = new Date();
        const startOfWeek = this.getStartOfWeek(today); // Custom function to get the start of the week
        const endOfWeek = this.getEndOfWeek(today); // Custom function to get the end of the week

        // Call applyFilter to reload data for the current week
        this.applyFilter(startOfWeek, endOfWeek, 'Week');

        // Refresh the wire service
        refreshApex(this.wiredTrainingProgram);
    }

    // Helper function to get the start of the week (Sunday by default)
    getStartOfWeek(date) {
        const day = date.getDay();
        const diff = date.getDate() - day + (day === 0 ? -6 : 0); // Adjust for Sunday
        const startOfWeek = new Date(date.setDate(diff));
        startOfWeek.setHours(0, 0, 0, 0); // Ensure the time is at midnight
        return startOfWeek;
    }
}
