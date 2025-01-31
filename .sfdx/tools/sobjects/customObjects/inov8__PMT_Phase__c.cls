// This file is generated as an Apex representation of the
//     corresponding sObject and its fields.
// This read-only file is used by the Apex Language Server to
//     provide code smartness, and is deleted each time you
//     refresh your sObject definitions.
// To edit your sObjects and their fields, edit the corresponding
//     .object-meta.xml and .field-meta.xml files.

global class inov8__PMT_Phase__c {
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
    global inov8__PMT_Project__c inov8__Project__r;
    global Id inov8__Project__c;
    global String inov8__Phase_Health__c;
    global Double inov8__Phases_with_completed_tasks__c;
    global Double inov8__Task_Count__c;
    global Date inov8__End_date_from_child__c;
    /* A general description of the phase.
    */
    global String inov8__Phase_Description__c;
    global Date inov8__Start_date_from_child_project__c;
    global Double inov8__Sum_of_tasks_count_child__c;
    global String inov8__Daily_progress__c;
    global Double inov8__Days_to_go__c;
    global Date inov8__Deadline_formula__c;
    global Double inov8__Duration__c;
    global Double inov8__Expected_age_of_completion__c;
    global String inov8__Health_Icon__c;
    global Date inov8__Kickoff_formula__c;
    global Double inov8__Length__c;
    global Double inov8__Percentage_Completion_without_child__c;
    global String inov8__Phase_Completion_Image__c;
    global Double inov8__Phase_Completion__c;
    global Double inov8__Phase_Weighted_Perc__c;
    global String inov8__Project_Name__c;
    global Date inov8__End_Date_Rollup__c;
    global Date inov8__Start_Date_Rollup__c;
    global Double inov8__Sum_Of_Task_Completion__c;
    global Double inov8__Sum_Task_Duration__c;
    global Double inov8__Sum_Weighted_perc__c;
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
    global List<inov8__PMT_Phase__Feed> Feeds;
    global List<inov8__PMT_Phase__History> Histories;
    global List<inov8__PMT_Task__c> inov8__Project_Tasks__r;
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

    global inov8__PMT_Phase__c () 
    {
    }
}