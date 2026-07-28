namespace sap.ariba;
using { managed, cuid } from '@sap/cds/common';


/**
    Entity properties taken from:
    https://help.sap.com/docs/ariba-apis/supplier-risk-engagements-api/supplier-risk-engagements-api
*/

entity SupplierRiskEngRequestDetails: managed  {
key workspaceId                     : String(50);
key Realm                           : String(50);
Key titleKey                        : String(500);
    title                           : String(500);
    status                          : String(50);
    dueDate                         : DateTime;
    supplierId                      : String(50);
    SupplierName                    : String(255);
    questionsAndAnswers             : Composition of many SupplierRiskEngRequestDetails_QA on questionsAndAnswers.QuestionnairesQA = $self;
}
 
entity SupplierRiskEngRequestDetails_QA: cuid {
    question                        : String(5000);
    answerType                      : String(500);
    answer                          : String(5000);
    section                         : String(255);
    QuestionnairesQA                : Association to SupplierRiskEngRequestDetails;
}