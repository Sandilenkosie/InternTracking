// This file is generated as an Apex representation of the
//     corresponding sObject and its fields.
// This read-only file is used by the Apex Language Server to
//     provide code smartness, and is deleted each time you
//     refresh your sObject definitions.
// To edit your sObjects and their fields, edit the corresponding
//     .object-meta.xml and .field-meta.xml files.

global class Tasks__ChangeEvent {
    global Id Id;
    global String ReplayId;
    global Object ChangeEventHeader;
    global String Name;
    global Datetime CreatedDate;
    global User CreatedBy;
    global Id CreatedById;
    global Datetime LastModifiedDate;
    global User LastModifiedBy;
    global Id LastModifiedById;
    global Phase__c Phase__c;
    global String Status__c;
    global String Subject__c;
    global Date Due_Date__c;
    global String Priority__c;
    global User Assigned_To__c;
    global Contact Name__c;
    global String Description__c;
    global Boolean Is_Closed__c;
    global Date Start_Date__c;
    global String Sign_off_status__c;
    global Double Completion__c;
    global String On_Hold_Reason__c;
    global Boolean Milestone__c;

    global Tasks__ChangeEvent () 
    {
    }
}