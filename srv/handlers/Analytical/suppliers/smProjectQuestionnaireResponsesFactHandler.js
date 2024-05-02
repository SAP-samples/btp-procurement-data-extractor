"use strict";

const cds = require("@sap/cds");
const logger = cds.log('logger');
const utils = require("../../../utils/Utils");


//Amount fields in object
function _getAmountPropertiesForDataCleaning () {
    return [
        "Value",
        "Weight",
        "Target",
        "Grade",
        "SystemGrade"
    ];
}

function _FlatteningData (oData) {
    //Structure flattening

    oData.UserId = oData.Respondent.UserId;
    oData.SurveyId = oData.Survey? oData.Survey.SurveyId : 'na'; //SAP Ariba Key own violation workaround
    oData.VersionNumber = oData.Survey? oData.Survey.VersionNumber: 9999;//SAP Ariba Key own violation workaround

    return oData;
}

function insertData(aData, realm)  {
    return new Promise(async function(resolve, reject)    {


        if (!aData || aData.length === 0) {
            resolve(0);
            return;
        }
        logger.info(`Processing ${aData.length} records`);
        var aCleaningProperties = _getAmountPropertiesForDataCleaning();
        let i=0;
        for(const oData of aData) {

            var oDataCleansed = utils.cleanData(aCleaningProperties, oData, realm);
            oDataCleansed = utils.processCustomFields(oDataCleansed);
            oDataCleansed = _FlatteningData(oDataCleansed);
            oDataCleansed = utils.removeNullValues(oDataCleansed); // for some reason, "Survey" object is causing issues when null
            oDataCleansed = utils.flattenTypes(oDataCleansed);

            try {
                //Select record by Unique key
                let res =  await SELECT.from ("sap.ariba.SMProjectQuestionnaireResponses_AN").where(
                    {
                        Realm : oDataCleansed.Realm ,
                        QuestionId : oDataCleansed.QuestionId,
                        UserId : oDataCleansed.UserId,
                        SurveyId : oDataCleansed.SurveyId,
                        VersionNumber : oDataCleansed.VersionNumber
                        
                    });

                 if(res.length==0){
                     //New record, insert
                    await INSERT .into ("sap.ariba.SMProjectQuestionnaireResponses_AN") .entries (oDataCleansed) ;

                 }else{

                     let responseCommodityValue = oDataCleansed["ResponseCommodityValue"];
                     delete oDataCleansed["ResponseCommodityValue"];

                     let responseRegionValue = oDataCleansed["ResponseRegionValue"];
                     delete oDataCleansed["ResponseRegionValue"];

                     let responseDepartmentValue = oDataCleansed["ResponseDepartmentValue"];
                     delete oDataCleansed["ResponseDepartmentValue"];

                     let responseSupplierValue = oDataCleansed["ResponseSupplierValue"];
                     delete oDataCleansed["ResponseSupplierValue"];

                     let vresponsetextmultivalue = oDataCleansed["V_responsetextmultivalue"];
                     delete oDataCleansed["V_responsetextmultivalue"];

                     //Update existing record
                    await UPDATE ("sap.ariba.SMProjectQuestionnaireResponses_AN") .set (oDataCleansed) .where(
                        {
                            Realm : oDataCleansed.Realm ,
                            QuestionId : oDataCleansed.QuestionId,
                            UserId : oDataCleansed.UserId,
                            SurveyId : oDataCleansed.SurveyId,
                            VersionNumber : oDataCleansed.VersionNumber
                        } );

                    await _FullLoadResponseCommodityValue(responseCommodityValue,oDataCleansed.Realm,oDataCleansed.QuestionId,oDataCleansed.SurveyId,oDataCleansed.VersionNumber,oDataCleansed.UserId);
                    await _FullLoadResponseRegionValue(responseRegionValue,oDataCleansed.Realm,oDataCleansed.QuestionId,oDataCleansed.SurveyId,oDataCleansed.VersionNumber,oDataCleansed.UserId);
                    await _FullLoadResponseDepartmentValue(responseDepartmentValue,oDataCleansed.Realm,oDataCleansed.QuestionId,oDataCleansed.SurveyId,oDataCleansed.VersionNumber,oDataCleansed.UserId);
                    await _FullLoadResponseSupplierValue(responseSupplierValue,oDataCleansed.Realm,oDataCleansed.QuestionId,oDataCleansed.SurveyId,oDataCleansed.VersionNumber,oDataCleansed.UserId);
                    await _FullLoadV_responsetextmultivalue(vresponsetextmultivalue,oDataCleansed.Realm,oDataCleansed.QuestionId,oDataCleansed.SurveyId,oDataCleansed.VersionNumber,oDataCleansed.UserId);

                 }

            } catch (e) {
                debugger;
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

}


async function _FullLoadResponseCommodityValue(responseCommodityValue,Realm,QuestionId,SurveyId,VersionNumber,UserId){
    return new Promise(async (resolve,reject) =>{
        //Delete old records
        try {
            await DELETE("sap.ariba.SMProjectQuestionnaireResponses_ResponseCommodityValue_AN").where({
                SMProjectQuestionnaireResponse_Realm : Realm ,
                SMProjectQuestionnaireResponse_QuestionId : QuestionId,
                SMProjectQuestionnaireResponse_UserId : UserId,
                SMProjectQuestionnaireResponse_SurveyId : SurveyId,
                SMProjectQuestionnaireResponse_VersionNumber : VersionNumber
            });
        }
        catch(e){
            logger.error(`Error on deleting from database, aborting file processing, details ${e} `);
            reject(e);
        }

        //Insert new records
        if(responseCommodityValue){
            for (const re of responseCommodityValue){
                try {
                    re["SMProjectQuestionnaireResponse_Realm"] = Realm;
                    re["SMProjectQuestionnaireResponse_QuestionId"] = QuestionId;
                    re["SMProjectQuestionnaireResponse_UserId"] = UserId;
                    re["SMProjectQuestionnaireResponse_SurveyId"] = SurveyId;
                    re["SMProjectQuestionnaireResponse_VersionNumber"] = VersionNumber;
                    await INSERT .into ("sap.ariba.SMProjectQuestionnaireResponses_ResponseCommodityValue_AN") .entries (re) ;

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
async function _FullLoadResponseRegionValue(responseRegionValue,Realm,QuestionId,SurveyId,VersionNumber,UserId){
    return new Promise(async (resolve,reject) =>{
        //Delete old records
        
        try {
            await DELETE("sap.ariba.SMProjectQuestionnaireResponses_ResponseRegionValue_AN").where({
                SMProjectQuestionnaireResponse_Realm : Realm ,
                SMProjectQuestionnaireResponse_QuestionId : QuestionId,
                SMProjectQuestionnaireResponse_UserId : UserId,
                SMProjectQuestionnaireResponse_SurveyId : SurveyId,
                SMProjectQuestionnaireResponse_VersionNumber : VersionNumber
            });
        }
        catch(e){
            logger.error(`Error on deleting from database, aborting file processing, details ${e} `);
            reject(e);
        }
        if(responseRegionValue){
            //Insert new records
            for (const re of responseRegionValue){
                try {
                    re["SMProjectQuestionnaireResponse_Realm"] = Realm;
                    re["SMProjectQuestionnaireResponse_QuestionId"] = QuestionId;
                    re["SMProjectQuestionnaireResponse_UserId"] = UserId;
                    re["SMProjectQuestionnaireResponse_SurveyId"] = SurveyId;
                    re["SMProjectQuestionnaireResponse_VersionNumber"] = VersionNumber;
                    await INSERT .into ("sap.ariba.SMProjectQuestionnaireResponses_ResponseRegionValue_AN") .entries (re) ;

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
async function _FullLoadResponseDepartmentValue(responseDepartmentValue,Realm,QuestionId,SurveyId,VersionNumber,UserId){
    return new Promise(async (resolve,reject) =>{
        //Delete old records
        
        try {
            await DELETE("sap.ariba.SMProjectQuestionnaireResponses_ResponseDepartmentValue_AN").where({
                SMProjectQuestionnaireResponse_Realm : Realm ,
                SMProjectQuestionnaireResponse_QuestionId : QuestionId,
                SMProjectQuestionnaireResponse_UserId : UserId,
                SMProjectQuestionnaireResponse_SurveyId : SurveyId,
                SMProjectQuestionnaireResponse_VersionNumber : VersionNumber
            });
        }
        catch(e){
            logger.error(`Error on deleting from database, aborting file processing, details ${e} `);
            reject(e);
        }
        if(responseDepartmentValue){
            //Insert new records
            for (const re of responseDepartmentValue){
                try {
                    re["SMProjectQuestionnaireResponse_Realm"] = Realm;
                    re["SMProjectQuestionnaireResponse_QuestionId"] = QuestionId;
                    re["SMProjectQuestionnaireResponse_UserId"] = UserId;
                    re["SMProjectQuestionnaireResponse_SurveyId"] = SurveyId;
                    re["SMProjectQuestionnaireResponse_VersionNumber"] = VersionNumber;
                    await INSERT .into ("sap.ariba.SMProjectQuestionnaireResponses_ResponseDepartmentValue_AN") .entries (re) ;

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
async function _FullLoadResponseSupplierValue(responseSupplierValue,Realm,QuestionId,SurveyId,VersionNumber,UserId){
    return new Promise(async (resolve,reject) =>{
        //Delete old records
        try {
            await DELETE("sap.ariba.SMProjectQuestionnaireResponses_ResponseSupplierValue_AN").where({
                SMProjectQuestionnaireResponse_Realm : Realm ,
                SMProjectQuestionnaireResponse_QuestionId : QuestionId,
                SMProjectQuestionnaireResponse_UserId : UserId,
                SMProjectQuestionnaireResponse_SurveyId : SurveyId,
                SMProjectQuestionnaireResponse_VersionNumber : VersionNumber
            });
        }
        catch(e){
            logger.error(`Error on deleting from database, aborting file processing, details ${e} `);
            reject(e);
        }
        if(responseSupplierValue){
        //Insert new records
            for (const re of responseSupplierValue){
                try {
                    re["SMProjectQuestionnaireResponse_Realm"] = Realm;
                    re["SMProjectQuestionnaireResponse_QuestionId"] = QuestionId;
                    re["SMProjectQuestionnaireResponse_UserId"] = UserId;
                    re["SMProjectQuestionnaireResponse_SurveyId"] = SurveyId;
                    re["SMProjectQuestionnaireResponse_VersionNumber"] = VersionNumber;
                    await INSERT .into ("sap.ariba.SMProjectQuestionnaireResponses_ResponseSupplierValue_AN") .entries (re) ;

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
async function _FullLoadV_responsetextmultivalue(vresponsetextmultivalue,Realm,QuestionId,SurveyId,VersionNumber,UserId){
    return new Promise(async (resolve,reject) =>{
        //Delete old records
        
        try {
            await DELETE("sap.ariba.SMProjectQuestionnaireResponses_V_responsetextmultivalue_AN").where({
                SMProjectQuestionnaireResponse_Realm : Realm ,
                SMProjectQuestionnaireResponse_QuestionId : QuestionId,
                SMProjectQuestionnaireResponse_UserId : UserId,
                SMProjectQuestionnaireResponse_SurveyId : SurveyId,
                SMProjectQuestionnaireResponse_VersionNumber : VersionNumber
            });
        }
        catch(e){
            logger.error(`Error on deleting from database, aborting file processing, details ${e} `);
            reject(e);
        }
        if(vresponsetextmultivalue){
            //Insert new records
            for (const re of vresponsetextmultivalue){
                try {
                    re["SMProjectQuestionnaireResponse_Realm"] = Realm;
                    re["SMProjectQuestionnaireResponse_QuestionId"] = QuestionId;
                    re["SMProjectQuestionnaireResponse_UserId"] = UserId;
                    re["SMProjectQuestionnaireResponse_SurveyId"] = SurveyId;
                    re["SMProjectQuestionnaireResponse_VersionNumber"] = VersionNumber;
                    await INSERT .into ("sap.ariba.SMProjectQuestionnaireResponses_V_responsetextmultivalue_AN") .entries (re) ;

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