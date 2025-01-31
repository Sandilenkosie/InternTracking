trigger EnforceUniqueUser on Exam_Schedule__c (before insert, before update) {
    Set<Id> userIds = new Set<Id>();
    Set<Id> certificateIds = new Set<Id>();
    Map<String, Exam_Schedule__c> existingCertifiedMap = new Map<String, Exam_Schedule__c>();

    // Collect User__c and Certificate__c from incoming records
    for (Exam_Schedule__c certified : Trigger.new) {
        if (certified.Assigned_To__c != null && certified.Certificate__c != null) {
            userIds.add(certified.Assigned_To__c);
            certificateIds.add(certified.Certificate__c);
        }
    }

    // Query existing Exam_Schedule__c records with the same User__c and Certificate__c
    if (!userIds.isEmpty() && !certificateIds.isEmpty()) {
        for (Exam_Schedule__c existing : [
            SELECT Id, Assigned_To__c, Certificate__c 
            FROM Exam_Schedule__c  
            WHERE Assigned_To__c IN :userIds AND Certificate__c IN :certificateIds
        ]) {
            String key = existing.Assigned_To__c + ':' + existing.Certificate__c;
            existingCertifiedMap.put(key, existing);
        }
    }

    // Check for uniqueness based on User__c and Certificate__c combination
    for (Exam_Schedule__c certified : Trigger.new) {
        if (certified.Assigned_To__c != null && certified.Certificate__c != null) {
            String key = certified.Assigned_To__c + ':' + certified.Certificate__c;
            if (existingCertifiedMap.containsKey(key)) {
                Exam_Schedule__c existing = existingCertifiedMap.get(key);
                // Ensure that we're not comparing the same record (for update scenario)
                if (certified.Id != existing.Id) {
                    certified.addError('An Exam Schedule record already exists for this user and certificate.');
                }
            }
        }
    }
}