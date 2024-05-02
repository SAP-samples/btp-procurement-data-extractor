"use strict";

const cds = require("@sap/cds");
const logger = cds.log('logger');
const utils = require("../../../utils/Utils");


//Amount fields in object
function _getAmountPropertiesForDataCleaning () {
    return [
        "Duration"
    ];
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
            oDataCleansed = utils.flattenTypes(oDataCleansed);

            try {
                //Select record by Unique key
                let res =  await SELECT.from ("sap.ariba.SupplierRegistrationProjects_AN").where(
                    {
                        Realm : oDataCleansed.Realm ,
                        ProjectId : oDataCleansed.ProjectId
                    });

                 if(res.length==0){
                     //New record, insert
                    await INSERT .into ("sap.ariba.SupplierRegistrationProjects_AN") .entries (oDataCleansed) ;

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
                    await UPDATE ("sap.ariba.SupplierRegistrationProjects_AN") .set (oDataCleansed) .where(
                        {
                            Realm : oDataCleansed.Realm ,
                            ProjectId : oDataCleansed.ProjectId
                        } );

                    await _FullLoadOrganization(organizations,oDataCleansed.Realm,oDataCleansed.ProjectId);
                    await _FullLoadCommodities(commodities,oDataCleansed.Realm,oDataCleansed.ProjectId);
                    await _FullLoadAllOwners(allOwners,oDataCleansed.Realm,oDataCleansed.ProjectId);
                    await _FullLoadRegions(regions,oDataCleansed.Realm,oDataCleansed.ProjectId);


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


async function _FullLoadRegions(regions,Realm,ProjectId){
    return new Promise(async (resolve,reject) =>{
        //Delete old records
        try {
            await DELETE("sap.ariba.SupplierRegistrationProjects_Region_AN").where({
                SupplierRegistrationProject_Realm : Realm ,
                SupplierRegistrationProject_ProjectId : ProjectId
            });
        }
        catch(e){
            logger.error(`Error on deleting from database, aborting file processing, details ${e} `);
            reject(e);
        }

        //Insert new records
        for (const re of regions){
            try {

                re["SupplierRegistrationProject_Realm"] = Realm;
                re["SupplierRegistrationProject_ProjectId"] = ProjectId;
                await INSERT .into ("sap.ariba.SupplierRegistrationProjects_Region_AN") .entries (re) ;

            } catch (e) {
                logger.error(`Error on inserting data in database, aborting file processing, details ${e} `);
                reject(e);
                break;
            }
        }
        resolve();
    });
}

async function _FullLoadAllOwners(allOwners,Realm,ProjectId){
    return new Promise(async (resolve,reject) =>{
        //Delete old records
        try {
            await DELETE("sap.ariba.SupplierRegistrationProjects_AllOwners_AN").where({
                SupplierRegistrationProject_Realm : Realm ,
                SupplierRegistrationProject_ProjectId : ProjectId
            });
        }
        catch(e){
            logger.error(`Error on deleting from database, aborting file processing, details ${e} `);
            reject(e);
        }

        //Insert new records
        for (const owner of allOwners){
            try {

                owner["SupplierRegistrationProject_Realm"] = Realm;
                owner["SupplierRegistrationProject_ProjectId"] = ProjectId;
                await INSERT .into ("sap.ariba.SupplierRegistrationProjects_AllOwners_AN") .entries (owner) ;

            } catch (e) {
                logger.error(`Error on inserting data in database, aborting file processing, details ${e} `);
                reject(e);
                break;
            }
        }
        resolve();
    });
}

async function _FullLoadCommodities(commodities,Realm,ProjectId){
    return new Promise(async (resolve,reject) =>{
        //Delete old records
        try {
            await DELETE("sap.ariba.SupplierRegistrationProjects_Commodity_AN").where({
                SupplierRegistrationProject_Realm : Realm ,
                SupplierRegistrationProject_ProjectId : ProjectId
            });
        }
        catch(e){
            logger.error(`Error on deleting from database, aborting file processing, details ${e} `);
            reject(e);
        }

        //Insert new records
        for (const comm of commodities){
            try {

                comm["SupplierRegistrationProject_Realm"] = Realm;
                comm["SupplierRegistrationProject_ProjectId"] = ProjectId;
                await INSERT .into ("sap.ariba.SupplierRegistrationProjects_Commodity_AN") .entries (comm) ;

            } catch (e) {
                logger.error(`Error on inserting data in database, aborting file processing, details ${e} `);
                reject(e);
                break;
            }
        }
        resolve();
    });
}

async function _FullLoadOrganization(organizations,Realm,ProjectId){
    return new Promise(async (resolve,reject) =>{
        //Delete old records
        try {
            await DELETE("sap.ariba.SupplierRegistrationProjects_Organization_AN").where({
                SupplierRegistrationProject_Realm : Realm ,
                SupplierRegistrationProject_ProjectId : ProjectId
            });
        }
        catch(e){
            logger.error(`Error on deleting from database, aborting file processing, details ${e} `);
            reject(e);
        }

        //Insert new records
        for (const org of organizations){
            try {

                org["SupplierRegistrationProject_Realm"] = Realm;
                org["SupplierRegistrationProject_ProjectId"] = ProjectId;
                await INSERT .into ("sap.ariba.SupplierRegistrationProjects_Organization_AN") .entries (org) ;

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