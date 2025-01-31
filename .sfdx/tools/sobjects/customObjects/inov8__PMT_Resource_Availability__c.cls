// This file is generated as an Apex representation of the
//     corresponding sObject and its fields.
// This read-only file is used by the Apex Language Server to
//     provide code smartness, and is deleted each time you
//     refresh your sObject definitions.
// To edit your sObjects and their fields, edit the corresponding
//     .object-meta.xml and .field-meta.xml files.

global class inov8__PMT_Resource_Availability__c {
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
    global Double inov8__Apr__c;
    global Double inov8__Aug__c;
    global Double inov8__Dec__c;
    global Double inov8__Feb__c;
    global String inov8__Fiscal_Year__c;
    global Double inov8__Jan__c;
    global Double inov8__Jul__c;
    global Double inov8__Jun__c;
    global Double inov8__Mar__c;
    global Double inov8__May__c;
    global Double inov8__Nov__c;
    global Double inov8__Oct__c;
    global Double inov8__Sep__c;
    global User inov8__User__r;
    global Id inov8__User__c;
    global Double inov8__Apr_Remaining__c;
    global Double inov8__Aug_Remaining__c;
    global Double inov8__Dec_Remaining__c;
    global Date inov8__End_Date__c;
    global Double inov8__Feb_Remaining__c;
    global Double inov8__Jan_Remaining__c;
    global Double inov8__Jul_Remaining__c;
    global Double inov8__Jun_Remaining__c;
    global Double inov8__Mar_Remaining__c;
    global Double inov8__May_Remaining__c;
    global Double inov8__Nov_Remaining__c;
    global Double inov8__Oct_Remaining__c;
    global String inov8__Resource_Name_FY__c;
    global Double inov8__Sep_Remaining__c;
    global Date inov8__Start_Date__c;
    global String inov8__User_Department__c;
    global String inov8__User_Id__c;
    global Boolean inov8__User_IsActive__c;
    global String inov8__User_Name__c;
    global Boolean inov8__is_Dummy_Availability__c;
    global Double inov8__Apr_Actual_Hours__c;
    global Double inov8__Apr_Allocation__c;
    global Double inov8__Aug_Actual_Hours__c;
    global Double inov8__Aug_Allocation__c;
    global Double inov8__Dec_Actual_Hours__c;
    global Double inov8__Dec_Allocation__c;
    global Double inov8__Feb_Actual_Hours__c;
    global Double inov8__Feb_Allocation__c;
    global Double inov8__Jan_Actual_Hours__c;
    global Double inov8__Jan_Allocation__c;
    global Double inov8__Jul_Actual_Hours__c;
    global Double inov8__Jul_Allocation__c;
    global Double inov8__Jun_Actual_Hours__c;
    global Double inov8__Jun_Allocation__c;
    global Double inov8__Mar_Actual_Hours__c;
    global Double inov8__Mar_Allocation__c;
    global Double inov8__May_Actual_Hours__c;
    global Double inov8__May_Allocation__c;
    global Double inov8__Nov_Actual_Hours__c;
    global Double inov8__Nov_Allocation__c;
    global Double inov8__Oct_Actual_Hours__c;
    global Double inov8__Oct_Allocation__c;
    global Double inov8__Sep_Actual_Hours__c;
    global Double inov8__Sep_Allocation__c;
    global List<AttachedContentDocument> AttachedContentDocuments;
    global List<Attachment> Attachments;
    global List<CollaborationGroupRecord> RecordAssociatedGroups;
    global List<CombinedAttachment> CombinedAttachments;
    global List<ContactRequest> ContactRequests;
    global List<ContentDocumentLink> ContentDocumentLinks;
    global List<DuplicateRecordItem> DuplicateRecordItems;
    global List<EntitySubscription> FeedSubscriptionsForEntity;
    global List<FinanceBalanceSnapshot> FinanceBalanceSnapshots;
    global List<FinanceTransaction> DestinationFinanceTransactions;
    global List<FinanceTransaction> FinanceTransactions;
    global List<FinanceTransaction> ParentFinanceTransactions;
    global List<FinanceTransaction> FinanceTransactions;
    global List<FinanceTransaction> SourceFinanceTransactions;
    global List<FlowOrchestrationWorkItem> FlowOrchestrationWorkItems;
    global List<Note> Notes;
    global List<NoteAndAttachment> NotesAndAttachments;
    global List<ProcessException> ProcessExceptions;
    global List<ProcessInstance> ProcessInstances;
    global List<ProcessInstanceHistory> ProcessSteps;
    global List<RecordAction> RecordActions;
    global List<RecordActionHistory> RecordActionHistories;
    global List<TopicAssignment> TopicAssignments;
    global List<UserDefinedLabelAssignment> UserDefinedLabelAssignments;
    global List<inov8__PMT_Resource_Allocation__c> inov8__Allocations__r;
    global List<inov8__PMT_Resource_Availability__Feed> Feeds;
    global List<inov8__PMT_Resource_Availability__History> Histories;
    global List<inov8__PMT_Resource_Availability__Share> Shares;
    global List<AIInsightValue> SobjectLookupValue;
    global List<AIRecordInsight> Target;
    global List<CollaborationGroupRecordChangeEvent> Record;
    global List<ContentDistribution> RelatedRecord;
    global List<ContentDocumentLinkChangeEvent> LinkedEntity;
    global List<ContentVersion> FirstPublishLocation;
    global List<EmailMessageChangeEvent> RelatedTo;
    global List<EventChangeEvent> What;
    global List<EventRelationChangeEvent> Relation;
    global List<FeedComment> Parent;
    global List<FinanceBalanceSnapshotChangeEvent> LegalEntity;
    global List<FinanceBalanceSnapshotChangeEvent> ReferenceEntity;
    global List<FinanceTransactionChangeEvent> DestinationEntity;
    global List<FinanceTransactionChangeEvent> LegalEntity;
    global List<FinanceTransactionChangeEvent> ParentReferenceEntity;
    global List<FinanceTransactionChangeEvent> ReferenceEntity;
    global List<FinanceTransactionChangeEvent> SourceEntity;
    global List<FlowExecutionErrorEvent> ContextRecord;
    global List<FlowRecordRelation> RelatedRecord;
    global List<ProcessExceptionChangeEvent> AttachedTo;
    global List<ProcessInstanceChangeEvent> TargetObject;
    global List<TaskChangeEvent> What;

    global inov8__PMT_Resource_Availability__c () 
    {
    }
}