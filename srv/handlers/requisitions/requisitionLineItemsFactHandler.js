"use strict";

const cds = require("@sap/cds");
const { RequisitionLineItem } = cds.entities('sap.ariba');

const logger = require("../../utils/logger");
const utils = require("../../utils/Utils");


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
            var oDataCleansed = _DateFix(oDataCleansed);
            var oDataCleansed = utils.processCustomFields(oDataCleansed);
            try {
                //Select record by Unique key
                let res =  await srv.run ( SELECT.from (RequisitionLineItem).where(
                    {
                      RequisitionId : oDataCleansed.RequisitionId ,
                      RequisitionLineNumber : oDataCleansed.RequisitionLineNumber ,
                      SplitAccountingNumber : oDataCleansed.SplitAccountingNumber,
                      Realm : oDataCleansed.Realm } )
                 );

                 if(res.length==0){
                     //New record, insert
                    await srv.run( INSERT .into (RequisitionLineItem) .entries (oDataCleansed) ); 
                                  
                 }else{
                     //Update existing record
                    await srv.run ( UPDATE (RequisitionLineItem) .set (oDataCleansed) .where(
                        {
                            RequisitionId : oDataCleansed.RequisitionId ,
                            RequisitionLineNumber : oDataCleansed.RequisitionLineNumber ,
                            SplitAccountingNumber : oDataCleansed.SplitAccountingNumber,
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