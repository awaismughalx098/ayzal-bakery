import "./Admin.css";
import logo from "../assets/logo.png";
import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  FaBoxOpen,
  FaMoneyBillWave,
  FaClipboardList,
  FaTrash,
  FaEdit,
  FaPlus,
  FaCheckCircle,
  FaClock,
  FaSignOutAlt,
} from "react-icons/fa";

import { api, imageUrl, errorMessage } from "../api";
import { AuthContext } from "../context/contexts";
import { clearProductCache } from "../hooks/useProducts";
import { BRAND, CATEGORY_OPTIONS } from "../data/menu";
import Seo from "../seo/Seo";

const DEFAULT_CATEGORY = CATEGORY_OPTIONS[0].value;

const Admin = () => {
  const navigate = useNavigate();

  const { admin, logout } = useContext(AuthContext);

  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [notice, setNotice] = useState("");

  const [form, setForm] = useState({
    title: "",
    price: "",
    description: "",
    category: DEFAULT_CATEGORY,
    image: null,
    imageUrl: "",
  });

  const [editId, setEditId] = useState(null);

  const fetchProducts = async () => {
    try {
      const res = await api.get("/products");
      setProducts(res.data);
    } catch (error) {
      setNotice(errorMessage(error, "Could not load products."));
    }
  };

  const fetchOrders = async () => {
    try {
      const res = await api.get("/orders");
      setOrders(res.data);
    } catch (error) {
      setNotice(errorMessage(error, "Could not load orders."));
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/adminlogin", { replace: true });
  };

  useEffect(() => {
    /* async wrapper so the state updates land after
       the await, not synchronously in the effect */
    const loadAll = async () => {
      await Promise.all([fetchProducts(), fetchOrders()]);
    };

    loadAll();
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
      await api.put(`/orders/${id}`, {
        status: status.toLowerCase(),
      });

      setNotice("");
      fetchOrders();
    } catch (error) {
      setNotice(errorMessage(error, "Could not update the order status."));
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
      category: DEFAULT_CATEGORY,
      image: null,
      imageUrl: "",
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
      } else if (form.imageUrl.trim()) {
        data.append("imageUrl", form.imageUrl.trim());
      }

      if (editId) {
        await api.put(`/products/${editId}`, data);
      } else {
        await api.post("/products/add", data);
      }

      setNotice("");
      resetForm();

      /* so the public site picks the change up */
      clearProductCache();
      fetchProducts();
    } catch (error) {
      setNotice(errorMessage(error, "Could not save the product."));
    }
  };

  const deleteProduct = async (id) => {
    if (!window.confirm("Delete this product?")) return;

    try {
      await api.delete(`/products/${id}`);

      setNotice("");
      clearProductCache();
      fetchProducts();
    } catch (error) {
      setNotice(errorMessage(error, "Could not delete the product."));
    }
  };

  const startEdit = (product) => {
    setEditId(product._id);

    setForm({
      title: product.title || "",
      price: product.price || "",
      description: product.description || "",
      category: product.category || DEFAULT_CATEGORY,
      image: null,
      /* show the current link so it can be edited,
         but only when it is a linked image */
      imageUrl:
        product.image && !product.image.startsWith("/uploads/")
          ? product.image
          : "",
    });

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const getImageUrl = (image) => imageUrl(image);

  return (
    <div className="admin-page">
      <Seo page="admin" />

      <aside className="admin-sidebar">
        <div className="admin-logo">
          <img src={logo} alt={BRAND.name} />
          <h2>{BRAND.name}</h2>
          <p>Restaurant Admin</p>
        </div>

        <button className="logout-btn" onClick={handleLogout}>
          <FaSignOutAlt />
          Logout
        </button>
      </aside>

      <main className="admin-main">
        <div className="admin-header">
          <div>
            <h1>Admin Dashboard</h1>
            <p>Manage menu items, orders and daily revenue</p>
          </div>

          {admin?.email && (
            <span className="admin-who">{admin.email}</span>
          )}
        </div>

        {notice && (
          <div className="admin-notice" role="alert">
            {notice}
          </div>
        )}

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
              {CATEGORY_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>

            <div className="image-field">
              <label>Photo — upload a file</label>
              <input
                type="file"
                name="image"
                accept="image/*"
                onChange={handleChange}
              />
            </div>

            <div className="image-field">
              <label>…or paste an image link</label>
              <input
                type="url"
                name="imageUrl"
                placeholder="https://..."
                value={form.imageUrl}
                onChange={handleChange}
              />
            </div>

            <textarea
              name="description"
              placeholder="Product description (optional)"
              value={form.description}
              onChange={handleChange}
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

                  {order.items?.length > 0 ? (
                    <ul className="order-items">
                      {order.items.map((item, i) => (
                        <li key={`${order._id}-${i}`}>
                          <span>
                            {item.title}
                            <small>
                              Rs {item.price} × {item.quantity}
                            </small>
                          </span>
                          <b>Rs {item.lineTotal}</b>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p>
                      <b>Product:</b> {order.product}
                    </p>
                  )}

                  {order.instructions && (
                    <p>
                      <b>Note:</b> {order.instructions}
                    </p>
                  )}

                  <p>
                    <b>Quantity:</b> {order.quantity}
                  </p>

                  <p className="order-total-line">
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
                    {item.description && <small>{item.description}</small>}
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