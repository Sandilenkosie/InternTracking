// This file is generated as an Apex representation of the
//     corresponding sObject and its fields.
// This read-only file is used by the Apex Language Server to
//     provide code smartness, and is deleted each time you
//     refresh your sObject definitions.
// To edit your sObjects and their fields, edit the corresponding
//     .object-meta.xml and .field-meta.xml files.

global class PMT_Setting__mdt {
    global Id Id;
    global String DeveloperName;
    global String MasterLabel;
    global String Language;
    global String NamespacePrefix;
    global String Label;
    global String QualifiedApiName;
    global Datetime SystemModstamp;
    /* Activates/deactivates the trigger which automates the project sharing. Keep this false, if your sharing model is public read/write for project
    */
    global Boolean Allocation_Trigger_Status__c;
    /* The default availability percentage assigned to the users while creating the availabilities
    */
    global Double Default_Availability_for_Scheduler__c;
    global String Holidays__c;
    /* The rolling number of years for which the availability is created by the scheduler in advance, so that resource planning can be done in advance for those many number of years
    */
    global Double Resource_Planning_Years_in_Advance__c;
    /* This indicates the start of the fiscal year. For example, if value is 2 which means year starts from Feb, 3 for Mar, and so on
    */
    global Double Start_Month_of_Fiscal_Year__c;

    global PMT_Setting__mdt () 
    {
    }
}