"use strict";

const cds = require("@sap/cds");
const logger = cds.log('logger');
const utils = require("../../../utils/Utils");



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
                let res =  await SELECT.from ("sap.ariba.PurchaseOrderLineItems_AN").where(
                    { POId : oDataCleansed.POId ,
                      OrderID : oDataCleansed.OrderID ,
                      POLineNumber : oDataCleansed.POLineNumber ,
                      SplitAccountingNumber : oDataCleansed.SplitAccountingNumber ,
                      Realm : oDataCleansed.Realm } );

                 if(res.length==0){
                     //New record, insert
                    await INSERT .into ("sap.ariba.PurchaseOrderLineItems_AN") .entries (oDataCleansed) ;
                                  
                 }else{
                     //Update existing record
                    await UPDATE ("sap.ariba.PurchaseOrderLineItems_AN") .set (oDataCleansed) .where(
                        { POId : oDataCleansed.POId ,
                          OrderID : oDataCleansed.OrderID ,
                          POLineNumber : oDataCleansed.POLineNumber ,
                          SplitAccountingNumber : oDataCleansed.SplitAccountingNumber ,
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