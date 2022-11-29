namespace sap.ariba;
using { managed, cuid } from '@sap/cds/common';

using sap.ariba.type as types from '../types';

/**
    Name:  Project Task
    Class Name:       ariba.analytics.fact.ProjectTaskFact
    Description:       Project Task
*/

entity ProjectTasks: managed,types.customFields   {

    key Realm                       : String(50);
    key TaskId: String(50);
        LoadCreateTime: DateTime;
        LoadUpdateTime: DateTime;
    
        DocumentId: String(50);
        Description: String(1000);
        Duration:Double;
        BeginDate: types.singleDate;
        DueDate: types.singleDate;
        EndDate: types.singleDate;
        CommittedDueDate: types.singleDate;
        EndDateTime: types.singleDate;
        Status: String(30);
        AltStatus: String(30);
        TaskType: String(30);
        TaskName:types.task;
        RequiredOrOptional: String(10);
        OnTimeOrLate: String(10);
        Project:types.srProject;
        ProjectOwner:types.userdata;
        IsTestProject:Boolean;
        SourceSystem:types.sourceSystem;
        AclId:Double;

             
        ActiveApprovers                 : Composition of many ProjectTasks_ActiveApprovers on ActiveApprovers.ProjectTasks = $self;
        Observers                       : Composition of many ProjectTasks_Observers on Observers.ProjectTasks = $self;
        AllOwners                       : Composition of many ProjectTasks_AllOwners on AllOwners.ProjectTasks = $self;

}



entity ProjectTasks_Observers:  cuid {
    Observers          : types.userdata;
    ProjectTasks : Association to ProjectTasks;
}


entity ProjectTasks_ActiveApprovers: cuid {
    ActiveApprovers       : types.userdata;
    ProjectTasks : Association to ProjectTasks;
}


entity ProjectTasks_AllOwners:  cuid {
    AllOwners       : types.userdata;
    ProjectTasks : Association to ProjectTasks;
}

