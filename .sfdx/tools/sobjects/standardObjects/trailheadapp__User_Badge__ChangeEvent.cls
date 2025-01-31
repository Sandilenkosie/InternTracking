// This file is generated as an Apex representation of the
//     corresponding sObject and its fields.
// This read-only file is used by the Apex Language Server to
//     provide code smartness, and is deleted each time you
//     refresh your sObject definitions.
// To edit your sObjects and their fields, edit the corresponding
//     .object-meta.xml and .field-meta.xml files.

global class trailheadapp__User_Badge__ChangeEvent {
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
    global trailheadapp__Badge__c trailheadapp__Badge__c;
    /* The record has been archived and is no longer available
    */
    global Boolean trailheadapp__Archived__c;
    /* Represents the date the badge is assigned for the purposes of tracking a user's activity before they start working on it
    */
    global Datetime trailheadapp__Assigned_Date__c;
    /* Represents the date the badge is due for the purposes of tracking the time left for a user to complete the badge.
    */
    global Datetime trailheadapp__Due_Date__c;
    global String trailheadapp__External_ID__c;
    global Datetime trailheadapp__Finished_Date__c;
    global Datetime trailheadapp__First_Attempted_Date__c;
    global Datetime trailheadapp__Last_Attempted_Date__c;
    /* Three types of status, "Assigned", "In Progress", or "Completed" are available to represent the status of a user's badge
    */
    global String trailheadapp__Status__c;
    global User trailheadapp__User__c;
    /* How long it took to complete from when it was first assigned or first attempted if not assigned.
    */
    global Double trailheadapp__Assigned_to_Complete__c;
    global String trailheadapp__Badge_Icon__c;
    global String trailheadapp__URL__c;

    global trailheadapp__User_Badge__ChangeEvent () 
    {
    }
}