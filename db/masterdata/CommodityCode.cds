namespace sap.ariba;
using { managed } from '@sap/cds/common';

using sap.ariba.type as types from '../types';

/**
    Name:	                commoditycodes entity
    Description:	        CommodityCodes from mds-search API
*/
entity CommodityCode: managed {
    key UniqueName                          : String(50);
    key Domain                              : String(50);
    key Realm                               : String(50);
        Name_en                             : String(512);
}
