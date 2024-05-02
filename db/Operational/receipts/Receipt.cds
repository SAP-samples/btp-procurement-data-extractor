namespace sap.ariba;
using { managed, cuid } from '@sap/cds/common';

using sap.ariba.type as types from '../../types';

/**
    Name:Receipt Operational Procurement
    Description:Receipt Operational Procurement
*/

entity Receipt_OP: managed ,types.customFields  {
    key Realm                           : String(50);
    key UniqueName                      : String(50);

        ANSentState                     : Integer;
        Active                          : Boolean;
        CloseOrder                      : Boolean;
        DueDate                         : DateTime;
        ERPReceiptNumber                : String(50);
        GoodsReturnTrackingNumber       : String(100);
        IsImported                      : Boolean;
        IsInTransitionToManual          : Boolean;
        IsReceiptPushFailed             : Boolean;
        IsUnitPriceChanged              : Boolean;
        MasterAgreement                 : types.masterAgreement;
        Order                           : types.operationalOrder;
        ProcessedState                  : Integer;
        ProcurementUnit                 : types.procurementUnit;
        RecentReceiveDate               : DateTime;
        Name                            : String(128);
        ApprovedState                   : Integer;
        Type                            : String(100);
        HoldTillDate                    : DateTime;
        ApprovalRequestsVersion         : Integer;
        Preparer                        : types.operationalUser;
        Requester                       : types.operationalUser;
        StatusString                    : String(50);
        LastModified                    : DateTime;
        CreateDate                      : DateTime;
        SubmitDate                      : DateTime;
        ApprovedDate                    : DateTime;
        ResubmitDate                    : DateTime;
        PreviousVersion                 : types.genericRoot;
        NextVersion                     : types.genericRoot;
        VersionNumber                   : Integer;
        InitialUniqueName               : String(255);
        ChangedBy                       : types.operationalUser;
        PreviousApprovalRequestsVersion : Integer;

        ReceiptItems                    : Composition of many Receipt_ReceiptItems_OP on ReceiptItems.Receipt = $self;
        ApprovalRequests                : Composition of many Receipt_ApprovalRequests_OP on ApprovalRequests.Receipt = $self;
}

entity Receipt_ReceiptItems_OP: cuid {
    key Receipt                      : Association to Receipt_OP;

        ERPReceiptLineNumber            : String(50);
        UnitOfMeasure                   : types.unitOfMeasure2;
        AmountAccepted                  : types.money;
        AmountInvoiced                  : types.money;
        AmountPreviouslyAccepted        : types.money;
        AmountPreviouslyRejected        : types.money;
        AmountReconciled                : types.money;
        AmountRejected                  : types.money;
        AssetDataNeeded                 : Integer;
        Comment                         : String(2000);
        Date                            : DateTime;
        ERPPOLineNumber                 : String(50);
        ERPPONumber                     : String(50);
        GrossAmountAccepted             : types.money;
        GrossAmountPreviouslyAccepted   : types.money;
        GrossAmountPreviouslyRejected   : types.money;
        NumberInCollection              : Integer;
        GrossAmountRejected             : types.money;
        IsMilestone                     : Boolean;
        IsMilestoneComplete             : Boolean;
        MilestoneCompletionDate         : DateTime;
        NotifyPurchasingAgent           : Boolean;
        NumberAccepted                  : Double;
        NumberInvoiced                  : Double;
        NumberPreviouslyAccepted        : Double;
        NumberPreviouslyRejected        : Double;
        NumberReconciled                : Double;
        NumberRejected                  : Double;
        PushStatus                      : Integer;
        ReceiptId                       : String(50);
        ReceivingType                   : Integer;
        ReturnBy                        : String(20);

        AssetData                       : Composition of many Receipt_ReceiptItems_AssetData_OP on AssetData.ReceiptItems = $self;
}

entity Receipt_ReceiptItems_AssetData_OP: cuid {
    key ReceiptItems    : Association to Receipt_ReceiptItems_OP;

        UnitNumber      : Integer;
        SerialNumber    : String(50);
        TagNumber       : String(50);
        Location        : String(50);
}

entity Receipt_ApprovalRequests_OP: cuid {
    key Receipt                       : Association to Receipt_OP;

        RuleName                        : String(255);
        Creator                         : types.operationalUser;
        State                           : Integer;
        ApprovalRequired                : Boolean;
        LastModified                    : DateTime;
        ActivationDate                  : DateTime;
        ReportingReason                 : String(255);
        Reason                          : String(255);
        ApprovedBy                      : types.operationalUser;
        AssignedTo                      : types.operationalUser;
        AssignedDate                    : DateTime;
        ManuallyAdded                   : Boolean;
        IsEscalatedToList               : Boolean;
        ApproverComment                 : String(1000);
        AllowEscalationPeriodExtension  : Boolean;
        EscalationWarningDate           : DateTime;
        EscalationDate                  : DateTime;
        IsEscalationExtended            : Boolean;
        ExtendEscalationReasonCode      : String(255);
        ReportingExtendEscalationReason : String(255);
        ExtendEscalationUserComments    : String(2000);
        EscalationExtendedByUser        : types.operationalUser;
        EscalationExtensionDate         : DateTime;

        Approvers                       : Composition of many Receipt_ApprovalRequests_Approver_OP on Approvers.ReceiptApprovalRequests = $self;

}

entity Receipt_ApprovalRequests_Approver_OP: cuid {
    key ReceiptApprovalRequests       : Association to Receipt_ApprovalRequests_OP;
        UniqueName                      : String(255) default '';
        PasswordAdapter                 : String(50) default '';
}



