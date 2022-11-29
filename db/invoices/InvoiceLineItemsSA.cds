namespace sap.ariba;
using { managed } from '@sap/cds/common';

using sap.ariba.type as types from '../types';

/**
    Name:  Invoice (Procurement & Invoicing)
    Class Name:       ariba.analytics.fact.SSPInvoiceLineItem
    Description:       Invoice
    Database Table Name:   FACT_SSP_INVOICE_LINE_ITEM
*/
entity InvoiceLineItemsSA: managed  {

    key InvoiceId               : String(50);
        InvoiceNumber           : String(50);
        LoadCreateTime          : Timestamp;
        LoadUpdateTime          : Timestamp;
        InvoiceLineNumber       : String(50);
        ExtraInvoiceLineKey     : String(10);
        ExtraInvoiceKey         : String(50);
        SplitAccountingNumber   : Double;
        Description             : String(1000);
        POId                    : String(50);
        OrderID                 : String(50);
        POLineNumber            : String(50);
        ExtraPOKey              : String(50);
        ExtraPOLineKey          : String(10);
        PODescription           : String(1000);
        Amount                  : Double;
        LineItemCount           : Double;
        InvoiceCount            : Double;
        Quantity                : Double;
        OriginalQuantity        : Double;
        AccountingDate          : types.day;
        UNSPSC                  : types.unspsc;
        OldUNSPSC               : types.unspsc;
        Supplier                : types.supplier;
        Part                    : types.part;
        UnitOfMeasure           : types.uom;
        OriginalUnitOfMeasure   : String(50);
        ERPCommodity            : types.erpCommodity;
        CostCenter              : types.costCenter;
        Requester               : types.requester;
        Account                 : types.account;
        InvoiceDate             : types.day;
        PaidDate                : types.day;
        InvoiceType             : String(25);
        LineType                : String(25);
        Contract                : types.contract;
        ContractId              : String(50);
        ContractLineNumber      : String(50);
        MatchedContract         : types.contract;
        SourceSystem            : types.sourceSystem;
        DEConfidence            : String(10);
        DEStatus                : String(10);
        DEMethod                : String(80);
        DEScore                 : Double;
        PreviewUnspsc           : types.unspsc;
        FeedbackRequest         : types.feedbackRequest;
        PaymentTerms            : String(100);
        CompanySite             : types.companySite;
        POAmount                : Double;
        SupplierOptCost         : Double;
        PriceVarCost            : Double;
        PriceAlignCost          : Double;
        StdCostVar              : Double;
        OrigCurrencyCode        : String(10);
        OrigAmount              : Double;
        AmountRange             : types.amountRange;
        ReconciliationStatus    : String(25);
        DEExplanation           : String(100);
        key Realm                   : String(25);

}