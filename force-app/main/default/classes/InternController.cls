public with sharing class InternController {
    public class InternWrapper {
        @AuraEnabled
        public List<Certified__c> certificates { get; set; }
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
        
        return wrapper;
    }
}