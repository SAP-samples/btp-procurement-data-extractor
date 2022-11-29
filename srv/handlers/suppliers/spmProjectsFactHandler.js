"use strict";

const cds = require("@sap/cds");
const logger = require("../../utils/logger");
const utils = require("../../utils/Utils");


const { SPMProjects, SPMProjects_Region, SPMProjects_Commodity, SPMProjects_Organization, SPMProjects_AllOwners } = cds.entities('sap.ariba');

//Amount fields in object
function _getAmountPropertiesForDataCleaning () {
    return [
        "Duration"
    ];
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
                let res =  await srv.run ( SELECT.from (SPMProjects).where(
                    {
                        Realm : oDataCleansed.Realm ,
                        ProjectId : oDataCleansed.ProjectId
                    })
                 );

                 if(res.length==0){
                     //New record, insert
                    await srv.run( INSERT .into (SPMProjects) .entries (oDataCleansed) );

                 }else{

                     let organizations = oDataCleansed["Organization"];
                     delete oDataCleansed["Organization"];

                     let commodities = oDataCleansed["Commodity"];
                     delete oDataCleansed["Commodity"];

                     let allOwners = oDataCleansed["AllOwners"];
                     delete oDataCleansed["AllOwners"];

                     let regions = oDataCleansed["Region"];
                     delete oDataCleansed["Region"];


                     //Update existing record
                    await srv.run ( UPDATE (SPMProjects) .set (oDataCleansed) .where(
                        {
                            Realm : oDataCleansed.Realm ,
                            ProjectId : oDataCleansed.ProjectId } )
                     );

                    await _FullLoadOrganization(organizations,oDataCleansed.Realm,oDataCleansed.ProjectId,srv);
                    await _FullLoadCommodities(commodities,oDataCleansed.Realm,oDataCleansed.ProjectId,srv);
                    await _FullLoadAllOwners(allOwners,oDataCleansed.Realm,oDataCleansed.ProjectId,srv);
                    await _FullLoadRegions(regions,oDataCleansed.Realm,oDataCleansed.ProjectId,srv);


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


async function _FullLoadRegions(regions,Realm,ProjectId,srv){
    return new Promise(async (resolve,reject) =>{
       // const srv = cds.transaction(regions);
        //Delete old records
        try {
            await srv.run(DELETE(SPMProjects_Region).where({
                SPMProjects_Realm : Realm ,
                SPMProjects_ProjectId : ProjectId
            }));
        }
        catch(e){
            logger.error(`Error on deleting from database, aborting file processing, details ${e} `);
            reject(e);
        }

        //Insert new records
        for (const re of regions){
            try {

                re["SPMProjects_Realm"] = Realm;
                re["SPMProjects_ProjectId"] = ProjectId;
                await srv.run( INSERT .into (SPMProjects_Region) .entries (re) );

            } catch (e) {
                logger.error(`Error on inserting data in database, aborting file processing, details ${e} `);
                reject(e);
                break;
            }
        }
        resolve();
    });
}

async function _FullLoadAllOwners(allOwners,Realm,ProjectId,srv){
    return new Promise(async (resolve,reject) =>{
       // const srv = cds.transaction(allOwners);
        //Delete old records
        try {
            await srv.run(DELETE(SPMProjects_AllOwners).where({
                SPMProjects_Realm : Realm ,
                SPMProjects_ProjectId : ProjectId
            }));
        }
        catch(e){
            logger.error(`Error on deleting from database, aborting file processing, details ${e} `);
            reject(e);
        }

        //Insert new records
        for (const owner of allOwners){
            try {

                owner["SPMProjects_Realm"] = Realm;
                owner["SPMProjects_ProjectId"] = ProjectId;
                await srv.run( INSERT .into (SPMProjects_AllOwners) .entries (owner) );

            } catch (e) {
                logger.error(`Error on inserting data in database, aborting file processing, details ${e} `);
                reject(e);
                break;
            }
        }
        resolve();
    });
}

async function _FullLoadCommodities(commodities,Realm,ProjectId,srv){
    return new Promise(async (resolve,reject) =>{
       // const srv = cds.transaction(commodities);
        //Delete old records
        try {
            await srv.run(DELETE(SPMProjects_Commodity).where({
                SPMProjects_Realm : Realm ,
                SPMProjects_ProjectId : ProjectId
            }));
        }
        catch(e){
            logger.error(`Error on deleting from database, aborting file processing, details ${e} `);
            reject(e);
        }

        //Insert new records
        for (const comm of commodities){
            try {

                comm["SPMProjects_Realm"] = Realm;
                comm["SPMProjects_ProjectId"] = ProjectId;
                await srv.run( INSERT .into (SPMProjects_Commodity) .entries (comm) );

            } catch (e) {
                logger.error(`Error on inserting data in database, aborting file processing, details ${e} `);
                reject(e);
                break;
            }
        }
        resolve();
    });
}

async function _FullLoadOrganization(organizations,Realm,ProjectId,srv){
    return new Promise(async (resolve,reject) =>{
        //const srv = cds.transaction(organizations);
        //Delete old records
        try {
            await srv.run(DELETE(SPMProjects_Organization).where({
                SPMProjects_Realm : Realm ,
                SPMProjects_ProjectId : ProjectId
            }));
        }
        catch(e){
            logger.error(`Error on deleting from database, aborting file processing, details ${e} `);
            reject(e);
        }

        //Insert new records
        for (const org of organizations){
            try {

                org["SPMProjects_Realm"] = Realm;
                org["SPMProjects_ProjectId"] = ProjectId;
                await srv.run( INSERT .into (SPMProjects_Organization) .entries (org) );

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