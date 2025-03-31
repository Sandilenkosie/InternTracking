import { LightningElement, api, track, wire } from 'lwc';
import getInternDetails from '@salesforce/apex/InternController.getInternDetails';
import jsPDF from '@salesforce/resourceUrl/jspdf';
import jsPDF_AutoTable from '@salesforce/resourceUrl/jsPDFAutoTable';
import { loadScript } from 'lightning/platformResourceLoader';
import { refreshApex } from '@salesforce/apex';

export default class OnboardingList extends LightningElement {
    @api recordId;
    @track onboardings = [];
    jsPDFInitialized = false;
    wiredOnboardingResult;
    selectedInternId;

    // Wire method to get onboarding records
    @wire(getInternDetails, { internId: '$recordId' })
    wiredOnboarding(result) {
        this.wiredOnboardingResult = result;
        const { error, data } = result;
        if (data) {
            this.onboardings = data.onboardings;
            console.log('RecordId', this.recordId);

        } else if (error) {
            console.error('Error retrieving onboarding records', error);
        }
    }

    // Method to refresh data
    handleRefresh() {
        refreshApex(this.wiredOnboardingResult);
    }

    // Rendered callback to load jsPDF libraries
    renderedCallback() {
        if (this.jsPDFInitialized) {
            return;
        }
        Promise.all([
            loadScript(this, jsPDF),
            loadScript(this, jsPDF_AutoTable)
        ])
            .then(() => {
                this.jsPDFInitialized = true;
            })
            .catch(error => {
                console.error('Error loading jsPDF libraries', error);
            });
    }

    // Method to download PDF
    downloadPDF() {
        if (!this.jsPDFInitialized) {
            console.error('jsPDF not initialized');
            return;
        }

        const doc = new window.jspdf.jsPDF();
        // Contract Title
        doc.setFontSize(18);
        doc.text("Onboarding Contract", 20, 20);

        // Contract Details
        doc.setFontSize(12);
        doc.text("This document outlines the onboarding details for the following candidates:", 20, 30);

        // Adding some space
        doc.text(" ", 20, 35);

        // Define table headers and rows
        const headers = [["Name", "Assigned Date", "Type", "Status"]];
        const rows = this.onboardings.map(onboarding => [
            onboarding.Name || '',
            onboarding.Assigned_Date__c || '',
            onboarding.Type__c || '',
            onboarding.Status__c || ''
        ]);

        // Generate table in PDF
        doc.autoTable({
            head: headers,
            body: rows,
            startY: 40,
            theme: 'grid',
            styles: {
                fontSize: 10,
                cellPadding: 4,
                halign: 'left'
            },
            headStyles: {
                fillColor: [0, 102, 204],
                textColor: [255, 255, 255]
            }
        });

        // Signature Section
        const finalY = doc.lastAutoTable.finalY + 20;
        doc.text("Authorized Signature: _____________________", 20, finalY);
        doc.text("Date: _____________________", 20, finalY + 10);

        // Save PDF
        doc.save("Onboarding_Contract.pdf");
    }
}
