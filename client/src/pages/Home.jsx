

import "./Home.css";
import {
  useContext
}
from "react";
import { useState } from "react";
import {
  CartContext
}
from "../context/CartContext";
import Navbar from "../components/Navbar/Navbar";
import Featured from "../components/Featured/Featured";
import Footer from "../components/Footer/Footer";
import Hero from "../components/Hero/Hero";
import AyzalAssistant from "../components/AyzalAssistant/AyzalAssistant";
import {
  useNavigate
} from "react-router-dom";

const Home = () => {

  const navigate =
  useNavigate();
const [openAI, setOpenAI] = useState(false);
  return (

    <>

      <Navbar />

      {/* HERO SECTION */}

      <section className="hero">

        <div className="hero-overlay"></div>

        <div className="hero-content">

          <div className="hero-left">

            <p className="hero-tag">
              Premium Bakery Experience
            </p>

            <h1>

              Crafted
              <br />

              Sweetness
              <br />

              With Luxury

            </h1>

            <p className="hero-description">

              Discover handcrafted cakes,
              desserts, brownies and cookies
              designed with elegance and
              unforgettable taste.

            </p>

            <div className="hero-buttons">

              <button
                onClick={()=>
                  navigate("/cakes")
                }
              >

                Explore Cakes

              </button>

              <button
                className="outline-btn"
                onClick={()=>
                  navigate("/desserts")
                }
              >

                View Desserts

              </button>

            </div>

            <div className="hero-stats">

              <div>

                <h2>1000+</h2>

                <p>
                  Happy Clients
                </p>

              </div>

              <div>

                <h2>250+</h2>

                <p>
                  Custom Cakes
                </p>

              </div>

              <div>

                <h2>4.9★</h2>

                <p>
                  Customer Rating
                </p>

              </div>

            </div>

          </div>

          {/* RIGHT IMAGE */}

          <div className="hero-right">

            <img
              src="https://images.unsplash.com/photo-1578985545062-69928b1d9587?q=80&w=1200"
              alt="Cake"
            />

          </div>

        </div>

      </section>

      {/* CATEGORY SECTION */}

      <section className="categories">

        <div className="section-header">

          <p>
            Premium Collection
          </p>

          <h2>
            Explore Categories
          </h2>

        </div>

        <div className="category-grid">

          {/* CAKES */}

          <div
            className="category-card"
            onClick={()=>
              navigate("/cakes")
            }
          >

            <img
              src="https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?q=80&w=1200"
              alt="Cakes"
            />

            <div className="category-overlay">

              <h2>
                Cakes
              </h2>

              <p>
                Luxury celebration cakes
              </p>

            </div>

          </div>

          {/* DESSERTS */}

          <div
            className="category-card"
            onClick={()=>
              navigate("/desserts")
            }
          >

            <img
              src="https://images.unsplash.com/photo-1488477181946-6428a0291777?q=80&w=1200"
              alt="Desserts"
            />

            <div className="category-overlay">

              <h2>
                Desserts
              </h2>

              <p>
                Rich premium desserts
              </p>

            </div>

          </div>

          {/* BROWNIES */}

          <div
            className="category-card"
            onClick={()=>
              navigate("/brownies")
            }
          >

            <img
              src="https://images.unsplash.com/photo-1606313564200-e75d5e30476c?q=80&w=1200"
              alt="Brownies"
            />

            <div className="category-overlay">

              <h2>
                Brownies
              </h2>

              <p>
                Fudgy chocolate brownies
              </p>

            </div>

          </div>

          {/* COOKIES */}

          <div
            className="category-card"
            onClick={()=>
              navigate("/cookies")
            }
          >

            <img
              src="https://images.unsplash.com/photo-1499636136210-6f4ee915583e?q=80&w=1200"
              alt="Cookies"
            />

            <div className="category-overlay">

              <h2>
                Cookies
              </h2>

              <p>
                Fresh baked cookies
              </p>

            </div>

          </div>

        </div>

      </section>

      {/* FEATURED */}

      <Featured />

      {/* AI SECTION */}

      <section className="ai-section">

        <div className="ai-content">

          <div className="ai-left">

            <p>
              AYZAL AI STUDIO
            </p>

            <h2>

              Design Your
              <br />

              Dream Cake
              <br />

              With AI

            </h2>

            <span>

              Talk with Ayzal Assistant
              using voice or text and
              generate custom bakery
              designs instantly.

            </span>

<button onClick={() => setOpenAI(true)}>
  Open AI Assistant
</button>

          </div>

          <div className="ai-right">

            <img
              src="https://images.unsplash.com/photo-1551024601-bec78aea704b?q=80&w=1200"
              alt="AI Cake"
            />

          </div>

        </div>

      </section>

      <Footer />

{openAI && (
  <div className="ai-popup-overlay">
    <AyzalAssistant setOpenAI={setOpenAI} />
  </div>
)}

    </>

  );

};

export default Home;