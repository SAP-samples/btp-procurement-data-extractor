"use strict";

const cds = require("@sap/cds");
const logger = require("../../utils/logger");
const utils = require("../../utils/Utils");


const { SRProjectTasks,SRProjectTasks_AllOwners, SRProjectTasks_ActiveApprovers, SRProjectTasks_Observers } = cds.entities('sap.ariba');

//Amount fields in object
function _getAmountPropertiesForDataCleaning () {
    return [    ];
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
            
            var oDataCleansed = _cleanData(aCleaningProperties, oData, realm);
            //Cleanse null nested objects
            oDataCleansed.Observers = !oDataCleansed.Observers?[]:oDataCleansed.Observers;            
            oDataCleansed.AllOwners = !oDataCleansed.AllOwners?[]:oDataCleansed.AllOwners;        
            oDataCleansed.ActiveApprovers = !oDataCleansed.ActiveApprovers?[]:oDataCleansed.ActiveApprovers;

            try {
                //Select record by Unique key
                let res =  await srv.run ( SELECT.from (SRProjectTasks).where(
                    { 
                        Realm : oDataCleansed.Realm ,
                        TaskId : oDataCleansed.TaskId }  )
                 );

                 if(res.length==0){
                     //New record, insert
                    await srv.run( INSERT .into (SRProjectTasks) .entries (oDataCleansed) ); 
                                  
                 }else{
                     //Update existing record
                     //Full Load of SourcingProjects_Organization SourcingProjects_AllOwners SourcingProjects_Suppliers SourcingProjects_Commodity SourcingProjects_Region

                   

                     let activeApprovers = oDataCleansed["ActiveApprovers"];
                     delete oDataCleansed["ActiveApprovers"];

                     let observers = oDataCleansed["Observers"];
                     delete oDataCleansed["Observers"];          
                     
                     let owners = oDataCleansed["AllOwners"];
                     delete oDataCleansed["AllOwners"];
                    
                     await srv.run ( UPDATE (SourcingProjects) .set (oDataCleansed) .where(
                        { 
                            Realm : oDataCleansed.Realm ,
                            TaskId : oDataCleansed.TaskId } )
                     );

                     await _FullLoadActiveApprovers(activeApprovers,oDataCleansed.Realm,oDataCleansed.ProjectId,srv);
                     await _FullLoadObservers(observers,oDataCleansed.Realm,oDataCleansed.ProjectId,srv);
                     await _FullLoadAllOwners(owners,oDataCleansed.Realm,oDataCleansed.ProjectId,srv);
                     
                  
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

async function _FullLoadActiveApprovers(activeApprovers,Realm,TaskId,srv){
    return new Promise(async (resolve,reject) =>{
       // const srv = cds.transaction(activeApprovers); 
        //Delete old records
        try {
            await srv.run(DELETE(SRProjectTasks_ActiveApprovers).where({
                SRProjectTasks_Realm : Realm ,
                SRProjectTasks_TaskId : TaskId 
            }));
        }
        catch(e){
            logger.error(`Error on deleting from database, aborting file processing, details ${e} `);
            reject(e);
        }

        //Insert new records
        for (const approver of activeApprovers){
            try {             
                
                approver["SRProjectTasks_Realm"] = Realm;
                approver["SRProjectTasks_TaskId"] = TaskId;
                await srv.run( INSERT .into (SRProjectTasks_ActiveApprovers) .entries (approver) ); 
           
            } catch (e) {                
                logger.error(`Error on inserting data in database, aborting file processing, details ${e} `);
                reject(e);
                break;
            }
        }
        resolve();
    });
}

async function _FullLoadObservers(observers,Realm,TaskId,srv){
    return new Promise(async (resolve,reject) =>{
        //const srv = cds.transaction(observers); 
        //Delete old records
        try {
            await srv.run(DELETE(SRProjectTasks_Observers).where({
                SRProjectTasks_Realm : Realm ,
                SRProjectTasks_TaskId : TaskId 
            }));
        }
        catch(e){
            logger.error(`Error on deleting from database, aborting file processing, details ${e} `);
            reject(e);
        }

        //Insert new records
        for (const observer of observers){
            try {             
                
                observer["SRProjectTasks_Realm"] = Realm;
                observer["SRProjectTasks_TaskId"] = TaskId;
                await srv.run( INSERT .into (SRProjectTasks_Observers) .entries (observer) ); 
           
            } catch (e) {                
                logger.error(`Error on inserting data in database, aborting file processing, details ${e} `);
                reject(e);
                break;
            }
        }
        resolve();
    });
}
 
async function _FullLoadAllOwners(owners,Realm,TaskId,srv){
    return new Promise(async (resolve,reject) =>{
        //const srv = cds.transaction(owner); 
        //Delete old records
        try {
            await srv.run(DELETE(SRProjectTasks_AllOwners).where({
                SRProjectTasks_Realm : Realm ,
                SRProjectTasks_TaskId : TaskId 
            }));
        }
        catch(e){
            logger.error(`Error on deleting from database, aborting file processing, details ${e} `);
            reject(e);
        }

        //Insert new records
        for (const owner of owners){
            try {             
                
                owner["SRProjectTasks_Realm"] = Realm;
                owner["SRProjectTasks_TaskId"] = TaskId;
                await srv.run( INSERT .into (SRProjectTasks_AllOwners) .entries (owner) ); 
           
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