import Header from "./componentes/Header";
import Footer from "./componentes/Footer";
import './css/App.css';

import React, { Component } from "react";

export default class App extends Component {
 state = {
     usuarios: {}
 }

 agregarUsuario = usuario => {
    const usuarios = usuario;

    //Ponerlo en el state
    this.setState({
        usuarios
    })

    console.log(usuarios);

 }

  render() {
    return (
      <div className="App">
        <Header 
        agregarUsuario = {this.agregarUsuario}
        usuarios = {this.state.usuarios}
        />
        <Footer />
      </div>
    );
  }
}
