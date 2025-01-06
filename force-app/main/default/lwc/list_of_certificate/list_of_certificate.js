import { LightningElement, api, track, wire } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import getProgramDetails from '@salesforce/apex/ProgramController.getProgramDetails';

export default class InternCertificates extends LightningElement {
    @api recordId; // Record ID of the program
    @track certificates = []; // List of certificates
    @track interns; // List of interns
    error; // Error handler

    @wire(getProgramDetails, { internId: '$recordId' })
    wiredgetProgramDetails({ error, data }) {
        console.log('Intern Data:', data);
        if (data) {
            this.interns = data.interns;
            this.certificates = data.certificates;
        } else if (error) {
            this.showToast('Error', 'Error fetching program details.', 'error');
            console.error('Error fetching data:', error);
        }
    }

    showToast(title, message, variant) {
        const event = new ShowToastEvent({
            title,
            message,
            variant,
        });
        this.dispatchEvent(event);
    }
}
