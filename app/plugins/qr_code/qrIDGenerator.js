const generateIdQR = (jsonD) => {
    let fechastr = new Date().toISOString().replace('-', '').replace('.', '').replace('T', '').replace('Z', '').replace('-', '').replace(':', '').replace(':', '').slice(4, -3);
    let correo_split = jsonD.user.email.split('@')[0].slice();
    let idQr = correo_split + fechastr;
    return idQr;
}

const generateCleanDate = () => {
    let fechastr = new Date().toISOString().replace('-', '').replace('.', '').replace('T', '').replace('Z', '').replace('-', '').replace(':', '').replace(':', '').slice(4, -3);
    return fechastr;
}

/**
 * {"user":{"nombre":"cri","apellido":"grccs","cedula":"1111","email":"cristian_garces82121@elpoli.edu.co","celular":"333","tipoPersona":"estudiante","fecha":"2019-06-29","motivoVisita":"xxxxx"}}
 */

module.exports = {
    generateIdQR,
    generateCleanDate
}