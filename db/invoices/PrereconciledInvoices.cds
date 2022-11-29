namespace sap.ariba;
using { managed } from '@sap/cds/common';

using sap.ariba.type as types from '../types';

/**
    Name:	                Prereconciled Invoice (Procurement & Invoicing)
    Class Name:	            ariba.analytics.fact.SSPPrereconciledInvoiceLineItem
    Description:	        Prereconciled Invoice
    Database Table Name:	FACT_SSP_PRERECONCILED_ILI
*/
entity PrereconciledInvoices: managed,types.customFields   {

    key Realm                           : String(50);
    key InvoiceId                       : String(75);
    key InvoiceLineNumber               : String(50);

    LoadCreateTime                      : DateTime;
    LoadUpdateTime                      : DateTime;
    InvoiceNumber                       : String(50);
    ParentInvoiceLineNumber             : Integer;
    ChargeParentLineNumber              : Integer;
    SplitAccountingNumber               : Integer;
    IsOneTimeVendorInvoice              : Boolean;
    InvoiceDate                         : types.day;
    ServicePeriodTo                     : types.day;
    ServicePeriodFrom                   : types.day;
    InvoiceSubmitDate                   : types.day;
    InvoiceDateCreated                  : types.day;
    Description                         : String(1000);
    InvoiceType                         : String(25);
    InvoiceOriginType                   : String(25);
    PoToInvoiceIntervalInt              : Double;
    InvoiceStatus                       : String(50);
    InvoiceExternalStatusString         : String(50);
    POId                                : String(50);
    OrderID                             : String(50);
    POLineNumber                        : String(50);
    PODescription                       : String(1000);
    PriceAdjustmentInvoice              : Boolean;
    Part                                : types.part;
    NonCatalogSupplierPartNumber        : String(255);
    ContractLineNumber                  : String(50);
    Contract                            : types.contract;
    LineType                            : String(25);
    ProcurementSystem                   : types.procurementSystem;
    InvoiceOrigin                       : String(50);
    InvoiceSourceDocument               : String(50);
    InvoiceSubmissionMethod             : String(50);
    InvoicePurpose                      : String(32);
    InvoiceLoadedFrom                   : String(20);
    ProjectID                           : String(50);
    ProjectTitle                        : String(255);
    IsExternalAppDocumentCopy           : String(25);
    NonCatalogSupplierPartAuxiliaryId   : String(255);
    SourceSystem                        : types.sourceSystem;
    UnitOfMeasure                       : types.uom;
    Commodity                           : types.commodity;
    Supplier                            : types.supplier;
    Requester                           : types.requester;
    Preparer                            : types.user;
    ShipToLocation                      : types.location;
    ShipFromLocation                    : types.location;
    BillToLocation                      : types.location;
    ERPCommodity                        : types.erpCommodity;
    ProcurementUnit                     : types.procurementUnit;
    CostCenter                          : types.costCenter;
    Account                             : types.account;
    AccountingCompany                   : types.accountingCompany;
    LineCompany                         : types.accountingCompany;
    PurchasingCompany                   : types.accountingCompany;
    SubAccount                          : types.subAccount;
    Asset                               : types.asset;
    InternalOrder                       : types.internalOrder;
    Product                             : types.product;
    AccountingProject                   : types.accountingProject;
    AccountingRegion                    : types.accountingRegion;
    ReferenceDate                       : types.day;
    AccountType                         : String(50);
    AccountAssignment                   : String(50);
    ItemCategory                        : String(50);
    Network                             : types.networkLong;
    ActivityNumber                      : types.activityNumberLong;
    PriceBasisQuantity                  : Double;
    PriceBasisQuantityUOM               : types.uom;
    ConversionFactor                    : Double;
    PriceBasisQuantityDesc              : String(100);
    StatisticsCode                      : types.statisticsCode;
    CompanyCode                         : types.companyCode;
    Quantity                            : Double;
    POAmount                            : Double;
    EstimatedSavings                    : Double;
    InvoiceCount                        : Double;
    LineItemCount                       : Double;
    DiscountAmount                      : Double;
    ChargeAmount                        : Double;
    TaxAmount                           : Double;
    Amount                              : Double;
    OrigCurrencyCode                    : String(10);
    AmountRange                         : types.range;
    OrigAmount                          : Double;

}