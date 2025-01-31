trigger EnforceUniqueUserIntern on Intern__c (before insert, before update) {
    // Collect User__c IDs from incoming records
    Set<Id> userIds = new Set<Id>();
    Map<Id, Intern__c> existingInternMap = new Map<Id, Intern__c>();
    Map<Id, String> userNameMap = new Map<Id, String>();

    for (Intern__c intern : Trigger.new) {
        if (intern.User__c != null) {
            userIds.add(intern.User__c);
        }
    }

    // Query existing Intern__c records with matching User__c
    if (!userIds.isEmpty()) {
        for (Intern__c existing : [
            SELECT Id, User__c 
            FROM Intern__c 
            WHERE User__c IN :userIds
        ]) {
            existingInternMap.put(existing.User__c, existing);
        }

        // Query User names for error messages
        for (User user : [
            SELECT Id, Name 
            FROM User 
            WHERE Id IN :userIds
        ]) {
            userNameMap.put(user.Id, user.Name);
        }
    }

    // Check for uniqueness based on User__c
    for (Intern__c intern : Trigger.new) {
        if (intern.User__c != null) {
            if (existingInternMap.containsKey(intern.User__c)) {
                Intern__c existing = existingInternMap.get(intern.User__c);
                // Ensure that we're not comparing the same record (for update scenario)
                if (intern.Id == null || intern.Id != existing.Id) {
                    String userName = userNameMap.get(intern.User__c);
                    intern.addError('An Intern record already exists for this user: ' + userName);
                }
            }
        }
    }
}