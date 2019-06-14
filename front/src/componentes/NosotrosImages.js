import React from "react";
import "../css/NosotrosImages.css";
import image2 from "../assets/img/granja1.jpg";
import image3 from "../assets/img/granja2.png";
import image4 from "../assets/img/granja3.png";
import image5 from "../assets/img/granja4.png";
import image9 from "../assets/img/granja8.jpg";
import image10 from "../assets/img/granja10.jpg";

const NosotrosImages = () => {
  return (
    <section className="section_nosotrosimg">
      <div className="section_container">
        <h2 className="nosotros_images">Imágenes</h2>
        <div className="images_container">
          <div className="container">
            <img src={image2} alt="" />
          </div>
          <div className="container">
            <img src={image3} alt="" />
          </div>
          <div className="container">
            <img src={image4} alt="" />
          </div>
          <div className="container">
            <img src={image5} alt="" />
          </div>
          <div className="container">
            <img src={image9} alt="" />
          </div>
          <div className="container">
            <img src={image10} alt="" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default NosotrosImages;
