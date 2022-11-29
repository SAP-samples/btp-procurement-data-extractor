
const cds = require('@sap/cds');
const jobsHandler = require('./handlers/jobs/jobHandler');
const extractionRunsHandler = require('./handlers/jobs/extractionRunsHandler');

//const testHander = require('./handlers/tests/testHandler');


module.exports = cds.service.impl((srv) => {

    //Job management
    srv.on('createJob', jobsHandler.createJob);
    srv.on('UpdateJobStatus', jobsHandler.UpdateJobStatus);
    srv.on('ProcessFinishedJobs', jobsHandler.ProcessFinishedJobs);
   //srv.on('randomTests', testHander.randomTests);

   srv.on('extractSupplierData', extractionRunsHandler.extractSupplierData);
   srv.on('extractSupplierQNAData', extractionRunsHandler.extractSupplierQNAData);
   srv.on('extractSupplierRiskData', extractionRunsHandler.extractSupplierRiskData);
   srv.on('extractSupplierCertificatesData', extractionRunsHandler.extractSupplierCertificatesData);

   srv.on('extractMasterData', extractionRunsHandler.extractMasterData);
   
   //Synchronous Operational API extract
   srv.on('extractSyncData', extractionRunsHandler.extractSyncData);

});