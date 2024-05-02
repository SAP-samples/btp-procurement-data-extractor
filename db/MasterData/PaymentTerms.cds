namespace sap.ariba;
using { managed } from '@sap/cds/common';

/**
    Name:	                paymentterms entity
    Description:	        PaymentTerms from mds-search API
*/
entity PaymentTerms_MD: managed {
    key UniqueName                          : String(50);
    key Realm                               : String(50);
        Name_en                             : String(512);
        Description_en                      : String(512);
}
