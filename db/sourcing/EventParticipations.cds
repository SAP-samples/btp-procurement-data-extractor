namespace sap.ariba;
using { managed, cuid } from '@sap/cds/common';

using sap.ariba.type as types from '../types';

/**
    Name:	                Event Participation
    Class Name:	            ariba.analytics.fact.EventParticipation
    Description:	        Event Participation
    Database Table Name:	FACT_EVENT_PARTICIPATION
*/
entity EventParticipations: managed,types.customFields  {
    key Realm                               : String(50);
    key EventId                             : String(50);
    key ItemId                              : String(50);
    key EventVersion                        : Integer;

        Event                               : types.event;
        LoadCreateTime                      : DateTime;
        LoadUpdateTime                      : DateTime;
        Bidder                              : types.contact;
        SourceSystem                        : types.sourceSystem;
        Supplier                            : types.supplier;
        EventStartDate                      : types.day;
        EventEndDate                        : types.day;
        EstAwardDate                        : types.day;
        ContractEffectiveDate               : types.day;
        EventCreateDate                     : types.day;
        PreviewBeginDate                    : types.day;
        BiddingStartDate                    : types.day;
        BiddingEndDate                      : types.day;
        Owner                               : types.contact;
        AcceptedFlag                        : Boolean;
        DeclinedFlag                        : Boolean;
        IntendToRespondFlag                 : Boolean;
        DeclinedToRespondFlag               : Boolean;
        ParticipatedFlag                    : Boolean;
        AwardedFlag                         : Boolean;
        AclId                               : Double;
        BaselineSpend                       : Double;
        TargetSavingsPct                    : Double;
        ContractMonths                      : Double;
        NumEventAwarded                     : Integer;
        NumEventAccepted                    : Integer;
        NumEventDeclined                    : Integer;
        NumIntendToRespond                  : Integer;
        NumDeclinedToRespond                : Integer;
        NumEventBidOn                       : Integer;
        BidsSubmitted                       : Integer;

        Commodity                           : Composition of many EventParticipations_Commodity on Commodity.EventParticipations = $self;
        Department                          : Composition of many EventParticipations_Department on Department.EventParticipations = $self;
        Region                              : Composition of many EventParticipations_Region on Region.EventParticipations = $self;
}

entity EventParticipations_Commodity: cuid {
    Commodity           : types.commodity;
    EventParticipations : Association to EventParticipations;
}

entity EventParticipations_Region:  cuid {
    Region              : types.region;
    EventParticipations : Association to EventParticipations;
}

entity EventParticipations_Department:  cuid {
    Department          : types.organization;
    EventParticipations : Association to EventParticipations;
}