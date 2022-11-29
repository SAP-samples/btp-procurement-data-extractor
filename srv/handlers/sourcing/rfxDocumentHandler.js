"use strict";

const cds = require("@sap/cds");
const logger = require("../../utils/logger");
const utils = require("../../utils/Utils");


const { RFXDocument,RFXDocument_Region,RFXDocument_Commodity,RFXDocument_Client,RFXDocument_Invitees } = cds.entities('sap.ariba');

//Amount fields in object
function _getAmountPropertiesForDataCleaning () {
    return [    ];
}

function _mapEntityStructure (oDataCleansed) {

    //building Global Biding rule object
    let GlobalBiddingRules = {
        AllowAnonymousScoring: oDataCleansed["GlobalBiddingRules.AllowAnonymousScoring"],
        AllowScoring: oDataCleansed["GlobalBiddingRules.AllowScoring"],
        BiddingRulesAllowed: oDataCleansed["GlobalBiddingRules.BiddingRulesAllowed"],
        DefaultGrading: oDataCleansed["GlobalBiddingRules.DefaultGrading"]};

        delete oDataCleansed["GlobalBiddingRules.AllowAnonymousScoring"];
        delete oDataCleansed["GlobalBiddingRules.AllowScoring"];
        delete oDataCleansed["GlobalBiddingRules.BiddingRulesAllowed"];
        delete oDataCleansed["GlobalBiddingRules.DefaultGrading"];
        oDataCleansed["GlobalBiddingRules"]= GlobalBiddingRules;

        //Removing Supplier additional IDs (keeping only SystemID)
        oDataCleansed.ParentWorkspace && oDataCleansed.ParentWorkspace.Supplier && delete oDataCleansed.ParentWorkspace.Supplier.OrganizationID;
        
   
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
                    await srv.run(DELETE(RFXDocument_Region).where({
                        RFXDocument_Realm : sRealm ,
                        RFXDocument_InternalId : sInternalId
                    }));
                    await srv.run(DELETE(RFXDocument_Commodity).where({
                        RFXDocument_Realm : sRealm ,
                        RFXDocument_InternalId : sInternalId
                    }));
                    await srv.run(DELETE(RFXDocument_Client).where({
                        RFXDocument_Realm : sRealm ,
                        RFXDocument_InternalId : sInternalId
                    }));
                    await srv.run(DELETE(RFXDocument_Invitees).where({
                        RFXDocument_Realm : sRealm ,
                        RFXDocument_InternalId : sInternalId
                    }));
                    await srv.run(DELETE(RFXDocument).where({
                        Realm : sRealm ,
                        InternalId : sInternalId
                    }));
                
                }
                catch(e){
                    logger.error(`Error on deleting from database, aborting file processing, details ${e} `);
                    reject(e);
                }

                //New record, insert
                await srv.run( INSERT .into (RFXDocument) .entries (oDataCleansed) ); 
                         
           
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