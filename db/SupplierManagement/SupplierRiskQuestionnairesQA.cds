namespace sap.ariba;
using { managed, cuid } from '@sap/cds/common';


/**
    Entity properties taken from:
    https://help.sap.com/docs/ariba-apis/supplier-risk-engagements-api/supplier-risk-engagements-api
*/

entity SupplierRisk_ENG_Ques: managed  {
key workspaceId                     : String(50);
key Realm                           : String(50);
    status                          : String(50);
    updatedDate                     : DateTime;
    dueDate                         : DateTime;
    sentDate                        : DateTime;
    smVendorId                      : String(50);
    questionsAndAnswers             : Composition of many SupplierRisk_ENG_Ques_QA on questionsAndAnswers.QuestionnairesQA = $self;
}
 
entity SupplierRisk_ENG_Ques_QA: cuid {
    question                        : String(5000);
    answerType                      : String(500);
    answer                          : String(5000);
    section                         : String(255);
    QuestionnairesQA                : Association to SupplierRisk_ENG_Ques;
}