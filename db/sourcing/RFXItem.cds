namespace sap.ariba;
using { managed, cuid } from '@sap/cds/common';

using sap.ariba.type as types from '../types';


/**
    Name:	                RFXItem (Strategic Sourcing)
    Description:	        RFXItem
    Database Source:    	Operational Reporting API
*/

entity RFXItem: managed {
    key Realm                               : String(50);
    key ItemId                              : String(50);
    key VersionId                           : Integer;
    Description                             : String(4000);
    EnvelopeId                              : Integer;      
    IsRealItem                              : Boolean;      
    SoftDelete                              : Boolean;    
    ItemType                                : Integer;    
    DecimalPrecision                        : Integer;
    ItemSubType                             : Integer;
    TimeCreated                             : DateTime;
    Commodity                               : types.itemcommodity;
    Numbering                               : Integer;
    Currency                                : types.currency;
    TargetScore                             : Double;
    KPIUniversalSourceId                    : String(255);
    ParticipantReadOnlyItem                 : Boolean;
    IncumbentsSet                           : Boolean;
    Title                                   : String(4000);
    TimeUpdated                             : DateTime;
    Weight                                  : Double; 
    ParentItemId                            : String(50);
    Active                                  : Boolean;
    NextVersion                             : types.rfxclusterroot;
    LinkedItemId                            : String(50);
    RootItemId                              : String(50);
    ExternalSystemCorrelationId             : String(255);
    LastUpdateDate                          : DateTime;
    
}
