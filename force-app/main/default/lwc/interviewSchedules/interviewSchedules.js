import { LightningElement, api, wire, track } from 'lwc';
import { NavigationMixin } from 'lightning/navigation';
import { ShowToastEvent } from 'lightning/platformShowToastEvent'; 
import { CloseActionScreenEvent } from 'lightning/actions';
import getProjectdetails from '@salesforce/apex/ProjectController.getProjectdetails';
import createInterview from '@salesforce/apex/ProjectController.createInterview';
// import createClient from '@salesforce/apex/ProjectController.createClient';

export default class interviewSchedules extends NavigationMixin(LightningElement) {
    @api recordId;
    project  = '';
    @track searchKey = '';
    @track _searchKey = '';
    @track assignedToId = '';
    @track clientId = '';
    @track selectedConsultants = [];
    @track searchResults = [];
    @track _searchResults = [];
    @track isLoading = false;
    @track selectedClient = '';
    @track isshow = false;
    @track locationOptions = [
        { label: '--None--', value: '' },
        { label: 'On-Site', value: 'On-Site' },
        { label: 'Exam center', value: 'Exam center' },
    ];

    consultants = [];
    clients = [];

    @wire(getProjectdetails, { projectId: '$recordId' })
    wiredConsultant({ error, data }) {
        console.log('consultant Data:', data);
        if (data) {
            this.project = data.project;
            this.consultants = data.consultants;
            this.clients = data.clients;

        } else if (error) {
            console.error('Error fetching data:', error); 
            this.error = error;
        }
    }


    handleSearch(event) {
        this.searchKey = event.target.value.toLowerCase();
        console.log('Search Key:', this.searchKey);
        if (this.searchKey) {
            this.searchResults = this.consultants.filter(consultant => {
                const nameMatches = consultant.Name.toLowerCase().includes(this.searchKey );
    
                console.log('Name Match:', consultant.Name, nameMatches); 
                return nameMatches;
            });
    
            console.log('Filtered Results:', this.searchResults); 
        } else {
            this.searchResults = [];
        }
    }

    selectConsultant(event) {
         this.assignedToId = event.target.closest('li').dataset.id;
        const selectedConsultant = this.consultants.find(consultant => consultant.Id === this.assignedToId);

        if (selectedConsultant && !this.selectedConsultants.some(consultant => consultant.Id === this.assignedToId)) {
            this.selectedConsultants = [...this.selectedConsultants, selectedConsultant];
        }

        this.searchKey = '';
        this.searchResults = [];
    }

    removeselectedConsultant(event) {
        this.assignedToId = event.target.closest('button').dataset.id;
        this.selectedConsultants = this.selectedConsultants.filter(consultant => consultant.Id !== this.assignedToId);
    }

    _handleSearch(event) {
        this._searchKey = event.target.value.toLowerCase();
        console.log('Search Key:', this._searchKey);
        if (this._searchKey) {
            this._searchResults = this.clients.filter(client => {
                const nameMatches = client.Name.toLowerCase().includes(this._searchKey );
    
                console.log('Name Match:', client.Name, nameMatches);
    
                return nameMatches;
            });
    
            console.log('Filtered Results:', this._searchResults);
        } else {
            this._searchResults = [];
        }
    }

    selectClient(event) {
        this.clientId = event.target.closest('li').dataset.id;
        const selectedClient = this.clients.find(client => client.Id === this.clientId);
    
        if (selectedClient) {
            this.selectedClient = selectedClient;
        }

       this._searchKey = '';
       this._searchResults = [];
       this.isshow = true;
   }

    _removeSelected(event) {
        const button = event.target.closest('button');
        const clientId = button ? button.dataset.id : null;


        if (clientId && this.selectedClient && this.selectedClient.Id === clientId) {
            this.selectedClient = null;

            this.isshow = false;
        } 
    }


    newInterview() {
        const clientId = this.selectedClient.Id;
        const interviewName = this.template.querySelector('[data-id="interviewName"]').value;
        const scheduleDate = this.template.querySelector('[data-id="scheduleDate"]').value;
        // const location = this.template.querySelector('[data-id="location"]').value
        const assignedTo = this.selectedConsultants.map(consultant => consultant.Id);

        if (!interviewName || !clientId || !scheduleDate || assignedTo.length === 0) {
            this.showToast('Error', 'All fields are required.', 'error');
            return;
        }

        this.isLoading = true;

        createInterview({ clientId, interviewName, scheduleDate, assignedTo })
            .then(() => {
                this.showToast('Success', 'Interview created successfully.', 'success');
                this.handleCancel();
            })
            .catch(error => {
                console.error('Error creating Interview:', error);
                this.showToast('Error', error.body?.message || 'Failed to create Interview.', 'error');
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
