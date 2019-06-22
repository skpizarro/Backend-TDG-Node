const qr = require('qr-image');
var fs = require('fs');
const path = require("path");
//const publicPath2 = path.join(process.cwd(), './public');

const generateQR = (data, jsonData) => {
    var publicPath2 = path.join(process.cwd(), '../public');
    if (process.env.NODE_ENV === 'production') {
        publicPath2 = path.join(process.cwd(), './public');
    }

    console.log(`--------- create QR code -------------- for ${jsonData.user.nombre}\nPUBLIC PATH: ${publicPath2}`);
    try {
        var code = qr.image(data, { type: 'png', size: 3, margin: 3, });
        var output = fs.createWriteStream(`${publicPath2}/${jsonData.user.nombre}.png`)
            // var output = fs.createWriteStream('./img/' + jsonData.user.nombre + '.png')
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