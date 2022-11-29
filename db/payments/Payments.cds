namespace sap.ariba;
using { managed } from '@sap/cds/common';

using sap.ariba.type as types from '../types';


/**
    Name:  Invoice Payment
    Class Name:       ariba.analytics.fact.Payment
    Description:       Invoice Payment
    Database Table Name:   FACT_PAYMENT
*/

entity Payment: managed,types.customFields   {
        LoadCreateTime: DateTime;
        LoadUpdateTime: DateTime;
    key PaymentId: String(50);
        Payable: String(255);
        PayableUniqueName: String(255);
        ToPayAmount: Double;
        MaxAvailableDiscount: Double;
        OrigCurrencyCode: String(10);
        OrigMaxAvailableDiscount: Double;
        PaidAmount: Double;
        OrigPaidAmount: Double;
        DiscountEarned: Double;
        OrigDiscountEarned: Double;
        DiscountTerms: String(25);
        NetTerms: String(25);
        Discount: String(25);
        Status: String(25);
        DebitCredit: String(25);
        CreatedDate: types.day;
        ApprovedDate: types.day;
        PaymentDate: types.day;
        NetDueDate: types.day;
        DiscountTermsDate: types.day;
        Supplier: types.supplier;
        PayableStatus: String(25);
        PayableType: String(50);
        DynamicDiscountTaken: Boolean;
        ForTaxAccrual: Boolean;
        InvoiceAmount: Double;
        OrigInvoiceAmount: Double;
        Requester: types.requester;
        InvoiceNumber: String(50);
        ERPInvoiceNumber: String(50);
        EligibleForDynamicDiscount: Boolean;
        DiscountPercent: Double;
        AdjustmentAmount: Double;
        OrigAdjustmentAmount: Double;
        PaymentSchedulingApplication: String(100);
        PaymentAggregationApplication: String(100);
        PaymentTermsDescription: String(100);
        SourceSystem: types.sourceSystem;
        ProcurementUnit: types.procurementUnit;
        PaymentMethodType: String(255);
        PaymentStatusString: String(25);
        PaidOnTime: String(10);
        RemittanceLocation: types.remittanceLocation;
        IsPaid: Double;
        GrossAmount: Double;
        OrigGrossAmount: Double;
        POEarliestDateOfDelivery: types.day;
         key Realm: String(25);
}