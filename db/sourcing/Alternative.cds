namespace sap.ariba;
using { managed, cuid } from '@sap/cds/common';

using sap.ariba.type as types from '../types';


/**
    Name:	                Alternative (Strategic Sourcing)
    Description:	        Alternative
    Database Source:    	Operational Reporting API
*/

entity Alternative: managed {
    key Realm                               : String(50);
    key SliceId                             : String(50);
    key AlternativeId                       : String(50);
    AlternativeStatus                       : Integer;
    SliceType                               : Integer;
    SubmitBy                                : types.effectiveUser;
    SubmitFor                               : types.effectiveUser;
    IsEmailBid                              : Boolean;
    SubmissionDate                          : DateTime;
    TimeUpdated                             : DateTime;
    ProcessedDate                           : DateTime;
    TimeCreated                             : DateTime;
    Active                                  : Boolean;
    AlternativeType                         : Integer;
    ContentDocumentReference                : types.documentVersionReferenceBO;
    
}
