namespace sap.ariba;
using { managed, cuid } from '@sap/cds/common';

using sap.ariba.type as types from '../../types';

/**
    Name:	                Contracts
    Description:	        Contracts
    Database Table Name:	Operational Reporting API
*/

entity Contracts_OP: managed, types.customFields {
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
        ForecastedSpend_Items               : Composition of many Contracts_ForcastedSpendItem_OP on ForecastedSpend_Items.Contract = $self;

        ParentAgreement                     : types.parentAgreement;

        SubAgreements                       : Composition of many Contracts_SubAgreements_OP on SubAgreements.Contract = $self;
        LineItems                           : Composition of many Contracts_LineItem_OP on LineItems.Contracts = $self;
}

entity Contracts_SubAgreements_OP: cuid {
    key Contract      : Association to Contracts_OP;
        UniqueName      : String(50);
}

entity Contracts_ForcastedSpendItem_OP: cuid {
    key Contract      : Association to Contracts_OP;
        Amount          : types.money;
        StartDate       : DateTime;
        EndDate         : DateTime;
}

entity Contracts_LineItem_TieredPricingSteps_OP: cuid {
    key LineItem            : Association to Contracts_LineItem_OP;

        DiscountedDecimal   : Double;
        StepMinQuantity     : Double;
        StepMinAmount       : types.money;
        DiscountPercent     : Double;
        DiscountedPrice     : types.money;
}

entity Contracts_LineItem_OP: cuid {
    key Contracts                         : Association to Contracts_OP;

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
        PricingTerms_TieredPricingSteps     : Composition of many Contracts_LineItem_TieredPricingSteps_OP on PricingTerms_TieredPricingSteps.LineItem = $self;

        SplitAccountings                    : Composition of many Contracts_LineItem_SplitAccountings_OP on SplitAccountings.LineItem = $self;
}

entity Contracts_LineItem_SplitAccountings_OP: cuid {
    key LineItem                    : Association to Contracts_LineItem_OP;
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
