namespace sap.ariba;
using { managed } from '@sap/cds/common';

using sap.ariba.type as types from '../types';

/**
    Name:	                One Time Vendor
    Class Name:	            ariba.analytics.fact.OneTimeVendors
    Description:	        One Time Vendor
    Database Table Name:	FACT_ONE_TIME_VENDORS
*/
entity OneTimeVendors: managed,types.customFields   {

    key Realm                           : String(50);
    key ReferenceClusterRootId          : String(50);

        LoadCreateTime                  : DateTime;
        LoadUpdateTime                  : DateTime;
        SupplierShell                   : types.supplier;
        VendorName                      : String(50);
        ShipFromLocation                : types.location;
        RemitToLocation                 : types.location;
        ReferenceClusterRootDate        : types.day;
        SourceSystem                    : types.sourceSystem;
        InvoiceAmount                   : Double;
        InvoiceCount                    : Double;

}