"use strict";

const cds = require("@sap/cds");
const logger = require("../../utils/logger");
const utils = require("../../utils/Utils");



const { SourcingRequests, SourcingRequests_Organization, SourcingRequests_Commodity,
     SourcingRequests_Region, SourcingRequests_Suppliers, SourcingRequests_AllOwners } = cds.entities('sap.ariba');

//Amount fields in object
function _getAmountPropertiesForDataCleaning () {
    return [
        "Duration",
        "BaselineSpend",
        "ActualSaving",
        "TargetSavingsPct",
        "ContractMonths"
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
                let res =  await srv.run ( SELECT.from (SourcingRequests).where(
                    {
                        Realm : oDataCleansed.Realm ,
                        ProjectId : oDataCleansed.ProjectId }  )
                 );

                 if(res.length==0){
                     //New record, insert
                    await srv.run( INSERT .into (SourcingRequests) .entries (oDataCleansed) );

                 }else{
                     //Update existing record
                     //Full Load of SourcingRequestss_Organization SourcingRequestss_AllOwners SourcingRequestss_Suppliers SourcingRequestss_Commodity SourcingRequestss_Region

                     let organizations = oDataCleansed["Organization"];
                     delete oDataCleansed["Organization"];

                     let commodities = oDataCleansed["Commodity"];
                     delete oDataCleansed["Commodity"];

                     let owners = oDataCleansed["AllOwners"];
                     delete oDataCleansed["AllOwners"];

                     let suppliers = oDataCleansed["Suppliers"];
                     delete oDataCleansed["Suppliers"];

                     let regions = oDataCleansed["Region"];
                     delete oDataCleansed["Region"];

                     await srv.run ( UPDATE (SourcingRequests) .set (oDataCleansed) .where(
                        {
                            Realm : oDataCleansed.Realm ,
                            ProjectId : oDataCleansed.ProjectId } )
                     );

                     await _FullLoadOrganization(organizations,oDataCleansed.Realm,oDataCleansed.ProjectId,srv);
                     await _FullLoadOwners(owners,oDataCleansed.Realm,oDataCleansed.ProjectId,srv);
                     await _FullLoadCommodities(commodities,oDataCleansed.Realm,oDataCleansed.ProjectId,srv);
                     await _FullLoadSuppliers(suppliers,oDataCleansed.Realm,oDataCleansed.ProjectId,srv);
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
            await srv.run(DELETE(SourcingRequests_Region).where({
                SourcingRequests_Realm : Realm ,
                SourcingRequests_ProjectId : ProjectId
            }));
        }
        catch(e){
            logger.error(`Error on deleting from database, aborting file processing, details ${e} `);
            reject(e);
        }

        //Insert new records
        for (const re of regions){
            try {

                re["SourcingRequests_Realm"] = Realm;
                re["SourcingRequests_ProjectId"] = ProjectId;
                await srv.run( INSERT .into (SourcingRequests_Region) .entries (re) );

            } catch (e) {
                logger.error(`Error on inserting data in database, aborting file processing, details ${e} `);
                reject(e);
                break;
            }
        }
        resolve();
    });
}

async function _FullLoadSuppliers(suppliers,Realm,ProjectId,srv){
    return new Promise(async (resolve,reject) =>{
       // const srv = cds.transaction(suppliers);
        //Delete old records
        try {
            await srv.run(DELETE(SourcingRequests_Suppliers).where({
                SourcingRequests_Realm : Realm ,
                SourcingRequests_ProjectId : ProjectId
            }));
        }
        catch(e){
            logger.error(`Error on deleting from database, aborting file processing, details ${e} `);
            reject(e);
        }

        //Insert new records
        for (const supp of suppliers){
            try {

                supp["SourcingRequests_Realm"] = Realm;
                supp["SourcingRequests_ProjectId"] = ProjectId;
                await srv.run( INSERT .into (SourcingRequests_Suppliers) .entries (supp) );

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
            await srv.run(DELETE(SourcingRequests_Commodity).where({
                SourcingRequests_Realm : Realm ,
                SourcingRequests_ProjectId : ProjectId
            }));
        }
        catch(e){
            logger.error(`Error on deleting from database, aborting file processing, details ${e} `);
            reject(e);
        }

        //Insert new records
        for (const comm of commodities){
            try {

                comm["SourcingRequests_Realm"] = Realm;
                comm["SourcingRequests_ProjectId"] = ProjectId;
                await srv.run( INSERT .into (SourcingRequests_Commodity) .entries (comm) );

            } catch (e) {
                logger.error(`Error on inserting data in database, aborting file processing, details ${e} `);
                reject(e);
                break;
            }
        }
        resolve();
    });
}

async function _FullLoadOwners(owners,Realm,ProjectId,srv){
    return new Promise(async (resolve,reject) =>{
        //const srv = cds.transaction(owners);
        //Delete old records
        try {
            await srv.run(DELETE(SourcingRequests_AllOwners).where({
                SourcingRequests_Realm : Realm ,
                SourcingRequests_ProjectId : ProjectId
            }));
        }
        catch(e){
            logger.error(`Error on deleting from database, aborting file processing, details ${e} `);
            reject(e);
        }

        //Insert new records
        for (const owner of owners){
            try {

                owner["SourcingRequests_Realm"] = Realm;
                owner["SourcingRequests_ProjectId"] = ProjectId;
                await srv.run( INSERT .into (SourcingRequests_AllOwners) .entries (owner) );

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
            await srv.run(DELETE(SourcingRequests_Organization).where({
                SourcingRequests_Realm : Realm ,
                SourcingRequests_ProjectId : ProjectId
            }));
        }
        catch(e){
            logger.error(`Error on deleting from database, aborting file processing, details ${e} `);
            reject(e);
        }

        //Insert new records
        for (const org of organizations){
            try {

                org["SourcingRequests_Realm"] = Realm;
                org["SourcingRequests_ProjectId"] = ProjectId;
                await srv.run( INSERT .into (SourcingRequests_Organization) .entries (org) );

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