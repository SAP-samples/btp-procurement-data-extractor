namespace sap.ariba;
using { managed, cuid } from '@sap/cds/common';

using sap.ariba.type as types from '../../types';

/**
    Name:	                Organization (Strategic Sourcing)
    Description:	        Organization
    Database Source:    	Operational Reporting API
*/

entity Organization_OP: managed {
    key Realm               : String(50);
    key SystemID            : String(64);

        Active              : Boolean;
        BlockingReason      : String(255);
        Parent              : types.parentOrganization;        
        Name                : String(255);
        TimeCreated         : DateTime;
        SMVendorID          : String(100);
        CorporateAddress    : types.corporateAddress;
        TimeUpdated         : DateTime;

  

        BusinessContacts    : Composition of many Organization_BusinessContacts_OP on BusinessContacts.Organization = $self;
        Contacts            : Composition of many Organization_Contacts_OP on Contacts.Organization = $self;
        Ids                 : Composition of many Organization_OrganizationIds_OP on Ids.Organization = $self;
        VendorKeys          : Composition of many Organization_VendorKeys_OP on VendorKeys.Organization = $self;

}
entity Organization_BusinessContacts_OP: cuid {
    Organization        : Association to Organization_OP;
    IsBusinessContactApproved : Integer;
    BusinessContactPhone : String(70);
    BusinessContactFax : String(70);
    BusinessContactEmailAddress : String(100);
    PostalAddress: types.postalAddress;

}
entity Organization_Contacts_OP: cuid {
    Organization        : Association to Organization_OP;
    OrganizationRole : String(128);
    User : types.invitedUser;
}
entity Organization_OrganizationIds_OP: cuid {
    Organization        : Association to Organization_OP;
    Value : String(128);
    Domain : String(50);
}
entity Organization_VendorKeys_OP: cuid {
    Organization        : Association to Organization_OP;
    SiteID: String(50);
    VendorID: String(50);
    LocationID: String(50);
    BusinessSystemID : String(50);
}
        
