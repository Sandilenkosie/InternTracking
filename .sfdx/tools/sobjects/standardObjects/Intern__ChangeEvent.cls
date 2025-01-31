// This file is generated as an Apex representation of the
//     corresponding sObject and its fields.
// This read-only file is used by the Apex Language Server to
//     provide code smartness, and is deleted each time you
//     refresh your sObject definitions.
// To edit your sObjects and their fields, edit the corresponding
//     .object-meta.xml and .field-meta.xml files.

global class Intern__ChangeEvent {
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
    global Boolean Asset_assign__c;
    global String Status__c;
    global Program__c Program__c;
    global User User__c;
    global Date Date_of_Birth__c;
    global Double Age__c;
    global String Gender__c;
    global String Stage__c;
    global String Documents__c;
    global String Performance_Rating__c;
    global String Evaluation_Notes__c;
    global Boolean Goals_Achieved__c;
    global String Department__c;
    global String Program_Status__c;
    global String Program_Duration__c;
    global Training_Program__c Training_Program__c;
    global Double Training_Progress__c;
    global String Email__c;
    global String First_Name__c;
    global String Last_Name__c;
    global String Mobile__c;
    global String Title__c;
    /* This tells if HR has received the Contract before intern move to Training
    */
    global Boolean Contract_Signed__c;

    global Intern__ChangeEvent () 
    {
    }
}