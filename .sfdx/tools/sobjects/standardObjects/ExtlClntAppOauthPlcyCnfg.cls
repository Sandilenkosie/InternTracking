// This file is generated as an Apex representation of the
//     corresponding sObject and its fields.
// This read-only file is used by the Apex Language Server to
//     provide code smartness, and is deleted each time you
//     refresh your sObject definitions.
// To edit your sObjects and their fields, edit the corresponding
//     .object-meta.xml and .field-meta.xml files.

global class ExtlClntAppOauthPlcyCnfg {
    global Id Id;
    global Boolean IsDeleted;
    global String DeveloperName;
    global String Language;
    global String MasterLabel;
    global Datetime CreatedDate;
    global User CreatedBy;
    global Id CreatedById;
    global Datetime LastModifiedDate;
    global User LastModifiedBy;
    global Id LastModifiedById;
    global Datetime SystemModstamp;
    global ExternalClientApplication ExternalClientApplication;
    global Id ExternalClientApplicationId;
    global String RefreshTokenPolicyType;
    global Integer RefreshTokenValidityPeriod;
    global String RefreshTokenValidityUnit;
    global String IpRelaxationPolicyType;
    global String PermittedUsersPolicyType;
    global Integer SessionTimeoutInMinutes;
    global String RequiredSessionLevel;
    global String PolicyAction;
    global ExtlClntAppOauthSettings ExtlClntAppOauthSettings;
    global Id ExtlClntAppOauthSettingsId;
    global Boolean IsClientCredentialsFlowEnabled;
    global String ClientCredentialsFlowUser;
    global ApexClass ApexHandler;
    global Id ApexHandlerId;
    global User ExecuteHandlerAs;
    global Id ExecuteHandlerAsId;
    global String SingleLogoutUrl;
    global String StartUrl;
    global Boolean IsTokenExchangeFlowEnabled;
    global Boolean IsGuestCodeCredFlowEnabled;
    global Boolean IsNamedUserJwtEnabled;
    global String GuestJwtTimeout;
    global String NamedUserJwtTimeout;
    global List<ExtlClntAppOauthPlcyAttr> ExtlClntAppOauthPlcyAttrs;
    global List<ExtlClntAppOauthPlcyCustmScp> ExtlClntAppOauthPlcyCustmScps;

    global ExtlClntAppOauthPlcyCnfg () 
    {
    }
}