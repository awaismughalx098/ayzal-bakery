import "./WhatsAppButton.css";

import {
  FaWhatsapp
}
from "react-icons/fa";

const WhatsAppButton = () => {

  return(

    <a
      href="https://wa.me/923041011465"
      target="_blank"
      rel="noopener noreferrer"
      className="whatsapp-btn"
    >

      <FaWhatsapp />

    </a>

  );

};

export default WhatsAppButton;