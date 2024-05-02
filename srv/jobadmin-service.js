
const cds = require('@sap/cds');
const jobsHandler = require('./handlers/jobs/jobHandler');
const extractionRunsHandler = require('./handlers/jobs/extractionRunsHandler');
const extractionRunsConcurHandler = require('./handlers/jobs/extractionRunsConcurHandler');


module.exports = cds.service.impl((srv) => {

    //Job management
    srv.on('createJob', jobsHandler.createJob);
    srv.on('UpdateJobStatus', jobsHandler.UpdateJobStatus);
    srv.on('ProcessFinishedJobs', jobsHandler.ProcessFinishedJobs);

   srv.on('extractSupplierData', extractionRunsHandler.extractSupplierData);
   srv.on('extractSupplierQNAData', extractionRunsHandler.extractSupplierQNAData);
   srv.on('extractSupplierRiskData', extractionRunsHandler.extractSupplierRiskData);
   srv.on('extractSupplierCertificatesData', extractionRunsHandler.extractSupplierCertificatesData);

   srv.on('extractMasterData', extractionRunsHandler.extractMasterData);
   
   //Synchronous Operational API extract
   srv.on('extractSyncData', extractionRunsHandler.extractSyncData);

    // concur invoice
    srv.on('extractPaymentRequests', extractionRunsConcurHandler.extractPaymentRequests);
    srv.on('extractInvoices', extractionRunsConcurHandler.extractInvoices);
    srv.on('extractPurchaseOrders', extractionRunsConcurHandler.extractPurchaseOrders);
    srv.on('extractVendors', extractionRunsConcurHandler.extractVendors);

});