"use strict";

const cds = require("@sap/cds");
const { PurchaseOrder, PurchaseOrder_LineItem, PurchaseOrder_LineItem_SplitAccountings } = cds.entities('sap.ariba');

const logger = require("../../utils/logger");
const utils = require("../../utils/Utils");


function _getAmountPropertiesForDataCleaning () {
    return [
        "NumberBilled",
        "NumberCleared"
    ];
}


async function insertData(aData, realm)  {
    return new Promise(async function(resolve, reject) {
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

            // Remove null properties
            var oDataCleansed = utils.removeNullValues(oDataCleansed);


            // Todo: Model the association
            delete oDataCleansed.Attachments;

            try {
                //Full load behaviour for all records
                let sRealm = realm;
                let sUniqueName = oDataCleansed.UniqueName;

                //1 Delete potential record dependencies
                try {
                    await srv.run(DELETE(PurchaseOrder_LineItem).where({
                        PurchaseOrder_Realm : sRealm ,
                        PurchaseOrder_UniqueName : sUniqueName
                    }));
                    await srv.run(DELETE(PurchaseOrder_LineItem_SplitAccountings).where({
                        LineItem_PurchaseOrder_Realm : sRealm ,
                        LineItem_PurchaseOrder_UniqueName : sUniqueName
                    }));
                    await srv.run(DELETE(PurchaseOrder).where({
                        Realm : sRealm ,
                        UniqueName : sUniqueName
                    }));

                }
                catch(e){
                    logger.error(`Error on deleting from database, aborting file processing, details ${e} `);
                    reject(e);
                }


                //New record, insert
                await srv.run( INSERT .into (PurchaseOrder) .entries (oDataCleansed) );



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
};