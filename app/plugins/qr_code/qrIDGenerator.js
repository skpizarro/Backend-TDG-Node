const generateIdQR = (data) => {
    const {id_solicitud,fecha_visita} = data;
    let idQr = `${id_solicitud.toString()}/${fecha_visita}`;
    return idQr;
    //idsolicitud/aaaa-mm-dd
}

const generateSpecialIdQR = (data) =>{
    const {id_solicitud} = data;
    let idQr = `${id_solicitud.toString()}/SpecialPermission`;
    return idQr;
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
    generateSpecialIdQR,
    generateCleanDate,
    generateCleanDateOnly,
    cleanDate
}