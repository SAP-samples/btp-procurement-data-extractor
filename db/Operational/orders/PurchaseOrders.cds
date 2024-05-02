namespace sap.ariba;
using { managed, cuid } from '@sap/cds/common';

using sap.ariba.type as types from '../../types';


/**
    Name:	                Purchase Orders (Direct Orders & ERP Orders)
    Description:	        Purchase Orders
    Database Table Name:	Operational Reporting API
*/

entity PurchaseOrder_OP: managed, types.customFields {
    key Realm                               : String(50);
    key UniqueName                          : String(50);

        TotalCost                           : types.money;
        Active                              : Boolean;
        OrderMethodCategory                 : String(50);
        ExpirationDate                      : DateTime;
        StatusString                        : String(50);
        SupplierLocation                    : types.address;
        OrderID                             : String(50);
        NumberReceivableLineItems           : Integer;
        PreOrdered                          : Boolean;
        MasterAgreement                     : types.masterAgreement;
        OrderConfirmationStatusString       : String(50);
        OrderStatusPunchOutDisabled         : Boolean;
        IsBlanketOrder                      : Boolean;
        OriginatingSystemReferenceID        : String(50);
        ManuallyOrdered                     : Boolean;
        Closed                              : Integer;
        Conditions                          : types.conditions;
        UsePOLineNumberForIntegration       : Boolean;
        IsFromExternalReq                   : Boolean;
        ChargeAmount                        : types.money;
        PaymentTerms                        : types.paymentTerms;
        Requisition                         : types.genericRoot;
        Supplier                            : types.supplierUniqueName;
        OrderedState                        : Integer;
        OrderedDate                         : DateTime;
        OrderConfirmationState              : Integer;
        AdvancedShipNoticeState             : Integer;
        ReceivedState                       : Integer;
        ReceivedDate                        : DateTime;
        InvoicedState                       : Integer;
        InvoicedDate                        : DateTime;
        AmountAccepted                      : types.money;
        AmountBilled                        : types.money;
        NumberBilled                        : Double;
        AmountCleared                       : types.money;
        NumberCleared                       : Double;
        AmountRejected                      : types.money;
        AmountInvoiced                      : types.money;
        AmountReconciled                    : types.money;
        NumberReceivableOrders              : Integer;
        IsServiceOrder                      : Boolean;
        RejectionReason                     : String(250);
        Name                                : String(255);
        ApprovedState                       : Integer;
        Type                                : String(100);
        HoldTillDate                        : DateTime;
        ApprovalRequestsVersion             : Integer;
        Preparer                            : types.operationalUser;
        Requester                           : types.operationalUser;
        LastModified                        : DateTime;
        CreateDate                          : DateTime;
        SubmitDate                          : DateTime;
        ApprovedDate                        : DateTime;
        ResubmitDate                        : DateTime;
        PreviousVersion                     : types.genericRoot;
        NextVersion                         : types.genericRoot;
        VersionNumber                       : Integer;
        InitialUniqueName                   : String(255);
        ChangedBy                           : types.operationalUser;
        PreviousApprovalRequestsVersion     : Integer;
        CompanyCode                         : types.genericRoot;
        ReportingCurrency                   : types.currency;
        OriginatingSystem                   : String(50);

        LineItems                           : Composition of many PurchaseOrder_LineItem_OP on LineItems.PurchaseOrder = $self;

}


entity PurchaseOrder_LineItem_OP: cuid {
    key PurchaseOrder                       : Association to PurchaseOrder_OP;

        Requisition                         : types.genericRoot;
        Amount                              : types.money;
        NumberOnReq                         : Integer;
        LineConfirmationStatus              : String(50);
        OrderedDate                         : DateTime;
        OrderMethodCategory                 : String(50);
        OrderID                             : String(255);
        MasterAgreement                     : types.masterAgreement;
        NeedBy                              : DateTime;
        DueOn                               : DateTime;
        ServiceAmountApproved               : types.money;
        ServiceAmountUnderApproval          : types.money;
        Closed                              : Integer;
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
        ShipTo                              : types.address;
        DeliverTo                           : String(100);
        CommodityCode                       : types.commodityCode;
        Supplier                            : types.supplierUniqueName;
        ERSAllowed                          : Boolean;
        SupplierLocation                    : types.address;
        PaymentTerms                        : types.paymentTerms;
        IsAdHoc                             : Boolean;
        LineType                            : types.genericRoot;
        BasePrice                           : types.money;
        OriginalPrice                       : types.money;
        IsPriceModifiedByUser               : Boolean;
        StartDate                           : DateTime;
        EndDate                             : DateTime;
        IsRecurring                         : Boolean;
        BoughtFromPreferredSupplier         : Boolean;
        TaxCode                             : types.operationalTaxCode;
        Numberincollection                  : Integer;

        ItemMasterID                        : types.alwaysnull; // always null
        TaxDetail                           : types.taxDetail;
        ServiceDetails                      : types.serviceDetails;
        Description                         : types.poDescription;

        SplitAccountings                    : Composition of many PurchaseOrder_LineItem_SplitAccountings_OP on SplitAccountings.LineItem = $self;

}

entity PurchaseOrder_LineItem_SplitAccountings_OP: cuid {
    key LineItem                    : Association to PurchaseOrder_LineItem_OP;

        Numberincollection          : Integer;
        CostCenter                  : types.operationalCostCenter;
        CompanyCode                 : types.operationalCompanyCode;
        GeneralLedger               : types.generalLedger;
        Asset                       : types.operationalAsset;
        InternalOrder               : types.operationalInternalOrder;
        WBSElement                  : types.wbsElement;
}
