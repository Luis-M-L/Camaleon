/* 
 * This file ask for uptdated data to Bitfinex API server. REST messages are 
 * based in Bitfinex API Documentation available in: 
 * 
 * https://docs.bitfinex.com/v2/docs
 */

const util = require("./util.js");
/*
comprobarStatus(callbackDeComprobarStatus = function(status){
    
    if(status){
        var pares = "tBTCUSD";
        getTickers(pares, function(tickers){
            
        });
        console.log(true);
    }else{
        console.log(false);
        // Esperar dos minutos y
        // comprobarStatus(callbackDeComprobarStatus)
    }
});*/

var pares = "BTCUSD";
getTickers(pares, function(tickers){
    
});

function comprobarStatus(callback){
    //console.log("comprobarStatus()");
    /* Esta función comprueba el estado del servidor antes de confiar en que 
     * éste funciona correctamente.
     */
    
    // Opciones de la petición REST
    var options = {
        hostname: 'api.bitfinex.com',
        path: '/v2/platform/status',
        method: 'GET'
    };
    
    util.lanzarPeticion(options, function(response){
        if(response.err){
            console.log(response.msg);
            callback(false);
        }else{
            // Servidor OK
            callback(true);
        }
    });
}

function getTickers(pares, callback){
    //console.log("getTickers()");
    /* Esta función obtiene información general sobre el estado de los pares
     * indicados.
     */
    var options = {
        hostname: 'api.bitfinex.com',
        path: '/v2/platform/tickers?symbols='+pares,
        method: 'GET'
    };
    console.log("path:", options.path);
    util.lanzarPeticion(options, function(response){
        console.log(response);
        callback(response);
    });
}