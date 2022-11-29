namespace sap.ariba;
using { managed,cuid } from '@sap/cds/common';

using sap.ariba.type as types from '../types';

/**
    Name:	                User Activity
    Class Name:	            ariba.analytics.fact.UserActivity
    Description:	        User Activity
    Database Table Name:	FACT_USER_ACTIVITY
*/
entity UserActivity: managed   {
    key Realm                   : String(50);
    key UserId                  : String(50);
    key ActivityDateDay         : DateTime;
    key DocumentType            : String(50);
    key ActivityType            : String(25);
    key SourceSystemId          : String(100);

        LoadCreateTime          : DateTime;
        LoadUpdateTime          : DateTime;
        DocumentCount           : Integer;
        UserData                : types.user;
        SourceSystem            : types.sourceSystem;
        ProcurementUnit         : types.procurementUnit;
        ActivityDate            : types.day;

}
