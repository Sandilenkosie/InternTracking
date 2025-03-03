import { LightningElement, track, wire } from 'lwc';
import getOnboardingWithSignature from '@salesforce/apex/InternController.getOnboardingWithSignature';
import jsPDF from '@salesforce/resourceUrl/jspdf';
import jsPDF_AutoTable from '@salesforce/resourceUrl/jsPDFAutoTable';
import { loadScript } from 'lightning/platformResourceLoader';

export default class OnboardingList extends LightningElement {
    @track onboardingList = [];
    jsPDFInitialized = false;

    @wire(getOnboardingWithSignature)
    wiredOnboarding({ error, data }) {
        if (data) {
            this.onboardingList = data;
        } else if (error) {
            console.error('Error retrieving onboarding records', error);
        }
    }

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
        const rows = this.onboardingList.map(onboarding => [
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
