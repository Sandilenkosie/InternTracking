// This file is generated as an Apex representation of the
//     corresponding sObject and its fields.
// This read-only file is used by the Apex Language Server to
//     provide code smartness, and is deleted each time you
//     refresh your sObject definitions.
// To edit your sObjects and their fields, edit the corresponding
//     .object-meta.xml and .field-meta.xml files.

global class WorkBadgeChangeEvent {
    global Id Id;
    global String ReplayId;
    global Object ChangeEventHeader;
    global Datetime CreatedDate;
    global User CreatedBy;
    global Id CreatedById;
    global Datetime LastModifiedDate;
    global User LastModifiedBy;
    global Id LastModifiedById;
    global WorkThanks Source;
    global Id SourceId;
    global WorkBadgeDefinition Definition;
    global Id DefinitionId;
    global User Recipient;
    global Id RecipientId;
    global User Giver;
    global Id GiverId;
    global String ImageUrl;
    global String Description;
    global String Message;

    global WorkBadgeChangeEvent () 
    {
    }
}