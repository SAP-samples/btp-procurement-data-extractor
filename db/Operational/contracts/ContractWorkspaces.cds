namespace sap.ariba;
using { managed, cuid } from '@sap/cds/common';

using sap.ariba.type as types from '../../types';


/**
    Name:	                ContractWorkspace (Strategic Sourcing)
    Description:	        ContractWorkspace
    Database Source:    	Operational Reporting API
*/

entity ContractWorkspaces_OP: managed {
    key Realm                               : String(50);
    key InternalId                          : String(200);
    Status                                  : String(30);
    LastModifiedBy                          : types.effectiveUser;
    Owner                                   : types.effectiveUser;
    Description                             : String(4000);
    Title                                   : String(255);
    TimeUpdated                             : DateTime;
    LastModified                            : DateTime;
    TimeCreated                             : DateTime;
    Active                                  : Boolean;
    ProjectAddin                            : types.projectAddin;
    ParentDocument                          : types.abstractDocument;

    ContractTerms                           : types.alwaysnull;   
    MainCPVCode: types.alwaysnull;//from data
    NoticePeriod : Integer;        
    AmendmentReason:String(30);
    MatchAtleastOneStatusPerProcessType : Boolean; 
    DMSContent: types.alwaysnull;
    FactoryProcessAndStatusList:String(100);
    OriginalExpirationDate: DateTime;
    AmendmentReasonComment:String(1000);
    ProposedAmount:types.money;
    ContractCreationSupplierClassification:types.alwaysnull;//from data
    EngagementRequestId:String(255);
    NoticeReminderBegin:Integer;
    ContractIntegrationSupplierClassification:types.alwaysnull;//from data
    Supplier:types.parentWorkspaceSupplier; // Todo : Clean OrganizationIDs flattening structure
    BusinessSystem:types.businesssystem;
    Amount:types.money;
    LinkedEventDocIdList:String(50);
    CopyFrom:types.contextObject;
    ExpirationDate:DateTime;
    ComplexSpendAvailableAmount:types.money;
    BaseLanguage:types.LocaleId;
   
    Origin: Integer;
    NoteBox: types.notebox;
    RelatedId:String(30);
    IsContractRequest: Boolean;
    NoticeReminderFrequency:Integer;
    Creator:types.alwaysnull;//from data
    CreateDate:DateTime;
    AutoRenewalCount:Integer;
    LastPublishedDate:DateTime;
    ProposedIncrementalAmount:types.money;
    AutoRenewalInterval:Integer;
    UniqueId:String(200);
    AdditionalCPVCode: types.alwaysnull;//from data
    ContractPublishingFactoryClassification: types.alwaysnull;//from data
    TemplateItemAddin: types.alwaysnull; // Todo : Clean from structure
    ExpirationTermType:String(50);
    AgreementPath:String(500);
    PredecessorEventDocId:String(50);
    ContractType:String(50); 
    HierarchicalType:String(30);
    DoNotAllowPublishingContractsWithUnApprovedFactories:Boolean;
    Category: types.alwaysnull; // Todo : Clean from structure
    AgreementDate:DateTime;
    ContractStatus:String(30);
    DoNotAllowPublishingContractsWithBlockedFactories:Boolean;
    IsEvergreen:Boolean; 
    AmendmentCreateDate: DateTime;
    ProjectSubType:String(50);
    IsComplexSpendWorkspace:Boolean;
    TimeZoneID:String(50);
    ExpiringReminderFrequency:Integer;
    NoticeDate:DateTime;
    AllowAdhocSpend:Boolean;
    ContractId:String(200);
    VersionComment:String(500);
    ExpiringReminderBegin:Integer;
    MaxAutoRenewalsAllowed:Integer;
    EffectiveDate:DateTime;

    AllOwners: Composition of many ContractWorkspaces_AllOwners_OP on AllOwners.ContractWorkspaces = $self;
    ComplexSpendReleaseCreators: Composition of many ContractWorkspaces_ComplexSpendReleaseCreators_OP on ComplexSpendReleaseCreators.ContractWorkspaces = $self;

    ComplexSpendReleaseApprovers:Composition of many ContractWorkspaces_ComplexSpendReleaseApprovers_OP on ComplexSpendReleaseApprovers.ContractWorkspaces = $self;
    NoticeEmailRecipients: Composition of many ContractWorkspaces_NoticeEmailRecipients_OP on NoticeEmailRecipients.ContractWorkspaces = $self;
    AdhocSpendUsers : Composition of many ContractWorkspaces_AdhocSpendUsers_OP on AdhocSpendUsers.ContractWorkspaces = $self;
    ContractPublishingSupplierClassification : types.alwaysnull;
    ExpiringEmailRecipients: Composition of many ContractWorkspaces_ExpiringEmailRecipients_OP on ExpiringEmailRecipients.ContractWorkspaces = $self;
    NotificationProfiles: Composition of many ContractWorkspaces_NotificationProfiles_OP on NotificationProfiles.ContractWorkspaces = $self;
    Client: Composition of many ContractWorkspaces_Client_OP on Client.ContractWorkspaces = $self;
    Region: Composition of many ContractWorkspaces_Region_OP on Region.ContractWorkspaces = $self;
    AffectedParties: Composition of many ContractWorkspaces_AffectedParties_OP on AffectedParties.ContractWorkspaces = $self;
    Commodity: Composition of many ContractWorkspaces_Commodity_OP on Commodity.ContractWorkspaces = $self;
}

entity ContractWorkspaces_AllOwners_OP:  cuid  {
    UniqueName                  : String(255) ;
    Name                        : String(255) ;
    FirstName                   : String(255) ;
    Phone                       : String(70) ;
    LastName                    : String(255) ;
    Fax                         : String(70) ;
    MiddleName                  : String(255) ;
    EmailAddress                : String(255) ;
    ContractWorkspaces                   : Association to ContractWorkspaces_OP;
}
entity ContractWorkspaces_ComplexSpendReleaseCreators_OP:  cuid  {
    UniqueName                  : String(255) ;
    Name                        : String(255) ;
    FirstName                   : String(255) ;
    Phone                       : String(70) ;
    LastName                    : String(255) ;
    Fax                         : String(70) ;
    MiddleName                  : String(255) ;
    EmailAddress                : String(255) ;
    ContractWorkspaces                   : Association to ContractWorkspaces_OP;
}
entity ContractWorkspaces_ComplexSpendReleaseApprovers_OP:  cuid  {
    UniqueName                  : String(255) ;
    Name                        : String(255) ;
    FirstName                   : String(255) ;
    Phone                       : String(70) ;
    LastName                    : String(255) ;
    Fax                         : String(70) ;
    MiddleName                  : String(255) ;
    EmailAddress                : String(255) ;
    ContractWorkspaces                   : Association to ContractWorkspaces_OP;
}


entity ContractWorkspaces_NoticeEmailRecipients_OP:  cuid  {
    UniqueName                  : String(255) ;
    Name                        : String(255) ;
    FirstName                   : String(255) ;
    Phone                       : String(70) ;
    LastName                    : String(255) ;
    Fax                         : String(70) ;
    MiddleName                  : String(255) ;
    EmailAddress                : String(255) ;
    ContractWorkspaces                   : Association to ContractWorkspaces_OP;
}
entity ContractWorkspaces_ExpiringEmailRecipients_OP:  cuid  {
    UniqueName                  : String(255) ;
    Name                        : String(255) ;
    FirstName                   : String(255) ;
    Phone                       : String(70) ;
    LastName                    : String(255) ;
    Fax                         : String(70) ;
    MiddleName                  : String(255) ;
    EmailAddress                : String(255) ;
    ContractWorkspaces                   : Association to ContractWorkspaces_OP;
}

entity ContractWorkspaces_NotificationProfiles_OP:  cuid  {
    InternalId                             : String(50);
    ContractWorkspaces                   : Association to ContractWorkspaces_OP;
}
entity ContractWorkspaces_AdhocSpendUsers_OP:  cuid  {
UniqueName                  : String(255) ;
    Name                        : String(255) ;
    FirstName                   : String(255) ;
    Phone                       : String(70) ;
    LastName                    : String(255) ;
    Fax                         : String(70) ;
    MiddleName                  : String(255) ;
    EmailAddress                : String(255) ;
    ContractWorkspaces                   : Association to ContractWorkspaces_OP;
}
entity ContractWorkspaces_Client_OP:  cuid  {
    DepartmentID                             : String(20);
    ContractWorkspaces                   : Association to ContractWorkspaces_OP;
}

entity ContractWorkspaces_Region_OP:  cuid  {
    Region                                : String(20);
    ContractWorkspaces                   : Association to ContractWorkspaces_OP;
}
entity ContractWorkspaces_AffectedParties_OP:  cuid  { //Todo Clean IDs
    Name: String(255);
    SystemID: String(50);
    SMVendorID: String(50);
    ContractWorkspaces                   : Association to ContractWorkspaces_OP;
}
entity ContractWorkspaces_Commodity_OP:  cuid  { 
    UniqueName: String(50);
    Domain: String(50);
    ContractWorkspaces                   : Association to ContractWorkspaces_OP;
}

