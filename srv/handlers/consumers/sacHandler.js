"use strict";

const cds = require("@sap/cds");

const sAnnotation = "@odata.MaxLength";
const sAnnotationType = "@odata.Type";
const sDateTimeType = "Edm.DateTime";
const sCutoffIndicator = "\u2026";


function handleAfterRead (aData, req) {
    let aAnnotatedElements = Object.entries(req.target.elements).filter(function(oElement) { return Object.prototype.hasOwnProperty.call(oElement[1], sAnnotation); });

    if ( aAnnotatedElements && aAnnotatedElements.length > 0 ) {
        aData.forEach(function (oData) {
            aAnnotatedElements.forEach(function (oAnnotatedElement) {
                let sAnnotatedElement = oAnnotatedElement[0];
                let iMaxLength = oAnnotatedElement[1][sAnnotation];
                if ( oData && oData[sAnnotatedElement] && oData[sAnnotatedElement].length > iMaxLength ) {
                    if(oAnnotatedElement[1] && oAnnotatedElement[1][sAnnotationType]==sDateTimeType){
                        oData[sAnnotatedElement] = oData[sAnnotatedElement].substr(0, iMaxLength);
                    }else{
                        oData[sAnnotatedElement] = oData[sAnnotatedElement].substr(0, iMaxLength-3) + sCutoffIndicator;
                    }
                }
            });
        });
    }
}


module.exports = {
    handleAfterRead
};