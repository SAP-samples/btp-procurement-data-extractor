"use strict";

const cds = require("@sap/cds");
const logger = cds.log('logger');
const utils = require("../../utils/Utils");

 

function _mapSupplierRiskEngRequestDetails(oData) {
    return {
        Realm                               : oData["Realm"],
        workspaceId                         : oData["workspaceId"],
        titleKey                            : oData["title"] || "",
        status                              : oData["status"] || "",
        title                               : oData["title"] || "", 
        dueDate                             : oData["dueDate"] || "1900-01-01 00:00:00",
        supplierId                          : oData["supplier.smVendorId"] || "" ,
        SupplierName                        : oData["supplier.name"] || "",
        questionsAndAnswers                 : _maSupplierRiskEngRequestDetails_QA(oData["questionsAndAnswers"])
    };
}

function _maSupplierRiskEngRequestDetails_QA (aQuestionAnswer) {
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

function insertData(aData, realm)  {
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
            oDataCleansed = _mapSupplierRiskEngRequestDetails(oDataCleansed);
            oDataCleansed = utils.flattenTypes(oDataCleansed);

           logger.info(`aData after cleansing : ${JSON.stringify(oData)}`);

            try {
                //Select record by Unique key
                logger.info("before select from Supper SupplierRiskEngRequestDetails table");

                let res =  await SELECT.from ("sap.ariba.SupplierRiskEngRequestDetails")
                    .where( { Realm : oDataCleansed.Realm, workspaceId : oDataCleansed.workspaceId, titleKey : oDataCleansed.title }  ) ;

                let questionAnser = oDataCleansed["questionsAndAnswers"];
               // logger.info(`question and answer data : ${JSON.stringify(questionAnser)}`);
               // logger.info(`aData questionnaires Length : ${JSON.stringify(questionAnser.length)}`); 

                 if (res.length == 0) {
                     //New record, insert

                    await INSERT .into ("sap.ariba.SupplierRiskEngRequestDetails") .entries (oDataCleansed) ;
                 } else {
                     //Update existing record
                    await UPDATE ("sap.ariba.SupplierRiskEngRequestDetails") .set (oDataCleansed)
                        .where( { Realm : oDataCleansed.Realm, workspaceId : oDataCleansed.workspaceId, titleKey : oDataCleansed.title } ) ;
                 }   
                 
                logger.info("after SupplierRiskEngRequestDetails insert/update ");
                
                if(questionAnser && questionAnser.length > 0)
                    await _FullLoadQuestionAnswer(questionAnser,oDataCleansed.Realm,oDataCleansed.workspaceId,oDataCleansed.title);
                 
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

async function _FullLoadQuestionAnswer( questionAnser, Realm, workspaceId, titleKey ){
    return new Promise(async (resolve,reject) =>{
        //Delete old records
        try {
            await  DELETE ("sap.ariba.SupplierRiskEngRequestDetails_QA").where({
                QuestionnairesQA_Realm : Realm ,
                QuestionnairesQA_workspaceId : workspaceId,
                QuestionnairesQA_titleKey : titleKey
            }) ;
        logger.info(`deleteing QAs from  SupplierRiskEngRequestDetails_QA table`);
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
                    QA["QuestionnairesQA_titleKey"] = titleKey;
                    await INSERT .into ("sap.ariba.SupplierRiskEngRequestDetails_QA") .entries (QA) ;

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
    insertData
}