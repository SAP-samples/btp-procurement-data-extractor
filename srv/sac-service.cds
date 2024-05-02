
using sap.ariba as entities from '../db';


@(requires: ['authenticated-user', 'identified-user', 'system-user'])
service sac @(path:'/sac')    {


    /**master data */
    @readonly
    entity CommodityCode as projection on entities.CommodityCode_MD;

    @readonly
    entity Commodity as projection on entities.Commodity_AN;
    @readonly
    entity Organization as projection on entities.Organization_OP;
    @readonly
    entity OrganizationFact as projection on entities.Organization_AN;
    @readonly
    entity Region as projection on entities.Region_AN;


    @readonly
    entity SavingsAllocationDetails as projection on entities.SavingsAllocationDetails_AN;

    @readonly
    entity SavingsForm as projection on entities.SavingsForm_AN;

    /** Contracts */
    @readonly
    entity ContractWorkspaces as projection on entities.ContractWorkspaces_AN;
    @readonly
    entity ContractWorkspaces_Commodity as select from entities.ContractWorkspaces_Commodity_AN mixin{
        CommodityName : Association to entities.CommodityCode_MD on CommodityName.UniqueName = Commodity.CommodityId and CommodityName.Domain = Commodity.SourceCommodityDomain;
    } into {
        *,CommodityName.Name_en as CommodityCode_Name
    };
    @readonly
    entity ContractWorkspaces_Organization as projection on entities.ContractWorkspaces_Organization_AN;
    @readonly
    entity ContractWorkspaces_Region as projection on entities.ContractWorkspaces_Region_AN;
    @readonly
    entity ContractWorkspaces_AffectedParties as projection on entities.ContractWorkspaces_AffectedParties_AN;
    @readonly
    entity ContractWorkspaces_AllOwners as projection on entities.ContractWorkspaces_AllOwners_AN;
    @readonly
    entity Contracts as projection on entities.Contracts_AN;
    @readonly
    entity ContractLineItems as select from entities.ContractLineItems_AN mixin{
        CommodityName : Association to entities.CommodityCode_MD on CommodityName.UniqueName = Commodity.CommodityId and CommodityName.Domain = Commodity.SourceCommodityDomain;
    } into {
        *,CommodityName.Name_en as CommodityCode_Name
    };
    @readonly
    entity ContractClauses as projection on entities.ContractClauses_AN;
    @readonly
    entity ContractRequests as projection on entities.ContractRequests_AN;
    @readonly
    entity ContractRequests_Commodity as projection on entities.ContractRequests_Commodity_AN;
    @readonly
    entity ContractRequests_Organization as projection on entities.ContractRequests_Organization_AN;
    @readonly
    entity ContractRequests_Region as projection on entities.ContractRequests_Region_AN;
    @readonly
    entity ContractRequests_AffectedParties as projection on entities.ContractRequests_AffectedParties_AN;
    @readonly
    entity ContractRequests_AllOwners as projection on entities.ContractRequests_AllOwners_AN;


    /** Sourcing */
    // Sourcing requests
    @readonly
    entity SourcingRequests as projection on entities.SourcingRequests_AN;
    @readonly
    entity SourcingRequests_Organization as projection on entities.SourcingRequests_Organization_AN;
    @readonly
    entity SourcingRequests_Commodity as select from entities.SourcingRequests_Commodity_AN mixin{
        CommodityName : Association to entities.CommodityCode_MD on CommodityName.UniqueName = Commodity.CommodityId and CommodityName.Domain = Commodity.SourceCommodityDomain;
    } into {
        *,CommodityName.Name_en as CommodityCode_Name
    };
    @readonly
    entity SourcingRequests_Region as projection on entities.SourcingRequests_Region_AN;
    @readonly
    entity SourcingRequests_Suppliers as projection on entities.SourcingRequests_Suppliers_AN;
    @readonly
    entity SourcingRequests_AllOwners as projection on entities.SourcingRequests_AllOwners_AN;

    // Sourcing projects
    @readonly
    entity SourcingProjects as projection on entities.SourcingProjects_AN;
    @readonly
    entity SourcingProjects_Region as projection on entities.SourcingProjects_Region_AN;
    @readonly
    entity SourcingProjects_Commodity as select from entities.SourcingProjects_Commodity_AN mixin{
        CommodityName : Association to entities.CommodityCode_MD on CommodityName.UniqueName = Commodity.CommodityId and CommodityName.Domain = Commodity.SourceCommodityDomain;
    } into {
        *,CommodityName.Name_en as CommodityCode_Name
    };
    @readonly
    entity SourcingProjects_Suppliers as projection on entities.SourcingProjects_Suppliers_AN;
    @readonly
    entity SourcingProjects_AllOwners as projection on entities.SourcingProjects_AllOwners_AN;
    @readonly
    entity SourcingProjects_Organization as projection on entities.SourcingProjects_Organization_AN;

   // Sourcing request projects tasks
    @readonly
    entity SRProjectTasks as projection on entities.SRProjectTasks_AN;
    @readonly
    entity SRProjectTasks_ActiveApprovers as projection on entities.SRProjectTasks_ActiveApprovers_AN;
    @readonly
    entity SRProjectTasks_AllOwners as projection on entities.SRProjectTasks_AllOwners_AN;
    @readonly
    entity SRProjectTasks_Observers as projection on entities.SRProjectTasks_Observers_AN;

    // Sourcing request projects tasks
    @readonly
    entity SRProjectTaskApprovalFlows as projection on entities.SRProjectTaskApprovalFlows_AN;

    //  projects tasks
    @readonly
    entity ProjectTasks as projection on entities.ProjectTasks_AN;
    @readonly
    entity ProjectTasks_ActiveApprovers as projection on entities.ProjectTasks_ActiveApprovers_AN;
    @readonly
    entity ProjectTasks_AllOwners as projection on entities.ProjectTasks_AllOwners_AN;
    @readonly
    entity ProjectTasks_Observers as projection on entities.ProjectTasks_Observers_AN;

    // Audit Entry
    @readonly
    entity AuditEntry as projection on entities.AuditEntry_OP;

    // Event Summary
    @readonly
    entity EventSummary as projection on entities.EventSummary_AN;
    @readonly
    entity EventSummary_BiddedSuppliers as projection on entities.EventSummary_BiddedSuppliers_AN;
    @readonly
    entity EventSummary_Commodity as select from entities.EventSummary_Commodity_AN mixin{
        CommodityName : Association to entities.CommodityCode_MD on CommodityName.UniqueName = Commodity.CommodityId and CommodityName.Domain = Commodity.SourceCommodityDomain;
    } into {
        *,CommodityName.Name_en as CommodityCode_Name
    };
    @readonly
    entity EventSummary_Region as projection on entities.EventSummary_Region_AN;
    @readonly
    entity EventSummary_Department as projection on entities.EventSummary_Department_AN;

    // Event Item Summary
    @readonly
    entity EventItemSummary as projection on entities.EventItemSummary_AN;
    @readonly
    entity EventItemSummary_ItemCommodity as select from entities.EventItemSummary_ItemCommodity_AN mixin{
        CommodityName : Association to entities.CommodityCode_MD on CommodityName.UniqueName = ItemCommodity.CommodityId and CommodityName.Domain = ItemCommodity.SourceCommodityDomain;
    } into {
        *,CommodityName.Name_en as CommodityCode_Name
    };
    @readonly
    entity EventItemSummary_Region as projection on entities.EventItemSummary_Region_AN;
    @readonly
    entity EventItemSummary_InvitedSuppliers as projection on entities.EventItemSummary_InvitedSuppliers_AN;
    @readonly
    entity EventItemSummary_Department as projection on entities.EventItemSummary_Department_AN;

    // Event Participation
    @readonly
    entity EventParticipations as projection on entities.EventParticipations_AN;
    @readonly
    entity EventParticipations_Commodity as select from entities.EventParticipations_Commodity_AN mixin{
        CommodityName : Association to entities.CommodityCode_MD on CommodityName.UniqueName = Commodity.CommodityId and CommodityName.Domain = Commodity.SourceCommodityDomain;
    } into {
        *,CommodityName.Name_en as CommodityCode_Name
    };
    @readonly
    entity EventParticipations_Region as projection on entities.EventParticipations_Region_AN;
    @readonly
    entity EventParticipations_Department as projection on entities.EventParticipations_Department_AN;

    // Supplier Participations
    @readonly
    entity SupplierParticipations as projection on entities.SupplierParticipations_AN;
    @readonly
    entity SupplierParticipations_ItemCommodity as select from entities.SupplierParticipations_ItemCommodity_AN mixin{
        CommodityName : Association to entities.CommodityCode_MD on CommodityName.UniqueName = ItemCommodity.CommodityId and CommodityName.Domain = ItemCommodity.SourceCommodityDomain;
    } into {
        *,CommodityName.Name_en as CommodityCode_Name
    };
    @readonly
    entity SupplierParticipations_Region as projection on entities.SupplierParticipations_Region_AN;
    @readonly
    entity SupplierParticipations_Department as projection on entities.SupplierParticipations_Department_AN;



    // Invoices
    @readonly
    entity Invoice as projection on entities.Invoice_OP;
    @readonly
    entity Invoice_ApprovalRecords as projection on entities.Invoice_ApprovalRecords_OP;
    @readonly
    entity Invoice_ApprovalRequests as projection on entities.Invoice_ApprovalRequests_OP;
    @readonly
    entity Invoice_ApprovalRequests_Approver as projection on entities.Invoice_ApprovalRequests_Approver_OP;
    @readonly
    entity Invoice_LineItem as projection on entities.Invoice_LineItem_OP;
    @readonly
    entity Invoice_LineItem_SplitAccountings as projection on entities.Invoice_LineItem_SplitAccountings_OP;



    @readonly
    entity InvoiceLineItems as select from entities.InvoiceLineItems_AN mixin{
        CommodityName : Association to entities.CommodityCode_MD on CommodityName.UniqueName = Commodity.CommodityId and CommodityName.Domain = Commodity.SourceCommodityDomain;
    } into {
        *,CommodityName.Name_en as CommodityCode_Name
    };
    @readonly
    entity InvoiceLineItemsSA as projection on entities.InvoiceLineItemsSA_AN;
    @readonly
    entity InvoiceExceptions as projection on entities.InvoiceExceptions_AN;
    @readonly
    entity InvoiceLineItemExceptions as projection on entities.InvoiceLineItemExceptions_AN;
    @readonly
    entity RejectedInvoices as projection on entities.RejectedInvoices_AN;
    @readonly
    entity InvoicePayments as projection on entities.InvoicePayments_AN;
    @readonly
    entity PrereconciledInvoices as projection on entities.PrereconciledInvoices_AN;
    @readonly
    entity OneTimeVendors as projection on entities.OneTimeVendors_AN;


    /** Order Processing User Story  */
    @readonly
    entity Requisition as projection on entities.Requisition_OP;
    @readonly
    entity Requisition_ApprovalRecords as projection on entities.Requisition_ApprovalRecords_OP;
    @readonly
    entity Requisition_ApprovalRequests as projection on entities.Requisition_ApprovalRequests_OP;
    @readonly
    entity Requisition_ApprovalRequests_Approver as projection on entities.Requisition_ApprovalRequests_Approver_OP;
    @readonly
    entity Requisition_LineItem as projection on entities.Requisition_LineItem_OP;
    @readonly
    entity Requisition_LineItem_SplitAccountings as projection on entities.Requisition_LineItem_SplitAccountings_OP;
    @readonly
    entity RequisitionLineItems as select from entities.RequisitionLineItem_AN mixin{
        CommodityName : Association to entities.CommodityCode_MD on CommodityName.UniqueName = Commodity.CommodityId and CommodityName.Domain = Commodity.SourceCommodityDomain;
    } into {
        *,CommodityName.Name_en as CommodityCode_Name
    };
    @readonly
    entity PurchaseOrder as projection on entities.PurchaseOrder_OP;
    @readonly
    entity PurchaseOrder_LineItem as projection on entities.PurchaseOrder_LineItem_OP;
    @readonly
    entity PurchaseOrder_LineItem_SplitAccountings as projection on entities.PurchaseOrder_LineItem_SplitAccountings_OP;
    @readonly
    entity PurchaseOrderLineItems as select from entities.PurchaseOrderLineItems_AN mixin{
        CommodityName : Association to entities.CommodityCode_MD on CommodityName.UniqueName = Commodity.CommodityId and CommodityName.Domain = Commodity.SourceCommodityDomain;
    } into {
        *,CommodityName.Name_en as CommodityCode_Name
    };
    @readonly
    entity Receipts as projection on entities.Receipt_AN;
    @readonly
    entity ReceiptOS as projection on entities.Receipt_OP;
    @readonly
    entity ReceiptOS_ReceiptItems as projection on entities.Receipt_ReceiptItems_OP;
    @readonly
    entity ReceiptOS_ReceiptItems_AssetData as projection on entities.Receipt_ReceiptItems_AssetData_OP;
    @readonly
    entity ReceiptOS_ApprovalRequests as projection on entities.Receipt_ApprovalRequests_OP;
    @readonly
    entity ReceiptOS_ApprovalRequests_Approver as projection on entities.Receipt_ApprovalRequests_Approver_OP;


    @readonly
    entity PODelivery as projection on entities.PODelivery_AN;
    @readonly
    entity OrderConfirmation as projection on entities.OrderConfirmation_AN;
    @readonly
    entity Payments as projection on entities.Payment_AN;
    @readonly
    entity AdvancePayments as projection on entities.AdvancePayments_AN;


    /** Supplier Management Stories */
    @readonly
    entity SupplierRegistrationProjects as projection on entities.SupplierRegistrationProjects_AN;
    @readonly
    entity SupplierRegistrationProjects_Commodity as select from entities.SupplierRegistrationProjects_Commodity_AN mixin{
        CommodityName : Association to entities.CommodityCode_MD on CommodityName.UniqueName = Commodity.CommodityId and CommodityName.Domain = Commodity.SourceCommodityDomain;
    } into {
        *,CommodityName.Name_en as CommodityCode_Name
    };
    @readonly
    entity SupplierRegistrationProjects_Region as projection on entities.SupplierRegistrationProjects_Region_AN;
    @readonly
    entity SupplierRegistrationProjects_Organization as projection on entities.SupplierRegistrationProjects_Organization_AN;
    @readonly
    entity SupplierRegistrationProjects_AllOwners as projection on entities.SupplierRegistrationProjects_AllOwners_AN;

    @readonly
    entity Suppliers as projection on entities.Suppliers_AN;
    @readonly
    entity SLPSuppliers as projection on entities.SLPSuppliers_SM;
    @readonly
    entity SLPSuppliers_RiskCategoryExposures as projection on entities.SLPSuppliers_RiskCategoryExposures_SM;
    @readonly
    entity SLPSuppliers_Questionnaires as projection on entities.SLPSuppliers_Questionnaires_SM;
    @readonly
    entity SLPSuppliers_Qualifications as projection on entities.SLPSuppliers_Qualifications_SM;
    @readonly
    entity SLPSuppliers_Certificates as projection on entities.SLPSuppliers_Certificates_SM;
    @readonly
    entity SLPSuppliers_QuestionAnswer as projection on entities.SLPSuppliers_QuestionAnswer_SM;
    @readonly
    entity SPMProjects as projection on entities.SPMProjects_AN;
    @readonly
    entity SPMProjects_Commodity as select from entities.SPMProjects_Commodity_AN mixin{
        CommodityName : Association to entities.CommodityCode_MD on CommodityName.UniqueName = Commodity.CommodityId and CommodityName.Domain = Commodity.SourceCommodityDomain;
    } into {
        *,CommodityName.Name_en as CommodityCode_Name
    };
    @readonly
    entity SPMProjects_Region as projection on entities.SPMProjects_Region_AN;
    @readonly
    entity SPMProjects_AllOwners as projection on entities.SPMProjects_AllOwners_AN;
    @readonly
    entity SPMProjects_Organization as projection on entities.SPMProjects_Organization_AN;


    @readonly
    entity Approval as projection on entities.Approval_AN;
    @readonly
    entity Approval_Delegatees as projection on entities.Approval_Delegatees_AN;
    @readonly
    entity ApprovalHistory as projection on entities.ApprovalHistory_AN;
    @readonly
    entity PendingApproval as projection on entities.PendingApproval_AN;
    @readonly
    entity TaskApprovals as projection on entities.TaskApprovals_AN;
    @readonly
    entity UserActivity as projection on entities.UserActivity_AN;

        //Scorecards
    @readonly
    entity Scorecard as projection on entities.Scorecard_AN;
    @readonly
    entity Scorecard_Commodity as projection on entities.Scorecard_Commodity_AN;
    @readonly
    entity Scorecard_Department as projection on entities.Scorecard_Department_AN;
    @readonly
    entity Scorecard_Region as projection on entities.Scorecard_Region_AN;

    //Survey Response
    @readonly
    entity SurveyResponse as projection on entities.SurveyResponse_AN;
    @readonly
    entity SurveyResponse_Commodity as projection on entities.SurveyResponse_Commodity_AN;
    @readonly
    entity SurveyResponse_Department as projection on entities.SurveyResponse_Department_AN;
    @readonly
    entity SurveyResponse_Region as projection on entities.SurveyResponse_Region_AN;
    @readonly
    entity SurveyResponse_ResponseCommodityValue as projection on entities.SurveyResponse_ResponseCommodityValue_AN;
    @readonly
    entity SurveyResponse_ResponseDepartmentValue as projection on entities.SurveyResponse_ResponseDepartmentValue_AN;
    @readonly
    entity SurveyResponse_ResponseRegionValue as projection on entities.SurveyResponse_ResponseRegionValue_AN;
    @readonly
    entity SurveyResponse_ResponseSupplierValue as projection on entities.SurveyResponse_ResponseSupplierValue_AN;
    @readonly
    entity SurveyResponse_ResponseUserValue as projection on entities.SurveyResponse_ResponseUserValue_AN;
    @readonly
    entity SurveyResponse_V_responsetextmultivalue as projection on entities.SurveyResponse_V_responsetextmultivalue_AN;


    // projects
    @readonly
    entity ProjectInfo as projection on entities.ProjectInfo_AN;
    @readonly
    entity Projects as select from entities.Projects_AN mixin {
        Info : Association to entities.ProjectInfo_AN on ProjectId = Info.ProjectId and Realm = Info.Realm;
    } into {
        *,
        Info.ProjectName as ProjectInfo_ProjectName,
        Info.ProjectTypeName as ProjectInfo_ProjectTypeName,
        Info.ProjectTypeId as ProjectInfo_ProjectTypeId,
        Info.TemplateName as ProjectInfo_TemplateName,
        Info.TemplateId as ProjectInfo_TemplateId
    };
    @readonly
    entity Projects_Organization as projection on entities.Projects_Organization_AN;
    @readonly
    entity Projects_Commodity as select from entities.Projects_Commodity_AN mixin{
        CommodityName : Association to entities.CommodityCode_MD on CommodityName.UniqueName = Commodity.CommodityId and CommodityName.Domain = Commodity.SourceCommodityDomain;
    } into {
        *,CommodityName.Name_en as CommodityCode_Name
    };
    @readonly
    entity Projects_Region as projection on entities.Projects_Region_AN;
    @readonly
    entity Projects_AllOwners as projection on entities.Projects_AllOwners_AN;

    // Services Procurement Workspaces
    @readonly
    entity ServicesProcurementWorkspaces as projection on entities.ServicesProcurementWorkspaces_AN;
    @readonly
    entity ServicesProcurementWorkspaces_Organization as projection on entities.ServicesProcurementWorkspaces_Organization_AN;
    @readonly
    entity ServicesProcurementWorkspaces_Region as projection on entities.ServicesProcurementWorkspaces_Region_AN;
    @readonly
    entity ServicesProcurementWorkspaces_AllOwners as projection on entities.ServicesProcurementWorkspaces_AllOwners_AN;
    @readonly
    entity ServicesProcurementWorkspaces_Suppliers as projection on entities.ServicesProcurementWorkspaces_Suppliers_AN;
    @readonly
    entity ServicesProcurementWorkspaces_Commodity as select from entities.ServicesProcurementWorkspaces_Commodity_AN mixin{
        CommodityName : Association to entities.CommodityCode_MD on CommodityName.UniqueName = Commodity.CommodityId and CommodityName.Domain = Commodity.SourceCommodityDomain;
    } into {
        *,CommodityName.Name_en as CommodityCode_Name
    };

}