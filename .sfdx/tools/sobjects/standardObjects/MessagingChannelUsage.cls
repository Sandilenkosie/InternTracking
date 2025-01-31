// This file is generated as an Apex representation of the
//     corresponding sObject and its fields.
// This read-only file is used by the Apex Language Server to
//     provide code smartness, and is deleted each time you
//     refresh your sObject definitions.
// To edit your sObjects and their fields, edit the corresponding
//     .object-meta.xml and .field-meta.xml files.

global class MessagingChannelUsage {
    global Id Id;
    global Boolean IsDeleted;
    global Datetime CreatedDate;
    global User CreatedBy;
    global Id CreatedById;
    global Datetime LastModifiedDate;
    global User LastModifiedBy;
    global Id LastModifiedById;
    global Datetime SystemModstamp;
    global MessagingChannel MessagingChannel;
    global Id MessagingChannelId;
    global String DeploymentType;
    global String DeploymentStatus;
    global String ErrorReason;
    global String RoutingOverride;
    global Datetime DisabledTime;
    /* The level of customer consent required for your company to message them on this channel. Customers can opt out any time. If you don’t see a particular consent level, this channel type doesn’t allow it. Implicit Opt-In: By sending an initial message to your company, the customer agrees to receive messages. Explicit Opt-In and Double Opt-In: The customer uses keywords to actively opt into receiving messages.
    */
    global String ConsentType;
    global List<CommSubscriptionChannelType> MessagingChannelUsages;
    global List<CommSubscriptionChannelTypeChangeEvent> MessagingChannelUsage;

    global MessagingChannelUsage () 
    {
    }
}