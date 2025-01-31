// This file is generated as an Apex representation of the
//     corresponding sObject and its fields.
// This read-only file is used by the Apex Language Server to
//     provide code smartness, and is deleted each time you
//     refresh your sObject definitions.
// To edit your sObjects and their fields, edit the corresponding
//     .object-meta.xml and .field-meta.xml files.

global class inov8__PMT_Task__ChangeEvent {
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
    /* The phase that this task is assigned to.
    */
    global inov8__PMT_Phase__c inov8__Phase__c;
    global String inov8__Sign_off_status__c;
    global String inov8__Status__c;
    global User inov8__Assigned_To1__c;
    global Boolean inov8__Checklist_Selected__c;
    /* The general description of the task. For example, what is the purpose of the task.
    */
    global String inov8__Description__c;
    /* The date this task is due to be completed
    */
    global Date inov8__Due_Date__c;
    global Double inov8__Duration_In_Days__c;
    global Boolean inov8__Is_Milestone__c;
    global Boolean inov8__Is_Recurring__c;
    /* If blocked, why?
    */
    global String inov8__On_Hold_Reason__c;
    global Double inov8__Percentage_Completion__c;
    /* When should this task start by?
    */
    global Date inov8__Start_Date__c;
    global Double inov8__Start_Days_Out__c;
    global Double inov8__Task_Level__c;
    global String inov8__Topic__c;
    global String inov8__Alert__c;
    global String inov8__Assigned_To_Email__c;
    global Double inov8__Days_Late__c;
    global Double inov8__Duration__c;
    global Boolean inov8__IsTemplate__c;
    global String inov8__My_Task__c;
    global String inov8__Phase_Name__c;
    global String inov8__Project_Id__c;
    global String inov8__Project_Name__c;
    global String inov8__Status_Icon_Name__c;
    global String inov8__Status_Icon__c;
    global Double inov8__Task_Level_formula__c;
    global String inov8__Task_Name_w_Alert__c;
    global Double inov8__Weighted_percentage__c;

    global inov8__PMT_Task__ChangeEvent () 
    {
    }
}