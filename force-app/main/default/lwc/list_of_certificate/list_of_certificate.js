import { LightningElement, api, track, wire } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import getInternDetails from '@salesforce/apex/InternController.getInternDetails';

export default class InternCertificates extends LightningElement {
    @api recordId;
    @track certificates = []; 
    error;
    selectedIntern = '';

    @wire(getInternDetails, { internId: '$recordId' })
    wiredInternDetails({ error, data }) {
        if (data) {
            this.certificates = data.certificates;
        } else if (error) {
            this.error = error;
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
