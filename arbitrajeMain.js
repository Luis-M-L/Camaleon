/* 
 * Este es el script general para obtener información para arbitraje. Llamando a
 * main desde un módulo externo, devuelve el mercado y las casas en las que 
 * comprar y vender donde el margen relativo es mayor que el double indicado
 * como lowLim.
 */
const bbdd = require("./database/bbdd.js");
const util = require("./util.js");
const bitfinex = require("./bitfinex.js");
const binance = require("./binance.js");
const bittrex = require("./bittrex1.1.js");
const poloniex = require("./poloniex.js");
const bitstamp = require("./bitstamp.js");

exports.main = function(lowLim, callback){
    var tickers = {};

    // Cada elemento de flags se corresponde con un exchange, y toma el valor true
    // sólo cuando hemos recibido la información requerida a la API
    var flags = [false, false, false, false];
    //var flags = [false, false, false];

    binance.getInfoParaArbitraje(function(info){
        console.log(new Date().toString() + " Estoy de vuelta en main (Binance)");
        tickers["binance"] = info;
        poloniex.getInfoParaArbitraje(function(info){
            console.log(new Date().toString() + " Estoy de vuelta en main (Poloniex)");
            tickers["poloniex"] = info;
            /*bitstamp.getInfoParaArbitraje(function(info){
                console.log(new Date().toString() + " Estoy de vuelta en main (Bitstamp)");
                tickers["bitstamp"] = info;*/
                    bittrex.getInfoParaArbitraje(function(info){
                    console.log(new Date().toString() + " Estoy de vuelta en main (Bittrex)");
                    tickers["bittrex"] = info;
//------------------------------------------------------------------------------
                    guardarCompararYFiltrar(tickers, lowLim, function(mejMarg){
                        callback(mejMarg)
                    });
//------------------------------------------------------------------------------
                });
            //});
        });
    });

    
    
    

}

function guardarCompararYFiltrar(tickers, lowLim, callback){
    
    console.log("Tengo los datos, voy a ver si hay oportunidades.");
    bbdd.guardarTickers(tickers);
    var comparativa = compararExchanges(tickers);
    callback(filtrarMejoresMargenes(lowLim, comparativa));

}

function compararExchanges(tickers){
    var claves = Object.keys(tickers);
    var comparacion = {};
    
    // Recorro los exchanges, en cada iteración exchange[i] es la referencia
    for(var i = 0; i <= claves.length-1; i++){
        
        // Recorro los exchanges, en cada iteración exchange[n] es la comparada
        for(var n = 0; n <= claves.length-1; n++){
            // No comparo los exchanges consigo mismos
            if(!(i === n)){
                var dif = util.getDiferencias(tickers[claves[i]], tickers[claves[n]]);
                comparacion = util.actualizarComparacion(comparacion, dif, claves[i], claves[n]);
            }
        }
    }
    return comparacion;
}

function filtrarMejoresMargenes(lowLim, comparativa){
    /*
     * Esta función filtra el JSON comparativa, y devuelve un array JSON con
     * los movimientos que dan un margen mayor que lowLim
     */
    //console.log("comparativa", comparativa);
    var mejMarg = [];
    
    var mercados = Object.keys(comparativa);
    for(var m = 0; m <= mercados.length-1; m++){
        var currMarket = comparativa[mercados[m]];
        var casasCompra = Object.keys(currMarket);
        for(var i = 0; i <= casasCompra.length-1; i++){
            var currCasaCompra = currMarket[casasCompra[i]];
            var casasVenta = Object.keys(currCasaCompra);
            for(var n = 0; n <= casasVenta.length-1; n++){
                var margen = currCasaCompra[casasVenta[n]];
                var elem = {};
                if(margen > lowLim){
                    elem["mercado"] = mercados[m];
                    elem["casaCompra"] = casasCompra[i];
                    elem["casaVenta"] = casasVenta[n];
                    elem["margenPorcentual"] = margen;
                    mejMarg.push(elem);
                }
            }
        }
    }
    return mejMarg;
}