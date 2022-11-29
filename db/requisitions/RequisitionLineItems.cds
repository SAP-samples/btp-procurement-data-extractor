namespace sap.ariba;
using { managed } from '@sap/cds/common';

using sap.ariba.type as types from '../types';


/**
    Name:	                Requisition (Procurement & Invoicing)
    Class Name:	            ariba.analytics.fact.RequisitionLineItem
    Description:	        Requisition
    Database Table Name:	FACT_REQUISITION_LINE_ITEM
*/

entity RequisitionLineItem: managed,types.customFields  {
    key Realm                               : String(50);
    key RequisitionId                       : String(75);
    key RequisitionLineNumber               : String(50);
    key SplitAccountingNumber               : Integer;

        LoadCreateTime                      : DateTime;
        LoadUpdateTime                      : DateTime;
        ParentLineNumber                    : String(50);
        Description                         : String(1000);
        RetroEffectiveDate                  : types.day;
        StatusString                        : String(50);
        CustomSubStatusMessage              : String(250);
        TitleString                         : String(128);
        POId                                : String(50);
        OrderID                             : String(50);
        POLineNumber                        : String(50);
        ServiceStartDate                    : types.day;
        ServiceEndDate                      : types.day;
        RequiresServiceEntry                : Boolean;
        isPunchOutItem                      : String(10);
        IsRetroactive                       : Boolean;
        ApprovedDate                        : String(50);
        ReqApprovedDate                     : types.day;
        IsExternalAppDocumentCopy           : String(25);
        isBoughtFromPreferredSupplier       : Boolean;
        isPartialItem                       : Boolean;
        isShared                            : Boolean;
        SubmittedBy                         : String(50);
        isTeamReceived                      : Boolean;
        PriceVarCost                        : Double;
        Amount                              : Double;
        OrigCurrencyCode                    : String(10);
        OrigAmount                          : Double;
        MaxAmount                           : Double;
        ExpectedAmount                      : Double;
        LineItemCount                       : Double;
        RequisitionCount                    : Double;
        Quantity                            : Double;
        TaxAmount                           : Double;
        ChargeAmount                        : Double;
        RequisitionDate                     : types.day;
        UNSPSC                              : types.unspsc;
        Commodity                           : types.commodity;
        Supplier                            : types.supplier;
        PaymentTerms                        : String(255);
        TaxCodeName                         : String(255);
        TaxCodeId                           : String(255);
        TaxCodeDescription                  : String(255);
        Part                                : types.part;
        NonCatalogSupplierPartNumber        : String(255);
        NonCatalogSupplierPartAuxiliaryId   : String(255);
        UnitOfMeasure                       : types.uom;
        PriceBasisQuantity                  : Double;
        PriceBasisQuantityUOM               : types.uom;
        ConversionFactor                    : Double;
        PriceBasisQuantityDesc              : String(100);
        OrigSystem                          : String(50);
        OrigSystemRefID                     : String(50);
        ERPCommodity                        : types.erpCommodity;
        CompanyCode                         : types.companyCode;
        CostCenter                          : types.costCenter;
        AccountingCompany                   : types.group;
        PurchasingCompany                   : types.group;
        SubAccount                          : types.subAccount;
        AccountingRegion                    : types.region;
        AccountingProject                   : types.project;
        Product                             : types.product;
        Asset                               : types.asset;
        InternalOrder                       : types.internalOrder;
        Network                             : types.network;
        ActivityNumber                      : types.activityNumber;
        StatisticsCode                      : types.statisticsCode;
        ProcurementUnit                     : types.procurementUnit;
        ShipToLocation                      : types.location;
        Requester                           : types.requester;
        Preparer                            : types.requester;
        Account                             : types.account;
        HoldTillDate                        : types.day;
        DeliverTo                           : String(100);
        AggregationStatus                   : String(50);
        IsHeld                              : String(5);
        ERPRequisitionID                    : String(50);
        NeedByDate                          : types.day;
        AccountType                         : String(50);
        SourcingStatus                      : Integer;
        SourcingStatusMessage               : String(50);
        SubType                             : String(50);
        BillToLocation                      : types.location;
        PurchasingGroup                     : types.group;
        AccountAssignment                   : String(50);
        ItemCategory                        : String(50);
        LineType                            : String(25);
        Contract                            : types.contract;
        SourceSystem                        : types.sourceSystem;
        BudgetCode                          : String(256);
        BudgetPeriod                        : String(30);
        BudgetFiscalYear                    : String(12);
        ProjectID                           : String(50);
        ProjectTitle                        : String(255);
        MarketPlaceItemSupplierId           : String(255);
        SubContractor                       : String(25);
        ReleasedAmount                      : Double;
        ConsumedAmount                      : Double;
        DiscountAmount                      : Double;
        ApprovalTime                        : Double;
        ClassificationCodeAux               : String(255);
}
