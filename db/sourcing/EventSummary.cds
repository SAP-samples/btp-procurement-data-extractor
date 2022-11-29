 namespace sap.ariba;
using { managed, cuid } from '@sap/cds/common';

using sap.ariba.type as types from '../types';

/**
    Name:  Event Level Summary
    Class Name:       ariba.analytics.fact.EventSummary
    Description:       Event Level Summary
    Database Table Name:   FACT_EVENT_SUMMARY
*/

entity EventSummary: managed,types.customFields   {
        LoadCreateTime                          : DateTime;
        LoadUpdateTime                          : DateTime;
        key EventId                             : String(50);
        key ItemId                              : String(50);
        key EventVersion                        : Integer;
        Event                                   : types.event;        
        ProjectInfo                             : types.projectInfo;
        SourceSystem                            : types.sourceSystem;    
        EventStartDate                          : types.singleDate;
        EventEndDate                            : types.singleDate;
        EstAwardDate                            : types.singleDate;
        ContractEffectiveDate                   : types.singleDate;
        EventCreateDate                         : types.singleDate;
        PreviewBeginDate                        : types.singleDate;
        BiddingStartDate                        : types.singleDate;
        BiddingEndDate                          : types.singleDate;
        Owner                                   : types.owner;
        Origin                                  : Double;
        AclId                                   : Double;
        BaselineSpend                           : Double;
        TargetSavingsPct                        : Double;
        ContractMonths                          : Double;
        BidsSubmitted                           : Double;
        BidsRemoved                             : Double;
        SurrogateBids                           : Double;
        NumQuestions                            : Double;
        InvitedSuppliers                        : Double;
        AcceptedSuppliers                       : Double;
        DeclinedSuppliers                       : Double;
        ParticipSuppliers                       : Double;

        
        BiddedSuppliers                         : Composition of many EventSummary_BiddedSuppliers on BiddedSuppliers.EventSummary = $self;
        Commodity                               : Composition of many EventSummary_Commodity on Commodity.EventSummary = $self;
        Region                                  : Composition of many EventSummary_Region on Region.EventSummary = $self;
        Department                              : Composition of many EventSummary_Department on Department.EventSummary = $self;
        key Realm                               : String(50);

}

entity EventSummary_BiddedSuppliers:  cuid {
    BiddedSuppliers       : types.supplier;
    EventSummary : Association to EventSummary;
}

entity EventSummary_Commodity: cuid {
    Commodity       : types.commodity;
    EventSummary : Association to EventSummary;
}

entity EventSummary_Region:  cuid {
    Region          : types.region;
    EventSummary : Association to EventSummary;
}

entity EventSummary_Department:  cuid {
    Department          : types.organization;
    EventSummary : Association to EventSummary;
}



        