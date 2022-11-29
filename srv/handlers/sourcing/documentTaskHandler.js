"use strict";

const cds = require("@sap/cds");
const logger = require("../../utils/logger");
const utils = require("../../utils/Utils");


const { DocumentTask,DocumentTask_Approver,DocumentTask_ActiveApprovers,DocumentTask_ApprovalRequests } = cds.entities('sap.ariba');

//Amount fields in object
function _getAmountPropertiesForDataCleaning () {
    return [    ];
}

function _mapEntityStructure (oDataCleansed) {

    //Flattening TaskApprovable
    oDataCleansed["ApprovalRequests"]= oDataCleansed.TaskApprovable && oDataCleansed.TaskApprovable.ApprovalRequests?oDataCleansed.TaskApprovable.ApprovalRequests:null;
    delete oDataCleansed.TaskApprovable;

    //Removing formdetails
    oDataCleansed.DocumentId && oDataCleansed.DocumentId.ariba_FormDetails && delete oDataCleansed.DocumentId.ariba_FormDetails; 
   
    //Normalize Approver property of Approver as an arry of approver
    if (oDataCleansed && oDataCleansed.Approver){
        for(let i=0; i< oDataCleansed.Approver.length; i++){
            let oApprovers = oDataCleansed.Approver[i].Approver instanceof  Array ? 
                oDataCleansed.Approver[i].Approver.map((elt)=>{return elt}):
                new Array (oDataCleansed.Approver[i].Approver);
            delete oDataCleansed.Approver[i].Approver;
            oDataCleansed.Approver[i]["Approver"] = oApprovers;
        }
    }

    return oDataCleansed;
   
}
function insertData(aData, realm)  {
    return new Promise(async function(resolve, reject)    {
   
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

            // Remove null properties
            oDataCleansed = utils.deleteCustomFields(oDataCleansed);
            oDataCleansed = utils.removeNullValues(oDataCleansed);
            oDataCleansed= _mapEntityStructure(oDataCleansed);
            

            try {
                //Full load behaviour for all records
                let sRealm = realm;
                let sInternalId = oDataCleansed.InternalId;

                //1 Delete potential record dependencies
                try {
                    await srv.run(DELETE(DocumentTask_Approver).where({
                        DocumentTask_Realm : sRealm ,
                        DocumentTask_InternalId : sInternalId
                    }));
                    await srv.run(DELETE(DocumentTask_ActiveApprovers).where({
                        DocumentTask_Realm : sRealm ,
                        DocumentTask_InternalId : sInternalId
                    }));
                    await srv.run(DELETE(DocumentTask_ApprovalRequests).where({
                        DocumentTask_Realm : sRealm ,
                        DocumentTask_InternalId : sInternalId
                    }));
                    await srv.run(DELETE(DocumentTask).where({
                        Realm : sRealm ,
                        InternalId : sInternalId
                    }));
                
                }
                catch(e){
                    logger.error(`Error on deleting from database, aborting file processing, details ${e} `);
                    reject(e);
                }

                //New record, insert
                await srv.run( INSERT .into (DocumentTask) .entries (oDataCleansed) ); 
                         
           
            } catch (e) {                
                logger.error(`Error on inserting data in database, aborting file processing, details ${e} `);
                await srv.rollback();
                console.log(JSON.stringify(oDataCleansed));
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
}