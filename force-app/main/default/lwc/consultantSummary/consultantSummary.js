import { LightningElement, api, wire, track } from 'lwc';
import { NavigationMixin } from 'lightning/navigation';
import { ShowToastEvent } from 'lightning/platformShowToastEvent'; 
import { CloseActionScreenEvent } from 'lightning/actions';
import getProjectdetails from '@salesforce/apex/ProjectController.getProjectdetails';

export default class ConsultantSummary extends NavigationMixin(LightningElement) {
    @api recordId;
    project  = '';
    @track searchKey = '';
    @track _searchKey = '';
    @track assignedToId = '';
    @track selectedConsultant = '';
    @track searchResults = [];
    @track isLoading = false;
    @track isModalView = false;
    @track isEditingProject = false;
    consultants = [];

    @wire(getProjectdetails, {projectId : '$recordId'})
    wiredConsultant({error, data}){
        console.log('Consultant Data', data)
        if(data){
            this.project = data.project;
            this.consultants = data.consultants;
        }else if(error){
            console.error('Error fetching data:', error); 
            this.error = error;
        }
    }

    handleView(event) {
        const consultantId = event.target.dataset.id;
        this.selectedConsultant = this.consultants.find(consultant => consultant.Id === consultantId);
        this.interviews = this.selectedConsultant?.Interviewers__r || [];
        this.isModalView = true;
    }

    editProject() {
        this.isEditingProject = true;
    }

    handleProjectChange(event) {
        this.selectedConsultant.Project__c = event.target.value;
    }

    handleCancel() {
        this.dispatchEvent(new CloseActionScreenEvent());

    }
    closeModal() {
        this.isModalView = false;
        this.isEditingProject = false; // Reset editing mode
    }

    showToast(title, message, variant) {
        this.dispatchEvent(new ShowToastEvent({ title, message, variant }));
    }
}