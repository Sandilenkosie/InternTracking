// This file is generated as an Apex representation of the
//     corresponding sObject and its fields.
// This read-only file is used by the Apex Language Server to
//     provide code smartness, and is deleted each time you
//     refresh your sObject definitions.
// To edit your sObjects and their fields, edit the corresponding
//     .object-meta.xml and .field-meta.xml files.

global class trailheadapp__Trailmix_Assignment__ChangeEvent {
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
    /* The date the Trailmix is to be completed.
    */
    global Date trailheadapp__Due_At__c;
    /* The datetime the Trailmix is to be completed.
    */
    global Datetime trailheadapp__Due_Datetime__c;
    global String trailheadapp__Status__c;
    global User trailheadapp__User__c;

    global trailheadapp__Trailmix_Assignment__ChangeEvent () 
    {
    }
}