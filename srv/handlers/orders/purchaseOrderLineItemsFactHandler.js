"use strict";

const cds = require("@sap/cds");
const { PurchaseOrderLineItems } = cds.entities('sap.ariba');

const logger = require("../../utils/logger");
const utils = require("../../utils/Utils");



function _getAmountPropertiesForDataCleaning () {
    return [
        "PriceVarCost",
        "Amount",
        "POChargeAmountInvoiced",
        "DiscountAmount",
        "POTaxAmountInvoiced",
        "LineItemCount",
        "POCount",
        "Quantity",
        "MaxAmount",
        "ExpectedAmount",
        "AmountLeftToInvoice",
        "AmountLeftToReconcile",
        "EstimatedSavings",
        "TaxAmount",
        "ChargeAmount",
        "PriceBasisQuantity",
        "ConversionFactor",
        "Duration",
        "AmountAccepted",
        "NumberAccepted",
        "AmountInvoiced",
        "ServiceAmountApproved",
        "ServiceAmountUnderApproval",
        "NumberInvoiced",
        "AmountReconciled",
        "NumberReconciled",
        "AmountBilled",
        "NumberBilled",
        "AmountCleared",
        "NumberCleared",
        "OriginatingSystemLineNumber",
        "NumberConfirmedAccepted",
        "NumberConfirmedAcceptedWithChanges",
        "NumberConfirmedRejected",
        "NumberConfirmedBackOrdered",
        "NumberConfirmedSubstituted",
        "OrigAmount",
        "OrigAmountAccepted",
        "OrigAmountInvoiced",
        "OrigAmountBilled",
        "OrigAmountCleared",
        "OrigAmountReconciled"
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
                let res =  await srv.run ( SELECT.from (PurchaseOrderLineItems).where(
                    { POId : oDataCleansed.POId ,
                      OrderID : oDataCleansed.OrderID ,
                      POLineNumber : oDataCleansed.POLineNumber ,
                      SplitAccountingNumber : oDataCleansed.SplitAccountingNumber ,
                      Realm : oDataCleansed.Realm } )
                 );

                 if(res.length==0){
                     //New record, insert
                    await srv.run( INSERT .into (PurchaseOrderLineItems) .entries (oDataCleansed) ); 
                                  
                 }else{
                     //Update existing record
                    await srv.run ( UPDATE (PurchaseOrderLineItems) .set (oDataCleansed) .where(
                        { POId : oDataCleansed.POId ,
                          OrderID : oDataCleansed.OrderID ,
                          POLineNumber : oDataCleansed.POLineNumber ,
                          SplitAccountingNumber : oDataCleansed.SplitAccountingNumber ,
                          Realm : oDataCleansed.Realm } )
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