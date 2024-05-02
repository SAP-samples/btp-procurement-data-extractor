namespace sap.ariba;
/**
    Name:	                User
    Class Name:	            ariba.analytics.dimension.UserData

*/

entity UserData_AN {  
  key Realm                   : String(50);
  key UserId                         : String(255)             @description : 'User ID'                    ;  
  key PasswordAdapter                : String(50)              @description : 'Password Adapter'           ;  
  key SourceSystem                   : String(255)             @description : 'Source System'              ;  
      LocaleID                       : String(255)             @description : 'Locale ID'                  ;  
      CostCenter                     : String(255)             @description : 'Cost Center'                ;  
      CreationDate                   : DateTime                @description : 'Creation Date'              ;  
      ProcurementUnit                : String(50)              @description : 'Purchasing Unit'            ;  
      UserName                       : String(255)             @description : 'User'                       ;  
      IsActive                       : String(25)              @description : 'Active'                     ;  
      SupervisorId                   : String(255)             @description : 'Supervisor ID'              ;  
      SupervisorPasswordAdapter      : String(50)              @description : 'Supervisor Password Adapter';  
      ManagerNameL1                  : String(255)             @description : 'ManagerNameL1';  
      ManagerIdL1                    : String(50)              @description : 'ManagerIdL1';  
      ManagerPasswordAdapterL1       : String(50)              @description : 'ManagerPasswordAdapterL1';  
      ManagerNameL2                  : String(255)             @description : 'ManagerNameL2';  
      ManagerNameL3                  : String(255)             @description : 'ManagerNameL3';  
      ManagerNameL4                  : String(255)             @description : 'ManagerNameL4';  
      ManagerNameL5                  : String(255)             @description : 'ManagerNameL5';  
      ManagerNameL6                  : String(255)             @description : 'ManagerNameL6';  
      ManagerNameL7                  : String(255)             @description : 'ManagerNameL7';  
      ManagerNameL8                  : String(255)             @description : 'ManagerNameL8';  
      ManagerNameL9                  : String(255)             @description : 'ManagerNameL9';  
      ManagerNameL10                 : String(255)             @description : 'ManagerNameL10';  
      ManagerNameL11                 : String(255)             @description : 'ManagerNameL11';  
      ManagerNameL12                 : String(255)             @description : 'ManagerNameL12';  
      ManagerIdL2                    : String(50)              @description : 'ManagerIdL2';  
      ManagerIdL3                    : String(50)              @description : 'ManagerIdL3';  
      ManagerIdL4                    : String(50)              @description : 'ManagerIdL4';  
      ManagerIdL5                    : String(50)              @description : 'ManagerIdL5';  
      ManagerIdL6                    : String(50)              @description : 'ManagerIdL6';  
      ManagerIdL7                    : String(50)              @description : 'ManagerIdL7';  
      ManagerIdL8                    : String(50)              @description : 'ManagerIdL8';  
      ManagerIdL9                    : String(50)              @description : 'ManagerIdL9';  
      ManagerIdL10                   : String(50)              @description : 'ManagerIdL10';  
      ManagerIdL11                   : String(50)              @description : 'ManagerIdL11';  
      ManagerIdL12                   : String(50)              @description : 'ManagerIdL12';  
      ManagerPasswordAdapterL2       : String(50)              @description : 'ManagerPasswordAdapterL2';  
      ManagerPasswordAdapterL3       : String(50)              @description : 'ManagerPasswordAdapterL3';  
      ManagerPasswordAdapterL4       : String(50)              @description : 'ManagerPasswordAdapterL4';  
      ManagerPasswordAdapterL5       : String(50)              @description : 'ManagerPasswordAdapterL5';  
      ManagerPasswordAdapterL6       : String(50)              @description : 'ManagerPasswordAdapterL6';  
      ManagerPasswordAdapterL7       : String(50)              @description : 'ManagerPasswordAdapterL7';  
      ManagerPasswordAdapterL8       : String(50)              @description : 'ManagerPasswordAdapterL8';  
      ManagerPasswordAdapterL9       : String(50)              @description : 'ManagerPasswordAdapterL9';  
      ManagerPasswordAdapterL10      : String(50)              @description : 'ManagerPasswordAdapterL10';  
      ManagerPasswordAdapterL11      : String(50)              @description : 'ManagerPasswordAdapterL11';  
      ManagerPasswordAdapterL12      : String(50)              @description : 'ManagerPasswordAdapterL12';  
      TimeUpdated                    : DateTime               @description : 'Raw entity update time';    
      TimeCreated                    : DateTime               @description : 'Raw entity create time';
}