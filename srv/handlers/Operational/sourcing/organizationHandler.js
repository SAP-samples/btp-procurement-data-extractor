"use strict";

const cds = require("@sap/cds");
const logger = cds.log('logger');
const utils = require("../../../utils/Utils");


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
                let sSystemID = oDataCleansed.SystemID;

                //1 Delete potential record dependencies
                try {
                    await DELETE("sap.ariba.Organization_BusinessContacts_OP").where({
                        Organization_Realm : sRealm ,
                        Organization_SystemID : sSystemID
                    });
                    await DELETE("sap.ariba.Organization_Contacts_OP").where({
                        Organization_Realm : sRealm ,
                        Organization_SystemID : sSystemID
                    });
                    await DELETE("sap.ariba.Organization_OrganizationIds_OP").where({
                        Organization_Realm : sRealm ,
                        Organization_SystemID : sSystemID
                    });
                    await DELETE("sap.ariba.Organization_VendorKeys_OP").where({
                        Organization_Realm : sRealm ,
                        Organization_SystemID : sSystemID
                    });
                    await DELETE("sap.ariba.Organization_OP").where({
                        Realm : sRealm ,
                        SystemID : sSystemID
                    });
                
                }
                catch(e){
                    logger.error(`Error on deleting from database, aborting file processing, details ${e} `);
                    reject(e);
                }

                //New record, insert
                await INSERT .into ("sap.ariba.Organization_OP") .entries (oDataCleansed) ;
                         
           
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