namespace sap.ariba;
using { managed } from '@sap/cds/common';

using sap.ariba.type as types from '../types';

/**
    Name:	                Purchase Order Delivery
    Class Name:	            ariba.analytics.fact.PODelivery
    Description:	        Purchase Order Delivery
    Database Table Name:	FACT_PO_DELIVERY
*/
entity PODelivery: managed,types.customFields  {
    key POId                                : String(50);
    key Realm                               : String(50);
        LoadCreateTime                      : DateTime;
        LoadUpdateTime                      : DateTime;
        OrderID                             : String(50);
        POName                              : String(255);
        ProcurementUnit                     : types.unit;
        Amount                              : Double;
        ConfirmationTime                    : Double;
        DeliveryTime                        : Double;
        ReceiptTime                         : Double;
        InvoiceTime                         : Double;
        OnTimeDeliveryShip                  : Double;
        OnTimeDeliveryReceipt               : Double;
        OnTimeOrLate                        : String(25);
        BackOrderedItems                    : String(25);
        RejectedItems                       : String(25);
        SubstitutedItems                    : String(25);
        OrderConfirmation                   : String(25);
        AdvancedShipNotice                  : String(25);
        Receipt                             : String(25);
        OrderedDate                         : types.day;
        NeedByDate                          : types.day;
        Supplier                            : types.supplier;
        Requester                           : types.user;
        SourceSystem                        : types.sourceSystem;
}
