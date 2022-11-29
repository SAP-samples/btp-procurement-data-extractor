 namespace sap.ariba;
using { managed, cuid } from '@sap/cds/common';

using sap.ariba.type as types from '../types';

/**
    Name:  Event 
    Class Name:       ariba.analytics.dimentions.Event
    Description:       Event Dimentions
*/

entity Event: managed  {
        TimeCreated                             : DateTime;
        TimeUpdated                             : DateTime;
        key EventId                             : String(50);
        key ItemId                              : String(50);
        key Realm                               : String(50);

        AclId                                   : Integer64;
        AllowAdvancedPricingConditions          : Boolean;
        AllowAlternativeBidding                 : Integer;
        AllowBonusMalus                         : Boolean;
        AllowMultiCurrency                      : Boolean;
        AllowPeriodQuantityForEvent             : Boolean;
        AllowScoring                            : Boolean;
        AllowSeeWeight                          : Boolean;
        AllowSupplierScales                     : Boolean;
        AllowSupplierToViewPeriodQuantity       : Boolean;
        CompetitorBidsInfoRelease               : String(25);
        CompetitorRankInfoRelease               : Boolean;
        EventCurrency                           : String(25);
        EventDescription                        : String(1000);
        EventFormat                             : String(25);
        EventStatus                             : String(25);
        EventTemplateId                         : String(50);
        EventTemplateName                       : String(255);
        EventTitle                              : String(255);
        EventType                               : String(25);
        ExchangeRateInfoRelease                 : Boolean;
        ImprovementType                         : String(25);
        IsLastVersion                           : Boolean;
        ItemDescription                         : String(1000);
        ItemSubType                             : String(25);
        ItemTitle                               : String(255);
        ItemType                                : String(25);
        LargeContents                           : Boolean;
        LeadBidInfoRelease                      : String(25); 
        LotStatus                               : String(25);
        MaxVolumeThreshold                      : Integer;
        OwnRankingInfoRelease                   : String(25);
        OwnerSeeBids                            : Boolean;
        ParticipantSpecificValuesInfoRelease    : Boolean;
        PricingConditionValidityPeriodType      : Integer;
        ProjectId                               : String(50);
        RoundNumber                             : Integer;
        SourceSystem                            : String(100);
        StartGateInfoRelease                    : String(25);
        SupplierNamesInfoRelease                : String(25);
        TestEvent                               : Boolean;
        TieBidRule                              : String(25);
        ValidityPeriodDuration                  : DateTime;
        ValidityPeriodEndDate                   : DateTime;
        ValidityPeriodStartDate                 : DateTime;
        VersionNumber                           : Integer;
        VolumeScaleEnabled                      : Boolean;
        
}
