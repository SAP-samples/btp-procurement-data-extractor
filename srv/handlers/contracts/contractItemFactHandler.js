"use strict";

const cds = require("@sap/cds");
const logger = require("../../utils/logger");
const utils = require("../../utils/Utils");


const { ContractItem,ContractItem_ItemCommodity,ContractItem_CommodityEscalationClause } = cds.entities('sap.ariba');

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
            oDataCleansed = utils.processCustomFields(oDataCleansed);
            

            try {
                //Full load behaviour for all records
                let sRealm = realm;
                let sItemId = oDataCleansed.ItemId;

                //1 Delete potential record dependencies
                try {
                    await srv.run(DELETE(ContractItem_ItemCommodity).where({
                        ContractItem_Realm : sRealm ,
                        ContractItem_ItemId : sItemId
                    }));
                    await srv.run(DELETE(ContractItem_CommodityEscalationClause).where({
                        ContractItem_Realm : sRealm ,
                        ContractItem_ItemId : sItemId
                    }));
                    await srv.run(DELETE(ContractItem).where({
                        Realm : sRealm ,
                        ItemId : sItemId
                    }));
                
                }
                catch(e){
                    logger.error(`Error on deleting from database, aborting file processing, details ${e} `);
                    reject(e);
                }

                //New record, insert
                await srv.run( INSERT .into (ContractItem) .entries (oDataCleansed) ); 
                         
           
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