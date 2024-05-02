namespace sap.ariba;
using { managed, cuid } from '@sap/cds/common';

using sap.ariba.type as types from '../../types';


/**
    Name:	                SourcingRequest (Strategic Sourcing)
    Description:	        SourcingRequest
    Database Source:    	Operational Reporting API
*/

entity SourcingRequest_OP: managed {
    key Realm                               : String(50);
    key InternalId                          : String(2000);
    DocumentId                              : types.documentId;
    UniqueId                                : String(200);
    LastModifiedBy                          : types.effectiveUser;
    Owner                                   : types.effectiveUser;
    Description                             : String(4000);           
    ProcessStatus                           : String(50);
    CreateDate                              : DateTime;
    LastModified                            : DateTime;
    TimeCreated                             : DateTime;
    PlannedStartDate                        : DateTime;
    ContractEffectiveDate                   : DateTime;
    ProjectAddin                            : types.projectAddin;
    AwardJustification                      : String(1000);
    ContractMonths                          : Double;
    Changed                                 : Boolean;
    ParentDocument                          : types.abstractDocument;
    Currency                                : types.currency;
    DocumentVersion                         : Integer;
    ExecutionStrategy                       : String(50);
    Status                                  : String(30);    
    IsVersionPinned                         : Boolean;
    Title                                   : String(255);
    ProjectReason                           : String(50);
    TimeUpdated                             : DateTime;
    BaselineSpend                           : types.money;
    TemplateObject                          : types.abstractDocument;
    ResultsDescription                      : String(1000);
    Active                                  : Boolean;
    ParentWorkspace                         : types.parentWorkspace;
    ActualSaving                            : types.money;
    BaseLanguage                            : types.LocaleId;
    NextVersion                             : types.abstractDocument;
    PlannedEndDate                          : DateTime;
    Alert                                   : String(20);
    ProcessId                               : String(50);
    ExternalSystemCorrelationId             : String(255);
    TargetSavingPct                         : Double;

    SubContent         : Composition of many SourcingRequest_SubContent_OP on SubContent.SourcingRequest = $self;
    Client             : Composition of many SourcingRequest_Client_OP on Client.SourcingRequest = $self;
    Region             : Composition of many SourcingRequest_Region_OP on Region.SourcingRequest = $self;
    Commodity          : Composition of many SourcingRequest_Commodity_OP on Commodity.SourcingRequest = $self;
     
 
    Suppliers          : Composition of many SourcingRequest_Suppliers_OP on Suppliers.SourcingRequest = $self;
    
}


entity SourcingRequest_SubContent_OP:  cuid {
    SourcingRequest   : Association to SourcingRequest_OP;
    InternalId        : String(50);
    Title             : String(255);
}
entity SourcingRequest_Client_OP:  cuid {
    SourcingRequest   : Association to SourcingRequest_OP;
    DepartmentID       : String(50);
    Description        : String(255);
}
entity SourcingRequest_Region_OP:  cuid {
    SourcingRequest   : Association to SourcingRequest_OP;
    Region            : String(50);
    Description       : String(255);
}
entity SourcingRequest_Commodity_OP:  cuid {
    SourcingRequest   : Association to SourcingRequest_OP;
    Domain            : String(50);
    UniqueName        : String(50);
    Name              : String(255);
}
entity SourcingRequest_Suppliers_OP:  cuid {
    SourcingRequest   : Association to SourcingRequest_OP;
    SystemID          : String(64);
    Name              : String(255);
}