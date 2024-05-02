"use strict";

const cds = require("@sap/cds");
const logger = cds.log('logger');
const utils = require("../../../utils/Utils");


function _getAmountPropertiesForDataCleaning () {
    return [ ];
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
                    await DELETE("sap.ariba.Receipt_ApprovalRequests_Approver_OP").where({
                        ReceiptApprovalRequests_Receipt_Realm : sRealm ,
                        ReceiptApprovalRequests_Receipt_UniqueName : sUniqueName
                    });
                    await DELETE("sap.ariba.Receipt_ApprovalRequests_OP").where({
                        Receipt_Realm : sRealm ,
                        Receipt_UniqueName : sUniqueName
                    });
                    await DELETE("sap.ariba.Receipt_ReceiptItems_AssetData_OP").where({
                        ReceiptItems_Receipt_Realm : sRealm ,
                        ReceiptItems_Receipt_UniqueName : sUniqueName
                    });
                    await DELETE("sap.ariba.Receipt_ReceiptItems_OP").where({
                        Receipt_Realm : sRealm ,
                        Receipt_UniqueName : sUniqueName
                    });
                    await DELETE("sap.ariba.Receipt_OP").where({
                        Realm : sRealm ,
                        UniqueName : sUniqueName
                    });


                }
                catch(e){
                    logger.error(`Error on deleting from database, aborting file processing, details ${e} `);
                    reject(e);
                }


                //New record, insert
                await INSERT .into ("sap.ariba.Receipt_OP") .entries (oDataCleansed) ;

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