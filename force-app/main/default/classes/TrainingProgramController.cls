public with sharing class TrainingProgramController {
    @AuraEnabled(cacheable=true)
    public static TrainingProgramWrapper getTrainingProgramDetails(Id trainingProgramId) {
        TrainingProgramWrapper wrapper = new TrainingProgramWrapper();

        // Fetch Training Program
        wrapper.trainingProgram = [
            SELECT Id, Name, Capacity__c, End_Date__c, Location__c,
               Start_Date__c, Status__c, Description__c 
            FROM Training_Program__c 
            WHERE Id = :trainingProgramId 
            LIMIT 1
        ];

        // Fetch Phases related to the Training Program
        // wrapper.modules = [
        //     SELECT Id, Name, Certificate__c,
        //         (SELECT Id, Name, Completion__c, Assigned_To__c,Assigned_To__r.Name, Description__c, Milestone__c, Due_Date__c, On_Hold_Reason__c, 
        //             Sign_off_status__c, Start_Date__c, Status__c 
        //         FROM Tasks__r) 
        //     FROM Phase__c 
        //     WHERE Program__c IN (
        //         SELECT Id FROM Program__c WHERE Training__c = :trainingProgramId
        //     )
        // ]; 
        
        wrapper.program = [
            SELECT Id, Name, Department__c, Program_Type__c, Start_Date__c, Duration__c, Training__c,
            (SELECT Id, Name, User__c, User__r.Name FROM Interns__r),
            (SELECT Id, Name, (SELECT Id, Name FROM Certifieds__r) FROM Certificates__r)
            FROM Program__c WHERE Training__c = :trainingProgramId
        ];

        
        // Fetch Exam Schedules related to the Training Program
        wrapper.examSchedules = [
            SELECT Id, Exam_Result__c, Certificate__c, Certificate__r.Name, Completion__c, Scheduled_Date__c, Location__c, 
                    Assigned_To__c, Assigned_To__r.Name, Training_Program__r.Name   
            FROM Exam_Schedule__c 
            WHERE Training_Program__c = :trainingProgramId
        ];

        wrapper.certificates = [
            SELECT Id, Name, Required__c, Authority_By__c,
                // (SELECT Id, Name, User__c, Expiration_Date__c, Status__c, Issued_Date__c, Score__c, Issuing_Authority__c FROM Certifieds__r),
                (SELECT Id, Name, Certificate__c, (SELECT Id, Name, Milestone__c FROM Tasks__r) FROM Modules__r)
            FROM Certificate__c
            WHERE Program__c IN (
                SELECT Id FROM Program__c WHERE Training__c = :trainingProgramId
            )
        ];

        return wrapper;
    }
    
    // @AuraEnabled(cacheable=true)
    // public static List<Training_Program__c> getTraining() {
    //     return [SELECT Id, Name FROM Training_Program__c];
    // }
   
    
    @AuraEnabled
    public static void savePerformanceRatingApex(Id internId, Boolean goalsAchieved, integer trainingProgress, string rating, string stages, string note) {
        try {
            // Fetch the intern record or create logic to update
            Intern__c intern = [SELECT Id, Name, Training_Progress__c, Goals_Achieved__c FROM Intern__c WHERE Id = :internId LIMIT 1];
            
            // Assuming there are fields for goalsAchieved and trainingProgress
            intern.Goals_Achieved__c = goalsAchieved;
            // intern.Training_Progress__c = trainingProgress;
            intern.Performance_Rating__c = rating;
            intern.Stage__c = stages;
            intern.Evaluation_Notes__c = note;
            intern.Id = internId;
    
            // Update the record
            update intern;
        } catch (Exception e) {
            throw new AuraHandledException('Error updating goal achieved: ' + e.getMessage());
        }
    }
    @AuraEnabled
    public static void addNewTask(Id phaseId, String taskName, Date dueDate, List<Id> assignedTo, Date startDate, Boolean milestone) {
        try {
                List<Tasks__c> newTasks = new List<Tasks__c>();  // Declare the list to hold tasks
                
                for (Id userId : assignedTo) {
                    // Create new task object for each user
                    Tasks__c task = new Tasks__c(
                        Module__c = phaseId,
                        Subject__c = taskName,
                        Name = taskName,
                        Due_Date__c = dueDate,
                        Status__c = 'Not Started',
                        Priority__c = 'Normal',
                        // Completion__c = completion,
                        Start_Date__c = startDate,
                        Assigned_To__c = userId, 
                        On_Hold_Reason__c = '',
                        Milestone__c = milestone
                    );
                
                    // Add the task object to the newTasks list
                    newTasks.add(task);
                }

                insert newTasks;

            
        } catch (DmlException dmle) {
            throw new AuraHandledException('Error creating new task: DML Exception - ' + dmle.getDmlMessage(0));
        } catch (AuraHandledException ahe) {
            throw ahe; 
        } catch (Exception e) {
            throw new AuraHandledException('Unexpected error: ' + e.getMessage());
        }
    }


    @AuraEnabled
    public static void addNewschedule(Id traingId, Id certificateId, Date scheduleDate, Integer completion, List<Id> assignedTo, String location) {
        try {
                List<Exam_Schedule__c> newSchedules = new List<Exam_Schedule__c>();  // Declare the list to hold tasks
                
                for (Id userId : assignedTo) {
                    // Create new task object for each user
                    Exam_Schedule__c schedule = new Exam_Schedule__c(
                        Training_Program__c = traingId,
                        Scheduled_Date__c = scheduleDate,
                        Certificate__c = certificateId,
                        Completion__c = completion,
                        Location__c = location,
                        Assigned_To__c = userId, 
                        Exam_Result__c = 'Pending'  
                    );
                
                    // Add the task object to the newTasks list
                    newSchedules.add(schedule);
                }
                // Insert all tasks at once
                insert newSchedules;

            
        } catch (DmlException dmle) {
            throw new AuraHandledException('Error creating new task: DML Exception - ' + dmle.getDmlMessage(0));
        } catch (AuraHandledException ahe) {

            throw ahe;  // Re-throw the AuraHandledException
        } catch (Exception e) {
            throw new AuraHandledException('Unexpected error: ' + e.getMessage());
        }
    }
    
    @AuraEnabled
    public static void createCertificate(Id certificateId, Id userId, Date expireDate, Date issuedDate, String author, Integer score, String status) {
        Certified__c certified = new Certified__c(
            Certificate__c = certificateId,
            User__c = userId,
            Expiration_Date__c = expireDate,
            Issued_Date__c = issuedDate,
            Issuing_Authority__c = author,
            Score__c = score,
            Status__c = status     
        );
        insert certified;
    }



    // Wrapper class to hold the results
    public class TrainingProgramWrapper {
        @AuraEnabled public Training_Program__c trainingProgram;
        // @AuraEnabled public List<Phase__c> phases;
        @AuraEnabled public List<Exam_Schedule__c> examSchedules;
        @AuraEnabled public Program__c program;
        @AuraEnabled public List<Certificate__c> certificates;
    }
}