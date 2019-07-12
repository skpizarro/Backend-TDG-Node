const generateIdQR = (jsonD) => {
    let fechastr = new Date().toISOString().replace('-', '').replace('.', '').replace('T', '').replace('Z', '').replace('-', '').replace(':', '').replace(':', '').slice(4, -3);
    let correo_split = jsonD.user.email.split('@')[0].slice();
    let idQr = correo_split + fechastr;
    return idQr;
    //emailmmddhhmmss
}

const generateCleanDate = () => {
    return new Date().toISOString().replace('-', '').replace('.', '').replace('T', '').replace('Z', '').replace('-', '').replace(':', '').replace(':', '').slice(4, -3);
    //0629221401 - mmddhhmmss
}

const generateCleanDateOnly = () => {
    let date = new Date().toISOString().replace('-', '').replace('.', '').replace('T', '').replace('Z', '').replace('-', '').replace(':', '').replace(':', '').slice(4, -9);
    date = parseInt(date);
    return date;
    //0711231401 - mmdd - 712
}

const cleanDate = (fecha) => {
    fecha = fecha.replace('-', '').replace('-', '').slice(5);
    fecha = parseInt(fecha);
    return fecha;
    //2019-07-23 => 20190723 => 0723 mmdd - 907
}

module.exports = {
    generateIdQR,
    generateCleanDate,
    generateCleanDateOnly,
    cleanDate
}