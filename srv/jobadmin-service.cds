
using sap.ariba as entities from '../db';

@(requires: ['authenticated-user', 'identified-user', 'system-user'])
service JobAdminService @(path:'/jobadmin')    {
    entity Jobs as projection on entities.Jobs;
    entity Job_File as projection on entities.Job_File;
    entity Job_Pages as projection on entities.Job_Pages;
    
    action createJob (realm: entities.Jobs:Realm, viewTemplateName: String, loadMode: String,apiType: String) returns String;
    action UpdateJobStatus (realm: entities.Jobs:Realm) returns String;
    action ProcessFinishedJobs (realm: entities.Jobs:Realm) returns String;
    //action randomTests (jobId: entities.Jobs:jobId,realm: entities.Jobs:Realm, viewTemplateName: String) returns String;

    action extractSupplierData (realm: entities.Jobs:Realm, loadMode: String)  returns String;
    action extractSupplierQNAData (realm: entities.Jobs:Realm, loadMode: String)  returns String;
    action extractSupplierRiskData (realm: entities.Jobs:Realm, loadMode: String)  returns String;
    action extractSupplierCertificatesData (realm: entities.Jobs:Realm, loadMode: String)  returns String;
    
    action extractMasterData (realm: entities.Jobs:Realm, entityName: String, loadMode: String)  returns String;

    
    action extractSyncData (realm: entities.Jobs:Realm, viewTemplateName: String, apiType: String)  returns String;

}

