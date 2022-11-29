namespace sap.ariba;
using { managed, cuid } from '@sap/cds/common';

using sap.ariba.type as types from '../types';


/**
    Name:	                Task (Strategic Sourcing)
    Description:	        Task
    Database Source:    	Operational Reporting API
*/

entity Task: managed {
    key Realm                               : String(50);
    key InternalId                          : String(50);
    Status                                  : String(30);
    Owner                                   : types.effectiveUser;
    ParentPlan                              : types.plan;
    Title                                   : String(255);
    CreateDate                              : DateTime;
    EndDate                                 : DateTime;
    TimeUpdated                             : DateTime;
    BeginDate                               : DateTime;
    TemplateObject                          : types.abstractDocument;
    TimeCreated                             :DateTime;
    Active                                  : Boolean;
    ParentWorkspace                         : types.parentWorkspace;
    EndDateTime                             : DateTime;
    RoundNumber                             : Integer;
    DueDate                                 : DateTime;
}
