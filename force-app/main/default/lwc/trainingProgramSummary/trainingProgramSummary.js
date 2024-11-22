import { LightningElement, api, wire, track } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent'; 
import getTrainingProgramDetails from '@salesforce/apex/TrainingProgramController.getTrainingProgramDetails';
import savePerformanceRatingApex from '@salesforce/apex/TrainingProgramController.savePerformanceRatingApex';
import addNewTask from '@salesforce/apex/TrainingProgramController.addNewTask';

export default class TrainingProgramSummary extends LightningElement {
    @api recordId;
    trainingProgram;
    phases = [];
    interns = [];
    examSchedules = [];
    filteredSchedules = [];
    milestones = [];
    error;
    @track searchKey = '';
    selectedFilter = 'Week';
    currentPeriodRange = '';
    nextPeriodRange = '';
    ongoingPeriodRange = '';
    @track assignedToId = '';

    @track selectedInternId = '';
    @track selectedInternDetails = {};
    @track selectedInternUpdate = {}
    @track internOptions = [];
    @track phaseOptions = [];
    @track isLoading = false;
    isMilestoneOpen = false;
    @track searchResults = [];
    @track showResults = false;
    @track allInterns = [];
    selectedInterns = []; 
    

    @track showModal = false; // Modal visibility
    isTaskOpen = false;
    @track goalAchieved = false; // Checkbox state
    performanceRatingFormatted = 0;
    performanceRating = 0;
    @track RatingIntern = '';

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
                    label: intern.User__r.Name, 
                    value: intern.User__c
                }))
            ];

            this.phaseOptions = [{ label: 'None', value: 'None' },
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

    // Open the modal
    handleOpen() {
        this.isTaskOpen = true;
    }

    // Close the modal
    handleClose() {
        this.isTaskOpen = false;
    }

    handleSearch(event) {
        this.searchKey = event.target.value.toLowerCase();  // Normalize the search key
        console.log('Search Key:', this.searchKey);  // Log search input to ensure it's being captured
    
        if (this.searchKey) {
            this.searchResults = this.interns.filter(intern => {
                // Check if intern.User__r and Name are defined and contain searchKey
                const nameMatches = intern.User__r && intern.User__r.Name && 
                    intern.User__r.Name.toLowerCase().includes(this.searchKey );
    
                console.log('Name Match:', intern.User__r.Name, nameMatches); // Debugging to check the filter logic
    
                return nameMatches;
            });
    
            console.log('Filtered Results:', this.searchResults); // Debugging: Check the filtered results
        } else {
            // Reset to all interns if search key is empty
            this.searchResults = [...this.interns];
            console.log('No search, showing all interns:', this.searchResults); // Debugging
        }
    }

    createNewTask() {
        const taskName = this.template.querySelector('[data-id="taskName"]').value;
        const phaseId = this.template.querySelector('[data-id="phaseId"]').value;
        const assignedTo = this.assignedToId;
        const dueDate = this.template.querySelector('[data-id="dueDate"]').value;
        const completion = this.template.querySelector('[data-id="completion"]').value;
        const startDate = this.template.querySelector('[data-id="startDate"]').value;
        const onHold = this.template.querySelector('[data-id="onHold"]').value;
        const mileStone = this.template.querySelector('[data-id="mileStone"]').value;
        const signOff = this.template.querySelector('[data-id="signOff"]').value;
    
        if (!taskName || !phaseId || !assignedTo || !completion || !startDate || !dueDate) {
            this.showToast('Error', 'All fields are required.', 'error');
            return;
        }
    
        this.isLoading = true;
        addNewTask({ name: taskName, phaseId, assignedTo, dueDate, completion, startDate, onHold, mileStone, signOff })
            .then(() => {
                this.showToast('Success', 'Task created successfully.', 'success');
                this.handleRefresh(); // Optionally refresh the data
                this.handleClose(); // Close the modal
            })
            .catch(error => {
                console.error('Error creating task:', error);
                this.showToast('Error', 'Failed to create task.', 'error');
            })
            .finally(() => {
                this.isLoading = false;
            });
    }
    

    // Select an intern when clicked in the dropdown
    selectIntern(event) {
        this.assignedToId = event.target.getAttribute('data-id');

        console.log('Selected intern ID:', this.assignedToId); // Debugging step

        // Find the intern in the search results by matching the ID
        const selectedIntern = this.searchResults.find(intern => intern.Id === this.assignedToId);

        // Only add the intern if they are not already selected
        if (selectedIntern && !this.selectedInterns.some(intern => intern.Id === selectedIntern.Id)) {
            this.selectedInterns = [...this.selectedInterns, selectedIntern];
        }
    }

    // Remove an intern from the selectedInterns array (remove from pills)
    removeSelectedIntern(event) {
        const internId = event.target.closest('button').getAttribute('data-id');
        this.selectedInterns = this.selectedInterns.filter(intern => intern.Id !== internId);
    }
    


    
    

    
    calculatePerformanceRating() {
        let totalRating = 0;
    
        // Find the current intern
        const currentUserIntern = this.interns.find(intern => intern.User__c === this.selectedInternId);
        if (!currentUserIntern) {
            this.showToast('warning', 'Intern not found for the current user.', 'warning');
            return;
        }
    
        // Calculate performance from exams
        this.examSchedules.forEach(exam => {
            if (exam.Assigned_To__c === this.selectedInternId && exam.Exam_Result__c === 'Passed') {
                totalRating += exam.Completion__c;
            }
        });
    
        // Calculate performance from tasks
        this.phases.forEach(phase => {
            phase.Tasks1__r.forEach(task => {
                if (task.Assigned_To__c === this.selectedInternId && task.Status__c === 'Completed') {
                    totalRating += task.Completion__c;
                }
            });
        });
    
        // Normalize performance rating
        totalRating = Math.min(totalRating, 100);
        this.performanceRatingFormatted = Math.round(totalRating);
    
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
    
        this.filteredSchedules = filteredSchedules.map(schedule => {
            const scheduledDate = new Date(schedule.Scheduled_Date__c);
    
            const isInCurrentPeriod = scheduledDate >= startDate && scheduledDate <= endDate;
            const isOngoing = scheduledDate > endDate;
    
            // Set the badge class based on the Exam_Result__c
            let badgeClass = 'slds-badge'; // Default neutral badge class
            if (schedule.Exam_Result__c === 'Passed') {
                badgeClass = 'slds-badge slds-theme_success';  // Green for Passed
            } else if (schedule.Exam_Result__c === 'Failed') {
                badgeClass = 'slds-badge slds-theme_error';   // Red for Failed
            }
    
            return {
                ...schedule,
                isInCurrentPeriod,
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
        ) || {}
        // Re-apply the filter based on selected intern and current period
        this.applyFilter(this.getStartOfWeek(new Date()), this.getEndOfWeek(new Date()), this.selectedFilter);
        this.calculatePerformanceRating();
        if (this.performanceRatingFormatted === 40 && !this.goalAchieved) {
            this.openModal();
        }
    }

    // Open modal
    openModal() {
        this.showModal = true;
    }

    // Close modal
    closeModal() {
        this.showModal = false;
    }

    // Handle checkbox change
    handleGoalAchievedChange(event) {
        this.goalAchieved = event.target.checked;
    }

    // Save goal achieved
    updateGoalAchieved() {

        savePerformanceRatingApex({
            
            internId: this.selectedInternDetails.Id,
            goalsAchieved: this.goalAchieved,
            trainingProgress: this.performanceRatingFormatted
        })
            .then(() => {
                this.showToast('Success', 'Goal Achieved updated successfully.'+ this.RatingIntern.Id, 'success');
                this.closeModal();
            })
            .catch(error => {
                this.showToast('Error', 'Error saving goal achieved: ' + this.RatingIntern.Id, 'error');
            });
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
