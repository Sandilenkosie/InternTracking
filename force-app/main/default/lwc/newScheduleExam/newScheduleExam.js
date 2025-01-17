import { LightningElement, api, wire, track } from 'lwc';
import { NavigationMixin } from 'lightning/navigation';
import { ShowToastEvent } from 'lightning/platformShowToastEvent'; 
import { CloseActionScreenEvent } from 'lightning/actions';
import getTrainingProgramDetails from '@salesforce/apex/TrainingProgramController.getTrainingProgramDetails';
import addNewschedule from '@salesforce/apex/TrainingProgramController.addNewschedule';
import getTraining from '@salesforce/apex/TrainingProgramController.getTraining';

export default class NewTaskCreation extends NavigationMixin(LightningElement) {
    @api recordId;
    trainingProgram  = [];
    @track searchKey = '';
    @track assignedToId = '';
    @track selectedInterns = [];
    @track phaseOptions = [];
    @track searchResults = [];
    @track isLoading = false;
    @track locationOptions = [
        { label: '--None--', value: '' },
        { label: 'On-Site', value: 'On-Site' },
        { label: 'Exam center', value: 'Exam center' },
    ];

    trainingOptions = [];
    interns = [];

    @wire(getTrainingProgramDetails, { trainingProgramId: '$recordId' })
    wiredTrainingProgram({ error, data }) {
        if (data) {
            this.interns = data.interns;

        } else if (error) {
            console.error('Error fetching data:', error);
            this.error = error;
        }
    }

    @wire(getTraining)
    wiredTraining({ error, data }) {
        if (data) {
            console.log('Training Program Data:', data);
            
            // Ensure trainingProgram is always an array
            this.trainingProgram = data.trainingProgram || [];
            console.log('Processed Interns:', this.trainingProgram);
            this.trainingOptions = [
                { label: '--None--', value: '' },
                ...data.map(training => ({
                    label: training.Name,
                    value: training.Id
                }))
            ];
        } else if (error) {
            console.error('Error fetching data:', error);
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
    
                console.log('Name Match:', intern.User__r.Name, nameMatches); // Debugging to check the filter logic
    
                return nameMatches;
            });
    
            console.log('Filtered Results:', this.searchResults); // Debugging: Check the filtered results
        } else {
            this.searchResults = [];
        }
    }

    selectIntern(event) {
         this.assignedToId = event.target.closest('li').dataset.id;
        const selectedIntern = this.interns.find(intern => intern.User__c === this.assignedToId);

        if (selectedIntern && !this.selectedInterns.some(intern => intern.User__c === this.assignedToId)) {
            this.selectedInterns = [...this.selectedInterns, selectedIntern];
        }

        this.searchKey = '';
        this.searchResults = [];
    }

    removeSelectedIntern(event) {
        this.assignedToId = event.target.closest('button').dataset.id;
        this.selectedInterns = this.selectedInterns.filter(intern => intern.User__c !== this.assignedToId);
    }

    newScheduleExam() {
        const examName = this.template.querySelector('[data-id="examName"]').value;
        const traingId = this.template.querySelector('[data-id="traingId"]').value;
        const scheduleDate = this.template.querySelector('[data-id="scheduleDate"]').value;
        const completion = 30;
        const location = this.template.querySelector('[data-id="location"]').value
        const assignedTo = this.selectedInterns.map(intern => intern.User__c);

        if (!examName || !traingId || !scheduleDate || !location || !completion || assignedTo.length === 0) {
            this.showToast('Error', 'All fields are required.', 'error');
            return;
        }

        this.isLoading = true;

        addNewschedule({ examName, traingId, scheduleDate, location, completion, assignedTo })
            .then(() => {
                this.showToast('Success', 'Task created successfully.', 'success');
                this.handleCancel();
            })
            .catch(error => {
                console.error('Error creating task:', error);
                this.showToast('Error', error.body?.message || 'Failed to create task.', 'error');
            })
            .finally(() => {
                this.isLoading = false;
            });
    }

    handleCancel() {
        this.dispatchEvent(new CloseActionScreenEvent());

    }
    

    showToast(title, message, variant) {
        this.dispatchEvent(new ShowToastEvent({ title, message, variant }));
    }
}
