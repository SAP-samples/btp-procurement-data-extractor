"use strict";

//Libs
const logger = cds.log('logger');

//Analytical Data Handlers
const contractsFactHandler = require('../contracts/contractsFactHandler');
const contractsDimHandler = require('../contracts/contractsDimHandler');
const contractLineItemsFactHandler = require('../contracts/contractLineItemsFactHandler');
const contractClausesFactHandler = require('../contracts/contractClausesFactHandler');
const contractWorkspacesFactHandler = require('../contracts/contractWorkspacesFactHandler');
const contractRequestsFactHandler = require('../contracts/contractRequestsFactHandler');
const contractItemFactHandler = require('../contracts/contractItemFactHandler');

const orderConfirmationFactHandler = require('../orders/orderConfirmationFactHandler');
const purchaseOrderLineItemsFactHandler = require('../orders/purchaseOrderLineItemsFactHandler');
const purchaseOrderDeliveryFactHandler = require('../orders/purchaseOrderDeliveryFactHandler');
const advancePaymentFactHanlder = require('../orders/advancePaymentFactHanlder');
const requisitionLineItemsFactHandler = require('../requisitions/requisitionLineItemsFactHandler');
const sourcingProjectsFactHandler = require('../sourcing/sourcingProjectsFactHandler');
const supplierParticipationFactHandler = require('../sourcing/supplierParticipationFactHandler');
const eventSummaryFactHandler = require('../sourcing/eventSummaryFactHandler');
const eventItemSummaryFactHandler = require('../sourcing/eventItemSummaryFactHandler');
const eventParticipationsFactHandler = require('../sourcing/eventParticipationsFactHandler');
const sourcingRequestsFactHandler = require('../sourcing/sourcingRequestsFactHandler');
const eventDimHandler = require('../sourcing/eventDimHandler');


const srProjectTaskFactHandler = require('../sourcing/srProjectTaskFactHandler');
const srProjectTaskApprovalFlowFactHandler = require('../sourcing/srProjectTaskApprovalFlowFactHandler');
const projectTaskFactHandler = require('../sourcing/projectTaskFactHandler');

const receiptsFactHandler = require('../receipts/receiptsFactHandler');
const paymentsFactHandler = require('../payments/paymentsFactHandler');

const oneTimeVendorsFactHandler = require('../invoices/oneTimeVendorsFactHandler');
const prereconciledInvoicesFactHandler = require('../invoices/prereconciledInvoicesFactHandler');
const invoicePaymentsFactHandler = require('../invoices/invoicePaymentsFactHandler');
const rejectedInvoicesFactHandler = require('../invoices/rejectedInvoicesFactHandler');
const invoiceLineItemsSAHandler = require('../invoices/invoiceLineItemsSAHandler');
const invoiceLineItemsFactHandler = require('../invoices/invoiceLineItemsFactHandler');
const invoiceExceptionsFactHandler = require('../invoices/invoiceExceptionsFactHandler');

const supplierDimHandler = require('../suppliers/supplierDimHandler');
const supplierRegistrationProjectsFactHandler = require('../suppliers/supplierRegistrationProjectsFactHandler');
const supplierRequestProjectsFactHandler = require('../suppliers/supplierRequestProjectsFactHandler');
const spmProjectsFactHandler = require('../suppliers/spmProjectsFactHandler');
const smProjectsFactHandler = require('../suppliers/smProjectsFactHandler');
const smProjectQuestionnaireResponsesFactHandler = require('../suppliers/smProjectQuestionnaireResponsesFactHandler');
const surveyResponseFactHandler = require('../suppliers/surveyResponseFactHandler');
const scorecardFactHandler = require('../suppliers/scorecardFactHandler');
const surveyDimHandler = require('../suppliers/surveyDimHandler');
const smSurveyTemplateQuestionDimHandler = require('../suppliers/smSurveyTemplateQuestionDimHandler');

const approvalsFactHandler = require('../general/approvalsFactHandler');
const approvalHistoryFactHandler = require('../general/approvalHistoryFactHandler');
const pendingApprovalFactHandler = require('../general/pendingApprovalFactHandler');
const userActivityFactHandler = require('../general/userActivityFactHandler');
const taskApprovalsFactHandler = require('../general/taskApprovalsFactHandler');
const projectGroupFactHandler = require('../general/projectGroupFactHandler');
const regionFactHandler = require('../general/regionFactHandler');
const commodityFactHandler = require('../general/commodityFactHandler');
const organizationFactHandler = require('../general/organizationFactHandler');
const savingsAllocationDetailsFactHandler = require('../general/savingsAllocationDetailsFactHandler');

const projectsFactHandler = require('../sourcing/projectsFactHandler');
const projectInfoFactHandler = require('../sourcing/projectInfoFactHandler');
const servicesProcurementWorkspacesFactHandler = require('../procurement/servicesProcurementWorkspacesFactHandler');

//Operational Data Handlers
const requisitionHandler = require('../requisitions/requisitionHandler');
const invoicesOSHandler = require('../invoices/invoicesOSHandler');
const contractsOSHandler = require('../contracts/contractsOSHandler');
const ordersHandler = require('../orders/purchaseOrderHandler');

const rfxDocumentHandler = require('../sourcing/rfxDocumentHandler');
const rfxItemHandler = require('../sourcing/rfxItemHandler');
const rfxItemValueHandler = require('../sourcing/rfxItemValueHandler');
const rfxContentDocumentHandler = require('../sourcing/rfxContentDocumentHandler');
const rfxBidHandler = require('../sourcing/rfxBidHandler');
const rfxAlternativeHandler = require('../sourcing/rfxAlternativeHandler');
const taskHandler = require('../sourcing/taskHandler');
const itemSupplierDataHandler = require('../sourcing/itemSupplierDataHandler');
const scenarioHandler = require('../sourcing/scenarioHandler');
const sourcingRequestOSHandler = require('../sourcing/sourcingRequestOSHandler');
const sourcingProjectOSHandler = require('../sourcing/sourcingProjectOSHandler');
const documentTaskHandler = require('../sourcing/documentTaskHandler');
const organizationHandler = require('../sourcing/organizationHandler');

const contractWorkspaceOSHandler = require('../contracts/contractWorkspaceOSHandler');


const auditEntryHandler = require('../sourcing/auditEntryHandler');


async function ProcessData(viewTemplateName,Records,realm){
    //Routes the extracted data to the appropriate processing handler
    return new Promise(async (resolve,reject)=>{
        try{

            let affectedRows;
            switch(viewTemplateName){
                //Analytical API
                case "EXT_InvoiceLineItemSA":
                    affectedRows = await invoiceLineItemsSAHandler.insertData(Records, realm)
                    break;
                case "EXT_InvoiceLineItems":
                    affectedRows = await invoiceLineItemsFactHandler.insertData(Records, realm)
                    break;
                case "EXT_InvoiceException":
                    affectedRows = await invoiceExceptionsFactHandler.insertData(Records, realm)
                    break; 
                case "EXT_RejectedInvoice":
                    affectedRows = await rejectedInvoicesFactHandler.insertData(Records, realm)
                    break;
                case "EXT_InvoicesPayments":
                    affectedRows = await invoicePaymentsFactHandler.insertData(Records, realm)
                    break;
                case "EXT_PrereconciledInvoices":
                    affectedRows = await prereconciledInvoicesFactHandler.insertData(Records, realm)
                    break;
                case "EXT_OneTimeVendors":
                    affectedRows = await oneTimeVendorsFactHandler.insertData(Records, realm)
                    break;
                case "EXT_POLineItem":
                    affectedRows = await purchaseOrderLineItemsFactHandler.insertData(Records, realm)
                    break;
                case "EXT_PODelivery":
                    affectedRows = await purchaseOrderDeliveryFactHandler.insertData(Records, realm)
                    break;
                case "EXT_OrderConfirmation":
                    affectedRows = await orderConfirmationFactHandler.insertData(Records, realm)
                    break;
                case "EXT_AdvancePayment":
                    affectedRows = await advancePaymentFactHanlder.insertData(Records, realm)
                    break;   
                case "EXT_Payment":
                    affectedRows = await paymentsFactHandler.insertData(Records, realm)
                    break;                                       
                case "EXT_RequisitionLineItem":
                    affectedRows = await requisitionLineItemsFactHandler.insertData(Records, realm)
                    break;
                case "EXT_ContractLineItem":
                    affectedRows = await contractLineItemsFactHandler.insertData(Records, realm)
                    break;
                case "EXT_Contract":
                    affectedRows = await contractsFactHandler.insertData(Records, realm)
                    break;
                case "EXT_ContractDim":
                    affectedRows = await contractsDimHandler.insertData(Records, realm)
                    break;
                case "EXT_ContractClause":
                    affectedRows = await contractClausesFactHandler.insertData(Records, realm)
                    break;
                case "EXT_ContractWorkspace":
                    affectedRows = await contractWorkspacesFactHandler.insertData(Records, realm)
                    break;
                 case "EXT_SourcingProject":
                    affectedRows = await sourcingProjectsFactHandler.insertData(Records, realm)
                    break;
                case "EXT_SupplierParticipation":
                    affectedRows = await supplierParticipationFactHandler.insertData(Records, realm)
                    break;
                case "EXT_EventSummary":
                    affectedRows = await eventSummaryFactHandler.insertData(Records, realm)
                    break;
                case "EXT_EventItemSummary":
                    affectedRows = await eventItemSummaryFactHandler.insertData(Records, realm)
                    break;
                case "EXT_EventParticipation":
                    affectedRows = await eventParticipationsFactHandler.insertData(Records, realm)
                    break;
                case "EXT_SourcingRequest":
                    affectedRows = await sourcingRequestsFactHandler.insertData(Records, realm)
                    break;
                case "EXT_Receipt":
                    affectedRows = await receiptsFactHandler.insertData(Records, realm)
                    break;
                case "EXT_Suppliers":
                    affectedRows = await supplierDimHandler.insertData(Records, realm)
                    break;
                case "EXT_SupplierRegistrationProject":
                    affectedRows = await supplierRegistrationProjectsFactHandler.insertData(Records, realm)
                    break;
                case "EXT_SupplierRequestProject":
                    affectedRows = await supplierRequestProjectsFactHandler.insertData(Records, realm)
                    break;
                case "EXT_SPMProjects":
                    affectedRows = await spmProjectsFactHandler.insertData(Records, realm)
                    break;
                case "EXT_SMSurveyResponse":
                    affectedRows = await smProjectQuestionnaireResponsesFactHandler.insertData(Records, realm)
                    break;
                case "EXT_SMProjects":
                    affectedRows = await smProjectsFactHandler.insertData(Records, realm)
                    break;
                case "EXT_Approval":
                    affectedRows = await approvalsFactHandler.insertData(Records, realm)
                    break;
                case "EXT_ApprovalHistory":
                    affectedRows = await approvalHistoryFactHandler.insertData(Records, realm)
                    break;
                case "EXT_PendingApproval":
                    affectedRows = await pendingApprovalFactHandler.insertData(Records, realm)
                    break;
                case "EXT_UserActivity":
                    affectedRows = await userActivityFactHandler.insertData(Records, realm)
                    break;
                case "EXT_TaskApprovals":
                    affectedRows = await taskApprovalsFactHandler.insertData(Records, realm)
                    break;
                case "EXT_ProjectGroup":
                    affectedRows = await projectGroupFactHandler.insertData(Records, realm)
                    break;
                case "EXT_ContractRequest":
                    affectedRows = await contractRequestsFactHandler.insertData(Records, realm)
                    break;
                case "EXT_SRProjectTask":
                    affectedRows = await srProjectTaskFactHandler.insertData(Records, realm)
                    break;
                case "EXT_SRProjectTaskApprovalFlow":
                    affectedRows = await srProjectTaskApprovalFlowFactHandler.insertData(Records, realm)
                    break;
                case "EXT_ProjectTask":
                    affectedRows = await projectTaskFactHandler.insertData(Records, realm)
                    break;
                case "EXT_Project":
                    affectedRows = await projectsFactHandler.insertData(Records, realm)
                    break;
                case "EXT_ProjectInfo":
                    affectedRows = await projectInfoFactHandler.insertData(Records, realm)
                    break;
                case "EXT_ServicesProcurementWorkspaces":
                    affectedRows = await servicesProcurementWorkspacesFactHandler.insertData(Records, realm)
                    break;
                case "EXT_SurveyResponse":
                    affectedRows = await surveyResponseFactHandler.insertData(Records, realm)
                    break;
                case "EXT_Scorecard":
                    affectedRows = await scorecardFactHandler.insertData(Records, realm)
                    break;
                case "EXT_ContractItem":
                    affectedRows = await contractItemFactHandler.insertData(Records, realm)
                    break;
                case "EXT_SMSurveyTemplateQuestionDim":
                    affectedRows = await smSurveyTemplateQuestionDimHandler.insertData(Records, realm)
                    break;
                case "EXT_SurveyDim":
                    affectedRows = await surveyDimHandler.insertData(Records, realm)
                    break;
                case "EXT_EventDim":
                    affectedRows = await eventDimHandler.insertData(Records, realm)
                    break;
                case "EXT_Region":
                    affectedRows = await regionFactHandler.insertData(Records, realm)
                    break;
                case "EXT_Commodity":
                    affectedRows = await commodityFactHandler.insertData(Records, realm)
                    break;
                case "EXT_Organization":
                    affectedRows = await organizationFactHandler.insertData(Records, realm)
                    break;
                case "EXT_SavingsAllocationDetails":
                    affectedRows = await savingsAllocationDetailsFactHandler.insertData(Records, realm)
                    break;
                //Operational Reporting Procurement API
                case "EXT_OP_Requisition":
                    affectedRows = await requisitionHandler.insertData(Records, realm);
                    break;
                case "EXT_OP_Order":
                case "EXT_OP_ERPOrder":
                    affectedRows = await ordersHandler.insertData(Records, realm);
                    break;
                case "EXT_OS_AuditEntry":
                    affectedRows = await auditEntryHandler.insertData(Records, realm);
                    break;
                case "EXT_OS_RFXDocument":
                    affectedRows = await rfxDocumentHandler.insertData(Records, realm);
                    break;
                case "EXT_OS_RFXItem":
                    affectedRows = await rfxItemHandler.insertData(Records, realm);
                    break;
                case "EXT_OS_RFXItemValue":
                    affectedRows = await rfxItemValueHandler.insertData(Records, realm);
                    break;
                case "EXT_OS_RFXContentDocument":
                    affectedRows = await rfxContentDocumentHandler.insertData(Records, realm);
                    break;
                case "EXT_OS_RFXBid":
                    affectedRows = await rfxBidHandler.insertData(Records, realm);
                    break;
                case "EXT_OS_Alternative":
                    affectedRows = await rfxAlternativeHandler.insertData(Records, realm);
                    break;                  
                case "EXT_OS_Task":
                    affectedRows = await taskHandler.insertData(Records, realm);
                    break;       
                case "EXT_OS_ItemSupplierData":
                    affectedRows = await itemSupplierDataHandler.insertData(Records, realm);
                    break;             
                case "EXT_OS_Scenario":
                    affectedRows = await scenarioHandler.insertData(Records, realm);
                    break;                
                case "EXT_OS_SourcingRequest":
                    affectedRows = await sourcingRequestOSHandler.insertData(Records, realm);
                    break;                
                case "EXT_OS_SourcingProject":
                    affectedRows = await sourcingProjectOSHandler.insertData(Records, realm);
                    break;                
                case "EXT_OS_DocumentTask":
                    affectedRows = await documentTaskHandler.insertData(Records, realm);
                    break;                 
                case "EXT_OS_Organization":
                    affectedRows = await organizationHandler.insertData(Records, realm);
                    break;    
                case "EXT_OS_ContractWorkspace":
                    affectedRows = await contractWorkspaceOSHandler.insertData(Records, realm);
                    break;
                case "EXT_OP_Invoice":
                    affectedRows = await invoicesOSHandler.insertData(Records, realm);
                    break;
                case "EXT_OP_Contract":
                    affectedRows = await contractsOSHandler.insertData(Records, realm);
                    break;

                default:
                    logger.warn(`No handler for template ${viewTemplateName} data processing skipped.`);
            }
            resolve(affectedRows);

        } catch(e) {
            logger.error(`Error while processing data for ${viewTemplateName} for realm: ${realm} details: ${e}`);
            reject(e);
        }
    })
};

module.exports = {
    ProcessData
};