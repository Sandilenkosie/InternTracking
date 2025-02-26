trigger AssignInternsToTasks on Module__c (after insert) {
    // Store all Certificate__c IDs from the newly inserted modules
    Set<Id> certificateIds = new Set<Id>();
    for (Module__c module : Trigger.new) {
        if (module.Certificate__c != null) {
            certificateIds.add(module.Certificate__c);
        }
    }
    
    // Query related Programs for the Certificates
    Map<Id, Id> certificateToProgramMap = new Map<Id, Id>();
    for (Certificate__c cert : [
        SELECT Id, Program__c 
        FROM Certificate__c 
        WHERE Id IN :certificateIds
    ]) {
        certificateToProgramMap.put(cert.Id, cert.Program__c);
    }

    // Query related Interns for the retrieved Programs
    Map<Id, List<Intern__c>> programInternsMap = new Map<Id, List<Intern__c>>();
    for (Intern__c intern : [
        SELECT Id, Name, User__c, Program__c 
        FROM Intern__c 
        WHERE Program__c IN :certificateToProgramMap.values()
    ]) {
        if (!programInternsMap.containsKey(intern.Program__c)) {
            programInternsMap.put(intern.Program__c, new List<Intern__c>());
        }
        programInternsMap.get(intern.Program__c).add(intern);
    }

    // List to store new Task__c records
    List<Tasks__c> tasksToInsert = new List<Tasks__c>();

    // Loop through each new module and create tasks for each related intern
    for (Module__c module : Trigger.new) {
        Id programId = certificateToProgramMap.get(module.Certificate__c);
        List<Intern__c> interns = programInternsMap.get(programId);

        if (interns != null) {
            for (Intern__c intern : interns) {
                if (intern.User__c != null) { // Ensure a valid User ID
                    Tasks__c newTask = new Tasks__c(
                        Module__c = module.Id,
                        Assigned_To__c = intern.User__c,
                        Name = 'New Task for ' + intern.Name + ' on ' + module.Name,
                        Status__c = 'Not Started'
                    );
                    tasksToInsert.add(newTask);
                }
            }
        }
    }

    // Bulk insert tasks
    if (!tasksToInsert.isEmpty()) {
        insert tasksToInsert;
    }
}
