"use strict";

//libraries
const cds = require("@sap/cds");
const con = require("@sap-cloud-sdk/connectivity");
const httpClient = require("@sap-cloud-sdk/http-client");
const moment = require('moment');
const { default: axios } = require("axios");
const { v4: uuidv4 } = require('uuid');
const logger = cds.log('logger');
const qs = require('qs');
//internal modules
const utils = require('../../utils/Utils');


const paymentRequestHandler = require('../concur/paymentRequestHandler');
const invoicesHandler = require('../concur/invoicesHandler');
const purchaseOrdersHandler = require('../concur/purchaseOrdersHandler');
const vendorsHandler = require('../concur/vendorsHandler');


async function _getConcurRequestConfig (sRealm) {
    //Get API Details
    let oDestination = await con.getDestination({ destinationName: sRealm + "-concur-invoices" });

    //Destination validation
    if(!oDestination) {
        logger.error(`Destination does not exist or is incorrectly configured`);
        throw Error("Destination does not exist or is incorrectly configured");
    }

    // concur APIs rely on token_refresh oAuth2 handling which the Cloud SDK doesn't seem to support..
    // as a consequence, need to handle the token creation manually...

    //building request
    let oRequestConfig = {};
    oRequestConfig.url = oDestination.originalProperties.URL;
    oRequestConfig.headers = {};
    oRequestConfig.headers["Accept"] = "application/json";
    oRequestConfig.headers["Content-Type"] = "application/json";

    // read the bearer token
    let oTokenPayload = {
        client_id : oDestination.originalProperties.clientId,
        client_secret : oDestination.originalProperties.clientSecret,
        grant_type : "refresh_token",
        refresh_token : oDestination.originalProperties.refresh_token
    };
    let oTokenConfig = {
        url : oDestination.originalProperties.tokenServiceURL,
        method : "post",
        data : qs.stringify(oTokenPayload),
        headers : {}
    };
    oTokenConfig.headers["Content-Type"] = "application/x-www-form-urlencoded";

    try {
        let resToken = await axios.request(oTokenConfig);

        oRequestConfig.headers["Authorization"] = "Bearer " + resToken.data.access_token;
        oRequestConfig.params = {};
    }
    catch (error) {
        throw new Error("Failed to fetch token, please check the validity of the refresh_token!");
    }

    return oRequestConfig
}

async function extractPaymentRequests (context, next) {
    return cds.tx (async srv => {
        //Get Job Details
        let realm = context.data.realm,
            loadMode = context.data.loadMode,
            sType = "CI_PaymentRequests";

        logger.info(`Extracting Concur Invoice Payment Request Data for ${realm} with Load Mode ${loadMode}`);

        let oDeltaRange = await utils.getJobFilterCriteria(realm, sType);

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
        await INSERT.into ("sap.ariba.Jobs") .entries (oJob) ;

        let oRequestConfig = await _getConcurRequestConfig(realm);
        oRequestConfig.url = oRequestConfig.url + "/v3.0/invoice/paymentrequestdigests";

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
                        // default filter, get data from 2019
                        oFilter = "2019-01-01";
                        break;
                    case "next":
                        oFilter = oDeltaRange.updatedDateFrom.split("T")[0];
                        break;
                    case "continue":
                        oFilter = oDeltaRange.filterCriteria || "2019-01-01";
                        break;
                }
            }

            logger.info(`Filter defined: ${oFilter}`);
            if (oFilter) {
                oRequestConfig.params["createDateAfter"] = oFilter;
            }

            // define PAGE TOKEN
            if(oDeltaRange.pageToken) {
                //creating a new page for current job
                logger.info(`Continue run with page token: ${oDeltaRange.pageToken}`);
                oRequestConfig.params["offset"] = oDeltaRange.pageToken;
            }

            oJobPage = {
                jobId_jobId: oJob.jobId,
                jobId_Realm: oJob.Realm,
                pageToken: oDeltaRange.pageToken,
                processingPosition: iProcessedEntityCount
            };

            // 3. we now can sent the request in infinite loop -> ending the loop when either
            // 3.1 No more page token in the response
            // 3.2 API rate limits hit
            try {
                // Create Execution Run
                logger.info(`Executing run for ${realm} with type ${sType}`);
                let aResponse = await utils.executeRequest(oRequestConfig, 3);
                let oData = aResponse.data,
                    aData = oData.PaymentRequestDigest;

                if (oData && oData.NextPage) {
                    oDeltaRange.pageToken = oData.NextPage.split("offset=")[1];
                } else {
                    oDeltaRange.pageToken = null;
                    // Stop the Loop!
                    sRepeat = false;
                }

                // Process the records
                let affectedRows = await paymentRequestHandler.insertData(aData, realm);
                iProcessedEntityCount += affectedRows;
                iTotalNumOfPages++;

                // Update Job_Page entry and save it
                oJobPage.status = "processed";
                oJobPage.totalNumOfRecords = affectedRows
                oJobPage.pageToken = oDeltaRange.pageToken;
                oJobPage.completedDate = moment.utc().format();

                await INSERT.into ("sap.ariba.Job_Pages") .entries (oJobPage) ;

                // Update Job with latest pageToken
                oJob.pageToken = oDeltaRange.pageToken;
                oJob.filterCriteria = oFilter;

                await UPDATE ("sap.ariba.Jobs") .set (oJob) .where ({ jobId : oJob.jobId, Realm: oJob.Realm }) ;

            } catch(e) {
                // store latest pageToken in DB and start from there once newly triggered
                logger.error(`Error while extracting concur invoice payment request data : ${e}`);
                logger.info(`Extraction run is captured and will be processed in the next run`);

                oJobPage.status = "Processing error";
                oJobPage.pageToken = oDeltaRange.pageToken;
                oJobPage.processingPosition = iProcessedEntityCount;
                oJobPage.error = e.message;

                await INSERT.into ("sap.ariba.Job_Pages") .entries (oJobPage) ;

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

        await  UPDATE ("sap.ariba.Jobs") .set (oJob) .where ({ jobId : oJob.jobId, Realm: oJob.Realm }) ;

        logger.info(`Extraction run finished!`);

        return "Done";
    });
}

async function extractVendors (context, next) {
    return cds.tx (async srv => {
        //Get Job Details
        let realm = context.data.realm,
            loadMode = context.data.loadMode,
            sType = "CI_Vendors";

        logger.info(`Extracting Concur Invoice Vendors Data for ${realm} with Load Mode ${loadMode}`);

        let oDeltaRange = await utils.getJobFilterCriteria(realm, sType);

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
        await INSERT.into ("sap.ariba.Jobs") .entries (oJob) ;

        let oRequestConfig = await _getConcurRequestConfig(realm);
        oRequestConfig.url = oRequestConfig.url + "/v3.0/invoice/vendors";
        oRequestConfig.params["limit"] = 1000; // max value for limit

        // Job_Pages processing
        let oJobPage = {},
            sRepeat = true,
            iProcessedEntityCount = 0,
            iTotalNumOfPages = 0;
        while (sRepeat) {
            // API doesn't allow to filter on creation date or update date; it will be always full load - however, we have to handle pagination

            // define PAGE TOKEN
            if(oDeltaRange.pageToken) {
                //creating a new page for current job
                logger.info(`Continue run with page token: ${oDeltaRange.pageToken}`);
                oRequestConfig.params["offset"] = oDeltaRange.pageToken;
            }

            oJobPage = {
                jobId_jobId: oJob.jobId,
                jobId_Realm: oJob.Realm,
                pageToken: oDeltaRange.pageToken,
                processingPosition: iProcessedEntityCount
            };

            // 3. we now can sent the request in infinite loop -> ending the loop when either
            // 3.1 No more page token in the response
            // 3.2 API rate limits hit
            try {
                // Create Execution Run
                logger.info(`Executing run for ${realm} with type ${sType}`);
                let aResponse = await utils.executeRequest(oRequestConfig, 3);
                let oData = aResponse.data,
                    aData = oData.Vendor;

                if (oData && oData.NextPage) {
                    oDeltaRange.pageToken = oData.NextPage.split("offset=")[1];
                } else {
                    oDeltaRange.pageToken = null;
                    // Stop the Loop!
                    sRepeat = false;
                }

                // Process the records
                let affectedRows = await vendorsHandler.insertData(aData, realm);
                iProcessedEntityCount += affectedRows;
                iTotalNumOfPages++;

                // Update Job_Page entry and save it
                oJobPage.status = "processed";
                oJobPage.totalNumOfRecords = affectedRows
                oJobPage.pageToken = oDeltaRange.pageToken;
                oJobPage.completedDate = moment.utc().format();

                await INSERT.into ("sap.ariba.Job_Pages") .entries (oJobPage) ;

                // Update Job with latest pageToken
                oJob.pageToken = oDeltaRange.pageToken;

                await UPDATE ("sap.ariba.Jobs") .set (oJob) .where ({ jobId : oJob.jobId, Realm: oJob.Realm }) ;

            } catch(e) {
                // store latest pageToken in DB and start from there once newly triggered
                logger.error(`Error while extracting concur invoice payment request data : ${e}`);
                logger.info(`Extraction run is captured and will be processed in the next run`);

                oJobPage.status = "Processing error";
                oJobPage.pageToken = oDeltaRange.pageToken;
                oJobPage.processingPosition = iProcessedEntityCount;
                oJobPage.error = e.message;

                await INSERT.into ("sap.ariba.Job_Pages") .entries (oJobPage) ;

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

        await UPDATE ("sap.ariba.Jobs") .set (oJob) .where ({ jobId : oJob.jobId, Realm: oJob.Realm }) ;

        logger.info(`Extraction run finished!`);

        return "Done";
    });
}


async function extractInvoices (context, next) {
    return cds.tx (async srv => {
        //Get Job Details
        let sRealm = context.data.realm,
            loadMode = context.data.loadMode,
            sType = "CI_Invoices";

        logger.info(`Extracting Concur Invoice Data for ${sRealm} with Load Mode ${loadMode}`);

        let oJob = {
            jobId: uuidv4(),
            Realm: sRealm,
            status: "processing",
            importStatus: "processing",
            type: sType
        };
        await INSERT.into ("sap.ariba.Jobs") .entries (oJob) ;

        let oRequestConfig = await _getConcurRequestConfig(sRealm);

        // Construct the invoice queue which is executed sequentially..
        // TODO: filter list for only changed/created since
        let aPaymentRequests = SELECT `ID` .from("sap.ariba.CPaymentRequests")
            .where ({ "realm" : sRealm })
            .orderBy ( {modifiedAt: 'desc'} ) ;

        let sBaseUrlString = "/v3.0/invoice/paymentrequest/{invoiceId}";
        let sUrl = oRequestConfig.url;

        for (const oPaymentRequests of aPaymentRequests) {
            if (oPaymentRequests.ID) {
                try {
                    // call the API per invoice and process the records accordingly
                    oRequestConfig.url = sUrl + sBaseUrlString.replace("{invoiceId}", oPaymentRequests.ID);

                    logger.info(`Executing Concur Invoice Extraction run for payment request ${oPaymentRequests.ID} in Realm ${sRealm}`);
                    let aResponse = await utils.executeRequest(oRequestConfig, 1);
                    let oData = aResponse.data;

                    await invoicesHandler.insertData(oData, sRealm);
                } catch (e) {
                    // Failing invoices will just be logged, but the overall processing do continue
                    logger.error(`Fail in Executing Concur Invoices Extraction run for payment request ${oPaymentRequests.ID} in Realm ${sRealm}, details ${e}`);
                }
            }
        };

        oJob.status = "completed";
        oJob.importStatus = "processed";
        oJob.totalNumOfRecords = aPaymentRequests.length;
        oJob.completedDate = moment.utc().format();

        await UPDATE ("sap.ariba.Jobs") .set (oJob) .where ({ jobId : oJob.jobId, Realm: oJob.Realm }) ;

        logger.info(`Extraction run finished!`);

        return "Done";
    });
}


async function extractPurchaseOrders (context, next) {
    return cds.tx (async srv => {
        //Get Job Details
        let sRealm = context.data.realm,
            loadMode = context.data.loadMode,
            sType = "CI_PurchaseOrders";

        logger.info(`Extracting Concur Purchase Orders Data for ${sRealm} with Load Mode ${loadMode}`);

        let oJob = {
            jobId: uuidv4(),
            Realm: sRealm,
            status: "processing",
            importStatus: "processing",
            type: sType
        };
        await INSERT.into ("sap.ariba.Jobs") .entries (oJob) ;

        let oRequestConfig = await _getConcurRequestConfig(sRealm);

        // Construct the invoice queue which is executed sequentially..
        // TODO: filter list for only changed/created since
        let aPurchaseOrders = SELECT .distinct `PurchaseOrderNumber` .from(CPaymentRequests)
            .where (`realm=`,sRealm).and(`PurchaseOrderNumber is not null`) ;

        let sBaseUrlString = "/v3.0/invoice/purchaseorders/{poId}";
        let sUrl = oRequestConfig.url;

        for (const oPurchaseOrders of aPurchaseOrders) {
            if (oPurchaseOrders.PurchaseOrderNumber) {
                try {
                    // call the API per invoice and process the records accordingly
                    oRequestConfig.url = sUrl + sBaseUrlString.replace("{poId}", oPurchaseOrders.PurchaseOrderNumber);

                    logger.info(`Executing Concur Purchase Order Extraction run for PO ${oPurchaseOrders.PurchaseOrderNumber} in Realm ${sRealm}`);
                    let aResponse = await utils.executeRequest(oRequestConfig, 1);
                    let oData = aResponse.data;

                    await purchaseOrdersHandler.insertData(oData, sRealm);
                } catch (e) {
                    // Failing invoices will just be logged, but the overall processing do continue
                    logger.error(`Fail in Executing Concur Purchase Orders Extraction run for PO ${oPurchaseOrders.PurchaseOrderNumber} in Realm ${sRealm}, details ${e}`);
                }
            }
        };

        oJob.status = "completed";
        oJob.importStatus = "processed";
        oJob.totalNumOfRecords = aPurchaseOrders.length;
        oJob.completedDate = moment.utc().format();


        await UPDATE ("sap.ariba.Jobs") .set (oJob) .where ({ jobId : oJob.jobId, Realm: oJob.Realm }) ;

        logger.info(`Extraction run finished!`);

        return "Done";
    });
}


module.exports = {
    extractPaymentRequests,
    extractInvoices,
    extractPurchaseOrders,
    extractVendors
};