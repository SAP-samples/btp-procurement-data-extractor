"use strict";

const cds = require("@sap/cds");
const logger = cds.log('logger');
const utils = require("../../../utils/Utils");


//Amount fields in object
function _getAmountPropertiesForDataCleaning () {
    return [  
        "AclId"  ];
}

function _negativeValueCleansing (aCleaningProperties,oData) {

    aCleaningProperties && aCleaningProperties.forEach(function (oCleaningProperty) {
        oData[oCleaningProperty] = oData[oCleaningProperty] && oData[oCleaningProperty]<0?0:oData[oCleaningProperty];
    });

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
            oDataCleansed = _negativeValueCleansing(aCleaningProperties,oDataCleansed);
            oDataCleansed = utils.processCustomFields(oDataCleansed);
            oDataCleansed = utils.flattenTypes(oDataCleansed);


            try {
                //Full load behaviour for all records
                let sRealm = realm;
                let sItemId = oDataCleansed.ItemId;

                //1 Delete potential record dependencies
                try {
                    await DELETE("sap.ariba.ContractItem_ItemCommodity_AN").where({
                        ContractItem_Realm : sRealm ,
                        ContractItem_ItemId : sItemId
                    });
                    await DELETE("sap.ariba.ContractItem_CommodityEscalationClause_AN").where({
                        ContractItem_Realm : sRealm ,
                        ContractItem_ItemId : sItemId
                    });
                    await DELETE("sap.ariba.ContractItem_AN").where({
                        Realm : sRealm ,
                        ItemId : sItemId
                    });
                
                }
                catch(e){
                    logger.error(`Error on deleting from database, aborting file processing, details ${e} `);
                    reject(e);
                }

                //New record, insert
                await INSERT .into ("sap.ariba.ContractItem_AN") .entries (oDataCleansed) ;
                         
           
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
}