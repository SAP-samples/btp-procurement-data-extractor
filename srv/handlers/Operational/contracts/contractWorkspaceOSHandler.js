"use strict";

const cds = require("@sap/cds");
const logger = cds.log('logger');
const utils = require("../../../utils/Utils");


//Amount fields in object
function _getAmountPropertiesForDataCleaning () {
    return [    ];
}

function _mapEntityStructure (oDataCleansed) {


    //Todo: Handle Answer Modelling?
    oDataCleansed.ProjectAddin && oDataCleansed.ProjectAddin.TemplateProjectAddin && oDataCleansed.ProjectAddin.TemplateProjectAddin.Questions  && delete oDataCleansed.ProjectAddin.TemplateProjectAddin.Questions;
    oDataCleansed.ProjectAddin  && oDataCleansed.ProjectAddin.Answers  && delete oDataCleansed.ProjectAddin.Answers;

    //Removed affected party nested ids
    if(oDataCleansed.AffectedParties){
        oDataCleansed.AffectedParties.forEach(element => {
            element.OrganizationID && delete element.OrganizationID;
        });
    }  
    //Remove Notebox labels
    oDataCleansed.NoteBox  && oDataCleansed.NoteBox.Labels  && delete oDataCleansed.NoteBox.Labels;
    //Remove Supplier nested IDs
    oDataCleansed.Supplier  && oDataCleansed.Supplier.OrganizationID  && delete oDataCleansed.Supplier.OrganizationID;
    //TemplateItemAddin cleans
    oDataCleansed.TemplateItemAddin  && delete oDataCleansed.TemplateItemAddin;
    //cleaning parent document suppliers
    oDataCleansed.ParentDocument && oDataCleansed.ParentDocument.Supplier && delete oDataCleansed.ParentDocument.Supplier;


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
            oDataCleansed = utils.deleteCustomFields(oDataCleansed, oData, realm);

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
                   
                    await DELETE("sap.ariba.ContractWorkspace_AllOwners_OP").where({
                        ContractWorkspace_Realm : sRealm ,
                        ContractWorkspace_InternalId : sInternalId
                    });
                    await DELETE("sap.ariba.ContractWorkspace_NotificationProfiles_OP").where({
                        ContractWorkspace_Realm : sRealm ,
                        ContractWorkspace_InternalId : sInternalId
                    });
                    await DELETE("sap.ariba.ContractWorkspace_AdhocSpendUsers_OP").where({
                        ContractWorkspace_Realm : sRealm ,
                        ContractWorkspace_InternalId : sInternalId
                    });
                    await DELETE("sap.ariba.ContractWorkspace_Client_OP").where({
                        ContractWorkspace_Realm : sRealm ,
                        ContractWorkspace_InternalId : sInternalId
                    });
                    await DELETE("sap.ariba.ContractWorkspace_NoticeEmailRecipients_OP").where({
                        ContractWorkspace_Realm : sRealm ,
                        ContractWorkspace_InternalId : sInternalId
                    });
                    await DELETE("sap.ariba.ContractWorkspace_Region_OP").where({
                        ContractWorkspace_Realm : sRealm ,
                        ContractWorkspace_InternalId : sInternalId
                    });
                    await DELETE("sap.ariba.ContractWorkspace_AffectedParties_OP").where({
                        ContractWorkspace_Realm : sRealm ,
                        ContractWorkspace_InternalId : sInternalId
                    });
                    await DELETE("sap.ariba.ContractWorkspace_Commodity_OP").where({
                        ContractWorkspace_Realm : sRealm ,
                        ContractWorkspace_InternalId : sInternalId
                    });
                    await DELETE("sap.ariba.ContractWorkspace_ExpiringEmailRecipients_OP").where({
                        ContractWorkspace_Realm : sRealm ,
                        ContractWorkspace_InternalId : sInternalId
                    });
                    await DELETE("sap.ariba.ContractWorkspace_ComplexSpendReleaseCreators_OP").where({
                        ContractWorkspace_Realm : sRealm ,
                        ContractWorkspace_InternalId : sInternalId
                    });
                    await DELETE("sap.ariba.ContractWorkspace_ComplexSpendReleaseApprovers_OP").where({
                        ContractWorkspace_Realm : sRealm ,
                        ContractWorkspace_InternalId : sInternalId
                    });
                    await DELETE("sap.ariba.ContractWorkspace_OP").where({
                        Realm : sRealm ,
                        InternalId : sInternalId,
                    });
                
                }
                catch(e){
                    logger.error(`Error on deleting from database, aborting file processing, details ${e} `);
                    reject(e);
                }

                //New record, insert
                await INSERT .into ("sap.ariba.ContractWorkspace_OP") .entries (oDataCleansed) ;
                         
           
            } catch (e) {                
                logger.error(`Error on inserting data in database, aborting file processing, details ${e} `);
                console.log("val",JSON.stringify(oDataCleansed));
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