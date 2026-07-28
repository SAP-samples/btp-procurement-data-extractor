"use strict";

const cds = require("@sap/cds");
const logger = cds.log('logger');
const utils = require("../../utils/Utils");

function _mapEntityStructure (oData) {
    return {
        Realm                               : oData["Realm"],
        workspaceId                         : oData["workspaceId"],
        title                               : oData["title"] || "",
        status                              : oData["status"] || "",
        updatedDate                         : oData["updatedDate"] || "",
        ProcessedStatus                     : "NP"
    };
}

//Amount fields in object
function _getAmountPropertiesForDataCleaning () {
    return [ ];
}
function insertData(aData, realm)  {
    return new Promise(async function(resolve, reject)    {
        logger.info(`aData in InsertData function : ${JSON.stringify(aData)}`);

        if (!aData || aData.length === 0) {
            resolve(0);
            return;
        }
        logger.info(`Processing ${aData.length} records`);
       var aCleaningProperties = _getAmountPropertiesForDataCleaning();
        
        let i=0;
        for(const oData of aData) {
            logger.info(`wordpace id off aData : ${JSON.stringify(oData['workspaceId'])}`);
            var oDataCleansed = utils.cleanData(aCleaningProperties, oData, realm);
            oDataCleansed = utils.processCustomFields(oDataCleansed);
            oDataCleansed = _mapEntityStructure(oDataCleansed);
            oDataCleansed = utils.flattenTypes(oDataCleansed);

           logger.info(`aData after cleansing : ${JSON.stringify(oData)}`);

            try {
                //Select record by Unique key
                logger.info("before select from Supper Risk Engagement table");
                let res =  await SELECT.from ("sap.ariba.SupplierRisk_Engagements")
                    .where( { Realm : oDataCleansed.Realm, workspaceId : oDataCleansed.workspaceId }  ) ;

                 if (res.length == 0) {
                     //New record, insert
                    await INSERT .into ("sap.ariba.SupplierRisk_Engagements") .entries (oDataCleansed) ;
                 } else {
                     //Update existing record
                    await UPDATE ("sap.ariba.SupplierRisk_Engagements") .set (oDataCleansed)
                        .where( { Realm : oDataCleansed.Realm, workspaceId : oDataCleansed.workspaceId } ) ;
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
}