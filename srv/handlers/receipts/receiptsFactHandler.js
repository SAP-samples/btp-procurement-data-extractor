"use strict";

const cds = require("@sap/cds");
const { Receipt } = cds.entities('sap.ariba');

const logger = require("../../utils/logger");
const utils = require("../../utils/Utils");


function _getAmountPropertiesForDataCleaning () {
    return [
        "NumberPreviouslyAccepted",
        "NumberAccepted",
        "NumberPreviouslyRejected",
        "NumberRejected",
        "AmountPreviouslyAccepted",
        "AmountAccepted",
        "OrigAmountAccepted",
        "AmountPreviouslyRejected",
        "AmountRejected",
        "OrigAmountRejected",
        "GrossAmountAccepted",
        "GrossAmountRejected",
        "TotalAmount",
        "OrigTotalAmount"
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

            try {
                //Select record by Unique key
                let res =  await srv.run ( SELECT.from (Receipt).where(
                    {
                      ReceiptId : oDataCleansed.ReceiptId ,
                      Realm : oDataCleansed.Realm } )
                 );

                 if(res.length==0){
                     //New record, insert
                    await srv.run( INSERT .into (Receipt) .entries (oDataCleansed) ); 
                                  
                 }else{
                     //Update existing record
                    await srv.run ( UPDATE (Receipt) .set (oDataCleansed) .where(
                        {
                            ReceiptId : oDataCleansed.ReceiptId ,
                            Realm : oDataCleansed.Realm  } )
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
};