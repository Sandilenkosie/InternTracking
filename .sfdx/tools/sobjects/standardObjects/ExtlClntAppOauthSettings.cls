// This file is generated as an Apex representation of the
//     corresponding sObject and its fields.
// This read-only file is used by the Apex Language Server to
//     provide code smartness, and is deleted each time you
//     refresh your sObject definitions.
// To edit your sObjects and their fields, edit the corresponding
//     .object-meta.xml and .field-meta.xml files.

global class ExtlClntAppOauthSettings {
    global Id Id;
    global Boolean IsDeleted;
    global String DeveloperName;
    global String Language;
    global String MasterLabel;
    global String NamespacePrefix;
    global Datetime CreatedDate;
    global User CreatedBy;
    global Id CreatedById;
    global Datetime LastModifiedDate;
    global User LastModifiedBy;
    global Id LastModifiedById;
    global Datetime SystemModstamp;
    global ExternalClientApplication ExternalClientApplication;
    global Id ExternalClientApplicationId;
    global Boolean OauthScopesSSO;
    global Boolean OauthScopesAPI;
    global Boolean OauthScopesWEB;
    global Boolean OauthScopesFULL;
    global Boolean OauthScopesCHATTER_REST_API;
    global Boolean OauthScopesVF;
    global Boolean OauthScopesREFRESH_TOKEN;
    global Boolean OauthScopesOPENID;
    global Boolean OauthScopesPROFILE;
    global Boolean OauthScopesEMAIL;
    global Boolean OauthScopesADDRESS;
    global Boolean OauthScopesPHONE;
    global Boolean OauthScopesOFFLINE_ACCESS;
    global Boolean OauthScopesCUSTOM_PERMISSIONS;
    global Boolean OauthScopesWAVE_REST_API;
    global Boolean OauthScopesECLAIR_REST_API;
    global Boolean OauthScopesHUB_API;
    global Boolean OauthScopesPARDOT_API;
    global Boolean OauthScopesLIGHTNING;
    global Boolean OauthScopesCONTENT;
    global Boolean OauthScopesCDP_INGEST_API;
    global Boolean OauthScopesCDP_PROFILE_API;
    global Boolean OauthScopesCDP_QUERY_API;
    global Boolean OauthScopesCHATBOT_API;
    global Boolean OauthScopesCDP_SEGMENT_API;
    global Boolean OauthScopesCDP_IDENTITYRESOLUTION_API;
    global Boolean OauthScopesFORGOT_PASSWORD;
    global Boolean OauthScopesCDP_CALCULATED_INSIGHT_API;
    global Boolean OauthScopesUSER_REGISTRATION_API;
    global Boolean OauthScopesSFAP_API;
    global Boolean OauthScopesINTERACTION_API;
    global Boolean OauthScopesCDP_API;
    global Boolean OauthScopesEINSTEIN_GPT_API;
    global Boolean OauthScopesPWDLESS_LOGIN_API;
    global String OauthLink;
    global String SingleLogoutUrl;
    global Boolean ExtlClntAppOauthOptionsFirstPartyAppEnabled;
    global String ClientAssertionCertificate;
    global List<ExtlClntAppOauthIpRange> ExtlClntAppOauthIpRanges;
    global List<ExtlClntAppOauthSetAttr> ExtlClntAppOauthSetAttrs;
    global List<ExtlClntAppOauthSetCustmScp> ExtlClntAppOauthSetCustmScps;
    global List<ExtlClntAppOauthConsumer> ExtlClntAppOauthSettings;

    global ExtlClntAppOauthSettings () 
    {
    }
}