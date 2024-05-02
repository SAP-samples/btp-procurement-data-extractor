namespace sap.ariba;
using { managed,cuid } from '@sap/cds/common';

using sap.ariba.type as types from '../../types';

/**
    Name:	                Task Approvals
    Class Name:	            ariba.analytics.fact.S4ApprovalFlow
    Description:	        Task Approvals
    Database Table Name:	FACT_S4_APPROVAL_FLOW
*/
entity TaskApprovals_AN: managed   {
    key Realm               : String(50);
    key TaskId              : String(75);
    key RequestId           : String(75);
    key ApproverId          : String(75);
    key SourceSystemId      : String(100);

        LoadCreateTime      : DateTime;
        LoadUpdateTime      : DateTime;
        Task                : types.task;
        Project             : types.projectInfo;
        SourceSystem        : types.sourceSystem;
        ApproverName        : types.user;
        ApprovedBy          : types.user;
        ApproverGroup       : types.user;
        Rounds              : String(10);
        ApproverType        : String(50);
        Reason              : String(1333);
        BeginDate           : types.day;
        ActionDate          : types.day;
        StepState           : String(50);
        TaskAltStatus       : String(50);
        StepStatus          : String(50);
        Comments            : String(1000);
        ActivationDate      : types.day;

}