namespace sap.ariba;
using { managed, cuid } from '@sap/cds/common';

using sap.ariba.type as types from '../types';


/**
    Name:	                Invoice (Procurement & Invoicing)
    Description:	        Invoice
    Database Table Name:	Operational Reporting API
*/

entity Invoice: managed, types.customFields {
    key Realm                               : String(50);
    key UniqueName                          : String(50);

        InvoiceNumber                       : String(50);
        InvoiceStatusString                 : String(50);
        InvoicePurpose                      : String(100);
        TaxExchangeRate                     : Double;
        UpperCaseInvoiceNumber              : String(50);
        AccountReceivableID                 : String(50);
        InvoiceOrigin                       : String(100);
        InvoiceSourceDocument               : String(100);
        InvoiceSubmissionMethod             : String(100);
        ScheduledPaymentDate                : DateTime;
        MaxDiscountApplicable               : types.money;
        InvoiceOriginType                   : Integer;
        TotalCost                           : types.money;
        TaxAmount                           : types.money;
        VATAmount                           : types.money;
        VersionNumber                       : Integer;
        ServicePeriod                       : types.servicePeriod;
        TimeCreated                         : DateTime;
        TimeUpdated                         : DateTime;
        Active                              : Boolean;
        SupplierName                        : String(255);
        TotalInvoiced                       : types.money;
        TotalTax                            : types.money;
        TotalInvoicedLessTax                : types.money;
        InvoiceState                        : Integer;
        ReconciledDate                      : DateTime;
        IsTaxInLine                         : Boolean;
        Signed                              : Boolean;
        RemitToAddress                      : types.address;
        SoldTo                              : types.soldTo;
        Category                            : Integer;
        HeaderLevel                         : Boolean;
        Order                               : types.genericRoot;
        MasterAgreement                     : types.masterAgreement;
        IsNonPO                             : Boolean;
        Supplier                            : types.supplierUniqueName;
        SupplierLocation                    : types.supplierLocation;
        RemitToID                           : String(100);
        InvoiceDate                         : DateTime;
        TotalWithholdingTax                 : types.money;
        PaymentTerms                        : types.paymentTerms;
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
        CompanyCode                         : types.operationalCompanyCode;
        PurchaseOrg                         : types.purchaseOrg;
        InvoiceExternalStatusString         : String(100);
        ProjectID                           : String(100);
        ProjectTitle                        : String(100);
        HoldTillDate                        : DateTime;
        PreviousVersion                     : types.genericRoot;
        NextVersion                         : types.genericRoot;

        ServiceLocation                     : types.alwaysnull;
        InvoiceToCredit                     : types.alwaysnull;

        ApprovalRequests                    : Composition of many Invoice_ApprovalRequests on ApprovalRequests.Invoice = $self;
        ApprovalRecords                     : Composition of many Invoice_ApprovalRecords on ApprovalRecords.Invoice = $self;
        LineItems                           : Composition of many Invoice_LineItem on LineItems.Invoice = $self;

}

entity Invoice_ApprovalRecords: cuid {
    key Invoice             : Association to Invoice;

        ActivationDate      : DateTime;
        User                : types.operationalUser;
        RealUser            : String(100);
        Date                : DateTime;
        Comment             : types.comment;
        ReceivedFromEmail   : String(128);
        State               : Integer;
}

entity Invoice_ApprovalRequests: cuid {
    key Invoice                             : Association to Invoice;

        AllowEscalationPeriodExtension      : Boolean;
        ApprovalRequired                    : Boolean;
        ApprovedBy                          : types.operationalUser;
        Creator                             : types.operationalUser;
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
        AssignedTo                          : types.operationalUser;
        ActivationDate                      : DateTime;
        LastModified                        : DateTime;
        EscalationWarningDate               : DateTime;
        EscalationDate                      : DateTime;
        EscalationExtendedByUser            : types.operationalUser;
        EscalationExtensionDate             : DateTime;

        Approvers                           : Composition of many Invoice_ApprovalRequests_Approver on Approvers.InvoiceApprovalRequests = $self;
}

entity Invoice_ApprovalRequests_Approver: cuid{
    key InvoiceApprovalRequests     : Association to Invoice_ApprovalRequests;
        UniqueName                  : String(50);
        PasswordAdapter             : String(50);
}

entity Invoice_LineItem: cuid {
    key Invoice                             : Association to Invoice;

        NumberInCollection                  : Integer;
        SupplierOrderInfo                   : types.supplierOrderInfo;
        ERPLineItemNumber                   : String(5);
        BillingAddress                      : types.address;
        TaxAmount                           : types.money;
        VATAmount                           : types.money;
        DiscountAmount                      : types.money;
        ChargeAmount                        : types.money;
        Quantity                            : Double;
        Carrier                             : String(32);
        CarrierMethod                       : String(32);
        NumberConfirmedAccepted             : Double;
        NumberConfirmedAcceptedWithChanges  : Double;
        NumberConfirmedRejected             : Double;
        NumberConfirmedBackOrdered          : Double;
        NumberConfirmedSubstituted          : Double;
        NumberShipped                       : Double;
        DueOn                               : DateTime;
        ShipTo                              : types.address;
        DeliverTo                           : String(100);
        CommodityCode                       : types.commodityCode;
        Supplier                            : types.supplierUniqueName;
        SupplierLocation                    : types.supplierLocation;
        PaymentTerms                        : types.paymentTerms;
        IsAdHoc                             : Boolean;
        LineType                            : types.operationalLineType;
        BasePrice                           : types.money;
        OriginalPrice                       : types.money;
        IsPriceModifiedByUser               : Boolean;
        StartDate                           : DateTime;
        EndDate                             : DateTime;
        IsRecurring                         : Boolean;
        BoughtFromPreferredSupplier         : Boolean;
        ShipFrom                            : types.address;
        ServicePeriod                       : types.servicePeriod;
        InvoiceLineNumber                   : Integer;
        OrderLineNumber                     : Integer;
        WithholdingTaxAmount                : types.money;
        TaxCode                             : types.operationalTaxCode;
        GRBasedInvoice                      : Boolean;
        Category                            : Integer;
        Order                               : types.operationalOrder;
        OrderLineItem                       : types.operationalOrderLineItem;
        MasterAgreement                     : types.masterAgreement;
        MALineItem                          : types.operationalOrderLineItem;
        ReferenceDate                       : DateTime;
        InspectionDate                      : DateTime;
        Amount                              : types.money;
        ExpectedTax                         : types.expectedTax;
        ChargeDetail                        : types.chargeDetail;
        ServiceDetails                      : types.serviceDetails;
        TaxDetail                           : types.taxDetail;
        Description                         : types.invoiceDescription;

        OrderInfo                           : types.alwaysnull; // always null
        ItemMasterID                        : types.alwaysnull; // always null


        SplitAccountings                    : Composition of many Invoice_LineItem_SplitAccountings on SplitAccountings.LineItem = $self;

}

entity Invoice_LineItem_SplitAccountings: cuid {
    key LineItem                    : Association to Invoice_LineItem;
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
