namespace sap.ariba;
using { managed } from '@sap/cds/common';

using sap.ariba.type as types from '../../types';

/**
  Name:	                Project Info
    Class Name:	            ariba.analytics.dimension.ProjectInfo
*/

entity ProjectInfo_AN: managed,types.customFields   {
    key Realm               : String(50);
    key ProjectId           : String(50);

        ProjectName         : String(255);
        SourceSystem        : String(100);
        AclId               : String(50);
        TemplateName        : String(255);
        TemplateId          : String(50);
        ProjectTypeName     : String(255);
        ProjectTypeId       : String(255);
        TimeCreated         : DateTime;
        TimeUpdated         : DateTime;
}