namespace sap.ariba;
using { managed, cuid } from '@sap/cds/common';

using sap.ariba.type as types from '../types';


/**
    Name:	                ContractWorkspace (Strategic Sourcing)
    Description:	        ContractWorkspace
    Database Source:    	Operational Reporting API
*/

entity ContractWorkspaceOS: managed {
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

    AllOwners: Composition of many ContractWorkspaceOS_AllOwners on AllOwners.ContractWorkspaceOS = $self;
    ComplexSpendReleaseCreators: Composition of many ContractWorkspaceOS_ComplexSpendReleaseCreators on ComplexSpendReleaseCreators.ContractWorkspaceOS = $self;

    ComplexSpendReleaseApprovers:Composition of many ContractWorkspaceOS_ComplexSpendReleaseApprovers on ComplexSpendReleaseApprovers.ContractWorkspaceOS = $self;
    NoticeEmailRecipients: Composition of many ContractWorkspaceOS_NoticeEmailRecipients on NoticeEmailRecipients.ContractWorkspaceOS = $self;
    AdhocSpendUsers : Composition of many ContractWorkspaceOS_AdhocSpendUsers on AdhocSpendUsers.ContractWorkspaceOS = $self;
    ContractPublishingSupplierClassification : types.alwaysnull;
    ExpiringEmailRecipients: Composition of many ContractWorkspaceOS_ExpiringEmailRecipients on ExpiringEmailRecipients.ContractWorkspaceOS = $self;
    NotificationProfiles: Composition of many ContractWorkspaceOS_NotificationProfiles on NotificationProfiles.ContractWorkspaceOS = $self;
    Client: Composition of many ContractWorkspaceOS_Client on Client.ContractWorkspaceOS = $self;
    Region: Composition of many ContractWorkspaceOS_Region on Region.ContractWorkspaceOS = $self;
    AffectedParties: Composition of many ContractWorkspaceOS_AffectedParties on AffectedParties.ContractWorkspaceOS = $self;
    Commodity: Composition of many ContractWorkspaceOS_Commodity on Commodity.ContractWorkspaceOS = $self;
}

entity ContractWorkspaceOS_AllOwners:  cuid  {
    UniqueName                  : String(255) ;
    Name                        : String(255) ;
    FirstName                   : String(255) ;
    Phone                       : String(70) ;
    LastName                    : String(255) ;
    Fax                         : String(70) ;
    MiddleName                  : String(255) ;
    EmailAddress                : String(255) ;
    ContractWorkspaceOS                   : Association to ContractWorkspaceOS;
}
entity ContractWorkspaceOS_ComplexSpendReleaseCreators:  cuid  {
    UniqueName                  : String(255) ;
    Name                        : String(255) ;
    FirstName                   : String(255) ;
    Phone                       : String(70) ;
    LastName                    : String(255) ;
    Fax                         : String(70) ;
    MiddleName                  : String(255) ;
    EmailAddress                : String(255) ;
    ContractWorkspaceOS                   : Association to ContractWorkspaceOS;
}
entity ContractWorkspaceOS_ComplexSpendReleaseApprovers:  cuid  {
    UniqueName                  : String(255) ;
    Name                        : String(255) ;
    FirstName                   : String(255) ;
    Phone                       : String(70) ;
    LastName                    : String(255) ;
    Fax                         : String(70) ;
    MiddleName                  : String(255) ;
    EmailAddress                : String(255) ;
    ContractWorkspaceOS                   : Association to ContractWorkspaceOS;
}


entity ContractWorkspaceOS_NoticeEmailRecipients:  cuid  {
    UniqueName                  : String(255) ;
    Name                        : String(255) ;
    FirstName                   : String(255) ;
    Phone                       : String(70) ;
    LastName                    : String(255) ;
    Fax                         : String(70) ;
    MiddleName                  : String(255) ;
    EmailAddress                : String(255) ;
    ContractWorkspaceOS                   : Association to ContractWorkspaceOS;
}
entity ContractWorkspaceOS_ExpiringEmailRecipients:  cuid  {
    UniqueName                  : String(255) ;
    Name                        : String(255) ;
    FirstName                   : String(255) ;
    Phone                       : String(70) ;
    LastName                    : String(255) ;
    Fax                         : String(70) ;
    MiddleName                  : String(255) ;
    EmailAddress                : String(255) ;
    ContractWorkspaceOS                   : Association to ContractWorkspaceOS;
}

entity ContractWorkspaceOS_NotificationProfiles:  cuid  {
    InternalId                             : String(50);
    ContractWorkspaceOS                   : Association to ContractWorkspaceOS;
}
entity ContractWorkspaceOS_AdhocSpendUsers:  cuid  {
UniqueName                  : String(255) ;
    Name                        : String(255) ;
    FirstName                   : String(255) ;
    Phone                       : String(70) ;
    LastName                    : String(255) ;
    Fax                         : String(70) ;
    MiddleName                  : String(255) ;
    EmailAddress                : String(255) ;
    ContractWorkspaceOS                   : Association to ContractWorkspaceOS;
}
entity ContractWorkspaceOS_Client:  cuid  {
    DepartmentID                             : String(20);
    ContractWorkspaceOS                   : Association to ContractWorkspaceOS;
}

entity ContractWorkspaceOS_Region:  cuid  {
    Region                                : String(20);
    ContractWorkspaceOS                   : Association to ContractWorkspaceOS;
}
entity ContractWorkspaceOS_AffectedParties:  cuid  { //Todo Clean IDs
    Name: String(255);
    SystemID: String(50);
    ContractWorkspaceOS                   : Association to ContractWorkspaceOS;
}
entity ContractWorkspaceOS_Commodity:  cuid  { 
    UniqueName: String(50);
    Domain: String(50);
    ContractWorkspaceOS                   : Association to ContractWorkspaceOS;
}

