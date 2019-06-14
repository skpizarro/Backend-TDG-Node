import React from "react";
import Navegacion from "./Navegacion";
import Nosotros from "./Nosotros";
import Formulario from "./Formulario";

import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

const Header = ({agregarUsuario,usuarios}) => {
  return (
    <Router>
      <header>
        <Navegacion/>
        <Switch>
          <Route path="/" exact component={Nosotros}/>
          <Route path="/Nosotros"  component={Nosotros} />
          <Route path="/Formulario"  render={()=>(
            <Formulario
             agregarUsuario = {agregarUsuario}
             usuarios={usuarios}
            />
          )}/>
        </Switch>
      </header>
    </Router>
  );
};

export default Header;
