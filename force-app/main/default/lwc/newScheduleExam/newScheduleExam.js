import { LightningElement, api, wire, track } from 'lwc';
import { NavigationMixin } from 'lightning/navigation';
import { ShowToastEvent } from 'lightning/platformShowToastEvent'; 
import { CloseActionScreenEvent } from 'lightning/actions';
import { getRecord } from 'lightning/uiRecordApi';
import getTrainingProgramDetails from '@salesforce/apex/TrainingProgramController.getTrainingProgramDetails';
import addNewschedule from '@salesforce/apex/TrainingProgramController.addNewschedule';

const FIELDS = ['Training_Program__r.Name'];

export default class NewTaskCreation extends NavigationMixin(LightningElement) {
    @api recordId;
    recordName;
    trainingProgram  = [];
    @track searchKey = '';
    @track _searchKey = '';
    @track assignedToId = '';
    @track certificateId = '';
    @track selectedInterns = [];
    @track selectedCertificate = '';
    @track phaseOptions = [];
    @track searchResults = [];
    @track _searchResults = [];
    @track isLoading = false;
    @track isshow = false;
    @track locationOptions = [
        { label: '--None--', value: '' },
        { label: 'On-Site', value: 'On-Site' },
        { label: 'Exam center', value: 'Exam center' },
    ];

    trainingOptions = [];
    program = {};

    @wire(getTrainingProgramDetails, { trainingProgramId: '$recordId' })
    wiredTrainingProgram({ error, data }) {
        if (data) {
            this.interns = data.interns;
            this.program = data.program;

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


    handleSearch(event) {
        this.searchKey = event.target.value.toLowerCase();
        console.log('Search Key:', this.searchKey);
        if (this.searchKey) {
            this.searchResults = this.program.Interns__r.filter(intern => {
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
        const selectedIntern = this.program.Interns__r.find(intern => intern.Id === this.assignedToId);

        if (selectedIntern && !this.selectedInterns.some(intern => intern.Id === this.assignedToId)) {
            this.selectedInterns = [...this.selectedInterns, selectedIntern];
        }

        this.searchKey = '';
        this.searchResults = [];
    }

    removeSelectedIntern(event) {
        this.assignedToId = event.target.closest('button').dataset.id;
        this.selectedInterns = this.selectedInterns.filter(intern => intern.Id !== this.assignedToId);
    }

    _handleSearch(event) {
        this._searchKey = event.target.value.toLowerCase();
        console.log('Search Key:', this._searchKey);
    
        if (this._searchKey) {
    
            // Filter certificates based on search key
            this._searchResults = this.program.Certificates__r.filter(certificate => {
                return certificate.Name.toLowerCase().includes(this._searchKey);
            });
    
            console.log('Filtered Results:', this._searchResults);
        } else {
            this._searchResults = [];
        }
    }
    

    selectCertificate(event) {
        this.certificateId = event.target.closest('li').dataset.id;
        this.selectedCertificate = this.program.Certificates__r.find(certificate => certificate.Id === this.certificateId);

        if (this.selectedCertificate) {
            this._searchResults = [];
            this._searchKey = '';
            this.isshow = true;
        }
    }

    _removeselected(event) {
        const button = event.target.closest('button');
        const certificateId = button ? button.dataset.id : null;

        if (certificateId && this.selectedCertificate && this.selectedCertificate.Id === certificateId) {
            this.selectedCertificate = null;
            this.isshow = false;
        } 
    }

    newScheduleExam() {
        const certificateId = this.selectedCertificate.Id;
        const traingId = this.recordId;
        const scheduleDate = this.template.querySelector('[data-id="scheduleDate"]').value;
        const completion = 30;
        const location = this.template.querySelector('[data-id="location"]').value
        const assignedTo = this.selectedInterns.map(intern => intern.User__c);

        console.log('certificateId data', certificateId)

        if (!certificateId || !traingId || !scheduleDate || !location || !completion || assignedTo.length === 0) {
            this.showToast('Error', 'All fields are required.', 'error');
            return;
        }

        this.isLoading = true;

        addNewschedule({ certificateId, traingId, scheduleDate, location, completion, assignedTo })
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
