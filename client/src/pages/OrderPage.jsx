// src/pages/OrderPage.jsx

import "./OrderPage.css";
import {
  useContext
}
from "react";

import {
  CartContext
}
from "../context/CartContext";
import {
  useLocation
} from "react-router-dom";

import {
  useState
} from "react";

import axios from "axios";

const OrderPage = () => {

  const { state:product } =
  useLocation();

  const [name,setName] =
  useState("");

  const [phone,setPhone] =
  useState("");

  const [address,setAddress] =
  useState("");

  const [instructions,
  setInstructions] =
  useState("");

  /* SUBMIT ORDER */

  const handleSubmit =
  async(e)=>{

    e.preventDefault();

    const orderData = {

      customerName:name,

      phone,

      address,

      instructions,

      product:
      product.title || product.name,

      price:Number(
        String(product.price)
        .replace("Rs.","")
        .trim()
      ),

      quantity:1,

      total:Number(
        String(product.price)
        .replace("Rs.","")
        .trim()
      )

    };

    try{

      await axios.post(

        "http://localhost:5000/api/orders",

        orderData

      );

      alert(
        "Order Confirmed Successfully"
      );

      setName("");
      setPhone("");
      setAddress("");
      setInstructions("");

    }

    catch(error){

      console.log(error);

      alert("Order Failed");

    }

  };

  return (

    <section className="order-page">

      <div className="order-container">

        {/* IMAGE */}

        <div className="order-image">

          <img
            src={product.image}
            alt={
              product.title ||
              product.name
            }
          />

        </div>

        {/* CONTENT */}

        <div className="order-content">

          <h1>
            {
              product.title ||
              product.name
            }
          </h1>

          <h2>
            Rs. {product.price}
          </h2>

          <p>

            Freshly baked premium quality
            dessert specially crafted for
            your celebrations and sweet
            moments.

          </p>

          {/* FORM */}

          <form
            className="order-form"
            onSubmit={handleSubmit}
          >

            <input
              type="text"
              placeholder="Your Name"
              value={name}
              onChange={(e)=>
                setName(e.target.value)
              }
              required
            />

            <input
              type="text"
              placeholder="Phone Number"
              value={phone}
              onChange={(e)=>
                setPhone(e.target.value)
              }
              required
            />

            <input
              type="text"
              placeholder="Delivery Address"
              value={address}
              onChange={(e)=>
                setAddress(e.target.value)
              }
              required
            />

            <textarea
              placeholder="Special Instructions"
              value={instructions}
              onChange={(e)=>
                setInstructions(
                  e.target.value
                )
              }
            />

            <button type="submit">

              Confirm Order

            </button>

          </form>

        </div>

      </div>

    </section>

  );

};

export default OrderPage;