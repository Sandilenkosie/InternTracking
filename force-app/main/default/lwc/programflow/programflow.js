import { LightningElement, wire, track, api } from 'lwc';
import addCertificate from '@salesforce/apex/ProgramController.addCertificate';
import getProgramDetails from '@salesforce/apex/ProgramController.getProgramDetails';
import { CloseActionScreenEvent } from 'lightning/actions';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

export default class Program extends LightningElement {
    @api recordId; // The ID of the record to edit
    @track program = {};
    isLoading = false;
    isshow = true;

    


    @track certificateName = '';
    @track code = '';
    @track currentStep = 1; // Track the current step

    // Progress and steps for the progress bar
    @track steps = [
        { id: 1, label: 'Step 1 - Certificate Name', class: 'slds-is-completed' },
        { id: 2, label: 'Step 2 - Certificate Code & Program', class: 'slds-is-active' },
        { id: 3, label: 'Step 3 - Summary', class: '' }
    ];

    get progressStyle() {
        return `width:${(this.currentStep / this.steps.length) * 100}%`;
    }
    
    get isStep1() {
        return this.currentStep === 1;
    }

    get isStep2() {
        return this.currentStep === 2;
    }

    get isStep3() {
        return this.currentStep === 3;
    }

    get canGoNext() {
        // You can add validation here for each step, e.g., check if fields are filled
        if (this.currentStep === 1 && this.certificateName) return true;
        if (this.currentStep === 2 && this.code && this.programName) return true;
        return false;
    }

    get canGoBack() {
        return this.currentStep > 1;
    }

    get isLastStep() {
        return this.currentStep === this.steps.length;
    }

    handleInputChange(event) {
        const field = event.target.dataset.id;
        if (field === 'certificateName') {
            this.certificateName = event.target.value;
        } else if (field === 'code') {
            this.code = event.target.value;
        } else if (field === 'programName') {
            this.programName = event.target.value;
        }
    }

    handleNext() {
        if (this.canGoNext) {
            this.currentStep += 1;
            this.updateStepClasses();
        }
    }

    handleBack() {
        if (this.canGoBack) {
            this.currentStep -= 1;
            this.updateStepClasses();
        }
    }

    handleSubmit() {
        // Handle form submission (save the certificate data, etc.)
        console.log('Saving Certificate...');
    }

    handleCancel() {
        // Handle form cancellation (close modal, reset form, etc.)
        console.log('Form canceled');
    }

    updateStepClasses() {
        this.steps = this.steps.map(step => {
            if (step.id < this.currentStep) {
                step.class = 'slds-is-completed';
            } else if (step.id === this.currentStep) {
                step.class = 'slds-is-active';
            } else {
                step.class = '';
            }
            return step;
        });
    }

    @wire(getProgramDetails, { programId: '$recordId' })
    wiredgetProgramDetails({ error, data }) {
        console.log('Program Data:', data);
        if (data) {
            this.program = data.program;
        } else if (error) {
            this.showToast('Error', 'Error fetching program details.', 'error');
            console.error('Error fetching data:', error);
        }
    }

    handleAddCertificate() {
        const certificateName = this.template.querySelector('[data-id="certificateName"]').value;
        const programId = this.program.Id;
        const code = this.template.querySelector('[data-id="code"]').value;

        if (!certificateName || !programId || !code) {
            this.showToast('Error', 'All fields are required.', 'error');
            return;
        }

        this.isLoading = true;

        addCertificate({ programId, certName: certificateName, code })
            .then(() => {
                this.showToast('Success', 'Certificate created successfully.', 'success');
                this.handleCancel();
            })
            .catch(error => {
                console.error('Error creating Certificate:', error);
                this.showToast('Error', error.body?.message || 'Failed to create Certificate.', 'error');
            })
            .finally(() => {
                this.isLoading = false;
            });
    }

    handleCancel() {
        this.dispatchEvent(new CloseActionScreenEvent());
    }

    showToast(title, message, variant) {
        const evt = new ShowToastEvent({
            title: title,
            message: message,
            variant: variant,
        });
        this.dispatchEvent(evt);
    }
}
