public with sharing class TaskController {
    
    // Method to get Tasks__c records
    @AuraEnabled(cacheable=true)
    public static List<Tasks__c> getTasks() {
        return [SELECT Id, Status__c FROM Tasks__c WHERE Status__c != NULL LIMIT 10];
    }

    // Method to get picklist values for the Status field of Tasks__c object
    @AuraEnabled(cacheable=true)
    public static List<String> getStatusPicklistValues() {
        // Access the Status field on the custom object Tasks__c
        List<Schema.PicklistEntry> picklistValues = Schema.SObjectType.Tasks__c.fields.getMap().get('Status__c').getDescribe().getPicklistValues();
        
        List<String> statusValues = new List<String>();
        
        // Add picklist labels to the list
        for (Schema.PicklistEntry entry : picklistValues) {
            statusValues.add(entry.getLabel());
        }
        return statusValues;
    }

    // Method to update the Status of a Tasks__c record
    @AuraEnabled
    public static void updateTaskStatus(Id taskId, String newStatus) {
        // Query the Tasks__c record to update
        Tasks__c taskToUpdate = [SELECT Id, Status__c FROM Tasks__c WHERE Id = :taskId LIMIT 1];
        taskToUpdate.Status__c = newStatus;
        
        // Update the Tasks__c record
        update taskToUpdate;
    }
}