namespace sap.ariba;
/**
    Name:	                Invoice Exception Type
    Class Name:	            ariba.analytics.dimension.InvoiceExceptionType

*/
entity InvoiceExceptionType_AN {  
  key Realm                : String(50);
  key ExceptionTypeId       : String(255)       ; 
      ExceptionGeneral      : String(255)       ;  
      ExceptionType         : String(255)       ;  
      ExceptionLevel        : String(20)        ;  
      TimeUpdated           : Timestamp         ;  
      TimeCreated           : Timestamp         ;  

}