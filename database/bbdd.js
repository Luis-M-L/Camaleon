/* 
 * Aquí encontramos las funciones javascript para introducir y leer datos de la
 * base de datos MySQL
 */
const util = require("../util.js");
const mysql = require("mysql");
const laDatabase = mysql.createConnection(
        {
            host    :   "localhost",
            user    :   "test",
            password:   "test_pass",
            database:   "Camaleon"
        }
    );
laDatabase.connect();
    
exports.guardarTickers = function(tickers){
    console.log("Guardar tickers");
    var timest = util.queMili();
    var exchanges = Object.keys(tickers);
    for(var i = 0; i <= exchanges.length-1; i++){
        var markets = Object.keys(tickers[exchanges[i]]);
        for(var n = 0; n <= markets.length-1; n++){
            var casa = exchanges[i];
            var mercado = markets[n];
            var bidPrice = tickers[casa][mercado][0];
            var askPrice = tickers[casa][mercado][0];
            var orden = "INSERT INTO BidAsk VALUES("+timest+", "+bidPrice+", "+askPrice+", '"+casa+"', '"+mercado+"');";
            //console.log("orden", orden);
            laDatabase.query(orden, function(err, rows, fields){
                if(err) throw err;
                if(i === exchanges.length-1 && n === markets.length-1){
                    laDatabase.end();
                }
            });
        }
    }
}
