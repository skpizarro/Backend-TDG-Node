const generateIdQR = (jsonD) => {
    let fechastr = new Date().toISOString().replace('-', '').replace('.', '').replace('T', '').replace('Z', '').replace('-', '').replace(':', '').replace(':', '').slice(4, -3);
    let correo_split = jsonD.user.email.split('@')[0].slice();
    let idQr = correo_split + fechastr;
    return idQr;
    //emailmmddhhmmss
}

const generateCleanDate = () => {
    let fechastr = new Date().toISOString().replace('-', '').replace('.', '').replace('T', '').replace('Z', '').replace('-', '').replace(':', '').replace(':', '').slice(4, -3);
    return fechastr;
    //0629221401 - mmddhhmmss
}

module.exports = {
    generateIdQR,
    generateCleanDate
}