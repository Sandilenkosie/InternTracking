import { LightningElement, api, track, wire } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import getInternDetails from '@salesforce/apex/InternController.getInternDetails';
import shouldShowOnboardingForm from '@salesforce/apex/InternController.shouldShowOnboardingForm';
import getOnboardingRecordType from '@salesforce/apex/InternController.getOnboardingRecordType';

export default class InternCertificates extends LightningElement {
    @api recordId;
    @track certificates = []; 
    @track onboardings = []; 
    @track onboardingId;
    @track recordTypeId;
    @track showOnboarding = false;
    @track showOnboardingForm = false;

    isContract = false;
    isAssect = false;

    error;
    selectedIntern = '';

    columns = [
        // { label: 'Record Type', fieldName: 'RecordTypeId', type: 'text', hidden: true },
        { label: 'Onboarding Name', fieldName: 'Name', type: 'text' },
        // { label: 'Contact', fieldName: 'Contact__c', type: 'text' },
        { label: 'Assigned Date', fieldName: 'Assigned_Date__c', type: 'date' },
        // { label: 'Due Date', fieldName: 'Returned_Date__c', type: 'date' },
        { label: 'Type', fieldName: 'Type__c', type: 'text' },
        { label: 'Status', fieldName: 'Status__c', type: 'text' },
        {
            type: 'button', typeAttributes: {
                label: 'Edit',
                name: 'edit',
                title: 'Click to edit',
                disabled: false,
                value: 'edit',
                iconPosition: 'left'
            }
        }
    ];

    @wire(getInternDetails, { internId: '$recordId' })
    wiredInternDetails({ error, data }) {
        if (data) {
            this.certificates = data.certificates || null;
            this.onboardings = data.onboardings;

            this.checkOnboardingConditions();
        } else if (error) {
            this.error = error;
        }
    }
    

    checkOnboardingConditions() {
        // Check if onboardings array exists and has elements
        if (this.onboardings && this.onboardings.length > 0) {
            this.onboardings.forEach(onboarding => {
                shouldShowOnboardingForm({ onboardingId: onboarding.Id })
                    .then(result => {
                        if (result) {
                            // If result is true, show the onboarding form for the selected onboarding
                            this.showOnboarding = true;
                            this.onboardingId = onboarding.Id;
                        } 
                    })
                    .catch(error => {
                        // Handle errors and show an error toast with the message
                        const errorMessage = error.body && error.body.message ? error.body.message : 'Unknown error';
                        this.showToast('Error', errorMessage, 'error');
                    });
            });
        } else {
            // If no onboarding records were found, show an error toast
            this.showToast('Error', 'No onboarding records found for the current intern', 'error');
        }
    }

    @wire(getOnboardingRecordType)
    recordTypeMap;

    handleRowAction(event) {
        const row = event.detail.row;
        const onboardingId = row.Id;
        this.onboardingId = onboardingId;
        this.recordTypeId = row.RecordTypeId;

        console.log('recordType Id: ',this.recordTypeId);

        // Set flags based on RecordTypeId
        if (this.recordTypeMap.data) {
            console.log('RecordTypeMap Data:', this.recordTypeMap.data);
            this.isContract = (this.recordTypeId === this.recordTypeMap.data['Contract_Records']);
            this.isAsset = (this.recordTypeId === this.recordTypeMap.data['Asset_Records']);
        }

        console.log('Is Contract:', this.isContract);
        console.log('Is Asset:', this.isAsset);
        this.showOnboarding = false;
        this.showOnboardingForm = true;
    }
    
    handleSuccess(event) {
        const payload = event.detail;
        this.showToast('Success', 'Onboarding record saved successfully!', 'success');
        this.showOnboardingForm = false; // Close the popup after successful submission
    }

    handleError(event) {
        // Triggered when form submission fails
        const error = event.detail;
        this.showToast('Error', error.body.message, 'error');
    }

    closeModel() {
        this.showOnboardingForm = false;
        this.showOnboarding = false;
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
