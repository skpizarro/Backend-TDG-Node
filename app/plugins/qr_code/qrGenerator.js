const qr = require('qr-image');
var fs = require('fs');

function generateQR(data, jsonData) {
    console.log(`--------- create QR code -------------- for ${jsonData.nombre}`);
    try {
        var code = qr.image(data, { type: 'png', size: 3, margin: 3, });
        var output = fs.createWriteStream('./app/img/' + jsonData.nombre + '.png')
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