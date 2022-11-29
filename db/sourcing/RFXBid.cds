namespace sap.ariba;
using { managed, cuid } from '@sap/cds/common';

using sap.ariba.type as types from '../types';


/**
    Name:	                RFXBid (Strategic Sourcing)
    Description:	        RFXBid
    Database Source:    	Operational Reporting API
*/

entity RFXBid: managed {
    key Realm                               : String(50);
    key SliceId                             : String(50);
    AlternativeStatus                       : Integer;
    SavedBy                                 : types.effectiveUser;
    SliceType                               : Integer;
    SubmitBy                                : types.effectiveUser;
    SubmitFor                               : types.effectiveUser;
    SavedDate                               : DateTime;
    IsEmailBid                              : Boolean;
    SubmissionDate                          : DateTime;
    IsSurrogateBid                          : Boolean;
    TimeUpdated                             : DateTime;
    ProcessedDate                           : DateTime;
    TimeCreated                             : DateTime;
    AlternativeId                           : String(50);
    Active                                  : Boolean;
    AlternativeType                         : Integer;
    ContentDocumentReference                : types.documentVersionReferenceBO;
    
}
