// This file is generated as an Apex representation of the
//     corresponding sObject and its fields.
// This read-only file is used by the Apex Language Server to
//     provide code smartness, and is deleted each time you
//     refresh your sObject definitions.
// To edit your sObjects and their fields, edit the corresponding
//     .object-meta.xml and .field-meta.xml files.

global class inov8__PMT_Task__c {
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
    global Date LastActivityDate;
    global Datetime LastViewedDate;
    global Datetime LastReferencedDate;
    /* The phase that this task is assigned to.
    */
    global inov8__PMT_Phase__c inov8__Phase__r;
    /* The phase that this task is assigned to.
    */
    global Id inov8__Phase__c;
    global String inov8__Sign_off_status__c;
    global String inov8__Status__c;
    global User inov8__Assigned_To1__r;
    global Id inov8__Assigned_To1__c;
    global Boolean inov8__Checklist_Selected__c;
    /* The general description of the task. For example, what is the purpose of the task.
    */
    global String inov8__Description__c;
    /* The date this task is due to be completed
    */
    global Date inov8__Due_Date__c;
    global Double inov8__Duration_In_Days__c;
    global Boolean inov8__Is_Milestone__c;
    global Boolean inov8__Is_Recurring__c;
    /* If blocked, why?
    */
    global String inov8__On_Hold_Reason__c;
    global Double inov8__Percentage_Completion__c;
    /* When should this task start by?
    */
    global Date inov8__Start_Date__c;
    global Double inov8__Start_Days_Out__c;
    global Double inov8__Task_Level__c;
    global String inov8__Topic__c;
    global String inov8__Alert__c;
    global String inov8__Assigned_To_Email__c;
    global Double inov8__Days_Late__c;
    global Double inov8__Duration__c;
    global Boolean inov8__IsTemplate__c;
    global String inov8__My_Task__c;
    global String inov8__Phase_Name__c;
    global String inov8__Project_Id__c;
    global String inov8__Project_Name__c;
    global String inov8__Status_Icon_Name__c;
    global String inov8__Status_Icon__c;
    global Double inov8__Task_Level_formula__c;
    global String inov8__Task_Name_w_Alert__c;
    global Double inov8__Weighted_percentage__c;
    global List<ActivityHistory> ActivityHistories;
    global List<AttachedContentDocument> AttachedContentDocuments;
    global List<Attachment> Attachments;
    global List<CollaborationGroupRecord> RecordAssociatedGroups;
    global List<CombinedAttachment> CombinedAttachments;
    global List<ContactRequest> ContactRequests;
    global List<ContentDocumentLink> ContentDocumentLinks;
    global List<DuplicateRecordItem> DuplicateRecordItems;
    global List<EmailMessage> Emails;
    global List<EntitySubscription> FeedSubscriptionsForEntity;
    global List<Event> Events;
    global List<FinanceBalanceSnapshot> FinanceBalanceSnapshots;
    global List<FinanceTransaction> DestinationFinanceTransactions;
    global List<FinanceTransaction> FinanceTransactions;
    global List<FinanceTransaction> ParentFinanceTransactions;
    global List<FinanceTransaction> FinanceTransactions;
    global List<FinanceTransaction> SourceFinanceTransactions;
    global List<FlowOrchestrationWorkItem> FlowOrchestrationWorkItems;
    global List<Note> Notes;
    global List<NoteAndAttachment> NotesAndAttachments;
    global List<OpenActivity> OpenActivities;
    global List<ProcessException> ProcessExceptions;
    global List<ProcessInstance> ProcessInstances;
    global List<ProcessInstanceHistory> ProcessSteps;
    global List<RecordAction> RecordActions;
    global List<RecordActionHistory> RecordActionHistories;
    global List<Task> Tasks;
    global List<TopicAssignment> TopicAssignments;
    global List<UserDefinedLabelAssignment> UserDefinedLabelAssignments;
    global List<inov8__PMT_Task__Feed> Feeds;
    global List<inov8__PMT_Task__History> Histories;
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
    global List<OutgoingEmail> RelatedTo;
    global List<ProcessExceptionChangeEvent> AttachedTo;
    global List<ProcessInstanceChangeEvent> TargetObject;
    global List<TaskChangeEvent> What;

    global inov8__PMT_Task__c () 
    {
    }
}