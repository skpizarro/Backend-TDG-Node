const qr = require('qr-image');
const upload = require('./qrUpload')

const generateQR = function(idQr, jsonData) {

    console.log(`->Create QR code ->For ${jsonData.user.nombre}`);

    var code = qr.imageSync(`Nombre:${jsonData.user.nombre}\nCorreo:${jsonData.user.email}\nID:${jsonData.user.cedula}\nQR id:${idQr}`, { type: 'png', size: 4, margin: 3 });

    upload.uploadQR(idQr, code);

    console.log('-QR-GENERATED-');
};

module.exports = {
    generateQR
}