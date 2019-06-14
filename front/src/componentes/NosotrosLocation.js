import React from "react";
import "../css/NosotrosLocation.css";

const NosotrosLocation = () => {
  return (
    <section className="section_nosotrosloc">
      <div className="section_container">
        <h2>Ubicación</h2>
        <div className="nosotros_location">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3966.509385576265!2d-75.34100248562747!3d6.196321495514284!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8e46a0019b18635b%3A0x52d81a9237700c8f!2sGranja+Roman+Gomez+Gomez!5e0!3m2!1ses!2sco!4v1558620098648!5m2!1ses!2sco"
            width="600"
            height="450"
            frameBorder="0"
            style={{ border: "0" }}
            allowFullScreen
            title="Maps"
          />
        </div>
      </div>
    </section>
  );
};

export default NosotrosLocation;
