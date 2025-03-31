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
            SELECT Id, Name, 
            (SELECT Id, Name, User__c FROM Interns__r),
            (SELECT Id, Name FROM Certificates__r)
            FROM Program__c WHERE Id = :programId
        ];
        
        wrapper.certificates = [
            SELECT Id, Name, Required__c, Authority_By__c,
            (SELECT Id, Name, Certificate__c, Certificate__r.Name FROM Modules__r)
            FROM Certificate__c WHERE Program__c = :programId
        ];
        
        wrapper.onboardings = [
            SELECT Id, Name, Assigned_To__c, Assigned_To__r.Name,
                Assigned_Date__c,
                Condition_After__c,
                Condition_Before__c, 
                Contact__c,
                Returned_Date__c,
                Serial_Number__c,
                Status__c, 
                Description__c,
                Special_Terms__c
            FROM Onboarding__c WHERE Program__c = :programId
        ];
          
        
        wrapper.interns = [
            SELECT Id, Name, User__c, User__r.Name
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
    public static List<Certificate__c> createCertificates(List<Map<String, Object>> certificates, Id programId) {
        List<Certificate__c> certRecords = new List<Certificate__c>();
    
        for (Map<String, Object> cert : certificates) {
            Certificate__c certificate = new Certificate__c();
    
            certificate.Name = (String) cert.get('certName');
            certificate.Authority_By__c = (String) cert.get('Authority_By__c');
            certificate.Program__c = programId;
    
            certRecords.add(certificate);
        }
    
        try {
            // Insert the certificates and return the created records
            insert certRecords;
        } catch (DmlException e) {
            throw new AuraHandledException('Error creating certificates: ' + e.getMessage());
        }
    
        return certRecords; // Return the created certificate records
    }

    @AuraEnabled
    public static void createModules(List<Map<String, Object>> modules, List<Map<String, Object>> assignedTo, Id programId) {
        try {
            // Step 1: Initialize list to hold Module__c records
            List<Module__c> modulesRecords = new List<Module__c>();
            
            // Step 2: Process each module
            for (Map<String, Object> mod : modules) {
                Module__c module = new Module__c();
        
                // Ensure 'Id' is checked and properly assigned
                if (mod.containsKey('Id') && mod.get('Id') != null) {
                    module.Id = (Id) mod.get('Id');
                }
                module.Name = 'Module for ' + (String) mod.get('moduleName');
                module.Certificate__c = (Id) mod.get('Certificate__c');
        
                modulesRecords.add(module);
            }
            
            // Step 3: Upsert the modules only if there are records
            if (!modulesRecords.isEmpty()) {
                upsert modulesRecords;
            }
    
            // Step 4: Prepare to create Tasks
            List<Tasks__c> tasksToCreate = new List<Tasks__c>();
    
            // Step 5: Create tasks for each intern
            if (assignedTo != null && !assignedTo.isEmpty()) {
                for (Module__c module : modulesRecords) {
                    for (Map<String, Object> intern : assignedTo) {
                        Id internId = (Id) intern.get('Id');
                        String internName = (String) intern.get('Name');
                        if (internId != null) {
                            // Ensure the intern is valid and the Task fields are properly populated
                            Tasks__c task = new Tasks__c(
                                Module__c = module.Id,
                                Assigned_To__c = internId,
                                Name = 'New Task for ' + internName + ' on ' + module.Name,
                                Subject__c = 'New Task for ' + internName + ' on ' + module.Name,
                                Status__c = 'In Progress',
                                Priority__c = 'Normal',
                                Start_Date__c = Date.today(),
                                Due_Date__c = Date.today().addDays(7),
                                On_Hold_Reason__c = ''
                                // Milestone__c = milestone
                            );
                            tasksToCreate.add(task);
                        }
                    }
                }
    
                // Step 6: Insert tasks if there are any
                if (!tasksToCreate.isEmpty()) {
                    insert tasksToCreate;
                    System.debug('Tasks created successfully.');
                
                    // Step 7: Send notifications to users who were assigned tasks
                    List<Id> userIds = new List<Id>();
                    String emailBody = 'You have been assigned new tasks:\n\n';
                    for (Tasks__c task : tasksToCreate) {
                        if (task.Assigned_To__c != null) {
                            userIds.add(task.Assigned_To__c);
                        }
                        emailBody += '• ' + task.Name + '\n';
                    }
                    
                    if (!userIds.isEmpty()) {
                        // Send email notification to each user
                        List<User> usersToNotify = [SELECT Id, Email FROM User WHERE Id IN :userIds];
                        for (User u : usersToNotify) {
                            Messaging.SingleEmailMessage mail = new Messaging.SingleEmailMessage();
                            mail.setToAddresses(new String[] { u.Email });
                            mail.setSubject('New Task Assigned');
                            mail.setPlainTextBody(emailBody);
                            Messaging.sendEmail(new Messaging.SingleEmailMessage[] { mail });
                    }
                }

                } else {
                    System.debug('No tasks to create.');
                }
            } else {
                System.debug('No interns assigned.');
            }
    
            System.debug('Modules and tasks creation completed.');
        } catch (Exception e) {
            // Catch any exceptions and display a detailed error message
            throw new AuraHandledException('Error: ' + e.getMessage());
        }
    }
    

    @AuraEnabled(cacheable=true)
    public static Id getOnboardingRecordType(String recordTypeName) {
        RecordType rt = [SELECT Id FROM RecordType WHERE Name = :recordTypeName AND SObjectType = 'Onboarding__c' LIMIT 1];
        return rt != null ? rt.Id : null;
    }
    
    @AuraEnabled
    public static void createInterns(List<Map<String, Object>> assignedTo, Id programId) {
        try {
            // Iterate through the dynamic list of maps for Onboarding
            List<Intern__c> internRecords = new List<Intern__c>();
            for (Map<String, Object> intern : assignedTo) {
                Id internId = (Id) intern.get('Id');
                Intern__c newIntern = new Intern__c();
                // newIntern.Id = (Id) intern.get('Id');
                newIntern.Status__c = 'Active';
                newIntern.Stage__c = 'Onboarding';
                newIntern.User__c = internId;
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

    @AuraEnabled(cacheable=true)
    public static String getProfileName() {
        return [SELECT Profile.Name FROM User WHERE Id = :UserInfo.getUserId()].Profile.Name;
    }
    

    private static Date parseDate(String dateStr) {
        if (String.isNotBlank(dateStr)) {
            return Date.valueOf(dateStr);
        }
        return null;
    }
}