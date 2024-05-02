namespace sap.ariba;
using { managed } from '@sap/cds/common';

using sap.ariba.type as types from '../../types';


/**
    Name:	                RFXItemValue (Strategic Sourcing)
    Description:	        RFXItemValue
    Database Source:    	Operational Reporting API
*/

entity RFXItemValue_OP: managed {
    key Realm                               : String(50);
    key ItemId                              : String(50);
    key VersionId                           : Integer;
    key SliceId                             : String(50);
    ExpiryDate                              : DateTime;
    QUANTITY                                : types.rfxquantity;
    TAX                                     : types.money;
    NumberOfActiveBidders                   : Integer;
    SHIPTO                                  : types.shipto;
    TimeCreated                             : DateTime;
    TiedRank                                : Boolean;
    INDEXPCT                                : Double;
    EXTENDEDPRICE                           : types.money;
    BESTPRICE                               : types.money;
    DISCOUNTAMT                             : types.money;
    LEADTIME                                : String(255);
    SHIPPINGCOST                            : types.money;
    BESTEXTENDEDPRICE                       : types.money;
    Status                                  : Integer;
    BONUSPENALTYAMT                         : types.money;
    PRICE                                   : types.money;
    SUPPLIERPARTAUXILIARYID                 : String(255);
    Active                                  : Boolean;
    REUSEQUOTE                              : Boolean;
    NextVersion                             : types.versiondClusterRoot;
    MANUFACTURERNAME                        : String(255);
    DISCOUNTPCT                             : Double;
    SHIPPINGTERMS                           : types.alwaysnull;
    INDEXNAME                               : types.alwaysnull;
    TOTALCOST                               : types.money;  
    NumberOfInactiveBidders                 : Integer;
    ADVANCEDPRICINGCONDITIONS               : types.alwaysnull;
    COMMENT                                 : String(500);
    URL                                     : String(255);
    DOCUMENTURL                             : String(500);
    TAXDESCRIPTION                          : String(500);
    key LINENUMBER                              : Integer;
    MANUFACTURERPARTID                      : String(255);                 
    QUOTEVALIDITYDATE                       : DateTime;
    Rank                                    : Integer;
    SURCHARGEPCT                            : Double;
    UNITCOST                                : types.money;
    INDEXAMT                                : types.money;
    TimeUpdated                             : DateTime;
    AODDataSyncScn                          : Integer; 
    SURCHARGEAMT                            : types.money;
    AODObjId                                : String(100);
    BONUSPENALTYPCT                         : Double;
    SAVINGS                                 : types.savings;
    REQUESTDELIVERYDATE                     : DateTime;
    SUPPLIERPARTID                          : String(255);
    EffectiveDate                           : DateTime;
    
}
