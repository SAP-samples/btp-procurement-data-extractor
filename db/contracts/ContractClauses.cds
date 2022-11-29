namespace sap.ariba;
using { managed } from '@sap/cds/common';

using sap.ariba.type as types from '../types';

/**
    Name:	Contract Clause
    Class Name:	ariba.analytics.fact.ContractClause
    Description:	Contract Clause
    Database Table Name:	FACT_CONTRACT_CLAUSE
*/
entity ContractClauses: managed,types.customFields  {
    key ClauseId            : String(25);
    key Realm               : String(50);
        LoadCreateTime      : DateTime;
        LoadUpdateTime      : DateTime;
        CreatedDate         : types.day;
        Project             : types.projectInfo;
        Title               : String(255);
        Type                : String(25);
        Folder              : types.folder;
        Modified            : String(20);
        SourceSystem        : types.sourceSystem;
        AclId               : Double;
}