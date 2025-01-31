// This file is generated as an Apex representation of the
//     corresponding sObject and its fields.
// This read-only file is used by the Apex Language Server to
//     provide code smartness, and is deleted each time you
//     refresh your sObject definitions.
// To edit your sObjects and their fields, edit the corresponding
//     .object-meta.xml and .field-meta.xml files.

global class inov8__PMT_Phase__ChangeEvent {
    global Id Id;
    global String ReplayId;
    global Object ChangeEventHeader;
    global String Name;
    global Datetime CreatedDate;
    global User CreatedBy;
    global Id CreatedById;
    global Datetime LastModifiedDate;
    global User LastModifiedBy;
    global Id LastModifiedById;
    global inov8__PMT_Project__c inov8__Project__c;
    global String inov8__Phase_Health__c;
    global Double inov8__Phases_with_completed_tasks__c;
    global Double inov8__Task_Count__c;
    global Date inov8__End_date_from_child__c;
    /* A general description of the phase.
    */
    global String inov8__Phase_Description__c;
    global Date inov8__Start_date_from_child_project__c;
    global Double inov8__Sum_of_tasks_count_child__c;
    global String inov8__Daily_progress__c;
    global Double inov8__Days_to_go__c;
    global Date inov8__Deadline_formula__c;
    global Double inov8__Duration__c;
    global Double inov8__Expected_age_of_completion__c;
    global String inov8__Health_Icon__c;
    global Date inov8__Kickoff_formula__c;
    global Double inov8__Length__c;
    global Double inov8__Percentage_Completion_without_child__c;
    global String inov8__Phase_Completion_Image__c;
    global Double inov8__Phase_Completion__c;
    global Double inov8__Phase_Weighted_Perc__c;
    global String inov8__Project_Name__c;
    global Date inov8__End_Date_Rollup__c;
    global Date inov8__Start_Date_Rollup__c;
    global Double inov8__Sum_Of_Task_Completion__c;
    global Double inov8__Sum_Task_Duration__c;
    global Double inov8__Sum_Weighted_perc__c;

    global inov8__PMT_Phase__ChangeEvent () 
    {
    }
}