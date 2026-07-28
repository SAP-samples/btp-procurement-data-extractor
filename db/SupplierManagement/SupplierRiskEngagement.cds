namespace sap.ariba;
using { managed } from '@sap/cds/common';


/**
    Entity properties taken from:
    https://help.sap.com/docs/ariba-apis/supplier-risk-engagements-api/supplier-risk-engagements-api
*/
entity SupplierRisk_Engagements: managed  {
key workspaceId                         : String(50);
key Realm                               : String(50);
        title                           : String(1000);
        status                          : String(50);
        updatedDate                     : DateTime;
        ProcessedStatus                 : String(50);
}
