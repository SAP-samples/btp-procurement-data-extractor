namespace sap.ariba;
using { managed, cuid } from '@sap/cds/common';

using sap.ariba.type as types from '../../types';


/**
    Name:	                DocumentTask (Strategic Sourcing)
    Description:	        DocumentTask
    Database Source:    	Operational Reporting API
*/

entity DocumentTask_OP: managed {
    key Realm                               : String(50);
    key InternalId                          : String(50);
    DocumentId                              : types.documentId;
    ExternalApprovalEnabled                 : Boolean;
    Owner                                   : types.effectiveUser;
    Description                             : String(4000);
    CommittedDueDate                        : DateTime;
    TimeCreated                             : DateTime;
    Required                                : Boolean;
    EndDateTime                             : DateTime;                     
    BoardingType                            : String(30);
    RoundNumber                             : Integer;                     
    DueDate                                 : DateTime;
    Status                                  : String(30);
    ApprovalRuleFlowType                    : Integer;
    CreatedBy                               : types.effectiveUser;
    Observers                               : types.alwaysnull;
    Title                                   : String(255);
    EndDate                                 : DateTime;
    IsMilestone                             : Boolean;
    TimeUpdated                             : DateTime;
    BeginDate                               : DateTime;
    TemplateObject                          : types.abstractDocument;
    Active                                  : Boolean;
    Type                                    : String(30);
    Alert                                   : String(20);
    IsAutoComplete                          : Boolean;
    AltStatus                               : String(30);
    
    Approver          : Composition of many DocumentTask_Approver_OP on Approver.DocumentTask = $self;
    ActiveApprover   : Composition of many DocumentTask_ActiveApprovers_OP on ActiveApprover.DocumentTask = $self;
    ApprovalRequests  : Composition of many DocumentTask_ApprovalRequests_OP on ApprovalRequests.DocumentTask = $self;
    Observer : Composition of many DocumentTask_Observer_OP on Observer.DocumentTask = $self;
}

entity DocumentTask_Approver_OP:  cuid {
    key DocumentTask      : Association to DocumentTask_OP;
    Approver          : Composition of many DocumentTask_Approver_Approver_OP on Approver.DocumentTaskApprover =$self;
}

entity DocumentTask_Approver_Approver_OP: cuid{
    DocumentTaskApprover       : Association to DocumentTask_Approver_OP;
    UniqueName                  : String(255) default '';
    Name                        : String(255) default '';
    FirstName                   : String(255) default '';
    Phone                       : String(70) default '';
    LastName                    : String(255) default '';
    Fax                         : String(70) default '';
    MiddleName                  : String(255) default '';
    EmailAddress                : String(255) default '';
    BusinessContact             : types.documentTaskApproverBC;
}

entity DocumentTask_ActiveApprovers_OP:  cuid {
    DocumentTask      : Association to DocumentTask_OP;
    UniqueName             : String(255);
    ActiveApprover : types.effectiveUser;
}

entity DocumentTask_Observer_OP:  cuid {
    DocumentTask      : Association to DocumentTask_OP;
    Observer : types.effectiveUser;
}

entity DocumentTask_ApprovalRequests_OP:  cuid {
    key DocumentTask      : Association to DocumentTask_OP;
    LastModified      : DateTime;
    ReportingReason   : String(255);
    ApprovedBy        : types.effectiveUser;
    State             : Integer;
    ApprovalRequired  : Boolean;
    ActivationDate    : DateTime;
    Approver          : Composition of many DocumentTask_ApprovalRequests_Approver_OP on Approver.DocumentTaskApprovalRequests = $self;
 
}

entity DocumentTask_ApprovalRequests_Approver_OP: cuid{
    key DocumentTaskApprovalRequests         : Association to DocumentTask_ApprovalRequests_OP;
    UniqueName                  : String(255) default '';
    Name                        : String(255) default '';
    FirstName                   : String(255) default '';
    Phone                       : String(70) default '';
    LastName                    : String(255) default '';
    Fax                         : String(70) default '';
    MiddleName                  : String(255) default '';
    EmailAddress                : String(255) default '';
    BusinessContact             : types.documentTaskApproverBC;
}
