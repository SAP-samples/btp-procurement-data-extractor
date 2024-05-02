namespace sap.ariba;
using { managed, cuid } from '@sap/cds/common';

using sap.ariba.type as types from '../../types';


/*
    Name:	                Project Group
    Class Name:	            ariba.analytics.fact.ProjectGroup
    Description:	        Project Group
    Database Table Name:	FACT_PROJECT_GROUP
*/
entity ProjectGroup_AN: managed  {
    key Realm                   : String(50);
    key ProjectId               : String(50);
    key UniqueName              : String(255);

        LoadCreateTime          : DateTime;
        LoadUpdateTime          : DateTime;
        Name                    : String(255);
        MemberUniqueName        : String(50);
        MemberPasswordAdapter   : String(50);
        MemberName              : String(255);
        IsMemberActive          : Boolean;
        ProjectInfo             : types.projectInfo;
        AclId                   : Integer;
        BeginDate               : types.day;
        DueDate                 : types.day;
        EndDate                 : types.day;
}