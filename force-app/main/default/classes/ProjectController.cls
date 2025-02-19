public with sharing class ProjectController {
    public class ProjectWrapper {
        @AuraEnabled public Project__c project;
        @AuraEnabled public List<Project__c> projects { get; set; }
        @AuraEnabled public List<Consultant__c> consultants { get; set; }
        @AuraEnabled public List<Client__c> clients { get; set; }
    }

    @AuraEnabled(cacheable=true)
    public static ProjectWrapper getProjectdetails(Id projectId) {
        if (projectId == null) {
            throw new AuraHandledException('Project ID is required.');
        }

        ProjectWrapper wrapper = new ProjectWrapper();
        
        wrapper.projects = [
            SELECT Id, Name, Account__r.Name FROM Project__c WHERE Id = :projectId
        ];

        // Query for the Project
        wrapper.project = [
            SELECT Id, Name, Start_Date__c, End_Date__c, Status__c
            FROM Project__c
            WHERE Id = :projectId
        ];

        // Query for Consultants associated with the Project
        wrapper.consultants = [
            SELECT Id, Name, User__c, User__r.Name, Gender__c, Date_of_Birth__c, ID_Number__c,Project__c, Project__r.Name,
                   (SELECT Id, Name, Status__c, Date__c, Interview_Feedback__c 
                    FROM Interviewers__r)
            FROM Consultant__c
            
        ];

        // Query for Clients associated with the Project
        wrapper.clients = [
            SELECT Id, Name, Industry__c, Contact__c, Account__r.Name, Email__c, Phone__c, 
                   Client_Status__c, Engagement_Start_Date__c, Engagement_End_Date__c
            FROM Client__c
            WHERE Project__c = :projectId
        ];

        return wrapper;
    }


    @AuraEnabled
    public static void createInterview(Date scheduleDate, Id clientId, List<Id> assignedTo, String interviewName) {
        try {
            // Validate inputs
            if (scheduleDate == null) {
                throw new AuraHandledException('Schedule date is required.');
            }
            if (String.isBlank(interviewName)) {
                throw new AuraHandledException('Interview name is required.');
            }
            if (clientId == null) {
                throw new AuraHandledException('Client ID is required.');
            }
            if (assignedTo == null || assignedTo.isEmpty()) {
                throw new AuraHandledException('At least one consultant must be assigned.');
            }
    
            // Prepare interviews for insertion
            List<Interview__c> newInterviews = new List<Interview__c>();
            for (Id consultantId : assignedTo) {
                Interview__c interview = new Interview__c(
                    Date__c = scheduleDate,
                    Client__c = clientId,
                    Interview_Feedback__c = '',
                    Name = interviewName,
                    Consultant__c = consultantId
                );
                newInterviews.add(interview);
            }
    
            // Insert interviews
            insert newInterviews;
    
        } catch (DmlException dmle) {
            // Handle multiple DML exceptions if applicable
            String errorMessage = 'Error creating new interviews: ';
            for (Integer i = 0; i < dmle.getNumDml(); i++) {
                errorMessage += 'Row ' + i + ': ' + dmle.getDmlMessage(i) + ' ';
            }
            throw new AuraHandledException(errorMessage.trim());
        } catch (Exception e) {
            // Handle unexpected errors
            throw new AuraHandledException('Unexpected error: ' + e.getMessage());
        }
    }

        
@AuraEnabled
public static void saveConsultantAndInterview(Id projectId, List<Interview__c> interviewsData) {
    try {
        // Save the selected consultant based on projectId
        Consultant__c consultant = [
            SELECT Id, Name, User__c, User__r.Name, Gender__c, Date_of_Birth__c, ID_Number__c, Project__c, Project__r.Name
            FROM Consultant__c
            WHERE Project__c = :projectId
            LIMIT 1
        ];
        
        if (consultant != null) {
            consultant.Project__c = projectId;
            update consultant;
        }

        // Update the interviewsData
        if (interviewsData != null && !interviewsData.isEmpty()) {
            update interviewsData;
        }

    } catch (Exception e) {
        throw new AuraHandledException('Error while saving data: ' + e.getMessage());
    }
}

}