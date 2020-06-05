const qr = require('qr-image');
const QRCode = require('qrcode');

const generateQR = async(idQr, userData,zonas) =>{
    try{
      const authorizedZones = zonas.filter(({permiso})=>{return permiso == 'Authorized'})
      let stringZones=""
      authorizedZones.map(({nombre_zona})=>{
        if(stringZones ==""){
          stringZones = `${nombre_zona}`
        }else{
          stringZones = `${stringZones}, ${nombre_zona}`
        }
      })
 
    console.log(`-> Create QR code -> For ${userData.nombre_usuario}`);
    
    if(idQr.includes("SpecialPermission")){
      const infoQr = `"ID":${userData.id_usuario},"Name":"${userData.nombre_usuario} ${userData.apellido_usuario}","Type":"${userData.tipo_usuario}","Email":"${userData.email_usuario}","QRid":"${idQr}","Authorized":"${stringZones}"`;
      //Tolerancia al error
      const code = await QRCode.toDataURL(infoQr)
      console.log('-QR-GENERATED WITH SPECIAL PERMISSION-');
    
    return ({qr:code, zones:stringZones});
    }else{
      const infoQr = `"ID":${userData.id_usuario},"Name":"${userData.nombre_usuario} ${userData.apellido_usuario}","Type":"${userData.tipo_usuario}","Email":"${userData.email_usuario}","QRid":"${idQr}","Authorized":"${stringZones}","DateVisit":"${userData.fecha_visita}"`;
      //Tolerancia al error
      const code = await QRCode.toDataURL(infoQr)
      console.log('-QR-GENERATED-');
    
      return ({qr:code, zones:stringZones});
    }
    
    //No es necesario almacenar los qr generados por que contienen informacion que ya existe en la base de datos
    // simplemente se enviaran por correo una vez generados y alli quedaran almacenados.   

    }catch(e){
      console.log('Error generateQR ',e)
    }  
};


module.exports = {
    generateQR
}