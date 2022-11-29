namespace sap.ariba;
using { managed, cuid } from '@sap/cds/common';

using sap.ariba.type as types from '../types';


/**
    Entity properties taken from:
    https://help.sap.com/viewer/60ec8b8bb9344dbe8dcf15e2a1edc85b/cloud/en-US/f00820a7c45942bc914aafc4426ae4b4.html#loio07f1be8d50264d9dbd053953df0d51c2
*/
entity SLPSuppliers: managed  {
    key SMVendorId                          : String(50);
    key Realm                               : String(50);

        SupplierId                          : String(50);

        SupplierName                        : String(1000);
        ERPVendorId                         : String(50);
        ANId                                : String(50);
        ACMId                               : String(50);
        RegistrationStatus                  : String(100);
        QualificationStatus                 : String(100);
        IntegratedToERP                     : String(50);
        DuplicateSMVendorId                 : String(50);
        LastIntegrationState                : String(100);
        LastConfirmationState               : String(100);
        SourceSystem                        : String(100);
        MasterVendorId                      : String(50);
        FormOfAddressCode                   : String(50);
        name2                               : String(1000);
        name3                               : String(1000);
        name4                               : String(1000);
        DunsId                              : String(50);
        IndustryCode                        : String(50);
        RecordCreatedDate                   : String(100);
        Creator                             : String(255);
        BlockedStatus                       : String(50);
        LastReviewDate                      : String(100);
        LastUpdateDate                      : String(100);
        LastStatusChangeDate                : String(100);
        PrimarySupplierManager              : String(100);
        RelationshipEstablished             : String(50);
        AlternateSupplierManager            : String(100);
        Approved                            : String(50);
        TransactionalSupplier               : String(100);
        TransactionalSupplierRequestStatus  : String(50);
        MainVendorType                      : String(50);
        AddressLine1                        : String(255);
        AddressCity                         : String(255);
        AddressCountryCode                  : String(50);
        AddressRegionCode                   : String(50);
        AddressPostalCode                   : String(50);
        PrimaryContactFirstName             : String(255);
        PrimaryContactMiddleName            : String(255);
        PrimaryContactLastName              : String(255);
        PrimaryContactEMail                 : String(255);

        // Risk specific fields
        Exposure                            : Double;
        ExposureLevel                       : Integer;

        // Certification specific fields
        IsCertified                         : Boolean;

        Qualifications                      : Composition of many SLPSuppliers_Qualifications on Qualifications.SLPSupplier = $self;
        Questionnaires                      : Composition of many SLPSuppliers_Questionnaires on Questionnaires.SLPSupplier = $self;
        RiskCategoryExposures               : Composition of many SLPSuppliers_RiskCategoryExposures on RiskCategoryExposures.SLPSupplier = $self;
        Certifications                      : Composition of many SLPSuppliers_Certificates on Certifications.SLPSupplier = $self;

}

entity SLPSuppliers_Qualifications: cuid {
    QualificationStatus     : String(100);
    PreferredStatus         : String(100);
    Category                : String(255);
    Region                  : String(255);
    BusinessUnit            : String(255);
    MaterialId              : String(255);
    ProcessType             : String(255);

    SupplierId              : String(50);
    SLPSupplier             : Association to SLPSuppliers;
}

entity SLPSuppliers_Questionnaires: cuid {
    QuestionnaireId         : String(50);
    QuestionnaireTitle      : String(255);
    WorkspaceType           : String(100);
    WorkspaceId             : String(50);


    SupplierId              : String(50);
    SLPSupplier             : Association to SLPSuppliers;
}

entity SLPSuppliers_RiskCategoryExposures: cuid {
    key Name                            : String(100);
        Exposure                        : Double;
        ExposureLevel                   : Integer;
        ExposureId                      : Integer;
        ExposureCalculationDate         : String(100);
        ResponseTimeStamp               : String(100);
        ExposureConfigurationVersion    : String(100);
        Latest                          : Boolean;

        SupplierId                      : String(50);
        SLPSupplier                     : Association to SLPSuppliers;
}

entity SLPSuppliers_Certificates: cuid {
    CertificationId                 : String(50);
    SmVendorId                      : String(50);
    QuestionnaireId                 : String(100);
    UniqueName                      : String(100);
    RootId                          : String(100);
    WorkspaceId                     : String(100);
    Active                          : Boolean;
    ExternalSystemCorrelationId     : String(100);
    CertificationType               : String(100);
    CertificationTypeOther          : String(100);
    Type                            : String(255);
    TimeUpdated                     : DateTime;
    TimeCreated                     : DateTime;
    EffectiveDate                   : DateTime;
    ExpirationReminderDate          : DateTime;
    ExpirationDate                  : DateTime;
    IssueDate                       : DateTime;
    CertificationNumber             : String(100);
    AuthorityInfo                   : String(255);
    CertificationName               : String(255);
    CertificationLocation           : String(255);
    YearValid                       : Integer;
    OrgId                           : String(100);
    ObjId                           : String(100);
    ContentId                       : String(100);
    FileName                        : String(255);
    FileSize                        : Integer;
    FileDescription                 : String(1000);
    FileAbsolutePath                : String(1000);
    AttachmentName                  : String(255);
    AttachmentFileSize              : Integer;
    Description                     : String(1000);
    Attachment                      : String(1000);
    Certified                       : String(100);
    IssuerId                        : String(100);
    AuditResult                     : String(100);
    WorkspaceType                   : String(100);
    Status                          : String(50);
    QualificationStatus             : String(50);
    ExpirationNotificationWindow    : Integer;
    ExpirationFlag                  : Boolean;
    Changed                         : Boolean;
    RepeatableItem                  : Boolean;

    SupplierId                      : String(50);
    SLPSupplier                     : Association to SLPSuppliers;
}