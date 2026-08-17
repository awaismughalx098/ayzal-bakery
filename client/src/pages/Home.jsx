import "./Home.css";

import { useNavigate } from "react-router-dom";

import {
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaWhatsapp,
  FaMotorcycle,
  FaFire,
  FaLeaf,
  FaStopwatch
} from "react-icons/fa";

import Navbar from "../components/Navbar/Navbar";
import Hero from "../components/Hero/Hero";
import Categories from "../components/Categories/Categories";
import Featured from "../components/Featured/Featured";
import Footer from "../components/Footer/Footer";
import Seo from "../seo/Seo";

import {
  BRAND,
  CATEGORIES
} from "../data/menu";

import { useProducts } from "../hooks/useProducts";

const PERKS = [
  {
    icon: <FaFire />,
    title: "Made To Order",
    text: "Every item is cooked fresh once your order comes in."
  },
  {
    icon: <FaStopwatch />,
    title: "Fast Service",
    text: "Average wait at the counter is just 10–12 minutes."
  },
  {
    icon: <FaMotorcycle />,
    title: "Home Delivery",
    text: "Hot delivery to your door anywhere in Okara city."
  },
  {
    icon: <FaLeaf />,
    title: "Fresh Chicken",
    text: "Fresh chicken daily and clean cooking oil, always."
  }
];

const Home = () => {

  const navigate = useNavigate();

  /* Menu board is built from whatever the admin
     has added — nothing is hardcoded. */

  const { products } = useProducts();

  const menuGroups = CATEGORIES
    .map((cat) => ({
      ...cat,
      items: products.filter(
        (item) =>
          item.category &&
          item.category.toLowerCase() === cat.slug
      )
    }))
    .filter((group) => group.items.length > 0);

  return (

    <>

      <Seo page="home" />

      <Navbar />

      <Hero />

      {/* ============ PERKS ============ */}

      <section className="perks">

        <div className="container perks-grid">

          {
            PERKS.map((perk) => (

              <div
                className="perk-card"
                key={perk.title}
              >

                <div className="perk-icon">
                  {perk.icon}
                </div>

                <h3>{perk.title}</h3>

                <p>{perk.text}</p>

              </div>

            ))
          }

        </div>

      </section>

      {/* ============ CATEGORIES ============ */}

      <Categories />

      {/* ============ CATEGORY SHOWCASE ============ */}

      <section className="showcase">

        <div className="container">

          <div className="section-head-line">

            <span>What We Serve</span>

            <h2>Pick Your Craving</h2>

            <p>
              From burgers to loaded fries — everything
              in one box.
            </p>

          </div>

          <div className="showcase-grid">

            {
              CATEGORIES.map((cat) => (

                <button
                  className="showcase-card"
                  key={cat.slug}
                  onClick={() => navigate(cat.path)}
                >

                  <img
                    src={cat.image}
                    alt={cat.name}
                    loading="lazy"
                  />

                  <div className="showcase-overlay">

                    <span>{cat.label}</span>

                    <h3>{cat.name}</h3>

                    <p>{cat.blurb}</p>

                  </div>

                </button>

              ))
            }

          </div>

        </div>

      </section>

      {/* ============ FEATURED (BACKEND) ============ */}

      <Featured />

      {/* ============ FULL MENU ============ */}

      {
        menuGroups.length > 0 && (

          <section className="menu-board">

            <div className="container">

              <div className="section-head-line menu-board-head">

                <span>Rate List</span>

                <h2>The Full Menu</h2>

                <p>
                  All prices are in Pakistani Rupees.
                </p>

              </div>

              <div className="menu-columns">

                {
                  menuGroups.map((group) => (

                    <div
                      className="menu-block"
                      key={group.slug}
                    >

                      <div className="menu-block-head">

                        <h3>{group.name}</h3>

                        <button
                          onClick={() => navigate(group.path)}
                        >
                          See all
                        </button>

                      </div>

                      <ul className="menu-list">

                        {
                          group.items.map((item) => (

                            <li key={item._id}>

                              <span className="menu-item-name">
                                {item.title}
                              </span>

                              <span className="menu-dots"></span>

                              <span className="menu-item-price">
                                Rs {item.price}
                              </span>

                            </li>

                          ))
                        }

                      </ul>

                    </div>

                  ))
                }

              </div>

            </div>

          </section>

        )
      }

      {/* ============ VISIT / CONTACT ============ */}

      <section className="visit">

        <div className="container visit-inner">

          <div className="visit-left">

            <span className="visit-label">
              Find Us
            </span>

            <h2>
              Hungry?
              <br />
              Come straight to Munch Box.
            </h2>

            <p>
              Dine in, takeaway or home delivery —
              all three are available.
            </p>

            <div className="visit-rows">

              <a
                className="visit-row"
                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(BRAND.address)}`}
                target="_blank"
                rel="noopener noreferrer"
              >

                <FaMapMarkerAlt />

                <div>
                  <strong>Address</strong>
                  <p>{BRAND.address}</p>
                </div>

              </a>

              <a
                className="visit-row"
                href={`https://wa.me/${BRAND.whatsapp}`}
                target="_blank"
                rel="noopener noreferrer"
              >

                <FaWhatsapp />

                <div>
                  <strong>WhatsApp</strong>
                  <p>Send us your order and we will confirm it</p>
                </div>

              </a>

            </div>

            <a
              className="btn-primary visit-call"
              href={`tel:${BRAND.phoneDial}`}
            >
              <FaPhoneAlt />
              Call Now
            </a>

          </div>

          <div className="visit-right">

            <div className="visit-card">

              <p className="visit-card-tag">
                Opening Hours
              </p>

              <h3>{BRAND.timing}</h3>

              <p className="visit-card-text">
                Last orders are taken 20 minutes before
                the kitchen closes.
              </p>

              <button
                className="btn-primary"
                onClick={() => navigate("/burgers")}
              >
                Start Your Order
              </button>

            </div>

          </div>

        </div>

      </section>

      <Footer />

    </>

  );

};

export default Home;
