namespace sap.ariba;
using { managed } from '@sap/cds/common';

using sap.ariba.type as types from '../types';

/**
    Name:	                Order Confirmation
    Class Name:	            ariba.analytics.fact.OrderConfirmation
    Description:	        Order Confirmation
    Database Table Name:	FACT_ORDER_CONFIRMATION
*/
entity OrderConfirmation: managed,types.customFields  {
    key OCId                                : String(50);
    key Realm                               : String(50);
        LoadCreateTime                      : DateTime;
        LoadUpdateTime                      : DateTime;
        OCLineNumber                        : Double;
        OrderId                             : String(255);
        OrderLineNumber                     : Double;
        NumberConfirmedAccepted             : Double;
        NumberConfirmedAcceptedWithChanges  : Double;
        NumberConfirmedRejected             : Double;
        NumberConfirmedBackOrdered          : Double;
        NumberConfirmedSubstituted          : Double;
        DeliveryDate                        : types.day;
        ShipmentDate                        : types.day;
        Description                         : String(4000);
        Amount                              : Double;
        Shipping                            : Double;
        Tax                                 : Double;
        OrderConfirmationDate               : types.day;
        SourceSystem                        : types.sourceSystem;
}
