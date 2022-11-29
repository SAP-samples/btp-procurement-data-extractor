"use strict";

const cds = require("@sap/cds");
const logger = require("../../utils/logger");
const utils = require("../../utils/Utils");


const { Scorecard, Scorecard_Commodity, Scorecard_Region,
    Scorecard_Department} = cds.entities('sap.ariba');

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
            oDataCleansed = _FlatteningData(oDataCleansed);
            try {
                //Select record by Unique key
                let res =  await srv.run ( SELECT.from (Scorecard).where(
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

                    })
                 );

                 if(res.length==0){
                     //New record, insert
                    await srv.run( INSERT .into (Scorecard) .entries (oDataCleansed) );

                 }else{

                     let commodities = oDataCleansed["Commodity"];
                     delete oDataCleansed["Commodity"];

                     let regions = oDataCleansed["Region"];
                     delete oDataCleansed["Region"];

                     let departments = oDataCleansed["Department"];
                     delete oDataCleansed["Department"];



                     //Update existing record
                    await srv.run ( UPDATE (Scorecard) .set (oDataCleansed) .where(
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
    
                         } )
                     );

                    await _FullLoadCommodities(commodities,oDataCleansed.Realm,oDataCleansed.ScorecardId,oDataCleansed.ScorecardSourceSystem,
                        oDataCleansed.ScorecardVersionNumber,oDataCleansed.SourceSystemId,oDataCleansed.KPIId,
                        oDataCleansed.KPISourceSystem,oDataCleansed.RespondentUserSourceSystem,oDataCleansed.RespondentUserId,oDataCleansed.RespondentUserPasswordAdapter,srv);
                    await _FullLoadRegions(regions,oDataCleansed.Realm,oDataCleansed.ScorecardId,oDataCleansed.ScorecardSourceSystem,
                        oDataCleansed.ScorecardVersionNumber,oDataCleansed.SourceSystemId,oDataCleansed.KPIId,
                        oDataCleansed.KPISourceSystem,oDataCleansed.RespondentUserSourceSystem,oDataCleansed.RespondentUserId,oDataCleansed.RespondentUserPasswordAdapter,srv);
                    await _FullLoadDepartments(departments,oDataCleansed.Realm,oDataCleansed.ScorecardId,oDataCleansed.ScorecardSourceSystem,
                        oDataCleansed.ScorecardVersionNumber,oDataCleansed.SourceSystemId,oDataCleansed.KPIId,
                        oDataCleansed.KPISourceSystem,oDataCleansed.RespondentUserSourceSystem,oDataCleansed.RespondentUserId,oDataCleansed.RespondentUserPasswordAdapter,srv);
                                      
                 }

            } catch (e) {
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



async function _FullLoadCommodities(commodities,Realm,ScorecardId,ScorecardSourceSystem,
    ScorecardVersionNumber,SourceSystemId,KPIId,
    KPISourceSystem,RespondentUserSourceSystem,RespondentUserId,RespondentUserPasswordAdapter,srv){
    return new Promise(async (resolve,reject) =>{
       // const srv = cds.transaction(commodities);
        //Delete old records
        try {
            await srv.run(DELETE(SurveyResponse_Commodity).where({
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
            }));
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

                await srv.run( INSERT .into (SurveyResponse_Commodity) .entries (o) );

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
    KPISourceSystem,RespondentUserSourceSystem,RespondentUserId,RespondentUserPasswordAdapter,srv){
    return new Promise(async (resolve,reject) =>{
        //Delete old records
        try {
            await srv.run(DELETE(Scorecard_Region).where({
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
            }));
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

                await srv.run( INSERT .into (Scorecard_Region) .entries (o) );

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
    KPISourceSystem,RespondentUserSourceSystem,RespondentUserId,RespondentUserPasswordAdapter,srv){
    return new Promise(async (resolve,reject) =>{
        //Delete old records
        try {
            await srv.run(DELETE(Scorecard_Department).where({
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
            }));
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

                await srv.run( INSERT .into (Scorecard_Department) .entries (o) );

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