import React from "react";
import NosotrosInfo from "./NosotrosInfo";
import NosotrosImages from "./NosotrosImages";
import NosotrosLocation from "./NosotrosLocation";
import "../css/Nosotros.css";


const Nosotros = () => {
  return (
    <div className="nosotros_container">
      <NosotrosInfo />
      <NosotrosImages />
      <NosotrosLocation/>
    </div>
  );
};

export default Nosotros;

