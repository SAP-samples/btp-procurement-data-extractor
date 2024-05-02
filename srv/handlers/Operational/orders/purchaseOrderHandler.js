"use strict";

const cds = require("@sap/cds");
const logger = cds.log('logger');
const utils = require("../../../utils/Utils");


function _getAmountPropertiesForDataCleaning () {
    return [
        "NumberBilled",
        "NumberCleared"
    ];
}


async function insertData(aData, realm)  {
    return new Promise(async function(resolve, reject) {


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

            // Remove null properties
             oDataCleansed = utils.removeNullValues(oDataCleansed);
             oDataCleansed = utils.flattenTypes(oDataCleansed);


            // Todo: Model the association
            delete oDataCleansed.Attachments;

            try {
                //Full load behaviour for all records
                let sRealm = realm;
                let sUniqueName = oDataCleansed.UniqueName;

                //1 Delete potential record dependencies
                try {
                    await DELETE("sap.ariba.PurchaseOrder_LineItem_OP").where({
                        PurchaseOrder_Realm : sRealm ,
                        PurchaseOrder_UniqueName : sUniqueName
                    });
                    await DELETE("sap.ariba.PurchaseOrder_LineItem_SplitAccountings_OP").where({
                        LineItem_PurchaseOrder_Realm : sRealm ,
                        LineItem_PurchaseOrder_UniqueName : sUniqueName
                    });
                    await DELETE("sap.ariba.PurchaseOrder_OP").where({
                        Realm : sRealm ,
                        UniqueName : sUniqueName
                    });

                }
                catch(e){
                    logger.error(`Error on deleting from database, aborting file processing, details ${e} `);
                    reject(e);
                }


                //New record, insert
                await INSERT .into ("sap.ariba.PurchaseOrder_OP") .entries (oDataCleansed) ;



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

module.exports = {
    insertData
};