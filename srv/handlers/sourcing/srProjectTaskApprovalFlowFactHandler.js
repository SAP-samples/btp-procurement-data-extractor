"use strict";

const cds = require("@sap/cds");
const logger = require("../../utils/logger");
const utils = require("../../utils/Utils");


const { SRProjectTaskApprovalFlows } = cds.entities('sap.ariba');

//Amount fields in object
function _getAmountPropertiesForDataCleaning () {
    return [    ];
}

function _cleanData (aCleaningProperties, oData, realm) {
    aCleaningProperties && aCleaningProperties.forEach(function (oCleaningProperty) {
        oData[oCleaningProperty] = oData[oCleaningProperty] && Math.round((parseFloat(oData[oCleaningProperty]) + Number.EPSILON) * 1000) / 1000;
    });
    oData.Realm = realm;
    return oData;
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
            
            var oDataCleansed = _cleanData(aCleaningProperties, oData, realm);
           
            try {
                //Select record by Unique key
                let res =  await srv.run ( SELECT.from (SRProjectTaskApprovalFlows).where(
                    { 
                        Realm : oDataCleansed.Realm ,
                        TaskId : oDataCleansed.TaskId,
                        RequestId : oDataCleansed.RequestId,
                        ApproverId : oDataCleansed.ApproverId }  )
                 );

                 if(res.length==0){
                     //New record, insert
                    await srv.run( INSERT .into (SRProjectTaskApprovalFlows) .entries (oDataCleansed) ); 
                                  
                 }else{
                     //Update existing record
                                       
                     await srv.run ( UPDATE (SRProjectTaskApprovalFlows) .set (oDataCleansed) .where(
                        { 
                            Realm : oDataCleansed.Realm ,
                            TaskId : oDataCleansed.TaskId,
                            RequestId : oDataCleansed.RequestId,
                            ApproverId : oDataCleansed.ApproverId } )
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
}