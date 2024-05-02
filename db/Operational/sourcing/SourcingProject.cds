namespace sap.ariba;
using { managed, cuid } from '@sap/cds/common';

using sap.ariba.type as types from '../../types';


/**
    Name:	                SourcingProject (Strategic Sourcing)
    Description:	        SourcingProject
    Database Source:    	Operational Reporting API
*/

entity SourcingProject_OP: managed {
    key Realm                               : String(50); 
    key InternalId                              : String(2000);
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
    ProjectAddin                            : types.projectAddin;
    AwardJustification                      : String(1000);
    Changed                                 : Boolean;
    ParentDocument                          : types.abstractDocument;
    Currency                                : types.currency;
    DocumentVersion                         : Integer;
    Status                                  : String(30);   
    IsVersionPinned                         : Boolean;
    Title                                   : String(255);
    TimeUpdated                             : DateTime;
    BaselineSpend                           : types.money;
    TemplateObject                          : types.abstractDocument;
    ResultsDescription                      : String(1000);
    Active                                  : Boolean;
    ParentWorkspace                         : types.parentWorkspace;
    ActualSaving                            : types.money;
    NextVersion                             : types.abstractDocument;
    PlannedEndDate                          : DateTime;
    Alert                                   : String(20);
    ProcessId                               : String(50);
    TargetSavingPct                         : Double;

    SubContent         : Composition of many SourcingProject_SubContent_OP on SubContent.SourcingProject = $self;
    Client             : Composition of many SourcingProject_Client_OP on Client.SourcingProject = $self;
    Region             : Composition of many SourcingProject_Region_OP on Region.SourcingProject = $self;
    Commodity          : Composition of many SourcingProject_Commodity_OP on Commodity.SourcingProject = $self;
     
 
    Suppliers          : Composition of many SourcingProject_Suppliers_OP on Suppliers.SourcingProject = $self;
    
}


entity SourcingProject_SubContent_OP:  cuid {
    SourcingProject   : Association to SourcingProject_OP;
    InternalId        : String(50);
    Title             : String(255);
}
entity SourcingProject_Client_OP:  cuid {
    SourcingProject   : Association to SourcingProject_OP;
    DepartmentID       : String(50);
    Description        : String(255);
}
entity SourcingProject_Region_OP:  cuid {
    SourcingProject   : Association to SourcingProject_OP;
    Region            : String(50);
    Description       : String(255);
}
entity SourcingProject_Commodity_OP:  cuid {
    SourcingProject   : Association to SourcingProject_OP;
    Domain            : String(50);
    UniqueName        : String(50);
    Name              : String(255);
}
entity SourcingProject_Suppliers_OP:  cuid {
    SourcingProject   : Association to SourcingProject_OP;
    SystemID          : String(64);
    Name              : String(255);
}