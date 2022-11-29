"use strict";

const cds = require("@sap/cds");
const { Requisition, Requisition_ApprovalRecords,Requisition_ApprovalRequests, Requisition_LineItem, Requisition_ApprovalRequests_Approver, Requisition_LineItem_SplitAccountings } = cds.entities('sap.ariba');

const logger = require("../../utils/logger");
const utils = require("../../utils/Utils");


function _getAmountPropertiesForDataCleaning () {
    return [
        "NumberBilled",
        "NumberCleared"
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
            delete oDataCleansed.CollaborationState;
            delete oDataCleansed.Attachments;

            try {
                //Full load behaviour for all records
                let sRealm = realm;
                let sUniqueName = oDataCleansed.UniqueName;

                //1 Delete potential record dependencies
                try {
                    await srv.run(DELETE(Requisition_ApprovalRequests_Approver).where({
                        RequisitionApprovalRequests_Requisition_Realm : sRealm ,
                        RequisitionApprovalRequests_Requisition_UniqueName : sUniqueName
                    }));
                    await srv.run(DELETE(Requisition_ApprovalRequests).where({
                        Requisition_Realm : sRealm ,
                        Requisition_UniqueName : sUniqueName
                    }));
                    await srv.run(DELETE(Requisition_ApprovalRecords).where({
                        Requisition_Realm : sRealm ,
                        Requisition_UniqueName : sUniqueName
                    }));
                    await srv.run(DELETE(Requisition_LineItem).where({
                        Requisition_Realm : sRealm ,
                        Requisition_UniqueName : sUniqueName
                    }));
                    await srv.run(DELETE(Requisition).where({
                        Realm : sRealm ,
                        UniqueName : sUniqueName
                    }));
                    await srv.run(DELETE(Requisition_LineItem_SplitAccountings).where({
                        LineItem_Requisition_Realm : sRealm ,
                        LineItem_Requisition_UniqueName : sUniqueName
                    }));
                   
                }
                catch(e){
                    logger.error(`Error on deleting from database, aborting file processing, details ${e} `);
                    reject(e);
                }


                //New record, insert
                await srv.run( INSERT .into (Requisition) .entries (oDataCleansed) ); 
                                  
                 
           
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