"use strict";

const cds = require("@sap/cds");
const logger = require("../../utils/logger");
const utils = require("../../utils/Utils");


const { SupplierParticipations, SupplierParticipations_Department, SupplierParticipations_Region,
    SupplierParticipations_ItemCommodity} = cds.entities('sap.ariba');

//Amount fields in object
function _getAmountPropertiesForDataCleaning () {
    return [    ];
}

function _FlatteningData (oData) {

    //Structure flattening
    oData.EventId = oData.Event.EventId;
    oData.ItemId = oData.Event.ItemId;
    oData.SupplierId = oData.Supplier.SupplierId;
    oData.BidderUserId = oData.Bidder.UserId;
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
            var oDataCleansed = _FlatteningData(oData);
            var oDataCleansed = utils.processCustomFields(oDataCleansed);
            try {
                //Select record by Unique key
                let res =  await srv.run ( SELECT.from (SupplierParticipations).where(
                    { 
                        Realm : oDataCleansed.Realm ,
                        EventId : oDataCleansed.EventId,
                        ItemId : oDataCleansed.ItemId,
                        SupplierId : oDataCleansed.SupplierId,
                        BidderUserId : oDataCleansed.BidderUserId }  )
                 );

                 if(res.length==0){
                     //New record, insert
                    await srv.run( INSERT .into (SupplierParticipations) .entries (oDataCleansed) ); 
                                  
                 }else{
                     //Update existing record
                     //Full Load of SourcingProjects_Organization SourcingProjects_AllOwners SourcingProjects_Suppliers SourcingProjects_Commodity SourcingProjects_Region
                     
                     let itemCommodities = oDataCleansed["ItemCommodity"];
                     delete oDataCleansed["ItemCommodity"];
                    
                     let regions = oDataCleansed["Region"];
                     delete oDataCleansed["Region"];

                     let organizations = oDataCleansed["Department"];
                     delete oDataCleansed["Department"];   
                    
                     await srv.run ( UPDATE (SupplierParticipations) .set (oDataCleansed) .where(
                        {                                 
                            Realm : oDataCleansed.Realm ,
                            EventId : oDataCleansed.EventId,
                            ItemId : oDataCleansed.ItemId,
                            SupplierId : oDataCleansed.SupplierId,
                            BidderUserId : oDataCleansed.BidderUserId  } )
                     );

                     await _FullLoadItemCommodities(itemCommodities,oDataCleansed.Realm,oDataCleansed.EventId,oDataCleansed.ItemId,
                        oDataCleansed.SupplierId,oDataCleansed.BidderUserId,srv);
                     await _FullLoadRegions(regions,oDataCleansed.Realm,oDataCleansed.EventId,oDataCleansed.ItemId,
                        oDataCleansed.SupplierId,oDataCleansed.BidderUserId,srv);
                     await _FullLoadOrganization(organizations,oDataCleansed.Realm,oDataCleansed.EventId,oDataCleansed.ItemId,
                        oDataCleansed.SupplierId,oDataCleansed.BidderUserId,srv);
                     
                  
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

async function _FullLoadRegions(regions,Realm,EventId,ItemId,SupplierId,BidderUserId,srv){
    return new Promise(async (resolve,reject) =>{
       // const srv = cds.transaction(regions); 
        //Delete old records
        try {
            await srv.run(DELETE(SupplierParticipations_Region).where({
                SupplierParticipation_EventId : EventId ,
                SupplierParticipation_Realm : Realm ,
                SupplierParticipation_ItemId : ItemId ,
                SupplierParticipation_SupplierId : SupplierId ,
                SupplierParticipation_BidderUserId : BidderUserId 
            }));
        }
        catch(e){
            logger.error(`Error on deleting from database, aborting file processing, details ${e} `);
            reject(e);
        }

        //Insert new records
        for (const re of regions){
            try {             
                
                re["SupplierParticipation_Realm"] = Realm;
                re["SupplierParticipation_EventId"] = EventId;
                re["SupplierParticipation_ItemId"] = ItemId;
                re["SupplierParticipation_SupplierId"] = SupplierId;
                re["SupplierParticipation_BidderUserId"] = BidderUserId;
                await srv.run( INSERT .into (SupplierParticipations_Region) .entries (re) ); 
           
            } catch (e) {                
                logger.error(`Error on inserting data in database, aborting file processing, details ${e} `);
                reject(e);
                break;
            }
        }
        resolve();
    });
}

async function _FullLoadItemCommodities(commodities,Realm,EventId,ItemId,SupplierId,BidderUserId,srv){
    return new Promise(async (resolve,reject) =>{
       // const srv = cds.transaction(commodities); 
        //Delete old records
        try {
            await srv.run(DELETE(SupplierParticipations_ItemCommodity).where({
                SupplierParticipation_EventId : EventId ,
                SupplierParticipation_Realm : Realm ,
                SupplierParticipation_ItemId : ItemId ,
                SupplierParticipation_SupplierId : SupplierId ,
                SupplierParticipation_BidderUserId : BidderUserId 
            }));
        }
        catch(e){
            logger.error(`Error on deleting from database, aborting file processing, details ${e} `);
            reject(e);
        }

        //Insert new records
        for (const comm of commodities){
            try {             
                
                comm["SupplierParticipation_Realm"] = Realm;
                comm["SupplierParticipation_EventId"] = EventId;
                comm["SupplierParticipation_ItemId"] = ItemId;
                comm["SupplierParticipation_SupplierId"] = SupplierId;
                comm["SupplierParticipation_BidderUserId"] = BidderUserId;
                await srv.run( INSERT .into (SupplierParticipations_ItemCommodity) .entries (comm) ); 
           
            } catch (e) {                
                logger.error(`Error on inserting data in database, aborting file processing, details ${e} `);
                reject(e);
                break;
            }
        }
        resolve();
    });
}

async function _FullLoadOrganization(organizations,Realm,EventId,ItemId,SupplierId,BidderUserId,srv){
    return new Promise(async (resolve,reject) =>{
        //const srv = cds.transaction(organizations); 
        //Delete old records
        try {
            await srv.run(DELETE(SupplierParticipations_Department).where({
                SupplierParticipation_EventId : EventId ,
                SupplierParticipation_Realm : Realm ,
                SupplierParticipation_ItemId : ItemId ,
                SupplierParticipation_SupplierId : SupplierId ,
                SupplierParticipation_BidderUserId : BidderUserId 
            }));
        }
        catch(e){
            logger.error(`Error on deleting from database, aborting file processing, details ${e} `);
            reject(e);
        }

        //Insert new records
        for (const org of organizations){
            try {             
                
                org["SupplierParticipation_Realm"] = Realm;
                org["SupplierParticipation_EventId"] = EventId;
                org["SupplierParticipation_ItemId"] = ItemId;
                org["SupplierParticipation_SupplierId"] = SupplierId;
                org["SupplierParticipation_BidderUserId"] = BidderUserId;
                await srv.run( INSERT .into (SupplierParticipations_Department) .entries (org) ); 
           
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