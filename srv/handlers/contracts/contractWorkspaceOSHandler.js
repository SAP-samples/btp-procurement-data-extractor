"use strict";

const cds = require("@sap/cds");
const logger = cds.log('logger');
const utils = require("../../utils/Utils");


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
            oDataCleansed = utils.deleteCustomFields(oDataCleansed, oData, realm);

            // Remove null properties
            oDataCleansed = utils.removeNullValues(oDataCleansed);
            oDataCleansed= _mapEntityStructure(oDataCleansed);
            

            try {
                //Full load behaviour for all records
                let sRealm = realm;
                let sInternalId = oDataCleansed.InternalId;

                //1 Delete potential record dependencies
                try {
                   
                    await srv.run(DELETE("sap.ariba.ContractWorkspaceOS_AllOwners").where({
                        ContractWorkspaceOS_Realm : sRealm ,
                        ContractWorkspaceOS_InternalId : sInternalId
                    }));
                    await srv.run(DELETE("sap.ariba.ContractWorkspaceOS_NotificationProfiles").where({
                        ContractWorkspaceOS_Realm : sRealm ,
                        ContractWorkspaceOS_InternalId : sInternalId
                    }));
                    await srv.run(DELETE("sap.ariba.ContractWorkspaceOS_AdhocSpendUsers").where({
                        ContractWorkspaceOS_Realm : sRealm ,
                        ContractWorkspaceOS_InternalId : sInternalId
                    }));
                    await srv.run(DELETE("sap.ariba.ContractWorkspaceOS_Client").where({
                        ContractWorkspaceOS_Realm : sRealm ,
                        ContractWorkspaceOS_InternalId : sInternalId
                    }));
                    await srv.run(DELETE("sap.ariba.ContractWorkspaceOS_NoticeEmailRecipients").where({
                        ContractWorkspaceOS_Realm : sRealm ,
                        ContractWorkspaceOS_InternalId : sInternalId
                    }));
                    await srv.run(DELETE("sap.ariba.ContractWorkspaceOS_Region").where({
                        ContractWorkspaceOS_Realm : sRealm ,
                        ContractWorkspaceOS_InternalId : sInternalId
                    }));
                    await srv.run(DELETE("sap.ariba.ContractWorkspaceOS_AffectedParties").where({
                        ContractWorkspaceOS_Realm : sRealm ,
                        ContractWorkspaceOS_InternalId : sInternalId
                    }));
                    await srv.run(DELETE("sap.ariba.ContractWorkspaceOS_Commodity").where({
                        ContractWorkspaceOS_Realm : sRealm ,
                        ContractWorkspaceOS_InternalId : sInternalId
                    }));
                    await srv.run(DELETE("sap.ariba.ContractWorkspaceOS_ExpiringEmailRecipients").where({
                        ContractWorkspaceOS_Realm : sRealm ,
                        ContractWorkspaceOS_InternalId : sInternalId
                    }));     
                    await srv.run(DELETE("sap.ariba.ContractWorkspaceOS_ComplexSpendReleaseCreators").where({
                        ContractWorkspaceOS_Realm : sRealm ,
                        ContractWorkspaceOS_InternalId : sInternalId
                    }));       
                    await srv.run(DELETE("sap.ariba.ContractWorkspaceOS_ComplexSpendReleaseApprovers").where({
                        ContractWorkspaceOS_Realm : sRealm ,
                        ContractWorkspaceOS_InternalId : sInternalId
                    }));                     
                    await srv.run(DELETE("sap.ariba.ContractWorkspaceOS").where({
                        Realm : sRealm ,
                        InternalId : sInternalId,
                    }));
                
                }
                catch(e){
                    logger.error(`Error on deleting from database, aborting file processing, details ${e} `);
                    reject(e);
                }

                //New record, insert
                await srv.run( INSERT .into ("sap.ariba.ContractWorkspaceOS") .entries (oDataCleansed) );
                         
           
            } catch (e) {                
                logger.error(`Error on inserting data in database, aborting file processing, details ${e} `);
                console.log("val",JSON.stringify(oDataCleansed));
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