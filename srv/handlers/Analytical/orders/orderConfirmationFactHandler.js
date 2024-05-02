"use strict";

const cds = require("@sap/cds");
const logger = cds.log('logger');
const utils = require("../../../utils/Utils");


function _getAmountPropertiesForDataCleaning () {
    return [
        "Amount"
    ];
}

async function insertData(aData, realm)  {
    return new Promise(async function(resolve, reject) {


        if (!aData || aData.length === 0) {
            resolve(0);
            return;
        }        logger.info(`Processing ${aData.length} records`);
        var aCleaningProperties = _getAmountPropertiesForDataCleaning();
        let i=0;
        for(const oData of aData) {
            
            
            var oDataCleansed = utils.cleanData(aCleaningProperties, oData, realm);
            oDataCleansed = utils.processCustomFields(oDataCleansed);
            oDataCleansed = utils.flattenTypes(oDataCleansed);

            try {
                //Select record by Unique key
                let res =  await SELECT.from ("sap.ariba.OrderConfirmation_AN").where(
                    { OCId : oDataCleansed.OCId ,
                      OCLineNumber : oDataCleansed.OCLineNumber,
                      Realm : oDataCleansed.Realm  } );

                 if(res.length==0){
                     //New record, insert
                    await INSERT .into ("sap.ariba.OrderConfirmation_AN") .entries (oDataCleansed) ;
                                  
                 }else{
                     //Update existing record
                    await UPDATE ("sap.ariba.OrderConfirmation_AN") .set (oDataCleansed) .where(
                        { OCId : oDataCleansed.OCId ,
                          OCLineNumber : oDataCleansed.OCLineNumber,
                          Realm : oDataCleansed.Realm } );
                  
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


module.exports = {
    insertData
};