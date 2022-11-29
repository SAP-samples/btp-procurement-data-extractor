
using sap.ariba as entities from '../db';


@(requires: ['authenticated-user', 'identified-user', 'system-user'])
service sac @(path:'/sac')    {


    /**master data */
    @readonly
    entity CommodityCode as projection on entities.CommodityCode;

    @readonly
    entity Commodity as projection on entities.Commodity;
    @readonly
    entity Organization as projection on entities.Organization;
    @readonly
    entity Region as projection on entities.Region;


    @readonly
    entity SavingsAllocationDetails as projection on entities.SavingsAllocationDetails;


    /** Contracts */
    @readonly
    entity ContractWorkspaces as projection on entities.ContractWorkspaces;
    @readonly
    entity ContractWorkspaces_Commodity as select from entities.ContractWorkspaces_Commodity mixin{
        CommodityName : Association to entities.CommodityCode on CommodityName.UniqueName = Commodity.CommodityId and CommodityName.Domain = Commodity.SourceCommodityDomain;
    } into {
        *,CommodityName.Name_en as CommodityCode_Name
    };
    @readonly
    entity ContractWorkspaces_Organization as projection on entities.ContractWorkspaces_Organization;
    @readonly
    entity ContractWorkspaces_Region as projection on entities.ContractWorkspaces_Region;
    @readonly
    entity ContractWorkspaces_AffectedParties as projection on entities.ContractWorkspaces_AffectedParties;
    @readonly
    entity ContractWorkspaces_AllOwners as projection on entities.ContractWorkspaces_AllOwners;
    @readonly
    entity Contracts as projection on entities.Contracts;
    @readonly
    entity ContractLineItems as select from entities.ContractLineItems mixin{
        CommodityName : Association to entities.CommodityCode on CommodityName.UniqueName = Commodity.CommodityId and CommodityName.Domain = Commodity.SourceCommodityDomain;
    } into {
        *,CommodityName.Name_en as CommodityCode_Name
    };
    @readonly
    entity ContractClauses as projection on entities.ContractClauses;
    @readonly
    entity ContractRequests as projection on entities.ContractRequests;
    @readonly
    entity ContractRequests_Commodity as projection on entities.ContractRequests_Commodity;
    @readonly
    entity ContractRequests_Organization as projection on entities.ContractRequests_Organization;
    @readonly
    entity ContractRequests_Region as projection on entities.ContractRequests_Region;
    @readonly
    entity ContractRequests_AffectedParties as projection on entities.ContractRequests_AffectedParties;
    @readonly
    entity ContractRequests_AllOwners as projection on entities.ContractRequests_AllOwners;


    /** Sourcing */
    // Sourcing requests
    @readonly
    entity SourcingRequests as projection on entities.SourcingRequests;
    @readonly
    entity SourcingRequests_Organization as projection on entities.SourcingRequests_Organization;
    @readonly
    entity SourcingRequests_Commodity as select from entities.SourcingRequests_Commodity mixin{
        CommodityName : Association to entities.CommodityCode on CommodityName.UniqueName = Commodity.CommodityId and CommodityName.Domain = Commodity.SourceCommodityDomain;
    } into {
        *,CommodityName.Name_en as CommodityCode_Name
    };
    @readonly
    entity SourcingRequests_Region as projection on entities.SourcingRequests_Region;
    @readonly
    entity SourcingRequests_Suppliers as projection on entities.SourcingRequests_Suppliers;
    @readonly
    entity SourcingRequests_AllOwners as projection on entities.SourcingRequests_AllOwners;

    // Sourcing projects
    @readonly
    entity SourcingProjects as projection on entities.SourcingProjects;
    @readonly
    entity SourcingProjects_Region as projection on entities.SourcingProjects_Region;
    @readonly
    entity SourcingProjects_Commodity as select from entities.SourcingProjects_Commodity mixin{
        CommodityName : Association to entities.CommodityCode on CommodityName.UniqueName = Commodity.CommodityId and CommodityName.Domain = Commodity.SourceCommodityDomain;
    } into {
        *,CommodityName.Name_en as CommodityCode_Name
    };
    @readonly
    entity SourcingProjects_Suppliers as projection on entities.SourcingProjects_Suppliers;
    @readonly
    entity SourcingProjects_AllOwners as projection on entities.SourcingProjects_AllOwners;
    @readonly
    entity SourcingProjects_Organization as projection on entities.SourcingProjects_Organization;

   // Sourcing request projects tasks
    @readonly
    entity SRProjectTasks as projection on entities.SRProjectTasks;
    @readonly
    entity SRProjectTasks_ActiveApprovers as projection on entities.SRProjectTasks_ActiveApprovers;
    @readonly
    entity SRProjectTasks_AllOwners as projection on entities.SRProjectTasks_AllOwners;
    @readonly
    entity SRProjectTasks_Observers as projection on entities.SRProjectTasks_Observers;

    // Sourcing request projects tasks
    @readonly
    entity SRProjectTaskApprovalFlows as projection on entities.SRProjectTaskApprovalFlows;

    //  projects tasks
    @readonly
    entity ProjectTasks as projection on entities.ProjectTasks;
    @readonly
    entity ProjectTasks_ActiveApprovers as projection on entities.ProjectTasks_ActiveApprovers;
    @readonly
    entity ProjectTasks_AllOwners as projection on entities.ProjectTasks_AllOwners;
    @readonly
    entity ProjectTasks_Observers as projection on entities.ProjectTasks_Observers;

    // Audit Entry
    @readonly
    entity AuditEntry as projection on entities.AuditEntry;

    // Event Summary
    @readonly
    entity EventSummary as projection on entities.EventSummary;
    @readonly
    entity EventSummary_BiddedSuppliers as projection on entities.EventSummary_BiddedSuppliers;
    @readonly
    entity EventSummary_Commodity as select from entities.EventSummary_Commodity mixin{
        CommodityName : Association to entities.CommodityCode on CommodityName.UniqueName = Commodity.CommodityId and CommodityName.Domain = Commodity.SourceCommodityDomain;
    } into {
        *,CommodityName.Name_en as CommodityCode_Name
    };
    @readonly
    entity EventSummary_Region as projection on entities.EventSummary_Region;
    @readonly
    entity EventSummary_Department as projection on entities.EventSummary_Department;

    // Event Item Summary
    @readonly
    entity EventItemSummary as projection on entities.EventItemSummary;
    @readonly
    entity EventItemSummary_ItemCommodity as select from entities.EventItemSummary_ItemCommodity mixin{
        CommodityName : Association to entities.CommodityCode on CommodityName.UniqueName = ItemCommodity.CommodityId and CommodityName.Domain = ItemCommodity.SourceCommodityDomain;
    } into {
        *,CommodityName.Name_en as CommodityCode_Name
    };
    @readonly
    entity EventItemSummary_Region as projection on entities.EventItemSummary_Region;
    @readonly
    entity EventItemSummary_InvitedSuppliers as projection on entities.EventItemSummary_InvitedSuppliers;
    @readonly
    entity EventItemSummary_Department as projection on entities.EventItemSummary_Department;

    // Event Participation
    @readonly
    entity EventParticipations as projection on entities.EventParticipations;
    @readonly
    entity EventParticipations_Commodity as select from entities.EventParticipations_Commodity mixin{
        CommodityName : Association to entities.CommodityCode on CommodityName.UniqueName = Commodity.CommodityId and CommodityName.Domain = Commodity.SourceCommodityDomain;
    } into {
        *,CommodityName.Name_en as CommodityCode_Name
    };
    @readonly
    entity EventParticipations_Region as projection on entities.EventParticipations_Region;
    @readonly
    entity EventParticipations_Department as projection on entities.EventParticipations_Department;

    // Supplier Participations
    @readonly
    entity SupplierParticipations as projection on entities.SupplierParticipations;
    @readonly
    entity SupplierParticipations_ItemCommodity as select from entities.SupplierParticipations_ItemCommodity mixin{
        CommodityName : Association to entities.CommodityCode on CommodityName.UniqueName = ItemCommodity.CommodityId and CommodityName.Domain = ItemCommodity.SourceCommodityDomain;
    } into {
        *,CommodityName.Name_en as CommodityCode_Name
    };
    @readonly
    entity SupplierParticipations_Region as projection on entities.SupplierParticipations_Region;
    @readonly
    entity SupplierParticipations_Department as projection on entities.SupplierParticipations_Department;



    // Invoices
    @readonly
    entity InvoiceLineItems as select from entities.InvoiceLineItems  mixin{
        CommodityName : Association to entities.CommodityCode on CommodityName.UniqueName = Commodity.CommodityId and CommodityName.Domain = Commodity.SourceCommodityDomain;
    } into {
        *,CommodityName.Name_en as CommodityCode_Name
    };
    @readonly
    entity InvoiceLineItemsSA as projection on entities.InvoiceLineItemsSA;
    @readonly
    entity InvoiceExceptions as projection on entities.InvoiceExceptions;
    @readonly
    entity RejectedInvoices as projection on entities.RejectedInvoices;
    @readonly
    entity InvoicePayments as projection on entities.InvoicePayments;
    @readonly
    entity PrereconciledInvoices as projection on entities.PrereconciledInvoices;
    @readonly
    entity OneTimeVendors as projection on entities.OneTimeVendors;


    /** Order Processing User Story  */
    @readonly
    entity Requisition as projection on entities.Requisition;
    @readonly
    entity Requisition_ApprovalRecords as projection on entities.Requisition_ApprovalRecords;
    @readonly
    entity Requisition_ApprovalRequests as projection on entities.Requisition_ApprovalRequests;
    @readonly
    entity Requisition_ApprovalRequests_Approver as projection on entities.Requisition_ApprovalRequests_Approver;
    @readonly
    entity Requisition_LineItem as projection on entities.Requisition_LineItem;
    @readonly
    entity Requisition_LineItem_SplitAccountings as projection on entities.Requisition_LineItem_SplitAccountings;
    @readonly
    entity RequisitionLineItems as select from entities.RequisitionLineItem mixin{
        CommodityName : Association to entities.CommodityCode on CommodityName.UniqueName = Commodity.CommodityId and CommodityName.Domain = Commodity.SourceCommodityDomain;
    } into {
        *,CommodityName.Name_en as CommodityCode_Name
    };
    @readonly
    entity PurchaseOrder as projection on entities.PurchaseOrder;
    @readonly
    entity PurchaseOrder_LineItem as projection on entities.PurchaseOrder_LineItem;
    @readonly
    entity PurchaseOrder_LineItem_SplitAccountings as projection on entities.PurchaseOrder_LineItem_SplitAccountings;
    @readonly
    entity PurchaseOrderLineItems as select from entities.PurchaseOrderLineItems mixin{
        CommodityName : Association to entities.CommodityCode on CommodityName.UniqueName = Commodity.CommodityId and CommodityName.Domain = Commodity.SourceCommodityDomain;
    } into {
        *,CommodityName.Name_en as CommodityCode_Name
    };
    @readonly
    entity Receipts as projection on entities.Receipt;
    @readonly
    entity PODelivery as projection on entities.PODelivery;
    @readonly
    entity OrderConfirmation as projection on entities.OrderConfirmation;
    @readonly
    entity Payments as projection on entities.Payment;
    @readonly
    entity AdvancePayments as projection on entities.AdvancePayments;


    /** Supplier Management Stories */
    @readonly
    entity SupplierRegistrationProjects as projection on entities.SupplierRegistrationProjects;
    @readonly
    entity SupplierRegistrationProjects_Commodity as select from entities.SupplierRegistrationProjects_Commodity mixin{
        CommodityName : Association to entities.CommodityCode on CommodityName.UniqueName = Commodity.CommodityId and CommodityName.Domain = Commodity.SourceCommodityDomain;
    } into {
        *,CommodityName.Name_en as CommodityCode_Name
    };
    @readonly
    entity SupplierRegistrationProjects_Region as projection on entities.SupplierRegistrationProjects_Region;
    @readonly
    entity SupplierRegistrationProjects_Organization as projection on entities.SupplierRegistrationProjects_Organization;
    @readonly
    entity SupplierRegistrationProjects_AllOwners as projection on entities.SupplierRegistrationProjects_AllOwners;

    @readonly
    entity Suppliers as projection on entities.Suppliers;
    @readonly
    entity SLPSuppliers as projection on entities.SLPSuppliers;
    @readonly
    entity SLPSuppliers_RiskCategoryExposures as projection on entities.SLPSuppliers_RiskCategoryExposures;
    @readonly
    entity SLPSuppliers_Questionnaires as projection on entities.SLPSuppliers_Questionnaires;
    @readonly
    entity SLPSuppliers_Qualifications as projection on entities.SLPSuppliers_Qualifications;
    @readonly
    entity SLPSuppliers_Certificates as projection on entities.SLPSuppliers_Certificates;
    @readonly
    entity SPMProjects as projection on entities.SPMProjects;
    @readonly
    entity SPMProjects_Commodity as select from entities.SPMProjects_Commodity mixin{
        CommodityName : Association to entities.CommodityCode on CommodityName.UniqueName = Commodity.CommodityId and CommodityName.Domain = Commodity.SourceCommodityDomain;
    } into {
        *,CommodityName.Name_en as CommodityCode_Name
    };
    @readonly
    entity SPMProjects_Region as projection on entities.SPMProjects_Region;
    @readonly
    entity SPMProjects_AllOwners as projection on entities.SPMProjects_AllOwners;
    @readonly
    entity SPMProjects_Organization as projection on entities.SPMProjects_Organization;


    @readonly
    entity Approval as projection on entities.Approval;
    @readonly
    entity Approval_Delegatees as projection on entities.Approval_Delegatees;
    @readonly
    entity ApprovalHistory as projection on entities.ApprovalHistory;
    @readonly
    entity PendingApproval as projection on entities.PendingApproval;
    @readonly
    entity TaskApprovals as projection on entities.TaskApprovals;
    @readonly
    entity UserActivity as projection on entities.UserActivity;

        //Scorecards
    @readonly
    entity Scorecard as projection on entities.Scorecard;
    @readonly
    entity Scorecard_Commodity as projection on entities.Scorecard_Commodity;
    @readonly
    entity Scorecard_Department as projection on entities.Scorecard_Department;
    @readonly
    entity Scorecard_Region as projection on entities.Scorecard_Region;

    //Survey Response
    @readonly
    entity SurveyResponse as projection on entities.SurveyResponse;
    @readonly
    entity SurveyResponse_Commodity as projection on entities.SurveyResponse_Commodity;
    @readonly
    entity SurveyResponse_Department as projection on entities.SurveyResponse_Department;
    @readonly
    entity SurveyResponse_Region as projection on entities.SurveyResponse_Region;
    @readonly
    entity SurveyResponse_ResponseCommodityValue as projection on entities.SurveyResponse_ResponseCommodityValue;
    @readonly
    entity SurveyResponse_ResponseDepartmentValue as projection on entities.SurveyResponse_ResponseDepartmentValue;
    @readonly
    entity SurveyResponse_ResponseRegionValue as projection on entities.SurveyResponse_ResponseRegionValue;
    @readonly
    entity SurveyResponse_ResponseSupplierValue as projection on entities.SurveyResponse_ResponseSupplierValue;
    @readonly
    entity SurveyResponse_ResponseUserValue as projection on entities.SurveyResponse_ResponseUserValue;
    @readonly
    entity SurveyResponse_V_responsetextmultivalue as projection on entities.SurveyResponse_V_responsetextmultivalue;


    // projects
    @readonly
    entity ProjectInfo as projection on entities.ProjectInfo;
    @readonly
    entity Projects as select from entities.Projects mixin {
        Info : Association to entities.ProjectInfo on ProjectId = Info.ProjectId and Realm = Info.Realm;
    } into {
        *,
        Info.ProjectName as ProjectInfo_ProjectName,
        Info.ProjectTypeName as ProjectInfo_ProjectTypeName,
        Info.ProjectTypeId as ProjectInfo_ProjectTypeId,
        Info.TemplateName as ProjectInfo_TemplateName,
        Info.TemplateId as ProjectInfo_TemplateId
    };
    @readonly
    entity Projects_Organization as projection on entities.Projects_Organization;
    @readonly
    entity Projects_Commodity as select from entities.Projects_Commodity mixin{
        CommodityName : Association to entities.CommodityCode on CommodityName.UniqueName = Commodity.CommodityId and CommodityName.Domain = Commodity.SourceCommodityDomain;
    } into {
        *,CommodityName.Name_en as CommodityCode_Name
    };
    @readonly
    entity Projects_Region as projection on entities.Projects_Region;
    @readonly
    entity Projects_AllOwners as projection on entities.Projects_AllOwners;

    // Services Procurement Workspaces
    @readonly
    entity ServicesProcurementWorkspaces as projection on entities.ServicesProcurementWorkspaces;
    @readonly
    entity ServicesProcurementWorkspaces_Organization as projection on entities.ServicesProcurementWorkspaces_Organization;
    @readonly
    entity ServicesProcurementWorkspaces_Region as projection on entities.ServicesProcurementWorkspaces_Region;
    @readonly
    entity ServicesProcurementWorkspaces_AllOwners as projection on entities.ServicesProcurementWorkspaces_AllOwners;
    @readonly
    entity ServicesProcurementWorkspaces_Suppliers as projection on entities.ServicesProcurementWorkspaces_Suppliers;
    @readonly
    entity ServicesProcurementWorkspaces_Commodity as select from entities.ServicesProcurementWorkspaces_Commodity mixin{
        CommodityName : Association to entities.CommodityCode on CommodityName.UniqueName = Commodity.CommodityId and CommodityName.Domain = Commodity.SourceCommodityDomain;
    } into {
        *,CommodityName.Name_en as CommodityCode_Name
    };

}