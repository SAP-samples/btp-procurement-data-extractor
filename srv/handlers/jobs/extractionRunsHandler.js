"use strict";

//libraries
const cds = require("@sap/cds");
const con = require("@sap-cloud-sdk/connectivity");
const httpClient = require("@sap-cloud-sdk/http-client");
const moment = require('moment');
const { default: axios } = require("axios");
const { v4: uuidv4 } = require('uuid');
const logger = cds.log('logger');
//internal modules
const utils = require('../../utils/Utils');

const slpSupplierHandler = require('../suppliers/slpSupplierHandler');
const commodityCodesHandler = require('../masterdata/commodityCodesHandler');

//Processing dataHandlers
const jobDataProcessingHelper = require('./jobDataProcessingHelper');


function _getJobFilterCriteria(sRealm, sType, srv) {
    return new Promise(async (resolve,reject)=>{
        try{
            logger.info(`Checking previous  Jobs for Supplier Extractions for ${sType} in realm ${sRealm}`);
            let oLastExecutionRun = await srv.run ( SELECT.one.from("sap.ariba.Jobs")
                .where({
                    "realm": sRealm,
                    and : { "type": sType }
                })
                .orderBy ( {createdDate: 'desc'} ) );

            // 1. If no operation at all -> start fresh extraction
            // 2. If completed operation -> start from last extraction
            // 3. If ongoing operation -> do nothing
            // 4. If failed operation -> retry last extraction page

            let oDeltaRange;
            // found previous run, check for 2-4
            if(oLastExecutionRun && oLastExecutionRun.length === undefined) {
                // 2. -> start from last extraction
                if (oLastExecutionRun.importStatus === "processed") {
                    oDeltaRange = {
                        type: "next",
                        updatedDateTo: moment.utc().format(),
                        updatedDateFrom : oLastExecutionRun.createdAt,
                        initialLoad: false,
                    }
                }
                // 4. -> re-try the failing page
                else if (oLastExecutionRun.importStatus === "error")  {
                    oDeltaRange = {
                        type: "continue",
                        pageToken: oLastExecutionRun.pageToken,
                        filterCriteria: oLastExecutionRun.filterCriteria,
                        initialLoad: false
                    }
                }
                // 3. -> new requests shall do nothing, current extraction shall proceed
                else {
                    oDeltaRange = {
                        type: "stop",
                        doNothing: true
                    }
                }
            }
            // case 1
            else {
                oDeltaRange = {
                    type: "new",
                    initialLoad: true
                };
            }

            resolve(oDeltaRange);

        } catch(e) {
            logger.error(`Error while checking previous execution runs for type ${sType} in realm ${sRealm} details: ${e}`);
            reject(e);
        }
    });
}

async function _getSupplierDataRequestConfig (sRealm) {
    //Get API Details
    let oDestination = await con.getDestination({ destinationName: sRealm + "-slp-supplier-data" });

    //Destination validation
    if(!oDestination || !oDestination.originalProperties.destinationConfiguration.apikey) {
        logger.error(`Destination does not exist or is incorrectly configured`);
        throw Error("Destination does not exist or is incorrectly configured");
    }

    //building request
    let oRequestConfig = await httpClient.buildHttpRequest(oDestination);
    oRequestConfig.baseURL = oRequestConfig.baseURL + "/supplierdatapagination/v4/prod/vendorDataRequests";
    oRequestConfig.method = "post";
    oRequestConfig.params = { realm: sRealm };
    oRequestConfig.headers["Accept"] = oRequestConfig.headers["Content-Type"]="application/json";
    oRequestConfig.headers["apikey"] = oDestination.originalProperties.destinationConfiguration.apikey;

    let oPayload = { "outputFormat": "JSON", "withQuestionnaire": true };
    oRequestConfig.data = oPayload;

    return oRequestConfig
}

async function extractSupplierData (context, next) {
    return cds.tx (async srv => {
        //Get Job Details
        let realm = context.data.realm,
            loadMode = context.data.loadMode,
            sType = "SLP";

        logger.info(`Extracting Supplier Data for ${realm} with Load Mode ${loadMode}`);

        let oDeltaRange = await _getJobFilterCriteria(realm, sType, srv);

        // If ongoing operation -> do nothing
        if(oDeltaRange.doNothing) {
            return "Ongoing operation, stopped this one";
        }

        let oJob = {
            jobId: uuidv4(),
            Realm: realm,
            status: "processing",
            importStatus: "processing",
            type: sType
        };
        await srv.run ( INSERT.into ("sap.ariba.Jobs") .entries (oJob) );
        await srv.commit();

        let oRequestConfig = await _getSupplierDataRequestConfig(realm);

        // Job_Pages processing
        let oJobPage = {},
            sRepeat = true,
            iProcessedEntityCount = 0,
            iTotalNumOfPages = 0;
        while (sRepeat) {
            // Construct the filter based on the given details
            let oFilter = "";

            // different cases:
            // 1. completely new load -> initialLoad = true
            // 2. follow-up load -> initialLoad = false, pageToken = null
            // 3. continue from error load -> initialLoad = false, pageToken = x --> use filterCriteria as before


            // define FILTER
            // Full Load Mode is overruling everything
            if (!loadMode || loadMode !='F') {
                switch (oDeltaRange.type) {
                    case "new":
                        break;
                    case "next":
                        oFilter = `updatedDateFrom ge ${oDeltaRange.updatedDateFrom} and updatedDateTo le ${oDeltaRange.updatedDateTo}`;
                        break;
                    case "continue":
                        oFilter = oDeltaRange.filterCriteria;
                        break;
                }
            }
            logger.info(`Filter defined: ${oFilter}`);
            if (oFilter) {
                oRequestConfig.params["$filter"] = oFilter;
            }

            // define PAGE TOKEN
            if(oDeltaRange.pageToken) {
                //creating a new page for current job
                logger.info(`Continue run with page token: ${oDeltaRange.pageToken}`);
                oRequestConfig.params["$skip"] = oDeltaRange.pageToken;
            }

            oJobPage = {
                jobid_jobId: oJob.jobId,
                jobid_Realm: oJob.Realm,
                pageToken: oDeltaRange.pageToken,
                processingPosition: oDeltaRange.pageToken ? oDeltaRange.pageToken : 0
            };

            // 3. we now can sent the request in infinite loop -> ending the loop when either
            // 3.1 No more page token in the response
            // 3.2 API rate limits hit
            try {
                //Create Execution Run
                logger.info(`Executing run for ${realm} with type ${sType}`);
                let aResponse = await utils.executeRequest(oRequestConfig, 3);
                let aData = aResponse.data;

                if (aData && aData[aData.length - 1] && aData[aData.length - 1].nextToken) {
                    oDeltaRange.pageToken = aData[aData.length - 1].nextToken;
                    aData.pop();
                } else {
                    oDeltaRange.pageToken = null;
                    // Stop the Loop!
                    sRepeat = false;
                }

                // Process the records
                let affectedRows = await slpSupplierHandler.insertData(aData, realm);
                iProcessedEntityCount += affectedRows;
                iTotalNumOfPages++;

                // Update Job_Page entry and save it
                oJobPage.status = "processed";
                oJobPage.totalNumOfRecords = affectedRows
                oJobPage.pageToken = oDeltaRange.pageToken;
                oJobPage.completedDate = moment.utc().format();

                await srv.begin(oJob);
                await srv.run ( INSERT.into ("sap.ariba.Job_Pages") .entries (oJobPage) );

                // Update Job with latest pageToken
                oJob.pageToken = oDeltaRange.pageToken;
                oJob.filterCriteria = oFilter;

                await srv.run ( UPDATE ("sap.ariba.Jobs") .set (oJob) .where ({ jobId : oJob.jobId, Realm: oJob.Realm }) );
                await srv.commit();

            } catch(e) {
                // Rate limits HIT; store latest pageToken in DB and start from there once newly triggered
                logger.error(`Error while extracting supplier data : ${e}`);
                logger.info(`Extraction run is captured and will be processed in the next run`);

                oJobPage.status = "Processing error";
                oJobPage.pageToken = oDeltaRange.pageToken;
                oJobPage.processingPosition = oDeltaRange.pageToken;
                oJobPage.error = e.message;

                await srv.begin(e);
                await srv.run ( INSERT.into ("sap.ariba.Job_Pages") .entries (oJobPage) );
                await srv.commit();

                // Stop the Loop!
                sRepeat = false;
            }

        }
        // end of while loop


        // SLP Runs are fully done; now it is time to update the SupplierId into SLPSuppliers entity
        await slpSupplierHandler.enrichSupplierId(context, realm, loadMode);


        // Now once all the pages are processed, we can update the Job with it's status
        // depending on successful processing or error processing
        if (oJobPage.status === "Processing error") {
            oJob.status = "error";
            oJob.importStatus = "error";
        } else {
            oJob.status = "completed";
            oJob.importStatus = "processed";
            oJob.totalNumOfRecords = iProcessedEntityCount;
            oJob.totalNumOfPages = iTotalNumOfPages;
            oJob.pageToken = null;
            oJob.completedDate = moment.utc().format();
        }

        await srv.begin(oJob);
        await srv.run ( UPDATE ("sap.ariba.Jobs") .set (oJob) .where ({ jobId : oJob.jobId, Realm: oJob.Realm }) );
        await srv.commit();

        logger.info(`Extraction run finished!`);

        return "Done";
    });
}





async function extractSupplierQNAData (oRequestConfig, pageToken) { }


async function _getSupplierCertificateRequestConfig (sRealm) {
    //Get API Details
    let oDestination = await con.getDestination({ destinationName: sRealm + "-slp-supplier-data" });

    //Destination validation
    if(!oDestination || !oDestination.originalProperties.destinationConfiguration.apikey) {
        logger.error(`Destination does not exist or is incorrectly configured`);
        throw Error("Destination does not exist or is incorrectly configured");
    }

    //building request
    let oRequestConfig = await httpClient.buildHttpRequest(oDestination);
    oRequestConfig.baseURL = oRequestConfig.baseURL + "/supplierdatapagination/v4/prod/vendors";
    oRequestConfig.params = { realm: sRealm };
    oRequestConfig.headers["Accept"] = oRequestConfig.headers["Content-Type"]="application/json";
    oRequestConfig.headers["apikey"] = oDestination.originalProperties.destinationConfiguration.apikey;

    return oRequestConfig
}
async function extractSupplierCertificatesData (context, next) {
    return cds.tx (async srv => {
        //Get Job Details
        let sRealm = context.data.realm,
            loadMode = context.data.loadMode,
            sType = "Certificates";

        logger.info(`Extracting Supplier Certificates Data for ${sRealm} with Load Mode ${loadMode}`);

        let oJob = {
            jobId: uuidv4(),
            Realm: sRealm,
            status: "processing",
            importStatus: "processing",
            type: sType
        };
        await srv.run ( INSERT.into ("sap.ariba.Jobs") .entries (oJob) );

        let oRequestConfig = await _getSupplierCertificateRequestConfig(sRealm);

        // Construct the supplier queue which is executed sequentially..
        let aSuppliers = await srv.run ( SELECT `SMVendorId` .from("sap.ariba.SLPSuppliers")
            .where ({ "realm" : sRealm })
            .orderBy ( {modifiedAt: 'desc'} ) );

        let sBaseUrlString = "/{smVendorId}/certificates";

        for (const oSupplier of aSuppliers) {
            if (oSupplier.SMVendorId) {
                try {
                    // call the API per supplier and process the records accordingly
                    oRequestConfig.url = sBaseUrlString.replace("{smVendorId}", oSupplier.SMVendorId);

                    logger.info(`Executing Certificates Extraction run for supplier ${oSupplier.SMVendorId} in Realm ${sRealm}`);
                    let aResponse = await utils.executeRequest(oRequestConfig, 1);
                    let aData = aResponse.data && aResponse.data._embedded && aResponse.data._embedded.certificateList;

                    await slpSupplierHandler.insertCertificateData(aData, sRealm, oSupplier.SMVendorId);
                } catch (e) {
                    // For some reason the API often do reply with ERROR 400 for specific suppliers
                    // Those suppliers will just be logged, but the overall processing do continue
                    logger.error(`Fail in Executing Certificates Extraction run for supplier ${oSupplier.SMVendorId} in Realm ${sRealm}, details ${e}`);
                }
            }
        };

        oJob.status = "completed";
        oJob.importStatus = "processed";
        oJob.totalNumOfRecords = aSuppliers.length;
        oJob.completedDate = moment.utc().format();

        await srv.run ( UPDATE ("sap.ariba.Jobs") .set (oJob) .where ({ jobId : oJob.jobId, Realm: oJob.Realm }) );

        logger.info(`Extraction run finished!`);

        return "Done";
    });
}


async function _getSupplierRiskRequestConfig (sRealm) {
    //Get API Details
    let oDestination = await con.getDestination({ destinationName: sRealm + "-risk-supplier-data" });

    //Destination validation
    if(!oDestination || !oDestination.originalProperties.destinationConfiguration.apikey) {
        logger.error(`Destination does not exist or is incorrectly configured`);
        throw Error("Destination does not exist or is incorrectly configured");
    }

    //building request
    let oRequestConfig = await httpClient.buildHttpRequest(oDestination);
    oRequestConfig.params = { realm: sRealm };
    oRequestConfig.headers["Accept"] = oRequestConfig.headers["Content-Type"]="application/json";
    oRequestConfig.headers["apikey"] = oDestination.originalProperties.destinationConfiguration.apikey;

    return oRequestConfig
}

async function extractSupplierRiskData (context, next) {
    return cds.tx (async srv => {
        //Get Job Details
        let sRealm = context.data.realm,
            loadMode = context.data.loadMode,
            sType = "Risk";

        logger.info(`Extracting Supplier Risk Data for ${sRealm} with Load Mode ${loadMode}`);

        let oJob = {
            jobId: uuidv4(),
            Realm: sRealm,
            status: "processing",
            importStatus: "processing",
            type: sType
        };
        await srv.run ( INSERT.into ("sap.ariba.Jobs") .entries (oJob) );

        let oRequestConfig = await _getSupplierRiskRequestConfig(sRealm);

        // Construct the supplier queue which is executed sequentially..
        let aSuppliers = await srv.run ( SELECT `SMVendorId` .from("sap.ariba.SLPSuppliers")
            .where ({ "realm" : sRealm })
            .orderBy ( {modifiedAt: 'desc'} ) );

        let sBaseUrlString = "/risk-exposure/v1/prod/suppliers/{smVendorId}/exposures";

        for (const oSupplier of aSuppliers) {
            if (oSupplier.SMVendorId) {
                try {
                    // call the API per supplier and process the records accordingly
                    oRequestConfig.url = sBaseUrlString.replace("{smVendorId}", oSupplier.SMVendorId);

                    logger.info(`Executing Risk Extraction run for supplier ${oSupplier.SMVendorId} in Realm ${sRealm}`);
                    let aResponse = await utils.executeRequest(oRequestConfig, 1);
                    let aData = aResponse.data;

                    await slpSupplierHandler.insertRiskData(aData, sRealm, oSupplier.SMVendorId);
                } catch (e) {
                    // For some reason the API often do reply with ERROR 400 for specific suppliers
                    // Those suppliers will just be logged, but the overall processing do continue
                    logger.error(`Fail in Executing Risk Extraction run for supplier ${oSupplier.SMVendorId} in Realm ${sRealm}, details ${e}`);
                }
            }
        };

        oJob.status = "completed";
        oJob.importStatus = "processed";
        oJob.totalNumOfRecords = aSuppliers.length;
        oJob.completedDate = moment.utc().format();

        await srv.run ( UPDATE ("sap.ariba.Jobs") .set (oJob) .where ({ jobId : oJob.jobId, Realm: oJob.Realm }) );

        logger.info(`Extraction run finished!`);

        return "Done";
    });
}

async function _getMasterDataRequestConfig (sRealm,sEntityName) {
    //Get API Details
    let oDestination = await con.getDestination({ destinationName: sRealm + "-mds-search" });

    //Destination validation
    if(!oDestination || !oDestination.originalProperties.destinationConfiguration.apikey || !oDestination.originalProperties.destinationConfiguration.realm) {
        logger.error(`Destination does not exist or is incorrectly configured`);
        throw Error("Destination does not exist or is incorrectly configured");
    }

    //building request
    let oRequestConfig = await httpClient.buildHttpRequest(oDestination);
    oRequestConfig.baseURL = oRequestConfig.baseURL + `/mds-search/v1/prod/entities/${sEntityName}`;
    oRequestConfig.method = "get";
    oRequestConfig.headers["Accept"] = oRequestConfig.headers["Content-Type"]="application/json";
    oRequestConfig.headers["apiKey"] = oDestination.originalProperties.destinationConfiguration.apikey;
    oRequestConfig.headers["x-Realm"] = oDestination.originalProperties.destinationConfiguration.realm;
    oRequestConfig.headers["Accept-Language"] = "en";

    oRequestConfig.params = { };

    return oRequestConfig
}

async function extractMasterData (context, next) {
    return cds.tx (async srv => {
        try{
        //Get Job Details
        let realm = context.data.realm,
            loadMode = context.data.loadMode,
            sEntityName = context.data.entityName,
            sType = `MD-${sEntityName}`,
            iPageSize =4000;

        logger.info(`Extracting ${sEntityName} Data for ${realm} with Load Mode ${loadMode}`);

        let oDeltaRange = await _getJobFilterCriteria(realm, sType, srv);
        // If ongoing operation -> do nothing
        if(oDeltaRange.doNothing) {
            return "Ongoing operation, stopped this one";
        }


        let oJob = {
            jobId: uuidv4(),
            Realm: realm,
            status: "processing",
            importStatus: "processing",
            type: sType
        };
        await srv.run ( INSERT.into ("sap.ariba.Jobs") .entries (oJob) );

        let oRequestConfig = await _getMasterDataRequestConfig(realm,sEntityName);

        // Job_Pages processing
        let oJobPage = {},
            sRepeat = true,
            iProcessedEntityCount = 0,
            iTotalNumOfPages = 0;
        while (sRepeat) {
            // Full load only

            //Forcing page size to x records
            oRequestConfig.params["$top"] = iPageSize;

            // define PAGE TOKEN
            if(oDeltaRange.pageToken) {
                //creating a new page for current job
                logger.info(`Continue run with page token: ${oDeltaRange.pageToken}`);
                oRequestConfig.params["$skip"] = oDeltaRange.pageToken;
            }

            oJobPage = {
                jobid_jobId: oJob.jobId,
                jobid_Realm: oJob.Realm,
                pageToken: oDeltaRange.pageToken,
                processingPosition: oDeltaRange.pageToken ? oDeltaRange.pageToken : 0
            };

            // 3. we now can sent the request in infinite loop -> ending the loop when either
            // 3.1 No more result in the response
            // 3.2 API rate limits hit
            try {
                //Create Execution Run
                logger.info(`Executing run for ${realm} with type ${sType}`);
                let aResponse = await utils.executeRequest(oRequestConfig, 3);
                let aData = aResponse.data;

                if (aData && aData.length>0) {
                    oDeltaRange.pageToken = (oDeltaRange.pageToken )? oDeltaRange.pageToken+ iPageSize : iPageSize;
                } else {
                    oDeltaRange.pageToken = null;
                    // Stop the Loop!
                    sRepeat = false;
                }

                // Process the records
                let affectedRows=0;
                switch(sEntityName){
                    case "commoditycodes":
                        affectedRows = await commodityCodesHandler.insertData(aData, realm);
                        iProcessedEntityCount += affectedRows;
                        iTotalNumOfPages++;
                        break;

                    default:
                        break;
                }


                // Update Job_Page entry and save it
                oJobPage.status = "processed";
                oJobPage.totalNumOfRecords = affectedRows;
                oJobPage.pageToken = oDeltaRange.pageToken;
                oJobPage.completedDate = moment.utc().format();

                await srv.run ( INSERT.into ("sap.ariba.Job_Pages") .entries (oJobPage) );


                // Update Job with latest pageToken
                oJob.pageToken = oDeltaRange.pageToken;
                await srv.run ( UPDATE ("sap.ariba.Jobs") .set (oJob) .where ({ jobId : oJob.jobId, Realm: oJob.Realm }) );

                await srv.commit();

            } catch(e) {
                // Rate limits HIT; store latest pageToken in DB and start from there once newly triggered
                logger.error(`Error while extracting master data : ${e}`);
                logger.info(`Extraction run is captured and will be processed in the next run`);

                oJobPage.status = "Processing error";
                oJobPage.pageToken = oDeltaRange.pageToken;
                oJobPage.processingPosition = oDeltaRange.pageToken;
                oJobPage.error = e.message;

                await srv.run ( INSERT.into ("sap.ariba.Job_Pages") .entries (oJobPage) );
                await srv.commit();

                // Stop the Loop!
                sRepeat = false;
            }

        }
        // end of while loop



        // Now once all the pages are processed, we can update the Job with it's status
        // depending on successful processing or error processing
        if (oJobPage.status === "Processing error") {
            oJob.status = "error";
            oJob.importStatus = "error";
        } else {
            oJob.status = "completed";
            oJob.importStatus = "processed";
            oJob.totalNumOfRecords = iProcessedEntityCount;
            oJob.totalNumOfPages = iTotalNumOfPages;
            oJob.pageToken = null;
            oJob.completedDate = moment.utc().format();
        }

        await srv.begin(oJob);
        await srv.run ( UPDATE ("sap.ariba.Jobs") .set (oJob) .where ({ jobId : oJob.jobId, Realm: oJob.Realm }) );
        await srv.commit();

        logger.info(`Master Data Extraction run finished!`);

        return "Done";

        }catch(e){
            logger.info('Generic error occured',e)
        }
    });
}

async function _GetSyncJobDateRange(realm,viewTemplateName,apiType,srv){
    return new Promise(async (resolve,reject)=>{
        try{
            logger.info(`Checking previous  Jobs for Synchronous Extractions for ${viewTemplateName} in realm ${realm}`);
            let oLastExecutionRun = await srv.run ( SELECT.one.from("sap.ariba.Jobs")
                .where({realm : realm, viewTemplateName: viewTemplateName,importStatus:"processed"})
                .orderBy ( {createdDate: 'desc'} ) );

            //Case 1 : no previous job:  Do nothing - full load should be asynchronous
            //Case 2 : ongoing previous job: Do nothing
            //Case 3 : finished job but more than a month ago : Do Nothing - Delta is 1 year max
            //Case 4 : finished previous job lest than a month ago - Generate delta load
            //Case 5 : Previous Job errored out - TODO Handle case with Async Job error and Sync job errors
            let oDeltaRange;
            // found previous run, check for 2-4
            if(oLastExecutionRun && oLastExecutionRun.length === undefined) {
                // Previous Job exists
                if (oLastExecutionRun.importStatus === "processed") {
                    let diffInDays = (moment.utc()).diff(moment(oLastExecutionRun.createdAt),'days');
                    if(diffInDays >364 ){
                        //Case 3 - Existing job more than a month ago
                        logger.error(`Abort: Previous Jobs for Synchronous Extractions for ${viewTemplateName} in realm ${realm} is older than 364 days (days: ${diffInDays} ) : Asynchronous load should be used`);
                        oDeltaRange = {
                            type: "stop",
                            doNothing: true
                        }
                        
                    }else{
                        //Case 4: Previous joub less than 364 days ago, calculate date range
                        logger.info(`Previous Jobs for Synchronous Extractions for ${viewTemplateName} in realm ${realm} executed on ${oLastExecutionRun.createdAt} , generating delta range`);
                       
                        oDeltaRange = {
                            type: "next",
                            updatedDateTo: moment.utc().format(),
                            // TODO: this is causing an issue; createdDate is not set when sync extraction run is processed;
                            // hence updatedDateFrom is null which is causing 400 error on Ariba API
                            // TODO: verify if it works with createdAt timestamps
                            updatedDateFrom : oLastExecutionRun.createdDate,
                            initialLoad: false,
                        }
                    }
                }
                //Case 5 Previous Job errored out
                else if (oLastExecutionRun.importStatus === "error")  {
                    //TODO: Review how it works with async job previous error
                    logger.info(`Previous Jobs for Synchronous Extractions for ${viewTemplateName} in realm ${realm} is in error status`);
                      
                    oDeltaRange = {
                        type: "continue",
                        pageToken: oLastExecutionRun.pageToken,
                        filterCriteria: oLastExecutionRun.filterCriteria,
                        initialLoad: false
                    }
                }
                //Case 2 : Current Job ongoing
                else {
                    logger.error(`Abort: current job still ongoing for ${viewTemplateName} in realm ${realm} `);
                    oDeltaRange = {
                        type: "stop",
                        doNothing: true
                    }
                }
            }
            // case 1 : No previous job
            else {
                logger.error(`Abort: No previous job ${viewTemplateName} in realm ${realm} : Asynchronous load should be used `);
                oDeltaRange = {
                    type: "stop",
                    doNothing: true
                }
            }

            resolve(oDeltaRange);

        } catch(e) {
            logger.error(`Error while checking previous execution runs for type ${viewTemplateName} in realm ${realm} details: ${e}`);
            reject(e);
        }
    })
};

async function _getSyncDataRequestConfig (sRealm,sviewTemplateName,sapiType) {

    let oDestination,jobEndpoint;
     //Get API Details
     switch(sapiType){
        case 'analytical':
            oDestination = await con.getDestination({ destinationName: sRealm + "-reporting-analytics" });
            jobEndpoint = "/analytics-reporting-details/v1/prod/views/";
            break;
        case 'procurementReporting':
            oDestination = await con.getDestination({ destinationName: sRealm + "-procurement-reporting" });
            jobEndpoint = "/procurement-reporting-details/v2/prod/views/";
            break;
        case 'sourcingReporting':
            oDestination = await con.getDestination({ destinationName: sRealm + "-sourcing-reporting" });
            jobEndpoint = "/sourcing-reporting-details/v1/prod/views/";
            break;
    }

    //Destination validation
    // TODO: checking for realm in destination really required? In the existing destinations, I haven't used this additional property as:
    // 1. realm is in the name already, 2. took the value from the request input
    if(!oDestination || !oDestination.originalProperties.destinationConfiguration.apikey || !sRealm) {
        logger.error(`Destination does not exist or is incorrectly configured`);
        throw Error("Destination does not exist or is incorrectly configured");
    }

    //building request
    let oRequestConfig = await httpClient.buildHttpRequest(oDestination);
    oRequestConfig.url = jobEndpoint + sviewTemplateName;
    oRequestConfig.method = "get";
    oRequestConfig.headers["Accept"] = oRequestConfig.headers["Content-Type"]="application/json";
    oRequestConfig.headers["apiKey"] = oDestination.originalProperties.destinationConfiguration.apikey;
    oRequestConfig.headers["Accept-Language"] = "en";

    oRequestConfig.params = {realm: sRealm };

    return oRequestConfig
}

async function extractSyncData (context, next) {
    return cds.tx (async srv => {
        try{
        //Get Job Details
        let realm = context.data.realm,
            sviewTemplateName = context.data.viewTemplateName,
            sapiType = context.data.apiType;

        if(!sapiType || !sviewTemplateName || !realm){
            logger.error(`Missing job parameters: realm, apiType and viewTemplateName are mandatory`);
            return "Missing job parameters: realm, apiType and viewTemplateName are mandatory";
        }

        logger.info(`Extracting synchronously ${sviewTemplateName} Data for ${realm} `);

        let oDeltaRange = await _GetSyncJobDateRange(realm, sviewTemplateName,sapiType,srv);
        // If full load, ongoing job or delta > 364 days - abort job
        if(oDeltaRange.doNothing) {
            return "Job Aborted - Check Logs for details";
        }

        let oJob = {
            jobId: uuidv4(),
            Realm: realm,
            status: "processing",
            importStatus: "processing",
            viewTemplateName: sviewTemplateName,
            type: "Sync-"+sviewTemplateName,
            createdDate: moment.utc().format()
        };
        await srv.run ( INSERT.into ("sap.ariba.Jobs") .entries (oJob) );

        let oRequestConfig = await _getSyncDataRequestConfig(realm,sviewTemplateName,sapiType);
        //Set filters
        oRequestConfig.params["filters"]={updatedDateFrom:oDeltaRange.updatedDateFrom,updatedDateTo:oDeltaRange.updatedDateTo};

        // Job_Pages processing
        let oJobPage = {},
            sRepeat = true,
            iProcessedEntityCount = 0,
            iTotalNumOfPages = 0;
        while (sRepeat) {

            // Continuing from last page token
            if(oDeltaRange.pageToken) {
                //creating a new page for current job
                logger.info(`Continue run with page token: ${oDeltaRange.pageToken}`);
                oRequestConfig.params["PageToken"] = oDeltaRange.pageToken;
            }

            oJobPage = {
                jobid_jobId: oJob.jobId,
                jobid_Realm: oJob.Realm,
                pageToken: oDeltaRange.pageToken
            };

            // 3. we now can sent the request in infinite loop -> ending the loop when either
            // 3.1 No more result in the response
            // 3.2 API rate limits hit
            try {
                //Create Execution Run
                logger.info(`Executing run for ${realm} with view template ${sviewTemplateName}`);
                let aResponse = await utils.executeRequest(oRequestConfig, 3);
                let aData = aResponse.data;

                if (aData && aData.PageToken) {
                    oDeltaRange.pageToken = aData.PageToken;
                } else {
                    oDeltaRange.pageToken = null;
                    // Stop the Loop!
                    sRepeat = false;
                }

                // Process the records
                let affectedRows = await jobDataProcessingHelper.ProcessData(sviewTemplateName,aData.Records,realm);
                iProcessedEntityCount += affectedRows;
                iTotalNumOfPages++;


                // Update Job_Page entry and save it
                oJobPage.status = "processed";
                oJobPage.totalNumOfRecords = affectedRows;
                oJobPage.pageToken = oDeltaRange.pageToken;
                oJobPage.completedDate = moment.utc().format();

                await srv.run ( INSERT.into ("sap.ariba.Job_Pages") .entries (oJobPage) );

                // Update Job with latest pageToken
                oJob.pageToken = oDeltaRange.pageToken;
                await srv.run ( UPDATE ("sap.ariba.Jobs") .set (oJob) .where ({ jobId : oJob.jobId, Realm: oJob.Realm }) );

                await srv.commit();

            } catch(e) {
                // Rate limits HIT; store latest pageToken in DB and start from there once newly triggered
                logger.error(`Error while extracting synchronous data : ${e}`);
                logger.info(`Extraction run is captured and will be processed in the next run`);

                oJobPage.status = "Processing error";
                oJobPage.pageToken = oDeltaRange.pageToken;
                oJobPage.processingPosition = oDeltaRange.pageToken;
                oJobPage.error = e.message;

                await srv.run ( INSERT.into ("sap.ariba.Job_Pages") .entries (oJobPage) );
                await srv.commit();

                // Stop the Loop!
                sRepeat = false;
            }

        }
        // end of while loop

        // Now once all the pages are processed, we can update the Job with it's status
        // depending on successful processing or error processing
        if (oJobPage.status === "Processing error") {
            oJob.status = "error";
            oJob.importStatus = "error";
        } else {
            oJob.status = "completed";
            oJob.importStatus = "processed";
            oJob.totalNumOfRecords = iProcessedEntityCount;
            oJob.totalNumOfPages = iTotalNumOfPages;
            oJob.pageToken = null;
            oJob.completedDate = moment.utc().format();
        }
        await srv.begin(oJob);
        await srv.run ( UPDATE ("sap.ariba.Jobs") .set (oJob) .where ({ jobId : oJob.jobId, Realm: oJob.Realm }) );
        await srv.commit();

        logger.info(`Synchronous Data Extraction run finished for ${sviewTemplateName}`);

        return "Done";

        }catch(e){
            logger.error('Synchronous Data Extraction Generic error occured',e)
        }
    });
}


module.exports = {
    extractSupplierData,
    extractSupplierQNAData,
    extractSupplierRiskData,
    extractMasterData,
    extractSyncData,
    extractSupplierCertificatesData
};