// This file is generated as an Apex representation of the
//     corresponding sObject and its fields.
// This read-only file is used by the Apex Language Server to
//     provide code smartness, and is deleted each time you
//     refresh your sObject definitions.
// To edit your sObjects and their fields, edit the corresponding
//     .object-meta.xml and .field-meta.xml files.

global class MessagingSessionChangeEvent {
    global Id Id;
    global String ReplayId;
    global Object ChangeEventHeader;
    global User Owner;
    global Id OwnerId;
    global String Name;
    global Datetime CreatedDate;
    global User CreatedBy;
    global Id CreatedById;
    global Datetime LastModifiedDate;
    global User LastModifiedBy;
    global Id LastModifiedById;
    global MessagingChannel MessagingChannel;
    global Id MessagingChannelId;
    global MessagingEndUser MessagingEndUser;
    global Id MessagingEndUserId;
    global String Status;
    global Case Case;
    global Id CaseId;
    global Lead Lead;
    global Id LeadId;
    global Opportunity Opportunity;
    global Id OpportunityId;
    global Datetime AcceptTime;
    global Datetime StartTime;
    global Datetime EndTime;
    global String Origin;
    global String AgentType;
    global String SessionKey;
    global User TargetUser;
    global Id TargetUserId;
    global String ChannelGroup;
    global String ChannelIntent;
    global String ChannelLocale;
    global String EndUserLanguage;
    global Conversation Conversation;
    global Id ConversationId;
    global Account EndUserAccount;
    global Id EndUserAccountId;
    global Contact EndUserContact;
    global Id EndUserContactId;
    global String ChannelType;
    global String ChannelName;
    global String ChannelKey;
    global String PreviewDetails;
    global Integer EndUserMessageCount;
    global Integer AgentMessageCount;
    global String EndedByType;
    global String ChannelEndUserFormula;

    global MessagingSessionChangeEvent () 
    {
    }
}