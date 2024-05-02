namespace sap.ariba;
using { managed } from '@sap/cds/common';



/**
    Name:	                SurveyDim
    Class Name:	            ariba.analytics.Dimention.Survey
    Description:	        SM Project
*/
entity Survey_AN: managed  {
    key Realm                           : String(50);
    key SurveyId                        : String(255);
        AclId                           : Integer64;

        IsLastVersion                   : Boolean;
        SourceSystem                    : String(100);
        StationaryDescription           : String(1000);
        StationaryName                  : String(255);
        SurveyDescription               : String(255);
        SurveyName                      : String(255);
        SurveyStationaryId              : String(255);
        SurveyStatus                    : String(25);
        SurveyTemplateId                : String(50);
        TemplateDescription             : String(1000);
        TemplateName                    : String(255);
        TestSurvey                      : Boolean;
        TimeCreated                     : DateTime;
        TimeUpdated                     : DateTime;
        VersionNumber                   : Integer;

}
