import React, { Component } from 'react';
import imageQR from '../assets/img/qr.jpeg';
import "../css/CodigoQR.css";

export default class CodigoQR extends Component {

    mostrarQR = () =>{
        const {nombre, apellido, id, email, celular, tipoPersona, fecha, motivoVisita } = this.props.usuarios;

        if(!nombre || !apellido || !id || !email || !celular || !tipoPersona || !fecha || !motivoVisita) return null;

        return(
                <div className="container-qr">
                    <img src={imageQR} alt="imagen qr"/>
                    <button className="qr_button">DESCARGAR IMAGEN</button>
                </div>
        )
    }
    render() {
        return (
            <div className="codigoqr">
                <div className="separador"></div>
                {this.mostrarQR()}
            </div>
        )
    }
}
