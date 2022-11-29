namespace sap.ariba;
using { managed } from '@sap/cds/common';

using sap.ariba.type as types from '../types';

/**
    Name:	Region
    Class Name:	ariba.analytics.dimension.Region
    Description:	Region
    Base Level:	Region (L6)
    Database Table Name:	DIM_REGION
*/
entity Region: managed   {
    key Realm                   : String(50);
    key RegionId                : String(50);

        RegionName              : String(255);
        ParentRegionId          : String(255);
        RegionNameL1            : String(255);
        RegionNameL2            : String(255);
        RegionNameL3            : String(255);
        RegionNameL4            : String(255);
        RegionNameL5            : String(255);
        RegionIdL1              : String(50);
        RegionIdL2              : String(50);
        RegionIdL3              : String(50);
        RegionIdL4              : String(50);
        RegionIdL5              : String(50);

}
