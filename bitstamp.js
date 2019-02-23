/* 
 * This file ask for uptdated data to Binance API server. REST messages are 
 * based in Binance API Documentation available in: 
 * 
 * https://de.bitstamp.net/api/
 */
const https = require('https');
const util = require("./util.js");

exports.getInfoParaArbitraje = function (callback){
    
    getAllTickers(function(tickers){
        callback(darFormato(tickers));
    });
}

function getAllTickers(callback){
    /*
     * Esta función obtiene los tickers de todos los mercados indicados en 
     * marketNames
     */
    var marketNames = ["btcusd", "btceur", "eurusd", "xrpusd", "xrpeur", "xrpbtc", "ltcusd", "ltceur", "ltcbtc", "ethusd", "etheur", "ethbtc", "bchusd", "bcheur", "bchbtc"];
    
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
    //console.log("getTicker (Bitstamp)");
    var options = {
        hostname: 'www.bitstamp.net',
        path: '/api/v2/ticker/'+marketName,
        method: 'GET'
    };
    
    util.lanzarPeticion(options, function(response){
        response["market"] = marketName;
        callback(response);
    });
}

function darFormato(unform){
    /*
     * Esta función convierte la información recibida de la API en el formato
     * contemplado por nuestro programa.
     */
    var form = {};
    
    var lowCase = ["btcusd", "btceur", "eurusd", "xrpusd", "xrpeur", "xrpbtc", "ltcusd", "ltceur", "ltcbtc", "ethusd", "etheur", "ethbtc", "bchusd", "bcheur", "bchbtc"];
    var marketNames = ["BTCUSD", "BTCEUR", "EURUSD", "XRPUSD", "XRPEUR", "XRPBTC", "LTCUSD", "LTCEUR", "LTCBTC", "ETHUSD", "ETHEUR", "ETHBTC", "BCHUSD", "BCHEUR", "BCHBTC"];
    
    for(var i = 0; i <= unform.length-1; i++){
        var clave = marketNames[lowCase.indexOf(unform[i].market)];
        form[clave] = [parseFloat(unform[i].bid), parseFloat(unform[i].ask)];
    }
    return form;
}
    
/*
function getAllMarkets(callback){
    //console.log("getAllMarkets()");
    /*
     * Esta función obtiene información sobre todos los mercados disponibles en
     * bittrex en el momento de la ejecución. De ellos, nos interesa el nombre
     * de los mercados para poder obtener los tickers de los mismos
     
    var options = {
        hostname: 'www.bitstamp.net',
        path: '/api/v2/trading-pairs-info/',
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
     
    
    var marketNames = [];
    for(var i = 0; i <= marketsInfo.length-1; i++){
        var currencies = marketsInfo[i].name.split("/");
        marketNames.push(currencies[0]+currencies[1]);
    }
    return marketNames;
}*/