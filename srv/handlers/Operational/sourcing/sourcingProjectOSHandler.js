"use strict";

const cds = require("@sap/cds");
const logger = cds.log('logger');
const utils = require("../../../utils/Utils");


//Amount fields in object
function _getAmountPropertiesForDataCleaning () {
    return [    ];
}

function _mapEntityStructure (oDataCleansed) {
   
    //Todo: Handle Answer Modelling?
    oDataCleansed.ProjectAddin && oDataCleansed.ProjectAddin.TemplateProjectAddin && oDataCleansed.ProjectAddin.TemplateProjectAddin.Questions  && delete oDataCleansed.ProjectAddin.TemplateProjectAddin.Questions;
    oDataCleansed.ProjectAddin  && oDataCleansed.ProjectAddin.Answers  && delete oDataCleansed.ProjectAddin.Answers;
    
    return oDataCleansed;
   
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

            // Remove null properties
            oDataCleansed = utils.removeNullValues(oDataCleansed);
            oDataCleansed= _mapEntityStructure(oDataCleansed);
            oDataCleansed = utils.flattenTypes(oDataCleansed);


            try {
                //Full load behaviour for all records
                let sRealm = realm;
                let sInternalId = oDataCleansed.InternalId;

                //1 Delete potential record dependencies
                try {
                    await DELETE("sap.ariba.SourcingProject_SubContent_OP").where({
                        SourcingProject_Realm : sRealm ,
                        SourcingProject_InternalId : sInternalId
                    });
                    await DELETE("sap.ariba.SourcingProject_Client_OP").where({
                        SourcingProject_Realm : sRealm ,
                        SourcingProject_InternalId : sInternalId
                    });
                    await DELETE("sap.ariba.SourcingProject_Region_OP").where({
                        SourcingProject_Realm : sRealm ,
                        SourcingProject_InternalId : sInternalId
                    });
                    await DELETE("sap.ariba.SourcingProject_Commodity_OP").where({
                        SourcingProject_Realm : sRealm ,
                        SourcingProject_InternalId : sInternalId
                    });
                    await DELETE("sap.ariba.SourcingProject_Suppliers_OP").where({
                        SourcingProject_Realm : sRealm ,
                        SourcingProject_InternalId : sInternalId
                    });
                    await DELETE("sap.ariba.SourcingProject_OP").where({
                        Realm : sRealm ,
                        InternalId : sInternalId
                    });
                
                }
                catch(e){
                    logger.error(`Error on deleting from database, aborting file processing, details ${e} `);
                    reject(e);
                }

                //New record, insert
                await INSERT .into ("sap.ariba.SourcingProject_OP") .entries (oDataCleansed) ;
                         
           
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