import { LightningElement, track, wire } from 'lwc';
import { refreshApex } from '@salesforce/apex';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { NavigationMixin } from 'lightning/navigation';
import getTasks from '@salesforce/apex/TaskFilterController.getTasks';
import getPhases from '@salesforce/apex/TaskFilterController.getPhases';
import getAssignedTo from '@salesforce/apex/TaskFilterController.getAssignedTo';
import getStatusOptions from '@salesforce/apex/TaskFilterController.getStatusOptions';
import updateTaskStatus from '@salesforce/apex/TaskFilterController.updateTaskStatus';
import editTasks from '@salesforce/apex/TaskFilterController.editTasks';
import deleteTask from '@salesforce/apex/TaskFilterController.deleteTask';

export default class TrainingProgramFilter extends NavigationMixin(LightningElement) {
    @track tasks = [];
    @track selectedPhase = 'All';
    @track selectedStatus = 'All';
    @track statusOptions = [];
    @track phaseOptions = [];
    @track assignedToOptions = [];
    @track selectedAssignedTo = 'All';
    
    @track isLoading = false;
    columns = [
        { label: 'Phase', fieldName: 'phaseName', type: 'text' },
        { label: 'Name', fieldName: 'taskName' },
        { label: 'Status', fieldName: 'status' },
        { label: '% Completion', fieldName: 'completion' },
        { label: 'Start Date', fieldName: 'startDate', type: 'date' },
        { label: 'Due Date', fieldName: 'dueDate', type: 'date' },
        {
            label: 'Action',
            type: 'action',
            typeAttributes: {
                rowActions: [
                    { label: 'View', name: 'view', iconName: 'utility:preview' },
                    { label: 'Edit', name: 'edit', iconName: 'utility:edit' },
                    { label: 'Delete', name: 'delete', iconName: 'utility:delete' }
                ]
                
            }
        }
    ];


    @track isStatusOpen = false;
    @track selectedTasks = [];
    @track newStatus = '';
    @track showDeleteModal = false;
    @track recordIdToDelete;
    @track isAssigneeModalOpen = false; // Controls modal visibility
    @track selectedAssignee = '';       // Stores the new assignee ID

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
                label: user.User__r.Name,
                value: user.User__c
            }))];
        } else if (error) {
            console.error(error);
        }
    }

    @wire(editTasks)
    wiredTasks({ error, data }) {
        if (data) {
            this.tasks = data
        } else if (error) {
            this.showToast('Error', error.body.message, 'error');
        }
    }


    loadTasks() {
        this.isLoading = true;
        getTasks({ phaseId: this.selectedPhase, status: this.selectedStatus, assignedToId: this.selectedAssignedTo })
        .then(result => {
            this.tasks = result.map(task => ({
                taskId: task.Id,
                taskName: task.Name,
                phaseName: task.Phase__r.Name,
                status: task.Status__c,
                completion: task.Completion__c,
                startDate: task.Start_Date__c,
                dueDate: task.Due_Date__c
            }));
            this.isLoading = false;
        })
        .catch(error => {
            console.error(error);
            this.isLoading = false;
        });
    }

    handleRowSelection(event) {
        const selectedRows = event.detail.selectedRows; // Get the selected rows from the event
        if (selectedRows && selectedRows.length > 0) {
            this.selectedTasks = selectedRows.map(row => row.taskId); // Map the Ids of selected rows
        } else {
            this.selectedTasks = []; // Handle the case where no rows are selected
        }
        console.log('Selected Tasks:', this.selectedTasks);
    }
    
    
    // Handle row action (view, edit, delete)
    handleRowAction(event) {
        const actionName = event.detail.action.name;
        const row = event.detail.row;

        switch (actionName) {
            case 'view':
                this.navigateToTaskView(row.taskId);
                break;
            case 'edit':
                this.openEditModal(row.taskId);
                break;
            case 'delete':
                this.openDeleteModal(row.taskId);
                break;
            default:
                console.error(`Unknown action: ${actionName}`);
        }
    }

    navigateToTaskView(taskId) {
        this[NavigationMixin.Navigate]({
            type: 'standard__recordPage',
            attributes: {
                recordId: taskId,
                objectApiName: 'Tasks__c',
                actionName: 'view'
            }
        });
    }

    openEditModal(taskId) {
        this[NavigationMixin.Navigate]({
            type: 'standard__recordPage',
            attributes: {
                recordId: taskId,
                objectApiName: 'Tasks__c', // Replace with your object API name
                actionName: 'edit'
            }
        });
    }

    handleEditSuccess() {
        this.showToast('Success', 'Task updated successfully', 'success');
        this.loadTasks();
    }

    handleEditError(event) {
        this.showToast('Error', `An error occurred: ${event.detail.message}`, 'error');
    }

    openDeleteModal(recordId) {
        this.recordIdToDelete = recordId;
        this.showDeleteModal = true;
    }

    closeDeleteModal() {
        this.showDeleteModal = false;
        this.recordIdToDelete = null;
    }

    confirmDelete() {
        deleteTask({ taskId: this.recordIdToDelete })
            .then(() => {
                this.showToast('Success', 'Task deleted successfully.', 'success');
                this.closeDeleteModal();
                this.loadTasks();
            })
            .catch(error => {
                this.showToast('Error', `Error deleting task: ${error.body.message}`, 'error');
            });
    }
    
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


    handleOpenModal() {
        if (this.selectedTasks.length === 0) {
            this.showToast('Error', 'Please select tasks to update.', 'error');
            return;
        }
        this.isStatusOpen = true;
    }

    handleOpenAssigneeModal() {
        if (this.selectedTasks.length === 0) {
            this.showToast('Error', 'Please select tasks to change the assignee.', 'error');
            return;
        }
        this.isAssigneeModalOpen = true; // Open the modal
    }

    handleStatusChangeInModal(event) {
        this.newStatus = event.detail.value;
    }

    handleAssigneeChange(event) {
        this.selectedAssignee = event.detail.value; // Capture the selected assignee
    }

    saveAssigneeChange() {
        if (!this.selectedAssignee) {
            this.showToast('Error', 'Please select an assignee.', 'error');
            return;
        }
    
        // Call Apex to update the assignee
        updateTaskAssignee({
            taskIds: this.selectedTasks,
            newAssignee: this.selectedAssignee
        })
        .then(() => {
            this.showToast('Success', 'Assignee updated successfully.', 'success');
            this.isAssigneeModalOpen = false; // Close the modal
            this.loadTasks(); // Refresh task data
        })
        .catch(error => {
            this.showToast('Error', `Error updating assignee: ${error.body.message}`, 'error');
        });
    }

    saveStatus() {
        if (!this.newStatus) {
            this.showToast('Error', 'Please select a status.', 'error');
            return;
        }

        updateTaskStatus({ taskIds: this.selectedTasks, newStatus: this.newStatus })
            .then(() => {
                this.showToast('Success', 'Status updated successfully.', 'success');
                this.isStatusOpen = false;
                this.loadTasks();
            })
            .catch(error => {
                this.showToast('Error', `Error updating status: ${error.body?.message || 'Unknown error'}`, 'error');
            });
    }

    closeModal() {
        this.isStatusOpen = false;
        this.showTaskModal = false;
        this.recordIdToEdit = null;
        this.isAssigneeModalOpen = false
    }

    showToast(title, message, variant) {
        this.dispatchEvent(new ShowToastEvent({ title, message, variant }));
    }

    connectedCallback() {
        this.loadTasks();
    }

    handleRefresh() {
        this.selectedPhase = 'All';
        this.selectedStatus = 'All';
        this.selectedAssignedTo = 'All';
        this.loadTasks();
    }
}