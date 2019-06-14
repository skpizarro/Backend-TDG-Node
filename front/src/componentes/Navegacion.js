import React from 'react'
import '../css/Navegacion.css';
import image from '../assets/img/logo-negro.png';
import {Link} from 'react-router-dom';


const Navegacion = () => {
    return ( 
        <nav className="navegacion">
            <img src={image} alt=""/>
                <ul className="header__lista">
                    <Link to="/Nosotros">
                        <li className="header__lista-item">Nosotros</li>
                    </Link>
                    <Link to="/Formulario">
                        <li className="header__lista-item">Formulario</li>
                    </Link>
                </ul>
        </nav>
     );
}
 
export default Navegacion;