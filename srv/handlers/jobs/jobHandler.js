"use strict";

//libraries
const cds = require("@sap/cds");
const con = require("@sap-cloud-sdk/connectivity");
const httpClient = require("@sap-cloud-sdk/http-client");
const moment = require('moment');
const { default: axios } = require("axios");
const Fs = require('fs') ;
const logger = cds.log('logger');
const Path = require('path');
const unzipper = require('unzipper');
//internal modules
const utils = require('../../utils/Utils');

const jobDataProcessingHelper = require('./jobDataProcessingHelper');



async function createJob (context, next) {


        //Get Job Details
        let realm = context.data.realm;
        let viewTemplateName = context.data.viewTemplateName;
        let pageToken = context.data.pageToken;
        let loadMode = context.data.loadMode;
        let apiType = context.data.apiType || 'analytical'; //default analytical for backward compatibility
        let oFilterCriteria = context.data.filterCriteria;
        let oDestination ;
        let jobEndpoint;
        logger.info(`Creating job for ${realm} with view ${viewTemplateName} using ${apiType}`);

        //Get API Details
        switch(apiType){
            case 'analytical':
                oDestination = await con.getDestination({ destinationName: realm + "-reporting-analytics" });
                jobEndpoint = "/analytics-reporting-job/v1/prod/jobs";
                break;
            case 'procurementReporting':
                oDestination = await con.getDestination({ destinationName: realm + "-procurement-reporting" });
                jobEndpoint = "/procurement-reporting-job/v2/prod/jobs";
                break;
            case 'sourcingReporting':
                oDestination = await con.getDestination({ destinationName: realm + "-sourcing-reporting" });
                jobEndpoint = "/sourcing-reporting-job/v1/prod/jobs";
                break;
        }

        //Destination validation 
        if(!oDestination || !oDestination.originalProperties.destinationConfiguration.apikey) {
            logger.error(`Destination does not exist or is incorrectly configured`);
            throw Error("Destination does not exist or is incorrectly configured");
        }

        //Get Date range
        let oDeltaRange = await _GetJobDateRange(realm,viewTemplateName,oFilterCriteria);

        //building request  
        let oRequestConfig = await httpClient.buildHttpRequest(oDestination);
        oRequestConfig.baseURL = oRequestConfig.baseURL + jobEndpoint;
        oRequestConfig.method = "post";
        
        
        oRequestConfig.params = {realm:realm};
        oRequestConfig.data={"viewTemplateName":viewTemplateName};

        /* 
        1- Full load (from parameter or absence of previous load)
        2- Delta Load (from calculated range)
        3- Delta Load (from provided range)
        4- Next page (from page token and provided range if any)
        */
        
        if(!oDeltaRange.initialLoad && !pageToken && (!loadMode || loadMode !='F')){// Default behaviour delta load
            
            logger.info(`Delta load for Job is form ${oDeltaRange.updatedDateFrom} to ${oDeltaRange.updatedDateTo}`);
            oRequestConfig.data["filters"] ={
                updatedDateFrom:oDeltaRange.updatedDateFrom,
                updatedDateTo:oDeltaRange.updatedDateTo
            };
        }

        //In case Calculate Delta Range was provided from either new job forced delta range or previous job with range next page
        if (oFilterCriteria) {
            oRequestConfig.data["filters"] ={
                updatedDateTo: oFilterCriteria && oFilterCriteria.updatedDateTo,
                updatedDateFrom: oFilterCriteria && oFilterCriteria.updatedDateFrom
            };
        }

        if(pageToken){
            //creating a new page for a previous job
            oRequestConfig.params["pageToken"]=pageToken;
        }
        
        oRequestConfig.headers["Accept"]=oRequestConfig.headers["Content-Type"]="application/json";
        oRequestConfig.headers["apikey"]=oDestination.originalProperties.destinationConfiguration.apikey;

        try{
            //Create Job
            logger.info(`Executing job creation for ${realm} with view ${viewTemplateName}`);
            let data = await utils.executeRequest(oRequestConfig,3);

            let createdJob = {
                jobId:data.data.jobId,
                status: data.data.status,
                importStatus:"stopped",
                createdDate:data.data.createdDate,
                completedDate:data.data.completedDate,
                viewTemplateName:data.data.viewTemplateName,
                documentType:data.data.documentType,
                pageToken:data.data.pageToken,
                filterCriteria:data.data.filters && JSON.stringify(data.data.filters),
                Realm:realm,
                apiType:apiType
            };
            //Write job record in DB
            try {
                
                logger.info(`Job ${createdJob.jobId} type: ${createdJob.viewTemplateName} realm: ${createdJob.realm} apiType:${apiType}  $succesfully started, saving in DB`);
                await  INSERT.into ("sap.ariba.Jobs") .entries (createdJob);
        
                logger.info(`Job : ${createdJob.jobId} successfully saved`);
                return 'Job Started';
            }catch(e){
                logger.error(`Error while saving job : ${createdJob.jobId} : ${e}`);
                return 'Error while starting job';
            }

        }catch(e){
            logger.error(`Error while creating new job : ${e}`);
            return 'Error while starting job';
        }

};

async function _GetJobDateRange(realm,viewTemplateName,oFilterCriteria){
    return new Promise(async (resolve,reject)=>{
        try{
            
            logger.info(`Checking previous jobs for viewTemplate ${viewTemplateName} in realm ${realm}`);
            //Get Latest occurence of the Job execution for View
            //TODO : Check only 'successful jobs'
            let lastJobdExec = await SELECT.one.from("sap.ariba.Jobs").where({Realm : realm, viewTemplateName: viewTemplateName,importStatus:"processed"}).orderBy ({createdDate: 'desc'});

            let range;
            if(lastJobdExec && lastJobdExec.length === undefined) // Previous load exist delta range calculation from last job
            {
                logger.info(`Found previous occurence for ${viewTemplateName} in realm ${realm}, generating delta range`);

                range={
                    updatedDateTo: moment.utc().format(),
                    updatedDateFrom : lastJobdExec.createdDate,
                    initialLoad:false
                }


            }else{ // No previous job exist, full load range
                logger.info(`No previous occurence, initial load for ${viewTemplateName} in realm ${realm}`);
                // only consider provided Filter Criteria for initial load of full-load
                range={initialLoad:true}

            }
            resolve(range);
        }catch(e){
            
            logger.error(`Error while checking previous jobs for view ${viewTemplateName} in realm ${realm} details: ${e}`);
            reject(e);
        }
    })
};

async function UpdateJobStatus(context, next){
    try{
        //Get Latest occurence of the Job execution for View
        let ongoingJobs = await SELECT.from("sap.ariba.Jobs").where({Realm : context.data.realm, status: ["pending","processing"]});
        
        logger.info(`Updating job status for ${ongoingJobs.length} jobs`);
        for(const job of ongoingJobs){
            
            try{
                var result = await _UpdateSingleJobStatus(job.Realm,job.jobId,job.apiType);
          
                
                //update Job in DB
                 let jobDetails = result.data;

                 if (!jobDetails) return 0;
                
                //Convert Files entries
                let jobFiles = [];
                jobDetails["files"].length > 0 && jobDetails["files"].forEach(file => {
                    jobFiles.push({ jobId_jobId:job.jobId, jobId_Realm:job.Realm ,file: file, status: "stopped",error:"" });
                });
             
        
                delete jobDetails["filterExpressionsSnap"];
                delete jobDetails["selectAttributesSnap"];
                delete jobDetails["requestId"];
                delete jobDetails["debug"];
                delete jobDetails["emitNull"];
                delete jobDetails["displayStateString"];
                delete jobDetails["includeInactive"];
                delete jobDetails["filters"];
                delete jobDetails["reportingApp"];
                delete jobDetails["totalNumOfRecordsProcessed"];
                
                jobDetails["realm"]=job.Realm;

                //Temporarilly removing files as cds-pg doesn't support deep-update
                delete jobDetails["files"];


                if(jobDetails.pageToken && jobDetails.status.toUpperCase() == "COMPLETED"){
                    //generate a new job with the page Token
                    let context={
                        data:{
                            realm:job.Realm,
                            viewTemplateName:job.viewTemplateName,
                            pageToken:jobDetails.pageToken,
                            apiType:job.apiType,
                            filterCriteria: job.filterCriteria && JSON.parse(job.filterCriteria)
                        }
                    };
                    try{
                        let jobStart = await createJob(context);
                        logger.info(`Created new job for token ${jobDetails.pageToken}`);
                    }catch(e){
                        logger.error(`Error while creating new job for token ${jobDetails.pageToken}`);
                    }
                }

                //IF completed update files
                if(jobDetails.status.toUpperCase() == "COMPLETED")  {

                    logger.info(`Updating job ${job.jobId} with status ${jobDetails.status} and with  ${jobFiles.length} result files in database.`); 
                     //Updating Job
                    await UPDATE ("sap.ariba.Jobs") .set (jobDetails) .where ({ jobId : jobDetails.jobId, Realm: jobDetails.realm }) ;
                    //UPdating Files serparately as cds-pg doesn't support deep-update
                    await INSERT.into ("sap.ariba.Job_File") .entries (jobFiles)  ;
               
                }
                else  {
                    //Updating Job status only
                    logger.info(`Updating job ${job.jobId} with status ${jobDetails.status} in database.`); 
                    await UPDATE ("sap.ariba.Jobs") .set (jobDetails) .where ({ jobId : jobDetails.jobId, Realm: jobDetails.realm }) ;
                  
                }
            }catch(error){

                logger.error(`Error while retrieving status for job ${job.jobId}. details: ${error}`); 

                //If error is linked to Job error status on the backend, update Job status accordingly in DB
                if(error.response && error.response.data && error.response.data.code && (error.response.data.code.toUpperCase()=="JOBEXPIRED" || error.response.data.code.toUpperCase()=="JOBNOTFOUND") ){
                    logger.info(`Updating job ${job.jobId} with status ${job.status} in database.`); 
                    job.status = error.response.data.code;
                    job.importStatus = 'error';

                    await UPDATE ("sap.ariba.Jobs") .set (job) .where ({ jobId : job.jobId, Realm: job.Realm }) ;
                }                            
          }
        }
        return "Updating jobs";
    }catch(e){
        logger.error(`Error while retrieving ongoing jobs. details: ${e}`);
        return "Error";
    }
   
};


async function _UpdateSingleJobStatus(realm,jobId,apiType){
    return new Promise(async (resolve,reject)=>{
        try{
       
            apiType = apiType || 'analytical'; //default analytical for backward compatibility
            let oDestination;
            let jobEndpoint;
            logger.info(`Updating job ${jobId} for realm ${realm} and apiType ${apiType}`);

            //Get API Details
            switch(apiType){
                case 'analytical':
                    oDestination = await con.getDestination({ destinationName: realm + "-reporting-analytics" });
                    jobEndpoint = "/analytics-reporting-jobresult/v1/prod/jobs/";
                    break;
                case 'procurementReporting':
                    oDestination = await con.getDestination({ destinationName: realm + "-procurement-reporting" });
                    jobEndpoint = "/procurement-reporting-jobresult/v2/prod/jobs/";
                    break;
                case 'sourcingReporting':
                    oDestination = await con.getDestination({ destinationName: realm + "-sourcing-reporting" });
                    jobEndpoint = "/sourcing-reporting-jobresult/v1/prod/jobs/";
                    break;
            }
           
            //building request  
            let oRequestConfig = await httpClient.buildHttpRequest(oDestination);
            oRequestConfig.baseURL = oRequestConfig.baseURL + jobEndpoint +jobId;
            oRequestConfig.method = "get";
            oRequestConfig.params = {realm:realm};
          
                       
            oRequestConfig.headers["Accept"]=oRequestConfig.headers["Content-Type"]="application/json";
            oRequestConfig.headers["apikey"]=oDestination.originalProperties.destinationConfiguration.apikey;
           
        
            utils.executeRequest(oRequestConfig,3).then((data)=>{
                resolve(data);
            }).catch((error)=>{
                reject(error);
            });

        }catch(e){
            logger.error(`Error while updating job ${jobId} for realm ${realm} details: ${e}`);
            reject(e);
        }
    })
   
};

async function ProcessFinishedJobs(context, next){

    return cds.tx (async srv => {
        try{

            //Get Latest occurence of the Job execution for View
            let finishedJobs = await SELECT.from("sap.ariba.Jobs").where({Realm : context.data.realm, status: "completed", importStatus:"stopped"});
            if(finishedJobs.length==0){
                logger.info(`No finished jobs to process`);
                return 0;
            }
            logger.info(`Processing ${finishedJobs.length} Finished Jobs `);

            for(const job of finishedJobs){
                //Process Single Job

                //Update job status
                await  UPDATE("sap.ariba.Jobs").set({importstatus:"processing"}).where({Realm : context.data.realm, jobId: job.jobId});

                //Get Unprocessed Files status
                let jobFiles = await SELECT.from("sap.ariba.Job_File").where({jobId_jobId : job.jobId, jobId_Realm : job.Realm, status:"stopped"});
                logger.info(`Processing ${jobFiles.length} Files for Job ${job.jobId} `);
                for(const f of jobFiles){
                    logger.info(`Processing file ${f.file} for ${job.jobId}`);
                    await UPDATE("sap.ariba.Job_File").set({status:"started"}).where({jobId_jobId : job.jobId,jobId_Realm : job.Realm, file:f.file});

                    try{
                        //Process Files form job
                        let downloaded = await _downloadFile(job.Realm, job.jobId, f.file,job.apiType);
                        //Update File status
                        if(downloaded){
                           const directory = await unzipper.Open.file('./zips/' + f.file);
                           const file = directory.files.find(d => d.path === 'records.txt');
                           const content = await file.buffer();

                            let affectedRows = await jobDataProcessingHelper.ProcessData(job.viewTemplateName,JSON.parse(content.toString()), context.data.realm);

                            logger.info(`File ${f.file} processed affected rows ${affectedRows}`);
                            //update the number of records updated
                            await UPDATE("sap.ariba.Job_File").set({status:"processed",totalNumOfRecords:affectedRows}).where({jobId_jobId : job.jobId,jobId_Realm : job.Realm, file:f.file});

                            //deleting file
                            Fs.unlinkSync(Path.resolve('./zips', f.file))  ;
                        }

                    }catch(e){
                        logger.error(`Error while processing file ${f.file} for job ${job.jobId} details: ${e} `);
                        //deleting file
                        Fs.unlinkSync(Path.resolve('./zips', f.file))  ;
                        //Todo update file && job status to 'error'
                        await UPDATE("sap.ariba.Job_File").set({status:"Processing error",error:e.toString()}).where({jobId_jobId : job.jobId,jobId_Realm : job.Realm, file:f.file});
                        break;
                    }
                }
                 //updating job  status
                 let fileStatuses = await SELECT.from("sap.ariba.Job_File").where({jobId_jobId : job.jobId, jobId_Realm : job.Realm});
                 let jobStatus = fileStatuses.some(a=>a.status=="Processing error")?"error":"processed";


                 await UPDATE("sap.ariba.Jobs").set({importStatus:jobStatus}).where({jobId : job.jobId, Realm:context.data.realm});

            }

            logger.info(`Finished job run`);
            return 'Finished all';
        }
        catch(e){
            logger.error('Error while procesing finished Jobs : ' + e);
            return "Error";
        }
    });
}

async function _downloadFile(realm, jobId, fileName, apiType)  {
    return new Promise(async (resolve, reject) => {

        apiType = apiType || 'analytical'; //default analytical for backward compatibility

        logger.info(`Downloading file ${fileName} for Job ${jobId} and apiType ${apiType}`);

        let oDestination;
        let jobEndpoint;

        //Get API Details
        switch(apiType){
            case 'analytical':
                oDestination = await con.getDestination({ destinationName: realm + "-reporting-analytics" });
                jobEndpoint = "/analytics-reporting-jobresult/v1/prod/jobs/";
                break;
            case 'procurementReporting':
                oDestination = await con.getDestination({ destinationName: realm + "-procurement-reporting" });
                jobEndpoint = "/procurement-reporting-jobresult/v2/prod/jobs/";
                break;
            case 'sourcingReporting':
                oDestination = await con.getDestination({ destinationName: realm + "-sourcing-reporting" });
                jobEndpoint = "/sourcing-reporting-jobresult/v1/prod/jobs/";
                break;
        }
        
        let oRequestConfig = await httpClient.buildHttpRequest(oDestination);
        oRequestConfig.baseURL = oRequestConfig.baseURL + jobEndpoint +`${jobId}/files/${fileName}`;
        oRequestConfig.method = "get";
        
        
        oRequestConfig.params = {realm:realm};
   
        
        oRequestConfig.headers["Accept"]="*/*";
        oRequestConfig.headers["Content-Type"]="application/json";
        oRequestConfig.headers["apikey"]=oDestination.originalProperties.destinationConfiguration.apikey;
        oRequestConfig.responseType="stream";
       
       
        //Create a dir for the folder if it doesn't exist yet
        if (!Fs.existsSync('./zips')){
            Fs.mkdirSync('./zips');
        }
            
        const path = Path.resolve('./zips', fileName)
        const writer = Fs.createWriteStream(path)

        try {
            //Todo : Use the request processor with retry on rate limits
            let response = await axios.request(oRequestConfig)
            response.data.pipe(writer)

            writer.on('finish', function()  {
                logger.info(`File ${fileName} for Job ${jobId} downloaded`);
                resolve(true);
            })
            writer.on('error', function(error) {
                logger.error(`Error while downloading file ${fileName} for Job ${jobId} details: ${error}`);
                reject(false);
            })
        }catch(e) {
            logger.error(`Error while downloading file ${fileName} for Job ${jobId} details: ${e}`);
            reject(e.message)
        }
    });
}

module.exports = {
    createJob,
    UpdateJobStatus,
    ProcessFinishedJobs
};