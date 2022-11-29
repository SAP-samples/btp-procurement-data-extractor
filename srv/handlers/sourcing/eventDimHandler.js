"use strict";

const cds = require("@sap/cds");
const logger = require("../../utils/logger");

const utils = require("../../utils/Utils");

const { Event } = cds.entities('sap.ariba');

//Amount fields in object
function _getAmountPropertiesForDataCleaning () {
    return [ 
        "AclId",
        "PricingConditionValidityPeriodType",
        "MaxVolumeThreshold",
        "AllowAlternativeBidding"];
}

function _negativeValueCleansing (aCleaningProperties,oData) {

    aCleaningProperties && aCleaningProperties.forEach(function (oCleaningProperty) {
        oData[oCleaningProperty] = oData[oCleaningProperty] && oData[oCleaningProperty]<0?0:oData[oCleaningProperty];
    });

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
            
            oDataCleansed = _negativeValueCleansing(aCleaningProperties,oDataCleansed);

            try {
                //Select record by Unique key
                let res =  await srv.run ( SELECT.from (Event).where(
                    {
                        Realm : oDataCleansed.Realm ,
                        EventId : oDataCleansed.EventId,
                        ItemId : oDataCleansed.ItemId  }  )
                 );

                 if(res.length==0){
                     //New record, insert
                    await srv.run( INSERT .into (Event) .entries (oDataCleansed) );

                 }else{
                     //Update existing record
                    await srv.run ( UPDATE (Event) .set (oDataCleansed) .where(
                        {
                            Realm : oDataCleansed.Realm ,
                            EventId : oDataCleansed.EventId,
                            ItemId : oDataCleansed.ItemId} )
                     );

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




module.exports = {
    insertData
}