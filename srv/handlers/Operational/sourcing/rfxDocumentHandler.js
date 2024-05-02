"use strict";

const cds = require("@sap/cds");
const logger = cds.log('logger');
const utils = require("../../../utils/Utils");


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
                    await DELETE("sap.ariba.RFXDocument_Region_OP").where({
                        RFXDocument_Realm : sRealm ,
                        RFXDocument_InternalId : sInternalId
                    });
                    await DELETE("sap.ariba.RFXDocument_Commodity_OP").where({
                        RFXDocument_Realm : sRealm ,
                        RFXDocument_InternalId : sInternalId
                    });
                    await DELETE("sap.ariba.RFXDocument_Client_OP").where({
                        RFXDocument_Realm : sRealm ,
                        RFXDocument_InternalId : sInternalId
                    });
                    await DELETE("sap.ariba.RFXDocument_Invitees_OP").where({
                        RFXDocument_Realm : sRealm ,
                        RFXDocument_InternalId : sInternalId
                    });
                    await DELETE("sap.ariba.RFXDocument_OP").where({
                        Realm : sRealm ,
                        InternalId : sInternalId
                    });
                
                }
                catch(e){
                    logger.error(`Error on deleting from database, aborting file processing, details ${e} `);
                    reject(e);
                }

                //New record, insert
                await INSERT .into ("sap.ariba.RFXDocument_OP") .entries (oDataCleansed) ;
                         
           
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