/* 
 * This file ask for uptdated data to Poloniex API server. REST messages are 
 * based in Poloniex API Documentation available in: 
 * 
 * https://m.poloniex.com/support/api/
 */
const https = require("https");
const util = require("./util.js");

exports.getInfoParaArbitraje = function (callback){
    getTickers(function(tickers){
        callback(darFormato(tickers));
    });
}


function getTickers(callback){
    var options = {
        hostname: 'poloniex.com',
        path: '/public?command=returnTicker',
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
    
    var claves = Object.keys(unform);
    for(var i = 0; i <= claves.length -1; i++){
        var auxClave = claves[i].split("_");
        var clave = auxClave[1]+auxClave[0];
        form[clave] = [parseFloat(unform[claves[i]].highestBid), parseFloat(unform[claves[i]].lowestAsk)];
    }
    
    return form;
}