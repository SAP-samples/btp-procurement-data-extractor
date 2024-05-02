"use strict";

const cds = require("@sap/cds");
const logger = cds.log('logger');
const utils = require("../../../utils/Utils");


//Amount fields in object
function _getAmountPropertiesForDataCleaning () {
    return [
    ];
}

function _FlatteningData (oData) {

    //Structure flattening
    oData.SourceSystemId = oData.SourceSystem.SourceSystemId;
    return oData;
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
            
            var oDataCleansed = utils.cleanData(aCleaningProperties, oData, realm);
            oDataCleansed = _FlatteningData(oDataCleansed);
            oDataCleansed = utils.flattenTypes(oDataCleansed);

            try {
                //Select record by Unique key
                let res =  await SELECT.from ("sap.ariba.Approval_AN").where(
                    { 
                        Realm : oDataCleansed.Realm ,
                        ApprovalActivationDate : oDataCleansed.ApprovalActivationDate,
                        ApprovableType : oDataCleansed.ApprovableType,
                        ApprovableId : oDataCleansed.ApprovableId,
                        SourceSystemId : oDataCleansed.SourceSystemId,
                        Approver : oDataCleansed.Approver
                    });

                 if(res.length==0){
                     //New record, insert
                    await INSERT .into ("sap.ariba.Approval_AN") .entries (oDataCleansed) ;
                                  
                 }else{
                     //Update existing record
                     //Full Load of Approval_Delegatees
                     let delegatees = oDataCleansed["Delegatees"];
                     delete oDataCleansed["Delegatees"];

                    await UPDATE ("sap.ariba.Approval_AN") .set (oDataCleansed) .where(
                        { 
                            Realm : oDataCleansed.Realm ,
                            ApprovalActivationDate : oDataCleansed.ApprovalActivationDate,
                            ApprovableType : oDataCleansed.ApprovableType,
                            ApprovableId : oDataCleansed.ApprovableId,
                            SourceSystemId : oDataCleansed.SourceSystemId,
                            Approver : oDataCleansed.Approver
                        } );

                     await _FullLoadDelegatees(delegatees,oDataCleansed.Realm,oDataCleansed.ApprovalActivationDate,oDataCleansed.ApprovableType,oDataCleansed.ApprovableId,oDataCleansed.SourceSystemId,oDataCleansed.Approver);
                  
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
     
async function _FullLoadDelegatees(delegatees,Realm,ApprovalActivationDate,ApprovableType,ApprovableId,SourceSystemId,Approver){
    return new Promise(async (resolve,reject) =>{
        //Delete old records
        try {
            await DELETE("sap.ariba.Approval_Delegatees_AN").where({
                Approval_Realm : Realm ,
                Approval_ApprovalActivationDate : ApprovalActivationDate ,
                Approval_ApprovableType : ApprovableType ,
                Approval_ApprovableId : ApprovableId,
                Approval_SourceSystemId : SourceSystemId,
                Approval_Approver : Approver
            });
        }
        catch(e){
            logger.error(`Error on deleting from database, aborting file processing, details ${e} `);
            reject(e);
        }

        //Insert new records
        for (const de of delegatees){
            try {

                de["Approval_Realm"] = Realm;
                de["Approval_ApprovalActivationDate"] = ApprovalActivationDate;
                de["Approval_ApprovableType"] = ApprovableType;
                de["Approval_ApprovableId"] = ApprovableId;
                de["Approval_SourceSystemId"] = SourceSystemId;
                de["Approval_Approver"] = Approver;
                await INSERT .into ("sap.ariba.Approval_Delegatees_AN") .entries (de) ;

            } catch (e) {
                logger.error(`Error on inserting data in database, aborting file processing, details ${e} `);
                reject(e);
                break;
            }
        }
        resolve();
    });
}


module.exports = {
    insertData
}