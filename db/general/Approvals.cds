namespace sap.ariba;
using { managed,cuid } from '@sap/cds/common';

using sap.ariba.type as types from '../types';

/**
    Name:  Approvals
    Class Name:       ariba.analytics.fact.InvoiceExceptions
    Description:       Approval nodes
    Database Table Name:   FACT_APPROVALS
*/
entity Approval: managed   {

        key ApprovalActivationDate:                 DateTime;
        key ApprovableType:                         String(100);             
        key ApprovableId:                           String(75);
        key SourceSystemId:                         String(100);
        key Approver:                               String(255);
        SourceSystem:                               types.sourceSystem;
        LoadCreateTime:                             DateTime;
        LoadUpdateTime:                             DateTime;
        ApproverCount:                              Integer;
        WatcherCount:                               Integer;
        ApprovableTitle:                            String(128);
        ApprovableTypeUIName:                       String(100);
        ApprovableStatus:                           String(50);
        ApprovableSubmitDate:                       types.day;
        ApprovedDate:                               types.day;
        TotalApprovalTime:                          Integer;             
        Requester:                                  types.user;
        Preparer:                                   types.user;
        ProcurementUnit:                            types.procurementUnit;
        QueueAssignedTo:                            String(255);
        QueueAssignedDate:                          types.day;
        QueueApprovalTime:                          Integer;   
        ApproverAddedBy:                            String(255);
        ApproverDeletedBy:                          String(255);
        OldApprover:                                String(255);
        IsActiveApprover:                           Boolean;
        ApprovalDelegatedTo:                        types.user;
        ApprovalEscalatedTo:                        types.user;
        ApprovalState:                              String(32);                        
        ApprovalTime:                               Integer;
        ApprovalType:                               String(255);                        
        ApprovalDate:                               DateTime;
        ApprovalComments:                           String(2000);
        ApprovalRealUser:                           String(255);
        ApprovedByDelegatee:                        Boolean;
        ApprovalReason:                             String(255);
        ApproverIsManuallyAdded:                    Boolean;
        ApproverEmailAddress:                       String(255);
        IsEmailApproval:                            Boolean;
        ApprovalEscalationDate:                     DateTime;
        ApprovalEscalationExtended:                 Boolean;
        ApprovalEscalationExtensionDate:            DateTime;
        ApprovalEscExtByUser:                       types.user;
        ApprovalExtendEscalationReason:             String(255);
        ApprovalExtendEscalationUserComments:       String(2000);
        ApprovalReportingExtendEscalationReason:    String(255);
        Delegatees:                                 Composition of many Approval_Delegatees on Delegatees.Approval = $self;
        ApprovalRecordUser:                         types.user;
        key Realm                                   : String(25);

}

entity Approval_Delegatees:  cuid {
    Delegatees       : types.user;
    Approval : Association to Approval;
}