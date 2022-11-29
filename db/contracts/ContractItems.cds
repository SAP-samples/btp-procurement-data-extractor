namespace sap.ariba;
using { managed,cuid } from '@sap/cds/common';

using sap.ariba.type as types from '../types';

/**
    Name:	Contract
    Class Name:	ariba.analytics.Dimentions.Contract
    Description:	Contract
*/
entity ContractItem: managed ,types.customFields {
    key ItemId                                      : String(50);
    key Realm                                       : String(50);

        AclId                                       : Integer64;
        AllowAdvancedPricingConditions              : Boolean;
        AllowPeriodQuantityForEvent                 : Boolean; 
        AllowSupplierScales                         : Boolean;
        AllowSupplierToViewPeriodQuantity           : Boolean;
        Contract                                    : types.contract;
        CreatedDate                                 : types.day;
        ItemDescription                             : String(1000);
        ItemTitle                                   : String(255);
        LoadCreateTime                              : DateTime;
        LoadUpdateTime                              : DateTime;
        MaxVolumeThreshold                          : Integer;
        PricingConditionValidityPeriodType          : Integer;
        SourceSystem                                : types.sourceSystem;
        TimeCreated                                 : DateTime;
        TimeUpdated                                 : DateTime;
        ValidityPeriodDuration                      : Integer;
        VolumeScaleEnabled                          : Boolean;

        CommodityEscalationClause                   : Composition of many ContractItem_CommodityEscalationClause on CommodityEscalationClause.ContractItem = $self;
        ItemCommodity                               : Composition of many ContractItem_ItemCommodity on ItemCommodity.ContractItem = $self;
}

entity ContractItem_ItemCommodity: cuid {
    ItemCommodity       : types.commodity;
    ContractItem    : Association to ContractItem;
}

entity ContractItem_CommodityEscalationClause: cuid {
    CommodityEscalationClause       : types.commodityEscalationClause;
    ContractItem    : Association to ContractItem;
}