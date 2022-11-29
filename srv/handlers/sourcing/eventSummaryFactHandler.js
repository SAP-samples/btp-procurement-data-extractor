"use strict";

const cds = require("@sap/cds");
const logger = require("../../utils/logger");
const utils = require("../../utils/Utils");



const { EventSummary, EventSummary_Department, EventSummary_Region,
    EventSummary_Commodity, EventSummary_BiddedSuppliers } = cds.entities('sap.ariba');

//Amount fields in object
function _getAmountPropertiesForDataCleaning () {
    return [    ];
}

function _FlatteningData ( oData) {
  
    //Structure flattening
    oData.EventId = oData.Event.EventId;
    oData.ItemId = oData.Event.ItemId;
    oData.EventVersion = oData.Event.VersionNumber;
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
            var oDataCleansed = _FlatteningData(oDataCleansed);
            var oDataCleansed = utils.processCustomFields(oDataCleansed);
            try {
                //Select record by Unique key
                let res =  await srv.run ( SELECT.from (EventSummary).where(
                    { 
                        Realm : oDataCleansed.Realm ,
                        EventId : oDataCleansed.EventId ,
                        ItemId : oDataCleansed.ItemId ,
                        EventVersion : oDataCleansed.EventVersion }  )
                 );

                 if(res.length==0){
                     //New record, insert
                    await srv.run( INSERT .into (EventSummary) .entries (oDataCleansed) ); 
                                  
                 }else{
                     //Update existing record
                     //Full Load of SourcingProjects_Organization SourcingProjects_AllOwners SourcingProjects_Suppliers SourcingProjects_Commodity SourcingProjects_Region
                     
                     let departments = oDataCleansed["Department"];
                     delete oDataCleansed["Department"];
                    
                     let commodities = oDataCleansed["Commodity"];
                     delete oDataCleansed["Commodity"];

                     let suppliers = oDataCleansed["BiddedSuppliers"];
                     delete oDataCleansed["BiddedSuppliers"];

                     let regions = oDataCleansed["Region"];
                     delete oDataCleansed["Region"];           
                    
                     await srv.run ( UPDATE (EventSummary) .set (oDataCleansed) .where(
                        { 
                            Realm : oDataCleansed.Realm ,
                            EventId : oDataCleansed.EventId ,
                            ItemId : oDataCleansed.ItemId ,
                            EventVersion : oDataCleansed.EventVersion} )
                     );

                     await _FullLoadOrganization(departments,oDataCleansed.Realm,oDataCleansed.EventId,oDataCleansed.ItemId,oDataCleansed.EventVersion,srv);
                     await _FullLoadCommodities(commodities,oDataCleansed.Realm,oDataCleansed.EventId,oDataCleansed.ItemId,oDataCleansed.EventVersion,srv);
                     await _FullLoadSuppliers(suppliers,oDataCleansed.Realm,oDataCleansed.EventId,oDataCleansed.ItemId,oDataCleansed.EventVersion,srv);
                     await _FullLoadRegions(regions,oDataCleansed.Realm,oDataCleansed.EventId,oDataCleansed.ItemId,oDataCleansed.EventVersion,srv);
                     
                  
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

async function _FullLoadRegions(regions,Realm,EventId,ItemId,EventVersion,srv){
    return new Promise(async (resolve,reject) =>{
       // const srv = cds.transaction(regions); 
        //Delete old records
        try {
            await srv.run(DELETE(EventSummary_Region).where({
                EventSummary_Realm : Realm ,
                EventSummary_EventId : EventId ,
                EventSummary_ItemId : ItemId ,
                EventSummary_EventVersion : EventVersion 
            }));
        }
        catch(e){
            logger.error(`Error on deleting from database, aborting file processing, details ${e} `);
            reject(e);
        }

        //Insert new records
        for (const re of regions){
            try {             
                
                re["EventSummary_Realm"] = Realm;
                re["EventSummary_EventId"] = EventId;
                re["EventSummary_ItemId"] = ItemId;
                re["EventSummary_EventVersion"] = EventVersion;
                await srv.run( INSERT .into (EventSummary_Region) .entries (re) ); 
           
            } catch (e) {                
                logger.error(`Error on inserting data in database, aborting file processing, details ${e} `);
                reject(e);
                break;
            }
        }
        resolve();
    });
}

async function _FullLoadSuppliers(suppliers,Realm,EventId,ItemId,EventVersion,srv){
    return new Promise(async (resolve,reject) =>{
       // const srv = cds.transaction(suppliers); 
        //Delete old records
        try {
            await srv.run(DELETE(EventSummary_BiddedSuppliers).where({
                EventSummary_Realm : Realm ,
                EventSummary_EventId : EventId ,
                EventSummary_ItemId : ItemId ,
                EventSummary_EventVersion : EventVersion 
            }));
        }
        catch(e){
            logger.error(`Error on deleting from database, aborting file processing, details ${e} `);
            reject(e);
        }

        //Insert new records
        for (const supp of suppliers){
            try {             
                
                supp["EventSummary_Realm"] = Realm;
                supp["EventSummary_EventId"] = EventId;
                supp["EventSummary_ItemId"] = ItemId;
                supp["EventSummary_EventVersion"] = EventVersion;
                await srv.run( INSERT .into (EventSummary_BiddedSuppliers) .entries (supp) ); 
           
            } catch (e) {                
                logger.error(`Error on inserting data in database, aborting file processing, details ${e} `);
                reject(e);
                break;
            }
        }
        resolve();
    });
}

async function _FullLoadCommodities(commodities,Realm,EventId,ItemId,EventVersion,srv){
    return new Promise(async (resolve,reject) =>{
       // const srv = cds.transaction(commodities); 
        //Delete old records
        try {
            await srv.run(DELETE(EventSummary_Commodity).where({
                EventSummary_Realm : Realm ,
                EventSummary_EventId : EventId ,
                EventSummary_ItemId : ItemId ,
                EventSummary_EventVersion : EventVersion 
            }));
        }
        catch(e){
            logger.error(`Error on deleting from database, aborting file processing, details ${e} `);
            reject(e);
        }

        //Insert new records
        for (const comm of commodities){
            try {             
                                
                comm["EventSummary_Realm"] = Realm;
                comm["EventSummary_EventId"] = EventId;
                comm["EventSummary_ItemId"] = ItemId;
                comm["EventSummary_EventVersion"] = EventVersion;
                await srv.run( INSERT .into (EventSummary_Commodity) .entries (comm) ); 
           
            } catch (e) {                
                logger.error(`Error on inserting data in database, aborting file processing, details ${e} `);
                reject(e);
                break;
            }
        }
        resolve();
    });
}


async function _FullLoadOrganization(organizations,Realm,EventId,ItemId,EventVersion,srv){
    return new Promise(async (resolve,reject) =>{
        //const srv = cds.transaction(organizations); 
        //Delete old records
        try {
            await srv.run(DELETE(EventSummary_Department).where({
                EventSummary_Realm : Realm ,
                EventSummary_EventId : EventId ,
                EventSummary_ItemId : ItemId ,
                EventSummary_EventVersion : EventVersion 
            }));
        }
        catch(e){
            logger.error(`Error on deleting from database, aborting file processing, details ${e} `);
            reject(e);
        }

        //Insert new records
        for (const org of organizations){
            try {             
                
                org["EventSummary_Realm"] = Realm;
                org["EventSummary_EventId"] = EventId;
                org["EventSummary_ItemId"] = ItemId;
                org["EventSummary_EventVersion"] = EventVersion;

                await srv.run( INSERT .into (EventSummary_Department) .entries (org) ); 
           
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