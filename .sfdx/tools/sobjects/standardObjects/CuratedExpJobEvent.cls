// This file is generated as an Apex representation of the
//     corresponding sObject and its fields.
// This read-only file is used by the Apex Language Server to
//     provide code smartness, and is deleted each time you
//     refresh your sObject definitions.
// To edit your sObjects and their fields, edit the corresponding
//     .object-meta.xml and .field-meta.xml files.

global class CuratedExpJobEvent {
    global String ReplayId;
    global Datetime CreatedDate;
    global User CreatedBy;
    global Id CreatedById;
    global String EventUuid;
    global String PlanName;
    global String JobName;
    global String JobStatus;
    global String TaskDetails;
    global List<AsyncOperationEvent> SourceEvent;

    global CuratedExpJobEvent () 
    {
    }
}