"use strict";

const cds = require("@sap/cds");
const logger = cds.log('logger');
const utils = require("../../../utils/Utils");


//Amount fields in object
function _getAmountPropertiesForDataCleaning () {
    return [
        "BaselineSpend",
        "TargetSavingsPct",
        "ContractMonths",
    ];
}

function _FlatteningData (oData) {

    //Structure flattening
    oData.EventId = oData.Event.EventId;
    oData.ItemId = oData.Event.ItemId;
    oData.EventVersion = oData.Event.VersionNumber;
    oData.BidderUserId = oData.Bidder.UserId;
    oData.SupplierId = oData.Supplier.SupplierId;
    return oData;
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
            oDataCleansed = _FlatteningData(oDataCleansed);
            oDataCleansed = utils.processCustomFields(oDataCleansed);
            oDataCleansed = utils.flattenTypes(oDataCleansed);

            try {
                //Select record by Unique key
                let res =  await SELECT.from ("sap.ariba.EventParticipations_AN").where(
                    {
                        Realm : oDataCleansed.Realm ,
                        EventId : oDataCleansed.EventId ,
                        ItemId : oDataCleansed.ItemId ,
                        EventVersion : oDataCleansed.EventVersion,
                        BidderUserId : oDataCleansed.BidderUserId,
                        SupplierId : oDataCleansed.SupplierId
                    }  );

                 if(res.length==0){
                     //New record, insert
                    await INSERT .into ("sap.ariba.EventParticipations_AN") .entries (oDataCleansed) ;

                 }else{
                     //Update existing record
                     //Full Load of SourcingProjects_Organization SourcingProjects_AllOwners SourcingProjects_Suppliers SourcingProjects_Commodity SourcingProjects_Region

                     let departments = oDataCleansed["Department"];
                     delete oDataCleansed["Department"];

                     let commodities = oDataCleansed["Commodity"];
                     delete oDataCleansed["Commodity"];

                     let regions = oDataCleansed["Region"];
                     delete oDataCleansed["Region"];

                     await UPDATE ("sap.ariba.EventParticipations_AN") .set (oDataCleansed) .where(
                        {
                            Realm : oDataCleansed.Realm ,
                            EventId : oDataCleansed.EventId ,
                            ItemId : oDataCleansed.ItemId ,
                            EventVersion : oDataCleansed.EventVersion,
                            BidderUserId : oDataCleansed.BidderUserId,
                            SupplierId : oDataCleansed.SupplierId
                        } );

                     await _FullLoadOrganization(departments,oDataCleansed.Realm,oDataCleansed.EventId,oDataCleansed.ItemId,oDataCleansed.EventVersion,oDataCleansed.BidderUserId,oDataCleansed.SupplierId);
                     await _FullLoadCommodities(commodities,oDataCleansed.Realm,oDataCleansed.EventId,oDataCleansed.ItemId,oDataCleansed.EventVersion,oDataCleansed.BidderUserId,oDataCleansed.SupplierId);
                     await _FullLoadRegions(regions,oDataCleansed.Realm,oDataCleansed.EventId,oDataCleansed.ItemId,oDataCleansed.EventVersion,oDataCleansed.BidderUserId,oDataCleansed.SupplierId);


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

async function _FullLoadRegions(regions,Realm,EventId,ItemId,EventVersion,BidderUserId,SupplierId){
    return new Promise(async (resolve,reject) =>{
        //Delete old records
        try {
            await DELETE("sap.ariba.EventParticipations_Region_AN").where({
                EventParticipations_Realm : Realm ,
                EventParticipations_EventId : EventId ,
                EventParticipations_ItemId : ItemId ,
                EventParticipations_EventVersion : EventVersion,
                EventParticipations_BidderUserId : BidderUserId,
                EventParticipations_SupplierId : SupplierId
            });
        }
        catch(e){
            logger.error(`Error on deleting from database, aborting file processing, details ${e} `);
            reject(e);
        }

        //Insert new records
        for (const re of regions){
            try {

                re["EventParticipations_Realm"] = Realm;
                re["EventParticipations_EventId"] = EventId;
                re["EventParticipations_ItemId"] = ItemId;
                re["EventParticipations_EventVersion"] = EventVersion;
                re["EventParticipations_BidderUserId"] = BidderUserId;
                re["EventParticipations_SupplierId"] = SupplierId;
                await INSERT .into ("sap.ariba.EventParticipations_Region_AN") .entries (re) ;

            } catch (e) {
                logger.error(`Error on inserting data in database, aborting file processing, details ${e} `);
                reject(e);
                break;
            }
        }
        resolve();
    });
}

async function _FullLoadCommodities(commodities,Realm,EventId,ItemId,EventVersion,BidderUserId,SupplierId){
    return new Promise(async (resolve,reject) =>{
        //Delete old records
        try {
            await DELETE("sap.ariba.EventParticipations_Commodity_AN").where({
                EventParticipations_Realm : Realm ,
                EventParticipations_EventId : EventId ,
                EventParticipations_ItemId : ItemId ,
                EventParticipations_EventVersion : EventVersion,
                EventParticipations_BidderUserId : BidderUserId,
                EventParticipations_SupplierId : SupplierId
            });
        }
        catch(e){
            logger.error(`Error on deleting from database, aborting file processing, details ${e} `);
            reject(e);
        }

        //Insert new records
        for (const comm of commodities){
            try {

                comm["EventParticipations_Realm"] = Realm;
                comm["EventParticipations_EventId"] = EventId;
                comm["EventParticipations_ItemId"] = ItemId;
                comm["EventParticipations_EventVersion"] = EventVersion;
                comm["EventParticipations_BidderUserId"] = BidderUserId;
                comm["EventParticipations_SupplierId"] = SupplierId;
                await INSERT .into ("sap.ariba.EventParticipations_Commodity_AN") .entries (comm) ;

            } catch (e) {
                logger.error(`Error on inserting data in database, aborting file processing, details ${e} `);
                reject(e);
                break;
            }
        }
        resolve();
    });
}


async function _FullLoadOrganization(organizations,Realm,EventId,ItemId,EventVersion,BidderUserId,SupplierId){
    return new Promise(async (resolve,reject) =>{
        //Delete old records
        try {
            await DELETE("sap.ariba.EventParticipations_Department_AN").where({
                EventParticipations_Realm : Realm ,
                EventParticipations_EventId : EventId ,
                EventParticipations_ItemId : ItemId ,
                EventParticipations_EventVersion : EventVersion,
                EventParticipations_BidderUserId : BidderUserId,
                EventParticipations_SupplierId : SupplierId
            });
        }
        catch(e){
            logger.error(`Error on deleting from database, aborting file processing, details ${e} `);
            reject(e);
        }

        //Insert new records
        for (const org of organizations){
            try {

                org["EventParticipations_Realm"] = Realm;
                org["EventParticipations_EventId"] = EventId;
                org["EventParticipations_ItemId"] = ItemId;
                org["EventParticipations_EventVersion"] = EventVersion;
                org["EventParticipations_BidderUserId"] = BidderUserId;
                org["EventParticipations_SupplierId"] = SupplierId;

                await INSERT .into ("sap.ariba.EventParticipations_Department_AN") .entries (org) ;

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