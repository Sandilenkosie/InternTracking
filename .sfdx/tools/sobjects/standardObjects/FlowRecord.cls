// This file is generated as an Apex representation of the
//     corresponding sObject and its fields.
// This read-only file is used by the Apex Language Server to
//     provide code smartness, and is deleted each time you
//     refresh your sObject definitions.
// To edit your sObjects and their fields, edit the corresponding
//     .object-meta.xml and .field-meta.xml files.

global class FlowRecord {
    global Id Id;
    global SObject Owner;
    global Id OwnerId;
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
    global String FlowDefinition;
    global Campaign AssociatedRecord;
    global Id AssociatedRecordId;
    global String Description;
    global String Type;
    global String ProgressStatus;
    global Datetime ScheduledStartDate;
    global String ErrorCode;
    global String ErrorDetails;
    global String FlowCategory;
    global String FlowSubcategory;
    global Boolean IsPaused;
    global String FlowType;
    global String NamespacePrefix;
    global String ManageableState;
    global FlowRecordVersion ActiveVersion;
    global Id ActiveVersionId;
    global Integer ApiVersion;
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
    global String StartSource;
    global Boolean IsCitizenEnabled;
    global String FlowLabel;
    global String ApiName;
    global String InstalledPackageName;
    global String CapacityCategory;
    global List<FlowRecordShare> Shares;
    global List<FlowRecordVersion> FlowRecordVersions;
    global List<FlowRecordVersionOccurrence> FlowRecordVersionOccurrences;
    global List<FlowExecutionErrorEvent> ContextRecord;
    global List<FlowRecord> OverriddenBy;
    global List<FlowRecord> OverriddenFlow;
    global List<FlowRecord> SourceTemplate;
    global List<FlowRecordChangeEvent> OverriddenBy;
    global List<FlowRecordChangeEvent> OverriddenFlow;
    global List<FlowRecordChangeEvent> SourceTemplate;
    global List<FlowRecordRelation> RelatedRecord;
    global List<FlowRecordVersion> OverriddenBy;
    global List<FlowRecordVersion> OverriddenFlow;
    global List<FlowRecordVersion> SourceTemplate;
    global List<FlowRecordVersionChangeEvent> FlowRecord;
    global List<FlowRecordVersionChangeEvent> OverriddenBy;
    global List<FlowRecordVersionChangeEvent> OverriddenFlow;
    global List<FlowRecordVersionChangeEvent> SourceTemplate;

    global FlowRecord () 
    {
    }
}