namespace sap.ariba;
using { managed } from '@sap/cds/common';

using sap.ariba.type as types from '../types';


/**
    Name:  Receipt
    Class Name:       ariba.analytics.fact.Receipt
    Description:       Receipt
    Database Table Name:   FACT_RECEIPT
*/

entity Receipt: managed ,types.customFields  {
        key ReceiptId: String(25);
        LoadCreateTime: DateTime;
        LoadUpdateTime: DateTime;
        
        SourceSystem: types.sourceSystem; 
        UnitNumber: Double;
        NumberPreviouslyAccepted: Double;
        NumberAccepted: Double;
        NumberPreviouslyRejected: Double;
        NumberRejected: Double;
        AmountPreviouslyAccepted: Double;
        AmountAccepted: Double;
        OrigCurrencyCode: String(10);
        OrigAmountAccepted: Double;
        AmountPreviouslyRejected: Double;
        AmountRejected: Double;
        OrigAmountRejected: Double;
        ReceiptDate: types.singleDate;
        Quantity: Double;
        ProcessedState: String(25);
        GrossAmountAccepted: Double;
        GrossAmountRejected: Double;
        OrderId: String(50);
        OrderTitle: String(50);
        ContractId: String(50);
        ContractTitle: String(50);
        ShippmentNoticeReference: String(50);
        ItemUnitPrice: Double;
        Contract: types.contract;
        LineItemNumber: Double;
        RLINumber: String(50);
        ReturnBy: String(50);
        GoodsReturnTrackingNumber: String(50);
        SerialNumber: String(50);
        TagNumber: String(50);
        Location: String(50);
        Requester: types.requester;
        ProcurementUnit: types.procurementUnit;
        Supplier: types.supplier;
        LineType: String(25);
        Description: String(1000);
        Part: types.part;
        NonCatalogSupplierPartNumber: String(255);
        NonCatalogSupplierPartAuxiliaryId: String(255);
        AssetDataNeeded: String(20);
        ProjectID: String(50);
        ProjectTitle: String(255);
        CloseOrder: Boolean;
        ERPReceiptNumber: String(50);
        SubContractor: String(25);
        DateOfDelivery: types.day;
        UnitPrice: Double;
        OrigUnitPrice: Double;
        TotalAmount: Double;
        OrigTotalAmount: Double;
    
    key Realm: String(25);
}