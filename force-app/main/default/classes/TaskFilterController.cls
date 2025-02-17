public with sharing class TaskFilterController {

    @AuraEnabled(cacheable=true)
    public static List<Tasks__c> getTasks(String phaseId, String status, String assignedToId) {
        // Base query to retrieve relevant fields
        String query = 'SELECT Id, Name, Status__c, Module__c, Module__r.Name, Start_Date__c, Due_Date__c, Assigned_To__c, Completion__c, Description__c ' +
                       'FROM Tasks__c WHERE Module__c != NULL';
        
        // Add filters based on input parameters
        if (phaseId != 'All') {
            query += ' AND Module__c = :phaseId';
        }
        if (status != 'All') {
            query += ' AND Status__c = :status';
        }
        if (assignedToId != 'All') {
            query += ' AND Assigned_To__c = :assignedToId';
        }
        
        // Execute dynamic query and return results
        return Database.query(query);
    }

    @AuraEnabled(cacheable=true)
    public static List<Module__c> getPhases() {
        return [SELECT Id, Name FROM Module__c];
    }

    // Method to get all available phases

    @AuraEnabled(cacheable=true)
    public static List<Intern__c> getAssignedTo() {
       return [SELECT User__c, User__r.Name FROM Intern__c];  
    }


    // New method to get predefined status options
    @AuraEnabled(cacheable=true)
    public static List<String> getStatusOptions() {
        // Return predefined list of status options
        return new List<String>{
            'Not Started', 
            'In Progress', 
            'On Hold', 
            'Completed'
        };
    }
    @AuraEnabled
    public static void updateTaskStatus(List<Id> taskIds, String newStatus, string reasonOnHold) {
        if (taskIds == null || taskIds.isEmpty()) {
            throw new AuraHandledException('No tasks selected');
        }
        try {
            // Query tasks by IDs
            List<Tasks__c> tasksToUpdate = [SELECT Id, Status__c FROM Tasks__c WHERE Id IN :taskIds];
            
            // Iterate over tasks and update status
            for (Tasks__c task : tasksToUpdate) {
                task.Status__c = newStatus;
                task.On_Hold_Reason__c = reasonOnHold;
            }

            // Perform the update
            update tasksToUpdate;

        } catch (Exception e) {
            throw new AuraHandledException('Error updating task status: ' + e.getMessage());
        }
    }
    
    @AuraEnabled(cacheable=true)
    public static List<Tasks__c> editTasks() {
        return [SELECT Id, Name, Module__c, Module__r.Name FROM Tasks__c];
    }
    
    @AuraEnabled
    public static void deleteTask(Id taskId) {
        delete [SELECT Id FROM Tasks__c WHERE Id = :taskId];
    }


    // Method to update the assignee of tasks
    @AuraEnabled
    public static void updateTaskAssignee(List<Id> taskIds, Id newAssignee) {
        List<Tasks__c> tasks = [SELECT Id FROM Tasks__c WHERE Id IN :taskIds];
        for (Tasks__c task : tasks) {
            task.Assigned_To__c = newAssignee;
        }
        update tasks;
    }
}