namespace sap.ariba;
using { managed } from '@sap/cds/common';

using sap.ariba.type as types from '../types';

/**
    Name:	                Purchase Order (Procurement & Invoicing)
    Class Name:	            ariba.analytics.fact.SSPPOLineItem
    Description:	        Purchase Order
    Database Table Name:	FACT_SSPPO_LINE_ITEM
*/
entity ContractLineItems : managed,types.customFields  {
    key ContractId                                      : String(50);
    key ContractLineNumber                              : String(50);
    key SplitAccountingNumber                           : Double;
        LoadCreateTime                                  : DateTime;
        LoadUpdateTime                                  : DateTime;
        ProcurementUnit                                 : types.procurementUnit;
        MaxAmount                                       : Double;
        OrigMaxAmount                                   : Double;
        OrigCurrencyCode                                : String(10);
        EffectiveDate                                   : types.day;
        Contact                                         : types.contact;
        ReleaseType                                     : String(20);
        AmountOrdered                                   : Double;
        OrigAmountOrdered                               : Double;
        AmountOrderedLeft                               : Double;
        AmountOrderedPercentLeft                        : Double;
        AmountOrderedPercentLeftRange                   : types.percentRangeDim;
        MaxQuantity                                     : Double;
        QuantityOrdered                                 : Double;
        QuantityOrderedLeft                             : Double;
        QuantityOrderedPercentLeft                      : Double;
        QuantityOrderedPercentLeftRange                 : types.percentRangeDim;
        AllowSupplierToEditPrice                        : Boolean;
        AmountReceived                                  : Double;
        OrigAmountReceived                              : Double;
        AmountReceivedLeft                              : Double;
        AmountReceivedPercentLeft                       : Double;
        AmountReceivedPercentLeftRange                  : types.percentRangeDim;
        QuantityReceived                                : Double;
        QuantityReceivedLeft                            : Double;
        QuantityReceivedPercentLeft                     : Double;
        QuantityReceivedPercentLeftRange                : types.percentRangeDim;
        AmountReconciled                                : Double;
        OrigAmountReconciled                            : Double;
        AmountReconciledLeft                            : Double;
        AmountReconciledPercentLeft                     : Double;
        AmountReconciledPercentLeftRange                : types.percentRangeDim;
        NegotiatedPrice                                 : Double;
        OrigNegotiatedPrice                             : Double;
        QuantityReconciled                              : Double;
        QuantityReconciledLeft                          : Double;
        QuantityReconciledPercentLeft                   : Double;
        QuantityReconciledPercentLeftRange              : types.percentRangeDim;
        Description                                     : String(750);
        SupplierPartNumber                              : String(255);
        Contract                                        : types.contract;
        Supplier                                        : types.supplier;
        SourceSystem                                    : types.sourceSystem;
        Commodity                                       : types.commodity;
        ERPCommodity                                    : types.erpCommodity;
        CompanyCode                                     : types.companyCode;
        CostCenter                                      : types.costCenter;
        AccountingCompany                               : types.company;
        PurchasingCompany                               : types.company;
        SubAccount                                      : types.subAccount;
        AccountingRegion                                : types.accountingRegion;
        AccountingProject                               : types.accountingProject;
        Product                                         : types.product;
        Asset                                           : types.asset;
        Account                                         : types.account;
        InternalOrder                                   : types.internalOrder;
        StatisticsCode                                  : types.statisticsCode;
        Percent                                         : Double;
        Scope                                           : String(20);
        //////
        ActivityNumber                                  : types.activityNumber;
        Network                                         : types.network;
        //////
    key Realm                                           : String(50);
}
