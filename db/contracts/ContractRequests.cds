namespace sap.ariba;
using { managed,cuid } from '@sap/cds/common';

using sap.ariba.type as types from '../types';

/**
    Name:	ContractRequests
    Class Name:	ariba.analytics.fact.ContractRequestFact
    Description:	ContractRequest
    Database Table Name:	FACT_CONTRACTREQUEST_FACT
*/
entity ContractRequests: managed,types.customFields   {
    key Realm: String(50);
    key ProjectId: String(50);
        ContractId: String(50);
        LoadCreateTime: DateTime;
        LoadUpdateTime: DateTime;
        Description: String(1000);
        AclId: Double;
        Duration: Double;
        BeginDate: types.singleDate;
        DueDate: types.singleDate;
        EndDate: types.singleDate;
        Status: String(30);
        State: String(20);
        OnTimeOrLate: String(10);
        Owner: types.owner;
        ProjectInfo: types.projectInfo;
        DependsOnProject: types.projectInfo;
        ContainerProject: types.projectInfo;
        Process: types.process;
        IsTestProject: Boolean;
        SourceSystem: types.sourceSystem;
        ProcessStatus: String(50);
        Contract: types.contract;
        HierarchyType: String(25);
        Supplier:types.supplier;
        DocumentVersion:String(10);
        ParentAgreement:types.projectInfo;
        ContractStatus: String(25);
        AmendmentReason: String(25);
        AmendmentVersion: String(5);
        Amount:Double;
        ContractCurrency: String(30);
        ProposedAmount:Double;
        OrigProposedAmount:Double;
        OrigAmount:Double;
        EffectiveDate:  types.singleDate;
        ExpirationDate:  types.singleDate;
        AgreementDate:  types.singleDate;
        IsEvergreen:Boolean;
        RelatedId: String(30);
        AutoRenewalInterval:Double;
        MaxAutoRenewalsAllowed:Double;
        AutoRenewalCount:Double;
        ExpirationTermType: String(50);
        NoticePeriod:Double;
        IsCombinedSpend:Boolean;
        AllowAdhocSpend:Boolean;
        LastPublishedDate:  types.singleDate;

        
        Commodity                       : Composition of many ContractRequests_Commodity on Commodity.ContractRequests = $self;
        Organization                    : Composition of many ContractRequests_Organization on Organization.ContractRequests = $self;
        Region                          : Composition of many ContractRequests_Region on Region.ContractRequests = $self;
        AffectedParties                 : Composition of many ContractRequests_AffectedParties on AffectedParties.ContractRequests = $self;
        AllOwners                       : Composition of many ContractRequests_AllOwners on AllOwners.ContractRequests = $self;

}

entity ContractRequests_Commodity:  cuid  {
    Commodity                           : types.commodity;
    ContractRequests                   : Association to ContractRequests;
}

entity ContractRequests_Organization:  cuid  {
    Organization                        : types.organization;
    ContractRequests                   : Association to ContractRequests;
}

entity ContractRequests_Region:  cuid  {
    Region                              : types.region;
    ContractRequests                   : Association to ContractRequests;
}

entity ContractRequests_AffectedParties:  cuid  {
    AffectedParties                     : types.supplier;
    ContractRequests                   : Association to ContractRequests;
}

entity ContractRequests_AllOwners:  cuid  {
    AllOwners                           : types.contact;
    ContractRequests                   : Association to ContractRequests;
}