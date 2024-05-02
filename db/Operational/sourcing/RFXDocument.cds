namespace sap.ariba;
using { managed, cuid } from '@sap/cds/common';

using sap.ariba.type as types from '../../types';


/**
    Name:	                RFXDocument (Strategic Sourcing)
    Description:	        RFXDocument
    Database Source:    	Operational Reporting API
*/

entity RFXDocument_OP: managed {
    key Realm                               : String(50);
    key InternalId                          : String(100);
    EventType                               : String(20);
    DocumentId                              : types.documentId;
    Owner                                   : types.rfxOwner;
    GlobalBiddingRules                      : types.globalBindingRules;
    LastModified                            : DateTime;
    TimeCreated                             : DateTime;
    Status                                  : String(30);
    IsPublishRequired                       : Boolean;
    TemplateObject                          : types.abstractDocument;
    Active                                  : Boolean;
    Content                                 : types.rfxContent; // invitees, RFXItems    
    NextVersion                             : types.abstractDocument;
    LastModifiedBy                          : types.effectiveUser;
    Description                             : String(5000);
    DocumentVersion                         : Integer;
    EventState                              : Integer;
    TimingRule                              : types.alwaysnull;
    Title                                   : String(500);
    TimeUpdated                             : DateTime;
    IsVersionPinned                         : Boolean;
    IsTest                                  : Boolean;
    ParentWorkspace                         : types.parentWorkspace;
    RuntimeData                             : types.runtimeData;
    Unit                                    : Integer;   
    PublishType                             : Integer;       
    PlannedEndDate                          : DateTime;
    EstimatedAwardDate                      : DateTime;
    PlannedBeginDate                        : DateTime;
    PlannedPrebidReviewBeginDate            : DateTime;
    PlannedPreviewBeginDate                 : DateTime;
    Multiple                                : Integer;
    NumberOfEnvelopes:  Integer;
    AllowSeeWeight   : Boolean;
    OwnerSeeBids: Boolean;
    KeepRejectedEnvelopesBids: Boolean;

    Region                                  : Composition of many RFXDocument_Region_OP on Region.RFXDocument = $self;
    Commodity                               : Composition of many RFXDocument_Commodity_OP on Commodity.RFXDocument = $self;
    Client                                  : Composition of many RFXDocument_Client_OP on Client.RFXDocument = $self;
    Invitees                                : Composition of many RFXDocument_Invitees_OP on Invitees.RFXDocument = $self;
    RFXSupplierStatus                       : Composition of many RFXDocument_RFXSupplierStatus_OP on RFXSupplierStatus.RFXDocument = $self;

}

entity RFXDocument_Region_OP: cuid{
    RFXDocument : Association to RFXDocument_OP;
    Region : String(50);
    Description : String(510);
}

entity RFXDocument_Commodity_OP: cuid{
    RFXDocument : Association to RFXDocument_OP;
    UniqueName : String(100);
    Name : String(255);
    Domain : String(50);
}

entity RFXDocument_Client_OP: cuid{
    RFXDocument : Association to RFXDocument_OP;
    DepartmentID : String(50);
    Description : String(510);
}
entity RFXDocument_Invitees_OP: cuid{
    RFXDocument : Association to RFXDocument_OP;
    UniqueName : String(255);
    PasswordAdapter: String(100);
}

entity RFXDocument_RFXSupplierStatus_OP: cuid{
    RFXDocument : Association to RFXDocument_OP;
    Awarded : Boolean;
    DeclineToRespondReason: String(5000);
    HasBid: Boolean;
    IntendToRespond: Integer;
    InvitedUser: types.invitedUser;
    IntendToBid: Boolean;
}