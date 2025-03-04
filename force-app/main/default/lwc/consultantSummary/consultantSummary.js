import { LightningElement, api, wire, track } from 'lwc';
import { NavigationMixin } from 'lightning/navigation';
import { ShowToastEvent } from 'lightning/platformShowToastEvent'; 
import { CloseActionScreenEvent } from 'lightning/actions';
import getProjectdetails from '@salesforce/apex/ProjectController.getProjectdetails';
import saveConsultantAndInterview from '@salesforce/apex/ProjectController.saveConsultantAndInterview';
import { getRecord } from 'lightning/uiRecordApi';

const FIELDS = ['Project__r.Name'];

export default class ConsultantSummary extends NavigationMixin(LightningElement) {
    @api recordId;
    recordName;
    @track project = '';
    @track searchKey = '';
    @track projectId = '';
    @track selectedProject = null; // Ensure this is an object, not an array
    @track searchResults = [];
    @track isLoading = false;
    @track isshow = false;
    @track isModalView = false;
    @track isEditingProject = false;
    @track selectedConsultant = '';
    consultants = [];
    interviews = [];
    projects = [];
    @track StatusOptions = [
        { label: '--None--', value: '' },
        { label: 'Poorly', value: 'Poorly' },
        { label: 'Good', value: 'Good' },
        { label: 'Excellent', value: 'Excellent' },
    ];

    // Fetch project details
    @wire(getProjectdetails, { projectId: '$recordId'})
    wiredConsultant({ error, data }) {
        if (data) {
            this.project = data.project;
            this.projects = data.projects;
            this.consultants = data.consultants;
        } else if (error) {
            console.error('Error fetching data:', error); 
            this.error = error;
        }
    }

    @wire(getRecord, { recordId: '$recordId', fields: FIELDS })
    wiredRecord({ error, data }) {
        if (data) {
            this.recordName = data.fields.Name.value;
        } else if (error) {
            console.error('Error fetching data:', error);
            this.error = error;
        }
    }

    get processedInterviews() {
        if (!this.interviews) {
            return [];
        }

        const today = new Date();

        console.log(today)

        return this.interviews.map((interview) => {
            const interviewDate = new Date(interview.Date__c);
            console.log(interviewDate)

            return {
                ...interview,
                isValid: interviewDate < today, 
            };
        });
    }

    handleSearch(event) {
        this.searchKey = event.target.value.toLowerCase();
        if (this.searchKey) {
            this.searchResults = this.projects.filter(project => {
                return project.Name.toLowerCase().includes(this.searchKey);
            });
        } else {
            this.searchResults = [];
        }
    }

    selectProject(event) {
        this.projectId = event.target.closest('li').dataset.id;
        this.selectedProject = this.projects.find(project => project.Id === this.projectId);

        if (this.selectedProject) {
            this.searchResults = [];
            this.searchKey = ''; // Clear search key
            this.isshow = true;
        }
    }

    removeselectedProject(event) {
        const button = event.target.closest('button');
        const projectId = button ? button.dataset.id : null;

        if (projectId && this.selectedProject && this.selectedProject.Id === projectId) {
            this.selectedClient = null;
            this.isshow = false;
        } 
    }

    // View modal for a selected consultant
    handleView(event) {
        const consultantId = event.target.dataset.id;

        this.selectedConsultant = this.consultants.find(consultant => consultant.Id === consultantId);
        this.interviews = this.selectedConsultant?.Interviewers__r || [];
        this.isModalView = true;
    }

    // Enable project editing
    editProject() {
        this.isEditingProject = true;
    }

    // Handle project changes
    handleProjectChange(event) {
        const newProjectValue = event.target.value;
        
        if (this.selectedConsultant) {
            // Update the selected consultant's project
            this.selectedConsultant.Project__c = newProjectValue;

            // Update the interviews associated with this consultant
            this.interviews.forEach(interview => {
                interview.Status__c = newProjectValue;
                interview.Interview_Feedback__c = newProjectValue;
            });
        }
    }

    handleSaveChanges() {
        const projectId = this.recordId;
        const statusField = this.template.querySelector('[data-id="status"]');
        const feedbackField = this.template.querySelector('[data-id="feedback"]');
        
        const status = statusField ? statusField.value.trim() : '';
        const feedback = feedbackField ? feedbackField.value.trim() : '';
        
        // Validate the data before calling Apex
        if (!projectId || !status || !feedback) {
            this.showToast('Error', 'Please fill in all fields', 'error');
            return;
        }
    
        // Ensure interviews is an array
        const interviewsToSave = Array.isArray(this.interviews) ? this.interviews : [];
    
        // Prepare the interviews data array to pass to Apex
        const interviewsData = interviewsToSave.map(interview => ({
            Id: interview.Id,                      // Assuming each interview has an Id field
            Status__c: status,                     // Status to save
            Interview_Feedback__c: feedback,       // Feedback to save
            Consultant__c: interview.Consultant__c  // Include Consultant__c to find User__c
        }));
    
        // Call Apex to save data
        saveConsultantAndInterview({ 
            projectId: projectId, 
            interviewsData: JSON.stringify(interviewsData)  // Convert to JSON string for Apex
        })
        .then(() => {
            this.showToast('Success', 'Data saved successfully!', 'success');
            this.isEditingProject = false;
        })
        .catch(error => {
            const errorMessage = error.body?.message || error.message || 'An error occurred';
            this.showToast('Error', errorMessage, 'error');
        });
    }
    
    
    
    

    // Handle cancel and close modal
    handleCancel() {
        this.dispatchEvent(new CloseActionScreenEvent());
    }

    closeModal() {
        this.isModalView = false;
        this.isEditingProject = false; // Reset editing mode
    }

    // Show toast messages
    showToast(title, message, variant) {
        this.dispatchEvent(new ShowToastEvent({ title, message, variant }));
    }
}
