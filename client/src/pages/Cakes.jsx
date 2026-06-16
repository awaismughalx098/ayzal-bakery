import "./Pages.css";

import {
  useEffect,
  useState,
  useContext
}
from "react";

import axios
from "axios";

import {
  useNavigate
}
from "react-router-dom";

import {
  CartContext
}
from "../context/CartContext";

const Cakes = () => {

  const navigate =
  useNavigate();

  const {
    addToCart
  } = useContext(CartContext);

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
        === "cakes"

      );

      setProducts(filtered);

    }

    catch(error){

      console.log(error);

    }

  };

  return(

    <div className="page-wrapper">

      <section className="page-hero cakes-hero">

        <div className="page-overlay"></div>

        <div className="page-hero-content">

          <span>
            AYZAL SIGNATURE
          </span>

          <h1>
            Luxury Cakes
          </h1>

          <p>
            Elegant handcrafted cakes
            for unforgettable celebrations.
          </p>

        </div>

      </section>

      <section className="products-section">

        <div className="section-title">

          <span>
            PREMIUM COLLECTION
          </span>

          <h2>
            Our Cakes
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

                    <button
                      className="cart-btn"
                      onClick={()=>addToCart(item)}
                    >

                      Add To Cart

                    </button>

                  </div>

                </div>

                <div className="product-content">

                  <span>
                    PREMIUM CAKE
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

export default Cakes;