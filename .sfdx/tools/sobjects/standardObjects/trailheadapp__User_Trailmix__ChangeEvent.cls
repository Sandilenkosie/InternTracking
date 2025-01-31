// This file is generated as an Apex representation of the
//     corresponding sObject and its fields.
// This read-only file is used by the Apex Language Server to
//     provide code smartness, and is deleted each time you
//     refresh your sObject definitions.
// To edit your sObjects and their fields, edit the corresponding
//     .object-meta.xml and .field-meta.xml files.

global class trailheadapp__User_Trailmix__ChangeEvent {
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
    global trailheadapp__Trailmix__c trailheadapp__Trailmix__c;
    global Datetime trailheadapp__Assigned_At__c;
    global Datetime trailheadapp__Completed_At__c;
    /* This due date may display differently for users not in the assigner's same timezone.
    */
    global Datetime trailheadapp__Due_At__c;
    global String trailheadapp__External_Id__c;
    global Datetime trailheadapp__First_Attempted_At__c;
    global Datetime trailheadapp__Last_Attempted_At__c;
    /* Two types of status, "In Progress", or "Completed" are available to represent the status of a user's trailmix.
    */
    global String trailheadapp__Status__c;
    global User trailheadapp__User__c;

    global trailheadapp__User_Trailmix__ChangeEvent () 
    {
    }
}