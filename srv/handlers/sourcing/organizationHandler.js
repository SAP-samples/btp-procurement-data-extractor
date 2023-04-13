"use strict";

const cds = require("@sap/cds");
const logger = cds.log('logger');
const utils = require("../../utils/Utils");


//Amount fields in object
function _getAmountPropertiesForDataCleaning () {
    return [    ];
}

function _mapEntityStructure (oDataCleansed) {
    oDataCleansed.Parent && oDataCleansed.Parent.OrganizationID && delete oDataCleansed.Parent.OrganizationID;   
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
                let sSystemID = oDataCleansed.SystemID;

                //1 Delete potential record dependencies
                try {
                    await srv.run(DELETE("sap.ariba.Organization_BusinessContacts").where({
                        Organization_Realm : sRealm ,
                        Organization_SystemID : sSystemID
                    }));
                    await srv.run(DELETE("sap.ariba.Organization_Contacts").where({
                        Organization_Realm : sRealm ,
                        Organization_SystemID : sSystemID
                    }));
                    await srv.run(DELETE("sap.ariba.Organization_OrganizationIds").where({
                        Organization_Realm : sRealm ,
                        Organization_SystemID : sSystemID
                    }));
                    await srv.run(DELETE("sap.ariba.Organization_VendorKeys").where({
                        Organization_Realm : sRealm ,
                        Organization_SystemID : sSystemID
                    }));
                    await srv.run(DELETE("sap.ariba.Organization").where({
                        Realm : sRealm ,
                        SystemID : sSystemID
                    }));
                
                }
                catch(e){
                    logger.error(`Error on deleting from database, aborting file processing, details ${e} `);
                    reject(e);
                }

                //New record, insert
                await srv.run( INSERT .into ("sap.ariba.Organization") .entries (oDataCleansed) );
                         
           
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