namespace sap.ariba;

using { managed } from '@sap/cds/common';
using { cuid } from '@sap/cds/common';

entity Jobs : managed {
    key jobId:                  String(100);
    key Realm:                  String(50);

    status:                     String(25);
    importStatus:               String(25) default 'stopped';
    createdDate:                String(20);
    completedDate:              String(20);
    pageToken:                  String(50);
    totalNumOfRecords:          Integer default 0;
    currentPageRecordsCount:    Integer default 0;
    totalNumOfPages:            Integer default 0;
    currentPageNum:             Integer default 0;

    //Source API Type
    apiType:                    String(50);

    // Analytical specific fields
    viewTemplateName:           String(100);
    documentType:               String(50);
    totalNumOfFiles:            Integer default 0;
    filesInCurrentPage:         Integer default 0;
    globalJobId:                String(50);
    files:                      Composition of many Job_File on files.jobId = $self;

    // SLP & Risk specific fields
    type:                       String enum { SLP; Risk; QNA; };
    filterCriteria:             String(1000);
    pages:                      Composition of many Job_Pages on pages.jobId = $self;

}

entity Job_File: managed,cuid    {
    key jobId:                  Association to Jobs;
    file:                       String(50);
    status:                     String(25) default 'stopped';
    totalNumOfRecords:          Integer default 0;
    error:                      String(5000);
}

entity Job_Pages: managed, cuid {
    key jobId:                  Association to Jobs;

    completedDate:              DateTime;
    pageToken:                  String(50);
    processingPosition:         Integer default 0;
    status:                     String(25) default 'stopped';
    totalNumOfRecords:          Integer default 0;
    error:                      String(500);
}
