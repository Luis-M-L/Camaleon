/* 
 * This file ask for uptdated data to Bitfinex API server. REST messages are 
 * based in Bitfinex API Documentation available in: 
 * 
 * https://docs.bitfinex.com/v1/docs
 */

const util = require("./util.js");

exports.getInfoParaArbitraje = function (callback){
    getSymbols(function(symbols){
        getAllTickers(symbols, function(tickers){
            callback(darFormato(tickers));
            //callback(1);
        });
    });
}

function getSymbols(callback){
    var options = {
        hostname: 'api.bitfinex.com',
        path: '/v1/symbols',
        method: 'GET'
    };
    util.lanzarPeticion(options, function(response){
        callback(response);
    });
}

function getAllTickers(marketNames, callback){
    /*
     * Esta función obtiene los tickers de todos los mercados indicados en 
     * marketNames
     */
    console.log("getAllTickers() tardaré aprox.", marketNames.length*2, "segundos");
    var i = 0;
    var iMax = marketNames.length-1;
    var allTickers = [];
    
    getTicker(marketNames[i], callbackDeGetTicker = function(currTicker){
        allTickers.push(currTicker);
        if(i < iMax){
            i++;
            getTicker(marketNames[i], callbackDeGetTicker);
        }else{
            callback(allTickers);
        }
    });
}

function getTicker(par, callback){
    // Existe una limitación de 30req/min para este tipo de petición
    //console.log("getTicker()", queMili());
    var options = {
        hostname: 'api.bitfinex.com',
        path: '/v1/pubticker/'+par,
        method: 'GET'
    };
    
    util.espera(2200, function(){
        util.lanzarPeticion(options, function(response){
            response["symbol"] = par;
            callback(response);
        });
    });
}

function darFormato(unform){
    /*
     * Esta función convierte la información recibida de la API en el formato
     * contemplado por nuestro programa.
     */
    var form = {};
    
    for(var i = 0; i <= unform.length-1; i++){
        form[unform[i].symbol] = [unform[i].bid, unform[i].ask];
    }
    console.log("form", form); 
    return form;
}