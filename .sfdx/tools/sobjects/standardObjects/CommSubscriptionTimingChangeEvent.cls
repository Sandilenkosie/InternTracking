// This file is generated as an Apex representation of the
//     corresponding sObject and its fields.
// This read-only file is used by the Apex Language Server to
//     provide code smartness, and is deleted each time you
//     refresh your sObject definitions.
// To edit your sObjects and their fields, edit the corresponding
//     .object-meta.xml and .field-meta.xml files.

global class CommSubscriptionTimingChangeEvent {
    global Id Id;
    global String ReplayId;
    global Object ChangeEventHeader;
    global String Name;
    global Datetime CreatedDate;
    global User CreatedBy;
    global Id CreatedById;
    global Datetime LastModifiedDate;
    global User LastModifiedBy;
    global Id LastModifiedById;
    /* The communication subscription consent record associated with the communication subscription timing.
    */
    global CommSubscriptionConsent CommSubscriptionConsent;
    /* The communication subscription consent record associated with the communication subscription timing.
    */
    global Id CommSubscriptionConsentId;
    /* The unit of time that works with Offset to determine the communication timing.
    */
    global String Unit;

    global CommSubscriptionTimingChangeEvent () 
    {
    }
}