using sac from '../sac-service';

/** Contracts */
annotate sac.ContractWorkspaces with {
    Description     @odata.Type:'Edm.String' @odata.MaxLength:256 @odata.IsUnbounded:false;
}

annotate sac.ContractLineItems with {
    Description     @odata.Type:'Edm.String' @odata.MaxLength:256 @odata.IsUnbounded:false;
    createdAt  @odata.Type:'Edm.DateTime' @odata.MaxLength:10 @odata.IsUnbounded:false;
    modifiedAt  @odata.Type:'Edm.DateTime' @odata.MaxLength:10 @odata.IsUnbounded:false;
    LoadCreateTime  @odata.Type:'Edm.DateTime' @odata.MaxLength:10 @odata.IsUnbounded:false;
    LoadUpdateTime  @odata.Type:'Edm.DateTime' @odata.MaxLength:10 @odata.IsUnbounded:false;
    EffectiveDate  @odata.Type:'Edm.DateTime' @odata.MaxLength:10 @odata.IsUnbounded:false;
}

annotate sac.Contracts with {
    Description     @odata.Type:'Edm.String' @odata.MaxLength:256 @odata.IsUnbounded:false;
    createdAt  @odata.Type:'Edm.DateTime' @odata.MaxLength:10 @odata.IsUnbounded:false;
    modifiedAt  @odata.Type:'Edm.DateTime' @odata.MaxLength:10 @odata.IsUnbounded:false;
    LoadCreateTime  @odata.Type:'Edm.DateTime' @odata.MaxLength:10 @odata.IsUnbounded:false;
    LoadUpdateTime  @odata.Type:'Edm.DateTime' @odata.MaxLength:10 @odata.IsUnbounded:false;
    EffectiveDate  @odata.Type:'Edm.DateTime' @odata.MaxLength:10 @odata.IsUnbounded:false;
    ExpirationDate  @odata.Type:'Edm.DateTime' @odata.MaxLength:10 @odata.IsUnbounded:false;
}

/** Invoices */
annotate sac.InvoiceLineItems with {
    Description     @odata.Type:'Edm.String' @odata.MaxLength:256 @odata.IsUnbounded:false;
    PODescription   @odata.Type:'Edm.String' @odata.MaxLength:256 @odata.IsUnbounded:false;
    createdAt  @odata.Type:'Edm.DateTime' @odata.MaxLength:10 @odata.IsUnbounded:false;
    modifiedAt  @odata.Type:'Edm.DateTime' @odata.MaxLength:10 @odata.IsUnbounded:false;
    LoadCreateTime  @odata.Type:'Edm.DateTime' @odata.MaxLength:10 @odata.IsUnbounded:false;
    LoadUpdateTime  @odata.Type:'Edm.DateTime' @odata.MaxLength:10 @odata.IsUnbounded:false;
    ReconciledDate  @odata.Type:'Edm.DateTime' @odata.MaxLength:10 @odata.IsUnbounded:false;
    ServicePeriodTo  @odata.Type:'Edm.DateTime' @odata.MaxLength:10 @odata.IsUnbounded:false;
    ServicePeriodFrom  @odata.Type:'Edm.DateTime' @odata.MaxLength:10 @odata.IsUnbounded:false;
    InvoiceSubmitDate  @odata.Type:'Edm.DateTime' @odata.MaxLength:10 @odata.IsUnbounded:false;
    InvoiceDateCreated  @odata.Type:'Edm.DateTime' @odata.MaxLength:10 @odata.IsUnbounded:false;
    AccountingDate  @odata.Type:'Edm.DateTime' @odata.MaxLength:10 @odata.IsUnbounded:false;
    InvoiceDate  @odata.Type:'Edm.DateTime' @odata.MaxLength:10 @odata.IsUnbounded:false;
    PaidDate  @odata.Type:'Edm.DateTime' @odata.MaxLength:10 @odata.IsUnbounded:false;
    NetDueDate  @odata.Type:'Edm.DateTime' @odata.MaxLength:10 @odata.IsUnbounded:false;
    ApprovedDate  @odata.Type:'Edm.DateTime' @odata.MaxLength:10 @odata.IsUnbounded:false;
    PaidReferenceDateDate  @odata.Type:'Edm.DateTime' @odata.MaxLength:10 @odata.IsUnbounded:false;
}

annotate sac.InvoiceLineItemsSA with {
    Description     @odata.Type:'Edm.String' @odata.MaxLength:256 @odata.IsUnbounded:false;
    PODescription   @odata.Type:'Edm.String' @odata.MaxLength:256 @odata.IsUnbounded:false;
}

annotate sac.PrereconciledInvoices with {
    Description     @odata.Type:'Edm.String' @odata.MaxLength:256 @odata.IsUnbounded:false;
    PODescription   @odata.Type:'Edm.String' @odata.MaxLength:256 @odata.IsUnbounded:false;
    createdAt  @odata.Type:'Edm.DateTime' @odata.MaxLength:10 @odata.IsUnbounded:false;
    modifiedAt  @odata.Type:'Edm.DateTime' @odata.MaxLength:10 @odata.IsUnbounded:false;
    LoadCreateTime  @odata.Type:'Edm.DateTime' @odata.MaxLength:10 @odata.IsUnbounded:false;
    LoadUpdateTime  @odata.Type:'Edm.DateTime' @odata.MaxLength:10 @odata.IsUnbounded:false;
    InvoiceDate  @odata.Type:'Edm.DateTime' @odata.MaxLength:10 @odata.IsUnbounded:false;
    ServicePeriodTo  @odata.Type:'Edm.DateTime' @odata.MaxLength:10 @odata.IsUnbounded:false;
    ServicePeriodFrom  @odata.Type:'Edm.DateTime' @odata.MaxLength:10 @odata.IsUnbounded:false;
    InvoiceSubmitDate  @odata.Type:'Edm.DateTime' @odata.MaxLength:10 @odata.IsUnbounded:false;
    InvoiceDateCreated  @odata.Type:'Edm.DateTime' @odata.MaxLength:10 @odata.IsUnbounded:false;
    ReferenceDate  @odata.Type:'Edm.DateTime' @odata.MaxLength:10 @odata.IsUnbounded:false;
}


/** Orders */
annotate sac.OrderConfirmation with {
    Description     @odata.Type:'Edm.String' @odata.MaxLength:256 @odata.IsUnbounded:false;
    createdAt  @odata.Type:'Edm.DateTime' @odata.MaxLength:10 @odata.IsUnbounded:false;
    modifiedAt  @odata.Type:'Edm.DateTime' @odata.MaxLength:10 @odata.IsUnbounded:false;
    LoadCreateTime  @odata.Type:'Edm.DateTime' @odata.MaxLength:10 @odata.IsUnbounded:false;
    LoadUpdateTime  @odata.Type:'Edm.DateTime' @odata.MaxLength:10 @odata.IsUnbounded:false;
    DeliveryDate  @odata.Type:'Edm.DateTime' @odata.MaxLength:10 @odata.IsUnbounded:false;
    ShipmentDate  @odata.Type:'Edm.DateTime' @odata.MaxLength:10 @odata.IsUnbounded:false;
    OrderConfirmationDate  @odata.Type:'Edm.DateTime' @odata.MaxLength:10 @odata.IsUnbounded:false;
}

annotate sac.PurchaseOrderLineItems with {
    Description     @odata.Type:'Edm.String' @odata.MaxLength:256 @odata.IsUnbounded:false;
    createdAt  @odata.Type:'Edm.DateTime' @odata.MaxLength:10 @odata.IsUnbounded:false;
    modifiedAt  @odata.Type:'Edm.DateTime' @odata.MaxLength:10 @odata.IsUnbounded:false;
    LoadCreateTime  @odata.Type:'Edm.DateTime' @odata.MaxLength:10 @odata.IsUnbounded:false;
    LoadUpdateTime  @odata.Type:'Edm.DateTime' @odata.MaxLength:10 @odata.IsUnbounded:false;
    NeedByDate  @odata.Type:'Edm.DateTime' @odata.MaxLength:10 @odata.IsUnbounded:false;
    RetroEffectiveDate  @odata.Type:'Edm.DateTime' @odata.MaxLength:10 @odata.IsUnbounded:false;
    ServiceStartDate  @odata.Type:'Edm.DateTime' @odata.MaxLength:10 @odata.IsUnbounded:false;
    ServiceEndDate  @odata.Type:'Edm.DateTime' @odata.MaxLength:10 @odata.IsUnbounded:false;
    OrderedDate  @odata.Type:'Edm.DateTime' @odata.MaxLength:10 @odata.IsUnbounded:false;
}

/** Receipts */
annotate sac.Receipts with {
    Description     @odata.Type:'Edm.String' @odata.MaxLength:256 @odata.IsUnbounded:false;
    createdAt  @odata.Type:'Edm.DateTime' @odata.MaxLength:10 @odata.IsUnbounded:false;
    modifiedAt  @odata.Type:'Edm.DateTime' @odata.MaxLength:10 @odata.IsUnbounded:false;
    LoadCreateTime  @odata.Type:'Edm.DateTime' @odata.MaxLength:10 @odata.IsUnbounded:false;
    LoadUpdateTime  @odata.Type:'Edm.DateTime' @odata.MaxLength:10 @odata.IsUnbounded:false;
    ReceiptDate  @odata.Type:'Edm.DateTime' @odata.MaxLength:10 @odata.IsUnbounded:false;
    DateOfDelivery  @odata.Type:'Edm.DateTime' @odata.MaxLength:10 @odata.IsUnbounded:false;
}

/** Requisitions */
annotate sac.RequisitionLineItems with {
    Description     @odata.Type:'Edm.String' @odata.MaxLength:256 @odata.IsUnbounded:false;
    createdAt  @odata.Type:'Edm.DateTime' @odata.MaxLength:10 @odata.IsUnbounded:false;
    modifiedAt  @odata.Type:'Edm.DateTime' @odata.MaxLength:10 @odata.IsUnbounded:false;
    LoadCreateTime  @odata.Type:'Edm.DateTime' @odata.MaxLength:10 @odata.IsUnbounded:false;
    LoadUpdateTime  @odata.Type:'Edm.DateTime' @odata.MaxLength:10 @odata.IsUnbounded:false;
    RetroEffectiveDate  @odata.Type:'Edm.DateTime' @odata.MaxLength:10 @odata.IsUnbounded:false;
    ServiceStartDate  @odata.Type:'Edm.DateTime' @odata.MaxLength:10 @odata.IsUnbounded:false;
    ServiceEndDate  @odata.Type:'Edm.DateTime' @odata.MaxLength:10 @odata.IsUnbounded:false;
    ReqApprovedDate  @odata.Type:'Edm.DateTime' @odata.MaxLength:10 @odata.IsUnbounded:false;
    RequisitionDate  @odata.Type:'Edm.DateTime' @odata.MaxLength:10 @odata.IsUnbounded:false;
    HoldTillDate  @odata.Type:'Edm.DateTime' @odata.MaxLength:10 @odata.IsUnbounded:false;
    NeedByDate  @odata.Type:'Edm.DateTime' @odata.MaxLength:10 @odata.IsUnbounded:false;
}

/** Sourcing */
annotate sac.SourcingProjects with {
    Description         @odata.Type:'Edm.String' @odata.MaxLength:256 @odata.IsUnbounded:false;
    ResultsDescription  @odata.Type:'Edm.String' @odata.MaxLength:256 @odata.IsUnbounded:false;
    AwardJustification  @odata.Type:'Edm.String' @odata.MaxLength:256 @odata.IsUnbounded:false;
    createdAt  @odata.Type:'Edm.DateTime' @odata.MaxLength:10 @odata.IsUnbounded:false;
    modifiedAt  @odata.Type:'Edm.DateTime' @odata.MaxLength:10 @odata.IsUnbounded:false;
    LoadCreateTime  @odata.Type:'Edm.DateTime' @odata.MaxLength:10 @odata.IsUnbounded:false;
    LoadUpdateTime  @odata.Type:'Edm.DateTime' @odata.MaxLength:10 @odata.IsUnbounded:false;
    BeginDate  @odata.Type:'Edm.DateTime' @odata.MaxLength:10 @odata.IsUnbounded:false;
    DueDate  @odata.Type:'Edm.DateTime' @odata.MaxLength:10 @odata.IsUnbounded:false;
    EndDate  @odata.Type:'Edm.DateTime' @odata.MaxLength:10 @odata.IsUnbounded:false;
    ContractEffectiveDate  @odata.Type:'Edm.DateTime' @odata.MaxLength:10 @odata.IsUnbounded:false;
    PlannedStartDate  @odata.Type:'Edm.DateTime' @odata.MaxLength:10 @odata.IsUnbounded:false;
    PlannedEndDate  @odata.Type:'Edm.DateTime' @odata.MaxLength:10 @odata.IsUnbounded:false;
}

annotate sac.SourcingRequests with {
    Description         @odata.Type:'Edm.String' @odata.MaxLength:256 @odata.IsUnbounded:false;
    Currency            @odata.Type:'Edm.String' @odata.MaxLength:256 @odata.IsUnbounded:false;
    ResultsDescription  @odata.Type:'Edm.String' @odata.MaxLength:256 @odata.IsUnbounded:false;
    AwardJustification  @odata.Type:'Edm.String' @odata.MaxLength:256 @odata.IsUnbounded:false;
    createdAt  @odata.Type:'Edm.DateTime' @odata.MaxLength:10 @odata.IsUnbounded:false;
    modifiedAt  @odata.Type:'Edm.DateTime' @odata.MaxLength:10 @odata.IsUnbounded:false;
    LoadCreateTime  @odata.Type:'Edm.DateTime' @odata.MaxLength:10 @odata.IsUnbounded:false;
    LoadUpdateTime  @odata.Type:'Edm.DateTime' @odata.MaxLength:10 @odata.IsUnbounded:false;
    BeginDate  @odata.Type:'Edm.DateTime' @odata.MaxLength:10 @odata.IsUnbounded:false;
    DueDate  @odata.Type:'Edm.DateTime' @odata.MaxLength:10 @odata.IsUnbounded:false;
    EndDate  @odata.Type:'Edm.DateTime' @odata.MaxLength:10 @odata.IsUnbounded:false;
    ContractEffectiveDate  @odata.Type:'Edm.DateTime' @odata.MaxLength:10 @odata.IsUnbounded:false;
    PlannedStartDate  @odata.Type:'Edm.DateTime' @odata.MaxLength:10 @odata.IsUnbounded:false;
    PlannedEndDate  @odata.Type:'Edm.DateTime' @odata.MaxLength:10 @odata.IsUnbounded:false;
}

annotate sac.SupplierParticipations with {
    DeclinedReasonName      @odata.Type:'Edm.String' @odata.MaxLength:256 @odata.IsUnbounded:false;
    DeclinedComment         @odata.Type:'Edm.String' @odata.MaxLength:256 @odata.IsUnbounded:false;
    DeclineToRespondReason  @odata.Type:'Edm.String' @odata.MaxLength:256 @odata.IsUnbounded:false;
    createdAt  @odata.Type:'Edm.DateTime' @odata.MaxLength:10 @odata.IsUnbounded:false;
    modifiedAt  @odata.Type:'Edm.DateTime' @odata.MaxLength:10 @odata.IsUnbounded:false;
    LoadCreateTime  @odata.Type:'Edm.DateTime' @odata.MaxLength:10 @odata.IsUnbounded:false;
    LoadUpdateTime  @odata.Type:'Edm.DateTime' @odata.MaxLength:10 @odata.IsUnbounded:false;
    EventStartDate  @odata.Type:'Edm.DateTime' @odata.MaxLength:10 @odata.IsUnbounded:false;
    EventEndDate  @odata.Type:'Edm.DateTime' @odata.MaxLength:10 @odata.IsUnbounded:false;
    EstAwardDate  @odata.Type:'Edm.DateTime' @odata.MaxLength:10 @odata.IsUnbounded:false;
    ContractEffectiveDate  @odata.Type:'Edm.DateTime' @odata.MaxLength:10 @odata.IsUnbounded:false;
    EventCreateDate  @odata.Type:'Edm.DateTime' @odata.MaxLength:10 @odata.IsUnbounded:false;
    PreviewBeginDate  @odata.Type:'Edm.DateTime' @odata.MaxLength:10 @odata.IsUnbounded:false;
    BiddingStartDate  @odata.Type:'Edm.DateTime' @odata.MaxLength:10 @odata.IsUnbounded:false;
    BiddingEndDate  @odata.Type:'Edm.DateTime' @odata.MaxLength:10 @odata.IsUnbounded:false;
}

/** Suppliers */
annotate sac.SupplierRegistrationProjects with {
    Description      @odata.Type:'Edm.String' @odata.MaxLength:256 @odata.IsUnbounded:false;
    createdAt  @odata.Type:'Edm.DateTime' @odata.MaxLength:10 @odata.IsUnbounded:false;
    modifiedAt  @odata.Type:'Edm.DateTime' @odata.MaxLength:10 @odata.IsUnbounded:false;
    LoadCreateTime  @odata.Type:'Edm.DateTime' @odata.MaxLength:10 @odata.IsUnbounded:false;
    LoadUpdateTime  @odata.Type:'Edm.DateTime' @odata.MaxLength:10 @odata.IsUnbounded:false;
    BeginDate  @odata.Type:'Edm.DateTime' @odata.MaxLength:10 @odata.IsUnbounded:false;
    DueDate  @odata.Type:'Edm.DateTime' @odata.MaxLength:10 @odata.IsUnbounded:false;
    EndDate  @odata.Type:'Edm.DateTime' @odata.MaxLength:10 @odata.IsUnbounded:false;
    QuestionnaireSubmissionDate  @odata.Type:'Edm.DateTime' @odata.MaxLength:10 @odata.IsUnbounded:false;
    ReinviteDate  @odata.Type:'Edm.DateTime' @odata.MaxLength:10 @odata.IsUnbounded:false;
    ApprovedDate  @odata.Type:'Edm.DateTime' @odata.MaxLength:10 @odata.IsUnbounded:false;
    UpdateApprovedDate  @odata.Type:'Edm.DateTime' @odata.MaxLength:10 @odata.IsUnbounded:false;
    DeniedDate  @odata.Type:'Edm.DateTime' @odata.MaxLength:10 @odata.IsUnbounded:false;
    UpdateDeniedDate  @odata.Type:'Edm.DateTime' @odata.MaxLength:10 @odata.IsUnbounded:false;
}

annotate sac.Suppliers with {
    SupplierPublicName  @odata.Type:'Edm.String' @odata.MaxLength:256 @odata.IsUnbounded:false;
    ShortDescription    @odata.Type:'Edm.String' @odata.MaxLength:256 @odata.IsUnbounded:false;
    createdAt  @odata.Type:'Edm.DateTime' @odata.MaxLength:10 @odata.IsUnbounded:false;
    modifiedAt  @odata.Type:'Edm.DateTime' @odata.MaxLength:10 @odata.IsUnbounded:false;
}

annotate sac.Projects with {
    Description      @odata.Type:'Edm.String' @odata.MaxLength:256 @odata.IsUnbounded:false;
    createdAt  @odata.Type:'Edm.DateTime' @odata.MaxLength:10 @odata.IsUnbounded:false;
    modifiedAt  @odata.Type:'Edm.DateTime' @odata.MaxLength:10 @odata.IsUnbounded:false;
    LoadCreateTime  @odata.Type:'Edm.DateTime' @odata.MaxLength:10 @odata.IsUnbounded:false;
    LoadUpdateTime  @odata.Type:'Edm.DateTime' @odata.MaxLength:10 @odata.IsUnbounded:false;
}

annotate sac.ProjectTasks with {
    Description      @odata.Type:'Edm.String' @odata.MaxLength:256 @odata.IsUnbounded:false;
    createdAt  @odata.Type:'Edm.DateTime' @odata.MaxLength:10 @odata.IsUnbounded:false;
    modifiedAt  @odata.Type:'Edm.DateTime' @odata.MaxLength:10 @odata.IsUnbounded:false;
    LoadCreateTime  @odata.Type:'Edm.DateTime' @odata.MaxLength:10 @odata.IsUnbounded:false;
    LoadUpdateTime  @odata.Type:'Edm.DateTime' @odata.MaxLength:10 @odata.IsUnbounded:false;
}

annotate sac.ServicesProcurementWorkspaces with {
    Description      @odata.Type:'Edm.String' @odata.MaxLength:256 @odata.IsUnbounded:false;
    createdAt  @odata.Type:'Edm.DateTime' @odata.MaxLength:10 @odata.IsUnbounded:false;
    modifiedAt  @odata.Type:'Edm.DateTime' @odata.MaxLength:10 @odata.IsUnbounded:false;
    LoadCreateTime  @odata.Type:'Edm.DateTime' @odata.MaxLength:10 @odata.IsUnbounded:false;
    LoadUpdateTime  @odata.Type:'Edm.DateTime' @odata.MaxLength:10 @odata.IsUnbounded:false;
}

annotate sac.SPMProjects with {
    Description      @odata.Type:'Edm.String' @odata.MaxLength:256 @odata.IsUnbounded:false;
    createdAt  @odata.Type:'Edm.DateTime' @odata.MaxLength:10 @odata.IsUnbounded:false;
    modifiedAt  @odata.Type:'Edm.DateTime' @odata.MaxLength:10 @odata.IsUnbounded:false;
    LoadCreateTime  @odata.Type:'Edm.DateTime' @odata.MaxLength:10 @odata.IsUnbounded:false;
    LoadUpdateTime  @odata.Type:'Edm.DateTime' @odata.MaxLength:10 @odata.IsUnbounded:false;
}