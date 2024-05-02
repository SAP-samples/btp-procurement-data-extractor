"use strict";

const cds = require("@sap/cds");
const logger = cds.log('logger');
const utils = require("../../../utils/Utils");


//Amount fields in object
function _getAmountPropertiesForDataCleaning () {
    return [
        "Duration",
        "TotalSpend",
        "InvoicedSpend"
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
            oDataCleansed = utils.processCustomFields(oDataCleansed);
            oDataCleansed = utils.flattenTypes(oDataCleansed);

            try {
                //Select record by Unique key
                let res =  await SELECT.from ("sap.ariba.ServicesProcurementWorkspaces_AN").where(
                    {
                        Realm : oDataCleansed.Realm ,
                        ProjectId : oDataCleansed.ProjectId
                    });

                if(res.length==0){
                     //New record, insert
                    await INSERT .into ("sap.ariba.ServicesProcurementWorkspaces_AN") .entries (oDataCleansed) ;

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

                     let suppliers = oDataCleansed["Suppliers"];
                     delete oDataCleansed["Suppliers"];

                    await UPDATE ("sap.ariba.Projects") .set (oDataCleansed) .where(
                        {
                            Realm : oDataCleansed.Realm ,
                            ProjectId : oDataCleansed.ProjectId
                        });

                     await _FullLoadRegions(regions, oDataCleansed.Realm, oDataCleansed.ProjectId);
                     await _FullLoadOrganizations(organizations, oDataCleansed.Realm, oDataCleansed.ProjectId);
                     await _FullLoadCommodities(commodities, oDataCleansed.Realm, oDataCleansed.ProjectId);
                     await _FullLoadAllOwners(allOwners, oDataCleansed.Realm, oDataCleansed.ProjectId);
                     await _FullLoadSuppliers(suppliers, oDataCleansed.Realm, oDataCleansed.ProjectId);

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

async function _FullLoadRegions(regions, Realm, ProjectId) {
    return new Promise(async (resolve,reject) =>{
        //Delete old records
        try {
            await DELETE("sap.ariba.ServicesProcurementWorkspaces_Region_AN").where({
                Projects_Realm : Realm ,
                Projects_ProjectId : ProjectId
            });
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
                await INSERT .into ("sap.ariba.ServicesProcurementWorkspaces_Region_AN") .entries (re) ;

            } catch (e) {
                logger.error(`Error on inserting data in database, aborting file processing, details ${e} `);
                reject(e);
                break;
            }
        }
        resolve();
    });
}

async function _FullLoadOrganizations(organizations, Realm, ProjectId) {
    return new Promise(async (resolve,reject) =>{
        //Delete old records
        try {
            await DELETE("sap.ariba.ServicesProcurementWorkspaces_Organization_AN").where({
                Projects_Realm : Realm ,
                Projects_ProjectId : ProjectId
            });
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
                await INSERT .into ("sap.ariba.ServicesProcurementWorkspaces_Organization_AN") .entries (org) ;

            } catch (e) {
                logger.error(`Error on inserting data in database, aborting file processing, details ${e} `);
                reject(e);
                break;
            }
        }
        resolve();
    });
}

async function _FullLoadCommodities(commodities, Realm, ProjectId) {
    return new Promise(async (resolve,reject) =>{
        //Delete old records
        try {
            await DELETE("sap.ariba.ServicesProcurementWorkspaces_Commodity_AN").where({
                Projects_Realm : Realm ,
                Projects_ProjectId : ProjectId
            });
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
                await INSERT .into ("sap.ariba.ServicesProcurementWorkspaces_Commodity_AN") .entries (co) ;

            } catch (e) {
                logger.error(`Error on inserting data in database, aborting file processing, details ${e} `);
                reject(e);
                break;
            }
        }
        resolve();
    });
}

async function _FullLoadAllOwners(allOwners, Realm, ProjectId) {
    return new Promise(async (resolve,reject) =>{
        //Delete old records
        try {
            await DELETE("sap.ariba.ServicesProcurementWorkspaces_AllOwners_AN").where({
                Projects_Realm : Realm ,
                Projects_ProjectId : ProjectId
            });
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
                await INSERT .into ("sap.ariba.ServicesProcurementWorkspaces_AllOwners_AN") .entries (all) ;

            } catch (e) {
                logger.error(`Error on inserting data in database, aborting file processing, details ${e} `);
                reject(e);
                break;
            }
        }
        resolve();
    });
}

async function _FullLoadSuppliers(suppliers, Realm, ProjectId) {
    return new Promise(async (resolve,reject) =>{
        //Delete old records
        try {
            await DELETE("sap.ariba.ServicesProcurementWorkspaces_Suppliers_AN").where({
                Projects_Realm : Realm ,
                Projects_ProjectId : ProjectId
            });
        }
        catch(e){
            logger.error(`Error on deleting from database, aborting file processing, details ${e} `);
            reject(e);
        }

        //Insert new records
        for (const sup of suppliers){
            try {

                sup["Projects_Realm"] = Realm;
                sup["Projects_ProjectId"] = ProjectId;
                await INSERT .into ("sap.ariba.ServicesProcurementWorkspaces_Suppliers_AN") .entries (sup) ;

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