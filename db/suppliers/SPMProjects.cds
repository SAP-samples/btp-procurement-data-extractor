namespace sap.ariba;
using { managed, cuid } from '@sap/cds/common';

using sap.ariba.type as types from '../types';


/**
    Name:	                SPM Project
    Class Name:	            ariba.analytics.fact.SPMProject
    Description:	        SPM Project
    Database Table Name:	FACT_SPM_PROJECT
*/
entity SPMProjects: managed  {
    key Realm                           : String(50);
    key ProjectId                       : String(50);

        LoadCreateTime                  : DateTime;
        LoadUpdateTime                  : DateTime;
        Description                     : String(1000);
        AclId                           : Integer;
        Duration                        : Double;
        BeginDate                       : types.day;
        DueDate                         : types.day;
        EndDate                         : types.day;
        Status                          : String(30);
        State                           : String(20);
        OnTimeOrLate                    : String(10);
        Owner                           : types.user;
        ProjectInfo                     : types.projectInfo;
        DependsOnProject                : types.projectInfo;
        ContainerProject                : types.projectInfo;
        Process                         : types.process;
        Supplier                        : types.supplier;
        IsTestProject                   : Boolean;
        SourceSystem                    : types.sourceSystem;
        ProcessStatus                   : String(50);

        Region                          : Composition of many SPMProjects_Region on Region.SPMProjects = $self;
        Commodity                       : Composition of many SPMProjects_Commodity on Commodity.SPMProjects = $self;
        Organization                    : Composition of many SPMProjects_Organization on Organization.SPMProjects = $self;
        AllOwners                       : Composition of many SPMProjects_AllOwners on AllOwners.SPMProjects = $self;

}


entity SPMProjects_Commodity: cuid {
    Commodity   : types.commodity;
    SPMProjects : Association to SPMProjects;
}

entity SPMProjects_Region:  cuid {
    Region      : types.region;
    SPMProjects : Association to SPMProjects;
}

entity SPMProjects_Organization:  cuid {
    Organization    : types.organization;
    SPMProjects     : Association to SPMProjects;
}

entity SPMProjects_AllOwners:  cuid {
    AllOwners   : types.user;
    SPMProjects : Association to SPMProjects;
}