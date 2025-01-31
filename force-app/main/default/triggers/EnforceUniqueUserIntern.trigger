trigger EnforceUniqueUserIntern on Intern__c (before insert, before update) {
    // Collect User__c and Program__c combinations from incoming records
    Map<String, Intern__c> existingInternMap = new Map<String, Intern__c>();
    Map<Id, String> userNameMap = new Map<Id, String>();
    Set<String> userProgramKeys = new Set<String>();

    for (Intern__c intern : Trigger.new) {
        if (intern.User__c != null && intern.Program__c != null) {
            String key = intern.User__c + ':' + intern.Program__c;
            userProgramKeys.add(key);
        }
    }

    // Query existing Intern__c records with matching User__c and Program__c
    if (!userProgramKeys.isEmpty()) {
        for (Intern__c existing : [
            SELECT Id, User__c, Program__c 
            FROM Intern__c 
            WHERE User__c != null AND Program__c != null
        ]) {
            String key = existing.User__c + ':' + existing.Program__c;
            existingInternMap.put(key, existing);
        }

        // Query User names for error messages
        Set<Id> userIds = new Set<Id>();
        for (String key : userProgramKeys) {
            userIds.add(key.split(':')[0]);
        }
        for (User user : [
            SELECT Id, Name 
            FROM User 
            WHERE Id IN :userIds
        ]) {
            userNameMap.put(user.Id, user.Name);
        }
    }

    // Check for uniqueness based on User__c and Program__c
    for (Intern__c intern : Trigger.new) {
        if (intern.User__c != null && intern.Program__c != null) {
            String key = intern.User__c + ':' + intern.Program__c;
            if (existingInternMap.containsKey(key)) {
                Intern__c existing = existingInternMap.get(key);
                // Ensure that we're not comparing the same record (for update scenario)
                if (intern.Id == null || intern.Id != existing.Id) {
                    String userName = userNameMap.get(intern.User__c);
                    intern.addError('An Intern record already exists for this user (' + userName + ') in the selected program.');
                }
            }
        }
    }
}
