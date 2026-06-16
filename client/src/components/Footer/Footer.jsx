import "./Footer.css";

import {
  FaFacebookF,
  FaInstagram,
  FaWhatsapp
} from "react-icons/fa";

const Footer = () => {

  return (

    <footer className="footer">

      <div className="container footer-grid">

        <div className="footer-about">

          <h2>AYZAL</h2>

          <p>
            Freshly baked cakes, desserts and sweet memories
            crafted specially for your celebrations.
          </p>

        </div>

        <div className="footer-links">

          <h3>Quick Links</h3>

          <a href="/">Home</a>

          <a href="/cakes">Cakes</a>

          <a href="/desserts">Desserts</a>

          <a href="/cookies">Cookies</a>

        </div>

       <div className="footer-contact">

  <h3>Contact</h3>

  <p>
    Head Kasim Pur Farid Kanal Phase 2
    Near The Country Public School
    Multan
  </p>

  <p>
    +92 304 1011465
  </p>

  <a
    href="mailto:ayzalstudiooo@gmail.com"
    className="footer-email"
  >
    ayzalstudiooo@gmail.com
  </a>

</div>

        <div className="footer-socials">

          <h3>Follow Us</h3>

          <div className="social-icons">

            <FaFacebookF />

            <a
              href="https://www.instagram.com/ayzal_baking_studio?utm_source=qr&igsh=NmJ5aWo1ZWtlYm1q"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaInstagram />
            </a>

            <a
              href="https://wa.me/923041011465"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaWhatsapp />
            </a>

          </div>

        </div>

      </div>

      <div className="footer-bottom">

        <p>
          © 2026 Ayzal Baking Studio. All Rights Reserved.
        </p>

      </div>

    </footer>

  );
};

export default Footer;