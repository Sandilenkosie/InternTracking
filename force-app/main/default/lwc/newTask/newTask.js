import { LightningElement, api, wire, track } from 'lwc';
import { NavigationMixin } from 'lightning/navigation';
import { ShowToastEvent } from 'lightning/platformShowToastEvent'; 
import { CloseActionScreenEvent } from 'lightning/actions';
import getTrainingProgramDetails from '@salesforce/apex/TrainingProgramController.getTrainingProgramDetails';
import addNewTask from '@salesforce/apex/TrainingProgramController.addNewTask';

export default class NewTaskCreation extends NavigationMixin(LightningElement) {
    @api recordId;
    trainingProgram  = [];
    @track searchKey = '';
    @track assignedToId = '';
    @track selectedInterns = [];
    @track phaseOptions = [];
    @track searchResults = [];
    @track isLoading = false;

    phases = [];
    interns = [];

    @wire(getTrainingProgramDetails, { trainingProgramId: '$recordId' })
    wiredTrainingProgram({ error, data }) {
        if (data) {
            console.log('Training Program Data:', data);  // Log the data to check if interns are fetched
            this.trainingProgram = data.trainingProgram;
            this.phases = data.phases;
            this.interns = data.interns;
            

            this.phaseOptions = [{ label: 'None', value: 'None' },
                                ...data.phases.map(phase => ({ 
                                    label: phase.Name, value: phase.Id }))
                                ];

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

    createNewTask() {
        const taskName = this.template.querySelector('[data-id="taskName"]').value;
        const phaseId = this.template.querySelector('[data-id="phaseId"]').value;
        const dueDate = this.template.querySelector('[data-id="dueDate"]').value;
        const startDate = this.template.querySelector('[data-id="startDate"]').value;
        const completion = this.template.querySelector('[data-id="completion"]').value;
        const milestone = this.template.querySelector('[data-id="milestone"]').value;
        const assignedTo = this.selectedInterns.map(intern => intern.User__c);

        if (!taskName || !phaseId || !dueDate || !startDate || !completion || assignedTo.length === 0) {
            this.showToast('Error', 'All fields are required.', 'error');
            return;
        }

        this.isLoading = true;

        addNewTask({ taskName, phaseId, assignedTo, dueDate, completion, startDate, milestone })
            .then(() => {
                this.showToast('Success', 'Task created successfully.', 'success');
                this.resetForm();
            })
            .catch(error => {
                console.error('Error creating task:', error);
                this.showToast('Error', error.body?.message || 'Failed to create task.', 'error');
            })
            .finally(() => {
                this.isLoading = false;
            });
    }

    resetForm() {
        this.template.querySelectorAll('lightning-input, lightning-combobox').forEach(input => (input.value = ''));
        this.selectedInterns = [];
        this.searchResults = [];
    }
    handleCancel() {
        this.dispatchEvent(new CloseActionScreenEvent());

    }
    

    showToast(title, message, variant) {
        this.dispatchEvent(new ShowToastEvent({ title, message, variant }));
    }
}
