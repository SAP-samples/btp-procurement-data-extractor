"use strict";

const cds = require("@sap/cds");
const logger = cds.log('logger');
const utils = require("../../utils/Utils");


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

            // Remove null properties
            var oDataCleansed = utils.removeNullValues(oDataCleansed);
            var oDataCleansed = _normalizeApprovers(oDataCleansed);


            // Todo: Model the association
            delete oDataCleansed.Attachments;

            try {
                //Full load behaviour for all records
                let sRealm = realm;
                let sUniqueName = oDataCleansed.UniqueName;

                //1 Delete potential record dependencies
                try {
                    await srv.run(DELETE("sap.ariba.Invoice_ApprovalRequests_Approver").where({
                        InvoiceApprovalRequests_Invoice_Realm : sRealm ,
                        InvoiceApprovalRequests_Invoice_UniqueName : sUniqueName
                    }));
                    await srv.run(DELETE("sap.ariba.Invoice_ApprovalRequests").where({
                        Invoice_Realm : sRealm ,
                        Invoice_UniqueName : sUniqueName
                    }));
                    await srv.run(DELETE("sap.ariba.Invoice_ApprovalRecords").where({
                        Invoice_Realm : sRealm ,
                        Invoice_UniqueName : sUniqueName
                    }));
                    await srv.run(DELETE("sap.ariba.Invoice_LineItem").where({
                        Invoice_Realm : sRealm ,
                        Invoice_UniqueName : sUniqueName
                    }));
                    await srv.run(DELETE("sap.ariba.Invoice_LineItem_SplitAccountings").where({
                        LineItem_Invoice_Realm : sRealm ,
                        LineItem_Invoice_UniqueName : sUniqueName
                    }));
                    await srv.run(DELETE("sap.ariba.Invoice").where({
                        Realm : sRealm ,
                        UniqueName : sUniqueName
                    }));

                }
                catch(e){
                    logger.error(`Error on deleting from database, aborting file processing, details ${e} `);
                    reject(e);
                }


                //New record, insert
                await srv.run( INSERT .into ("sap.ariba.Invoice") .entries (oDataCleansed) );



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