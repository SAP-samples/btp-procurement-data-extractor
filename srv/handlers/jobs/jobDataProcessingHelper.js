"use strict";

//Libs
const logger = cds.log('logger');

//Analytical Data Handlers
const contractsFactHandler = require('../Analytical/contracts/contractsFactHandler');
const contractsDimHandler = require('../Analytical/contracts/contractsDimHandler');
const contractLineItemsFactHandler = require('../Analytical/contracts/contractLineItemsFactHandler');
const contractClausesFactHandler = require('../Analytical/contracts/contractClausesFactHandler');
const contractWorkspacesFactHandler = require('../Analytical/contracts/contractWorkspacesFactHandler');
const contractRequestsFactHandler = require('../Analytical/contracts/contractRequestsFactHandler');
const contractItemFactHandler = require('../Analytical/contracts/contractItemFactHandler');

const orderConfirmationFactHandler = require('../Analytical/orders/orderConfirmationFactHandler');
const purchaseOrderLineItemsFactHandler = require('../Analytical/orders/purchaseOrderLineItemsFactHandler');
const purchaseOrderDeliveryFactHandler = require('../Analytical/orders/purchaseOrderDeliveryFactHandler');
const advancePaymentFactHanlder = require('../Analytical/payments/advancePaymentFactHanlder');
const requisitionLineItemsFactHandler = require('../Analytical/requisitions/requisitionLineItemsFactHandler');
const sourcingProjectsFactHandler = require('../Analytical/sourcing/sourcingProjectsFactHandler');
const supplierParticipationFactHandler = require('../Analytical/sourcing/supplierParticipationFactHandler');
const eventSummaryFactHandler = require('../Analytical/sourcing/eventSummaryFactHandler');
const eventItemSummaryFactHandler = require('../Analytical/sourcing/eventItemSummaryFactHandler');
const eventParticipationsFactHandler = require('../Analytical/sourcing/eventParticipationsFactHandler');
const sourcingRequestsFactHandler = require('../Analytical/sourcing/sourcingRequestsFactHandler');
const eventDimHandler = require('../Analytical/sourcing/eventDimHandler');
const eventTypeDimHandler = require('../Analytical/sourcing/eventTypeDimHandler');

const srProjectTaskFactHandler = require('../Analytical/sourcing/srProjectTaskFactHandler');
const srProjectTaskApprovalFlowFactHandler = require('../Analytical/sourcing/srProjectTaskApprovalFlowFactHandler');
const projectTaskFactHandler = require('../Analytical/sourcing/projectTaskFactHandler');

const receiptsFactHandler = require('../Analytical/receipt/receiptsFactHandler');
const receiptsOSHandler = require('../Operational/receipts/receiptsOSHandler');
const paymentsFactHandler = require('../Analytical/payments/paymentsFactHandler');

const oneTimeVendorsFactHandler = require('../Analytical/suppliers/oneTimeVendorsFactHandler');
const prereconciledInvoicesFactHandler = require('../Analytical/invoices/prereconciledInvoicesFactHandler');
const invoicePaymentsFactHandler = require('../Analytical/invoices/invoicePaymentsFactHandler');
const rejectedInvoicesFactHandler = require('../Analytical/invoices/rejectedInvoicesFactHandler');
const invoiceLineItemsSAHandler = require('../Analytical/invoices/invoiceLineItemsSAHandler');
const invoiceLineItemsFactHandler = require('../Analytical/invoices/invoiceLineItemsFactHandler');
const invoiceExceptionsFactHandler = require('../Analytical/invoices/invoiceExceptionsFactHandler');
const invoiceLineItemExceptionsFactHandler = require('../Analytical/invoices/invoiceLineItemExceptionsFactHandler');
const invoiceExceptionTypeDimHandler = require('../Analytical/invoices/invoiceExceptionTypeDimHandler');

const supplierDimHandler = require('../Analytical/suppliers/supplierDimHandler');
const supplierRegistrationProjectsFactHandler = require('../Analytical/suppliers/supplierRegistrationProjectsFactHandler');
const supplierRequestProjectsFactHandler = require('../Analytical/suppliers/supplierRequestProjectsFactHandler');
const spmProjectsFactHandler = require('../Analytical/suppliers/spmProjectsFactHandler');
const smProjectsFactHandler = require('../Analytical/suppliers/smProjectsFactHandler');
const smProjectQuestionnaireResponsesFactHandler = require('../Analytical/suppliers/smProjectQuestionnaireResponsesFactHandler');
const surveyResponseFactHandler = require('../Analytical/suppliers/surveyResponseFactHandler');
const scorecardFactHandler = require('../Analytical/suppliers/scorecardFactHandler');
const surveyDimHandler = require('../Analytical/suppliers/surveyDimHandler');
const smSurveyTemplateQuestionDimHandler = require('../Analytical/suppliers/smSurveyTemplateQuestionDimHandler');

const approvalsFactHandler = require('../Analytical/general/approvalsFactHandler');
const approvalHistoryFactHandler = require('../Analytical/general/approvalHistoryFactHandler');
const pendingApprovalFactHandler = require('../Analytical/general/pendingApprovalFactHandler');
const userActivityFactHandler = require('../Analytical/general/userActivityFactHandler');
const taskApprovalsFactHandler = require('../Analytical/general/taskApprovalsFactHandler');
const projectGroupFactHandler = require('../Analytical/general/projectGroupFactHandler');
const regionFactHandler = require('../Analytical/general/regionFactHandler');
const commodityFactHandler = require('../Analytical/general/commodityFactHandler');
const organizationFactHandler = require('../Analytical/general/organizationFactHandler');
const savingsAllocationDetailsFactHandler = require('../Analytical/sourcing/savingsAllocationDetailsFactHandler');
const savingsFormFactHandler = require('../Analytical/sourcing/savingsFormFactHandler');

const userDataDimHandler = require('../Analytical/general/userDataDimHandler');
const costCenterDimHandler = require('../Analytical/general/costCenterDimHandler');
const companyCodeDimHandler = require('../Analytical/general/companyCodeDimHandler');

const projectsFactHandler = require('../Analytical/sourcing/projectsFactHandler');
const projectInfoFactHandler = require('../Analytical/sourcing/projectInfoFactHandler');
const servicesProcurementWorkspacesFactHandler = require('../Analytical/procurement/servicesProcurementWorkspacesFactHandler');

//Operational Data Handlers
const requisitionHandler = require('../Operational/requisitions/requisitionHandler');
const invoicesOSHandler = require('../Operational/invoices/invoicesOSHandler');
const invoiceReconciliationsOSHandler = require('../Operational/invoices/invoiceReconciliationsOSHandler');
const contractsOSHandler = require('../Operational/contracts/contractsOSHandler');
const ordersHandler = require('../Operational/orders/purchaseOrderHandler');

const rfxDocumentHandler = require('../Operational/sourcing/rfxDocumentHandler');
const rfxItemHandler = require('../Operational/sourcing/rfxItemHandler');
const rfxItemValueHandler = require('../Operational/sourcing/rfxItemValueHandler');
const rfxContentDocumentHandler = require('../Operational/sourcing/rfxContentDocumentHandler');
const rfxBidHandler = require('../Operational/sourcing/rfxBidHandler');
const rfxAlternativeHandler = require('../Operational/sourcing/rfxAlternativeHandler');
const taskHandler = require('../Operational/sourcing/taskHandler');
const itemSupplierDataHandler = require('../Operational/sourcing/itemSupplierDataHandler');
const scenarioHandler = require('../Operational/sourcing/scenarioHandler');
const sourcingRequestOSHandler = require('../Operational/sourcing/sourcingRequestOSHandler');
const sourcingProjectOSHandler = require('../Operational/sourcing/sourcingProjectOSHandler');
const documentTaskHandler = require('../Operational/sourcing/documentTaskHandler');
const organizationHandler = require('../Operational/sourcing/organizationHandler');

const contractWorkspaceOSHandler = require('../Operational/contracts/contractWorkspaceOSHandler');


const auditEntryHandler = require('../Operational/sourcing/auditEntryHandler');


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
                case "EXT_InvoiceLineItemException":
                    affectedRows = await invoiceLineItemExceptionsFactHandler.insertData(Records, realm)
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
                case "EXT_SavingsForm":
                    affectedRows = await savingsFormFactHandler.insertData(Records, realm)
                    break;
                case "EXT_InvoiceExceptionType":
                        affectedRows = await invoiceExceptionTypeDimHandler.insertData(Records, realm)
                        break;
                case "EXT_EventType":
                        affectedRows = await eventTypeDimHandler.insertData(Records, realm)
                        break;
                case "EXT_CostCenter":
                        affectedRows = await costCenterDimHandler.insertData(Records, realm)
                        break;
                case "EXT_CompanyCode":
                        affectedRows = await companyCodeDimHandler.insertData(Records, realm)
                        break;                
                case "EXT_UserData":
                    affectedRows = await userDataDimHandler.insertData(Records, realm)
                    break;
                //Operational Reporting Procurement API
                case "EXT_OP_Requisition":
                    affectedRows = await requisitionHandler.insertData(Records, realm);
                    break;
                case "EXT_OP_Order":
                case "EXT_OP_ERPOrder":
                case "EXT_OP_CopyOrder":
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
                case "EXT_OP_InvoiceReconciliation":
                    affectedRows = await invoiceReconciliationsOSHandler.insertData(Records, realm);
                    break;
                case "EXT_OP_Contract":
                    affectedRows = await contractsOSHandler.insertData(Records, realm);
                    break;
                case "EXT_OP_Receipt":
                    affectedRows = await receiptsOSHandler.insertData(Records, realm);
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