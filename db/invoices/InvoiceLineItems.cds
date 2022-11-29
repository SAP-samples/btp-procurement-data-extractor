        
namespace sap.ariba;
using { managed } from '@sap/cds/common';

using sap.ariba.type as types from '../types';

/**
    Name:  Invoice Line Items
    Class Name:       ariba.analytics.fact.SSPInvoiceLineItem
    Description:       Invoice Line Items
    Database Table Name:   FACT_INVOICE_LINE_ITEMS
*/
entity InvoiceLineItems: managed,types.customFields   {

    key InvoiceId: String(75);
    key InvoiceLineNumber: String(50);
    key ParentInvoiceLineNumber: Double;

        LoadCreateTime: DateTime;
        LoadUpdateTime: DateTime;
        ChargeParentLineNumber: Double;
        SplitAccountingNumber: Double;
        Description: String(1000);
        IsOneTimeVendorInvoice: Boolean;
        InvoiceNumber: String(50);
        POId: String(50);
        OrderID: String(50);
        POLineNumber: String(50);
        PODescription: String(1000);
        InvoiceStatus: String(50);
        ReconciliationStatus: String(50);
        ReconciledDate: types.day;
        ServicePeriodTo: types.day;
        ServicePeriodFrom: types.day;
        InvoiceSubmitDate: types.day;
        InvoiceDateCreated: types.day;
        InvoiceOrigin: String(50);
        InvoiceSourceDocument: String(50);
        InvoiceSubmissionMethod: String(50);
        InvoicePurpose: String(32);
        InvoiceLoadedFrom: String(20);
        AmountInvoiced: Double;
        AmountAccepted: Double;
        AmountDisputed: Double;
        Amount: Double;
        PaidAmount: Double;
        LineItemCount: Double;
        InvoiceCount: Double;
        Quantity: Double;
        EstimatedSavings: Double;
        DiscountAmount: Double;
        ChargeAmount: Double;
        TaxAmount: Double;
        AccountingDate: types.day;
        Commodity: types.commodity;
        Supplier: types.supplier;
        Part:types.part;
        NonCatalogSupplierPartNumber: String(255);
        NonCatalogSupplierPartAuxiliaryId: String(255);
        UnitOfMeasure: types.unitOfMeasure;
        PriceBasisQuantity: Double;
        PriceBasisQuantityUOM: types.priceBasisQuantityUOM;
        ConversionFactor:Double;
        PriceBasisQuantityDesc: String(100);
        ReceiptBasedLine: Boolean;
        ShippmentNoticeReference:String(50);
        ERPCommodity:types.erpCommodity;
        CostCenter:types.costCenter;
        AccountingCompany: types.accountingCompany;
        LineCompany:types.accountingCompany;
        PurchasingCompany: types.accountingCompany;
        ProcurementUnit: types.procurementUnit;
        ShipToLocation:types.shipToLocation;
        ShipFromLocation:types.shipToLocation;
        TaxRate:Double;
        TaxCode:types.taxCode;
        AccrualTaxAmount:Double;
        ExpectedTaxAmount:Double;
        Requester:types.requester;
        Preparer:types.requester;
        Account:types.account;
        SubAccount:types.subAccount;
        AccountingRegion:types.accountingRegion;
        AccountingProject:types.accountingProject;
        Product:types.product;
        Asset:types.asset;
        InternalOrder:types.internalOrder;
        StatisticsCode:types.statisticsCode;
        InvoiceDate: types.day;
        PaidDate: types.day;
        NetDueDate: types.day;
        CompanyCode:types.companyCode;
        ApprovedDate: types.day;
        PoToInvoiceIntervalInt:Double;
        PoToInvoiceInterval:types.poToInvoiceInterval;
        InvoiceType:String(20);
        InvoiceOriginType:String(25);
        PriceAdjustmentInvoice:Boolean;
        LineType:String(25);
        Contract:types.contract;
        ContractLineNumber:String(50);
        MatchedContract:types.contract;
        ReferenceDate:types.day;
        AccountType:String(50);
        AccountAssignment:String(50);
        ItemCategory:String(50);
        BillToLocation:types.billToLocation;
        SourceSystem:types.sourceSystem;
        Network:types.network;
        ActivityNumber:types.activityNumber;
        ProcurementSystem:types.procurementSystem;
        PaymentTerms:String(100);
        CompanySite:types.companySite;
        ProjectID:String(50);
        ProjectTitle:String(255);
        IsExternalAppDocumentCopy:String(25);
        POAmount:Double;
        SupplierOptCost:Double;
        PriceVarCost:Double;
        IsPaid:Double;
        OrigCurrencyCode:String(10);
        OrigAmount:Double;
        OrigAmountInvoiced:Double;
        OrigAmountDisputed:Double;
        OrigAmountAccepted:Double;
        OrigPaidAmount:Double;
        OrigExpectedTaxAmount:Double;
        OrigAccrualTaxAmount:Double;
        AmountRange:types.amountRange;
    key Realm                   : String(25);
}