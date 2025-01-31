// This file is generated as an Apex representation of the
//     corresponding sObject and its fields.
// This read-only file is used by the Apex Language Server to
//     provide code smartness, and is deleted each time you
//     refresh your sObject definitions.
// To edit your sObjects and their fields, edit the corresponding
//     .object-meta.xml and .field-meta.xml files.

global class MessagingEndUserChangeEvent {
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
    global String MessageType;
    global String MessagingPlatformKey;
    global String Locale;
    global String ProfilePictureUrl;
    global Boolean HasInitialResponseSent;
    global Account Account;
    global Id AccountId;
    global Contact Contact;
    global Id ContactId;
    global String IsoCountryCode;
    global String MessagingConsentStatus;
    global Lead Lead;
    global Id LeadId;
    global Boolean IsFullyOptedIn;

    global MessagingEndUserChangeEvent () 
    {
    }
}