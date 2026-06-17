// src/pages/OrderPage.jsx

import "./OrderPage.css";
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

const OrderPage = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const product = location.state;

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [instructions, setInstructions] = useState("");

  if (!product) {
    return (
      <section className="order-page">
        <div className="order-container">
          <div className="order-content">
            <h1>No Product Selected</h1>
            <p>Please select a product before placing an order.</p>

            <button onClick={() => navigate("/")}>
              Go Back Home
            </button>
          </div>
        </div>
      </section>
    );
  }

  const cleanPrice = Number(
    String(product.price)
      .replace("Rs.", "")
      .replace("Rs", "")
      .replace(",", "")
      .trim()
  );

  const handleSubmit = async (e) => {
    e.preventDefault();

    const orderData = {
      customerName: name,
      phone,
      address,
      instructions,
      product: product.title || product.name,
      price: cleanPrice,
      quantity: 1,
      total: cleanPrice,
    };

    try {
      await axios.post(
        "http://localhost:5000/api/orders",
        orderData
      );

      alert("Order Confirmed Successfully");

      setName("");
      setPhone("");
      setAddress("");
      setInstructions("");
    } catch (error) {
      console.log(error);
      alert("Order Failed");
    }
  };

  return (
    <section className="order-page">
      <div className="order-container">
        <div className="order-image">
          <img
            src={product.image}
            alt={product.title || product.name}
          />
        </div>

        <div className="order-content">
          <h1>{product.title || product.name}</h1>

          <h2>Rs. {cleanPrice}</h2>

          <p>
            Freshly baked premium quality dessert specially crafted
            for your celebrations and sweet moments.
          </p>

          <form className="order-form" onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="Your Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />

            <input
              type="text"
              placeholder="Phone Number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
            />

            <input
              type="text"
              placeholder="Delivery Address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              required
            />

            <textarea
              placeholder="Special Instructions"
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
            />

            <button type="submit">Confirm Order</button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default OrderPage;