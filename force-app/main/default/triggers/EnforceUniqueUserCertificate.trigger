trigger EnforceUniqueUserCertificate on Certified__c (before insert, before update) {
    Set<Id> userIds = new Set<Id>();
    Set<Id> certificateIds = new Set<Id>();
    Map<String, Certified__c> existingCertifiedMap = new Map<String, Certified__c>();

    // Collect User__c and Certificate__c from incoming records
    for (Certified__c certified : Trigger.new) {
        if (certified.User__c != null && certified.Certificate__c != null) {
            userIds.add(certified.User__c);
            certificateIds.add(certified.Certificate__c);
        }
    }

    // Query existing Exam_Schedule__c records with the same User__c and Certificate__c
    if (!userIds.isEmpty() && !certificateIds.isEmpty()) {
        for (Certified__c existing : [
            SELECT Id, User__c, Certificate__c 
            FROM Certified__c  
            WHERE User__c IN :userIds AND Certificate__c IN :certificateIds
        ]) {
            String key = existing.User__c + ':' + existing.Certificate__c;
            existingCertifiedMap.put(key, existing);
        }
    }

    // Check for uniqueness based on User__c and Certificate__c combination
    for (Certified__c certified : Trigger.new) {
        if (certified.User__c != null && certified.Certificate__c != null) {
            String key = certified.User__c + ':' + certified.Certificate__c;
            if (existingCertifiedMap.containsKey(key)) {
                Certified__c existing = existingCertifiedMap.get(key);
                // Ensure that we're not comparing the same record (for update scenario)
                if (certified.Id != existing.Id) {
                    certified.addError('An Certificate record already exists for this user and certificate.');
                }
            }
        }
    }
}