import React, { Component } from "react";
import CodigoQR from "./CodigoQR";
import "../css/Formulario.css";

export default class Formulario extends Component {
  //Manejo de los datos del formulario

  //1. Crear los Refs y enlazarlos a los campos
  nombreRef = React.createRef();
  apellidoRef = React.createRef();
  idRef = React.createRef();
  emailRef = React.createRef();
  celularRef = React.createRef();
  tipoPersonaRef = React.createRef();
  fechaRef = React.createRef();
  motivoVisitaRef = React.createRef();

  //2. Crear la funcion que se ejecuta al enviar el Form
  capturarInfo = e => {
    e.preventDefault();

    //3. Crear el objeto
    const usuario = {
      nombre: this.nombreRef.current.value,
      apellido: this.apellidoRef.current.value,
      id: this.idRef.current.value,
      email: this.emailRef.current.value,
      celular: this.celularRef.current.value,
      tipoPersona: this.tipoPersonaRef.current.value,
      fecha: this.fechaRef.current.value,
      motivoVisita: this.motivoVisitaRef.current.value
    };

    //  ---- CREAR REQUEST
    //headers
    var myHeaders = new Headers();
    myHeaders.append('Content-Type', 'application/json');

    //request config
    var myInit = {
      method: 'POST',
      body: JSON.stringify(usuario),
      headers: myHeaders,
      mode: 'cors',
      cache: 'default'
    };
    var myRequest = new Request('http://localhost:8080/api/users', myInit);

    //enviar request
    fetch(myRequest).then(function (response) {
      return response.json();
    }).then(function (myJson) {
      console.log(myJson);
    });

      /*
    .then(res => res.json())
    .catch(error => console.error('Error:', error))
  
    .then(response => console.log('Success:', response));
    */

   // ---- FIN REQUEST 

    //4. Enviarlo al componente principal
    this.props.agregarUsuario(usuario);
    //Resetear el form
    e.currentTarget.reset();
  };

  render() {
    return (
      <div>
        <form className="formulario" onSubmit={this.capturarInfo}>
          <div className="contenedor">
            <label>Nombres</label>
            <input
              required
              type="text"
              name="nombre"
              className="input_nombre"
              ref={this.nombreRef}
            />
          </div>

          <div className="contenedor">
            <label>Apellidos</label>
            <input
              //required
              type="text"
              name="apellido"
              className="input_apellido"
              ref={this.apellidoRef}
            />
          </div>

          <div className="contenedor">
            <label>Documento de identidad</label>
            <input
              required
              type="number"
              name="cedula"
              className="input_cedula"
              ref={this.idRef}
            />
          </div>

          <div className="contenedor">
            <label>Correo</label>
            <input
              required
              type="email"
              name="email"
              className="input_email"
              ref={this.emailRef}
            />
          </div>

          <div className="contenedor">
            <label>Celular</label>
            <input
              //required
              type="number"
              name="celular"
              className="input_celular"
              ref={this.celularRef}
            />
          </div>

          <div className="contenedor">
            <label>Tipo de persona</label>
            <select
              //required
              name="tipopersona"
              className="select_tipopersona"
              ref={this.tipoPersonaRef}
            >
              <option value="vacio">Elige una opción</option>
              <option value="estudiante">Estudiante</option>
              <option value="empleado">Empleado</option>
              <option value="visitante">Visitante</option>
            </select>
          </div>
          <div className="contenedor">
            <label>Fecha de la visita</label>
            <input
              required
              type="date"
              name="fecha"
              className="input_date"
              ref={this.fechaRef}
            />
          </div>
          <div className="contenedor">
            <label>Motivo de la visita</label>
            <textarea
              name="motivovisita"
              cols="30"
              rows="3"
              className="textarea_motivo"
              ref={this.motivoVisitaRef}
            />
          </div>

          <button type="submit" className="formulario__boton">
            Enviar generar QR
          </button>
        </form>
        <CodigoQR
          usuarios={this.props.usuarios}
        />
      </div>
    );
  }
}
