"use strict";

const cds = require("@sap/cds");
const { Payment } = cds.entities('sap.ariba');

const logger = require("../../utils/logger");
const utils = require("../../utils/Utils");


function _getAmountPropertiesForDataCleaning () {
    return [
        "ToPayAmount",
        "MaxAvailableDiscount",
        "PaidAmount",
        "OrigPaidAmount",
        "DiscountEarned",
        "OrigDiscountEarned",
        "InvoiceAmount",
        "OrigInvoiceAmount",
        "AdjustmentAmount",
        "OrigAdjustmentAmount",
        "GrossAmount",
        "OrigGrossAmount"
    ];
}

async function insertData(aData, realm)  {
    return new Promise(async function(resolve, reject) {
        const srv = cds.transaction(aData);

        if (!aData || aData.length === 0) {
            resolve(0);
            return;
        }        logger.info(`Processing ${aData.length} records`);
        var aCleaningProperties = _getAmountPropertiesForDataCleaning();
        let i=0;
        for(const oData of aData) {
            
            var oDataCleansed = utils.cleanData(aCleaningProperties, oData, realm);
            var oDataCleansed = utils.processCustomFields(oDataCleansed);

            try {
                //Select record by Unique key
                let res =  await srv.run ( SELECT.from (Payment).where(
                    {
                      PaymentId : oDataCleansed.PaymentId ,
                      Realm : oDataCleansed.Realm } )
                 );

                 if(res.length==0){
                     //New record, insert
                    await srv.run( INSERT .into (Payment) .entries (oDataCleansed) ); 
                                  
                 }else{
                     //Update existing record
                    await srv.run ( UPDATE (Payment) .set (oDataCleansed) .where(
                        {
                            PaymentId : oDataCleansed.PaymentId ,
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