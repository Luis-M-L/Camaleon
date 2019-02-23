const util = require("./util.js");
const main = require("./arbitrajeMain.js");

main.main(1, callbackDeMain = function(res){
    console.log(1, res);
    main.main(1, callbackDeMain);
});