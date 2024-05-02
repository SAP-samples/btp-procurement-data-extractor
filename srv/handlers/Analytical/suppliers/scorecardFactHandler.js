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
    oData.ScorecardId = oData.Scorecard.ScorecardId;
    oData.ScorecardSourceSystem = oData.Scorecard.SourceSystem;
    oData.ScorecardVersionNumber = oData.Scorecard.VersionNumber;
    oData.SourceSystemId = oData.SourceSystem.SourceSystemId;
    
    oData.KPIId = oData.KPI.KPIId;
    oData.KPISourceSystem = oData.KPI.SourceSystem;
    oData.RespondentUserId = oData.RespondentUser.UserId;
    oData.RespondentUserPasswordAdapter = oData.RespondentUser.PasswordAdapter;
    oData.RespondentUserSourceSystem = oData.RespondentUser.SourceSystem;
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
            oDataCleansed = utils.flattenTypes(oDataCleansed);

            try {
                //Select record by Unique key
                let res =  await SELECT.from ("sap.ariba.Scorecard_AN").where(
                    {
                        Realm : oDataCleansed.Realm ,
                        ScorecardId : oDataCleansed.ScorecardId,
                        ScorecardSourceSystem : oDataCleansed.ScorecardSourceSystem,
                        ScorecardVersionNumber : oDataCleansed.ScorecardVersionNumber,
                        SourceSystemId : oDataCleansed.SourceSystemId,
                        KPIId : oDataCleansed.KPIId,
                        KPISourceSystem : oDataCleansed.KPISourceSystem,
                        RespondentUserSourceSystem : oDataCleansed.RespondentUserSourceSystem,
                        RespondentUserId : oDataCleansed.RespondentUserId,
                        RespondentUserPasswordAdapter : oDataCleansed.RespondentUserPasswordAdapter

                    });

                 if(res.length==0){
                     //New record, insert
                    await INSERT .into ("sap.ariba.Scorecard_AN") .entries (oDataCleansed) ;

                 }else{

                     let commodities = oDataCleansed["Commodity"];
                     delete oDataCleansed["Commodity"];

                     let regions = oDataCleansed["Region"];
                     delete oDataCleansed["Region"];

                     let departments = oDataCleansed["Department"];
                     delete oDataCleansed["Department"];



                     //Update existing record
                    await UPDATE ("sap.ariba.Scorecard_AN") .set (oDataCleansed) .where(
                        {
                            Realm : oDataCleansed.Realm ,
                            ScorecardId : oDataCleansed.ScorecardId,
                            ScorecardSourceSystem : oDataCleansed.ScorecardSourceSystem,
                            ScorecardVersionNumber : oDataCleansed.ScorecardVersionNumber,
                            SourceSystemId : oDataCleansed.SourceSystemId,
                            KPIId : oDataCleansed.KPIId,
                            KPISourceSystem : oDataCleansed.KPISourceSystem,
                            RespondentUserSourceSystem : oDataCleansed.RespondentUserSourceSystem,
                            RespondentUserId : oDataCleansed.RespondentUserId,
                            RespondentUserPasswordAdapter : oDataCleansed.RespondentUserPasswordAdapter
    
                         } );

                    await _FullLoadCommodities(commodities,oDataCleansed.Realm,oDataCleansed.ScorecardId,oDataCleansed.ScorecardSourceSystem,
                        oDataCleansed.ScorecardVersionNumber,oDataCleansed.SourceSystemId,oDataCleansed.KPIId,
                        oDataCleansed.KPISourceSystem,oDataCleansed.RespondentUserSourceSystem,oDataCleansed.RespondentUserId,oDataCleansed.RespondentUserPasswordAdapter);
                    await _FullLoadRegions(regions,oDataCleansed.Realm,oDataCleansed.ScorecardId,oDataCleansed.ScorecardSourceSystem,
                        oDataCleansed.ScorecardVersionNumber,oDataCleansed.SourceSystemId,oDataCleansed.KPIId,
                        oDataCleansed.KPISourceSystem,oDataCleansed.RespondentUserSourceSystem,oDataCleansed.RespondentUserId,oDataCleansed.RespondentUserPasswordAdapter);
                    await _FullLoadDepartments(departments,oDataCleansed.Realm,oDataCleansed.ScorecardId,oDataCleansed.ScorecardSourceSystem,
                        oDataCleansed.ScorecardVersionNumber,oDataCleansed.SourceSystemId,oDataCleansed.KPIId,
                        oDataCleansed.KPISourceSystem,oDataCleansed.RespondentUserSourceSystem,oDataCleansed.RespondentUserId,oDataCleansed.RespondentUserPasswordAdapter);
                                      
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



async function _FullLoadCommodities(commodities,Realm,ScorecardId,ScorecardSourceSystem,
    ScorecardVersionNumber,SourceSystemId,KPIId,
    KPISourceSystem,RespondentUserSourceSystem,RespondentUserId,RespondentUserPasswordAdapter){
    return new Promise(async (resolve,reject) =>{
        //Delete old records
        try {
            await DELETE("sap.ariba.Scorecard_Commodity_AN").where({
                Scorecard_Realm : Realm ,
                Scorecard_ScorecardId : ScorecardId,
                Scorecard_ScorecardSourceSystem : ScorecardSourceSystem,
                Scorecard_ScorecardVersionNumber : ScorecardVersionNumber,
                Scorecard_SourceSystemId : SourceSystemId,
                Scorecard_KPIId : KPIId,
                Scorecard_KPISourceSystem : KPISourceSystem,
                Scorecard_RespondentUserSourceSystem : RespondentUserSourceSystem,
                Scorecard_RespondentUserId : RespondentUserId,
                Scorecard_RespondentUserPasswordAdapter : RespondentUserPasswordAdapter
            });
        }
        catch(e){
            logger.error(`Error on deleting from database, aborting file processing, details ${e} `);
            reject(e);
        }

        //Insert new records
        for (const o of commodities){
            try {

                o["Scorecard_Realm"] = Realm;
                o["Scorecard_ScorecardId"] = ScorecardId;
                o["Scorecard_ScorecardSourceSystem"] = ScorecardSourceSystem;
                o["Scorecard_ScorecardVersionNumber"] = ScorecardVersionNumber;
                o["Scorecard_SourceSystemId"] = SourceSystemId;
                o["Scorecard_KPIId"] = KPIId;
                o["Scorecard_KPISourceSystem"] = KPISourceSystem;
                o["Scorecard_RespondentUserSourceSystem"] = RespondentUserSourceSystem;
                o["Scorecard_RespondentUserId"] = RespondentUserId;
                o["Scorecard_RespondentUserPasswordAdapter"] = RespondentUserPasswordAdapter;

                await INSERT .into ("sap.ariba.SurveyResponse_Commodity") .entries (o) ;

            } catch (e) {
                logger.error(`Error on inserting data in database, aborting file processing, details ${e} `);
                reject(e);
                break;
            }
        }
        resolve();
    });
}

async function _FullLoadRegions(regions,Realm,ScorecardId,ScorecardSourceSystem,
    ScorecardVersionNumber,SourceSystemId,KPIId,
    KPISourceSystem,RespondentUserSourceSystem,RespondentUserId,RespondentUserPasswordAdapter){
    return new Promise(async (resolve,reject) =>{
        //Delete old records
        try {
            await DELETE("sap.ariba.Scorecard_Region_AN").where({
                Scorecard_Realm : Realm ,
                Scorecard_ScorecardId : ScorecardId,
                Scorecard_ScorecardSourceSystem : ScorecardSourceSystem,
                Scorecard_ScorecardVersionNumber : ScorecardVersionNumber,
                Scorecard_SourceSystemId : SourceSystemId,
                Scorecard_KPIId : KPIId,
                Scorecard_KPISourceSystem : KPISourceSystem,
                Scorecard_RespondentUserSourceSystem : RespondentUserSourceSystem,
                Scorecard_RespondentUserId : RespondentUserId,
                Scorecard_RespondentUserPasswordAdapter : RespondentUserPasswordAdapter
            });
        }
        catch(e){
            logger.error(`Error on deleting from database, aborting file processing, details ${e} `);
            reject(e);
        }

        //Insert new records
        for (const o of regions){
            try {

                o["Scorecard_Realm"] = Realm;
                o["Scorecard_ScorecardId"] = ScorecardId;
                o["Scorecard_ScorecardSourceSystem"] = ScorecardSourceSystem;
                o["Scorecard_ScorecardVersionNumber"] = ScorecardVersionNumber;
                o["Scorecard_SourceSystemId"] = SourceSystemId;
                o["Scorecard_KPIId"] = KPIId;
                o["Scorecard_KPISourceSystem"] = KPISourceSystem;
                o["Scorecard_RespondentUserSourceSystem"] = RespondentUserSourceSystem;
                o["Scorecard_RespondentUserId"] = RespondentUserId;
                o["Scorecard_RespondentUserPasswordAdapter"] = RespondentUserPasswordAdapter;

                await INSERT .into ("sap.ariba.Scorecard_Region_AN") .entries (o) ;

            } catch (e) {
                logger.error(`Error on inserting data in database, aborting file processing, details ${e} `);
                reject(e);
                break;
            }
        }
        resolve();
    });
}


async function _FullLoadDepartments(departments,Realm,ScorecardId,ScorecardSourceSystem,
    ScorecardVersionNumber,SourceSystemId,KPIId,
    KPISourceSystem,RespondentUserSourceSystem,RespondentUserId,RespondentUserPasswordAdapter){
    return new Promise(async (resolve,reject) =>{
        //Delete old records
        try {
            await DELETE("sap.ariba.Scorecard_Department_AN").where({
                Scorecard_Realm : Realm ,
                Scorecard_ScorecardId : ScorecardId,
                Scorecard_ScorecardSourceSystem : ScorecardSourceSystem,
                Scorecard_ScorecardVersionNumber : ScorecardVersionNumber,
                Scorecard_SourceSystemId : SourceSystemId,
                Scorecard_KPIId : KPIId,
                Scorecard_KPISourceSystem : KPISourceSystem,
                Scorecard_RespondentUserSourceSystem : RespondentUserSourceSystem,
                Scorecard_RespondentUserId : RespondentUserId,
                Scorecard_RespondentUserPasswordAdapter : RespondentUserPasswordAdapter
            });
        }
        catch(e){
            logger.error(`Error on deleting from database, aborting file processing, details ${e} `);
            reject(e);
        }

        //Insert new records
        for (const o of departments){
            try {

                o["Scorecard_Realm"] = Realm;
                o["Scorecard_ScorecardId"] = ScorecardId;
                o["Scorecard_ScorecardSourceSystem"] = ScorecardSourceSystem;
                o["Scorecard_ScorecardVersionNumber"] = ScorecardVersionNumber;
                o["Scorecard_SourceSystemId"] = SourceSystemId;
                o["Scorecard_KPIId"] = KPIId;
                o["Scorecard_KPISourceSystem"] = KPISourceSystem;
                o["Scorecard_RespondentUserSourceSystem"] = RespondentUserSourceSystem;
                o["Scorecard_RespondentUserId"] = RespondentUserId;
                o["Scorecard_RespondentUserPasswordAdapter"] = RespondentUserPasswordAdapter;

                await INSERT .into ("sap.ariba.Scorecard_Department_AN") .entries (o) ;

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