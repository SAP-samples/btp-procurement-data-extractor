namespace sap.ariba;
using { managed, cuid } from '@sap/cds/common';

using sap.ariba.type as types from '../types';

/**
    Name:	                Contracts
    Description:	        Contracts
    Database Table Name:	Operational Reporting API
*/

entity ContractsOS: managed, types.customFields {
    key Realm                               : String(50);
    key UniqueName                          : String(50);

        Active                              : Boolean;
        TimeCreated                         : DateTime;
        TimeUpdated                         : DateTime;
        InitialUniqueName                   : String(255);
        Name                                : String(128);
        Description                         : String(1000);
        ExternalID                          : String(100);
        ProcurementUnit                     : types.procurementUnit;
        CompanyCode                         : types.genericRoot;
        PurchaseOrg                         : types.genericRoot;
        TermType                            : Integer;
        HierarchicalType                    : Integer;
        ReleaseType                         : Integer;
        EffectiveDate                       : DateTime;
        ExpirationDate                      : DateTime;
        Evergreen                           : Boolean;
        Supplier                            : types.supplierUniqueName;
        SupplierLocation                    : types.supplierLocation;
        GlobalReleaseFlag                   : Boolean;
        MaxAmountTolerancePercent           : Double;
        ReleaseTolerancePercent             : Double;
        MinAmount                           : types.money;
        MaxAmount                           : types.money;
        ReleaseMinAmount                    : types.money;
        ReleaseMaxAmount                    : types.money;
        PreloadAmount                       : types.money;
        SubPreloadAmount                    : types.money;
        ExternalSourcingId                  : String(50);
        Currency                            : types.currency;
        CreateDate                          : DateTime;
        IsBlanketPurchaseOrder              : Boolean;
        IsAutoRelease                       : Boolean;
        StatusString                        : String(50);

        Requester                           : types.operationalUser;
        Preparer                            : types.operationalUser;
        PaymentTerms                        : types.paymentTerms;

        ForecastedSpend_TotalAmount         : types.money;
        ForecastedSpend_SavingPercentage    : Double;
        ForecastedSpend_Frequency           : types.genericRoot;
        ForecastedSpend_Items               : Composition of many ContractsOS_ForcastedSpendItem on ForecastedSpend_Items.ContractOS = $self;

        ParentAgreement                     : types.parentAgreement;

        SubAgreements                       : Composition of many ContractsOS_SubAgreements on SubAgreements.ContractOS = $self;
        LineItems                           : Composition of many ContractsOS_LineItem on LineItems.ContractsOS = $self;
}

entity ContractsOS_SubAgreements: cuid {
    key ContractOS      : Association to ContractsOS;
        UniqueName      : String(50);
}

entity ContractsOS_ForcastedSpendItem: cuid {
    key ContractOS      : Association to ContractsOS;
        Amount          : types.money;
        StartDate       : DateTime;
        EndDate         : DateTime;
}

entity ContractsOS_LineItem_TieredPricingSteps: cuid {
    key LineItem            : Association to ContractsOS_LineItem;

        DiscountedDecimal   : Double;
        StepMinQuantity     : Double;
        StepMinAmount       : types.money;
        DiscountPercent     : Double;
        DiscountedPrice     : types.money;
}

entity ContractsOS_LineItem: cuid {
    key ContractsOS                         : Association to ContractsOS;

        NumberInCollection                  : Integer;
        Amount                              : types.money;
        CommodityCode                       : types.commodityCode;
        MinAmount                           : types.money;
        MinQuantity                         : Double;
        MinReleaseQuantity                  : Double;
        MinReleaseAmount                    : types.money;
        MaxAmount                           : types.money;
        MaxQuantity                         : Double;
        MaxReleaseAmount                    : types.money;
        MaxReleaseQuantity                  : Double;

        CatalogSubscription                 : types.genericName;
        MaxReleaseTolerancePercent          : Double;
        UnitPriceTolerancePercent           : Double;
        MaxAmountTolerancePercent           : Double;
        MaxQuantityTolerancePercent         : Double;
        Quantity                            : Double;
        LineType                            : types.genericRoot;
        ShipTo                              : types.address;
        DeliverTo                           : String(100);
        Description                         : types.contractDescription;
        Milestone                           : types.milestone;

        PricingTerms_IsCompounded           : Boolean;
        PricingTerms_Formula                : String(100);
        PricingTerms_TieredPricingSteps     : Composition of many ContractsOS_LineItem_TieredPricingSteps on PricingTerms_TieredPricingSteps.LineItem = $self;

        SplitAccountings                    : Composition of many ContractsOS_LineItem_SplitAccountings on SplitAccountings.LineItem = $self;
}

entity ContractsOS_LineItem_SplitAccountings: cuid {
    key LineItem                    : Association to ContractsOS_LineItem;
        PONumber                    : String(50);
        ERPSplitValue               : String(100);
        Percentage                  : Double;
        Amount                      : types.money;
        Quantity                    : Double;
        NumberInCollection          : Integer;
        Type                        : types.operationalSplitAccountingsType;
        POLineNumber                : String(50);
        CostCenter                  : types.operationalCostCenter;
        CompanyCode                 : types.operationalCompanyCode;
        GeneralLedger               : types.generalLedger;
        Asset                       : types.operationalAsset;
        InternalOrder               : types.operationalInternalOrder;
        WBSElement                  : types.wbsElement;

        ProcurementUnit             : types.alwaysnull; // always null
}
