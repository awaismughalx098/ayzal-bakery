import {
  useContext
}
from "react";

import {
  CartContext
}
from "../context/CartContext";
import "./Pages.css";

import {
  useEffect,
  useState
}
from "react";

import axios
from "axios";

import {
  useNavigate
}
from "react-router-dom";

const Desserts = () => {

  const navigate =
  useNavigate();

  const [
    products,
    setProducts
  ] = useState([]);

  useEffect(()=>{

    fetchProducts();

  },[]);

  const fetchProducts =
  async()=>{

    try{

      const res =
      await axios.get(
        "http://localhost:5000/api/products"
      );

      const filtered =
      res.data.filter(

        item =>

        item.category &&
        item.category.toLowerCase()
        === "desserts"

      );

      setProducts(filtered);

    }

    catch(error){

      console.log(error);

    }

  };

  return(

    <div className="page-wrapper">

      <section className="page-hero desserts-hero">

        <div className="page-overlay"></div>

        <div className="page-hero-content">

          <span>
            AYZAL DESSERTS
          </span>

          <h1>
            Sweet Desserts
          </h1>

          <p>
            Rich handcrafted desserts
            baked with elegance and love.
          </p>

        </div>

      </section>

      <section className="products-section">

        <div className="section-title">

          <span>
            HANDCRAFTED SWEETS
          </span>

          <h2>
            Our Desserts
          </h2>

        </div>

        <div className="products-grid">

          {
            products.map((item)=>(

              <div
                className="luxury-card"
                key={item._id}
              >

                <div className="product-image">

                  <img
                    src={item.image}
                    alt={item.title}
                  />

                  <div className="product-overlay">

                    <button
                      onClick={()=>navigate(
                        "/order",
                        {
                          state:item
                        }
                      )}
                    >

                      Order Now

                    </button>

                  </div>

                </div>

                <div className="product-content">

                  <span>
                    PREMIUM DESSERT
                  </span>

                  <h3>
                    {item.title}
                  </h3>

                  <p>
                    Rs. {item.price}
                  </p>

                </div>

              </div>

            ))
          }

        </div>

      </section>

    </div>

  );

};

export default Desserts;