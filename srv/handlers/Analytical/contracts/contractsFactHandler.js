"use strict";

const cds = require("@sap/cds");
const logger = cds.log('logger');
const utils = require("../../../utils/Utils");


//Amount fields in object
function _getAmountPropertiesForDataCleaning () {
    return [
        "AmountPercentLeft", 
        "AmountReconciledPercentLeft",
        "AmountInvoicedPercentLeft",
        "AmountReconciledWithoutTCPercentLeft",
        "AmountInvoicedWithoutTCPercentLeft",
        "Duration",
        "UsedAmount",
        "OrigUsedAmount",
        "AmountOrderedCumulated",
        "OrigAmountOrderedCumulated",
        "AmountReconciled",
        "OrigAmountReconciled",
        "AmountReconciledCumulated",
        "OrigAmountReconciledCumulated",
        "AmountInvoiced",
        "OrigAmountInvoiced",
        "AmountInvoicedCumulated",
        "OrigAmountInvoicedCumulated",
        "AmountLeft",
        "OrigAmountLeft",
        "MinCommitment",
        "OrigMinCommitment",
        "MaxCommitment",
        "OrigMaxCommitment",
        "AmountReconciledWithoutTaxesAndCharges",
        "AmountInvoicedWithoutTaxesAndCharges",
        "OrigAmountReconciledWithoutTaxesAndCharges",
        "OrigAmountInvoicedWithoutTaxesAndCharges"
    ];
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
            oDataCleansed = utils.processCustomFields(oDataCleansed);
            oDataCleansed = utils.flattenTypes(oDataCleansed);

            try {
                //Select record by Unique key
                let res = await SELECT.from ("sap.ariba.Contracts_AN").where(
                    { 
                        Realm : oDataCleansed.Realm ,
                        ContractId : oDataCleansed.ContractId
                    }  );

                 if(res.length==0){
                     //New record, insert
                    await INSERT .into ("sap.ariba.Contracts_AN") .entries (oDataCleansed) ;
                                  
                 }else{
                     //Update existing record
                    await UPDATE ("sap.ariba.Contracts_AN") .set (oDataCleansed) .where(
                        { 
                            Realm : oDataCleansed.Realm ,
                            ContractId : oDataCleansed.ContractId
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