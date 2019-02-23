/* 
 * This file ask for uptdated data to Bittrex API server. REST messages are 
 * based in Bittrex API Documentation available in: 
 * 
 * https://bittrex.com/home/api
 */
const https = require("https");
const util = require("./util.js");

exports.getInfoParaArbitraje = function (callback){
    getAllMarkets(function(response){
        if(response.success){
            var marketNames = getMarketNames(response.result);
            getAllTickers(marketNames, function(tickers){
                callback(darFormato(tickers));
            });
        }else{
            console.log("Hubo un problema al obtener los mercados disponibles en bittrex");
        }
    });
}

function getAllMarkets(callback){
    //console.log("getAllMarkets()");
    /*
     * Esta función obtiene información sobre todos los mercados disponibles en
     * bittrex en el momento de la ejecución. De ellos, nos interesa el nombre
     * de los mercados para poder obtener los tickers de los mismos
     */
    var options = {
        hostname: 'bittrex.com',
        path: '/api/v1.1/public/getmarkets',
        method: 'GET'
    };
    
    util.lanzarPeticion(options, function(response){
        callback(response);
    });
}

function getMarketNames(marketsInfo){
    /*
     * Esta función extrae los nombres de los mercados activos de la respuesta del 
     * servidor con todos los datos de los mercados disponibles
     */
    
    var marketNames = [];
    for(var i = 0; i <= marketsInfo.length-1; i++){
        if(marketsInfo[i].IsActive){
            marketNames.push(marketsInfo[i].MarketName);
        }
    }
    return marketNames;
}

function getAllTickers(marketNames, callback){
    /*
     * Esta función obtiene los tickers de todos los mercados indicados en 
     * marketNames
     */
    //console.log("getAllTickers()");
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

function getTicker(marketName, callback){
    /*
     * Esta función pide al servidor de Bittrex la información de bid y ask del
     * par indicado por marketName
     */
    //console.log("getTicker() (Bittrex)");
    var options = {
        hostname: 'bittrex.com',
        path: '/api/v1.1/public/getticker?market='+marketName,
        method: 'GET'
    };
    util.lanzarPeticion(options, function(response){
        if(response.success){
            var ticker = response.result;
            ticker["market"] = marketName;
            callback(ticker);
        }else{
            console.log("Error al obtener el ticker de", marketName);
        }
    });
}

function darFormato(unform){
    /*
     * Esta función convierte la información recibida de la API en el formato
     * contemplado por nuestro programa.
     */
    var form = {};
    
    for(var i = 0; i <= unform.length-1; i++){
        var auxClave = unform[i].market.split("-");
        var clave = auxClave[1]+auxClave[0];
        form[clave] = [unform[i].Bid, unform[i].Ask];
    }
    return form;
}