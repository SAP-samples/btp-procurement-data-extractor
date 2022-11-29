"use strict";

const cds = require("@sap/cds");
const logger = require("../../utils/logger");

const utils = require("../../utils/Utils");

const { Survey } = cds.entities('sap.ariba');

//Amount fields in object
function _getAmountPropertiesForDataCleaning () {
    return [  "AclId"];
}

function _negativeValueCleansing (aCleaningProperties,oData) {

    aCleaningProperties && aCleaningProperties.forEach(function (oCleaningProperty) {
        oData[oCleaningProperty] = oData[oCleaningProperty] && oData[oCleaningProperty]<0?0:oData[oCleaningProperty];
    });

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

            var oDataCleansed = utils.cleanData(aCleaningProperties, oData, realm);
            oDataCleansed = _negativeValueCleansing(aCleaningProperties,oDataCleansed);

            try {
                //Select record by Unique key
                let res =  await srv.run ( SELECT.from (Survey).where(
                    {
                        Realm : oDataCleansed.Realm ,
                        SurveyId : oDataCleansed.SurveyId }  )
                 );

                 if(res.length==0){
                     //New record, insert
                    await srv.run( INSERT .into (Survey) .entries (oDataCleansed) );

                 }else{
                     //Update existing record
                    await srv.run ( UPDATE (Survey) .set (oDataCleansed) .where(
                        {
                            Realm : oDataCleansed.Realm ,
                            SurveyId : oDataCleansed.SurveyId} )
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