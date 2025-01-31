// This file is generated as an Apex representation of the
//     corresponding sObject and its fields.
// This read-only file is used by the Apex Language Server to
//     provide code smartness, and is deleted each time you
//     refresh your sObject definitions.
// To edit your sObjects and their fields, edit the corresponding
//     .object-meta.xml and .field-meta.xml files.

global class trailheadapp__Debug_Log__ChangeEvent {
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
    global String trailheadapp__Class__c;
    /* The date/time of the log message.
    */
    global Datetime trailheadapp__Datetime__c;
    global String trailheadapp__Message__c;
    global String trailheadapp__Method__c;
    global String trailheadapp__Severity__c;
    global String trailheadapp__Transaction__c;

    global trailheadapp__Debug_Log__ChangeEvent () 
    {
    }
}