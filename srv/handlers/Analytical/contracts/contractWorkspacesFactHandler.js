"use strict";

const cds = require("@sap/cds");
const logger = cds.log('logger');
const utils = require("../../../utils/Utils");


//Amount fields in object
function _getAmountPropertiesForDataCleaning () {
    return ["Duration",
    "Amount",
    "ProposedAmount",
    "OrigProposedAmount",
    "OrigAmount",
    "ComplexSpendAvailableAmount",
    "ProposedIncrementalAmount",
    "ApprovedAmount"
    ];
}

function insertData(aData, realm)  {
    return new Promise(async function(resolve, reject)    {
   
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
            oDataCleansed = utils.flattenTypes(oDataCleansed);

            try {
                //Full load behaviour for all records
                let sRealm = realm;
                let sProjectId = oDataCleansed.ProjectId;

                //1 Delete potential record dependencies
                try {
                    await DELETE("sap.ariba.ContractWorkspaces_Region_AN").where({
                        ContractWorkspace_Realm : sRealm ,
                        ContractWorkspace_ProjectId : sProjectId
                    });
                    await DELETE("sap.ariba.ContractWorkspaces_AffectedParties_AN").where({
                        ContractWorkspace_Realm : sRealm ,
                        ContractWorkspace_ProjectId : sProjectId
                    });
                    await DELETE("sap.ariba.ContractWorkspaces_Commodity_AN").where({
                        ContractWorkspace_Realm : sRealm ,
                        ContractWorkspace_ProjectId : sProjectId
                    });
                    await DELETE("sap.ariba.ContractWorkspaces_AllOwners_AN").where({
                        ContractWorkspace_Realm : sRealm ,
                        ContractWorkspace_ProjectId : sProjectId
                    });
                    await DELETE("sap.ariba.ContractWorkspaces_Organization_AN").where({
                        ContractWorkspace_Realm : sRealm ,
                        ContractWorkspace_ProjectId : sProjectId
                    });
                    await DELETE("sap.ariba.ContractWorkspaces_AN").where({
                        Realm : sRealm ,
                        ProjectId : sProjectId
                    });

                }
                catch(e){
                    logger.error(`Error on deleting from database, aborting file processing, details ${e} `);
                    reject(e);
                }


                //New record, insert
                await INSERT .into ("sap.ariba.ContractWorkspaces_AN") .entries (oDataCleansed) ;


           
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