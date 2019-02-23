const express = require("express");
const elServidor = express();
const main = require("./arbitrajeMain.js");

elServidor.get("/", function(req, res){
    console.log(new Date().toString() + " Recibi petición");
    main.main(1, function(bidAskPrices){
        console.log(new Date().toString() + " Respondo:", bidAskPrices);
        res.send();
    });
});

elServidor.listen(8080);
console.log(new Date().toString() + " Escuchando puerto 8080...");
