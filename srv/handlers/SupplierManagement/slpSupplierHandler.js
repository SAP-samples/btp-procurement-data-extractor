"use strict";

const cds = require("@sap/cds");
const logger = cds.log('logger');
const utils = require("../../utils/Utils");


//Amount fields in object
function _getAmountPropertiesForDataCleaning () {
    return [ ];
}

function _convertDateFields (oCertificate) {
    oCertificate.timeUpdated = new Date(oCertificate.timeUpdated).toISOString();
    oCertificate.timeCreated = new Date(oCertificate.timeCreated).toISOString();
    oCertificate.effectiveDate = new Date(oCertificate.effectiveDate).toISOString();
    oCertificate.expirationReminderDate = new Date(oCertificate.expirationReminderDate).toISOString();
    oCertificate.expirationDate = new Date(oCertificate.expirationDate).toISOString();
    oCertificate.issueDate = new Date(oCertificate.issueDate).toISOString();

    return oCertificate;
}

function _convertQNADateFields (oQNA) {
    oQNA.timeUpdated = new Date(oQNA.timeUpdated).toISOString();
    oQNA.timeCreated = new Date(oQNA.timeCreated).toISOString();

    return oQNA;
}


function _mapQualificationsEntityStructure (aQualifications) {
    return aQualifications && aQualifications.map(function (oQualification) {
        return {
            QualificationStatus     : oQualification["Qualification Status"] || "",
            PreferredStatus         : oQualification["Preferred Status"] || "",
            Category                : oQualification["Category"] || "",
            Region                  : oQualification["Region"] || "",
            BusinessUnit            : oQualification["Business Unit"] || "",
            MaterialId              : oQualification["Material ID"] || "",
            ProcessType             : oQualification["Process Type"] || ""
        }
    }) || [];
}

function _mapQuestionnairesEntityStructure (aQuestionnaires) {
    return aQuestionnaires && aQuestionnaires.map(function (oQuestionnaire) {
        return {
            QuestionnaireId         : oQuestionnaire["questionnaireId"] || "",
            QuestionnaireTitle      : oQuestionnaire["questionnaireTitle"] || "",
            WorkspaceType           : oQuestionnaire["workspaceType"] || "",
            WorkspaceId             : oQuestionnaire["workspaceId"] || ""
        }
    }) || [];
}

function _mapRiskCategoriesEntityStructure (aRiskCategories) {

}

function _mapEntityStructure (oData) {
    return {
        Realm                               : oData["Realm"],
        SMVendorId                          : oData["SM Vendor ID"],
        SupplierName                        : oData["Supplier Name"] || "",
        ERPVendorId                         : oData["ERP Vendor ID"] || "",
        ANId                                : oData["An Id"] || "",
        ACMId                               : oData["ACM ID"] || "",
        RegistrationStatus                  : oData["Registration Status"] || "",
        QualificationStatus                 : oData["Qualification Status"] || "",
        IntegratedToERP                     : oData["Integrated to ERP"] || "",
        DuplicateSMVendorId                 : oData["Duplicate SM Vendor Id"] || "",
        LastIntegrationState                : oData["Last Integration State"] || "",
        LastConfirmationState               : oData["Last Confirmation State"] || "",
        SourceSystem                        : oData["Source System"] || "",
        MasterVendorId                      : oData["Master Vendor Id"] || "",
        FormOfAddressCode                   : oData["Form of Address Code"] || "",
        name2                               : oData["name2"] || "",
        name3                               : oData["name3"] || "",
        name4                               : oData["name4"] || "",
        DunsId                              : oData["Duns Id"] || "",
        IndustryCode                        : oData["Industry Code"] || "",
        RecordCreatedDate                   : oData["Record Created Date"] || "",
        Creator                             : oData["Creator"] || "",
        BlockedStatus                       : oData["Blocked Status"] || "",
        LastReviewDate                      : oData["Last Review Date"] || "",
        LastUpdateDate                      : oData["Last Update Date"] || "",
        LastStatusChangeDate                : oData["Last Status Change Date"] || "",
        PrimarySupplierManager              : oData["Primary Supplier Manager"] || "",
        RelationshipEstablished             : oData["Relationship Established"] || "",
        AlternateSupplierManager            : oData["Alternate Supplier Manager"] || "",
        Approved                            : oData["Approved"] || "",
        TransactionalSupplier               : oData["Transactional Supplier"] || "",
        TransactionalSupplierRequestStatus  : oData["Transactional Supplier Request Status"] || "",
        MainVendorType                      : oData["Main Vendor Type"] || "",
        AddressLine1                        : oData["Address - Line1"] || "",
        AddressCity                         : oData["Address - City"] || "",
        AddressCountryCode                  : oData["Address - Country Code"] || "",
        AddressRegionCode                   : oData["Address - Region Code"] || "",
        AddressPostalCode                   : oData["Address - Postal Code"] || "",
        PrimaryContactFirstName             : oData["Primary contact first name"] || "",
        PrimaryContactMiddleName            : oData["Primary contact middle name"] || "",
        PrimaryContactLastName              : oData["Primary contact last name"] || "",
        PrimaryContactEMail                 : oData["Primary contact email"] || "",
        Qualifications                      : _mapQualificationsEntityStructure(oData["qualifications"]),
        Questionnaires                      : _mapQuestionnairesEntityStructure(oData["questionnaires"])
    };
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
            oDataCleansed = utils.processCustomFields(oDataCleansed);
            oDataCleansed = _mapEntityStructure(oDataCleansed);
            oDataCleansed = utils.flattenTypes(oDataCleansed);

            try {
                //Select record by Unique key
                let res =  await SELECT.from ("sap.ariba.SLPSuppliers_SM")
                    .where( { Realm : oDataCleansed.Realm, SMVendorId : oDataCleansed.SMVendorId }  ) ;

                 let qualifications = oDataCleansed["Qualifications"];
                 delete oDataCleansed["Qualifications"];

                 let questionnaires = oDataCleansed["Questionnaires"];
                 delete oDataCleansed["Questionnaires"];

                 if (res.length == 0) {
                     //New record, insert
                    await INSERT .into ("sap.ariba.SLPSuppliers_SM") .entries (oDataCleansed) ;
                 } else {
                     //Update existing record
                    await UPDATE ("sap.ariba.SLPSuppliers_SM") .set (oDataCleansed)
                        .where( { Realm : oDataCleansed.Realm, SMVendorId : oDataCleansed.SMVendorId } ) ;
                 }
                 await _FullLoadQualifications(qualifications,oDataCleansed.Realm,oDataCleansed.SMVendorId);
                 await _FullLoadQuestionnaires(questionnaires,oDataCleansed.Realm,oDataCleansed.SMVendorId);

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

async function _FullLoadQualifications( Qualifications, Realm, SMVendorId ){
    return new Promise(async (resolve,reject) =>{
        //Delete old records
        try {
            await  DELETE ("sap.ariba.SLPSuppliers_Qualifications_SM").where({
                SLPSupplier_Realm : Realm ,
                SLPSupplier_SMVendorId : SMVendorId
            }) ;
        }
        catch(e){
            logger.error(`Error on deleting from database, aborting file processing, details ${e} `);
            reject(e);
        }

        //Insert new records
        
        if(Qualifications){  
            for (const Qualification of Qualifications){
                try {

                    Qualification["SLPSupplier_Realm"] = Realm;
                    Qualification["SLPSupplier_SMVendorId"] = SMVendorId;
                    await INSERT .into ("sap.ariba.SLPSuppliers_Qualifications_SM") .entries (Qualification) ;

                } catch (e) {
                    logger.error(`Error on inserting data in database, aborting file processing, details ${e} `);
                    reject(e);
                    break;
                }
            }
        }
        resolve();
    });
}

async function _FullLoadQuestionnaires( Questionnaires, Realm, SMVendorId ){
    return new Promise(async (resolve,reject) =>{
        //Delete old records
        try {
            await DELETE ("sap.ariba.SLPSuppliers_Questionnaires_SM").where({
                SLPSupplier_Realm : Realm ,
                SLPSupplier_SMVendorId : SMVendorId
            }) ;
        }
        catch(e){
            logger.error(`Error on deleting from database, aborting file processing, details ${e} `);
            reject(e);
        }

        //Insert new records
        
        if(Questionnaires){  
            for (const Questionnaire of Questionnaires){
                try {

                    Questionnaire["SLPSupplier_Realm"] = Realm;
                    Questionnaire["SLPSupplier_SMVendorId"] = SMVendorId;
                    await INSERT .into ("sap.ariba.SLPSuppliers_Questionnaires_SM") .entries (Questionnaire) ;

                } catch (e) {
                    logger.error(`Error on inserting data in database, aborting file processing, details ${e} `);
                    reject(e);
                    break;
                }
            }
        }
        resolve();
    });
}


function insertRiskData (oData, sRealm, sSMVendorId) {
    return new Promise(async function(resolve, reject) {

        try {
            // TODO: discuss if Risk history shall be maintained per extraction run or only if newer timestamp on the Risk calculation date
            // construct the structure
            // Update parent entity with overall score
            await UPDATE ("sap.ariba.SLPSuppliers_SM")
                .set ({ ExposureLevel: oData.exposureLevel, Exposure: oData.exposure })
                .where({ Realm: sRealm, SMVendorId: sSMVendorId });

            let aRiskCategories = [
                {
                    Name                            : "overall",
                    Exposure                        : oData.exposure,
                    ExposureLevel                   : oData.exposureLevel,
                    ExposureId                      : oData.exposureId,
                    ExposureCalculationDate         : oData.exposureCalculationDate,
                    ResponseTimeStamp               : oData.responseTimeStamp,
                    ExposureConfigurationVersion    : oData.exposureConfigurationVersion,
                    Latest                          : true,
                    SLPSupplier_Realm               : sRealm,
                    SLPSupplier_SMVendorId          : sSMVendorId
                }
            ];
            oData.riskCategoryExposures && oData.riskCategoryExposures.forEach(function (oCategory) {
                aRiskCategories.push({
                    Name                            : oCategory.name,
                    Exposure                        : oCategory.exposure,
                    ExposureLevel                   : oCategory.exposureLevel,
                    ExposureId                      : aRiskCategories[0].ExposureId,
                    ExposureCalculationDate         : aRiskCategories[0].ExposureCalculationDate,
                    ResponseTimeStamp               : aRiskCategories[0].ResponseTimeStamp,
                    ExposureConfigurationVersion    : aRiskCategories[0].ExposureConfigurationVersion,
                    Latest                          : true,
                    SLPSupplier_Realm               : sRealm,
                    SLPSupplier_SMVendorId          : sSMVendorId
                });
            });

            // Update each Risk Category to "latest = false"
            await UPDATE ("sap.ariba.SLPSuppliers_RiskCategoryExposures_SM")
                .set ({ Latest: false })
                .where({ SLPSupplier_Realm: sRealm, SLPSupplier_SMVendorId: sSMVendorId });

            // Insert the new Risk Categories
            await INSERT .into ("sap.ariba.SLPSuppliers_RiskCategoryExposures_SM") .entries (aRiskCategories) ;
        } catch (e) {
            logger.error(`Error on inserting data in database, aborting supplier risk processing, details ${e} `);
            reject(e);
        }
        resolve();
    });
}


function insertCertificateData (aData, sRealm, sSMVendorId) {
    return new Promise(async function(resolve, reject) {

        try {

            // As we're loading all the certificates of a supplier, we are going to overwrite all the records
            // to do so, we're first deleting all the entries and then creating new ones

            // Check if there is even a certificate given for the supplier
            if (!aData || aData.length === 0) {
                resolve(0);
                return;
            }

            // Update parent entity with isCertified flag
            await  UPDATE ("sap.ariba.SLPSuppliers_SM")
                .set ({ IsCertified: true })
                .where({ Realm: sRealm, SMVendorId: sSMVendorId });

            // Delete old records
            await DELETE ("sap.ariba.SLPSuppliers_Certificates_SM").where({
                SLPSupplier_Realm : sRealm,
                SLPSupplier_SMVendorId : sSMVendorId
            }) ;

            // The structure of the API response is nested, we need to modify it accordingly
            let aCertificates = aData && aData.map(function(oData){
                var oCertificate = oData.certificate;
                oCertificate["SLPSupplier_Realm"] = sRealm;
                oCertificate["SLPSupplier_SMVendorId"] = sSMVendorId;
                // required adjustment as the API response does contain "id" field which is in conflict with CUID
                oCertificate["CertificationId"] = oCertificate["id"];
                delete oCertificate["id"];
                oCertificate = _convertDateFields(oCertificate);
                return oCertificate;
            });

            // Insert new records
            await INSERT .into ("sap.ariba.SLPSuppliers_Certificates_SM") .entries (aCertificates) ;

        } catch (e) {
            logger.error(`Error on inserting data in database, aborting supplier certificate processing, details ${e} `);
            reject(e);
        }
        resolve();
    });
}

function insertQNAData (aData, sRealm, sSMVendorId) {
    return new Promise(async function(resolve, reject) {

        try {

            // As we're loading all the certificates of a supplier, we are going to overwrite all the records
            // to do so, we're first deleting all the entries and then creating new ones

            // Check if there is even a certificate given for the supplier
            if (!aData || aData.length === 0) {
                resolve(0);
                return;
            }

            // Delete old records
            await DELETE ("sap.ariba.SLPSuppliers_QuestionAnswer_SM").where({
                SLPSupplier_Realm : sRealm,
                SLPSupplier_SMVendorId : sSMVendorId
            }) ;

            // The structure of the API response is nested, we need to modify it accordingly
            let aQNAs = aData && aData.map(function(oData){
                var oQNA = oData.questionAnswer;
                oQNA["SLPSupplier_Realm"] = sRealm;
                oQNA["SLPSupplier_SMVendorId"] = sSMVendorId;

                delete oQNA["smVendorId"];

                oQNA = _convertQNADateFields(oQNA);
                return oQNA;
            });

            // Insert new records
            await INSERT .into ("sap.ariba.SLPSuppliers_QuestionAnswer_SM") .entries (aQNAs) ;

        } catch (e) {
            logger.error(`Error on inserting data in database, aborting supplier QNA processing, details ${e} `);
            reject(e);
        }
        resolve();
    });
}

async function enrichSupplierId (context, realm, loadMode) {
    logger.info(`Start the Supplier ID enrichment`);

    // Due to supplier id mismatch, we need to manually add it to the SLPSuppliers entity
    var aSuppliersInRealm = await SELECT `SupplierId, Realm, SMVendorId` .from ("sap.ariba.Suppliers_AN")
        .where( { Realm : realm }  ) ;

    var aSLPSuppliersInRealm = [];
    if (!loadMode || loadMode !='F') {
        aSLPSuppliersInRealm = await SELECT `Realm, SMVendorId` .from ("sap.ariba.SLPSuppliers_SM")
           .where( { Realm : realm,  SupplierId : null }  ) ;
    } else {
        aSLPSuppliersInRealm = await SELECT `Realm, SMVendorId` .from ("sap.ariba.SLPSuppliers_SM")
           .where( { Realm : realm }  ) ;
    }
    logger.info(`Amount of Suppliers to be enriched: ${aSLPSuppliersInRealm.length}`);

    var iCount = 0;
    if (!aSLPSuppliersInRealm || aSLPSuppliersInRealm.length === 0) return iCount;

    for(const oSLPSupplier of aSLPSuppliersInRealm) {
        var oSupplierMatch = aSuppliersInRealm.find(function(oSupplier) { return oSupplier.SMVendorId === oSLPSupplier.SMVendorId; } );

        if (oSupplierMatch) {
            logger.info(`Found Supplier Match; updating the ID for Supplier ID: ${oSupplierMatch.SupplierId} and SM Vendor ID: ${oSLPSupplier.SMVendorId}`);
            oSLPSupplier.SupplierId = oSupplierMatch && oSupplierMatch.SupplierId;

            //Update existing record
            await UPDATE ("sap.ariba.SLPSuppliers_SM")
                .set ({ SupplierId: oSLPSupplier.SupplierId })
                .where( { Realm : oSLPSupplier.Realm, SMVendorId : oSLPSupplier.SMVendorId } ) ;

            // Update also child entities
            await UPDATE ("sap.ariba.SLPSuppliers_Qualifications_SM")
                .set ({ SupplierId: oSLPSupplier.SupplierId })
                .where( { SLPSupplier_Realm : oSLPSupplier.Realm, SLPSupplier_SMVendorId : oSLPSupplier.SMVendorId } ) ;

            await UPDATE ("sap.ariba.SLPSuppliers_Questionnaires_SM")
                .set ({ SupplierId: oSLPSupplier.SupplierId })
                .where( { SLPSupplier_Realm : oSLPSupplier.Realm, SLPSupplier_SMVendorId : oSLPSupplier.SMVendorId } ) ;

            await UPDATE ("sap.ariba.SLPSuppliers_RiskCategoryExposures_SM")
                .set ({ SupplierId: oSLPSupplier.SupplierId })
                .where( { SLPSupplier_Realm : oSLPSupplier.Realm, SLPSupplier_SMVendorId : oSLPSupplier.SMVendorId } ) ;

            await UPDATE ("sap.ariba.SLPSuppliers_Certificates_SM")
                .set ({ SupplierId: oSLPSupplier.SupplierId })
                .where( { SLPSupplier_Realm : oSLPSupplier.Realm, SLPSupplier_SMVendorId : oSLPSupplier.SMVendorId } ) ;

            iCount++;
        }

    };

    logger.info(`End of Supplier ID enrichment. Records updated: ${iCount}`);
    return iCount;
}


module.exports = {
    insertData,
    insertRiskData,
    enrichSupplierId,
    insertCertificateData,
    insertQNAData
}