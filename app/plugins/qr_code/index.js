const qr_generate = require('./qrGenerator'); //tomo la funcion qrGenerator y la exporto
const qr_id_generate = require('./qrIDGenerator'); //tomo la funcion qrGenerator y la exporto


//plugin qr index para exportar funciones que tenga....
module.exports = {
    qr_generate,
    qr_id_generate
}