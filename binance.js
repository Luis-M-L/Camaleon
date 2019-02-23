/* 
 * This file ask for uptdated data to Binance API server. REST messages are 
 * based in Binance API Documentation available in: 
 * 
 * https://www.binance.com/restapipub.html#grip-content
 */
const https = require('https');
const util = require("./util.js");

exports.getInfoParaArbitraje = function (callback){
    comprobarStatus(function(status){
        if(status){
            getAllTickers(function(tickers){
                //console.log("Tickers: ", (tickers));
                callback(darFormato(tickers));
            });
        }else{
            console.log("not ok");
        }
    });
}

function comprobarStatus(callback){
    //console.log("comprobarStatus()");
    /*
     * Esta función comprueba que el servidor esté operativo
     */
    var options = {
        hostname: 'api.binance.com',
        path: '/api/v1/ping',
        method: 'GET'
    };
    
    util.lanzarPeticion(options, function(response){
        // util.lanzarPeticion devuelve false si hay un error y {} en caso contrario
        // para esta peticion
        callback(response);
    });
}

function getAllTickers(callback){
    //console.log("getAllTickers()");
    /*
     * Esta función obtiene los precios de todos los pares disponibles en 
     * Binance en el momento de ejecución.
     */
    var options = {
        hostname: 'api.binance.com',
        path: '/api/v1/ticker/allBookTickers',
        method: 'GET'
    };
    
    util.lanzarPeticion(options, function(response){
        callback(response);
    });
}

function darFormato(unform){
    /*
     * Esta función convierte la información recibida de la API en el formato
     * contemplado por nuestro programa.
     */
    var form = {};
    
    for(var i = 0; i <= unform.length-1; i++){
        form[unform[i].symbol] = [parseFloat(unform[i].bidPrice), parseFloat(unform[i].askPrice)];
    }
    
    return form;
}