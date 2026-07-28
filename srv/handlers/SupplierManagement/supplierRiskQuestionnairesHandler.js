"use strict";

const cds = require("@sap/cds");
const logger = cds.log('logger');
const utils = require("../../utils/Utils");

function _mapEntityStructureQUE(oData) {
    return {
        Realm                               : oData["Realm"],
        workspaceId                         : oData["workspaceId"],
        status                              : oData["status"] || "",
        sentDate                            : oData["sentDate"] || "1900-01-01 00:00:00",
        updatedDate                         : oData["updatedDate"] || "",
        smVendorId                          : oData["smVendorId"] || "" ,
        ProcessedStatus                     : "NP"
    };
}

function _mapEntityStructureQUEQA(oData) {
    return {
        Realm                               : oData["Realm"],
        workspaceId                         : oData["workspaceId"],
        status                              : oData["status"] || "",
        sentDate                            : oData["sentDate"] || "",
        dueDate                             : oData["dueDate"] || "",
        updatedDate                         : oData["updatedDate"] || "",
        smVendorId                          : oData["smVendorId"] || "" ,
        questionsAndAnswers                 : _maSupplierRisk_Engagements_questionsAndAnswers(oData["questionsAndAnswers"])
    };
}

function _maSupplierRisk_Engagements_questionsAndAnswers (aQuestionAnswer) {
    return aQuestionAnswer && aQuestionAnswer.map(function (oQuestionAnswer) {
        return {
            question         : oQuestionAnswer["question"] || "",
            answerType      : oQuestionAnswer["answerType"] || "",
            answer           : oQuestionAnswer["answer"] || "",
            section             : oQuestionAnswer["section"] || ""
        }
    }) || [];
}

//Amount fields in object
function _getAmountPropertiesForDataCleaning () {
    return [ ];
}
function insertDataQUE(aData, realm)  {
    return new Promise(async function(resolve, reject)    {
        logger.info(`aData in InsertData function : ${JSON.stringify(aData)}`);

        if (!aData || aData.length === 0) {
            resolve(0);
            return;
        }
        logger.info(`Processing ${aData.length} records`);
       var aCleaningProperties = _getAmountPropertiesForDataCleaning();
        
        let i=0;
        for(const oData of aData) {
            logger.info(`wordpace id off aData : ${JSON.stringify(oData['workspaceId'])}`);
            var oDataCleansed = utils.cleanData(aCleaningProperties, oData, realm);
            oDataCleansed = utils.processCustomFields(oDataCleansed);
            oDataCleansed = _mapEntityStructureQUE(oDataCleansed);
            oDataCleansed = utils.flattenTypes(oDataCleansed);

           logger.info(`aData after cleansing : ${JSON.stringify(oData)}`);

            try {
                //Select record by Unique key
                logger.info("before select from Supper Risk Questionnaires table");

                let res =  await SELECT.from ("sap.ariba.SupplierRisk_ENG_Questionnaires")
                    .where( { Realm : oDataCleansed.Realm, workspaceId : oDataCleansed.workspaceId }  ) ;

                //let questionAnser = oDataCleansed["questionsAndAnswers"];
                 //delete oDataCleansed["questionsAndAnswers"];

                 if (res.length == 0) {
                     //New record, insert
                    await INSERT .into ("sap.ariba.SupplierRisk_ENG_Questionnaires") .entries (oDataCleansed) ;
                 } else {
                     //Update existing record
                    await UPDATE ("sap.ariba.SupplierRisk_ENG_Questionnaires") .set (oDataCleansed)
                        .where( { Realm : oDataCleansed.Realm, workspaceId : oDataCleansed.workspaceId } ) ;
                 }   
                 
                logger.info("after SupplierRisk_ENG_Questionnaires insert/update ");                 
            } catch (e) {
                logger.error(`Error on inserting data in database, aborting file processing, details ${e} `);
                //abort full file
                reject(e);
                break;
            }
            //Monitoring
            i++;
            if(i%500 ==0){
                logger.info(`Upsert ${i} records`);
            }

        }
        resolve(aData.length);
    });

} // end of InsertQUE

function insertDataQUEQA(aData, realm)  {
    return new Promise(async function(resolve, reject)    {
        logger.info(`aData in InsertData function : ${JSON.stringify(aData)}`);

        if (!aData || aData.length === 0) {
            resolve(0);
            return;
        }
        logger.info(`Processing ${aData.length} records`);
       var aCleaningProperties = _getAmountPropertiesForDataCleaning();
        
        let i=0;
        for(const oData of aData) {
            logger.info(`wordpace id off aData : ${JSON.stringify(oData['workspaceId'])}`);
            var oDataCleansed = utils.cleanData(aCleaningProperties, oData, realm);
            oDataCleansed = utils.processCustomFields(oDataCleansed);
            oDataCleansed = _mapEntityStructureQUEQA(oDataCleansed);
            oDataCleansed = utils.flattenTypes(oDataCleansed);

           logger.info(`aData after cleansing : ${JSON.stringify(oData)}`);

            try {
                //Select record by Unique key
                logger.info("before select from Supper Risk Questionnaires table");

                let res =  await SELECT.from ("sap.ariba.SupplierRisk_ENG_Ques")
                    .where( { Realm : oDataCleansed.Realm, workspaceId : oDataCleansed.workspaceId }  ) ;

                let questionAnser = oDataCleansed["questionsAndAnswers"];
                logger.info(`question and answer data : ${JSON.stringify(questionAnser)}`);
                logger.info(`aData questionnaires Length : ${JSON.stringify(questionAnser.length)}`);            


                 //delete oDataCleansed["questionsAndAnswers"];

                 if (res.length == 0) {
                     //New record, insert
                    await INSERT .into ("sap.ariba.SupplierRisk_ENG_Ques") .entries (oDataCleansed) ;
                 } else {
                     //Update existing record
                    await UPDATE ("sap.ariba.SupplierRisk_ENG_Ques") .set (oDataCleansed)
                        .where( { Realm : oDataCleansed.Realm, workspaceId : oDataCleansed.workspaceId } ) ;
                 }   
                 
                logger.info("after SupplierRisk_ENG_Questionnaires insert/update ");

                 await _FullLoadQuestionAnswer(questionAnser,oDataCleansed.Realm,oDataCleansed.workspaceId);
                 
            } catch (e) {
                logger.error(`Error on inserting data in database, aborting file processing, details ${e} `);
                //abort full file
                reject(e);
                break;
            }
            //Monitoring
            i++;
            if(i%500 ==0){
                logger.info(`Upsert ${i} records`);
            }

        }
        resolve(aData.length);
    });

} // end of insertQUEQA 

async function _FullLoadQuestionAnswer( questionAnser, Realm, workspaceId ){
    return new Promise(async (resolve,reject) =>{
        //Delete old records
        try {
            await  DELETE ("sap.ariba.SupplierRisk_ENG_Ques_QA").where({
                QuestionnairesQA_Realm : Realm ,
                QuestionnairesQA_workspaceId : workspaceId
            }) ;
        logger.info(`deleteing QAs from  SupplierRisk_ENG_Ques_QA table`);
        }
        catch(e){
            logger.error(`Error on deleting from database, aborting file processing, details ${e} `);
            reject(e);
        }

        //Insert new records
        
        if(questionAnser){  
            for (const QA of questionAnser){
                try {
                    logger.info(`into insert of FullLoadQuestionAnswer `);

                    QA["QuestionnairesQA_Realm"] = Realm;
                    QA["QuestionnairesQA_workspaceId"] = workspaceId;
                    await INSERT .into ("sap.ariba.SupplierRisk_ENG_Ques_QA") .entries (QA) ;

                } catch (e) {
                    logger.error(`Error on inserting data in database, aborting file processing, details ${e} `);
                    reject(e);
                    break;
                }
            }
        }
        resolve();
    });
}

module.exports = {
    insertDataQUE,
    insertDataQUEQA
}