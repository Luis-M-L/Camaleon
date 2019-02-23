/* 
 * Here are utility functions for reusing them
 */

const https = require('https');

exports.lanzarPeticion = function(options, callback){
    //console.log("lanzarPeticion()");
    /* Esta función lanza la petición al servidor con las opciones indicadas por
     * el parámetro options y devuelve la respuesta convertida a un formato
     * manejable a través del callback
     */
    
    // Efectúo la petición y obtengo la respuesta
    var req = https.request(options, (res) => {
        //console.log("Request status:", res.statusCode);
        
        var body = "";
        // Si la respuesta es de datos, los acumulo
        res.on('data', (d) => {
            // Acumulo los segmentos (d) en la variable body
            body += d;
        });
        // Si ya he recibido todos los segmentos...
        res.on('end', () => {
            // Convierto body a JSON y lo devuelvo
            //console.log("body", body);
            callback(JSON.parse(body));
        });
    });
    
    // Si la respuesta es de error, lo muestro y cierro la petición
    req.on('error', (e) => {
        console.error(e);
        callback(false);
    });
    req.end();
}

exports.getDiferencias = function(casaReferencia, casaComparada){
    var dif = {}; 
    // Reducimos los cálculos a aquellos mercados disponibles en ambas casas
    var mercadosCompartidos = obtenerInterseccion(Object.keys(casaReferencia), Object.keys(casaComparada));
    
    // Recorremos los mercados compartidos...
    for(var i = 0; i <= mercadosCompartidos.length-1; i++){
        var precioCompra = casaReferencia[mercadosCompartidos[i]][1]; // ask
        var precioVenta = casaComparada[mercadosCompartidos[i]][0]; //bid
        
        // Guardando el margen porcentual referenciado al precio de compra en casaReferencia
        dif[mercadosCompartidos[i]] = 100*(precioVenta - precioCompra)/precioCompra;
    }
    //console.log("dif", dif);
    return dif;
}

function obtenerInterseccion(conj1, conj2){
    var interseccion = [];
    
    // Recorremos conj1 con i
    for(var i = 0; i <= conj1.length-1; i++){
        // Recorremos conj2 con n
        for(var n = 0; n <= conj2.length-1; n++){
            // Si un elemento está en ambos lo añadimos a la respuesta
            if(conj1[i] === conj2[n]){
                interseccion.push(conj1[i]);
            }
        }
    }
    
    return interseccion;
}

exports.actualizarComparacion = function(original, novedades, casaRef, casaComp){
    var clavesNovedades = Object.keys(novedades);
    for(var i = 0; i <= clavesNovedades.length-1; i++){
        var valor = novedades[clavesNovedades[i]];
        var claves = [clavesNovedades[i], casaRef, casaComp];
        
        // Si no existe el par...
        if(!original[claves[0]]){
            // ... lo creo
            original[claves[0]] = {};
        }
        // Si no existe casaRef para ese par...
        if(!original[claves[0]][claves[1]]){
            // ... la creo
            original[claves[0]][claves[1]] = {};
        }
        // Garantizada la existencia de las claves, le asigno el valor
        original[claves[0]][claves[1]][claves[2]] = valor;
    }
    return original;
}

exports.espera = function(timeOut, callback){
    var ahora = queMili();
    var timeOut = ahora + timeOut;
    var bol = true;
    while(bol){
        ahora = queMili();
        bol = ahora < timeOut;
        if(!bol){
            callback();
        }
    }
}

exports.queMili = function(){
    var d = new Date();
    return d.getTime();
}