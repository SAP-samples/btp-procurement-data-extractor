"use strict";

const cds = require("@sap/cds");
const logger = cds.log('logger');
const utils = require("../../utils/Utils");


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

        const srv = cds.transaction(aData);
        if (!aData || aData.length === 0) {
            resolve(0);
            return;
        }
        logger.info(`Processing ${aData.length} records`);
        var aCleaningProperties = _getAmountPropertiesForDataCleaning();
        let i=0;
        for(const oData of aData) {

            var oDataCleansed = utils.cleanData(aCleaningProperties, oData, realm);
            var oDataCleansed = utils.processCustomFields(oDataCleansed);
            var oDataCleansed = _FlatteningData(oDataCleansed);
            var oDataCleansed = utils.removeNullValues(oDataCleansed); // for some reason, "Survey" object is causing issues when null

            try {
                //Select record by Unique key
                let res =  await srv.run ( SELECT.from ("sap.ariba.SMProjectQuestionnaireResponses").where(
                    {
                        Realm : oDataCleansed.Realm ,
                        QuestionId : oDataCleansed.QuestionId,
                        UserId : oDataCleansed.UserId,
                        SurveyId : oDataCleansed.SurveyId,
                        VersionNumber : oDataCleansed.VersionNumber
                        
                    })
                 );

                 if(res.length==0){
                     //New record, insert
                    await srv.run( INSERT .into ("sap.ariba.SMProjectQuestionnaireResponses") .entries (oDataCleansed) );

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
                    await srv.run ( UPDATE ("sap.ariba.SMProjectQuestionnaireResponses") .set (oDataCleansed) .where(
                        {
                            Realm : oDataCleansed.Realm ,
                            QuestionId : oDataCleansed.QuestionId,
                            UserId : oDataCleansed.UserId,
                            SurveyId : oDataCleansed.SurveyId,
                            VersionNumber : oDataCleansed.VersionNumber
                        } )
                     );

                    await _FullLoadResponseCommodityValue(responseCommodityValue,oDataCleansed.Realm,oDataCleansed.QuestionId,oDataCleansed.SurveyId,oDataCleansed.VersionNumber,oDataCleansed.UserId,srv);
                    await _FullLoadResponseRegionValue(responseRegionValue,oDataCleansed.Realm,oDataCleansed.QuestionId,oDataCleansed.SurveyId,oDataCleansed.VersionNumber,oDataCleansed.UserId,srv);
                    await _FullLoadResponseDepartmentValue(responseDepartmentValue,oDataCleansed.Realm,oDataCleansed.QuestionId,oDataCleansed.SurveyId,oDataCleansed.VersionNumber,oDataCleansed.UserId,srv);
                    await _FullLoadResponseSupplierValue(responseSupplierValue,oDataCleansed.Realm,oDataCleansed.QuestionId,oDataCleansed.SurveyId,oDataCleansed.VersionNumber,oDataCleansed.UserId,srv);
                    await _FullLoadV_responsetextmultivalue(vresponsetextmultivalue,oDataCleansed.Realm,oDataCleansed.QuestionId,oDataCleansed.SurveyId,oDataCleansed.VersionNumber,oDataCleansed.UserId,srv);

                 }

            } catch (e) {
                debugger;
                logger.error(`Error on inserting data in database, aborting file processing, details ${e} `);
                await srv.rollback();
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
        await srv.commit();
        resolve(aData.length);
    });

}


async function _FullLoadResponseCommodityValue(responseCommodityValue,Realm,QuestionId,SurveyId,VersionNumber,UserId,srv){
    return new Promise(async (resolve,reject) =>{
       // const srv = cds.transaction(regions);
        //Delete old records
        try {
            await srv.run(DELETE("sap.ariba.SMProjectQuestionnaireResponses_ResponseCommodityValue").where({
                SMProjectQuestionnaireResponse_Realm : Realm ,
                SMProjectQuestionnaireResponse_QuestionId : QuestionId,
                SMProjectQuestionnaireResponse_UserId : UserId,
                SMProjectQuestionnaireResponse_SurveyId : SurveyId,
                SMProjectQuestionnaireResponse_VersionNumber : VersionNumber
            }));
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
                    await srv.run( INSERT .into ("sap.ariba.SMProjectQuestionnaireResponses_ResponseCommodityValue") .entries (re) );

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
async function _FullLoadResponseRegionValue(responseRegionValue,Realm,QuestionId,SurveyId,VersionNumber,UserId,srv){
    return new Promise(async (resolve,reject) =>{
       // const srv = cds.transaction(regions);
        //Delete old records
        
        try {
            await srv.run(DELETE("sap.ariba.SMProjectQuestionnaireResponses_ResponseRegionValue").where({
                SMProjectQuestionnaireResponse_Realm : Realm ,
                SMProjectQuestionnaireResponse_QuestionId : QuestionId,
                SMProjectQuestionnaireResponse_UserId : UserId,
                SMProjectQuestionnaireResponse_SurveyId : SurveyId,
                SMProjectQuestionnaireResponse_VersionNumber : VersionNumber
            }));
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
                    await srv.run( INSERT .into ("sap.ariba.SMProjectQuestionnaireResponses_ResponseRegionValue") .entries (re) );

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
async function _FullLoadResponseDepartmentValue(responseDepartmentValue,Realm,QuestionId,SurveyId,VersionNumber,UserId,srv){
    return new Promise(async (resolve,reject) =>{
       // const srv = cds.transaction(regions);
        //Delete old records
        
        try {
            await srv.run(DELETE("sap.ariba.SMProjectQuestionnaireResponses_ResponseDepartmentValue").where({
                SMProjectQuestionnaireResponse_Realm : Realm ,
                SMProjectQuestionnaireResponse_QuestionId : QuestionId,
                SMProjectQuestionnaireResponse_UserId : UserId,
                SMProjectQuestionnaireResponse_SurveyId : SurveyId,
                SMProjectQuestionnaireResponse_VersionNumber : VersionNumber
            }));
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
                    await srv.run( INSERT .into ("sap.ariba.SMProjectQuestionnaireResponses_ResponseDepartmentValue") .entries (re) );

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
async function _FullLoadResponseSupplierValue(responseSupplierValue,Realm,QuestionId,SurveyId,VersionNumber,UserId,srv){
    return new Promise(async (resolve,reject) =>{
       // const srv = cds.transaction(regions);
        //Delete old records
        try {
            await srv.run(DELETE("sap.ariba.SMProjectQuestionnaireResponses_ResponseSupplierValue").where({
                SMProjectQuestionnaireResponse_Realm : Realm ,
                SMProjectQuestionnaireResponse_QuestionId : QuestionId,
                SMProjectQuestionnaireResponse_UserId : UserId,
                SMProjectQuestionnaireResponse_SurveyId : SurveyId,
                SMProjectQuestionnaireResponse_VersionNumber : VersionNumber
            }));
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
                    await srv.run( INSERT .into ("sap.ariba.SMProjectQuestionnaireResponses_ResponseSupplierValue") .entries (re) );

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
async function _FullLoadV_responsetextmultivalue(vresponsetextmultivalue,Realm,QuestionId,SurveyId,VersionNumber,UserId,srv){
    return new Promise(async (resolve,reject) =>{
       // const srv = cds.transaction(regions);
        //Delete old records
        
        try {
            await srv.run(DELETE("sap.ariba.SMProjectQuestionnaireResponses_V_responsetextmultivalue").where({
                SMProjectQuestionnaireResponse_Realm : Realm ,
                SMProjectQuestionnaireResponse_QuestionId : QuestionId,
                SMProjectQuestionnaireResponse_UserId : UserId,
                SMProjectQuestionnaireResponse_SurveyId : SurveyId,
                SMProjectQuestionnaireResponse_VersionNumber : VersionNumber
            }));
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
                    await srv.run( INSERT .into ("sap.ariba.SMProjectQuestionnaireResponses_V_responsetextmultivalue") .entries (re) );

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