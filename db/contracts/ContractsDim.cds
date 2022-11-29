namespace sap.ariba;
using { managed } from '@sap/cds/common';

using sap.ariba.type as types from '../types';

/**
    Name:	Contract
    Class Name:	ariba.analytics.Dimentions.Contract
    Description:	Contract
*/
entity ContractsDim: managed,types.customFields   {
    key ContractId                                  : String(50);
    key Realm                                       : String(50);
    key SourceSystem: String(100);
        TimeCreated                                 : DateTime;
        TimeUpdated                                 : DateTime;
        AclId                                       : Double;
        AgreementDate                               : DateTime;
        Amount                      : Double;
        ContractCurrency : String(255);
        ContractIdL1: String(50);
        ContractLevel : String(25);
        ContractName : String(255);
        ContractNameL1: String(255);
        ContractType: String(255);
        EffectiveDate: DateTime;
        ExpirationDate: DateTime;
        IsEvergreen : Boolean;
        MaxLimit: String(255);
        MinLimit: String(255);
        ParentContractId: String(50);
        ProposedAmount: Double;
        RelatedId: String(50);
        ReleaseType: String(25);
        SavingsPercentage: Double;        
}