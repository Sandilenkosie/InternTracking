trigger EnforceUniqueProgramCertificate on Certificate__c (before insert, before update) {
    Set<String> certificateNames = new Set<String>();
    Set<Id> programIds = new Set<Id>();
    Map<String, Certificate__c> existingCertificateMap = new Map<String, Certificate__c>();

    for (Certificate__c certificate : Trigger.new) {
        if (certificate.Name != null && certificate.Program__c != null) {
            certificateNames.add(certificate.Name);
            programIds.add(certificate.Program__c);
        }
    }

    if (!certificateNames.isEmpty() && !programIds.isEmpty()) {
        for (Certificate__c existing : [
            SELECT Id, Name, Program__c 
            FROM Certificate__c  
            WHERE Name IN :certificateNames AND Program__c IN :programIds
        ]) {
            String key = existing.Name + ':' + existing.Program__c;
            existingCertificateMap.put(key, existing);
        }
    }

    for (Certificate__c certificate : Trigger.new) {
        if (certificate.Name != null && certificate.Program__c != null) {
            String key = certificate.Name + ':' + certificate.Program__c;
            if (existingCertificateMap.containsKey(key)) {
                Certificate__c existing = existingCertificateMap.get(key);
                // Ensure that we're not comparing the same record (for update scenario)
                if (certificate.Id != existing.Id) {
                    certificate.addError('A Certificate with this name already exists for the selected Program.');
                }
            }
        }
    }
}
