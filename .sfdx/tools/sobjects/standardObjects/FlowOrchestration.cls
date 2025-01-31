// This file is generated as an Apex representation of the
//     corresponding sObject and its fields.
// This read-only file is used by the Apex Language Server to
//     provide code smartness, and is deleted each time you
//     refresh your sObject definitions.
// To edit your sObjects and their fields, edit the corresponding
//     .object-meta.xml and .field-meta.xml files.

global class FlowOrchestration {
    global Id Id;
    global Boolean IsDeleted;
    global String Name;
    global Datetime CreatedDate;
    global User CreatedBy;
    global Id CreatedById;
    global Datetime LastModifiedDate;
    global User LastModifiedBy;
    global Id LastModifiedById;
    global Datetime SystemModstamp;
    global Datetime LastViewedDate;
    global Datetime LastReferencedDate;
    global String OrchestrationDefinition;
    global String Description;
    global String TriggerType;
    global String OrchestrationType;
    global String NamespacePrefix;
    global String ManageableState;
    global FlowOrchestrationVersion ActiveVersion;
    global Id ActiveVersionId;
    global String Status;
    global Boolean IsCitizenEnabled;
    global String OrchestrationLabel;
    global String ApiName;
    global String InstalledPackageName;
    global Integer RunCount;
    global Double CompletionRate;
    global Integer AverageRunTime;
    global Integer FailedRunCount;
    global Integer ApiVersion;
    global Boolean IsTemplate;
    global FlowOrchestration SourceTemplate;
    global Id SourceTemplateId;
    global Boolean IsOverridable;
    global FlowOrchestration OverriddenBy;
    global Id OverriddenById;
    global FlowOrchestration OverriddenOrchestration;
    global Id OverriddenOrchestrationId;
    global List<FlowOrchestrationVersion> FlowOrchestrationVersions;
    global List<FlowExecutionErrorEvent> ContextRecord;
    global List<FlowOrchestration> OverriddenBy;
    global List<FlowOrchestration> OverriddenOrchestration;
    global List<FlowOrchestration> SourceTemplate;
    global List<FlowOrchestrationVersion> OverriddenBy;
    global List<FlowOrchestrationVersion> OverriddenOrchestration;
    global List<FlowOrchestrationVersion> SourceTemplate;
    global List<FlowOrchestrationVersionChangeEvent> FlowOrchestration;
    global List<FlowOrchestrationVersionChangeEvent> OverriddenBy;
    global List<FlowOrchestrationVersionChangeEvent> OverriddenOrchestration;
    global List<FlowOrchestrationVersionChangeEvent> SourceTemplate;
    global List<FlowRecordRelation> RelatedRecord;

    global FlowOrchestration () 
    {
    }
}