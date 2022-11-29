namespace sap.ariba;
using { managed } from '@sap/cds/common';

using sap.ariba.type as types from '../types';

/**
    Name:  Rejected Invoices
    Class Name:       ariba.analytics.fact.SSPRejectedInvoice
    Description:       Rejected Invoices
    Database Table Name:   FACT_SSP_REJECTED_INVOICE
*/
entity RejectedInvoices: managed,types.customFields   {

        key InvoiceId: String(50);
        LoadCreateTime: DateTime;
        LoadUpdateTime: DateTime;
        InvoiceNumber: String(50);
        InvoiceDate : types.day;
        IRStatus: String(50);
        RejectionReasonCode: String(60);
        RejectionReasonText: String(255);
        InvoiceWithReasonsCount: Double;
        SourceSystem: types.sourceSystem;
        key Realm                   : String(25);

}