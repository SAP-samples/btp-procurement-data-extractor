namespace sap.ariba;
using { managed } from '@sap/cds/common';

using sap.ariba.type as types from '../types';

/**
    Name:	Contract
    Class Name:	ariba.analytics.fact.ContractFact
    Description:	Contract
    Database Table Name:	FACT_CONTRACT_FACT
*/
entity Contracts: managed,types.customFields   {
    key ContractId                                  : String(50);
    key Realm                                       : String(50);
        LoadCreateTime                              : DateTime;
        LoadUpdateTime                              : DateTime;
        ProcurementUnit                             : types.procurementUnit;
        ContractRequestId                           : String(50);
        DaysLeft                                    : Double;
        VersionNumber                               : Double;
        Description                                 : String(1000);
        RelatedContractId                           : String(50);
        Tolerance                                   : Double;
        AmountPercentLeft                           : Double;
        AmountPercentLeftRange                      : types.percentRangeDim;
        AmountReconciledPercentLeft                 : Double;
        AmountReconciledPercentLeftRange            : types.percentRangeDim;
        AmountInvoicedPercentLeft                   : Double;
        AmountInvoicedPercentLeftRange              : types.percentRangeDim;
        EffectiveDate                               : types.day;
        ExpirationDate                              : types.day;
        Contract                                    : types.contract;
        ParentContract                              : types.contract;
        Contact                                     : types.contact;
        Supplier                                    : types.supplier;
        Status                                      : String(20);
        Scope                                       : String(20);
        Expiry                                      : String(20);
        ReleaseType                                 : String(20);
        IsInvoiceable                               : String(20);
        IsReceivable                                : String(20);
        ContractType                                : String(20);
        CompanyCode                                 : types.companyCode;
        SourceSystem                                : types.sourceSystem;
        DefaultRequesterOnInvoiceFromContract       : String(20);
        AllowInvoiceUnitPriceEditable               : String(20);
        AllowNonCatalogOnInvoice                    : String(20);
        AllowSupplierEditInvoiceAccounting          : String(20);
        ExcludeTaxesOnAvailableAmount               : Boolean;
        ExcludeChargesOnAvailableAmount             : Boolean;
        AmountReconciledWithoutTCPercentLeft        : Double;
        AmountInvoicedWithoutTCPercentLeft          : Double;
        Duration                                    : Double;
        UsedAmount                                  : Double;
        OrigCurrencyCode                            : String(10);
        OrigUsedAmount                              : Double;
        AmountOrderedCumulated                      : Double;
        OrigAmountOrderedCumulated                  : Double;
        AmountReconciled                            : Double;
        OrigAmountReconciled                        : Double;
        AmountReconciledCumulated                   : Double;
        OrigAmountReconciledCumulated               : Double;
        AmountInvoiced                              : Double;
        OrigAmountInvoiced                          : Double;
        AmountInvoicedCumulated                     : Double;
        OrigAmountInvoicedCumulated                 : Double;
        AmountLeft                                  : Double;
        OrigAmountLeft                              : Double;
        MinCommitment                               : Double;
        OrigMinCommitment                           : Double;
        MaxCommitment                               : Double;
        OrigMaxCommitment                           : Double;
        AmountReconciledWithoutTaxesAndCharges      : Double;
        AmountInvoicedWithoutTaxesAndCharges        : Double;
        OrigAmountReconciledWithoutTaxesAndCharges  : Double;
        OrigAmountInvoicedWithoutTaxesAndCharges    : Double;
}