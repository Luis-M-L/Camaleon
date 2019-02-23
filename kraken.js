/* 
 * This file ask for uptdated data to Binance API server. REST messages are 
 * based in Binance API Documentation available in: 
 * 
 * https://www.kraken.com/help/api

const https = require('https');
const util = require("./util.js");

exports.getInfoParaArbitraje = function (callback){
    obtenerParesDisponibles(function(pares){
        
    });
}

function obtenerParesDisponibles(callback){
    var options = {
        hostname: 'api.kraken.com',
        path: '/0/public/AssetPairs',
        method: 'POST'
    };
    
    util.lanzarPeticion(options, function(pares){
        callback(pares);
    });
} */