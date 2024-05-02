namespace sap.ariba;
using { managed, cuid } from '@sap/cds/common';

using sap.ariba.type as types from '../../types';

/**
    Name:	Procurement Workspace
    Class Name:	ariba.analytics.fact.ServicesProcurementWorkspaceFact
    Description:	Procurement Workspace
    Database Table Name:	FACT_SERVICES_PROCUREMENT_WF
*/

entity ServicesProcurementWorkspaces_AN: managed,types.customFields   {
    key Realm                   : String(50);
    key ProjectId               : String(50);

        LoadCreateTime          : DateTime;
        LoadUpdateTime          : DateTime;
        Description             : String(1000);
        AclId                   : Integer;
        Duration                : Double;
        BeginDate               : types.singleDate;
        DueDate                 : types.singleDate;
        EndDate                 : types.singleDate;
        Status                  : String(30);
        State                   : String(20);
        OnTimeOrLate            : String(10);
        Owner                   : types.owner;
        ProjectInfo             : types.projectInfo;
        DependsOnProject        : types.projectInfo;
        ContainerProject        : types.projectInfo;
        Process                 : types.process;
        IsTestProject           : Boolean;
        SourceSystem            : types.sourceSystem;
        ProcessStatus           : String(50);
        ProjectDeliverables     : String(255);
        ProcurementStartDate    : types.singleDate;
        ProcurementEndDate      : types.singleDate;
        ProcurementType         : String(50);
        PricingStructure        : String(50);
        ProjectLead             : types.owner;
        TotalSpend              : Double;
        InvoicedSpend           : Double;

        Commodity           : Composition of many ServicesProcurementWorkspaces_Commodity_AN on Commodity.ServicesProcurementWorkspaces = $self;
        Organization        : Composition of many ServicesProcurementWorkspaces_Organization_AN on Organization.ServicesProcurementWorkspaces = $self;
        Region              : Composition of many ServicesProcurementWorkspaces_Region_AN on Region.ServicesProcurementWorkspaces = $self;
        AllOwners           : Composition of many ServicesProcurementWorkspaces_AllOwners_AN on AllOwners.ServicesProcurementWorkspaces = $self;
        Suppliers           : Composition of many ServicesProcurementWorkspaces_Suppliers_AN on Suppliers.ServicesProcurementWorkspaces = $self;

}

entity ServicesProcurementWorkspaces_Organization_AN: cuid {
    Organization                    : types.organization;
    ServicesProcurementWorkspaces   : Association to ServicesProcurementWorkspaces_AN;
}

entity ServicesProcurementWorkspaces_Commodity_AN: cuid {
    Commodity                       : types.commodity;
    ServicesProcurementWorkspaces   : Association to ServicesProcurementWorkspaces_AN;
}

entity ServicesProcurementWorkspaces_Region_AN:  cuid {
    Region                          : types.region;
    ServicesProcurementWorkspaces   : Association to ServicesProcurementWorkspaces_AN;
}

entity ServicesProcurementWorkspaces_AllOwners_AN:  cuid {
    AllOwners                       : types.userdata;
    ServicesProcurementWorkspaces   : Association to ServicesProcurementWorkspaces_AN;
}

entity ServicesProcurementWorkspaces_Suppliers_AN:  cuid {
    Suppliers                       : types.supplier;
    ServicesProcurementWorkspaces   : Association to ServicesProcurementWorkspaces_AN;
}

