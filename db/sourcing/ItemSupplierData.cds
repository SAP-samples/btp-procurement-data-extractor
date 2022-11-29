namespace sap.ariba;
using { managed, cuid } from '@sap/cds/common';

using sap.ariba.type as types from '../types';

/**
    Name:	                ItemSupplierData (Strategic Sourcing)
    Description:	        ItemSupplierData
    Database Source:    	Operational Reporting API
*/

entity ItemSupplierData: managed   {
    key Realm                   : String(50);
    key ItemId                  : String(50);

    DeclineToBidReasonComment   : String(1000);
    DeclineToBidReason          : String(255);
    PurgeState                  : Integer;
    HasBid                      : Boolean;
    SupplierData                : types.rfxSupplierData;
    Awarded                     : Boolean;
    TimeUpdated                 : DateTime;
    NumberOfRemovedBids         : Integer;
    TimeCreated                 : DateTime;
    NumberOfBidExtension        : Integer;
    Active                      : Boolean;
    NumberOfSurrogateBids       : Integer;
    IntendToBid                 : Boolean;
    Version                     : Integer;
    NumberOfSubmittedBids       : Integer;

}