// This file is generated as an Apex representation of the
//     corresponding sObject and its fields.
// This read-only file is used by the Apex Language Server to
//     provide code smartness, and is deleted each time you
//     refresh your sObject definitions.
// To edit your sObjects and their fields, edit the corresponding
//     .object-meta.xml and .field-meta.xml files.

global class ProcessExceptionChangeEvent {
    global Id Id;
    global String ReplayId;
    global Object ChangeEventHeader;
    global User Owner;
    global Id OwnerId;
    global String ProcessExceptionNumber;
    global Datetime CreatedDate;
    global User CreatedBy;
    global Id CreatedById;
    global Datetime LastModifiedDate;
    global User LastModifiedBy;
    global Id LastModifiedById;
    global SObject AttachedTo;
    global Id AttachedToId;
    global String Message;
    global String StatusCategory;
    global String Status;
    global String Category;
    global String Severity;
    global String Priority;
    global Case Case;
    global Id CaseId;
    global String ExternalReference;
    global String SeverityCategory;
    global String Description;

    global ProcessExceptionChangeEvent () 
    {
    }
}