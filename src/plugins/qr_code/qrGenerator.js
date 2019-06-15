const qr = require('qr-image');
var fs = require('fs');

function generateQR(data, jsonData) {
    console.log(`--------- create QR code -------------- for ${jsonData.nombre}`);

    var code = qr.image(data, { type: 'png', size: 8, margin: 3, });
    var output = fs.createWriteStream('./img/' + Date.now() + '.png')
    code.pipe(output);
};

module.exports = {
    generateQR
}