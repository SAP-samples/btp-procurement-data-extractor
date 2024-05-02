namespace sap.ariba;
using { managed } from '@sap/cds/common';

using sap.ariba.type as types from '../../types';


/**
    Name:	                RFXContentDocument (Strategic Sourcing)
    Description:	        RFXContentDocument
    Database Source:    	Operational Reporting API
*/

entity RFXContentDocument_OP: managed {
    key Realm                               : String(50);
    key InternalId                              : String(500);
    DocumentId                              : types.documentId;
    LastModifiedBy                          : types.effectiveUser;
    Owner                                   : types.rfxOwner;
    Description                             : String(5000); 
    Status                                  : String(30);
    LastModified                            : DateTime;
    TimeCreated                             : DateTime;
    DocumentVersion                         : Integer;
    IsVersionPinned                         : Boolean;
    IsPublishRequired                       : Boolean;
    Title                                   : String(500);
    TimeUpdated                             : DateTime;
    Active                                  : Boolean;
    ParentWorkspace                         : types.parentWorkspace;
    Content                                 : types.rfxContent;
    NextVersion                             : types.nextVersion;
    TemplateObject                          : types.nextVersion;
            
}
