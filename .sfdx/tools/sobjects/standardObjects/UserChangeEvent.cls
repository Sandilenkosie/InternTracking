// This file is generated as an Apex representation of the
//     corresponding sObject and its fields.
// This read-only file is used by the Apex Language Server to
//     provide code smartness, and is deleted each time you
//     refresh your sObject definitions.
// To edit your sObjects and their fields, edit the corresponding
//     .object-meta.xml and .field-meta.xml files.

global class UserChangeEvent {
    global Id Id;
    global String ReplayId;
    global Object ChangeEventHeader;
    global String Username;
    global String LastName;
    global String FirstName;
    global String Name;
    global String CompanyName;
    global String Division;
    global String Department;
    global String Title;
    global String Street;
    global String City;
    global String State;
    global String PostalCode;
    global String Country;
    global Double Latitude;
    global Double Longitude;
    global String GeocodeAccuracy;
    global Address Address;
    global String Email;
    global Boolean EmailPreferencesAutoBcc;
    global Boolean EmailPreferencesAutoBccStayInTouch;
    global Boolean EmailPreferencesStayInTouchReminder;
    global String SenderEmail;
    global String SenderName;
    global String Signature;
    global String StayInTouchSubject;
    global String StayInTouchSignature;
    global String StayInTouchNote;
    global String Phone;
    global String Fax;
    global String MobilePhone;
    global String Alias;
    global String CommunityNickname;
    global Boolean IsActive;
    global String TimeZoneSidKey;
    global UserRole UserRole;
    global Id UserRoleId;
    global String LocaleSidKey;
    global Boolean ReceivesInfoEmails;
    global Boolean ReceivesAdminInfoEmails;
    global String EmailEncodingKey;
    global Profile Profile;
    global Id ProfileId;
    global String UserType;
    global String LanguageLocaleKey;
    global String EmployeeNumber;
    global SObject DelegatedApprover;
    global Id DelegatedApproverId;
    global User Manager;
    global Id ManagerId;
    global Datetime LastLoginDate;
    global Datetime LastPasswordChangeDate;
    global Datetime CreatedDate;
    global User CreatedBy;
    global Id CreatedById;
    global Datetime LastModifiedDate;
    global User LastModifiedBy;
    global Id LastModifiedById;
    global Integer NumberOfFailedLogins;
    global Datetime OfflineTrialExpirationDate;
    global Datetime OfflinePdaTrialExpirationDate;
    global Boolean UserPermissionsMarketingUser;
    global Boolean UserPermissionsOfflineUser;
    global Boolean UserPermissionsCallCenterAutoLogin;
    global Boolean UserPermissionsSFContentUser;
    global Boolean UserPermissionsKnowledgeUser;
    global Boolean UserPermissionsInteractionUser;
    global Boolean UserPermissionsSupportUser;
    global Boolean UserPermissionsJigsawProspectingUser;
    global Boolean UserPermissionsSiteforceContributorUser;
    global Boolean UserPermissionsSiteforcePublisherUser;
    global Boolean UserPermissionsWorkDotComUserFeature;
    global Boolean ForecastEnabled;
    global Boolean UserPreferencesActivityRemindersPopup;
    global Boolean UserPreferencesEventRemindersCheckboxDefault;
    global Boolean UserPreferencesTaskRemindersCheckboxDefault;
    global Boolean UserPreferencesReminderSoundOff;
    global Boolean UserPreferencesDisableAllFeedsEmail;
    global Boolean UserPreferencesDisableFollowersEmail;
    global Boolean UserPreferencesDisableProfilePostEmail;
    global Boolean UserPreferencesDisableChangeCommentEmail;
    global Boolean UserPreferencesDisableLaterCommentEmail;
    global Boolean UserPreferencesDisProfPostCommentEmail;
    global Boolean UserPreferencesContentNoEmail;
    global Boolean UserPreferencesContentEmailAsAndWhen;
    global Boolean UserPreferencesApexPagesDeveloperMode;
    global Boolean UserPreferencesReceiveNoNotificationsAsApprover;
    global Boolean UserPreferencesReceiveNotificationsAsDelegatedApprover;
    global Boolean UserPreferencesHideCSNGetChatterMobileTask;
    global Boolean UserPreferencesDisableMentionsPostEmail;
    global Boolean UserPreferencesDisMentionsCommentEmail;
    global Boolean UserPreferencesHideCSNDesktopTask;
    global Boolean UserPreferencesHideChatterOnboardingSplash;
    global Boolean UserPreferencesHideSecondChatterOnboardingSplash;
    global Boolean UserPreferencesDisCommentAfterLikeEmail;
    global Boolean UserPreferencesDisableLikeEmail;
    global Boolean UserPreferencesSortFeedByComment;
    global Boolean UserPreferencesDisableMessageEmail;
    global Boolean UserPreferencesJigsawListUser;
    global Boolean UserPreferencesDisableBookmarkEmail;
    global Boolean UserPreferencesDisableSharePostEmail;
    global Boolean UserPreferencesActionLauncherEinsteinGptConsent;
    global Boolean UserPreferencesAssistiveActionsEnabledInActionLauncher;
    global Boolean UserPreferencesEnableAutoSubForFeeds;
    global Boolean UserPreferencesDisableFileShareNotificationsForApi;
    global Boolean UserPreferencesShowTitleToExternalUsers;
    global Boolean UserPreferencesShowManagerToExternalUsers;
    global Boolean UserPreferencesShowEmailToExternalUsers;
    global Boolean UserPreferencesShowWorkPhoneToExternalUsers;
    global Boolean UserPreferencesShowMobilePhoneToExternalUsers;
    global Boolean UserPreferencesShowFaxToExternalUsers;
    global Boolean UserPreferencesShowStreetAddressToExternalUsers;
    global Boolean UserPreferencesShowCityToExternalUsers;
    global Boolean UserPreferencesShowStateToExternalUsers;
    global Boolean UserPreferencesShowPostalCodeToExternalUsers;
    global Boolean UserPreferencesShowCountryToExternalUsers;
    global Boolean UserPreferencesShowProfilePicToGuestUsers;
    global Boolean UserPreferencesShowTitleToGuestUsers;
    global Boolean UserPreferencesShowCityToGuestUsers;
    global Boolean UserPreferencesShowStateToGuestUsers;
    global Boolean UserPreferencesShowPostalCodeToGuestUsers;
    global Boolean UserPreferencesShowCountryToGuestUsers;
    global Boolean UserPreferencesShowForecastingChangeSignals;
    global Boolean UserPreferencesLiveAgentMiawSetupDeflection;
    global Boolean UserPreferencesHideS1BrowserUI;
    global Boolean UserPreferencesDisableEndorsementEmail;
    global Boolean UserPreferencesPathAssistantCollapsed;
    global Boolean UserPreferencesCacheDiagnostics;
    global Boolean UserPreferencesShowEmailToGuestUsers;
    global Boolean UserPreferencesShowManagerToGuestUsers;
    global Boolean UserPreferencesShowWorkPhoneToGuestUsers;
    global Boolean UserPreferencesShowMobilePhoneToGuestUsers;
    global Boolean UserPreferencesShowFaxToGuestUsers;
    global Boolean UserPreferencesShowStreetAddressToGuestUsers;
    global Boolean UserPreferencesLightningExperiencePreferred;
    global Boolean UserPreferencesPreviewLightning;
    global Boolean UserPreferencesHideEndUserOnboardingAssistantModal;
    global Boolean UserPreferencesHideLightningMigrationModal;
    global Boolean UserPreferencesHideSfxWelcomeMat;
    global Boolean UserPreferencesHideBiggerPhotoCallout;
    global Boolean UserPreferencesGlobalNavBarWTShown;
    global Boolean UserPreferencesGlobalNavGridMenuWTShown;
    global Boolean UserPreferencesCreateLEXAppsWTShown;
    global Boolean UserPreferencesFavoritesWTShown;
    global Boolean UserPreferencesRecordHomeSectionCollapseWTShown;
    global Boolean UserPreferencesRecordHomeReservedWTShown;
    global Boolean UserPreferencesFavoritesShowTopFavorites;
    global Boolean UserPreferencesExcludeMailAppAttachments;
    global Boolean UserPreferencesSuppressTaskSFXReminders;
    global Boolean UserPreferencesSuppressEventSFXReminders;
    global Boolean UserPreferencesPreviewCustomTheme;
    global Boolean UserPreferencesHasCelebrationBadge;
    global Boolean UserPreferencesUserDebugModePref;
    global Boolean UserPreferencesSRHOverrideActivities;
    global Boolean UserPreferencesNewLightningReportRunPageEnabled;
    global Boolean UserPreferencesReverseOpenActivitiesView;
    global Boolean UserPreferencesHasSentWarningEmail;
    global Boolean UserPreferencesHasSentWarningEmail238;
    global Boolean UserPreferencesHasSentWarningEmail240;
    global Boolean UserPreferencesNativeEmailClient;
    global Boolean UserPreferencesShowForecastingRoundedAmounts;
    global Contact Contact;
    global Id ContactId;
    global Account Account;
    global Id AccountId;
    global CallCenter CallCenter;
    global Id CallCenterId;
    global String Extension;
    global String FederationIdentifier;
    global String AboutMe;
    global String DigestFrequency;
    global String DefaultGroupNotificationFrequency;
    global Integer JigsawImportLimitOverride;
    global Boolean IsProfilePhotoActive;
    global Individual Individual;
    global Id IndividualId;
    global String inov8__PMT_Manager_Name__c;
    global Boolean inov8__Is_PMT_User_consider_for_Availability__c;
    global String ID_Number__c;

    global UserChangeEvent () 
    {
    }
}