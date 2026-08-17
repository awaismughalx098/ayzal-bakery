import "./Footer.css";

import {
  FaFacebookF,
  FaInstagram,
  FaWhatsapp,
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaClock
} from "react-icons/fa";

import { Link } from "react-router-dom";

import logo from "../../assets/logo.png";

import {
  BRAND,
  CATEGORIES
} from "../../data/menu";

const Footer = () => {

  const year = new Date().getFullYear();

  return (

    <footer className="footer">

      <div className="container footer-grid">

        {/* ---- ABOUT ---- */}

        <div className="footer-about">

          <div className="footer-brand">

            <img
              src={logo}
              alt={BRAND.name}
            />

            <div>
              <h2>{BRAND.name}</h2>
              <span>{BRAND.tagline}</span>
            </div>

          </div>

          <p>
            Okara's own fast food spot. Zinger burgers,
            loaded fries, wings and wraps — all fresh,
            all hot, straight into the box.
          </p>

        </div>

        {/* ---- MENU LINKS ---- */}

        <div className="footer-links">

          <h3>Menu</h3>

          {
            CATEGORIES.map((cat) => (

              <Link
                to={cat.path}
                key={cat.slug}
              >
                {cat.name}
              </Link>

            ))
          }

        </div>

        {/* ---- CONTACT ---- */}

        <div className="footer-contact">

          <h3>Contact</h3>

          <a
            href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(BRAND.address)}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaMapMarkerAlt />
            <span>{BRAND.address}</span>
          </a>

          <a href={`tel:${BRAND.phoneDial}`}>
            <FaPhoneAlt />
            <span>Call Now</span>
          </a>

          <p className="footer-timing">
            <FaClock />
            <span>{BRAND.timing}</span>
          </p>

        </div>

        {/* ---- SOCIALS ---- */}

        <div className="footer-socials">

          <h3>Follow Us</h3>

          <div className="social-icons">

            <a
              href={BRAND.facebook}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook"
            >
              <FaFacebookF />
            </a>

            <a
              href={BRAND.instagram}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
            >
              <FaInstagram />
            </a>

            <a
              href={`https://wa.me/${BRAND.whatsapp}`}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="WhatsApp"
            >
              <FaWhatsapp />
            </a>

          </div>

          <a
            className="footer-order-btn"
            href={`tel:${BRAND.phoneDial}`}
          >
            Call To Order
          </a>

        </div>

      </div>

      <div className="footer-bottom">

        <div className="container footer-bottom-inner">

          <p>
            © {year} {BRAND.name}. All Rights Reserved.
          </p>

          <p className="footer-credit">
            Designed &amp; developed by
            {" "}
            <span>ByteNova Technologies</span>
          </p>

        </div>

      </div>

    </footer>

  );

};

export default Footer;
