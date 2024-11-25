import { LightningElement, api, wire, track } from 'lwc';
import { NavigationMixin } from 'lightning/navigation';
import { ShowToastEvent } from 'lightning/platformShowToastEvent'; 
import { CloseActionScreenEvent } from 'lightning/actions';
import getProgramDetails from '@salesforce/apex/TrainingProgramController.getProgramDetails';

export default class Program extends NavigationMixin(LightningElement) {
    @api recordId;
    program  = [];
    @track searchKey = '';
    @track certificateId = '';
    @track selectedCertificates = [];
    @track searchResults = [];
    @track isLoading = false;
    @track isshow = false;

    certificates = [];

    @wire(getProgramDetails, { programId: '$recordId' })
    wiredTrainingProgram({ error, data }) {
        if (data) {
            console.log('Program Data:', data);  // Log the data to check if interns are fetched
            this.program = data.program;
            this.certificates = data.certificates;

        } else if (error) {
            console.error('Error fetching data:', error);  // Log the error if there's an issue
            this.error = error;
        }
    }


    handleSearch(event) {
        this.searchKey = event.target.value.toLowerCase();
        console.log('Search Key:', this.searchKey);
        if (this.searchKey) {
            this.searchResults = this.certificates.filter(certificate => {
                // Check if intern.User__r and Name are defined and contain searchKey
                const nameMatches = certificate.Id && certificate.Name && 
                certificate.Certification__c.toLowerCase().includes(this.searchKey );
    
                console.log('Name Match:', intern.Certification__c, nameMatches); // Debugging to check the filter logic
    
                return nameMatches;
            });
    
            console.log('Filtered Results:', this.searchResults); // Debugging: Check the filtered results
        } else {
            this.searchResults = [];
        }
    }
    selectCertifice(event) {
        this.certificateId = event.target.closest('li').dataset.id;
       const selectedcertificate = this.certificates.find(certificate => certificate.Id === this.certificateId);

       if (selectedcertificate && !this.selectedCertificates.some(certificate => certificate.Id === this.certificateId)) {
           this.selectedCertificates = [...this.selectedCertificates, selectedIntern];
       }

       this.searchKey = '';
       this.searchResults = [];
   }

   removeSelectedCertifice(event) {
       this.certificateId = event.target.closest('button').dataset.id;
       this.selectedCertificates = this.selectedCertificates.filter(certificate => certificate.Id !== this.certificateId);
   }

    createNewTask() {
        const taskName = this.template.querySelector('[data-id="taskName"]').value;
        const dueDate = this.template.querySelector('[data-id="dueDate"]').value;
        const startDate = this.template.querySelector('[data-id="startDate"]').value;
        const completion = this.template.querySelector('[data-id="completion"]').value;
        const milestone = this.template.querySelector('[data-id="milestone"]').checked
        const assignedTo = this.selectedInterns.map(intern => intern.User__c);
        const phaseID = this.selectedInterns.Id;

        if (!taskName || !phaseId || !dueDate || !startDate || !completion || assignedTo.length === 0) {
            this.showToast('Error', 'All fields are required.', 'error');
            return;
        }

        this.isLoading = true;

        addNewTask({ taskName, phaseId, assignedTo, dueDate, completion, startDate, milestone })
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
