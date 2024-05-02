"use strict";

const cds = require("@sap/cds");
const logger = cds.log('logger');
const utils = require("../../../utils/Utils");


//Amount fields in object
function _getAmountPropertiesForDataCleaning () {
    return [
        "AmountInvoiced",
        "AmountAccepted",
        "AmountDisputed",
        "Amount",
        "PaidAmount",
        "DiscountAmount",
        "EstimatedSavings",
        "ChargeAmount",
        "TaxAmount",
        "TaxRate",
        "AccrualTaxAmount",
        "ExpectedTaxAmount",
        "OrigAmount",
        "OrigAmountInvoiced",
        "OrigAmountDisputed",
        "OrigAmountAccepted",
        "OrigPaidAmount",
        "OrigExpectedTaxAmount",
        "OrigAccrualTaxAmount"
    ];
}

function insertData(aData, realm)  {
    return new Promise(async function(resolve, reject)    {
   

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
                let res =  await SELECT.from ("sap.ariba.InvoiceLineItems_AN").where(
                    { 
                        Realm : oDataCleansed.Realm ,
                        InvoiceLineNumber : oDataCleansed.InvoiceLineNumber,
                        ParentInvoiceLineNumber : oDataCleansed.ParentInvoiceLineNumber,
                        InvoiceId : oDataCleansed.InvoiceId
                    });

                 if(res.length==0){
                     //New record, insert
                    await INSERT .into ("sap.ariba.InvoiceLineItems_AN") .entries (oDataCleansed) ;
                                  
                 }else{
                     //Update existing record
                    await UPDATE ("sap.ariba.InvoiceLineItems_AN") .set (oDataCleansed) .where(
                        { 
                            Realm : oDataCleansed.Realm ,
                            InvoiceLineNumber : oDataCleansed.InvoiceLineNumber,
                            ParentInvoiceLineNumber : oDataCleansed.ParentInvoiceLineNumber,
                            InvoiceId : oDataCleansed.InvoiceId
                        } );
                  
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
}