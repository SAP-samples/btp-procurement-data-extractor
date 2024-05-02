namespace sap.ariba;
/**
    Name:	                Event Type
    Class Name:	            ariba.analytics.dimension.EventType

*/
entity EventType_AN {  
  key Realm                   : String(50);
  key EventType           : String(20)         @description : 'EventType';  
      Domain              : String(20)         @description : 'Domain';  
      SystemType          : String(20)         @description : 'System Type';  
      EventTypeName       : String(255)        @description : 'EventType';  
      TimeUpdated         : Timestamp          @description : 'Raw entity update time';    
      TimeCreated         : Timestamp          @description : 'Time Created';
}