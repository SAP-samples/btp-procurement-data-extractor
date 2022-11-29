namespace sap.ariba;
using { managed, cuid } from '@sap/cds/common';

using sap.ariba.type as types from '../types';


/**
    Name:	                Scenario (Strategic Sourcing)
    Description:	        Scenario
    Database Source:    	Operational Reporting API
*/

entity Scenario: managed {
    key Realm                               : String(50);
    key SliceId                             : String(50);
    AwardStatus                             : Integer;
    AlternativeStatus                       : Integer;
    SavedBy                                 : types.effectiveUser;
    SliceType                               : Integer;
    SubmitBy                                : types.effectiveUser;
    SubmitFor                               : types.effectiveUser;
    ObjectiveFunction                       : String(50);
    SavedDate                               : DateTime;
    Title                                   : String(255);
    IsEmailBid                              : Boolean;
    SubmissionDate                          : DateTime;
    TimeUpdated                             : DateTime;
    NumberofSelectedItems                   : Integer;
    ProcessedDate                           : DateTime;
    TimeCreated                             : DateTime;
    AlternativeId                           : String(50);
    Active                                  : Boolean;
    NumberOfSelectedSuppliers               : Integer;
    ScenarioStatus                          : Integer;
    AlternativeType                         : Integer;
    ScenarioType                            : Integer;
    ContentDocumentReference                : types.documentVersionReferenceBO;
    
}
