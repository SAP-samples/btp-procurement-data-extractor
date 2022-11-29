namespace sap.ariba;
using { managed, cuid } from '@sap/cds/common';

using sap.ariba.type as types from '../types';

/**
    Name:  Sourcing Project
    Class Name:       ariba.analytics.fact.SourcingProject
    Description:       Sourcing Project
    Database Table Name:   FACT_SOURCING_PROJECT
*/

entity SourcingProjects: managed,types.customFields   {

        Origin                          : Double;
        IsTestProject                   : Boolean;
        Owner                           : types.owner;
        Description                     : String(1000);
        Organization                    : Composition of many SourcingProjects_Organization on Organization.SourcingProject = $self;
        ProcessStatus                   : String(50);
        OnTimeOrLate                    : String(10);
        EventType                       : types.eventType;
        TargetSavingsPct                : Double;
        DependsOnProject                : types.projectInfo;


////////////////

    key ProjectId                       : String(50);
        LoadCreateTime                  : DateTime;
        LoadUpdateTime                  : DateTime;
        AclId                           : Double;
        Duration                        : Double;
        BeginDate                       : types.day;
        DueDate                         : types.day;
        EndDate                         : types.day;
        Status                          : String(30);
        State                           : String(20);
        Currency                        : String(50);
        
        ProjectInfo                     : types.projectInfo;
        
        ContainerProject                : types.projectInfo;
        Process                         : types.process;
    
        SourceSystem                    : types.sourceSystem;
       
        BaselineSpend                   : Double;
        ActualSaving                    : Double;
        
        ContractMonths                  : Double;
    
        ContractEffectiveDate           : types.day;
        ResultsDescription              : String(1000);
        AwardJustification              : String(1000);
        PlannedStartDate                : types.day;
        PlannedEndDate                  : types.day;
        SourcingMechanism               : String(50);
        ExecutionStrategy               : String(50);
        ProjectReason                   : String(50);
        PlannedEventType                : types.eventType;
        
        Suppliers                       : Composition of many SourcingProjects_Suppliers on Suppliers.SourcingProject = $self;
        Commodity                       : Composition of many SourcingProjects_Commodity on Commodity.SourcingProject = $self;
        Region                          : Composition of many SourcingProjects_Region on Region.SourcingProject = $self;
        AllOwners                       : Composition of many SourcingProjects_AllOwners on AllOwners.SourcingProject = $self;

        key Realm                       : String(50);
}



entity SourcingProjects_Region:  cuid {
    Region          : types.region;
    SourcingProject : Association to SourcingProjects;
}


entity SourcingProjects_Commodity: cuid {
    Commodity       : types.commodity;
    SourcingProject : Association to SourcingProjects;
}


entity SourcingProjects_Suppliers:  cuid {
    Suppliers       : types.supplier;
    SourcingProject : Association to SourcingProjects;
}


entity SourcingProjects_AllOwners:  cuid {
    AllOwners       : types.owner;
    SourcingProject : Association to SourcingProjects;
}


entity SourcingProjects_Organization:  cuid {
    Organization    : types.organization;
    SourcingProject : Association to SourcingProjects;
}