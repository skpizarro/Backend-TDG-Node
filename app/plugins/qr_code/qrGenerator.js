const qr = require('qr-image');
var fs = require('fs');

function generateQR(data, jsonData) {
    console.log(`--------- create QR code -------------- for ${jsonData.nombre}`);

    var code = qr.image(data, { type: 'png', size: 4, margin: 3, });
    var output = fs.createWriteStream('./img/' + Date.now() + '.png')
    code.pipe(output);

    console.log('- QR - DONE -');
};

module.exports = {
    generateQR
}