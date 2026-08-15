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

function Biscuits() {
  return (
    <ProductsPage
      catagory="biscuits"
      title="Our Biscuits"
    />
  );
}

export default Biscuits;