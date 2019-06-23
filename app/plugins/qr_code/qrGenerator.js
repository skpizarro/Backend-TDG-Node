const qr = require('qr-image');
var fs = require('fs');
const path = require("path");
/**
 * {"user":{"nombre":"cri","apellido":"grccs","cedula":"1111","email":"cristian_garces82121@elpoli.edu.co","celular":"333","tipoPersona":"estudiante","fecha":"2019-06-29","motivoVisita":"xxxxx"}}
 */

const generateQR = (idQr, jsonData) => {

    var publicPath2 = path.join(process.cwd(), '../public');
    if (process.env.NODE_ENV === 'production') {
        publicPath2 = path.join(process.cwd(), './public');
    }

    console.log(`--------- create QR code -------------- for ${jsonData.user.nombre}\nPUBLIC PATH: ${publicPath2}`);
    try {
        var code = qr.image(`Correo:${jsonData.user.email}\nID:${jsonData.user.cedula}\nID_QR:${idQr}`, { type: 'png', size: 4, margin: 3, });
        var output = fs.createWriteStream(`${publicPath2}/${idQr}.png`)
        code.pipe(output);
    } catch (e) {
        // res.writeHead(414, { 'Content-Type': 'text/html' });
        // res.end('<h1>414 Request-URI Too Large</h1>');
        console.log("ERROR HPTA EN EL QR");
        //return false;
    }
    console.log('- QR - DONE -');
    // return true;
};

module.exports = {
    generateQR
}