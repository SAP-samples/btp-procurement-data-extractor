namespace sap.ariba;
using { managed,cuid } from '@sap/cds/common';

using sap.ariba.type as types from '../types';
/**
    Name:	Contract Workspace (Procurement)
    Class Name:	ariba.analytics.fact.ContractWorkspace
    Description:	Contract Workspace (Procurement)
    Database Table Name:	FACT_CONTRACT_WORKSPACE
*/
entity ContractWorkspaces: managed,types.customFields  {
    key ProjectId                       : String(50);
    key Realm                           : String(50);
        LoadCreateTime                  : DateTime;
        LoadUpdateTime                  : DateTime;
        Description                     : String(1000);
        AclId                           : Double;
        Duration                        : Double;
        BeginDate                       : types.day;
        DueDate                         : types.day;
        EndDate                         : types.day;
        Status                          : String(30);
        State                           : String(20);
        OnTimeOrLate                    : String(10);
        Owner                           : types.contact;
        ProjectInfo                     : types.projectInfo;
        DependsOnProject                : types.projectInfo;
        ContainerProject                : types.projectInfo;
        Process                         : types.process;
        IsTestProject                   : Boolean;
        SourceSystem                    : types.sourceSystem;
        ProcessStatus                   : String(50);
        Contract                        : types.contract;
        HierarchyType                   : String(25);
        Supplier                        : types.supplier;
        ContractId                      : String(50);
        DocumentVersion                 : String(10);
        ParentAgreement                 : types.projectInfo;
        ContractStatus                  : String(25);
        AmendmentReason                 : String(25);
        AmendmentVersion                : String(5);
        Amount                          : Double;
        ContractCurrency                : String(30);
        ProposedAmount                  : Double;
        OrigProposedAmount              : Double;
        OrigAmount                      : Double;
        EffectiveDate                   : types.day;
        ExpirationDate                  : types.day;
        AgreementDate                   : types.day;
        IsEvergreen                     : Boolean;
        RelatedId                       : String(30);
        AutoRenewalInterval             : Double;
        MaxAutoRenewalsAllowed          : Double;
        AutoRenewalCount                : Double;
        ExpirationTermType              : String(50);
        NoticePeriod                    : Double;
        IsCombinedSpend                 : Boolean;
        AllowAdhocSpend                 : Boolean;
        LastPublishedDate               : types.day;
        ComplexSpendAvailableAmount     : Double;
        ProposedIncrementalAmount       : Double;
        ApprovedAmount                  : Double;

        Commodity                       : Composition of many ContractWorkspaces_Commodity on Commodity.ContractWorkspace = $self;
        Organization                    : Composition of many ContractWorkspaces_Organization on Organization.ContractWorkspace = $self;
        Region                          : Composition of many ContractWorkspaces_Region on Region.ContractWorkspace = $self;
        AffectedParties                 : Composition of many ContractWorkspaces_AffectedParties on AffectedParties.ContractWorkspace = $self;
        AllOwners                       : Composition of many ContractWorkspaces_AllOwners on AllOwners.ContractWorkspace = $self;

}

entity ContractWorkspaces_Commodity:  cuid  {
    Commodity                           : types.commodity;
    ContractWorkspace                   : Association to ContractWorkspaces;
}

entity ContractWorkspaces_Organization:  cuid  {
    Organization                        : types.organization;
    ContractWorkspace                   : Association to ContractWorkspaces;
}

entity ContractWorkspaces_Region:  cuid  {
    Region                              : types.region;
    ContractWorkspace                   : Association to ContractWorkspaces;
}

entity ContractWorkspaces_AffectedParties:  cuid  {
    AffectedParties                     : types.supplier;
    ContractWorkspace                   : Association to ContractWorkspaces;
}

entity ContractWorkspaces_AllOwners:  cuid  {
    AllOwners                           : types.contact;
    ContractWorkspace                   : Association to ContractWorkspaces;
}