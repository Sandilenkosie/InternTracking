// This file is generated as an Apex representation of the
//     corresponding sObject and its fields.
// This read-only file is used by the Apex Language Server to
//     provide code smartness, and is deleted each time you
//     refresh your sObject definitions.
// To edit your sObjects and their fields, edit the corresponding
//     .object-meta.xml and .field-meta.xml files.

global class AssociatedLocationChangeEvent {
    global Id Id;
    global String ReplayId;
    global Object ChangeEventHeader;
    global String AssociatedLocationNumber;
    global Datetime CreatedDate;
    global User CreatedBy;
    global Id CreatedById;
    global Datetime LastModifiedDate;
    global User LastModifiedBy;
    global Id LastModifiedById;
    global Account ParentRecord;
    global Id ParentRecordId;
    global Location Location;
    global Id LocationId;
    global String Type;
    global Datetime ActiveFrom;
    global Datetime ActiveTo;

    global AssociatedLocationChangeEvent () 
    {
    }
}