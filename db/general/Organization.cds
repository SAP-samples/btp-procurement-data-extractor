namespace sap.ariba;
using { managed } from '@sap/cds/common';

using sap.ariba.type as types from '../types';

/**

*/
entity OrganizationFact: managed   {
    key Realm                   : String(50);
    key OrganizationId          : String(50);

        OrganizationName        : String(255);
        ParentOrgId             : String(255);
        OrganizationNameL1      : String(255);
        OrganizationNameL2      : String(255);
        OrganizationNameL3      : String(255);
        OrganizationNameL4      : String(255);
        OrganizationNameL5      : String(255);
        OrganizationIdL1        : String(50);
        OrganizationIdL2        : String(50);
        OrganizationIdL3        : String(50);
        OrganizationIdL4        : String(50);
        OrganizationIdL5        : String(50);

}
