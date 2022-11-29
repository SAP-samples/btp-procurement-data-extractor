namespace sap.ariba;
using { managed } from '@sap/cds/common';

using sap.ariba.type as types from '../types';

/**
    Name:  Advance Payment
    Class Name:       ariba.analytics.fact.AdvancePaymentIncludesLineLevel
    Description:        Advance Payment
    Database Table Name:   FACT_ADVANCE_PAYMENT_ILL
*/
entity AdvancePayments: managed,types.customFields  {
    key Realm : String(50);
    key PaymentId: String(50);
    key APMTLineNumber: String(50);
        LoadCreateTime: DateTime;
        LoadUpdateTime: DateTime;
        GLIndicatorUniqueName: String(50);
        GLIndicatorName: String(255);
        DocumentTypeUniqueName: String(50);
        DocumentTypeName: String(255);
        CompanyCodeDescription: String(255);
        CompanyCodeUniqueName: String(255);
        Supplier: types.supplier;
        Name: String(128);
        NetDueDate: types.day;
        CreatedTime: types.day;
        OrderID: String(50);
        Status: String(25);
        PaymentMethodTypeUniqueName: String(255);
        PaymentMethodTypeName: String(255);
        PaymentMethodTypeDescription: String(255);
        Amount:Double;
        POTotalCost:Double;
        ConsumedAmount:Double;
        AmountToBeConsumed:Double;
        SourceSystem: types.sourceSystem;
        APMTLI_Amount:Double;
        APMTLI_ConsumedAmount:Double;
        APMTLI_AmountToBeConsumed:Double;
}
