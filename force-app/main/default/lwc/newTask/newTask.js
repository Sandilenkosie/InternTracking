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
    @track searchphase = '';
    @track assignedToId = '';
    @track phaseId = '';
    @track selectedPhase = '';
    @track selectedInterns = [];
    @track searchResults = [];
    @track isLoading = false;
    @track isshow = false;

    phases = [];
    program = {};
    certificates = [];
    modules = [];

    @wire(getTrainingProgramDetails, { trainingProgramId: '$recordId' })
    wiredTrainingProgram({ error, data }) {
        if (data) {
            console.log('Training Program Data:', data);  // Log the data to check if interns are fetched
            this.trainingProgram = data.trainingProgram;
            this.phases = data.phases;
            this.program = data.program;
             
            this.certificates = data.certificates

        } else if (error) {
            console.error('Error fetching data:', error);  // Log the error if there's an issue
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
            this.searchResults = [...this.interns];;
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


   handlePhaseSearch(event) {
    // Extract modules from certificates
    let modules = []; // Initialize empty array
    this.certificates.forEach(cert => {
        if (cert.Modules__r) {
            modules = [...modules, ...cert.Modules__r]; // Append modules from each certificate
        }
    });
    this.modules = modules; // Assign to component variable

    this.searchphase = event.target.value.toLowerCase();
    console.log('Search Key:', this.searchphase);

    if (this.searchphase) {
        this.searchResults = this.modules.filter(module => {
            const nameMatches = module.Name.toLowerCase().includes(this.searchphase);
            console.log('Name Match:', module.Name, nameMatches);
            return nameMatches;
        });

        console.log('Filtered Results:', this.searchResults);
    } else {
        this.searchResults = [];
    }
}


    selectPhase(event) {
        this.phaseId = event.target.closest('li').dataset.id;
        const selectedPhase = this.modules.find(module => module.Id === this.phaseId);

        console.log(selectedPhase.Id);
    
        if (selectedPhase) {
            this.selectedPhase = selectedPhase;
        }

       this.searchphase = '';
       this.searchResults = [];
       this.isshow = true;
   }

    removeSelectedPhase(event) {
        const button = event.target.closest('button'); // Ensure we get the closest button
        const phaseId = button ? button.dataset.id : null;

        if (phaseId && this.selectedPhase && this.selectedPhase.Id === phaseId) {
            this.selectedPhase = null;

            this.isshow = false;
        } 
    }

    createNewTask() {
        const taskName = this.template.querySelector('[data-id="taskName"]').value;
        const dueDate = this.template.querySelector('[data-id="dueDate"]').value;
        const startDate = this.template.querySelector('[data-id="startDate"]').value;
        const completion = this.template.querySelector('[data-id="completion"]').value;
        const milestone = this.template.querySelector('[data-id="milestone"]').checked
        const assignedTo = this.selectedInterns.map(intern => intern.User__c);
        // const phaseId = this.selectedPhase.Id;

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
