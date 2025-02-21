trigger PreventDuplicateInterns on Intern__c (before insert, before update) {
    // Set to store the Program__c Ids from the incoming records
    Set<Id> programIdsToCheck = new Set<Id>();

    // Collect the Program__c IDs from both Insert and Update operations
    for (Intern__c intern : Trigger.new) {
        if (intern.Program__c != null) {
            programIdsToCheck.add(intern.Program__c);
        }
    }

    // Proceed only if there are Program__c Ids to check
    if (!programIdsToCheck.isEmpty()) {
        // Query for all Program__c records where there are existing interns (using reverse relationship Interns__r)
        // We no longer need User__c in the query
        List<Program__c> programsWithInterns = [
            SELECT Id, Name, 
                (SELECT Id FROM Interns__r)
            FROM Program__c
            WHERE Id IN :programIdsToCheck
        ];

        // Create a map to track which programs already have interns assigned
        Map<Id, Boolean> programWithInternsMap = new Map<Id, Boolean>();

        // Populate the map to check if any program already has interns assigned
        for (Program__c program : programsWithInterns) {
            if (program.Interns__r != null && !program.Interns__r.isEmpty()) {
                programWithInternsMap.put(program.Id, true);
            } else {
                programWithInternsMap.put(program.Id, false);
            }
        }

        // Loop through the incoming records and check for conflicts
        for (Intern__c intern : Trigger.new) {
            if (intern.Program__c != null) {

                // **Check on Insert:**
                if (Trigger.isInsert) {
                    // If the program already has an intern, trigger an error
                    if (programWithInternsMap.get(intern.Program__c)) {
                        intern.addError('This Program already has an intern assigned.');
                    }
                }

                // **Check on Update:**
                if (Trigger.isUpdate) {
                    // Get the old record for the intern
                    Intern__c oldIntern = Trigger.oldMap.get(intern.Id);

                    // If the Program__c has changed from the old to the new value
                    if (oldIntern.Program__c != intern.Program__c) {
                        // Check if the new Program__c already has an intern assigned
                        if (programWithInternsMap.get(intern.Program__c)) {
                            intern.addError('This Program already has an intern assigned.');
                        }
                    }
                }
            }
        }
    }
}
