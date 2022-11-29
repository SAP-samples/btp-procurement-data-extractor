namespace sap.ariba;
using { managed } from '@sap/cds/common';

using sap.ariba.type as types from '../types';

/**
    Name:  Invoice Exceptions
    Class Name:       ariba.analytics.fact.InvoiceExceptions
    Description:       Invoice Exceptions
    Database Table Name:   FACT_INVOICE_EXCEPTIONS
*/
entity InvoiceExceptions: managed,types.customFields   {

        key InvoiceId: String(50);
        key InvoiceLineNumber: Double;
        key ExceptionTypeId: String(255);
        
        ExceptionType: types.exceptionType;
        LoadCreateTime: DateTime;
        LoadUpdateTime: DateTime;
        InvoiceNumber: String(50);
        ProcurementUnit: types.procurementUnit;
        InvoiceWithExceptionCount: Double;
        InvoiceDate : types.day;
        AccountingDate: types.day;
        Supplier: types.supplier;
        Requester: types.requester;
        POId: String(25);
        OrderID: String(25);
        POLineNumber: String(10);
        ReconciledBy: types.user;
        IRStatus: String(50);
        ExceptionStatus: String(50);
        InvoiceSubmissionMethod: String(50);
        InvoiceSourceDocument: String(50);
        SourceSystem: types.sourceSystem;
        key Realm                   : String(25);

}