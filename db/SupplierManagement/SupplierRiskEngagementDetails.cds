namespace sap.ariba;
using { managed, cuid } from '@sap/cds/common';


/**
    Entity properties taken from:
    https://help.sap.com/docs/ariba-apis/supplier-risk-engagements-api/supplier-risk-engagements-api
*/

entity SupplierRiskEngagementDetails: managed  {
key workspaceId                     : String(50);
key Realm                           : String(50);
    title                           : String(500);
    status                          : String(500);
    requestedOn                     : DateTime;
    requestedBy                     : String(50);
    inherentRisk                    : String(100);
    residualRisk                    : String(100);
    supplierId                      : String(50);
    supplierName                    : String(500);    
    suppliercontactFirstName        : String(500);
    supplierContactLastName         : String(500);
    supplierContactEmail            : String(500);
    supplierContactTelephone        : String(15);
    supplierFax                     : String(15);
    supplierTelephone               : String(15);
    dataLoadErrorMessage            : String(5000);
    EngControls                     : Composition of many SupplierRiskEngagementControls on EngControls.Controls = $self;
    Engtasks                        : Composition of many SupplierRiskEngagementTasks on Engtasks.tasks = $self;
    EngAssessmentDetails            : Composition of many EngAssessments on EngAssessmentDetails.engAssessments = $self;
}
entity SupplierRiskEngagementControls: cuid {
    Controls                        : Association to SupplierRiskEngagementDetails;
    engagementId                    : String(50);
    key controlId                   : String(50);
    owner                           : String(50);
    controlName                     : String(5000);
    controlType                     : String(50);
    decisionMaker                   : String(50);
    riskType                        : String(100);
    status                          : String(50);
    taskAssignee                    : String(50);
    assessments                     : Composition of many ControlsAssessments on assessments.control =$self;
}

entity ControlsAssessments: cuid {
    workspaceId                     : String(50);
    assessmentName                  : String(5000);
    assessmentType                  : String(50);
    assessmentId                    : String(50);
    control                         : Association to SupplierRiskEngagementControls;
}

entity SupplierRiskEngagementTasks: cuid {
    tasks                           : Association to SupplierRiskEngagementDetails;
    key taskId                      : String(50);
    taskStatus                      : String(50);
    name                            : String(5000);
    originalOwner                   : String(50);
    owner                           : String(50);
    taskType                        : String(50);
    comments                        : Composition of many SupplierRiskEngagementTaskComments on comments.taskcomments =$self;
}

entity SupplierRiskEngagementTaskComments: cuid {
    comment                         : String(5000);
    user                            : String(50);
    date                            : DateTime;
    taskcomments                    : Association to SupplierRiskEngagementTasks;
}

entity EngAssessments: cuid {
    workspaceId                     : String(50);
    assessmentId                    : String(50);
    assessmentName                  : String(5000);
    assessmentType                  : String(50);
    status                          : String(50);
    visibility                      : String(50);
    imported                        : String(100);
    skipped                         : String(50);
    skippedReason                   : String(50);
    riskScore                       : String(10);
    targetScore                     : String(10);
    modifiedDate                    : DateTime;
    sentDate                        : DateTime;
    expirationDate                  : DateTime;
    smVendorId                      : String(50);
    controlId                       : String(50);
    engAssessments                  : Association to    SupplierRiskEngagementDetails;
}