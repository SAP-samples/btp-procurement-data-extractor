namespace sap.ariba;
/**
    Name:	                Company Code
    Class Name:	            ariba.analytics.dimension.CompanyCode

*/

entity CompanyCode_AN {  
  key Realm                   : String(50);
  key CompanyCodeId       : String(255)        @description : 'Company Code'                                ;  
      Variant             : String(255)        @description : 'Variant'                                     ;  
      Description         : String(4000)       @description : 'Company Code Description'                    ;  
      TimeUpdated         : Timestamp          @description : 'Raw entity update time';  
}