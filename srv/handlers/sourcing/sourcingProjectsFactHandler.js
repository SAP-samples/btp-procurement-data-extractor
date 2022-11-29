"use strict";

const cds = require("@sap/cds");
const logger = require("../../utils/logger");
const utils = require("../../utils/Utils");


const { SourcingProjects, SourcingProjects_Organization, SourcingProjects_AllOwners,
     SourcingProjects_Suppliers, SourcingProjects_Commodity, SourcingProjects_Region } = cds.entities('sap.ariba');

//Amount fields in object
function _getAmountPropertiesForDataCleaning () {
    return [    ];
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
            oDataCleansed = utils.processCustomFields(oDataCleansed);

            try {
                //Select record by Unique key
                let res =  await srv.run ( SELECT.from (SourcingProjects).where(
                    { 
                        Realm : oDataCleansed.Realm ,
                        ProjectId : oDataCleansed.ProjectId }  )
                 );

                 if(res.length==0){
                     //New record, insert
                    await srv.run( INSERT .into (SourcingProjects) .entries (oDataCleansed) ); 
                                  
                 }else{
                     //Update existing record
                     //Full Load of SourcingProjects_Organization SourcingProjects_AllOwners SourcingProjects_Suppliers SourcingProjects_Commodity SourcingProjects_Region
                     
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
                    
                     await srv.run ( UPDATE (SourcingProjects) .set (oDataCleansed) .where(
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
            await srv.run(DELETE(SourcingProjects_Region).where({
                SourcingProject_Realm : Realm ,
                SourcingProject_ProjectId : ProjectId 
            }));
        }
        catch(e){
            logger.error(`Error on deleting from database, aborting file processing, details ${e} `);
            reject(e);
        }

        //Insert new records
        for (const re of regions){
            try {             
                
                re["SourcingProject_Realm"] = Realm;
                re["SourcingProject_ProjectId"] = ProjectId;
                await srv.run( INSERT .into (SourcingProjects_Region) .entries (re) ); 
           
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
            await srv.run(DELETE(SourcingProjects_Suppliers).where({
                SourcingProject_Realm : Realm ,
                SourcingProject_ProjectId : ProjectId 
            }));
        }
        catch(e){
            logger.error(`Error on deleting from database, aborting file processing, details ${e} `);
            reject(e);
        }

        //Insert new records
        for (const supp of suppliers){
            try {             
                
                supp["SourcingProject_Realm"] = Realm;
                supp["SourcingProject_ProjectId"] = ProjectId;
                await srv.run( INSERT .into (SourcingProjects_Suppliers) .entries (supp) ); 
           
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
            await srv.run(DELETE(SourcingProjects_Commodity).where({
                SourcingProject_Realm : Realm ,
                SourcingProject_ProjectId : ProjectId 
            }));
        }
        catch(e){
            logger.error(`Error on deleting from database, aborting file processing, details ${e} `);
            reject(e);
        }

        //Insert new records
        for (const comm of commodities){
            try {             
                
                comm["SourcingProject_Realm"] = Realm;
                comm["SourcingProject_ProjectId"] = ProjectId;
                await srv.run( INSERT .into (SourcingProjects_Commodity) .entries (comm) ); 
           
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
            await srv.run(DELETE(SourcingProjects_AllOwners).where({
                SourcingProject_Realm : Realm ,
                SourcingProject_ProjectId : ProjectId 
            }));
        }
        catch(e){
            logger.error(`Error on deleting from database, aborting file processing, details ${e} `);
            reject(e);
        }

        //Insert new records
        for (const owner of owners){
            try {             
                
                owner["SourcingProject_Realm"] = Realm;
                owner["SourcingProject_ProjectId"] = ProjectId;
                await srv.run( INSERT .into (SourcingProjects_AllOwners) .entries (owner) ); 
           
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
            await srv.run(DELETE(SourcingProjects_Organization).where({
                SourcingProject_Realm : Realm ,
                SourcingProject_ProjectId : ProjectId 
            }));
        }
        catch(e){
            logger.error(`Error on deleting from database, aborting file processing, details ${e} `);
            reject(e);
        }

        //Insert new records
        for (const org of organizations){
            try {             
                
                org["SourcingProject_Realm"] = Realm;
                org["SourcingProject_ProjectId"] = ProjectId;
                await srv.run( INSERT .into (SourcingProjects_Organization) .entries (org) ); 
           
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