namespace sap.ariba;
using { managed, cuid } from '@sap/cds/common';

using sap.ariba.type as types from '../types';

/**
    Name:  Sourcing Request Project Task Approval Flow
    Class Name:       ariba.analytics.fact.SRProjectTaskApprovalFlowFact
    Description:       Sourcing Request Project Task Approval Flow
*/

entity SRProjectTaskApprovalFlows: managed   {

    key Realm: String(50);                       
    key TaskId: String(75);
    key RequestId: String(75);
    key ApproverId: String(75);
        LoadCreateTime: DateTime;
        LoadUpdateTime: DateTime;
        Task:types.task;
        Project:types.projectInfo;
        SourceSystem:types.sourceSystem;
        ApproverName:types.userdata;
        ApprovedBy:types.userdata;
        ApproverGroup:types.userdata;
        Rounds: String(10);
        ApproverType: String(50);
        Reason: String(1333);
        BeginDate: types.singleDate;
        ActionDate: types.singleDate;
        StepState: String(50);
        TaskAltStatus: String(50);
        StepStatus: String(50);
        Comments: String(1000);
        ActivationDate: types.singleDate;
        SRProject: types.srProject;
}

