"use strict";

const cds = require("@sap/cds");
const { ContractsOS, ContractsOS_LineItem, ContractsOS_LineItem_SplitAccountings, ContractsOS_ForcastedSpendItem, ContractsOS_LineItem_TieredPricingSteps } = cds.entities('sap.ariba');

const logger = require("../../utils/logger");
const utils = require("../../utils/Utils");


function _getAmountPropertiesForDataCleaning () {
    return [
        "MaxAmountTolerancePercent",
        "ReleaseTolerancePercent"
    ];
}

function _mapContractData (oData) {
    //Structure flattening
    oData["ForecastedSpend_TotalAmount"] = oData["ForecastedSpend.TotalAmount"];
    oData["ForecastedSpend_SavingPercentage"] = oData["ForecastedSpend.SavingPercentage"];
    oData["ForecastedSpend_Frequency"] = oData["ForecastedSpend.Frequency"];
    oData["ForecastedSpend_Items"] = oData["ForecastedSpend.Items"];

    oData["SubAgreements"] = oData["SubAgreements"] || [];

    delete oData["ForecastedSpend.TotalAmount"];
    delete oData["ForecastedSpend.SavingPercentage"];
    delete oData["ForecastedSpend.Frequency"];
    delete oData["ForecastedSpend.Items"];

    return oData;
}

function _mapContractLineItemData (oData) {
    //Structure flattening
    oData["PricingTerms_IsCompounded"] = oData.PricingTerms && oData.PricingTerms.IsCompounded;
    oData["PricingTerms_Formula"] = oData.PricingTerms && oData.PricingTerms.Formula;
    oData["PricingTerms_TieredPricingSteps"] = oData.PricingTerms && oData.PricingTerms.TieredPricingSteps || [];

    // this will delete also un-modelled associations like DirectFactors,PossibleFactors,Grids
    delete oData["PricingTerms"];

    return oData;
}


async function insertData(aData, realm)  {
    return new Promise(async function(resolve, reject) {
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
            var oDataCleansed = utils.processCustomFields(oDataCleansed);
            var oDataCleansed = _mapContractData(oDataCleansed);

            // Remove null properties
            var oDataCleansed = utils.removeNullValues(oDataCleansed);

            // Todo: Model the association
            delete oDataCleansed.Attachments;

            oDataCleansed && oDataCleansed.LineItems && oDataCleansed.LineItems.forEach(function(oLineItems) {
                oLineItems = _mapContractLineItemData(oLineItems);
            });


            try {
                //Full load behaviour for all records
                let sRealm = realm;
                let sUniqueName = oDataCleansed.UniqueName;

                //1 Delete potential record dependencies
                try {
                    await srv.run(DELETE(ContractsOS_ForcastedSpendItem).where({
                        ContractOS_Realm : sRealm ,
                        ContractOS_UniqueName : sUniqueName
                    }));
                    await srv.run(DELETE(ContractsOS_LineItem_TieredPricingSteps).where({
                        LineItem_ContractsOS_Realm : sRealm ,
                        LineItem_ContractsOS_UniqueName : sUniqueName
                    }));
                    await srv.run(DELETE(ContractsOS_LineItem).where({
                        ContractsOS_Realm : sRealm ,
                        ContractsOS_UniqueName : sUniqueName
                    }));
                    await srv.run(DELETE(ContractsOS_LineItem_SplitAccountings).where({
                        LineItem_ContractsOS_Realm : sRealm ,
                        LineItem_ContractsOS_UniqueName : sUniqueName
                    }));
                    await srv.run(DELETE(ContractsOS).where({
                        Realm : sRealm ,
                        UniqueName : sUniqueName
                    }));

                }
                catch(e){
                    logger.error(`Error on deleting from database, aborting file processing, details ${e} `);
                    reject(e);
                }


                //New record, insert
                await srv.run( INSERT .into (ContractsOS) .entries (oDataCleansed) );



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
};