"use strict";


const { default: axios } = require("axios");
const cds = require("@sap/cds");

const logger = require('./logger');

const flatten = require("flat");
const unflatten = require('flat').unflatten

const { Jobs, Job_File,ContractLineItems} = cds.entities('sap.ariba');



async function executeRequest(oRequestConfig,retries){
    //Execute Request with Retries
    return new Promise(async (resolve,reject)=>{    
        
        try{
            let res = await axios.request(oRequestConfig);
            resolve(res);
        }
        catch(error){
            //Rate limit hit            
            if (error.response.status == 429){
                //check appropriate rate limit
                let delay;
                if(error.response.headers["x-ratelimit-remaining-minute"] !='0' && error.response.headers["x-ratelimit-remaining-hour"] !='0' && 
                error.response.headers["x-ratelimit-remaining-day"] !='0'){delay=1000;}
                else if(error.response.headers["x-ratelimit-remaining-hour"] !='0' && error.response.headers["x-ratelimit-remaining-day"] !='0'){delay=60000;}
                else if(error.response.headers["x-ratelimit-remaining-day"] !='0'){delay=3600000;}
                

                if(retries-1>0 && delay){       
                    //delay until next execution
                    logger.warn(`API Rate limit error - retry in ${delay} ms. remaining retries : ${retries-1} details: ${error}`); 
                    //debug
                    //delay=3000;

                    await new Promise(resolve => setTimeout(resolve, delay));
                    try{
                        //recursive re-try                        
                        var res = await executeRequest(oRequestConfig,retries-1);                        
                        resolve(res);
                    }catch(e){
                        //What happens there???
                        reject(e);
                    }                    
                } else{
                    logger.error(`API Rate limit error - no reamining retries, call permanently failed `);;
                    
                    reject(error);
                }
            }else{
                //Generic API error
                logger.error(`Error while processing API call : ${error} `);
                reject(error);
            }
        }
           
    });
}

function cleanData (aCleaningProperties, oData, realm) {
    aCleaningProperties && aCleaningProperties.forEach(function (oCleaningProperty) {
        let cleanedValue = oData[oCleaningProperty] && Math.round((parseFloat(oData[oCleaningProperty]) + Number.EPSILON) * 1000) / 1000;
        oData[oCleaningProperty] = cleanedValue > 999999999999999? 999999999999999 : cleanedValue; //Double overflow check
    });
    oData.Realm = realm;
    return oData;
}

function processCustomFields(oDataCleansed){
    let iString =1;
    let iVector = 1;
    let iVectorItem=1;
    for (const [key, value] of Object.entries(oDataCleansed)) {
        if(key.startsWith("cus_") || key.startsWith("arb_")){
          
            //vector field 
            if(Array.isArray(value)){                
                value.forEach(e => {
                    for (const [k, v] of Object.entries(e)) {
                        let sV = (v && v.Day)?v.Day:(v==null)?null:v.toString();
                        oDataCleansed[`CusFieldVector${iVector}_${iVectorItem++}`] = {value:sV,name:`${key}_${k}`};
                        if(iVectorItem==5){break};//Limitation to 5 entries per vector (records x fields)
                    }
                });                
                iVector++;
                iVectorItem=1;
            }else{
            //value/pair fields
                let sValue = (value && value.Day)?value.Day:(value==null)?null:value.toString();            
                oDataCleansed[`CusField${iString++}`] = {value: sValue , name:key};
                
            }
            delete oDataCleansed[key];
        }
    }
    return oDataCleansed;
}

function deleteCustomFields(oDataCleansed){

    
    //Flatten structure
    let flat = flatten(oDataCleansed,{delimiter:'>',safe:false});

    for (const [key, value] of Object.entries(flat)) {
        if(key.includes("cus_")){
              delete flat[key];            
        }
    }

    //Unflat structure
    let unflat = unflatten(flat, { delimiter : ">", safe: false });

    return unflat;
   
}

function removeNullValues(oDataCleansed){

    //Flatten structure
    let flat = flatten(oDataCleansed,{delimiter:'>',safe:false});

    var keys = Object.keys( flat );

    for( var i = 0,length = keys.length; i < length; i++ ) {
        if(flat[ keys[ i ] ] == null)    {
            //Remove the null element from the JSON
            delete flat[keys[ i ]];
        }
    }

    //Unflat structure
    let unflat = unflatten(flat, { delimiter : ">", safe: false });

    return unflat;
}
module.exports = {
    executeRequest,
    processCustomFields,
    cleanData,
    removeNullValues,
    deleteCustomFields
}