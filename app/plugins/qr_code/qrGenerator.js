const qr = require('qr-image');
var fs = require('fs');
const path = require("path");
const publicPath = path.resolve(process.cwd(), './public');

const generateQR = (data, jsonData) => {
    console.log(`--------- create QR code -------------- for ${jsonData.nombre}\n>>  almacenado en ${publicPath}`);
    try {
        var code = qr.image(data, { type: 'png', size: 3, margin: 3, });
        var output = fs.createWriteStream(`${publicPath}/${jsonData.nombre}.png`)
        code.pipe(output);
    } catch (e) {
        // res.writeHead(414, { 'Content-Type': 'text/html' });
        // res.end('<h1>414 Request-URI Too Large</h1>');
        console.log("ERROR HPTA EN EL QR");
        return false;
    }
    console.log('- QR - DONE -');
    return true;
};

module.exports = {
    generateQR
}