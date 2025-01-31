// This file is generated as an Apex representation of the
//     corresponding sObject and its fields.
// This read-only file is used by the Apex Language Server to
//     provide code smartness, and is deleted each time you
//     refresh your sObject definitions.
// To edit your sObjects and their fields, edit the corresponding
//     .object-meta.xml and .field-meta.xml files.

global class AnalyticsTaskStatusEvent {
    global String ReplayId;
    global Datetime CreatedDate;
    global User CreatedBy;
    global Id CreatedById;
    global String EventUuid;
    global String RuntimeRequest;
    global Long FailureCount;
    global Long InProgressCount;
    global Long NotStartedCount;
    global Long SuccessCount;
    global Long WarningCount;
    global Long TotalTask;
    global Long TotalDurationInSecond;
    global String RequestStatus;
    global String TaskStatus;
    global String Message;
    global String Result;
    global String TaskNode;
    global String TaskPhase;
    global List<AsyncOperationEvent> SourceEvent;

    global AnalyticsTaskStatusEvent () 
    {
    }
}