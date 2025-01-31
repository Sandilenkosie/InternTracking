// This file is generated as an Apex representation of the
//     corresponding sObject and its fields.
// This read-only file is used by the Apex Language Server to
//     provide code smartness, and is deleted each time you
//     refresh your sObject definitions.
// To edit your sObjects and their fields, edit the corresponding
//     .object-meta.xml and .field-meta.xml files.

global class CommSubscriptionChannelTypeChangeEvent {
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
    /* The communication subscription record associated with the communication subscription channel type.
    */
    global CommSubscription CommunicationSubscription;
    /* The communication subscription record associated with the communication subscription channel type.
    */
    global Id CommunicationSubscriptionId;
    /* The engagement channel type record associated with the communication subscription channel type.
    */
    global EngagementChannelType EngagementChannelType;
    /* The engagement channel type record associated with the communication subscription channel type.
    */
    global Id EngagementChannelTypeId;
    global CommSubscription DataUsePurpose;
    global Id DataUsePurposeId;
    global MessagingChannel MessagingChannel;
    global Id MessagingChannelId;
    global MessagingChannelUsage MessagingChannelUsage;
    global Id MessagingChannelUsageId;

    global CommSubscriptionChannelTypeChangeEvent () 
    {
    }
}