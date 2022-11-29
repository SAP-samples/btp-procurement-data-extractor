namespace sap.ariba;
using { managed, cuid } from '@sap/cds/common';

using sap.ariba.type as types from '../types';


/*
    Name:	                Approval History
    Class Name:	            ariba.analytics.fact.ApprovalHistory
    Description:	        Approval History
    Database Table Name:	FACT_APPROVAL_HISTORY
*/
entity ApprovalHistory: managed  {
    key Realm                                           : String(50);
    key ApprovableId                                    : String(75);
    key ApprovableType                                  : String(100);
    key ApprovalRecordDate                              : DateTime;
    key UserId                                          : String(50);
    key SourceSystemId                                  : String(100);

        LoadCreateTime                                  : DateTime;
        LoadUpdateTime                                  : DateTime;
        Count                                           : Integer;
        ApprovableTitle                                 : String(128);
        ApprovableTypeUIName                            : String(100);
        ApprovableStatus                                : String(50);
        ApprovableSubmitDate                            : types.day;
        ApprovedDate                                    : types.day;
        Requester                                       : types.requester;
        Preparer                                        : types.user;
        ApprovalRecordUser                              : types.user;
        ApprovalRecordType                              : String(255);
        ApprovalRecordActivationDate                    : types.day;
        ApprovalRecordApprover                          : String(255);
        ApprovalRecordReason                            : String(255);
        ApprovalRecordState                             : String(32);
        ApprovalRecordRealUser                          : String(255);
        ApprovalRecordReportingExtendEscalationReason   : String(255);
        ApprovalRecordExtendEscalationUserComments      : String(2000);
        ApprovalRecordEscalationExtensionDate           : DateTime;
        SourceSystem                                    : types.sourceSystem;

}