"use strict";

const cds = require("@sap/cds");
const logger = cds.log('logger');
const utils = require("../../../utils/Utils");


function _getAmountPropertiesForDataCleaning () {
    return [
        "PreviousApprovalRequestsVersion",
        "TaxExchangeRate"
    ];
}

function _normalizeApprovers(oData){
    //Normalizing Approver property to Approvers as an Array of approvers
    if(oData && oData.ApprovalRequests){
        for (let i = 0; i < oData.ApprovalRequests.length; i++) {
            let aApprovers = oData.ApprovalRequests[i].Approver instanceof Array ?
                oData.ApprovalRequests[i].Approver.map((elt)=>{return elt}):
                new Array(oData.ApprovalRequests[i].Approver);

            delete oData.ApprovalRequests[i].Approver;
            oData.ApprovalRequests[i]["Approvers"] = aApprovers;
       }
    }
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
            //Sanitize empty records)
            if (oDataCleansed.Records){
                oDataCleansed.Records = oDataCleansed.Records.filter(function(record) { return record.Comment !== null; });                
            }
            
            oDataCleansed = utils.processCustomFields(oDataCleansed);

            // Remove null properties
            oDataCleansed = utils.removeNullValues(oDataCleansed);
            oDataCleansed = _normalizeApprovers(oDataCleansed);
            oDataCleansed = utils.flattenTypes(oDataCleansed);


            // Todo: Model the association
            delete oDataCleansed.Attachments;

            try {
                //Full load behaviour for all records
                let sRealm = realm;
                let sUniqueName = oDataCleansed.UniqueName;

                //1 Delete potential record dependencies
                try {
                    await DELETE("sap.ariba.InvoiceReconciliation_ApprovalRequests_Approver_OP").where({                        InvoiceReconciliationApprovalRequests_InvoiceReconciliation_Realm : sRealm ,
                        InvoiceReconciliationApprovalRequests_InvoiceReconciliation_UniqueName : sUniqueName
                    });
                    await DELETE("sap.ariba.InvoiceReconciliation_ApprovalRequests_OP").where({
                        InvoiceReconciliation_Realm : sRealm ,
                        InvoiceReconciliation_UniqueName : sUniqueName
                    });
                    await DELETE("sap.ariba.InvoiceReconciliation_ApprovalRecords_OP").where({
                        InvoiceReconciliation_Realm : sRealm ,
                        InvoiceReconciliation_UniqueName : sUniqueName
                    });
                    await DELETE("sap.ariba.InvoiceReconciliation_LineItem_OP").where({
                        InvoiceReconciliation_Realm : sRealm ,
                        InvoiceReconciliation_UniqueName : sUniqueName
                    });
                    await DELETE("sap.ariba.InvoiceReconciliation_Payments_OP").where({
                        InvoiceReconciliation_Realm : sRealm ,
                        InvoiceReconciliation_UniqueName : sUniqueName
                    });
                    await DELETE("sap.ariba.InvoiceReconciliation_Exceptions_OP").where({
                        InvoiceReconciliation_Realm : sRealm ,
                        InvoiceReconciliation_UniqueName : sUniqueName
                    });
                    await DELETE("sap.ariba.InvoiceReconciliation_Records_OP").where({
                        InvoiceReconciliation_Realm : sRealm ,
                        InvoiceReconciliation_UniqueName : sUniqueName
                    });
                    await DELETE("sap.ariba.InvoiceReconciliation_RejectionReasons_OP").where({
                        InvoiceReconciliation_Realm : sRealm ,
                        InvoiceReconciliation_UniqueName : sUniqueName
                    });
                    await DELETE("sap.ariba.InvoiceReconciliation_LineItem_SplitAccountings_OP").where({
                        LineItem_InvoiceReconciliation_Realm : sRealm ,
                        LineItem_InvoiceReconciliation_UniqueName : sUniqueName
                    });
                    await DELETE("sap.ariba.InvoiceReconciliation_LineItem_Exceptions_OP").where({
                        LineItem_InvoiceReconciliation_Realm : sRealm ,
                        LineItem_InvoiceReconciliation_UniqueName : sUniqueName
                    });
                    await DELETE("sap.ariba.InvoiceReconciliation_OP").where({
                        Realm : sRealm ,
                        UniqueName : sUniqueName
                    });

                }
                catch(e){
                    logger.error(`Error on deleting from database, aborting file processing, details ${e} `);
                    reject(e);
                }


                //New record, insert
                await INSERT .into ("sap.ariba.InvoiceReconciliation_OP") .entries (oDataCleansed) ;



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