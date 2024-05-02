"use strict";

const cds = require("@sap/cds");
const logger = cds.log('logger');
const utils = require("../../../utils/Utils");


//Amount fields in object
function _getAmountPropertiesForDataCleaning () {
    return [
        "BaselineSpend",
        "ContractMonths",
        "ItemQuantity",
        "HistTotalCost",
        "ResvTotalCost",
        "IncumbentQuantity",
        "IncumbentTotalCost",
        "MktLeadQuantity",
        "MktLeadTotalCost",
        "InitialTotalCost",
        "LeadPreBidTotalCost",
        "AwardedQuantity",
        "AwardedTotalCost",
        "AwardedHistSpend",
        "PendingHistSpend",
        "LeadingSavings",
        "PendingSpend",
        "PendingSavings",
        "TargetSavings"
    ];
}

function _FlatteningData ( oData) {
    oData.EventId = oData.Event.EventId;
    oData.ItemId = oData.Event.ItemId;
    oData.EventVersion = oData.Event.VersionNumber;
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
                let res =  await SELECT.from ("sap.ariba.EventItemSummary_AN").where(
                    {
                        Realm : oDataCleansed.Realm ,
                        EventId : oDataCleansed.EventId ,
                        ItemId : oDataCleansed.ItemId ,
                        EventVersion : oDataCleansed.EventVersion
                    }  );

                 if(res.length==0){
                     //New record, insert
                    await INSERT .into ("sap.ariba.EventItemSummary_AN") .entries (oDataCleansed) ;

                 }else{
                     //Update existing record
                     //Full Load of SourcingProjects_Organization SourcingProjects_AllOwners SourcingProjects_Suppliers SourcingProjects_Commodity SourcingProjects_Region

                     let departments = oDataCleansed["Department"];
                     delete oDataCleansed["Department"];

                     let commodities = oDataCleansed["ItemCommodity"];
                     delete oDataCleansed["ItemCommodity"];

                     let suppliers = oDataCleansed["InvitedSuppliers"];
                     delete oDataCleansed["InvitedSuppliers"];

                     let regions = oDataCleansed["Region"];
                     delete oDataCleansed["Region"];

                     await UPDATE ("sap.ariba.EventItemSummary_AN") .set (oDataCleansed) .where(
                        {
                            Realm : oDataCleansed.Realm ,
                            EventId : oDataCleansed.EventId ,
                            ItemId : oDataCleansed.ItemId ,
                            EventVersion : oDataCleansed.EventVersion
                        } );

                     await _FullLoadOrganization(departments,oDataCleansed.Realm,oDataCleansed.EventId,oDataCleansed.ItemId,oDataCleansed.EventVersion);
                     await _FullLoadCommodities(commodities,oDataCleansed.Realm,oDataCleansed.EventId,oDataCleansed.ItemId,oDataCleansed.EventVersion);
                     await _FullLoadSuppliers(suppliers,oDataCleansed.Realm,oDataCleansed.EventId,oDataCleansed.ItemId,oDataCleansed.EventVersion);
                     await _FullLoadRegions(regions,oDataCleansed.Realm,oDataCleansed.EventId,oDataCleansed.ItemId,oDataCleansed.EventVersion);


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

async function _FullLoadRegions(regions,Realm,EventId,ItemId,EventVersion){
    return new Promise(async (resolve,reject) =>{
        //Delete old records
        try {
            await DELETE("sap.ariba.EventItemSummary_Region_AN").where({
                EventItemSummary_Realm : Realm ,
                EventItemSummary_EventId : EventId ,
                EventItemSummary_ItemId : ItemId ,
                EventItemSummary_EventVersion : EventVersion
            });
        }
        catch(e){
            logger.error(`Error on deleting from database, aborting file processing, details ${e} `);
            reject(e);
        }

        //Insert new records
        for (const re of regions){
            try {

                re["EventItemSummary_Realm"] = Realm;
                re["EventItemSummary_EventId"] = EventId;
                re["EventItemSummary_ItemId"] = ItemId;
                re["EventItemSummary_EventVersion"] = EventVersion;
                await INSERT .into ("sap.ariba.EventItemSummary_Region_AN") .entries (re) ;

            } catch (e) {
                logger.error(`Error on inserting data in database, aborting file processing, details ${e} `);
                reject(e);
                break;
            }
        }
        resolve();
    });
}

async function _FullLoadSuppliers(suppliers,Realm,EventId,ItemId,EventVersion){
    return new Promise(async (resolve,reject) =>{
        //Delete old records
        try {
            await DELETE("sap.ariba.EventItemSummary_InvitedSuppliers_AN").where({
                EventItemSummary_Realm : Realm ,
                EventItemSummary_EventId : EventId ,
                EventItemSummary_ItemId : ItemId ,
                EventItemSummary_EventVersion : EventVersion
            });
        }
        catch(e){
            logger.error(`Error on deleting from database, aborting file processing, details ${e} `);
            reject(e);
        }

        //Insert new records
        for (const supp of suppliers){
            try {

                supp["EventItemSummary_Realm"] = Realm;
                supp["EventItemSummary_EventId"] = EventId;
                supp["EventItemSummary_ItemId"] = ItemId;
                supp["EventItemSummary_EventVersion"] = EventVersion;
                await INSERT .into ("sap.ariba.EventItemSummary_InvitedSuppliers_AN") .entries (supp) ;

            } catch (e) {
                logger.error(`Error on inserting data in database, aborting file processing, details ${e} `);
                reject(e);
                break;
            }
        }
        resolve();
    });
}

async function _FullLoadCommodities(commodities,Realm,EventId,ItemId,EventVersion){
    return new Promise(async (resolve,reject) =>{
        //Delete old records
        try {
            await DELETE("sap.ariba.EventItemSummary_ItemCommodity_AN").where({
                EventItemSummary_Realm : Realm ,
                EventItemSummary_EventId : EventId ,
                EventItemSummary_ItemId : ItemId ,
                EventItemSummary_EventVersion : EventVersion
            });
        }
        catch(e){
            logger.error(`Error on deleting from database, aborting file processing, details ${e} `);
            reject(e);
        }

        //Insert new records
        for (const comm of commodities){
            try {

                comm["EventItemSummary_Realm"] = Realm;
                comm["EventItemSummary_EventId"] = EventId;
                comm["EventItemSummary_ItemId"] = ItemId;
                comm["EventItemSummary_EventVersion"] = EventVersion;
                await INSERT .into ("sap.ariba.EventItemSummary_ItemCommodity_AN") .entries (comm) ;

            } catch (e) {
                logger.error(`Error on inserting data in database, aborting file processing, details ${e} `);
                reject(e);
                break;
            }
        }
        resolve();
    });
}


async function _FullLoadOrganization(organizations,Realm,EventId,ItemId,EventVersion){
    return new Promise(async (resolve,reject) =>{
        //Delete old records
        try {
            await DELETE("sap.ariba.EventItemSummary_Department_AN").where({
                EventItemSummary_Realm : Realm ,
                EventItemSummary_EventId : EventId ,
                EventItemSummary_ItemId : ItemId ,
                EventItemSummary_EventVersion : EventVersion
            });
        }
        catch(e){
            logger.error(`Error on deleting from database, aborting file processing, details ${e} `);
            reject(e);
        }

        //Insert new records
        for (const org of organizations){
            try {

                org["EventItemSummary_Realm"] = Realm;
                org["EventItemSummary_EventId"] = EventId;
                org["EventItemSummary_ItemId"] = ItemId;
                org["EventItemSummary_EventVersion"] = EventVersion;

                await INSERT .into ("sap.ariba.EventItemSummary_Department_AN") .entries (org) ;

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