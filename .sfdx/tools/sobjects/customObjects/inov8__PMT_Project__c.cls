// This file is generated as an Apex representation of the
//     corresponding sObject and its fields.
// This read-only file is used by the Apex Language Server to
//     provide code smartness, and is deleted each time you
//     refresh your sObject definitions.
// To edit your sObjects and their fields, edit the corresponding
//     .object-meta.xml and .field-meta.xml files.

global class inov8__PMT_Project__c {
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
    global Date LastActivityDate;
    global Datetime LastViewedDate;
    global Datetime LastReferencedDate;
    global String inov8__Level_of_Effort__c;
    global String inov8__Owner_s_Department__c;
    global String inov8__Processes_Impacted__c;
    global String inov8__Project_Category__c;
    /* On Track = Will meet deadline / At Risk = At risk for missing deadline / Late = Will miss deadline
    */
    global String inov8__Project_Health__c;
    global String inov8__Project_Initiator__c;
    global String inov8__Project_Lead__c;
    global String inov8__Project_Owner__c;
    global String inov8__Project_Status__c;
    global String inov8__Roadmap_Status__c;
    global Double inov8__Sum_of_tasks_count__c;
    global String inov8__Assumptions__c;
    /* Business objectives: Requested solution description and expected result. Mention if this is a global solution or call out if there is any variation by region.
    */
    global String inov8__Business_Case__c;
    /* A general description of the project.
    */
    global String inov8__Description__c;
    global Date inov8__Go_Live_Date__c;
    /* objective, issue being addressed, target, how will the project be measured.
    */
    global String inov8__Goal_Statement__c;
    global String inov8__Health_Comment__c;
    global String inov8__In_Scope__c;
    global Date inov8__Initial_End_Date__c;
    global Date inov8__Initial_Start_Date__c;
    global Boolean inov8__IsTemplate__c;
    /* Identify and explain the risk if this request is not deployed
    */
    global String inov8__Issues_Risk__c;
    global String inov8__Out_of_Scope__c;
    global User inov8__PMO_Contact__r;
    global Id inov8__PMO_Contact__c;
    global String inov8__Path_to_Green__c;
    global String inov8__Portfolio__c;
    /* What process/system limitations are causing this activity. Describe your pain points.
    */
    global String inov8__Problem_Statement__c;
    global inov8__PMT_Program__c inov8__Program__r;
    global Id inov8__Program__c;
    global String inov8__Release_Changes__c;
    global Date inov8__Release_Date__c;
    global String inov8__SOX_Comment__c;
    global Boolean inov8__SOX_Impact__c;
    global String inov8__Sponsor__c;
    /* Please hold 'Ctrl' for selecting multiple options
    */
    global String inov8__SystemsImpacted__c;
    global Double inov8__Days_to_go__c;
    global Date inov8__Deadline_formula__c;
    global Double inov8__Duration__c;
    global String inov8__End_Fiscal_Year__c;
    global Double inov8__Fiscal_Year_Difference__c;
    global String inov8__Health_Icon__c;
    global Date inov8__Kickoff_formula__c;
    global Double inov8__Percentage_Completion__c;
    global String inov8__Program_Text__c;
    global String inov8__Project_Completion_Image__c;
    global String inov8__Project_End_Month__c;
    global Double inov8__Project_Size__c;
    global String inov8__Project_Start_Month__c;
    global String inov8__Qtr_of_Completion__c;
    global String inov8__Release_Qtr__c;
    global String inov8__Start_Fiscal_Year__c;
    global Date inov8__Deadline__c;
    global Date inov8__Deadline_parent_phase__c;
    global Date inov8__Start_Date_Rollup__c;
    global Date inov8__Start_Date_from_parent_phase__c;
    global Double inov8__Sum_Wheigted_perc__c;
    global Double inov8__Sum_of_Task_Duration__c;
    global Double inov8__Sum_of_sum_of_percentage_completion__c;
    global Double inov8__Sum_of_task_count_child_project__c;
    global List<ActivityHistory> ActivityHistories;
    global List<AttachedContentDocument> AttachedContentDocuments;
    global List<Attachment> Attachments;
    global List<Case> inov8__Cases__r;
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
    global List<inov8__PMT_Phase__c> inov8__Project_Phases__r;
    global List<inov8__PMT_Project__Feed> Feeds;
    global List<inov8__PMT_Project__History> Histories;
    global List<inov8__PMT_Project__Share> Shares;
    global List<inov8__PMT_Resource_Allocation__c> inov8__Resource_Allocations__r;
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

    global inov8__PMT_Project__c () 
    {
    }
}