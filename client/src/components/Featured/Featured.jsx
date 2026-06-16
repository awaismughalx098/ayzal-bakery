import "./Featured.css";

import { useNavigate } from "react-router-dom";

import {
  useEffect,
  useState
} from "react";

import axios from "axios";

const Featured = () => {

  const navigate = useNavigate();

  const [allProducts,setAllProducts] =
  useState([]);

  const [products,setProducts] =
  useState([]);

  /* FETCH PRODUCTS */

  const fetchProducts =
  async()=>{

    try{

      const res =
      await axios.get(
        "http://localhost:5000/api/products"
      );

      setAllProducts(res.data);

      setProducts(
        getRandomProducts(res.data)
      );

    }

    catch(error){

      console.log(error);

    }

  };

  /* RANDOM PRODUCTS */

  const getRandomProducts =
  (data)=>{

    const shuffled =
    [...data].sort(
      () => Math.random() - 0.5
    );

    return shuffled.slice(0,4);

  };

  /* LOAD PRODUCTS */

  useEffect(()=>{

    fetchProducts();

  },[]);

  /* AUTO CHANGE */

  useEffect(()=>{

    if(allProducts.length === 0)
      return;

    const interval =
    setInterval(()=>{

      setProducts(
        getRandomProducts(
          allProducts
        )
      );

    },6000);

    return () =>
      clearInterval(interval);

  },[allProducts]);

  return (

    <section className="featured container">

      <div className="featured-header">

        <h2>Featured Items</h2>

        <p>
          Freshly baked delights made with love
        </p>

      </div>

      <div className="featured-grid">

        {
          products.map((item)=>(

            <div
              className="product-card"
              key={item._id}
            >

              <div className="product-image">

                <img
                  src={item.image}
                  alt={item.title}
                />

              </div>

              <div className="product-content">

                <h3>{item.title}</h3>

                <p>
                  Rs. {item.price}
                </p>

                <button
                  onClick={() =>
                    navigate("/order",{
                      state:item
                    })
                  }
                >
                  Order Now
                </button>

              </div>

            </div>

          ))
        }

      </div>

    </section>

  );

};

export default Featured;