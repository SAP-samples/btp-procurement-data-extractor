namespace sap.ariba;
using { managed } from '@sap/cds/common';

using sap.ariba.type as types from '../../types';

/**
    Name:	                Savings Form
    Class Name:	            ariba.analytics.fact.SavingsForm
    Description:	        Savings Form
    Database Table Name:	FACT_SAVINGS_FORM
*/
entity SavingsForm_AN: managed   {
    key Realm                   : String(50);
    key InternalId              : String(4000);

        ActualSavingPct         : Double;
        Description             : String(1000);
        TargetSaving            : types.money;
        AverageInitialBidTotal  : types.money;
        NegotiatedSaving        : types.money;
        EstimatedSavingPct      : Double;
        EstimatedSpend          : types.money;
        ImplementedSaving       : types.money;
        TimeCreated             : DateTime;
        ContractMonths          : Double;
        LeadBidTotal            : types.money;
        EstimatedSaving         : types.money;
        ActualSpend             : types.money;
        UniqueId                : String(200);
        NegotiatedSpend         : types.money;
        Title                   : String(4000);
        BaselineSpend           : types.money;
        TimeUpdated             : DateTime;
        ImplementedSavingPct    : Double;
        ImplementedSpend        : types.money;
        NegotiatedSavingPct     : Double;
        ActualSaving            : types.money;
        LowestInitialBidTotal   : types.money;
        ProcessId               : String(50);
        TargetSavingPct         : Double;

}