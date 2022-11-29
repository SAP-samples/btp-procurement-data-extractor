namespace sap.ariba;
using { managed } from '@sap/cds/common';

using sap.ariba.type as types from '../types';

/**
    Name:	Commodity
    Class Name:	ariba.analytics.dimension.Commodity
    Description:	Commodity
    Base Level:	Commodity (L4)
    Database Table Name:	DIM_COMMODITY
*/
entity Commodity: managed   {
    key Realm                   : String(50);
    key CommodityId             : String(50);
    key SourceCommodityDomain   : String(150);

        CommodityName           : String(255);
        ParentCommodityId       : String(50);
        UNSPSCCodeName          : String(255);
        UNSPSCCodeId            : String(50);
        UNSPSCParentCodeId      : String(50);
        CategoryL1              : String(255);
        CategoryL2              : String(255);
        CategoryL3              : String(255);
        CategoryIdL1            : String(50);
        CategoryIdL2            : String(50);
        CategoryIdL3            : String(50);
        UNSPSCCategoryL1        : String(255);
        UNSPSCCategoryL2        : String(255);
        UNSPSCCategoryL3        : String(255);
        UNSPSCCategoryIdL1      : String(50);
        UNSPSCCategoryIdL2      : String(50);
        UNSPSCCategoryIdL3      : String(50);

}
