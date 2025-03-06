"use strict";

const cds = require("@sap/cds");
const logger = cds.log('logger');
const utils = require("../../../utils/Utils");


function _getAmountPropertiesForDataCleaning() {
    return [
        "MaxAmountTolerancePercent",
        "ReleaseTolerancePercent"
    ];
}

function _mapContractData(oData) {
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

function _mapContractLineItemData(oData) {
    //Structure flattening
    oData["PricingTerms_IsCompounded"] = oData.PricingTerms && oData.PricingTerms.IsCompounded;
    oData["PricingTerms_Formula"] = oData.PricingTerms && oData.PricingTerms.Formula;
    oData["PricingTerms_TieredPricingSteps"] = oData.PricingTerms && oData.PricingTerms.TieredPricingSteps || [];

    // this will delete also un-modelled associations like DirectFactors,PossibleFactors,Grids
    delete oData["PricingTerms"];

    return oData;
}


async function insertData(aData, realm) {
    return new Promise(async function (resolve, reject) {


        if (!aData || aData.length === 0) {
            resolve(0);
            return;
        }
        logger.info(`Processing ${aData.length} records`);
        var aCleaningProperties = _getAmountPropertiesForDataCleaning();
        let i = 0;
        for (const oData of aData) {

            var oDataCleansed = utils.cleanData(aCleaningProperties, oData, realm);
            oDataCleansed = utils.processCustomFields(oDataCleansed);
            oDataCleansed = _mapContractData(oDataCleansed);
            oDataCleansed = utils.flattenTypes(oDataCleansed);

            // Remove null properties
            oDataCleansed = utils.removeNullValues(oDataCleansed);

            // Todo: Model the association
            delete oDataCleansed.Attachments;

            oDataCleansed && oDataCleansed.LineItems && oDataCleansed.LineItems.forEach(function (oLineItems) {
                oLineItems = _mapContractLineItemData(oLineItems);
            });


            try {
                //Full load behaviour for all records
                let sRealm = realm;
                let sUniqueName = oDataCleansed.UniqueName;

                //1 Delete potential record dependencies
                try {
                    await DELETE("sap.ariba.Contracts_ForcastedSpendItem_OP").where({
                        Contract_Realm: sRealm,
                        Contract_UniqueName: sUniqueName
                    });
                    await DELETE("sap.ariba.Contracts_LineItem_TieredPricingSteps_OP").where({
                        LineItem_Contracts_Realm: sRealm,
                        LineItem_Contracts_UniqueName: sUniqueName
                    });
                    await DELETE("sap.ariba.Contracts_LineItem_OP").where({
                        Contracts_Realm: sRealm,
                        Contracts_UniqueName: sUniqueName
                    });
                    await DELETE("sap.ariba.Contracts_LineItem_SplitAccountings_OP").where({
                        LineItem_Contracts_Realm: sRealm,
                        LineItem_Contracts_UniqueName: sUniqueName
                    });
                    await DELETE("sap.ariba.Contracts_OP").where({
                        Realm: sRealm,
                        UniqueName: sUniqueName
                    });

                }
                catch (e) {
                    logger.error(`Error on deleting from database, aborting file processing, details ${e} `);
                    reject(e);
                }


                //New record, insert
                await INSERT.into("sap.ariba.Contracts_OP").entries(oDataCleansed);



            } catch (e) {
                logger.error(`Error on inserting data in database, aborting file processing, details ${e} `);
                //abort full file
                reject(e);
                break;
            }
            //Monitoring
            i++;
            if (i % 500 == 0) {
                logger.info(`Upsert ${i} records`);
            }

        }
        resolve(aData.length);
    });
}

module.exports = {
    insertData
};