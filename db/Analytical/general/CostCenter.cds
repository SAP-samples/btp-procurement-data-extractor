namespace sap.ariba;
/**
    Name:	                Cost Center
    Class Name:	            ariba.analytics.dimension.CostCenter

*/
entity CostCenter_AN {  
  key Realm                   : String(50);
  key CostCenterId        : String(255)        @description : 'Cost center ID'                             ;  
  key SourceSystem        : String(255)        @description : 'Source System'                              ;  
  key CompanyCode         : String(50)         @description : 'Company Code'                               ;  
      CostCenterName      : String(255)        @description : 'Cost Center'                                ;  
      ManagementL1        : String(100)        @description : 'ManagementL1';  
      ManagementL2        : String(100)        @description : 'ManagementL2';  
      ManagementL3        : String(100)        @description : 'ManagementL3';  
      ManagementL4        : String(100)        @description : 'ManagementL4';  
      ManagementL5        : String(100)        @description : 'ManagementL5';  
      ManagementL6        : String(100)        @description : 'ManagementL6';  
      ManagementL7        : String(100)        @description : 'ManagementL7';  
      ManagementL8        : String(100)        @description : 'ManagementL8';  
      TimeUpdated         : Timestamp          @description : 'Raw entity update time';  
      TimeCreated         : Timestamp          @description : 'Time Created';
}