namespace sap.ariba;
using { managed } from '@sap/cds/common';



/**
    Name:	                SMSurveyTemplateQuestionDim
    Class Name:	            ariba.analytics.Dimention.SMSurveyTemplateQuestionDim
    Description:	        SM Project
*/
entity SMSurveyTemplateQuestion_AN: managed  {
    key Realm                           : String(50);
    key QuestionId                      : String(255);
        AclId                           : Integer64;
        GroupItemCount                  : Integer;
        LevelId                         : Integer;
        OrderingNumber                  : Integer;
        ParentSectionId                 : String(255);
        QuestionDescription             : String(255);
        
        QuestionName                    : String(255);
        SectionDescriptionL1            : String(255);
        SectionDescriptionL2            : String(255);
        SectionIdL1                     : String(255);
        SectionIdL2                     : String(255);
        SectionNameL1                   : String(255);
        SectionNameL2                   : String(255);
        SourceSystem                    : String(100);
        TimeCreated                     : DateTime;
        TimeUpdated                     : DateTime;
        UpdateGroupCount                : Boolean;

}
