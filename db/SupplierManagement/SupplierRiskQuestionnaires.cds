namespace sap.ariba;
using { managed } from '@sap/cds/common';


/**
    Entity properties taken from:
    https://help.sap.com/docs/ariba-apis/supplier-risk-engagements-api/supplier-risk-engagements-api
*/
entity SupplierRisk_ENG_Questionnaires: managed  {
key workspaceId                     : String(50);
key Realm                           : String(50);
    status                          : String(50);
    updatedDate                     : DateTime;
    sentDate                        : DateTime;
    smVendorId                      : String(50);
    ProcessedStatus                 : String(50);
}