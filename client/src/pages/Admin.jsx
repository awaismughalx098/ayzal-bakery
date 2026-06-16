import "./Admin.css";
import logo from "../assets/logo.png";
import { useEffect, useState } from "react";
import axios from "axios";

import {
  FaBoxOpen,
  FaMoneyBillWave,
  FaClipboardList,
  FaTrash,
  FaEdit,
  FaPlus,
  FaCheckCircle,
  FaClock,
} from "react-icons/fa";

const API = "http://localhost:5000/api";

const Admin = () => {
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);

  const [form, setForm] = useState({
    title: "",
    price: "",
    description: "",
    category: "cakes",
    image: null,
  });

  const [editId, setEditId] = useState(null);

  const fetchProducts = async () => {
    try {
      const res = await axios.get(`${API}/products`);
      setProducts(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchOrders = async () => {
    try {
      const res = await axios.get(`${API}/orders`);
      setOrders(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchOrders();
  }, []);

  const deliveredOrders = orders.filter(
    (order) => order.status?.toLowerCase() === "delivered"
  );

  const pendingOrders = orders.filter(
    (order) => order.status?.toLowerCase() !== "delivered"
  );

  const totalRevenue = deliveredOrders.reduce(
    (acc, order) => acc + Number(order.total || 0),
    0
  );

  const updateOrderStatus = async (id, status) => {
    try {
      await axios.put(`${API}/orders/${id}`, {
        status: status.toLowerCase(),
      });

      fetchOrders();
    } catch (error) {
      console.log(error);
      alert("Order status update nahi hua. Backend restart/check kro.");
    }
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    setForm({
      ...form,
      [name]: files ? files[0] : value,
    });
  };

  const resetForm = () => {
    setForm({
      title: "",
      price: "",
      description: "",
      category: "cakes",
      image: null,
    });

    setEditId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const data = new FormData();

      data.append("title", form.title);
      data.append("price", Number(form.price));
      data.append("description", form.description);
      data.append("category", form.category);

      if (form.image) {
        data.append("image", form.image);
      }

      if (editId) {
        await axios.put(`${API}/products/${editId}`, data);
      } else {
        await axios.post(`${API}/products/add`, data);
      }

      resetForm();
      fetchProducts();
    } catch (error) {
      console.log(error);
      alert("Product save nahi hua. Backend route check kro.");
    }
  };

  const deleteProduct = async (id) => {
    try {
      await axios.delete(`${API}/products/${id}`);
      fetchProducts();
    } catch (error) {
      console.log(error);
    }
  };

  const startEdit = (product) => {
    setEditId(product._id);

    setForm({
      title: product.title || "",
      price: product.price || "",
      description: product.description || "",
      category: product.category || "cakes",
      image: null,
    });

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const getImageUrl = (image) => {
    if (!image) return "";
    if (image.startsWith("http")) return image;
    return `http://localhost:5000${image}`;
  };

  return (
    <div className="admin-page">
      <aside className="admin-sidebar">
        <div className="admin-logo">
          <img src={logo} alt="AYZAL" />
          <h2>AYZAL</h2>
          <p>Bakery Admin</p>
        </div>
      </aside>

      <main className="admin-main">
        <div className="admin-header">
          <h1>Admin Dashboard</h1>
          <p>Manage products, orders and bakery revenue elegantly</p>
        </div>

        <div className="stats-grid">
          <div className="stat-card">
            <FaClipboardList />
            <h2>{orders.length}</h2>
            <p>Total Orders</p>
          </div>

          <div className="stat-card">
            <FaClock />
            <h2>{pendingOrders.length}</h2>
            <p>Pending Orders</p>
          </div>

          <div className="stat-card">
            <FaMoneyBillWave />
            <h2>Rs. {totalRevenue}</h2>
            <p>Total Revenue</p>
            <small>Delivered orders only</small>
          </div>

          <div className="stat-card">
            <FaCheckCircle />
            <h2>{deliveredOrders.length}</h2>
            <p>Delivered Orders</p>
          </div>

          <div className="stat-card">
            <FaBoxOpen />
            <h2>{products.length}</h2>
            <p>Total Products</p>
          </div>
        </div>

        <section className="add-product-box">
          <div className="section-head">
            <h2>{editId ? "Edit Product" : "Add Product"}</h2>
          </div>

          <form onSubmit={handleSubmit} className="product-form">
            <input
              type="text"
              name="title"
              placeholder="Product name"
              value={form.title}
              onChange={handleChange}
              required
            />

            <input
              type="number"
              name="price"
              placeholder="Product price"
              value={form.price}
              onChange={handleChange}
              required
            />

            <select
              name="category"
              value={form.category}
              onChange={handleChange}
              required
            >
              <option value="cakes">Cakes</option>
              <option value="deserts">Deserts</option>
              <option value="brownies">Brownies</option>
              <option value="cookies">Cookies</option>
            </select>

            <input
              type="file"
              name="image"
              accept="image/*"
              onChange={handleChange}
            />

            <textarea
              name="description"
              placeholder="Product description"
              value={form.description}
              onChange={handleChange}
              required
            ></textarea>

            <div className="form-actions">
              <button type="submit" className="save-btn">
                <FaPlus />
                {editId ? "Update Product" : "Add Product"}
              </button>

              {editId && (
                <button type="button" className="cancel-btn" onClick={resetForm}>
                  Cancel
                </button>
              )}
            </div>
          </form>
        </section>

        <section className="orders-section">
          <div className="section-head">
            <h2>Orders</h2>
          </div>

          <div className="orders-grid">
            {orders.length === 0 ? (
              <p className="empty-text">No orders found.</p>
            ) : (
              orders.map((order) => (
                <div className="order-card" key={order._id}>
                  <div className="order-top">
                    <h3>{order.customerName}</h3>

                    <span
                      className={
                        order.status?.toLowerCase() === "delivered"
                          ? "status delivered"
                          : "status pending"
                      }
                    >
                      {order.status || "pending"}
                    </span>
                  </div>

                  <p>
                    <b>Phone:</b> {order.phone}
                  </p>

                  <p>
                    <b>Address:</b> {order.address}
                  </p>

                  <p>
                    <b>Product:</b> {order.product}
                  </p>

                  <p>
                    <b>Quantity:</b> {order.quantity}
                  </p>

                  <p>
                    <b>Total:</b> Rs. {order.total}
                  </p>

                  <div className="order-actions">
                    <button
                      className="pending-btn"
                      onClick={() => updateOrderStatus(order._id, "pending")}
                    >
                      <FaClock />
                      Pending
                    </button>

                    <button
                      className="delivered-btn"
                      onClick={() => updateOrderStatus(order._id, "delivered")}
                    >
                      <FaCheckCircle />
                      Delivered
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>

        <section className="products-section-admin">
          <div className="section-head">
            <h2>All Products</h2>
          </div>

          <div className="admin-products-grid">
            {products.length === 0 ? (
              <p className="empty-text">No products found.</p>
            ) : (
              products.map((item) => (
                <div className="admin-product-card" key={item._id}>
                  <img src={getImageUrl(item.image)} alt={item.title} />

                  <div className="admin-product-content">
                    <h3>{item.title}</h3>
                    <p>Rs. {item.price}</p>
                    <small>{item.description}</small>
                    <span>{item.category}</span>

                    <div className="product-actions">
                      <button
                        className="edit-btn"
                        onClick={() => startEdit(item)}
                      >
                        <FaEdit />
                      </button>

                      <button
                        className="delete-btn"
                        onClick={() => deleteProduct(item._id)}
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>
      </main>
    </div>
  );
};

export default Admin;