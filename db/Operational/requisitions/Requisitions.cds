namespace sap.ariba;
using { managed, cuid } from '@sap/cds/common';

using sap.ariba.type as types from '../../types';


/**
    Name:	                Requisition (Procurement & Invoicing)
    Description:	        Requisition
    Database Table Name:	Operational Reporting API
*/

entity Requisition_OP: managed, types.customFields {
    key Realm                               : String(50);
    key UniqueName                          : String(50);

        TotalCost                           : types.money;
        Active                              : Boolean;
        TimeCreated                         : DateTime;
        TimeUpdated                         : DateTime;
        Name                                : String(128);
        ApprovedState                       : Integer;
        Type                                : String(100);
        HoldTillDate                        : DateTime;
        ApprovalRequestsVersion             : Integer;
        Preparer                            : types.operationalUser;
        Requester                           : types.operationalUser;
        StatusString                        : String(50);
        LastModified                        : DateTime;
        CreateDate                          : DateTime;
        SubmitDate                          : DateTime;
        ApprovedDate                        : DateTime;
        ResubmitDate                        : DateTime;
        VersionNumber                       : Integer;
        InitialUniqueName                   : String(255);
        ChangedBy                           : types.operationalUser;
        PreviousApprovalRequestsVersion     : Integer;
        ProcurementUnit                     : types.procurementUnit;
        ChargeAmount                        : types.money;
        SourcingStatusString                : String(255);
        TaxAmount                           : types.money;
        VATAmount                           : types.money;
        PaymentTerms                        : types.paymentTerms;
        ProjectTitle                        : String(255);
        OriginatingSystem                   : String(50);
        OriginatingSystemReferenceID        : String(50);
        DiscountAmount                      : types.money;
        BudgetRefID                         : String(50);
        Supplier                            : types.supplier;
        OrderedState                        : Integer;
        OrderedDate                         : DateTime;
        ReceivedState                       : Integer;
        ReceivedDate                        : DateTime;
        InvoicedDate                        : DateTime;
        AmountAccepted                      : types.money;
        AmountBilled                        : types.money;
        AmountCleared                       : types.money;
        NumberBilled                        : Double;
        NumberCleared                       : Double;
        AmountRejected                      : types.money;
        AmountInvoiced                      : types.money;
        AmountReconciled                    : types.money;
        NumberReceivableOrders              : Integer;
        IsServiceOrder                      : Boolean;
        IsForecast                          : Boolean;
        AreOrdersStuck                      : Boolean;
        BlanketOrderID                      : String(50);
        BudgetCheckStatus                   : Integer;
        LastCheckDate                       : DateTime;
        BudgetCheckStatusMessage            : String(1024);
        PreCollaborationTotalCost           : types.money;
        IsExternalReq                       : Boolean;
        ExternalReqId                       : String(50);
        ExternalReqUrl                      : String(300);
        SourcingStatus                      : Integer;
        SourcingStatusMessage               : String(50);
        ERPRequisitionID                    : String(50);
        IsServiceRequisition                : Boolean;
        ReportingCurrency                   : types.currency;
        ExternalSourcingId                  : String(100);
        SentDate                            : DateTime;
        ProjectID                           : String(225);
        CompanyCode                         : types.genericRoot;
        CustomCatalogPurchaseOrg            : types.genericRoot;
        PreviousVersion                     : types.genericRoot;
        NextVersion                         : types.genericRoot;

        ApprovalRecords                     : Composition of many Requisition_ApprovalRecords_OP on ApprovalRecords.Requisition = $self;
        ApprovalRequests                    : Composition of many Requisition_ApprovalRequests_OP on ApprovalRequests.Requisition = $self;
        LineItems                           : Composition of many Requisition_LineItem_OP on LineItems.Requisition = $self;

}

entity Requisition_ApprovalRecords_OP: cuid {
    key Requisition                         : Association to Requisition_OP;

    ActivationDate                      : DateTime;
    User                                : types.operationalUser;
    RealUser                            : String(100);
    Date                                : DateTime;
    Comment                             : types.comment;
    ReceivedFromEmail                   : String(128);
    State                               : Integer;
}

entity Requisition_ApprovalRequests_OP: cuid {
    key Requisition                     : Association to Requisition_OP;

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
    ExtendEscalationUserComments        : String(500);
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

    Approvers                            : Composition of many Requisition_ApprovalRequests_Approver_OP on Approvers.RequisitionApprovalRequests = $self;
  
}
entity Requisition_ApprovalRequests_Approver_OP: cuid{
    key RequisitionApprovalRequests         : Association to Requisition_ApprovalRequests_OP;
    UniqueName                          : String(255) default '';
    PasswordAdapter                     : String(50) default '';
    
}

entity Requisition_LineItem_OP: cuid {
    key Requisition                         : Association to Requisition_OP;

    ItemCategory                        : types.itemCategory;
    ExpectedValue                       : types.money;
    OverallLimit                        : types.money;
    PurchaseOrg                         : types.purchaseOrg;
    PurchaseGroup                       : types.purchaseGroup;
    PODeliveryDate                      : DateTime;
    POQuantity                          : String(50);
    POUnitPrice                         : String(50);
    AccountCategory                     : types.accountCategory;
    SAPPOLineNumber                     : String(5);
    NumberInCollection                  : Integer;
    POUnitOfMeasure                     : types.coreUnitOfMeasure;
    Amount                              : types.money;
    ERPLineItemNumber                   : String(5);
    BillingAddress                      : types.address;
    TaxAmount                           : types.money;
    VATAmount                           : types.money;
    DiscountAmount                      : types.money;
    ChargeAmount                        : types.money;
    Carrier                             : String(32);
    CarrierMethod                       : String(32);
    Quantity                            : Double;
    NumberConfirmedAccepted             : Double;
    NumberConfirmedAcceptedWithChanges  : Double;
    NumberConfirmedRejected             : Double;
    NumberConfirmedBackOrdered          : Double;
    NumberConfirmedSubstituted          : Double;
    NumberShipped                       : Double;
    QuantityInKitItem                   : Double;
    NeedBy                              : DateTime;
    DueOn                               : DateTime;
    ShipTo                              : types.address;
    DeliverTo                           : String(100);
    CommodityCode                       : types.commodityCode;
    Supplier                            : types.supplierUniqueName;
    ERSAllowed                          : Boolean;
    SupplierLocation                    : types.address;
    PaymentTerms                        : types.paymentTerms;
    IsAdHoc                             : Boolean;
    CommodityExportMapEntry             : types.commodityMap;
    BasePrice                           : types.money;
    OriginalPrice                       : types.money;
    IsPriceModifiedByUser               : Boolean;
    StartDate                           : DateTime;
    EndDate                             : DateTime;
    IsRecurring                         : Boolean;
    KitRequiredItem                     : Boolean;
    OriginatingSystemLineNumber         : Integer;
    ParentLineNumber                    : Integer;
    BoughtFromPreferredSupplier         : Boolean;
    NumberOnPO                          : Integer;
    OrderID                             : String(50);
    PushStatus                          : Integer;
    UsedInReqPush                       : Boolean;
    ERPPONumber                         : String(50);
    OriginatingSystem                   : String(50);
    ExternalLineNumber                  : Integer;
    QuickSourced                        : Boolean;
    QuotePricingTermsNumber             : Integer;
    KitInstanceId                       : String(255);
    POStatus                            : String(255);
    BuyerName                           : String(255);
    GBFormDocumentId                    : String(200);
    ChargeDetail                        : types.chargeDetail;

    OrderInfo                           : types.orderinfo; // always null
    LineType                            : types.operationalLineType;
    SourcingRequest                     : types.alwaysnull; // always null
    Form                                : types.alwaysnull; // always null
    ItemMasterID                        : types.alwaysnull; // always null
    TaxCode                             : types.operationalTaxCode; 
    MasterAgreement                     : types.masterAgreement;
    BuyerItemMaster                     : types.buyerItemMaster;
    AccountingTemplate                  : types.genericRoot;
    ParentKit                           : types.parentKit;
    Kit                                 : types.alwaysnull; // always null

    Description                         : types.description;
    ServiceDetails                      : types.serviceDetails;
    TaxDetail                           : types.taxDetail;
    Accountings                         : types.accountingType;


    SplitAccountings                    : Composition of many Requisition_LineItem_SplitAccountings_OP on SplitAccountings.LineItem = $self;
}


entity Requisition_LineItem_SplitAccountings_OP: cuid {
    key LineItem                    : Association to Requisition_LineItem_OP;
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

        ProcurementUnit             : types.procurementUnit;
}
