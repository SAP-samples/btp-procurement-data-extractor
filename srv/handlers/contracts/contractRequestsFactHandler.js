"use strict";

const cds = require("@sap/cds");
const logger = require("../../utils/logger");
const utils = require("../../utils/Utils");



const { ContractRequests, ContractRequests_Commodity, ContractRequests_Organization,
    ContractRequests_Region, ContractRequests_AffectedParties, ContractRequests_AllOwners } = cds.entities('sap.ariba');

//Amount fields in object
function _getAmountPropertiesForDataCleaning () {
    return [
        "Duration",
        "Amount",
        "ProposedAmount",
        "OrigProposedAmount",
        "OrigAmount"
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
                let res =  await srv.run ( SELECT.from (ContractRequests).where(
                    { 
                        Realm : oDataCleansed.Realm ,
                        ProjectId : oDataCleansed.ProjectId }  )
                 );

                 if(res.length==0){
                     //New record, insert
                    await srv.run( INSERT .into (ContractRequests) .entries (oDataCleansed) ); 
                                  
                 }else{
                     //Update existing record
                     //Full Load of ContractRequests_Organization ContractRequests_AllOwners ContractRequests_Suppliers ContractRequests_Commodity ContractRequests_Region
                     
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
                    
                     await srv.run ( UPDATE (ContractRequests) .set (oDataCleansed) .where(
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
            await srv.run(DELETE(ContractRequests_Region).where({
                ContractRequests_Realm : Realm ,
                ContractRequests_ProjectId : ProjectId 
            }));
        }
        catch(e){
            logger.error(`Error on deleting from database, aborting file processing, details ${e} `);
            reject(e);
        }

        //Insert new records
        for (const re of regions){
            try {             
                
                re["ContractRequests_Realm"] = Realm;
                re["ContractRequests_ProjectId"] = ProjectId;
                await srv.run( INSERT .into (ContractRequests_Region) .entries (re) ); 
           
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
            await srv.run(DELETE(ContractRequests_AffectedParties).where({
                ContractRequests_Realm : Realm ,
                ContractRequests_ProjectId : ProjectId 
            }));
        }
        catch(e){
            logger.error(`Error on deleting from database, aborting file processing, details ${e} `);
            reject(e);
        }

        //Insert new records
        for (const ap of affectedParties){
            try {             
                
                ap["ContractRequests_Realm"] = Realm;
                ap["ContractRequests_ProjectId"] = ProjectId;
                await srv.run( INSERT .into (ContractRequests_AffectedParties) .entries (ap) ); 
           
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
            await srv.run(DELETE(ContractRequests_Commodity).where({
                ContractRequests_Realm : Realm ,
                ContractRequests_ProjectId : ProjectId 
            }));
        }
        catch(e){
            logger.error(`Error on deleting from database, aborting file processing, details ${e} `);
            reject(e);
        }

        //Insert new records
        for (const comm of commodities){
            try {             
                
                comm["ContractRequests_Realm"] = Realm;
                comm["ContractRequests_ProjectId"] = ProjectId;
                await srv.run( INSERT .into (ContractRequests_Commodity) .entries (comm) ); 
           
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
            await srv.run(DELETE(ContractRequests_AllOwners).where({
                ContractRequests_Realm : Realm ,
                ContractRequests_ProjectId : ProjectId 
            }));
        }
        catch(e){
            logger.error(`Error on deleting from database, aborting file processing, details ${e} `);
            reject(e);
        }

        //Insert new records
        for (const owner of owners){
            try {             
                
                owner["ContractRequests_Realm"] = Realm;
                owner["ContractRequests_ProjectId"] = ProjectId;
                await srv.run( INSERT .into (ContractRequests_AllOwners) .entries (owner) ); 
           
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
            await srv.run(DELETE(ContractRequests_Organization).where({
                ContractRequests_Realm : Realm ,
                ContractRequests_ProjectId : ProjectId 
            }));
        }
        catch(e){
            logger.error(`Error on deleting from database, aborting file processing, details ${e} `);
            reject(e);
        }

        //Insert new records
        for (const org of organizations){
            try {             
                
                org["ContractRequests_Realm"] = Realm;
                org["ContractRequests_ProjectId"] = ProjectId;
                await srv.run( INSERT .into (ContractRequests_Organization) .entries (org) ); 
           
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