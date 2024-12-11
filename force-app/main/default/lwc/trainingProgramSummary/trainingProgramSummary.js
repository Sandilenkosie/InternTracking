import { LightningElement, api, wire, track } from 'lwc';
import { NavigationMixin } from 'lightning/navigation';
import { ShowToastEvent } from 'lightning/platformShowToastEvent'; 
import getTrainingProgramDetails from '@salesforce/apex/TrainingProgramController.getTrainingProgramDetails';
import savePerformanceRatingApex from '@salesforce/apex/TrainingProgramController.savePerformanceRatingApex';

export default class TrainingProgramSummary extends NavigationMixin(LightningElement) {
    @api recordId;
    @api selectedSchedule;
    trainingProgram;
    phases = [];
    interns = [];
    examSchedules = [];
    filteredSchedules = [];
    milestones = [];
    error;
    selectedFilter = 'Week';
    currentPeriodRange = '';
    nextPeriodRange = '';
    ongoingPeriodRange = '';

    @track selectedInternId = '';
    @track selectedIntern = {};
    @track selectedInternUpdate = {}
    @track internOptions = [];
    @track phaseOptions = [];
    @track isLoading = false;
    isMilestoneOpen = false;
    isModalView = false;
    @track isEditing = false;
    @track assignedTo = [];
    

    @track showModal = false; // Modal visibility
    @track goalAchieved = false; // Checkbox state
    @track performanceRatingFormatted = 0;
    @track RatingIntern = '';
    signOffValue = ''; // Holds the selected value
    @track searchKey = '';
    @track internId = '';
    @track selectedIntern = [];
    @track isshow = false;

    @track ratingOptions = [
        { label: '--None--', value: '' },
        { label: '★', value: 'Needs Improvemen' },
        { label: '★★', value: 'Average' },
        { label: '★★★', value: 'Good' },
        { label: '★★★★', value: 'Very Good!' },
        { label: '★★★★★', value: 'Excellent' },
    ];

    // Wire function to fetch data
    @wire(getTrainingProgramDetails, { trainingProgramId: '$recordId' })
    wiredTrainingProgram({ error, data }) {
        if (data) {
            console.log('Training Program Data:', data);  // Log the data to check if interns are fetched
            this.trainingProgram = data.trainingProgram;
            this.phases = data.phases;
            this.interns = data.interns;
            this.milestones = this.extractMilestones(data.phases);
            this.examSchedules = data.examSchedules;
            this.filteredSchedules = data.examSchedules;
            
            

            // Create options for the intern filter combobox
            this.internOptions = [
                { label: 'All Interns', value: '' },
                ...data.interns.map(intern => ({
                    label: intern.Name, 
                    value: intern.User__c
                }))
            ];

            this.phaseOptions = [{ label: '--None--', value: '' },
                                ...data.phases.map(phase => ({ 
                                    label: phase.Name, value: phase.Id }))
                                ];
            

            // Apply Week filter by default after fetching data
            this.handleWeekFilter();
        } else if (error) {
            console.error('Error fetching data:', error);  // Log the error if there's an issue
            this.error = error;
        }
    }

    handleSearch(event) {
        this.searchKey = event.target.value.toLowerCase();
        console.log('Search Key:', this.searchKey);
        if (this.searchKey) {
            this.searchResults = this.interns.filter(intern => {
                // Check if intern.User__r and Name are defined and contain searchKey
                const nameMatches = intern.User__r && intern.Name && 
                    intern.User__r.Name.toLowerCase().includes(this.searchKey );
    
                return nameMatches;
            });
        } else {
            this.searchResults = [];
        }
    }
    selectIntern(event) {
        this.selectedInternId = event.target.closest('li').dataset.id;

        const selectedIntern = this.interns.find(intern => intern.User__c === this.selectedInternId);

        if (selectedIntern) {
            // Replace the current selection with the newly selected phase
            this.selectedIntern = selectedIntern;
        }
            // Re-apply the filter based on selected intern and current period
            this.applyFilter(this.getStartOfWeek(new Date()), this.getEndOfWeek(new Date()), this.selectedFilter);
            this.calculatePerformanceRating();
            if (this.performanceRatingFormatted === 100 && !this.selectedIntern.Goals_Achieved__c) {
                this.openModal();
            }

        this.searchKey = '';
        this.searchResults = [];
        this.isshow = true;
    }

    removeSelectedIntern(event) {
        // Safely get the selected intern ID from the event
        const button = event.target.closest('button'); // Ensure we target the button element
        const selectedInternId = button ? button.dataset.id : null;
        console.log('RemoveId: ', selectedInternId);
    
        if (!selectedInternId) {
            this.showToast('error', 'Unable to identify the intern to remove.', 'error');
            return;
        }
    
        // Check if the selected intern matches the current selected intern
        if (this.selectedIntern && this.selectedIntern.User__c === selectedInternId) {
            this.selectedIntern = null; // Clear the selected intern
            this.selectedInternId = ''; // Reset the selected intern ID
            this.isshow = false; // Update UI state
            this.showToast('success', 'Intern removed successfully.', 'success');
        } else {
            this.showToast('info', 'No matching intern found to remove.', 'info');
        }
    }
    

    calculatePerformanceRating() {
        let totalRating = 0;
    
        // Find the current intern
        const currentUserIntern = this.interns.find(intern => intern.User__c === this.selectedInternId);
        if (!currentUserIntern) {
            this.showToast('warning', 'Please select a valid intern.', 'warning');
            return;
        }
    
        // Validate and calculate performance from exams
        if (Array.isArray(this.examSchedules)) {
            this.examSchedules.forEach(exam => {
                if (exam.Assigned_To__c === this.selectedInternId 
                    && exam.Exam_Result__c === 'Passed' 
                    && typeof exam.Completion__c === 'number') {
                    totalRating += exam.Completion__c;
                }
            });
        }
    
        // Validate and calculate performance from tasks in phases
        if (Array.isArray(this.phases)) {
            this.phases.forEach(phase => {
                if (Array.isArray(phase.Tasks1__r)) {
                    phase.Tasks1__r.forEach(task => {
                        if (task.Assigned_To__c === this.selectedInternId 
                            && task.Status__c === 'Completed' 
                            && typeof task.Completion__c === 'number') {
                            totalRating += task.Completion__c;
                        }
                    });
                }
            });
        }
    
        // Normalize performance rating to a maximum of 100
        this.performanceRatingFormatted = Math.min(Math.round(totalRating), 100);
    
        // Provide feedback to the user
        if (this.performanceRatingFormatted === 0) {
            this.showToast('info', 'No performance data available for the selected intern.', 'info');
        } else {
            this.showToast('success', `Performance rating calculated: ${this.performanceRatingFormatted}`, 'success');
        }
    }
    

        
    extractMilestones(phases) {
        let milestones = [];
        phases.forEach(phase => {
            if (Array.isArray(phase.Tasks1__r)) {  // Check if Tasks1__r is defined and is an array
                phase.Tasks1__r.forEach(task => {
                    if (task.Milestone__c) {
                        milestones.push({
                            Id: task.Id,
                            Name: task.Name,
                            Due_Date__c: task.Due_Date__c,
                        });
                    }
                });
            }
        });
        return milestones;
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
    get milestoneVariant(){
        return this.selectedFilter === 'Milestones' ? 'brand' : 'neutral';
    }

    handleMilestone() {
        this.isMilestoneOpen = true; // Updated method name
    }

    handleCloseModal() {
        this.isMilestoneOpen = false;
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

    applyFilter(startDate, endDate, filterType) {
        this.isLoading = true;
    
        let filteredSchedules = this.examSchedules;
    
        if (this.selectedInternId) {
            filteredSchedules = filteredSchedules.filter(schedule => schedule.Assigned_To__c === this.selectedInternId);
        }
    
        // Calculate next period start and end dates
        const { nextPeriodStart, nextPeriodEnd } = this.calculateNextPeriodDates(endDate, filterType);
    
        this.filteredSchedules = filteredSchedules.map(schedule => {
            const scheduledDate = new Date(schedule.Scheduled_Date__c);
    
            const isInCurrentPeriod = scheduledDate >= startDate && scheduledDate <= endDate;
            const isInNextPeriod = scheduledDate >= nextPeriodStart && scheduledDate <= nextPeriodEnd;
            const isOngoing = scheduledDate > nextPeriodEnd;
    
            // Set the badge class based on the Exam_Result__c
            let badgeClass = 'slds-badge'; // Default neutral badge class
            if (schedule.Exam_Result__c === 'Passed') {
                badgeClass = 'slds-badge slds-theme_success'; // Green for Passed
            } else if (schedule.Exam_Result__c === 'Failed') {
                badgeClass = 'slds-badge slds-theme_error'; // Red for Failed
            }
    
            return {
                ...schedule,
                isInCurrentPeriod,
                isInNextPeriod,
                isOngoing,
                formattedDate: this.formatDate(scheduledDate),
                badgeClass, // Add the computed badgeClass here
            };
        });
    
        this.updateDateRanges(startDate, endDate, filterType);
    
        setTimeout(() => {
            this.isLoading = false;
        }, 500);
    }
    
    // Calculate next period start and end dates
    calculateNextPeriodDates(endDate, filterType) {
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
    
        return { nextPeriodStart, nextPeriodEnd };
    }
    
    // Update date ranges for the current, next, and ongoing periods
    updateDateRanges(startDate, endDate, filterType) {
        const periodString = `${this.formatDate(startDate)} - ${this.formatDate(endDate)}`;
        this.currentPeriodRange = `(${periodString})`;
    
        // Get the next period dates
        const { nextPeriodStart, nextPeriodEnd } = this.calculateNextPeriodDates(endDate, filterType);
    
        this.nextPeriodRange = `(${this.formatDate(nextPeriodStart)} - ${this.formatDate(nextPeriodEnd)})`;
    
        // Ongoing period
        const ongoingStart = new Date(nextPeriodEnd);
        ongoingStart.setDate(nextPeriodEnd.getDate() + 1);
        this.ongoingPeriodRange = `(Due After ${this.formatDate(ongoingStart)})`;
    }
    

    // Format date for display
    formatDate(date) {
        const options = { month: 'short', day: 'numeric' };
        return date.toLocaleDateString('en-US', options);
    }


    handleSearch(event) {
        this.searchKey = event.target.value.toLowerCase();
        console.log('Search Key:', this.searchKey);
        if (this.searchKey) {
            this.searchResults = this.interns.filter(intern => {
                // Check if intern.User__r and Name are defined and contain searchKey
                const nameMatches = intern.User__r && intern.Name && 
                    intern.User__r.Name.toLowerCase().includes(this.searchKey );
    
    
                return nameMatches;
            });
    
        } else {
            this.searchResults = [];
        }
    }

    // Open modal
    openModal() {
        this.showModal = true;
    }

    // Close modal
    closeModal() {
        this.showModal = false;
        this.isModalView = false;
    }



    // Save updatePerfomances
    updatePerfomances() {
        const internId = this.selectedIntern.Id;
        const goalsAchieved = this.template.querySelector('[data-id="goalsAchieved"]').checked;
        const rating = this.template.querySelector('[data-id="rating"]').value;
        const note = this.template.querySelector('[data-id="note"]').value;
        const trainingProgress = this.performanceRatingFormatted


        savePerformanceRatingApex({
            internId: internId,
            goalsAchieved: goalsAchieved,
            rating: rating,
            note: note,
            trainingProgress: trainingProgress
        })
            .then(() => {
                this.showToast('Success', 'Goal Achieved updated successfully.', 'success');
                this.closeModal();
            })
            .catch(error => {
                const errorMessage = error.body ? error.body.message : 'Unknown error occurred';
                this.showToast('Error', 'Error saving Performances: ','error');
            });
    }

    handleEdit(event) {
        const scheduleId = event.target.dataset.id;
        this[NavigationMixin.Navigate]({
            type: 'standard__recordPage',
            attributes: {
                recordId: scheduleId,
                objectApiName: 'Exam_Schedule__c', // Replace with your object API name
                actionName: 'edit'
            }
        });
    }
    handleView(event) {
        const scheduleId = event.target.dataset.id;
        this.selectedSchedule = this.filteredSchedules.find(schedule => schedule.Id === scheduleId);
        this.isModalView = true;
    }

    // Handle reset (refresh)
    handleRefresh() {
        this.selectedInternId = ''; // Reset the intern filter
        this.handleWeekFilter();
        this.isLoading = true;
        this.applyFilter(this.getStartOfWeek(new Date()), this.getEndOfWeek(new Date()), this.selectedFilter); // Re-apply filter for the current period
        
    }
    
    // Show Toast Notification
    showToast(title, message, variant) {
        const event = new ShowToastEvent({
            title: title,
            message: message,
            variant: variant
        });
        this.dispatchEvent(event);
    }
}
