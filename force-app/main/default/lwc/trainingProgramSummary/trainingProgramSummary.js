import { LightningElement, api, wire } from 'lwc';
import getTrainingProgramDetails from '@salesforce/apex/TrainingProgramController.getTrainingProgramDetails';

export default class TrainingProgramSummary extends LightningElement {
    @api recordId;
    trainingProgram;
    phases = [];
    interns = [];
    examSchedules = [];
    error;
    selectedFilter = 'All'; // Default filter state

    // Columns for DataTable: These will display the Phase details along with nested Task details
    columns = [
        { label: 'Phase Name', fieldName: 'Name', type: 'text' },
        { label: 'Status', fieldName: 'Status__c', type: 'text' },
        { label: 'Completion', fieldName: 'Phase_Completion__c', type: 'number' },
        { label: 'Task Name', fieldName: 'Task_Name', type: 'text' },
        { label: 'Task Status', fieldName: 'Task_Status', type: 'text' },
        { label: 'Assigned To', fieldName: 'Assigned_To', type: 'text' },
        { label: 'Due Date', fieldName: 'Due_Date', type: 'date' }
    ];

    // Transform phase data to include task information
    get phaseData() {
        let phaseRows = [];

        this.phases.forEach(phase => {
            // Add Phase as a row
            phaseRows.push({
                Id: phase.Id,
                Name: phase.Name,
                Status__c: phase.Status__c,
                Phase_Completion__c: phase.Phase_Completion__c,
                Task_Name: '', // Empty for the phase row
                Task_Status: '',
                Assigned_To: '',
                Due_Date: ''
            });

            // For each task in the phase, add a sub-row with task details
            if (phase.Tasks1__r) {
                phase.Tasks1__r.forEach(task => {
                    phaseRows.push({
                        Id: task.Id,
                        Name: phase.Name,
                        Status__c: phase.Status__c,
                        Phase_Completion__c: phase.Phase_Completion__c,
                        Task_Name: task.Name,
                        Task_Status: task.Status__c,
                        Assigned_To: task.Assigned_To__c,
                        Due_Date: task.Due_Date__c
                    });
                });
            }
        });

        return phaseRows;
    }

    // Wire function to fetch data
    @wire(getTrainingProgramDetails, { trainingProgramId: '$recordId' })
    wiredTrainingProgram({ error, data }) {
        if (data) {
            this.trainingProgram = data.trainingProgram;
            this.phases = data.phases;
            this.interns = data.interns;
            this.examSchedules = data.examSchedules;
        } else if (error) {
            this.error = error;
        }
    }

    // Handlers for filter actions
    handleWeekFilter() {
        this.selectedFilter = 'Week';
        // Add logic to filter data based on Week
        console.log('Filter by Week');
    }

    handleMonthFilter() {
        this.selectedFilter = 'Month';
        // Add logic to filter data based on Month
        console.log('Filter by Month');
    }

    handleQuarterFilter() {
        this.selectedFilter = 'Quarter';
        // Add logic to filter data based on Quarter
        console.log('Filter by Quarter');
    }

    handleRefresh() {
        // Refresh the data
        console.log('Refreshing Data');
        return refreshApex(this.data);
    }
}
