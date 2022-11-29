"use strict";

const cds = require("@sap/cds");
const logger = require("../../utils/logger");
const utils = require("../../utils/Utils");


const { ContractWorkspaces, ContractWorkspaces_Commodity, ContractWorkspaces_Organization,
    ContractWorkspaces_Region, ContractWorkspaces_AffectedParties, ContractWorkspaces_AllOwners } = cds.entities('sap.ariba');

//Amount fields in object
function _getAmountPropertiesForDataCleaning () {
    return ["Duration",
    "Amount",
    "ProposedAmount",
    "OrigProposedAmount",
    "OrigAmount",
    "ComplexSpendAvailableAmount",
    "ProposedIncrementalAmount",
    "ApprovedAmount"
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
                let res =  await srv.run ( SELECT.from (ContractWorkspaces).where(
                    { 
                        Realm : oDataCleansed.Realm ,
                        ProjectId : oDataCleansed.ProjectId }  )
                 );

                 if(res.length==0){
                     //New record, insert
                    await srv.run( INSERT .into (ContractWorkspaces) .entries (oDataCleansed) ); 
                                  
                 }else{
                     //Update existing record
                     //Full Load of ContractWorkspaces_Organization ContractWorkspaces_AllOwners ContractWorkspaces_Suppliers ContractWorkspaces_Commodity ContractWorkspaces_Region
                     
                     let organizations = oDataCleansed["Organization"];
                     delete oDataCleansed["Organization"];
                    
                     let commodities = oDataCleansed["Commodity"];
                     delete oDataCleansed["Commodity"];

                     let owners = oDataCleansed["AllOwners"];
                     delete oDataCleansed["AllOwners"];

                     let affectedParties = oDataCleansed["AffectedParties"];
                     delete oDataCleansed["AffectedParties"];

                     let regions = oDataCleansed["Region"];
                     delete oDataCleansed["Region"];           
                    
                     await srv.run ( UPDATE (ContractWorkspaces) .set (oDataCleansed) .where(
                        { 
                            Realm : oDataCleansed.Realm ,
                            ProjectId : oDataCleansed.ProjectId } )
                     );

                     await _FullLoadOrganization(organizations,oDataCleansed.Realm,oDataCleansed.ProjectId,srv);
                     await _FullLoadOwners(owners,oDataCleansed.Realm,oDataCleansed.ProjectId,srv);
                     await _FullLoadCommodities(commodities,oDataCleansed.Realm,oDataCleansed.ProjectId,srv);
                     await _FullLoadAffectedParties(affectedParties,oDataCleansed.Realm,oDataCleansed.ProjectId,srv);
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
            await srv.run(DELETE(ContractWorkspaces_Region).where({
                ContractWorkspace_Realm : Realm ,
                ContractWorkspace_ProjectId : ProjectId 
            }));
        }
        catch(e){
            logger.error(`Error on deleting from database, aborting file processing, details ${e} `);
            reject(e);
        }

        //Insert new records
        for (const re of regions){
            try {             
                
                re["ContractWorkspace_Realm"] = Realm;
                re["ContractWorkspace_ProjectId"] = ProjectId;
                await srv.run( INSERT .into (ContractWorkspaces_Region) .entries (re) ); 
           
            } catch (e) {                
                logger.error(`Error on inserting data in database, aborting file processing, details ${e} `);
                reject(e);
                break;
            }
        }
        resolve();
    });
}

async function _FullLoadAffectedParties(affectedParties,Realm,ProjectId,srv){
    return new Promise(async (resolve,reject) =>{
       // const srv = cds.transaction(suppliers); 
        //Delete old records
        try {
            await srv.run(DELETE(ContractWorkspaces_AffectedParties).where({
                ContractWorkspace_Realm : Realm ,
                ContractWorkspace_ProjectId : ProjectId 
            }));
        }
        catch(e){
            logger.error(`Error on deleting from database, aborting file processing, details ${e} `);
            reject(e);
        }

        //Insert new records
        for (const ap of affectedParties){
            try {             
                
                ap["ContractWorkspace_Realm"] = Realm;
                ap["ContractWorkspace_ProjectId"] = ProjectId;
                await srv.run( INSERT .into (ContractWorkspaces_AffectedParties) .entries (ap) ); 
           
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
            await srv.run(DELETE(ContractWorkspaces_Commodity).where({
                ContractWorkspace_Realm : Realm ,
                ContractWorkspace_ProjectId : ProjectId 
            }));
        }
        catch(e){
            logger.error(`Error on deleting from database, aborting file processing, details ${e} `);
            reject(e);
        }

        //Insert new records
        for (const comm of commodities){
            try {             
                
                comm["ContractWorkspace_Realm"] = Realm;
                comm["ContractWorkspace_ProjectId"] = ProjectId;
                await srv.run( INSERT .into (ContractWorkspaces_Commodity) .entries (comm) ); 
           
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
            await srv.run(DELETE(ContractWorkspaces_AllOwners).where({
                ContractWorkspace_Realm : Realm ,
                ContractWorkspace_ProjectId : ProjectId 
            }));
        }
        catch(e){
            logger.error(`Error on deleting from database, aborting file processing, details ${e} `);
            reject(e);
        }

        //Insert new records
        for (const owner of owners){
            try {             
                
                owner["ContractWorkspace_Realm"] = Realm;
                owner["ContractWorkspace_ProjectId"] = ProjectId;
                await srv.run( INSERT .into (ContractWorkspaces_AllOwners) .entries (owner) ); 
           
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
            await srv.run(DELETE(ContractWorkspaces_Organization).where({
                ContractWorkspace_Realm : Realm ,
                ContractWorkspace_ProjectId : ProjectId 
            }));
        }
        catch(e){
            logger.error(`Error on deleting from database, aborting file processing, details ${e} `);
            reject(e);
        }

        //Insert new records
        for (const org of organizations){
            try {             
                
                org["ContractWorkspace_Realm"] = Realm;
                org["ContractWorkspace_ProjectId"] = ProjectId;
                await srv.run( INSERT .into (ContractWorkspaces_Organization) .entries (org) ); 
           
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