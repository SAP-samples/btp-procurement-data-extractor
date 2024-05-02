namespace sap.ariba;
using { managed, cuid } from '@sap/cds/common';

using sap.ariba.type as types from '../../types';


/**
    Name:	                SPM Project
    Class Name:	            ariba.analytics.fact.SPMProject
    Description:	        SPM Project
    Database Table Name:	FACT_SPM_PROJECT
*/
entity SPMProjects_AN: managed  {
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

        Region                          : Composition of many SPMProjects_Region_AN on Region.SPMProjects = $self;
        Commodity                       : Composition of many SPMProjects_Commodity_AN on Commodity.SPMProjects = $self;
        Organization                    : Composition of many SPMProjects_Organization_AN on Organization.SPMProjects = $self;
        AllOwners                       : Composition of many SPMProjects_AllOwners_AN on AllOwners.SPMProjects = $self;

}


entity SPMProjects_Commodity_AN: cuid {
    Commodity   : types.commodity;
    SPMProjects : Association to SPMProjects_AN;
}

entity SPMProjects_Region_AN:  cuid {
    Region      : types.region;
    SPMProjects : Association to SPMProjects_AN;
}

entity SPMProjects_Organization_AN:  cuid {
    Organization    : types.organization;
    SPMProjects     : Association to SPMProjects_AN;
}

entity SPMProjects_AllOwners_AN:  cuid {
    AllOwners   : types.user;
    SPMProjects : Association to SPMProjects_AN;
}