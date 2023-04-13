"use strict";

const cds = require("@sap/cds");
const logger = cds.log('logger');
const utils = require("../../utils/Utils");


//Amount fields in object
function _getAmountPropertiesForDataCleaning () {
    return ["Duration"];
}

function _cleanData (aCleaningProperties, oData, realm) {
    aCleaningProperties && aCleaningProperties.forEach(function (oCleaningProperty) {
        oData[oCleaningProperty] = oData[oCleaningProperty] && Math.round((parseFloat(oData[oCleaningProperty]) + Number.EPSILON) * 1000) / 1000;
    });
    oData.Realm = realm;
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

            try {
                //Select record by Unique key
                let res =  await srv.run ( SELECT.from ("sap.ariba.Projects").where(
                    {
                        Realm : oDataCleansed.Realm ,
                        ProjectId : oDataCleansed.ProjectId
                    })
                 );

                if(res.length==0){
                     //New record, insert
                    await srv.run( INSERT .into ("sap.ariba.Projects") .entries (oDataCleansed) );

                } else {
                    //Update existing record


                     let allOwners = oDataCleansed["AllOwners"];
                     delete oDataCleansed["AllOwners"];

                     let commodities = oDataCleansed["Commodity"];
                     delete oDataCleansed["Commodity"];

                     let organizations = oDataCleansed["Organization"];
                     delete oDataCleansed["Organization"];

                     let regions = oDataCleansed["Region"];
                     delete oDataCleansed["Region"];

                    await srv.run ( UPDATE ("sap.ariba.Projects") .set (oDataCleansed) .where(
                        {
                            Realm : oDataCleansed.Realm ,
                            ProjectId : oDataCleansed.ProjectId
                        })
                    );

                     await _FullLoadRegions(regions, oDataCleansed.Realm, oDataCleansed.ProjectId, srv);
                     await _FullLoadOrganizations(organizations, oDataCleansed.Realm, oDataCleansed.ProjectId, srv);
                     await _FullLoadCommodities(commodities, oDataCleansed.Realm, oDataCleansed.ProjectId, srv);
                     await _FullLoadAllOwners(allOwners, oDataCleansed.Realm, oDataCleansed.ProjectId, srv);

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

async function _FullLoadRegions(regions, Realm, ProjectId, srv) {
    return new Promise(async (resolve,reject) =>{
       // const srv = cds.transaction(regions);
        //Delete old records
        try {
            await srv.run(DELETE("sap.ariba.Projects_Region").where({
                Projects_Realm : Realm ,
                Projects_ProjectId : ProjectId
            }));
        }
        catch(e){
            logger.error(`Error on deleting from database, aborting file processing, details ${e} `);
            reject(e);
        }

        //Insert new records
        for (const re of regions){
            try {

                re["Projects_Realm"] = Realm;
                re["Projects_ProjectId"] = ProjectId;
                await srv.run( INSERT .into ("sap.ariba.Projects_Region") .entries (re) );

            } catch (e) {
                logger.error(`Error on inserting data in database, aborting file processing, details ${e} `);
                reject(e);
                break;
            }
        }
        resolve();
    });
}

async function _FullLoadOrganizations(organizations, Realm, ProjectId, srv) {
    return new Promise(async (resolve,reject) =>{
       // const srv = cds.transaction(regions);
        //Delete old records
        try {
            await srv.run(DELETE("sap.ariba.Projects_Organization").where({
                Projects_Realm : Realm ,
                Projects_ProjectId : ProjectId
            }));
        }
        catch(e){
            logger.error(`Error on deleting from database, aborting file processing, details ${e} `);
            reject(e);
        }

        //Insert new records
        for (const org of organizations){
            try {

                org["Projects_Realm"] = Realm;
                org["Projects_ProjectId"] = ProjectId;
                await srv.run( INSERT .into ("sap.ariba.Projects_Organization") .entries (org) );

            } catch (e) {
                logger.error(`Error on inserting data in database, aborting file processing, details ${e} `);
                reject(e);
                break;
            }
        }
        resolve();
    });
}

async function _FullLoadCommodities(commodities, Realm, ProjectId, srv) {
    return new Promise(async (resolve,reject) =>{
       // const srv = cds.transaction(regions);
        //Delete old records
        try {
            await srv.run(DELETE("sap.ariba.Projects_Commodity").where({
                Projects_Realm : Realm ,
                Projects_ProjectId : ProjectId
            }));
        }
        catch(e){
            logger.error(`Error on deleting from database, aborting file processing, details ${e} `);
            reject(e);
        }

        //Insert new records
        for (const co of commodities){
            try {

                co["Projects_Realm"] = Realm;
                co["Projects_ProjectId"] = ProjectId;
                await srv.run( INSERT .into ("sap.ariba.Projects_Commodity") .entries (co) );

            } catch (e) {
                logger.error(`Error on inserting data in database, aborting file processing, details ${e} `);
                reject(e);
                break;
            }
        }
        resolve();
    });
}

async function _FullLoadAllOwners(allOwners, Realm, ProjectId, srv) {
    return new Promise(async (resolve,reject) =>{
       // const srv = cds.transaction(regions);
        //Delete old records
        try {
            await srv.run(DELETE("sap.ariba.Projects_AllOwners").where({
                Projects_Realm : Realm ,
                Projects_ProjectId : ProjectId
            }));
        }
        catch(e){
            logger.error(`Error on deleting from database, aborting file processing, details ${e} `);
            reject(e);
        }

        //Insert new records
        for (const all of allOwners){
            try {

                all["Projects_Realm"] = Realm;
                all["Projects_ProjectId"] = ProjectId;
                await srv.run( INSERT .into ("sap.ariba.Projects_AllOwners") .entries (all) );

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