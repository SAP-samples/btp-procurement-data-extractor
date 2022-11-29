namespace sap.ariba;
using { managed, cuid } from '@sap/cds/common';

using sap.ariba.type as types from '../types';


/**
    Name:	                SM Project
    Class Name:	            ariba.analytics.fact.SMProject
    Description:	        SM Project
    Database Table Name:	FACT_SM_PROJECT
*/
entity SMProjects: managed  {
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
        Owner                           : types.owner;
        ProjectInfo                     : types.projectInfo;
        DependsOnProject                : types.projectInfo;
        ContainerProject                : types.projectInfo;
        Process                         : types.process;
        IsTestProject                   : Boolean;
        SourceSystem                    : types.sourceSystem;
        ProcessStatus                   : String(50);
        SMProjectInfo                   : types.projectInfo;
        Supplier                        : types.supplier;
        QuestionnaireSubmissionDate     : types.day;
        ReinviteDate                    : types.day;
        ReinviteCount                   : Double;
        ApprovedDate                    : types.day;
        UpdateApprovedDate              : types.day;
        DeniedDate                      : types.day;
        UpdateDeniedDate                : types.day;

        Region                          : Composition of many SMProjects_Region on Region.SMProject = $self;
        Commodity                       : Composition of many SMProjects_Commodity on Commodity.SMProject = $self;
        Organization                    : Composition of many SMProjects_Organization on Organization.SMProject = $self;
        AllOwners                       : Composition of many SMProjects_AllOwners on AllOwners.SMProject = $self;

}


entity SMProjects_Commodity: cuid {
    Commodity   : types.commodity;
    SMProject   : Association to SMProjects;
}

entity SMProjects_Region:  cuid {
    Region      : types.region;
    SMProject   : Association to SMProjects;
}

entity SMProjects_Organization:  cuid {
    Organization    : types.organization;
    SMProject       : Association to SMProjects;
}

entity SMProjects_AllOwners:  cuid {
    AllOwners   : types.user;
    SMProject   : Association to SMProjects;
}
