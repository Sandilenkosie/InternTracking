public with sharing class MultiStepController {
    public class MultiStepWrapper {
        @AuraEnabled public Program__c program;
        @AuraEnabled public List<Certificate__c> progCertificates { get; set; }
        @AuraEnabled public List<Onboarding__c> onboardings { get; set; }
    }

    @AuraEnabled(cacheable=true)
    public static MultiStepWrapper getProgramInfo(Id programId) {
        if (String.isBlank(programId)) {
            throw new AuraHandledException('Program ID is required.');
        }

        MultiStepWrapper wrapper = new MultiStepWrapper();
        wrapper.program = [
            SELECT Id, Name, Department__c, Program_Type__c, Start_Date__c, End_Date__c
            FROM Program__c
            WHERE Id = :programId
        ];

        wrapper.progCertificates = [
            SELECT Id, Name, Required__c
            FROM Certificate__c
            WHERE Program__c = :programId
        ];

        wrapper.onboardings = [
            SELECT Id, Name
            FROM Onboarding__c
            WHERE Program__c = :programId
        ];
        
        return wrapper;

    }
    
    @AuraEnabled(cacheable=true)
    public static Program__c programtest() {
        return [SELECT Id, Name, Department__c, Program_Type__c, Start_Date__c, End_Date__c
            FROM Program__c
            WHERE Id = :'a0IWU000000BBWP2A4'];
    }

    @AuraEnabled
    public static void createProgramWithRelatedRecords(Map<String, Object> data) {
        if (data == null || data.isEmpty()) {
            throw new AuraHandledException('Input data is required.');
        }

        // Handle Program__c (Insert or Update)
        Program__c program = new Program__c();
        if (data.containsKey('programId') && !String.isBlank((String) data.get('programId'))) {
            program.Id = (String) data.get('programId');
        }
        program.Name = (String) data.get('programName');
        program.Department__c = (String) data.get('department');
        program.Program_Type__c = (String) data.get('programType');
        program.Start_Date__c = parseDate((String) data.get('startDate'));
        program.End_Date__c = parseDate((String) data.get('endDate'));

        upsert program;

        // Handle Certificate__c (Insert or Update)
        if (data.containsKey('certificateName') && !String.isBlank((String) data.get('certificateName'))) {
            Certificate__c certificate = new Certificate__c(
                Name = (String) data.get('certificateName'),
                Required__c = Boolean.valueOf((String) data.get('required')),
                Program__c = program.Id
            );

            if (data.containsKey('certificateId') && !String.isBlank((String) data.get('certificateId'))) {
                certificate.Id = (String) data.get('certificateId');
                update certificate;
            } else {
                insert certificate;
            }
        }

        // Handle Onboarding__c (Insert or Update)
        if (data.containsKey('onboardingName') && !String.isBlank((String) data.get('onboardingName'))) {
            Onboarding__c onboarding = new Onboarding__c(
                Name = (String) data.get('onboardingName'),

                Program__c = program.Id
            );

            if (data.containsKey('onboardingId') && !String.isBlank((String) data.get('onboardingId'))) {
                onboarding.Id = (String) data.get('onboardingId');
                update onboarding;
            } else {
                insert onboarding;
            }
        }
    }

    // Helper method to parse date safely
    private static Date parseDate(String dateStr) {
        try {
            return String.isNotBlank(dateStr) ? Date.valueOf(dateStr) : null;
        } catch (Exception e) {
            throw new AuraHandledException('Invalid date format: ' + dateStr);
        }
    }
}