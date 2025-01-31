// This file is generated as an Apex representation of the
//     corresponding sObject and its fields.
// This read-only file is used by the Apex Language Server to
//     provide code smartness, and is deleted each time you
//     refresh your sObject definitions.
// To edit your sObjects and their fields, edit the corresponding
//     .object-meta.xml and .field-meta.xml files.

global class AssetRelationshipChangeEvent {
    global Id Id;
    global String ReplayId;
    global Object ChangeEventHeader;
    global String AssetRelationshipNumber;
    global Datetime CreatedDate;
    global User CreatedBy;
    global Id CreatedById;
    global Datetime LastModifiedDate;
    global User LastModifiedBy;
    global Id LastModifiedById;
    global Asset Asset;
    global Id AssetId;
    global Asset RelatedAsset;
    global Id RelatedAssetId;
    global Datetime FromDate;
    global Datetime ToDate;
    global String RelationshipType;

    global AssetRelationshipChangeEvent () 
    {
    }
}