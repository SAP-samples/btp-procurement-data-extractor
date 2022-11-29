namespace sap.ariba;
using { managed, cuid } from '@sap/cds/common';

using sap.ariba.type as types from '../types';


/**
    Name:	                Supplier Request Project
    Class Name:	            ariba.analytics.fact.SupplierRequestProject
    Description:	        Supplier Request Project
    Database Table Name:	FACT_SUPPLIER_REQUEST_PROJECT
*/
entity SupplierRequestProjects: managed  {
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
        RequestStatus                   : String(255);
        IsExternalSupplierData          : Boolean;
        IsSelfRegistration              : Boolean;

        Region                          : Composition of many SupplierRequestProjects_Region on Region.SupplierRequestProject = $self;
        Commodity                       : Composition of many SupplierRequestProjects_Commodity on Commodity.SupplierRequestProject = $self;
        Organization                    : Composition of many SupplierRequestProjects_Organization on Organization.SupplierRequestProject = $self;
        AllOwners                       : Composition of many SupplierRequestProjects_AllOwners on AllOwners.SupplierRequestProject = $self;

}

entity SupplierRequestProjects_Commodity: cuid {
    Commodity                   : types.commodity;
    SupplierRequestProject : Association to SupplierRequestProjects;
}

entity SupplierRequestProjects_Region:  cuid {
    Region                      : types.region;
    SupplierRequestProject : Association to SupplierRequestProjects;
}

entity SupplierRequestProjects_Organization:  cuid {
    Organization                : types.organization;
    SupplierRequestProject : Association to SupplierRequestProjects;
}

entity SupplierRequestProjects_AllOwners:  cuid {
    AllOwners                   : types.user;
    SupplierRequestProject : Association to SupplierRequestProjects;
}
