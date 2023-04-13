"use strict";

const cds = require("@sap/cds");
const logger = cds.log('logger');
const utils = require("../../utils/Utils");


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
            var oDataCleansed = utils.removeNullValues(oDataCleansed);
            oDataCleansed= _mapEntityStructure(oDataCleansed);
            

            try {
                //Full load behaviour for all records
                let sRealm = realm;
                let sInternalId = oDataCleansed.InternalId;

                //1 Delete potential record dependencies
                try {
                    await srv.run(DELETE("sap.ariba.SourcingProject_SubContent").where({
                        SourcingProject_Realm : sRealm ,
                        SourcingProject_InternalId : sInternalId
                    }));
                    await srv.run(DELETE("sap.ariba.SourcingProject_Client").where({
                        SourcingProject_Realm : sRealm ,
                        SourcingProject_InternalId : sInternalId
                    }));
                    await srv.run(DELETE("sap.ariba.SourcingProject_Region").where({
                        SourcingProject_Realm : sRealm ,
                        SourcingProject_InternalId : sInternalId
                    }));
                    await srv.run(DELETE("sap.ariba.SourcingProject_Commodity").where({
                        SourcingProject_Realm : sRealm ,
                        SourcingProject_InternalId : sInternalId
                    }));
                    await srv.run(DELETE("sap.ariba.SourcingProject_Suppliers").where({
                        SourcingProject_Realm : sRealm ,
                        SourcingProject_InternalId : sInternalId
                    }));
                    await srv.run(DELETE("sap.ariba.SourcingProject").where({
                        Realm : sRealm ,
                        InternalId : sInternalId
                    }));
                
                }
                catch(e){
                    logger.error(`Error on deleting from database, aborting file processing, details ${e} `);
                    reject(e);
                }

                //New record, insert
                await srv.run( INSERT .into ("sap.ariba.SourcingProject") .entries (oDataCleansed) );
                         
           
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