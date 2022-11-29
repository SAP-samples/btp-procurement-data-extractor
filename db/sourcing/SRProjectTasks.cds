namespace sap.ariba;
using { managed, cuid } from '@sap/cds/common';

using sap.ariba.type as types from '../types';

/**
    Name:  Sourcing Request Project Task
    Class Name:       ariba.analytics.fact.SRProjectTaskFact
    Description:       Sourcing Request Project Task
*/

entity SRProjectTasks: managed,types.customFields   {

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
        SRProject:types.srProject;
        AclId:Double;

             
        ActiveApprovers                 : Composition of many SRProjectTasks_ActiveApprovers on ActiveApprovers.SRProjectTasks = $self;
        Observers                       : Composition of many SRProjectTasks_Observers on Observers.SRProjectTasks = $self;
        AllOwners                       : Composition of many SRProjectTasks_AllOwners on AllOwners.SRProjectTasks = $self;

}



entity SRProjectTasks_Observers:  cuid {
    Observers          : types.userdata;
    SRProjectTasks : Association to SRProjectTasks;
}


entity SRProjectTasks_ActiveApprovers: cuid {
    ActiveApprovers       : types.userdata;
    SRProjectTasks : Association to SRProjectTasks;
}


entity SRProjectTasks_AllOwners:  cuid {
    AllOwners       : types.userdata;
    SRProjectTasks : Association to SRProjectTasks;
}

