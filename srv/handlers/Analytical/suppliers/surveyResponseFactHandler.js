"use strict";

const cds = require("@sap/cds");
const logger = cds.log('logger');
const utils = require("../../../utils/Utils");


//Amount fields in object
function _getAmountPropertiesForDataCleaning () {
    return [
    ];
}

function _FlatteningData (oData) {

    //Structure flattening
    oData.SurveyId = oData.Survey.SurveyId;
    oData.SurveySourceSystem = oData.Survey.SourceSystem;
    oData.SurveyVersionNumber = oData.Survey.VersionNumber;
    
    oData.RespondentUserId = oData.Respondent.UserId;
    oData.RespondentPasswordAdapter = oData.Respondent.PasswordAdapter;
    oData.RespondentSourceSystem = oData.Respondent.SourceSystem;
    oData.QuestionId = oData.Question.QuestionId;
    oData.QuestionSourceSystem = oData.Question.SourceSystem;
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
            oDataCleansed = _FlatteningData(oDataCleansed);
            //Analytical output cleansing (╯°□°）╯︵ ┻━┻            
            oDataCleansed = utils.removeNullValues(oDataCleansed);
            oDataCleansed = utils.flattenTypes(oDataCleansed);

            try {
                //Select record by Unique key
                let res =  await SELECT.from ("sap.ariba.SurveyResponse_AN").where(
                    {
                        Realm : oDataCleansed.Realm ,
                        SurveyId : oDataCleansed.SurveyId,
                        SurveySourceSystem : oDataCleansed.SurveySourceSystem,
                        SurveyVersionNumber : oDataCleansed.SurveyVersionNumber,
                        RespondentUserId : oDataCleansed.RespondentUserId,
                        RespondentPasswordAdapter : oDataCleansed.RespondentPasswordAdapter,
                        RespondentSourceSystem : oDataCleansed.RespondentSourceSystem,
                        QuestionId : oDataCleansed.QuestionId,
                        QuestionSourceSystem : oDataCleansed.QuestionSourceSystem

                    });

                 if(res.length==0){
                     //New record, insert
                    await INSERT .into ("sap.ariba.SurveyResponse_AN") .entries (oDataCleansed) ;

                 }else{

                     let commodities = oDataCleansed["Commodity"]?oDataCleansed["Commodity"]:[];
                     delete oDataCleansed["Commodity"];

                     let regions = oDataCleansed["Region"]?oDataCleansed["Region"]:[];
                     delete oDataCleansed["Region"];

                     let departments = oDataCleansed["Department"]?oDataCleansed["Department"]:[]
                     delete oDataCleansed["Department"];

                     let responseCommodityValues = oDataCleansed["ResponseCommodityValue"]?oDataCleansed["ResponseCommodityValue"]:[];
                     delete oDataCleansed["ResponseCommodityValue"];

                     let responseRegionValues = oDataCleansed["ResponseRegionValue"]?oDataCleansed["ResponseRegionValue"]:[];
                     delete oDataCleansed["ResponseRegionValue"];

                     let responseDepartmentValues = oDataCleansed["ResponseDepartmentValue"]?oDataCleansed["ResponseDepartmentValue"]:[];
                     delete oDataCleansed["ResponseDepartmentValue"];

                     let responseSupplierValues = oDataCleansed["ResponseSupplierValue"]?oDataCleansed["ResponseSupplierValue"]:[];
                     delete oDataCleansed["ResponseSupplierValue"];

                     let responseUserValues = oDataCleansed["ResponseUserValue"]?oDataCleansed["ResponseUserValue"]:[];
                     delete oDataCleansed["ResponseUserValue"];

                     let v_responsetextmultivalues = oDataCleansed["V_responsetextmultivalue"]?oDataCleansed["V_responsetextmultivalue"]:[];
                     delete oDataCleansed["V_responsetextmultivalue"];


                     //Update existing record
                    await UPDATE ("sap.ariba.SurveyResponse_AN") .set (oDataCleansed) .where(
                        {
                            Realm : oDataCleansed.Realm ,
                            SurveyId : oDataCleansed.SurveyId,
                            SurveySourceSystem : oDataCleansed.SurveySourceSystem,
                            SurveyVersionNumber : oDataCleansed.SurveyVersionNumber,
                            RespondentUserId : oDataCleansed.RespondentUserId,
                            RespondentPasswordAdapter : oDataCleansed.RespondentPasswordAdapter,
                            RespondentSourceSystem : oDataCleansed.RespondentSourceSystem,
                            QuestionId : oDataCleansed.QuestionId,
                            QuestionSourceSystem : oDataCleansed.QuestionSourceSystem
    
                         } );

                    await _FullLoadCommodities(commodities,oDataCleansed.Realm,oDataCleansed.SurveyId,oDataCleansed.SurveySourceSystem,
                        oDataCleansed.SurveyVersionNumber,oDataCleansed.RespondentUserId,oDataCleansed.RespondentPasswordAdapter,
                        oDataCleansed.RespondentSourceSystem,oDataCleansed.QuestionId,oDataCleansed.QuestionSourceSystem);
                    await _FullLoadRegions(regions,oDataCleansed.Realm,oDataCleansed.SurveyId,oDataCleansed.SurveySourceSystem,
                            oDataCleansed.SurveyVersionNumber,oDataCleansed.RespondentUserId,oDataCleansed.RespondentPasswordAdapter,
                            oDataCleansed.RespondentSourceSystem,oDataCleansed.QuestionId,oDataCleansed.QuestionSourceSystem);
                    await _FullLoadDepartments(departments,oDataCleansed.Realm,oDataCleansed.SurveyId,oDataCleansed.SurveySourceSystem,
                        oDataCleansed.SurveyVersionNumber,oDataCleansed.RespondentUserId,oDataCleansed.RespondentPasswordAdapter,
                        oDataCleansed.RespondentSourceSystem,oDataCleansed.QuestionId,oDataCleansed.QuestionSourceSystem);
                    await _FullLoadResponseCommodityValue(responseCommodityValues,oDataCleansed.Realm,oDataCleansed.SurveyId,oDataCleansed.SurveySourceSystem,
                        oDataCleansed.SurveyVersionNumber,oDataCleansed.RespondentUserId,oDataCleansed.RespondentPasswordAdapter,
                        oDataCleansed.RespondentSourceSystem,oDataCleansed.QuestionId,oDataCleansed.QuestionSourceSystem);
                    await _FullLoadResponseRegionValue(responseRegionValues,oDataCleansed.Realm,oDataCleansed.SurveyId,oDataCleansed.SurveySourceSystem,
                        oDataCleansed.SurveyVersionNumber,oDataCleansed.RespondentUserId,oDataCleansed.RespondentPasswordAdapter,
                        oDataCleansed.RespondentSourceSystem,oDataCleansed.QuestionId,oDataCleansed.QuestionSourceSystem);
                    await _FullLoadResponseDepartmentValue(responseDepartmentValues,oDataCleansed.Realm,oDataCleansed.SurveyId,oDataCleansed.SurveySourceSystem,
                        oDataCleansed.SurveyVersionNumber,oDataCleansed.RespondentUserId,oDataCleansed.RespondentPasswordAdapter,
                        oDataCleansed.RespondentSourceSystem,oDataCleansed.QuestionId,oDataCleansed.QuestionSourceSystem);
                    await _FullLoadResponseSupplierValue(responseSupplierValues,oDataCleansed.Realm,oDataCleansed.SurveyId,oDataCleansed.SurveySourceSystem,
                        oDataCleansed.SurveyVersionNumber,oDataCleansed.RespondentUserId,oDataCleansed.RespondentPasswordAdapter,
                        oDataCleansed.RespondentSourceSystem,oDataCleansed.QuestionId,oDataCleansed.QuestionSourceSystem);
                    await _FullLoadResponseUserValue(responseUserValues,oDataCleansed.Realm,oDataCleansed.SurveyId,oDataCleansed.SurveySourceSystem,
                        oDataCleansed.SurveyVersionNumber,oDataCleansed.RespondentUserId,oDataCleansed.RespondentPasswordAdapter,
                        oDataCleansed.RespondentSourceSystem,oDataCleansed.QuestionId,oDataCleansed.QuestionSourceSystem);
                    await _FullLoadV_responsetextmultivalue(v_responsetextmultivalues,oDataCleansed.Realm,oDataCleansed.SurveyId,oDataCleansed.SurveySourceSystem,
                        oDataCleansed.SurveyVersionNumber,oDataCleansed.RespondentUserId,oDataCleansed.RespondentPasswordAdapter,
                        oDataCleansed.RespondentSourceSystem,oDataCleansed.QuestionId,oDataCleansed.QuestionSourceSystem);
                        
                 }

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

}



async function _FullLoadCommodities(commodities,Realm,SurveyId,SurveySourceSystem,SurveyVersionNumber,RespondentUserId,RespondentPasswordAdapter,
    RespondentSourceSystem,QuestionId,QuestionSourceSystem){
    return new Promise(async (resolve,reject) =>{
        //Delete old records
        try {
            await DELETE("sap.ariba.SurveyResponse_Commodity_AN").where({
                SurveyResponse_Realm : Realm ,
                SurveyResponse_SurveyId : SurveyId,
                SurveyResponse_SurveySourceSystem : SurveySourceSystem,
                SurveyResponse_SurveyVersionNumber : SurveyVersionNumber,
                SurveyResponse_RespondentUserId : RespondentUserId,
                SurveyResponse_RespondentPasswordAdapter : RespondentPasswordAdapter,
                SurveyResponse_RespondentSourceSystem : RespondentSourceSystem,
                SurveyResponse_QuestionId : QuestionId,
                SurveyResponse_QuestionSourceSystem : QuestionSourceSystem
            });
        }
        catch(e){
            logger.error(`Error on deleting from database, aborting file processing, details ${e} `);
            reject(e);
        }

        //Insert new records
        for (const o of commodities){
            try {

                o["SurveyResponse_Realm"] = Realm;
                o["SurveyResponse_SurveyId"] = SurveyId;
                o["SurveyResponse_SurveySourceSystem"] = SurveySourceSystem;
                o["SurveyResponse_SurveyVersionNumber"] = SurveyVersionNumber;
                o["SurveyResponse_RespondentUserId"] = RespondentUserId;
                o["SurveyResponse_RespondentPasswordAdapter"] = RespondentPasswordAdapter;
                o["SurveyResponse_RespondentSourceSystem"] = RespondentSourceSystem;
                o["SurveyResponse_QuestionId"] = QuestionId;
                o["SurveyResponse_QuestionSourceSystem"] = QuestionSourceSystem;

                await INSERT .into ("sap.ariba.SurveyResponse_Commodity_AN") .entries (o) ;

            } catch (e) {
                logger.error(`Error on inserting data in database, aborting file processing, details ${e} `);
                reject(e);
                break;
            }
        }
        resolve();
    });
}

async function _FullLoadRegions(regions,Realm,SurveyId,SurveySourceSystem,SurveyVersionNumber,RespondentUserId,RespondentPasswordAdapter,
    RespondentSourceSystem,QuestionId,QuestionSourceSystem){
    return new Promise(async (resolve,reject) =>{
        //Delete old records
        try {
            await DELETE("sap.ariba.SurveyResponse_Region_AN").where({
                SurveyResponse_Realm : Realm ,
                SurveyResponse_SurveyId : SurveyId,
                SurveyResponse_SurveySourceSystem : SurveySourceSystem,
                SurveyResponse_SurveyVersionNumber : SurveyVersionNumber,
                SurveyResponse_RespondentUserId : RespondentUserId,
                SurveyResponse_RespondentPasswordAdapter : RespondentPasswordAdapter,
                SurveyResponse_RespondentSourceSystem : RespondentSourceSystem,
                SurveyResponse_QuestionId : QuestionId,
                SurveyResponse_QuestionSourceSystem : QuestionSourceSystem
            });
        }
        catch(e){
            logger.error(`Error on deleting from database, aborting file processing, details ${e} `);
            reject(e);
        }

        //Insert new records
        for (const o of regions){
            try {

                o["SurveyResponse_Realm"] = Realm;
                o["SurveyResponse_SurveyId"] = SurveyId;
                o["SurveyResponse_SurveySourceSystem"] = SurveySourceSystem;
                o["SurveyResponse_SurveyVersionNumber"] = SurveyVersionNumber;
                o["SurveyResponse_RespondentUserId"] = RespondentUserId;
                o["SurveyResponse_RespondentPasswordAdapter"] = RespondentPasswordAdapter;
                o["SurveyResponse_RespondentSourceSystem"] = RespondentSourceSystem;
                o["SurveyResponse_QuestionId"] = QuestionId;
                o["SurveyResponse_QuestionSourceSystem"] = QuestionSourceSystem;

                await sINSERT .into ("sap.ariba.SurveyResponse_Region_AN") .entries (o) ;

            } catch (e) {
                logger.error(`Error on inserting data in database, aborting file processing, details ${e} `);
                reject(e);
                break;
            }
        }
        resolve();
    });
}


async function _FullLoadDepartments(departments,Realm,SurveyId,SurveySourceSystem,SurveyVersionNumber,RespondentUserId,RespondentPasswordAdapter,
    RespondentSourceSystem,QuestionId,QuestionSourceSystem){
    return new Promise(async (resolve,reject) =>{
        //Delete old records
        try {
            await DELETE("sap.ariba.SurveyResponse_Department_AN").where({
                SurveyResponse_Realm : Realm ,
                SurveyResponse_SurveyId : SurveyId,
                SurveyResponse_SurveySourceSystem : SurveySourceSystem,
                SurveyResponse_SurveyVersionNumber : SurveyVersionNumber,
                SurveyResponse_RespondentUserId : RespondentUserId,
                SurveyResponse_RespondentPasswordAdapter : RespondentPasswordAdapter,
                SurveyResponse_RespondentSourceSystem : RespondentSourceSystem,
                SurveyResponse_QuestionId : QuestionId,
                SurveyResponse_QuestionSourceSystem : QuestionSourceSystem
            });
        }
        catch(e){
            logger.error(`Error on deleting from database, aborting file processing, details ${e} `);
            reject(e);
        }

        //Insert new records
        for (const o of departments){
            try {

                o["SurveyResponse_Realm"] = Realm;
                o["SurveyResponse_SurveyId"] = SurveyId;
                o["SurveyResponse_SurveySourceSystem"] = SurveySourceSystem;
                o["SurveyResponse_SurveyVersionNumber"] = SurveyVersionNumber;
                o["SurveyResponse_RespondentUserId"] = RespondentUserId;
                o["SurveyResponse_RespondentPasswordAdapter"] = RespondentPasswordAdapter;
                o["SurveyResponse_RespondentSourceSystem"] = RespondentSourceSystem;
                o["SurveyResponse_QuestionId"] = QuestionId;
                o["SurveyResponse_QuestionSourceSystem"] = QuestionSourceSystem;

                await INSERT .into ("sap.ariba.SurveyResponse_Department_AN") .entries (o) ;

            } catch (e) {
                logger.error(`Error on inserting data in database, aborting file processing, details ${e} `);
                reject(e);
                break;
            }
        }
        resolve();
    });
}


async function _FullLoadResponseCommodityValue(responseCommodityValues,Realm,SurveyId,SurveySourceSystem,SurveyVersionNumber,RespondentUserId,RespondentPasswordAdapter,
    RespondentSourceSystem,QuestionId,QuestionSourceSystem){
    return new Promise(async (resolve,reject) =>{
        //Delete old records
        try {
            await DELETE("sap.ariba.SurveyResponse_ResponseCommodityValue_AN").where({
                SurveyResponse_Realm : Realm ,
                SurveyResponse_SurveyId : SurveyId,
                SurveyResponse_SurveySourceSystem : SurveySourceSystem,
                SurveyResponse_SurveyVersionNumber : SurveyVersionNumber,
                SurveyResponse_RespondentUserId : RespondentUserId,
                SurveyResponse_RespondentPasswordAdapter : RespondentPasswordAdapter,
                SurveyResponse_RespondentSourceSystem : RespondentSourceSystem,
                SurveyResponse_QuestionId : QuestionId,
                SurveyResponse_QuestionSourceSystem : QuestionSourceSystem
            });
        }
        catch(e){
            logger.error(`Error on deleting from database, aborting file processing, details ${e} `);
            reject(e);
        }

        //Insert new records
        for (const o of responseCommodityValues){
            try {

                o["SurveyResponse_Realm"] = Realm;
                o["SurveyResponse_SurveyId"] = SurveyId;
                o["SurveyResponse_SurveySourceSystem"] = SurveySourceSystem;
                o["SurveyResponse_SurveyVersionNumber"] = SurveyVersionNumber;
                o["SurveyResponse_RespondentUserId"] = RespondentUserId;
                o["SurveyResponse_RespondentPasswordAdapter"] = RespondentPasswordAdapter;
                o["SurveyResponse_RespondentSourceSystem"] = RespondentSourceSystem;
                o["SurveyResponse_QuestionId"] = QuestionId;
                o["SurveyResponse_QuestionSourceSystem"] = QuestionSourceSystem;

                await INSERT .into ("sap.ariba.SurveyResponse_ResponseCommodityValue_AN") .entries (o) ;

            } catch (e) {
                logger.error(`Error on inserting data in database, aborting file processing, details ${e} `);
                reject(e);
                break;
            }
        }
        resolve();
    });
}


async function _FullLoadResponseRegionValue(responseRegionValue,Realm,SurveyId,SurveySourceSystem,SurveyVersionNumber,RespondentUserId,RespondentPasswordAdapter,
    RespondentSourceSystem,QuestionId,QuestionSourceSystem){
    return new Promise(async (resolve,reject) =>{
        //Delete old records
        try {
            await DELETE("sap.ariba.SurveyResponse_ResponseRegionValue_AN").where({
                SurveyResponse_Realm : Realm ,
                SurveyResponse_SurveyId : SurveyId,
                SurveyResponse_SurveySourceSystem : SurveySourceSystem,
                SurveyResponse_SurveyVersionNumber : SurveyVersionNumber,
                SurveyResponse_RespondentUserId : RespondentUserId,
                SurveyResponse_RespondentPasswordAdapter : RespondentPasswordAdapter,
                SurveyResponse_RespondentSourceSystem : RespondentSourceSystem,
                SurveyResponse_QuestionId : QuestionId,
                SurveyResponse_QuestionSourceSystem : QuestionSourceSystem
            });
        }
        catch(e){
            logger.error(`Error on deleting from database, aborting file processing, details ${e} `);
            reject(e);
        }

        //Insert new records
        for (const o of responseRegionValue){
            try {

                o["SurveyResponse_Realm"] = Realm;
                o["SurveyResponse_SurveyId"] = SurveyId;
                o["SurveyResponse_SurveySourceSystem"] = SurveySourceSystem;
                o["SurveyResponse_SurveyVersionNumber"] = SurveyVersionNumber;
                o["SurveyResponse_RespondentUserId"] = RespondentUserId;
                o["SurveyResponse_RespondentPasswordAdapter"] = RespondentPasswordAdapter;
                o["SurveyResponse_RespondentSourceSystem"] = RespondentSourceSystem;
                o["SurveyResponse_QuestionId"] = QuestionId;
                o["SurveyResponse_QuestionSourceSystem"] = QuestionSourceSystem;

                await INSERT .into ("sap.ariba.SurveyResponse_ResponseRegionValue_AN") .entries (o) ;

            } catch (e) {
                logger.error(`Error on inserting data in database, aborting file processing, details ${e} `);
                reject(e);
                break;
            }
        }
        resolve();
    });
}


async function _FullLoadResponseDepartmentValue(responseDepartmentValue,Realm,SurveyId,SurveySourceSystem,SurveyVersionNumber,RespondentUserId,RespondentPasswordAdapter,
    RespondentSourceSystem,QuestionId,QuestionSourceSystem){
    return new Promise(async (resolve,reject) =>{
        //Delete old records
        try {
            await DELETE("sap.ariba.SurveyResponse_ResponseDepartmentValue_AN").where({
                SurveyResponse_Realm : Realm ,
                SurveyResponse_SurveyId : SurveyId,
                SurveyResponse_SurveySourceSystem : SurveySourceSystem,
                SurveyResponse_SurveyVersionNumber : SurveyVersionNumber,
                SurveyResponse_RespondentUserId : RespondentUserId,
                SurveyResponse_RespondentPasswordAdapter : RespondentPasswordAdapter,
                SurveyResponse_RespondentSourceSystem : RespondentSourceSystem,
                SurveyResponse_QuestionId : QuestionId,
                SurveyResponse_QuestionSourceSystem : QuestionSourceSystem
            });
        }
        catch(e){
            logger.error(`Error on deleting from database, aborting file processing, details ${e} `);
            reject(e);
        }

        //Insert new records
        for (const o of responseDepartmentValue){
            try {

                o["SurveyResponse_Realm"] = Realm;
                o["SurveyResponse_SurveyId"] = SurveyId;
                o["SurveyResponse_SurveySourceSystem"] = SurveySourceSystem;
                o["SurveyResponse_SurveyVersionNumber"] = SurveyVersionNumber;
                o["SurveyResponse_RespondentUserId"] = RespondentUserId;
                o["SurveyResponse_RespondentPasswordAdapter"] = RespondentPasswordAdapter;
                o["SurveyResponse_RespondentSourceSystem"] = RespondentSourceSystem;
                o["SurveyResponse_QuestionId"] = QuestionId;
                o["SurveyResponse_QuestionSourceSystem"] = QuestionSourceSystem;

                await INSERT .into ("sap.ariba.SurveyResponse_ResponseDepartmentValue_AN") .entries (o) ;

            } catch (e) {
                logger.error(`Error on inserting data in database, aborting file processing, details ${e} `);
                reject(e);
                break;
            }
        }
        resolve();
    });
}

async function _FullLoadResponseSupplierValue(responseSupplierValue,Realm,SurveyId,SurveySourceSystem,SurveyVersionNumber,RespondentUserId,RespondentPasswordAdapter,
    RespondentSourceSystem,QuestionId,QuestionSourceSystem){
    return new Promise(async (resolve,reject) =>{
        //Delete old records
        try {
            await DELETE("sap.ariba.SurveyResponse_ResponseSupplierValue_AN").where({
                SurveyResponse_Realm : Realm ,
                SurveyResponse_SurveyId : SurveyId,
                SurveyResponse_SurveySourceSystem : SurveySourceSystem,
                SurveyResponse_SurveyVersionNumber : SurveyVersionNumber,
                SurveyResponse_RespondentUserId : RespondentUserId,
                SurveyResponse_RespondentPasswordAdapter : RespondentPasswordAdapter,
                SurveyResponse_RespondentSourceSystem : RespondentSourceSystem,
                SurveyResponse_QuestionId : QuestionId,
                SurveyResponse_QuestionSourceSystem : QuestionSourceSystem
            });
        }
        catch(e){
            logger.error(`Error on deleting from database, aborting file processing, details ${e} `);
            reject(e);
        }

        //Insert new records
        for (const o of responseSupplierValue){
            try {

                o["SurveyResponse_Realm"] = Realm;
                o["SurveyResponse_SurveyId"] = SurveyId;
                o["SurveyResponse_SurveySourceSystem"] = SurveySourceSystem;
                o["SurveyResponse_SurveyVersionNumber"] = SurveyVersionNumber;
                o["SurveyResponse_RespondentUserId"] = RespondentUserId;
                o["SurveyResponse_RespondentPasswordAdapter"] = RespondentPasswordAdapter;
                o["SurveyResponse_RespondentSourceSystem"] = RespondentSourceSystem;
                o["SurveyResponse_QuestionId"] = QuestionId;
                o["SurveyResponse_QuestionSourceSystem"] = QuestionSourceSystem;

                await INSERT .into ("sap.ariba.SurveyResponse_ResponseSupplierValue_AN") .entries (o) ;

            } catch (e) {
                logger.error(`Error on inserting data in database, aborting file processing, details ${e} `);
                reject(e);
                break;
            }
        }
        resolve();
    });
}

async function _FullLoadResponseUserValue(responseUserValue,Realm,SurveyId,SurveySourceSystem,SurveyVersionNumber,RespondentUserId,RespondentPasswordAdapter,
    RespondentSourceSystem,QuestionId,QuestionSourceSystem){
    return new Promise(async (resolve,reject) =>{
        //Delete old records
        try {
            await DELETE("sap.ariba.SurveyResponse_ResponseUserValue_AN").where({
                SurveyResponse_Realm : Realm ,
                SurveyResponse_SurveyId : SurveyId,
                SurveyResponse_SurveySourceSystem : SurveySourceSystem,
                SurveyResponse_SurveyVersionNumber : SurveyVersionNumber,
                SurveyResponse_RespondentUserId : RespondentUserId,
                SurveyResponse_RespondentPasswordAdapter : RespondentPasswordAdapter,
                SurveyResponse_RespondentSourceSystem : RespondentSourceSystem,
                SurveyResponse_QuestionId : QuestionId,
                SurveyResponse_QuestionSourceSystem : QuestionSourceSystem
            });
        }
        catch(e){
            logger.error(`Error on deleting from database, aborting file processing, details ${e} `);
            reject(e);
        }

        //Insert new records
        for (const o of responseUserValue){
            try {

                o["SurveyResponse_Realm"] = Realm;
                o["SurveyResponse_SurveyId"] = SurveyId;
                o["SurveyResponse_SurveySourceSystem"] = SurveySourceSystem;
                o["SurveyResponse_SurveyVersionNumber"] = SurveyVersionNumber;
                o["SurveyResponse_RespondentUserId"] = RespondentUserId;
                o["SurveyResponse_RespondentPasswordAdapter"] = RespondentPasswordAdapter;
                o["SurveyResponse_RespondentSourceSystem"] = RespondentSourceSystem;
                o["SurveyResponse_QuestionId"] = QuestionId;
                o["SurveyResponse_QuestionSourceSystem"] = QuestionSourceSystem;

                await INSERT .into ("sap.ariba.SurveyResponse_ResponseUserValue_AN") .entries (o);

            } catch (e) {
                logger.error(`Error on inserting data in database, aborting file processing, details ${e} `);
                reject(e);
                break;
            }
        }
        resolve();
    });
}

async function _FullLoadV_responsetextmultivalue(v_responsetextmultivalue,Realm,SurveyId,SurveySourceSystem,SurveyVersionNumber,RespondentUserId,RespondentPasswordAdapter,
    RespondentSourceSystem,QuestionId,QuestionSourceSystem){
    return new Promise(async (resolve,reject) =>{
        //Delete old records
        try {
            await DELETE("sap.ariba.SurveyResponse_V_responsetextmultivalue_AN").where({
                SurveyResponse_Realm : Realm ,
                SurveyResponse_SurveyId : SurveyId,
                SurveyResponse_SurveySourceSystem : SurveySourceSystem,
                SurveyResponse_SurveyVersionNumber : SurveyVersionNumber,
                SurveyResponse_RespondentUserId : RespondentUserId,
                SurveyResponse_RespondentPasswordAdapter : RespondentPasswordAdapter,
                SurveyResponse_RespondentSourceSystem : RespondentSourceSystem,
                SurveyResponse_QuestionId : QuestionId,
                SurveyResponse_QuestionSourceSystem : QuestionSourceSystem
            });
        }
        catch(e){
            logger.error(`Error on deleting from database, aborting file processing, details ${e} `);
            reject(e);
        }

        //Insert new records
        for (const o of v_responsetextmultivalue){
            try {

                o["SurveyResponse_Realm"] = Realm;
                o["SurveyResponse_SurveyId"] = SurveyId;
                o["SurveyResponse_SurveySourceSystem"] = SurveySourceSystem;
                o["SurveyResponse_SurveyVersionNumber"] = SurveyVersionNumber;
                o["SurveyResponse_RespondentUserId"] = RespondentUserId;
                o["SurveyResponse_RespondentPasswordAdapter"] = RespondentPasswordAdapter;
                o["SurveyResponse_RespondentSourceSystem"] = RespondentSourceSystem;
                o["SurveyResponse_QuestionId"] = QuestionId;
                o["SurveyResponse_QuestionSourceSystem"] = QuestionSourceSystem;

                await INSERT .into ("sap.ariba.SurveyResponse_V_responsetextmultivalue_AN") .entries (o);

            } catch (e) {
                logger.error(`Error on inserting data in database, aborting file processing, details ${e} `);
                reject(e);
                break;
            }
        }
        resolve();
    });
}

module.exports = {
    insertData
}