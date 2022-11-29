"use strict";

const cds = require("@sap/cds");
const logger = require("../../utils/logger");
const utils = require("../../utils/Utils");


const { SMProjects, SMProjects_Commodity, SMProjects_Region, SMProjects_Organization, SMProjects_AllOwners } = cds.entities('sap.ariba');

//Amount fields in object
function _getAmountPropertiesForDataCleaning () {
    return [
        "Duration",
        "ReinviteCount"
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
                let res =  await srv.run ( SELECT.from (SMProjects).where(
                    {
                        Realm : oDataCleansed.Realm ,
                        ProjectId : oDataCleansed.ProjectId
                    })
                 );

                 if(res.length==0){
                     //New record, insert
                    await srv.run( INSERT .into (SMProjects) .entries (oDataCleansed) );

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
                    await srv.run ( UPDATE (SMProjects) .set (oDataCleansed) .where(
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
            await srv.run(DELETE(SMProjects_Region).where({
                SMProject_Realm : Realm ,
                SMProject_ProjectId : ProjectId
            }));
        }
        catch(e){
            logger.error(`Error on deleting from database, aborting file processing, details ${e} `);
            reject(e);
        }

        //Insert new records
        for (const re of regions){
            try {

                re["SMProject_Realm"] = Realm;
                re["SMProject_ProjectId"] = ProjectId;
                await srv.run( INSERT .into (SMProjects_Region) .entries (re) );

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
            await srv.run(DELETE(SMProjects_AllOwners).where({
                SMProject_Realm : Realm ,
                SMProject_ProjectId : ProjectId
            }));
        }
        catch(e){
            logger.error(`Error on deleting from database, aborting file processing, details ${e} `);
            reject(e);
        }

        //Insert new records
        for (const owner of allOwners){
            try {

                owner["SMProject_Realm"] = Realm;
                owner["SMProject_ProjectId"] = ProjectId;
                await srv.run( INSERT .into (SMProjects_AllOwners) .entries (owner) );

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
            await srv.run(DELETE(SMProjects_Commodity).where({
                SMProject_Realm : Realm ,
                SMProject_ProjectId : ProjectId
            }));
        }
        catch(e){
            logger.error(`Error on deleting from database, aborting file processing, details ${e} `);
            reject(e);
        }

        //Insert new records
        for (const comm of commodities){
            try {

                comm["SMProject_Realm"] = Realm;
                comm["SMProject_ProjectId"] = ProjectId;
                await srv.run( INSERT .into (SMProjects_Commodity) .entries (comm) );

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
            await srv.run(DELETE(SMProjects_Organization).where({
                SMProject_Realm : Realm ,
                SMProject_ProjectId : ProjectId
            }));
        }
        catch(e){
            logger.error(`Error on deleting from database, aborting file processing, details ${e} `);
            reject(e);
        }

        //Insert new records
        for (const org of organizations){
            try {

                org["SMProject_Realm"] = Realm;
                org["SMProject_ProjectId"] = ProjectId;
                await srv.run( INSERT .into (SMProjects_Organization) .entries (org) );

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