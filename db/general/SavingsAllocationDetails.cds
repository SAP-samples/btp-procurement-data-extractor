namespace sap.ariba;
using { managed } from '@sap/cds/common';

using sap.ariba.type as types from '../types';

/**
    Name:	Savings Allocation Details
    Class Name:	ariba.analytics.fact.SavingsAllocationDetails
    Description:	Savings Allocation Details
    Database Table Name:	FACT_SAVINGS_ALLOCATION_D
*/
entity SavingsAllocationDetails: managed   {
    key Realm                   : String(50);
    key SavingsAllocationId     : String(50);

        LoadCreateTime          : DateTime;
        LoadUpdateTime          : DateTime;
        SourceSystem            : types.sourceSystem;
        SavingsFormInfo         : types.savingsFormInfo;
        Description             : String(1000);
        ProjectDescription      : String(1000);
        ProjectInfo             : types.projectInfo;
        Owner                   : types.user;
        SavingsStartDate        : DateTime;
        SavingsEndDate          : DateTime;
        Organization            : types.organization;
        Commodity               : types.commodityCode;
        Region                  : types.region;
        Supplier                : types.supplier;
        SpendType               : String(255);
        AclId                   : Integer;
        ProjectBaselineSpend    : Double;
        BaselineSpend           : Double;
        EstimatedSpend          : Double;
        EstimatedSavings        : Double;
        EstimatedSavingsPct     : Double;
        NegotiatedSpend         : Double;
        NegotiatedSavings       : Double;
        NegotiatedSavingsPct    : Double;
        ImplementedSpend        : Double;
        ImplementedSavings      : Double;
        ImplementedSavingsPct   : Double;
        ActualSpend             : Double;
        ActualSavings           : Double;
        ActualSavingsPct        : Double;
        State                   : String(100);
        Status                  : String(100);
        BeginDate               : types.day;
        DueDate                 : types.day;
        EndDate                 : types.day;
        SavingsType             : String(100);
        IsTestProject           : Boolean;
        ProjectBaselineSpendB   : Double;
        ProjectBaselineSpendC   : Double;
        BaselineSpendB          : Double;
        BaselineSpendC          : Double;
        EstimatedSpendB         : Double;
        EstimatedSpendC         : Double;
        EstimatedSavingsB       : Double;
        EstimatedSavingsC       : Double;
        NegotiatedSpendB        : Double;
        NegotiatedSpendC        : Double;
        NegotiatedSavingsB      : Double;
        NegotiatedSavingsC      : Double;
        ImplementedSpendB       : Double;
        ImplementedSpendC       : Double;
        ImplementedSavingsB     : Double;
        ImplementedSavingsC     : Double;
        ActualSpendB            : Double;
        ActualSpendC            : Double;
        ActualSavingsB          : Double;
        ActualSavingsC          : Double;

}
