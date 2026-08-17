import "./Hero.css";

import { useNavigate } from "react-router-dom";

import {
  FaPhoneAlt,
  FaMapMarkerAlt,
  FaClock
} from "react-icons/fa";

import { BRAND } from "../../data/menu";

import heroImage from "../../assets/hero-slide1.jpg";

const Hero = () => {

  const navigate = useNavigate();

  return (

    <section className="hero">

      {/* BACKGROUND */}

      <div className="hero-bg">

        <img
          src={heroImage}
          alt="Munch Box"
          fetchPriority="high"
        />

      </div>

      <div className="hero-shade"></div>

      {/* CONTENT */}

      <div className="hero-inner container">

        <div className="hero-left">

          <p className="hero-tag">
            {BRAND.tagline}
          </p>

          <h1>
            Hot. Crispy.
            <br />
            <span>Straight</span> Outta
            <br />
            The Box.
          </h1>

          <p className="hero-desc">
            Zinger burgers, loaded fries, wings and wraps —
            all cooked fresh the moment you order.
            Okara&apos;s own fast food spot.
          </p>

          <div className="hero-buttons">

            <button
              className="btn-primary"
              onClick={() => navigate("/burgers")}
            >
              Order Now
            </button>

            <a
              href={`tel:${BRAND.phoneDial}`}
              className="btn-ghost hero-call"
            >
              <FaPhoneAlt />
              Call Now
            </a>

          </div>

          {/* QUICK INFO */}

          <div className="hero-info">

            <div className="hero-info-item">
              <FaMapMarkerAlt />
              <span>{BRAND.address}</span>
            </div>

            <div className="hero-info-item">
              <FaClock />
              <span>{BRAND.timing}</span>
            </div>

          </div>

        </div>

      </div>

    </section>

  );

};

export default Hero;
