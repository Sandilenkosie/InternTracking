// This file is generated as an Apex representation of the
//     corresponding sObject and its fields.
// This read-only file is used by the Apex Language Server to
//     provide code smartness, and is deleted each time you
//     refresh your sObject definitions.
// To edit your sObjects and their fields, edit the corresponding
//     .object-meta.xml and .field-meta.xml files.

global class FlowOrchestrationVersionChangeEvent {
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
    global FlowOrchestration FlowOrchestration;
    global Id FlowOrchestrationId;
    global Integer VersionNumber;
    global User ActivatedBy;
    global Id ActivatedById;
    global Datetime ActivatedDate;
    global String OrchestrationType;
    global String Status;
    global String Description;
    global String RunInMode;
    global Double ApiVersion;
    global Boolean IsTemplate;
    global String TriggerObjectOrEventLabel;
    global FlowOrchestration SourceTemplate;
    global Id SourceTemplateId;
    global Boolean IsOverridable;
    global FlowOrchestration OverriddenBy;
    global Id OverriddenById;
    global FlowOrchestration OverriddenOrchestration;
    global Id OverriddenOrchestrationId;

    global FlowOrchestrationVersionChangeEvent () 
    {
    }
}