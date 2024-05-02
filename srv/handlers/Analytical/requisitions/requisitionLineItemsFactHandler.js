"use strict";

const cds = require("@sap/cds");
const logger = cds.log('logger');
const utils = require("../../../utils/Utils");


function _getAmountPropertiesForDataCleaning () {
    return [
        "PriceVarCost",
        "Amount",
        "OrigAmount",
        "MaxAmount",
        "ExpectedAmount",
        "LineItemCount",
        "RequisitionCount",
        "Quantity",
        "TaxAmount",
        "ChargeAmount",
        "PriceBasisQuantity",
        "ConversionFactor",
        "ReleasedAmount",
        "ConsumedAmount",
        "DiscountAmount",
        "ApprovalTime"
    ];
}

function _DateFix (oData) {

    oData.ApprovedDate = oData.ApprovedDate!=""? oData.ApprovedDate : "1970-01-01T00:00:00Z";
    return oData;
}

async function insertData(aData, realm)  {
    return new Promise(async function(resolve, reject) {


        if (!aData || aData.length === 0) {
            resolve(0);
            return;
        }
        logger.info(`Processing ${aData.length} records`);
        var aCleaningProperties = _getAmountPropertiesForDataCleaning();
        let i=0;
        for(const oData of aData) {
            
            var oDataCleansed = utils.cleanData(aCleaningProperties, oData, realm);            
            oDataCleansed = _DateFix(oDataCleansed);
            oDataCleansed = utils.processCustomFields(oDataCleansed);
            oDataCleansed = utils.flattenTypes(oDataCleansed);

            try {
                //Select record by Unique key
                let res =  await SELECT.from ("sap.ariba.RequisitionLineItem_AN").where(
                    {
                      RequisitionId : oDataCleansed.RequisitionId ,
                      RequisitionLineNumber : oDataCleansed.RequisitionLineNumber ,
                      SplitAccountingNumber : oDataCleansed.SplitAccountingNumber,
                      Realm : oDataCleansed.Realm
                    } );

                 if(res.length==0){
                     //New record, insert
                    await INSERT .into ("sap.ariba.RequisitionLineItem_AN") .entries (oDataCleansed) ;
                                  
                 }else{
                     //Update existing record
                    await UPDATE ("sap.ariba.RequisitionLineItem_AN") .set (oDataCleansed) .where(
                        {
                            RequisitionId : oDataCleansed.RequisitionId ,
                            RequisitionLineNumber : oDataCleansed.RequisitionLineNumber ,
                            SplitAccountingNumber : oDataCleansed.SplitAccountingNumber,
                            Realm : oDataCleansed.Realm
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
};