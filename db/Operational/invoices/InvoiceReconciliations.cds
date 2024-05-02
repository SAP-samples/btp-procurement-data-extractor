namespace sap.ariba;
using { managed, cuid } from '@sap/cds/common';

using sap.ariba.type as types from '../../types';


/**
    Name:	                InvoiceReconciliation (Procurement & Invoicing)
    Description:	        InvoiceReconciliation
    Database Table Name:	Operational Reporting API
*/

entity InvoiceReconciliation_OP: managed, types.customFields {
    key Realm                               : String(50);
    key UniqueName                          : String(50);
        AmountBilled                        : types.money;
        AmountCleared                       : types.money;
        ChargeAmount                        : types.money;
        DiscountAmount                      : types.money;
        EligibleForDynamicDiscount          : Boolean;
        Invoice                             : types.invoice;     
        PaymentModel                        : Integer;
        ExternalStatus                      : String(50);    
        IsAccruedOnIR                       : Boolean;
        NumberBilled                        : Double;
        NumberCleared                       : Double;
        PaidAmounts                         : types.paidAmounts; //paymentAmounts type
        PaidDate                            : DateTime;
        PayloadID                           : String(255);
        ProcessedState                      : Integer;
        ProcurementUnit                     : types.procurementUnit;
        RejectedDate                        : DateTime;
        RemittanceLocation                  : types.genericRoot;
        SourcingStatusString                : String(255);
        TaxAccrualAmount                    : types.money;
        ScheduledPaymentDate                : DateTime;
        MaxDiscountApplicable               : types.money;
        TaxAmount                           : types.money;
        VATAmount                           : types.money;
        VersionNumber                       : Integer;
        ServicePeriod                       : types.servicePeriod;
        TimeCreated                         : DateTime;
        TimeUpdated                         : DateTime;
        Active                              : Boolean;
        TotalInvoiced                       : types.money;
        Supplier                            : types.supplierUniqueName;
        SupplierLocation                    : types.address;
        InvoiceDate                         : DateTime;
        TotalWithholdingTax                 : types.money;
        TaxDetail                           : types.taxDetail;
        Name                                : String(255);
        ApprovedState                       : Integer;
        Type                                : String(100);
        ApprovalRequestsVersion             : Integer;
        Preparer                            : types.operationalUser;
        Requester                           : types.operationalUser;
        StatusString                        : String(100);
        LastModified                        : DateTime;
        CreateDate                          : DateTime;
        SubmitDate                          : DateTime;
        ApprovedDate                        : DateTime;
        ResubmitDate                        : DateTime;
        InitialUniqueName                   : String(255);
        ChangedBy                           : types.operationalUser;
        PreviousApprovalRequestsVersion     : Double;
        PurchaseOrg                         : types.purchaseOrg;
        ProjectID                           : String(100);
        ProjectTitle                        : String(100);
        HoldTillDate                        : DateTime;
        PreviousVersion                     : types.genericRoot;
        NextVersion                         : types.genericRoot;

        ServiceLocation                     : types.alwaysnull;
        InvoiceToCredit                     : types.genericRoot;

        ApprovalRequests                    : Composition of many InvoiceReconciliation_ApprovalRequests_OP on ApprovalRequests.InvoiceReconciliation = $self;
        ApprovalRecords                     : Composition of many InvoiceReconciliation_ApprovalRecords_OP on ApprovalRecords.InvoiceReconciliation = $self;
        LineItems                           : Composition of many InvoiceReconciliation_LineItem_OP on LineItems.InvoiceReconciliation = $self;
        Payments                            : Composition of many InvoiceReconciliation_Payments_OP on Payments.InvoiceReconciliation = $self; 
        Exceptions                          : Composition of many InvoiceReconciliation_Exceptions_OP on Exceptions.InvoiceReconciliation = $self; 
        Records                             : Composition of many InvoiceReconciliation_Records_OP on Records.InvoiceReconciliation = $self; 
        RejectionReasons                    : Composition of many InvoiceReconciliation_RejectionReasons_OP on RejectionReasons.InvoiceReconciliation = $self; 
        
}

 
entity InvoiceReconciliation_RejectionReasons_OP: cuid {
    key InvoiceReconciliation             : Association to InvoiceReconciliation_OP;

        Description                       : String(255);  
        ReasonCode                        : String(60);    
}

entity InvoiceReconciliation_Records_OP: cuid {
    key InvoiceReconciliation             : Association to InvoiceReconciliation_OP;

        Comment                          : types.comment;
}

entity InvoiceReconciliation_Exceptions_OP: cuid {
    key InvoiceReconciliation             : Association to InvoiceReconciliation_OP;

        ReconciledBy                      : types.operationalUser;
        State                             : Integer;    
        Type                              : types.exceptionTypeOp;
}

entity InvoiceReconciliation_Payments_OP: cuid {
    key InvoiceReconciliation             : Association to InvoiceReconciliation_OP;

        UniqueName                        : String(50);
        NetDueDate                        : DateTime;
}

entity InvoiceReconciliation_ApprovalRecords_OP: cuid {
    key InvoiceReconciliation             : Association to InvoiceReconciliation_OP;

        ActivationDate      : DateTime;
        User                : types.operationalUser;
        RealUser            : String(100);
        Date                : DateTime;
        Comment             : types.comment;
        ReceivedFromEmail   : String(128);
        State               : Integer;
}

entity InvoiceReconciliation_ApprovalRequests_OP: cuid {
    key InvoiceReconciliation                             : Association to InvoiceReconciliation_OP;


    ActivationDate                      : DateTime;
    LastModified                        : DateTime;
    AllowEscalationPeriodExtension      : Boolean;
    ApprovalRequired                    : Boolean;
    ApprovedBy                          : types.operationalUser;                                
    Creator                             : types.operationalUser;
    AssignedTo                          : types.operationalUser;
    EscalationExtendedByUser            : types.operationalUser;
    ApproverComment                     : String(255);
    ExtendEscalationReasonCode          : String(25);
    ExtendEscalationUserComments        : String(255);
    IsEscalatedToList                   : Boolean;
    IsEscalationExtended                : Boolean;
    ManuallyAdded                       : Boolean;
    Reason                              : String(255);
    ReportingExtendEscalationReason     : String(255);
    ReportingReason                     : String(255);
    RuleName                            : String(255);
    State                               : Integer;
    AssignedDate                        : DateTime;
    EscalationExtensionDate             : DateTime;
    EscalationDate                      : DateTime;

      Approvers                           : Composition of many InvoiceReconciliation_ApprovalRequests_Approver_OP on Approvers.InvoiceReconciliationApprovalRequests = $self;

}

entity InvoiceReconciliation_ApprovalRequests_Approver_OP: cuid{
    key InvoiceReconciliationApprovalRequests     : Association to InvoiceReconciliation_ApprovalRequests_OP;
        UniqueName                  : String(255);
        PasswordAdapter             : String(50);
}


entity InvoiceReconciliation_LineItem_OP: cuid {
    key InvoiceReconciliation                             : Association to InvoiceReconciliation_OP;

        NumberInCollection                  : Integer;
        ERPLineItemNumber                   : String(5);
        BillingAddress                      : types.address;
        TaxAmount                           : types.money;
        VATAmount                           : types.money;
        DiscountAmount                      : types.money;
        ChargeAmount                        : types.money;
        Quantity                            : Double;
        DueOn                               : DateTime;
        ShipTo                              : types.address;
        DeliverTo                           : String(100);
        CommodityCode                       : types.commodityCode;
        PaymentTerms                        : types.paymentTerms;
        IsAdHoc                             : Boolean;
        LineType                            : types.operationalLineType;
        BasePrice                           : types.money;
        OriginalPrice                       : types.money;
        StartDate                           : DateTime;
        EndDate                             : DateTime;
        ShipFrom                            : types.address;
        ServicePeriod                       : types.servicePeriod;
        WithholdingTaxAmount                : types.money;
        TaxCode                             : types.operationalTaxCode;       
        Category                            : Integer;
        OrderLineItem                       : types.operationalOrderLineItem;
        MALineItem                          : types.operationalOrderLineItem;
        ReferenceDate                       : DateTime;
        InspectionDate                      : DateTime;
        Amount                              : types.money;
        ExpectedTax                         : types.expectedTax;
        ChargeDetail                        : types.chargeDetail;
        Description                         : types.invoiceDescription;
        
        Order                               : types.genericRoot;
        MasterAgreement                     : types.masterAgreement;
        OrderInfo                           : types.alwaysnull; // always null
        AccrualTaxAmount                    : types.money;
        AmountBilled                        : types.money;        
        AmountCleared                       : types.money;
        AmountInvoiced                      : types.money;

        IncoTermsCode                       : types.alwaysnull; // always null
        IncoTermsDetail                     : String(255);
        NumberBilled                        : Double;
        NumberCleared                       : Double;   
        OriginatingSystemLineNumber         : Integer;
        ServiceLocation                     : types.address;
        Statement                           : types.statement;
        StatementLineItem                   : types.statementLineItem;
        SupplementInfo                      : types.supplementInfo ;
        SupplierAccrualTaxAmount            : types.money;       
        WHTTaxCode                          : types.taxCode;
        Accountings                         : types.accountingType; 

        SplitAccountings                    : Composition of many InvoiceReconciliation_LineItem_SplitAccountings_OP on SplitAccountings.LineItem = $self;
        Exceptions                          : Composition of many InvoiceReconciliation_LineItem_Exceptions_OP on Exceptions.LineItem = $self;

}
entity InvoiceReconciliation_LineItem_Exceptions_OP: cuid {
    key LineItem                    : Association to InvoiceReconciliation_LineItem_OP;
        ReconciledBy                      : types.operationalUser;
        State                             : Integer;    
        Type                              : types.exceptionTypeOp;
}
entity InvoiceReconciliation_LineItem_SplitAccountings_OP: cuid {
    key LineItem                    : Association to InvoiceReconciliation_LineItem_OP;
        PONumber                    : String(50);
        ERPSplitValue               : String(100);
        Percentage                  : Double;
        Amount                      : types.money;
        Quantity                    : Double;
        NumberInCollection          : Integer;
        Type                        : types.operationalSplitAccountingsType;
        POLineNumber                : String(50);
        CostCenter                  : types.operationalCostCenter;
        CompanyCode                 : types.operationalCompanyCode;
        GeneralLedger               : types.generalLedger;
        Asset                       : types.operationalAsset;
        InternalOrder               : types.operationalInternalOrder;
        WBSElement                  : types.wbsElement;
        ProcurementUnit             : types.genericRoot;
}
