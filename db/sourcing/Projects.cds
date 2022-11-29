namespace sap.ariba;
using { managed, cuid } from '@sap/cds/common';

using sap.ariba.type as types from '../types';

/**
    Name:	Project
    Class Name:	ariba.analytics.fact.Project
    Description:	Project
    Database Table Name:	FACT_PROJECT
*/

entity Projects: managed,types.customFields   {
    key Realm               : String(50);
    key ProjectId           : String(50);

        LoadCreateTime      : DateTime;
        LoadUpdateTime      : DateTime;
        Description         : String(1000);
        AclId               : Integer;
        Duration            : Double;
        BeginDate           : types.singleDate;
        DueDate             : types.singleDate;
        EndDate             : types.singleDate;
        Status              : String(30);
        State               : String(20);
        OnTimeOrLate        : String(10);
        Owner               : types.owner;
        ProjectInfo         : types.projectInfo;
        DependsOnProject    : types.projectInfo;
        ContainerProject    : types.projectInfo;
        Process             : types.process;

        IsTestProject       : Boolean;
        SourceSystem        : types.sourceSystem;
        ProcessStatus       : String(50);


        Commodity           : Composition of many Projects_Commodity on Commodity.Projects = $self;
        Organization        : Composition of many Projects_Organization on Organization.Projects = $self;
        Region              : Composition of many Projects_Region on Region.Projects = $self;
        AllOwners           : Composition of many Projects_AllOwners on AllOwners.Projects = $self;

}


entity Projects_Organization: cuid {
    Organization    : types.organization;
    Projects        : Association to Projects;
}

entity Projects_Commodity: cuid {
    Commodity       : types.commodity;
    Projects        : Association to Projects;
}

entity Projects_Region:  cuid {
    Region          : types.region;
    Projects        : Association to Projects;
}

entity Projects_AllOwners:  cuid {
    AllOwners       : types.userdata;
    Projects        : Association to Projects;
}

