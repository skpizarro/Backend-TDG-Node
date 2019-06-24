const qr = require('qr-image');
const fs = require('fs');
const path = require("path");
const upload = require('./qrUpload')

const generateQR = function(idQr, jsonData) {

    var publicPath2 = path.join(process.cwd(), '../public');
    if (process.env.NODE_ENV === 'production') {
        publicPath2 = path.join(process.cwd(), './public');
    }

    console.log(`--------- create QR code -------------- for ${jsonData.user.nombre}`);

    var code = qr.imageSync(`Nombre:${jsonData.user.nombre}\nCorreo:${jsonData.user.email}\nID:${jsonData.user.cedula}\nID_QR:${idQr}`, { type: 'png', size: 4, margin: 3 });

    upload.uploadQR(idQr, code);

    console.log('- QR - DONE -');
};

module.exports = {
    generateQR
}