namespace sap.ariba;
using { managed,cuid } from '@sap/cds/common';

using sap.ariba.type as types from '../types';

/**
    Name:	                Pending Approval
    Class Name:	            ariba.analytics.fact.PendingApproval
    Description:	        Pending Approval
    Database Table Name:	FACT_PENDING_APPROVAL
*/
entity PendingApproval: managed   {
    key Realm                                           : String(50);
    key ApprovableId                                    : String(75);
    key ApprovableType                                  : String(100);
    key ApprovalRequestApprover                         : String(255);
    key ApprovalRequestActivationDate                   : DateTime;
    key SourceSystemId                                  : String(100);


        LoadCreateTime                                  : DateTime;
        LoadUpdateTime                                  : DateTime;
        ApprovalCount                                   : Integer;
        ApprovableTitle                                 : String(128);
        ApprovableTypeUIName                            : String(100);
        ApprovableSubmitDate                            : types.day;
        ApprovableStatus                                : String(50);
        Requester                                       : types.user;
        Preparer                                        : types.user;
        ApprovalRequestReason                           : String(255);
        ApprovalRequestEscalationExtendedByUser         : types.user;
        ApprovalRequestEscalationDate                   : DateTime;
        ApprovalRequestExtendEscalationReason           : String(255);
        ApprovalRequestExtendEscalationUserComments     : String(2000);
        ApprovalRequestIsEscalationExtended             : Boolean;
        ApprovalRequestExtendEscalationDate             : DateTime;
        SourceSystem                                    : types.sourceSystem;

}
