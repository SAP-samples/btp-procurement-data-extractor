namespace sap.ariba;
using { managed } from '@sap/cds/common';

using sap.ariba.type as types from '../../types';



entity InvoiceLineItemExceptions_AN: managed,types.customFields   {
        key Realm                           : String(50);
        key InvoiceId                       : String(50);
        key InvoiceLineNumber               : Integer;
        key ExceptionTypeId                 : String(255);

            InvoiceExceptionType            : types.exceptionType;
            LoadCreateTime                  : DateTime;
            LoadUpdateTime                  : DateTime;
            InvoiceNumber                   : String(50);
            InvoiceLineNumberAsString       : String(100);
            ProcurementUnit                 : types.procurementUnit;
            ExceptionCount                  : Integer;
            AutoReconciledExceptionCount    : Integer;
            LineItemWithExceptionCount      : Integer;
            Amount                          : Double;
            OrigCurrencyCode                : String(10);
            OrigAmount                      : Double;
            InvoiceDate                     : types.day;
            AccountingDate                  : types.day;
            Supplier                        : types.supplier;
            Commodity                       : types.commodity;
            ERPCommodity                    : types.erpCommodity;
            LineType                        : String(25);
            Contract                        : types.contract;
            Requester                       : types.requester;
            POId                            : String(25);
            OrderID                         : String(25);
            POLineNumber                    : String(10);
            ReconciledBy                    : types.owner;
            IRStatus                        : String(50);
            ExceptionStatus                 : String(50);
            SourceSystem                    : types.sourceSystem;

}