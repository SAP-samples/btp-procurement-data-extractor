"use strict";

const cds = require("@sap/cds");
const logger = require("../../utils/logger");
const utils = require("../../utils/Utils");


const { Alternative } = cds.entities('sap.ariba');

//Amount fields in object
function _getAmountPropertiesForDataCleaning () {
    return [    ];
}

function _mapEntityStructure (oDataCleansed) {

    //building Global Biding rule object

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
                let sSliceId = oDataCleansed.SliceId;
                let sAlternativeId = oDataCleansed.AlternativeId;

                //1 Delete potential record dependencies
                try {

                    await srv.run(DELETE(Alternative).where({
                        Realm : sRealm ,
                        SliceId: sSliceId,
                        AlternativeId : sAlternativeId
                    }));
                
                }
                catch(e){
                    logger.error(`Error on deleting from database, aborting file processing, details ${e} `);
                    reject(e);
                }

                //New record, insert
                await srv.run( INSERT .into (Alternative) .entries (oDataCleansed) ); 
                         
           
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