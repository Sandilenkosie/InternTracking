import { LightningElement, wire, api, track } from 'lwc';
import getProgramDetails from '@salesforce/apex/InlineFormController.getProgramDetails';
import updateProgram from '@salesforce/apex/InlineFormController.updateProgram';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

export default class UpdateProgramLWC extends LightningElement {
    @api recordId; 
    @track program = {
        progName: '',
        department: '',
        type: '',
        startDate: null,
        endDate: null
    };
    @track error;

    // Fetch existing program data using @wire
    @wire(getProgramDetails, { programId: '$recordId' })
    wiredProgramDetails({ error, data }) {
        if (data) {
            console.log('Program Data: ', data);
            this.program = {
                progName: data.Name,
                department: data.Department__c,
                type: data.Program_Type__c,
                startDate: data.Start_Date__c,
                endDate: data.End_Date__c
            };
            this.error = undefined;
        } else if (error) {
            console.error('Error loading program data: ', error);
            this.error = error;
        }
    }

    handleInputChange(event) {
        const field = event.target.dataset.field;
        this.program[field] = event.target.value;
    }

    handleSave() {
        const { progName, department, type, startDate, endDate } = this.program;

        updateProgram({
            programId: this.recordId, // Use `recordId` instead of `programId`
            department,
            type,
            progName,
            startDate,
            endDate
        })
            .then(() => {
                this.showToast('Success', 'Program updated successfully', 'success');
            })
            .catch(error => {
                console.error('Error updating program: ', error);
                this.showToast('Error', 'Error updating program: ' + error.body.message, 'error');
            });
    }

    showToast(title, message, variant) {
        const evt = new ShowToastEvent({
            title: title,
            message: message,
            variant: variant
        });
        this.dispatchEvent(evt);
    }
}
