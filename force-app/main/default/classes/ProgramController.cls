public with sharing class ProgramController {
    public class ProgramWrapper {
        @AuraEnabled public Program__c program;
        @AuraEnabled public List<Certificate__c> certificates {get; set;}
        @AuraEnabled public List<Onboarding__c> onboardings {get; set;}
        @AuraEnabled public List<Intern__c> interns;
        @AuraEnabled public List<Training_Program__c> trainings {get; set;}
		@AuraEnabled public List<User> users {get; set;}
        @AuraEnabled public List<Contact> contacts {get; set;}
    }
    
    @AuraEnabled(cacheable=true)
    public static ProgramWrapper getProgramDetails(Id programId) {
        if (programId == null) {
            throw new AuraHandledException('Program ID is required.');
        }
        
        ProgramWrapper wrapper = new ProgramWrapper();
        wrapper.program = [
            SELECT Id, Name, Department__c, Program_Type__c, Start_Date__c, End_Date__c,
            (SELECT Id, Name, User__c, User__r.Name FROM Interns__r)
            FROM Program__c WHERE Id = :programId
        ];
        
        wrapper.certificates = [
            SELECT Id, Name, Required__c, Authority_By__c
            FROM Certificate__c WHERE Program__c = :programId
        ];
        
        wrapper.onboardings = [
            SELECT Id, Name, Assigned_To__c, Assigned_To__r.Name,
            (SELECT Id,
                Name,
                Assigned_Date__c,
                Condition_After__c,
                Condition_Before__c, 
                Contact__c,
                Returned_Date__c,
                Serial_Number__c,
                Status__c, 
                Onboarding__c 
            FROM Assets__r)
            FROM Onboarding__c WHERE Program__c = :programId
        ];
          
        
        wrapper.interns = [
            SELECT Id, Name, User__c, User__r.Name, Training_Program__c, Training_Program__r.Name
            FROM Intern__c WHERE Program__c = :programId
        ];
        
        wrapper.trainings = [
            SELECT Id, Name
            FROM Training_Program__c
        ];
        
        wrapper.users = [
            SELECT Id, Name, Profile.Name
            FROM User 
            WHERE IsActive = true
            AND CreatedById = :UserInfo.getUserId()
			// AND Profile.Name IN ('Intern')
        ];
        
        wrapper.contacts = [
            SELECT Id, Name, Account.Name
            FROM Contact 
        ];
  		 return wrapper;
    }
    
    @AuraEnabled
    public static void updateProgram(Map<String, Object> program) {
        try {
            // Validate that the program map contains an Id
            if (!program.containsKey('Id') || String.isBlank((String) program.get('Id'))) {
                throw new AuraHandledException('Program Id is required for updating.');
            }
    
            // Retrieve the program record to update
            Program__c prog = [
                SELECT Id, Name, Department__c, Program_Type__c, Start_Date__c, End_Date__c
                FROM Program__c
                WHERE Id = :((String) program.get('Id'))
                LIMIT 1
            ];
    
            // Update fields from the provided map
            prog.Name = (String) program.get('Name');
            prog.Department__c = (String) program.get('Department__c');
            prog.Program_Type__c = (String) program.get('Program_Type__c');
            prog.Start_Date__c = parseDate((String) program.get('Start_Date__c'));
            prog.End_Date__c = parseDate((String) program.get('End_Date__c'));
    
            // Perform the update
            update prog;
    
        } catch (QueryException qe) {
            throw new AuraHandledException('Program record with the provided Id does not exist.');
        } catch (DmlException de) {
            throw new AuraHandledException('Error while updating the Program record: ' + de.getMessage());
        } catch (Exception e) {
            throw new AuraHandledException('Unexpected error: ' + e.getMessage());
        }
    }
    

    @AuraEnabled
    public static void createCertificates(List<Map<String, Object>> certificates, Id programId) {
        try {
            // Process Certificate records
            List<Certificate__c> certificateRecords = new List<Certificate__c>();
            for (Map<String, Object> cert : certificates) {
                Certificate__c certificate = new Certificate__c();
  
                certificate.Id = (Id) cert.get('Id');
                certificate.Name = (String) cert.get('certName');
                certificate.Authority_By__c = (String) cert.get('Authority_By__c');
                certificate.Program__c = programId;
    
                certificateRecords.add(certificate);
            }
    
            if (!certificateRecords.isEmpty()) {
                upsert certificateRecords;
            }
        } catch (Exception e) {
            System.debug('Error processing Certificate records: ' + e.getMessage());
            throw new AuraHandledException('An error occurred while processing Certificate records: ' + e.getMessage());
        }
    }
    
    @AuraEnabled
    public static void createOnboardings(Map<String, Object> onboarding, List<Id> assignedTo, Id programId) {
        try {
            List<Onboarding__c> onboardingRecords = new List<Onboarding__c>();
            
            // Iterate through the dynamic list of maps for Onboarding
            for (Id userId : assignedTo) {
                // Create or update Onboarding record
                Onboarding__c onboard = new Onboarding__c();
                onboard.Id = (Id) onboarding.get('Id');
                onboard.Name = (String) onboarding.get('onboardName');
                onboard.Assigned_To__c = userId;
                onboard.Type__c = (String) onboarding.get('Type__c');
                onboard.Program__c = programId;
                
                onboardingRecords.add(onboard);
            }

            // Upsert Onboarding records
            if (!onboardingRecords.isEmpty()) {
                upsert onboardingRecords;
            }
        
        } catch (Exception e) {
            System.debug('Error processing Onboarding and Asset records: ' + e.getMessage());
            throw new AuraHandledException('An error occurred while processing Onboarding and Asset records: ' + e.getMessage());
        }
    }
    
    @AuraEnabled
    public static void createAssets(List<Map<String, Object>> assets) {
        try {
            List<Asset__c> assetRecords = new List<Asset__c>();
            
            for (Map<String, Object> assetRow : assets) {
                Asset__c asset = new Asset__c();
                asset.Id = (Id) assetRow.get('Id');
                asset.Name = (String) assetRow.get('assetName');
                asset.Assigned_Date__c = parseDate((String) assetRow.get('Assigned_Date__c'));
                asset.Condition_After__c = (String) assetRow.get('Condition_After__c');
                asset.Condition_Before__c = (String) assetRow.get('Condition_Before__c');
                asset.Contact__c = (Id) assetRow.get('Contact__c');
                asset.Returned_Date__c = parseDate((String) assetRow.get('Returned_Date__c'));
                asset.Serial_Number__c = (String) assetRow.get('Serial_Number__c');
                asset.Status__c = (String) assetRow.get('Status__c');
                asset.Onboarding__c = (Id) assetRow.get('Onboarding__c');
                
                assetRecords.add(asset);
            }
   
            // Upsert Asset records
            if (!assetRecords.isEmpty()) {
                upsert assetRecords;
            }
        
        } catch (Exception e) {
            System.debug('Error processing Assets and Asset records: ' + e.getMessage());
            throw new AuraHandledException('An error occurred while processing Assets and Asset records: ' + e.getMessage());
        }
    }
    
    @AuraEnabled
    public static void createInterns(List<Id> assignedTo, Id programId) {
        try {
            // Iterate through the dynamic list of maps for Onboarding
            List<Intern__c> internRecords = new List<Intern__c>();
            for (Id userId : assignedTo) {
                Intern__c newIntern = new Intern__c();
                // newIntern.Id = (Id) intern.get('Id');
                newIntern.Status__c = 'Active';
                newIntern.Stage__c = 'Not Started';
                newIntern.User__c = userId;
                newIntern.Program__c = programId;
    
                internRecords.add(newIntern);
            }
    
            if (!internRecords.isEmpty()) {
                upsert internRecords;
            }
        } catch (Exception e) {
            System.debug('Error processing Intern records: ' + e.getMessage());
            throw new AuraHandledException('An error occurred while processing Intern records: ' + e.getMessage());
        }
    }
    

    private static Date parseDate(String dateStr) {
        if (String.isNotBlank(dateStr)) {
            return Date.valueOf(dateStr);
        }
        return null;
    }
}