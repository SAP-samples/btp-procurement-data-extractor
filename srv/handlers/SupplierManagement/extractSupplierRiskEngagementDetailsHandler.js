"use strict";

const cds = require("@sap/cds");
const logger = cds.log('logger');
const utils = require("../../utils/Utils");

function _mapSupplierRiskEngagementDetails(oData) {
    return {
        Realm                               : oData["Realm"],
        workspaceId                         : oData["workspaceId"],
        title                               : oData["title"] || "", 
        status                              : oData["status"] || "",
        requestedOn                         : oData["requestedOn"] || "",
        requestedBy                         : oData["requestedBy"] || "",
        inherentRisk                        : oData["inherentRisk"] || "",
        residualRisk                        : oData["residualRisk"] || "",
        Engtasks                            : _maEngtasks(oData["tasks"]),
        EngControls                         : _maEngControls(oData["controls"]),
        EngAssessment                       : _maEngAssessment(oData["assessments"])
    };
}

function _maEngControls (aControls) {
    return aControls && aControls.map(function (oControls) {
        return {
            engagementId                    : oControls["engagementId"] || "",
            controlId                       : oControls["controlId"] || "",
            controlName                     : oControls["controlName"] || "",
            owner                           : oControls["owner"] || "",
            controlType                     : oControls["controlType"] || "",
            decisionMaker                   : oControls["decisionMaker"] || "",
            riskType                        : oControls["riskType"] || "",
            status                          : oControls["status"] || "",
            taskAssignee                    : oControls["taskAssignee"] || "",
            assessments                     : _maControlAssessments(oControls["assessments"])
        }
    }) || [];
}

function _maControlAssessments (aAssessments) {
    return aAssessments && aAssessments.map(function (oAssessments) {
        return {
            workspaceId                     : oAssessments["workspaceId"] || "",
            assessmentName                  : oAssessments["assessmentName"] || "",
            assessmentId                    : oAssessments["assessmentId"] || "",
            assessmentType                  : oAssessments["assessmentType"] || ""
        }
    }) || [];
}

function _maEngtasks (aTasks) {
    return aTasks && aTasks.map(function (oTasks) {
        return {
            taskId                          : oTasks["taskId"] || "",
            taskStatus                      : oTasks["taskStatus"] || "",
            name                            : oTasks["name"] || "",
            owner                           : oTasks["owner"] || "",
            originalOwner                   : oTasks["originalOwner"] || "",
            taskType                        : oTasks["taskType"] || "",
            comments                        : _maEngtasksComments(oTasks["comments"])
        }
    }) || [];
}

function _maEngtasksComments (aTaskComments) {
    return aTaskComments && aTaskComments.map(function (oTaskComments) {
        return {
            comment                         : oTaskComments["comment"] || "",
            user                            : oTaskComments["user"] || "",
            date                            : oTaskComments["date"] || ""
        }
    }) || [];
}

function _maEngAssessment (aEngAssessment) {
    return aEngAssessment && aEngAssessment.map(function (oEngAssessment) {
        return {
            workspaceId                     : oEngAssessment["workspaceId"] || "",
            assessmentName                  : oEngAssessment["assessmentName"] || "",
            assessmentType                  : oEngAssessment["assessmentType"] || "",
            visibility                      : oEngAssessment["visibility"] || "",
            imported                        : oEngAssessment["imported"] || "",
            skipped                         : oEngAssessment["skipped"] || "",
            skippedReason                   : oEngAssessment["skippedReason"] || "",
            status                          : oEngAssessment["status"] || "",
            riskScore                       : oEngAssessment["riskScore"] || "",
            targetScore                     : oEngAssessment["targetScore"] || "",
            modifiedDate                    : oEngAssessment["modifiedDate"] || null,
            sentDate                        : oEngAssessment["sentDate"] || null,
            expirationDate                  : oEngAssessment["expirationDate"] || null,
            smVendorId                      : oEngAssessment["smVendorId"] || "",
            controlId                       : oEngAssessment["controlId"] || ""
        }
    }) || [];
}

//Amount fields in object
function _getAmountPropertiesForDataCleaning () {
    return [ ];
}
    // oCertificate.timeUpdated = new Date(oCertificate.timeUpdated).toISOString();

function insertData(aData, realm)  {
    return new Promise(async function(resolve, reject)    {
        logger.info(`aData in InsertData function : ${JSON.stringify(aData)}`);

        if (!aData || aData.length === 0) {
            resolve(0);
            return;
        }
            var aCleaningProperties = _getAmountPropertiesForDataCleaning();
            logger.info(`wordpace id off aData : ${JSON.stringify(aData['workspaceId'])}`);
            var oDataCleansed = utils.cleanData(aCleaningProperties, aData, realm);
            oDataCleansed = utils.processCustomFields(oDataCleansed);
            oDataCleansed = _mapSupplierRiskEngagementDetails(oDataCleansed);
            oDataCleansed = utils.flattenTypes(oDataCleansed);

            logger.info(`aData after cleansing : ${JSON.stringify(aData)}`);

            try {
                //Select record by Unique key
               // logger.info("before select from Supper SupplierRiskEngagementDetails table");

                let res =  await SELECT.from ("sap.ariba.SupplierRiskEngagementDetails")
                    .where( { Realm : oDataCleansed.Realm, workspaceId : oDataCleansed.workspaceId }  ) ;

                let tasks = oDataCleansed["Engtasks"];
                delete oDataCleansed["Engtasks"];

                let controls = oDataCleansed["EngControls"];
                delete oDataCleansed["EngControls"];

                let engAssessment = oDataCleansed["EngAssessment"];
                delete oDataCleansed["EngAssessment"];
                    
                if ('supplier' in aData)
                {
                    oDataCleansed["supplierId"]  = aData["supplier"].smVendorId || "" ;
                    oDataCleansed["supplierName"]  = aData["supplier"].name || "" ;
                    oDataCleansed["suppliercontactFirstName"]  = aData["supplier"].contactFirstName || "" ;
                    oDataCleansed["supplierContactLastName"]  = aData["supplier"].contactLastName || "" ;
                    oDataCleansed["supplierContactEmail"]  = aData["supplier"].contactEmail || "" ;
                    oDataCleansed["supplierContactTelephone"]  = aData["supplier"].contactTelephone || "" ;
                    oDataCleansed["supplierFax"]  = aData["supplier"].fax || "" ;
                    oDataCleansed["supplierTelephone"]  = aData["supplier"].telephone || "" ;
                }
                logger.info(`records from SupplierRiskEngagementDetails table : ${JSON.stringify(res)}`); 

                 if (res.length == 0) {
                     //New record, insert
                    logger.info(`new record inserting into SupplierRiskEngagementDetails`); 

                    await INSERT .into ("sap.ariba.SupplierRiskEngagementDetails") .entries (oDataCleansed) ;
                 } else {
                     //Update existing record
                     logger.info(`updating exisiting record SupplierRiskEngagementDetails`);
                    await UPDATE ("sap.ariba.SupplierRiskEngagementDetails") .set (oDataCleansed)
                        .where( { Realm : oDataCleansed.Realm, workspaceId : oDataCleansed.workspaceId } ) ;
                 }                    
                    logger.info("after SupplierRiskEngagementDetails insert/update ");

                if ('tasks' in aData)
                    await _FullLoadtasks(tasks, oDataCleansed.Realm, oDataCleansed.workspaceId);

                if ('controls' in aData)
                    await _FullLoadControls(controls, oDataCleansed.Realm, oDataCleansed.workspaceId);

                if ('assessments' in aData)
                    await _FullLoadEngAssessment(engAssessment, oDataCleansed.Realm, oDataCleansed.workspaceId);

            } catch (e) {
                logger.error(`Error on inserting data in SupplierRiskEngagementDetails, aborting file processing, details ${e} `);
                reject(e);
            }
        resolve(aData.length);
    });

} // end of insert 

async function _FullLoadEngAssessment( engAssessment, Realm, workspaceId ){
    return new Promise(async (resolve,reject) =>{
        //Delete old records
        try {
            await  DELETE ("sap.ariba.EngAssessments").where({
                ENGASSESSMENTS_REALM : Realm ,
                ENGASSESSMENTS_WORKSPACEID : workspaceId
            }) ;
        logger.info(`deleting tasks from  EngAssessments table`);
        }
        catch(e){
            logger.error(`Error on deleting from EngAssessments, aborting file processing, details ${e} `);
            reject(e);
        }

        //Insert new records
        
        if(engAssessment){  
            for (const EA of engAssessment){
                try {
                    logger.info(`into insert of EngAssessments `);
                    logger.info(` EA data  : ${JSON.stringify(EA)}`); 

                    EA["ENGASSESSMENTS_WORKSPACEID"] = workspaceId;
                    EA["ENGASSESSMENTS_REALM"] = Realm;
                    await INSERT .into ("sap.ariba.EngAssessments") .entries (EA) ;
                } catch (e) {
                    logger.error(`Error on inserting data in EngAssessments, aborting file processing, details ${e} `);
                    reject(e);
                    break;
                }
            }
        }
        resolve();
    });
}

async function _FullLoadtasks( tasks, Realm, workspaceId ){
    return new Promise(async (resolve,reject) =>{
        //Delete old records
        try {
            await  DELETE ("sap.ariba.SupplierRiskEngagementTasks").where({
                TASKS_REALM : Realm ,
                TASKS_WORKSPACEID : workspaceId
            }) ;
        logger.info(`deleting tasks from  SupplierRiskEngagementTasks table`);
        }
        catch(e){
            logger.error(`Error on deleting from SupplierRiskEngagementTasks, aborting file processing, details ${e} `);
            reject(e);
        }

        //Insert new records
        
        if(tasks){  
            for (const TA of tasks){
                try {
                    logger.info(`into insert of SupplierRiskEngagementTasks `);
                    logger.info(` Task data  : ${JSON.stringify(TA)}`); 

                let tasksComments = TA["comments"];
                delete TA["comments"];

                    TA["TASKS_WORKSPACEID"] = workspaceId;
                    TA["TASKS_REALM"] = Realm;
                    await INSERT .into ("sap.ariba.SupplierRiskEngagementTasks") .entries (TA) ;

                    await _FullLoadTasksComments(tasksComments, Realm, workspaceId, TA["taskId"]);
                } catch (e) {
                    logger.error(`Error on inserting data in SupplierRiskEngagementTasks, aborting file processing, details ${e} `);
                    reject(e);
                    break;
                }
            }
        }
        resolve();
    });
}

async function _FullLoadTasksComments( tasksComments, Realm, workspaceId, taskId ){
    return new Promise(async (resolve,reject) =>{
        //Delete old records
        try {
            await  DELETE ("sap.ariba.SupplierRiskEngagementTaskComments").where({
                TASKCOMMENTS_TASKID : taskId
            }) ;
        logger.info(`deleting tasks from  SupplierRiskEngagementTaskComments table`);
        }
        catch(e){
            logger.error(`Error on deleting from SupplierRiskEngagementTaskComments, aborting file processing, details ${e} `);
            reject(e);
        }

        //Insert new records
        
        if(tasksComments){  
            for (const TAC of tasksComments){
                try {
                    logger.info(`into insert of SupplierRiskEngagementTaskComments `);
                    logger.info(` taskComments data  : ${JSON.stringify(TAC)}`); 
                    
                    TAC["TASKCOMMENTS_TASKID"] = taskId;
                    await INSERT .into ("sap.ariba.SupplierRiskEngagementTaskComments").entries(TAC) ;
                } catch (e) {
                    logger.error(`Error on inserting data in SupplierRiskEngagementTaskComments, aborting file processing, details ${e} `);
                    reject(e);
                    break;
                }
            }
        }
        resolve();
    });
}

async function _FullLoadControls( controls, Realm, workspaceId ){
    return new Promise(async (resolve,reject) =>{
        //Delete old records
        logger.info(`into _FullLoadControls `);
        
        try {
            await  DELETE ("sap.ariba.SupplierRiskEngagementControls").where({
                CONTROLS_REALM : Realm ,
                CONTROLS_WORKSPACEID : workspaceId
            }) ;
        logger.info(`deleting tasks from  SupplierRiskEngagementControls table`);
        }
        catch(e){
            logger.error(`Error on deleting from SupplierRiskEngagementControls, aborting file processing, details ${e} `);
            reject(e);
        }

        //Insert new records
        
        if(controls){  
            for (const CL of controls){
                try {
                    let controlsAssessments = CL["assessments"];
                    delete CL["assessments"];

                    logger.info(` control data  : ${JSON.stringify(CL)}`); 
                    CL["CONTROLS_WORKSPACEID"] = workspaceId;
                    await INSERT .into ("sap.ariba.SupplierRiskEngagementControls").entries (CL) ;
                    await _FullLoadControlAssessments(controlsAssessments, CL["controlId"]);
                } catch (e) {
                    logger.error(`Error on inserting data in SupplierRiskEngagementControls, aborting file processing, details ${e} `);
                    reject(e);
                    break;
                }
            }
        }
        resolve();
    });
}

async function _FullLoadControlAssessments( controlsAssessments, controlId ){
    return new Promise(async (resolve,reject) =>{
        //Delete old records
        try {
            await  DELETE ("sap.ariba.ControlsAssessments").where({
                    CONTROL_CONTROLID : controlId 
            }) ;
        logger.info(`deleting tasks from  ControlsAssessments table`);
        }
        catch(e){
            logger.error(`Error on deleting from ControlsAssessments, aborting file processing, details ${e} `);
            reject(e);
        }

        //Insert new records
        
        if(controlsAssessments){  
            for (const CLA of controlsAssessments){
                try {
                    logger.info(`into insert of ControlsAssessments `);
                    
                logger.info(` control assessment data  : ${JSON.stringify(CLA)}`); 
                    
                    CLA["CONTROL_CONTROLID"] = controlId;
                    await INSERT .into ("sap.ariba.ControlsAssessments").entries(CLA) ;
                } catch (e) {
                    logger.error(`Error on inserting data in ControlsAssessments, aborting file processing, details ${e} `);
                    reject(e);
                    break;
                }
            }
        }
        resolve();
    });
}
module.exports = {
    insertData
}