import { LightningElement, track, wire } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';  // Add this import
import getTasks from '@salesforce/apex/TaskFilterController.getTasks';
import getPhases from '@salesforce/apex/TaskFilterController.getPhases';
import getAssignedTo from '@salesforce/apex/TaskFilterController.getAssignedTo';
import getStatusOptions from '@salesforce/apex/TaskFilterController.getStatusOptions';
import updateTaskStatus from '@salesforce/apex/TaskFilterController.updateTaskStatus';

export default class TrainingProgramFilter extends LightningElement {
    @track tasks = [];
    @track selectedPhase = 'All';
    @track selectedStatus = 'All';
    @track selectedAssignedTo = 'All';
    @track statusOptions = [];
    @track phaseOptions = [];
    @track assignedToOptions = [];
    @track columns = [
        { label: 'Name', fieldName: 'Name' },
        { label: 'Status', fieldName: 'Status__c' },
        { label: 'Assigned To', fieldName: 'Owner.Name' },
        { label: 'Start Date', fieldName: 'Start_Date__c', type: 'date' },
        { label: 'Due Date', fieldName: 'Due_Date__c', type: 'date' }
    ];
    
    @track isModalOpen = false;  // Controls modal visibility
    @track selectedTasks = [];   // Stores selected task IDs
    @track newStatus = '';       // Stores the new status to apply

    // Fetch Phases
    @wire(getPhases)
    wiredPhases({ error, data }) {
        if (data) {
            this.phaseOptions = [{ label: 'All', value: 'All' }, ...data.map(phase => ({
                label: phase.Name,
                value: phase.Id
            }))];
        } else if (error) {
            console.error(error);
        }
    }

    // Fetch Status Options
    @wire(getStatusOptions)
    wiredStatusOptions({ error, data }) {
        if (data) {
            this.statusOptions = [{ label: 'All', value: 'All' }, ...data.map(status => ({
                label: status,
                value: status
            }))];
        } else if (error) {
            console.error(error);
        }
    }

    // Fetch Assigned Users
    @wire(getAssignedTo)
    wiredAssignedTo({ error, data }) {
        if (data) {
            this.assignedToOptions = [{ label: 'All', value: 'All' }, ...data.map(user => ({
                label: user.Name,
                value: user.Id
            }))];
        } else if (error) {
            console.error(error);
        }
    }

    // Fetch Tasks
    loadTasks() {
        getTasks({
            phaseId: this.selectedPhase,
            status: this.selectedStatus,
            assignedToId: this.selectedAssignedTo
        }).then(result => {
            this.tasks = result;
        }).catch(error => {
            console.error(error);
        });
    }

    // Handle Phase, Status, and Assigned To Filters
    handlePhaseChange(event) {
        this.selectedPhase = event.detail.value;
        this.loadTasks();
    }

    handleStatusChange(event) {
        this.selectedStatus = event.detail.value;
        this.loadTasks();
    }

    handleAssignedToChange(event) {
        this.selectedAssignedTo = event.detail.value;
        this.loadTasks();
    }

    // Handle Task Row Selection
    handleRowSelection(event) {
        const selectedRows = event.detail.selectedRows;
        this.selectedTasks = selectedRows.map(row => row.Id);
    }

    // Open Modal for Status Change
    handleOpenModal() {
        if (this.selectedTasks.length === 0) {
            alert('Please select tasks to update.');
            return;
        }
        this.isModalOpen = true;  // Open the modal
    }

    // Handle Status Change in Modal
    handleStatusChangeInModal(event) {
        this.newStatus = event.detail.value;
    }

    // Save Status Update
    saveStatus() {
        if (!this.newStatus) {
            alert('Please select a status.');
            return;
        }

        updateTaskStatus({
            taskIds: this.selectedTasks,
            newStatus: this.newStatus
        })
        .then(() => {
            this.showToast('Success', 'Status updated successfully.', 'success');
            this.isModalOpen = false; // Close the modal
            this.loadTasks(); // Refresh task data
        })
        .catch(error => {
            // Check if error.body exists and has a message property
            let errorMessage = 'An unknown error occurred';
            if (error && error.body && error.body.message) {
                errorMessage = error.body.message;
            } else if (error && error.message) {
                // If error doesn't have body.message, use error.message
                errorMessage = error.message;
            }
            
            this.showToast('Error', `Error updating status: ${errorMessage}`, 'error');
        });
    }

    // Close Modal
    closeModal() {
        this.isModalOpen = false;
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

    // Initialize Tasks
    connectedCallback() {
        this.loadTasks();
    }
}
