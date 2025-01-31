// This file is generated as an Apex representation of the
//     corresponding sObject and its fields.
// This read-only file is used by the Apex Language Server to
//     provide code smartness, and is deleted each time you
//     refresh your sObject definitions.
// To edit your sObjects and their fields, edit the corresponding
//     .object-meta.xml and .field-meta.xml files.

global class Asset__ChangeEvent {
    global Id Id;
    global String ReplayId;
    global Object ChangeEventHeader;
    global SObject Owner;
    global Id OwnerId;
    global String Name;
    global Datetime CreatedDate;
    global User CreatedBy;
    global Id CreatedById;
    global Datetime LastModifiedDate;
    global User LastModifiedBy;
    global Id LastModifiedById;
    global String Serial_Number__c;
    global Account Account__c;
    global Contact Contact__c;
    global Date Assigned_Date__c;
    global Date Returned_Date__c;
    global String Status__c;
    global String Condition_Before__c;
    global String Condition_After__c;
    global Onboarding__c Onboarding__c;

    global Asset__ChangeEvent () 
    {
    }
}