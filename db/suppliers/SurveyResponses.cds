namespace sap.ariba;
using { managed, cuid } from '@sap/cds/common';

using sap.ariba.type as types from '../types';


/**    
        Name:	Survey Response
        Class Name:	ariba.analytics.fact.SurveyResponse
        Description:	Survey Response
        Database Table Name:	FACT_SURVEY_RESPONSE
*/
entity SurveyResponse: managed  {
    key Realm: String(50);
    key SurveyId: String(255);
    key SurveySourceSystem: String(100);
    key SurveyVersionNumber: Integer;
    key RespondentUserId: String(50);
    key RespondentPasswordAdapter: String(50);
    key RespondentSourceSystem: String(255);
    key QuestionId: String(255);
    key QuestionSourceSystem: String(100);

        Survey    : types.survey;
        Question  : types.question;
        Respondent : types.userdata;   
        LoadCreateTime: DateTime;
        LoadUpdateTime: DateTime;
        SourceSystem : types.sourceSystem;
        QuestionOrderNumber : Double;
        SurveyStartDate : types.singleDate;
        SurveyEndDate : types.singleDate;
        ReviewEndDate : types.singleDate;
        Project : types.srProject;
        Supplier : types.supplier;
        Contractor : types.contractor;
        Owner:types.userdata;
        IsInternalRespondent : Boolean;
        RespondentDepartment : types.organization;
        Scorecard : types.scorecard;
        KPI: types.scorecardKPI;
        IsQuantitative: Boolean;
        StringValue:String(1000);
        AclId:Double;
        BooleanValue:Boolean;
        DateValue:DateTime;
        QuantitativeCount:Double;
        Value:Double;
        Weight:Double;
        Target:Double;
        Grade:Double;
        SystemGrade:Double;

        Commodity: Composition of many SurveyResponse_Commodity on Commodity.SurveyResponse = $self;
        Region: Composition of many SurveyResponse_Region on Region.SurveyResponse = $self;
        Department: Composition of many SurveyResponse_Department on Department.SurveyResponse = $self;
        
        ResponseCommodityValue: Composition of many SurveyResponse_ResponseCommodityValue on ResponseCommodityValue.SurveyResponse = $self;
        ResponseRegionValue:  Composition of many SurveyResponse_ResponseRegionValue on ResponseRegionValue.SurveyResponse = $self;
        ResponseDepartmentValue:Composition of many SurveyResponse_ResponseDepartmentValue on ResponseDepartmentValue.SurveyResponse = $self;
        ResponseSupplierValue: Composition of many SurveyResponse_ResponseSupplierValue on ResponseSupplierValue.SurveyResponse = $self;
        ResponseUserValue: Composition of many SurveyResponse_ResponseUserValue on ResponseUserValue.SurveyResponse = $self;
        V_responsetextmultivalue: Composition of many SurveyResponse_V_responsetextmultivalue on V_responsetextmultivalue.SurveyResponse = $self;
       

}

entity SurveyResponse_Commodity: cuid {
    Commodity                   : types.commodity;
    SurveyResponse : Association to SurveyResponse;
}

entity SurveyResponse_Region:  cuid {
    Region                      : types.region;
    SurveyResponse : Association to SurveyResponse;
}

entity SurveyResponse_Department:  cuid {
    Department                : types.organization;
    SurveyResponse : Association to SurveyResponse;
}
entity SurveyResponse_ResponseCommodityValue: cuid {
    ResponseCommodityValue  : types.commodity;
    SurveyResponse : Association to SurveyResponse;
}

entity SurveyResponse_ResponseRegionValue:  cuid {
    ResponseRegionValue: types.region;
    SurveyResponse : Association to SurveyResponse;
}

entity SurveyResponse_ResponseDepartmentValue:  cuid {
    ResponseDepartmentValue: types.organization;
    SurveyResponse : Association to SurveyResponse;
}

entity SurveyResponse_ResponseSupplierValue:  cuid {
    ResponseSupplierValue: types.supplier;
    SurveyResponse : Association to SurveyResponse;
}

entity SurveyResponse_ResponseUserValue:  cuid {
    ResponseUserValue: types.userdata;
    SurveyResponse : Association to SurveyResponse;
}
entity SurveyResponse_V_responsetextmultivalue:  cuid {
    V_responsetextmultivalue: String(255) default '';
    SurveyResponse : Association to SurveyResponse;
}