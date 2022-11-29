"use strict";

const cds = require("@sap/cds");
const logger = require("../../utils/logger");
const utils = require("../../utils/Utils");


const { InvoiceLineItemsSA } = cds.entities('sap.ariba');

//Amount fields in object
function _getAmountPropertiesForDataCleaning () {
    return [
        "Amount",
        "POAmount"
    ];
}

function insertData(aData, realm)  {
    return new Promise(async function(resolve, reject)    {
   
        const srv = cds.transaction(aData);
        if (!aData || aData.length === 0) {
            resolve(0);
            return;
        }        logger.info(`Processing ${aData.length} records`);
        var aCleaningProperties = _getAmountPropertiesForDataCleaning();
        let i=0;
        for(const oData of aData) {
            
            var oDataCleansed = utils.cleanData(aCleaningProperties, oData, realm);
            try {
                //Select record by Unique key
                let res =  await srv.run ( SELECT.from (InvoiceLineItemsSA).where(
                    { 
                        Realm : oDataCleansed.Realm ,
                        InvoiceId : oDataCleansed.InvoiceId
                    })
                 );

                 if(res.length==0){
                     //New record, insert
                    await srv.run( INSERT .into (InvoiceLineItemsSA) .entries (oDataCleansed) ); 
                                  
                 }else{
                     //Update existing record
                    await srv.run ( UPDATE (InvoiceLineItemsSA) .set (oDataCleansed) .where(
                        { 
                            Realm : oDataCleansed.Realm ,
                            InvoiceId : oDataCleansed.InvoiceId 
                        } )
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