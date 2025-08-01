// This file is generated as an Apex representation of the
//     corresponding sObject and its fields.
// This read-only file is used by the Apex Language Server to
//     provide code smartness, and is deleted each time you
//     refresh your sObject definitions.
// To edit your sObjects and their fields, edit the corresponding
//     .object-meta.xml and .field-meta.xml files.

global class FlowRecordVersionChangeEvent {
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
    global FlowRecord FlowRecord;
    global Id FlowRecordId;
    global Integer VersionNumber;
    global User ActivatedBy;
    global Id ActivatedById;
    global Datetime ActivatedDate;
    global String ProgressStatus;
    global Boolean IsPaused;
    global User PausingUser;
    global Id PausingUserId;
    global Datetime PausedDate;
    global User ResumingUser;
    global Id ResumingUserId;
    global Datetime ResumedDate;
    global String ReasonPaused;
    global Datetime ScheduledStartDate;
    global String FlowType;
    global String Status;
    global String Description;
    global String RunInMode;
    global Double ApiVersion;
    global Boolean IsTemplate;
    global String TriggerObjectOrEventLabel;
    global String Builder;
    global FlowRecord SourceTemplate;
    global Id SourceTemplateId;
    global Boolean IsOverridable;
    global FlowRecord OverriddenBy;
    global Id OverriddenById;
    global FlowRecord OverriddenFlow;
    global Id OverriddenFlowId;
    global String CapacityCategory;

    global FlowRecordVersionChangeEvent () 
    {
    }
}