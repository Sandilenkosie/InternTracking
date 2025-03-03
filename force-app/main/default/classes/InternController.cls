public with sharing class InternController {
    public class InternWrapper {
        @AuraEnabled public List<Certified__c> certificates { get; set; }
        @AuraEnabled public List<Onboarding__c> onboardings { get; set; }
    }
    
    @AuraEnabled(cacheable=true)
    public static InternWrapper getInternDetails(Id internId) {
        if (internId == null) {
            throw new AuraHandledException('Intern ID is required.');
        }
        
        InternWrapper wrapper = new InternWrapper();

        // Fetch related certificates
        wrapper.certificates = [
            SELECT Id, Certificate__r.Name, Expiration_Date__c, Status__c, Issued_Date__c, Score__c, Issuing_Authority__c
            FROM Certified__c
            WHERE User__c IN (
                SELECT User__c 
                FROM Intern__c 
                WHERE Id = :internId
            )
        ];

        // Fetch onboardings for the intern where the Assigned_To__c matches the current user
        wrapper.onboardings = [
            SELECT Id, 
            Name, 
            Assigned_To__c, 
            Assigned_Date__c, 
            Returned_Date__c, 
            Type__c, 
            Status__c,
            Description__c, 
            Special_Terms__c,
            Condition_Before__c,
            Condition_After__c,
            Serial_Number__c
            FROM Onboarding__c 
            WHERE Assigned_To__c = :UserInfo.getUserId()
        ];
        
        return wrapper;
    }


    @AuraEnabled
    public static Boolean shouldShowOnboardingForm(Id onboardingId) {
        try {
            // Query for the Onboarding__c record
            Onboarding__c onboardingRecord = [SELECT Id, Assigned_To__c, Signature__c FROM Onboarding__c WHERE Id = :onboardingId LIMIT 1];

            // Check if the onboarding record exists and if it matches the current user and the signature is null
            if (onboardingRecord != null && onboardingRecord.Assigned_To__c == UserInfo.getUserId() && onboardingRecord.Signature__c == null) {
                return true;
            }
        } catch (QueryException e) {
            // Optional: You can add debug logging if needed, but it's not critical to handle this way
            System.debug('Error: No onboarding record found for Id ' + onboardingId);
        }

        return false;
    }
}