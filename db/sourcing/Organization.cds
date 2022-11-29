namespace sap.ariba;
using { managed, cuid } from '@sap/cds/common';

using sap.ariba.type as types from '../types';

/**
    Name:	                Organization (Strategic Sourcing)
    Description:	        Organization
    Database Source:    	Operational Reporting API
*/

entity Organization: managed {
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

  

        BusinessContacts    : Composition of many Organization_BusinessContacts on BusinessContacts.Organization = $self;
        Contacts            : Composition of many Organization_Contacts on Contacts.Organization = $self;
        Ids                 : Composition of many Organization_OrganizationIds on Ids.Organization = $self;
        VendorKeys          : Composition of many Organization_VendorKeys on VendorKeys.Organization = $self;

}
entity Organization_BusinessContacts: cuid {
    Organization        : Association to Organization;
    IsBusinessContactApproved : Integer;
    BusinessContactPhone : String(70);
    BusinessContactFax : String(70);
    BusinessContactEmailAddress : String(100);
    PostalAddress: types.postalAddress;

}
entity Organization_Contacts: cuid {
    Organization        : Association to Organization;
    OrganizationRole : String(128);
    User : types.invitedUser;
}
entity Organization_OrganizationIds: cuid {
    Organization        : Association to Organization;
    Value : String(128);
    Domain : String(50);
}
entity Organization_VendorKeys: cuid {
    Organization        : Association to Organization;
    SiteID: String(50);
    VendorID: String(50);
    LocationID: String(50);
    BusinessSystemID : String(50);
}
        
