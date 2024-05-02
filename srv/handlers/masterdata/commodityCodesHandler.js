"use strict";

const cds = require("@sap/cds");
const logger = cds.log('logger');
const utils = require("../../utils/Utils");

//Amount fields in object
function _getAmountPropertiesForDataCleaning () {
    return [ ];
}

function _cleanData (aCleaningProperties, oData, realm) {
    aCleaningProperties && aCleaningProperties.forEach(function (oCleaningProperty) {
        oData[oCleaningProperty] = oData[oCleaningProperty] && Math.round((parseFloat(oData[oCleaningProperty]) + Number.EPSILON) * 1000) / 1000;
    });
    oData.Realm = realm;

    return _mapEntityStructure(oData);;
}

function _mapEntityStructure (oData) {
    return {
        Realm                          : oData["Realm"],
        Domain                         : oData["Domain"],
        UniqueName                     : oData["UniqueName"],
        Name_en                        : oData["Name_en"] || ""
    }
}

function insertData(aData, realm)  {
    return new Promise(async function(resolve, reject)    {


        if (!aData || aData.length === 0) {
            resolve(0);
            return;
        }        logger.info(`Processing ${aData.length} records`);
        var aCleaningProperties = _getAmountPropertiesForDataCleaning();
        let i=0;
        for(const oData of aData) {

            var oDataCleansed = _cleanData(aCleaningProperties, oData, realm);
            oDataCleansed = utils.flattenTypes(oDataCleansed);

            try {
                //Select record by Unique key
                let res =  await SELECT.from ("sap.ariba.CommodityCode_MD").where(
                    {
                        Realm : oDataCleansed.Realm ,
                        Domain : oDataCleansed.Domain,
                        UniqueName : oDataCleansed.UniqueName
                     }  );

                 if(res.length==0){
                     //New record, insert
                    await INSERT .into ("sap.ariba.CommodityCode_MD") .entries (oDataCleansed) ;

                 }else{
                     //Update existing record
                    await UPDATE ("sap.ariba.CommodityCode_MD") .set (oDataCleansed) .where(
                        {
                            
                            Realm : oDataCleansed.Realm ,
                            Domain : oDataCleansed.Domain,
                            UniqueName : oDataCleansed.UniqueName
                        } );

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