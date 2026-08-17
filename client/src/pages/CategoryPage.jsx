import "./Pages.css";

import { useContext, useEffect } from "react";

import { useNavigate } from "react-router-dom";

import {
  FaShoppingBasket,
  FaPhoneAlt,
  FaBoxOpen
} from "react-icons/fa";

import Navbar from "../components/Navbar/Navbar";
import Footer from "../components/Footer/Footer";
import Seo from "../seo/Seo";

import { CartContext } from "../context/contexts";
import { imageUrl } from "../api";
import { useProducts } from "../hooks/useProducts";

import {
  BRAND,
  getCategory
} from "../data/menu";

/* ============================================
   One page serves every category.
   App.jsx renders <CategoryPage slug="burgers" /> etc.

   Products come from the backend only — whatever
   the admin added under this category.
   ============================================ */

const CategoryPage = ({ slug }) => {

  const navigate = useNavigate();

  const { addToCart } = useContext(CartContext);

  const category = getCategory(slug);

  const { products: allProducts, loading } = useProducts();

  const products = allProducts.filter(
    (item) =>
      item.category &&
      item.category.toLowerCase() === slug
  );

  useEffect(() => {
    window.scrollTo({ top:0 });
  }, [slug]);

  if(!category){
    return null;
  }

  return (

    <>

      <Seo page={slug} />

      <Navbar />

      <div className="page-wrapper">

        {/* ---------- PAGE HERO ---------- */}

        <section className="page-hero">

          <img
            className="page-hero-img"
            src={category.image}
            alt={category.name}
          />

          <div className="page-overlay"></div>

          <div className="page-hero-content container">

            <span>{category.label}</span>

            <h1>{category.name}</h1>

            <p>{category.blurb}</p>

          </div>

        </section>

        {/* ---------- PRODUCTS ---------- */}

        <section className="products-section">

          <div className="container">

            <div className="section-head-line">

              <span>Munch Box Menu</span>

              <h2>Our {category.name}</h2>

            </div>

            {
              loading
                ? (

                  <div className="empty-state">
                    <h3>Loading menu...</h3>
                  </div>

                )
                : products.length === 0
                ? (

                  <div className="empty-state">

                    <FaBoxOpen className="empty-icon" />

                    <h3>
                      Nothing in {category.name} yet
                    </h3>

                    <p>
                      We are still adding items to this
                      section. Call us and we will tell you
                      what is available today.
                    </p>

                    <div className="empty-actions">

                      <a
                        className="btn-primary"
                        href={`tel:${BRAND.phoneDial}`}
                      >
                        <FaPhoneAlt />
                        Call Now
                      </a>

                      <button
                        className="empty-link"
                        onClick={() => navigate("/")}
                      >
                        Back to home
                      </button>

                    </div>

                  </div>

                )
                : (

                  <div className="products-grid">

                    {
                      products.map((item) => (

                        <div
                          className="food-card"
                          key={item._id}
                        >

                          <div className="food-image">

                            <img
                              src={imageUrl(item.image)}
                              alt={item.title}
                              loading="lazy"
                            />

                            <span className="food-badge">
                              {category.name}
                            </span>

                          </div>

                          <div className="food-content">

                            <h3>{item.title}</h3>

                            {
                              item.description && (
                                <p>{item.description}</p>
                              )
                            }

                            <div className="food-foot">

                              <span className="food-price">
                                Rs {item.price}
                              </span>

                              <div className="food-actions">

                                <button
                                  className="cart-btn"
                                  onClick={() => addToCart(item)}
                                  aria-label={`Add ${item.title} to cart`}
                                >
                                  <FaShoppingBasket />
                                </button>

                                <button
                                  className="order-btn"
                                  onClick={() =>
                                    navigate("/order", { state:item })
                                  }
                                >
                                  Order Now
                                </button>

                              </div>

                            </div>

                          </div>

                        </div>

                      ))
                    }

                  </div>

                )
            }

          </div>

        </section>

        {/* ---------- CALL STRIP ---------- */}

        <section className="call-strip">

          <div className="container call-strip-inner">

            <div>

              <h2>Prefer to order by phone?</h2>

              <p>{BRAND.address}</p>

            </div>

            <a
              href={`tel:${BRAND.phoneDial}`}
              className="btn-primary call-strip-btn"
            >
              <FaPhoneAlt />
              Call Now
            </a>

          </div>

        </section>

      </div>

      <Footer />

    </>

  );

};

export default CategoryPage;
