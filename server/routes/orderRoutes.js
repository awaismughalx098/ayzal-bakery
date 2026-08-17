const express = require("express");
const router = express.Router();

const mongoose = require("mongoose");

const Order = require("../models/Order");

const { protect } = require("../middleware/authMiddleware");
const { orderLimiter } = require("../middleware/rateLimiters");

/* ===================================== */
/* HELPERS */
/* ===================================== */

const isValidId = (id) =>
  mongoose.Types.ObjectId.isValid(id);

const clean = (value, max) =>
  String(value || "")
    .trim()
    .slice(0, max);

/* Never trust what the customer sends. The total is
   always calculated here and any total sent by the
   client is ignored outright, otherwise someone could
   edit the request and place a Rs 1 order. */

const validateOrder = (body) => {
  const errors = [];

  const customerName = clean(body.customerName, 60);
  const phone = clean(body.phone, 20);
  const address = clean(body.address, 200);
  const instructions = clean(body.instructions, 300);

  if (customerName.length < 2)
    errors.push("Name must be at least 2 characters.");

  /* PK numbers: digits, spaces, +, - allowed */
  if (!/^[\d\s+()-]{7,20}$/.test(phone))
    errors.push("Please enter a valid phone number.");

  if (address.length < 5)
    errors.push("A delivery address is required.");

  /* ---- CART ORDER (multiple items) ---- */

  const rawItems = Array.isArray(body.items) ? body.items : [];

  if (rawItems.length > 0) {
    if (rawItems.length > 50) {
      errors.push("An order cannot contain more than 50 items.");
    }

    const items = [];

    for (const raw of rawItems.slice(0, 50)) {
      const title = clean(raw.title, 120);
      const price = Number(raw.price);
      const quantity = Number(raw.quantity);

      if (!title) {
        errors.push("A cart item is missing its name.");
        break;
      }

      if (!Number.isFinite(price) || price < 0 || price > 1000000) {
        errors.push(`The price for "${title}" is invalid.`);
        break;
      }

      if (!Number.isInteger(quantity) || quantity < 1 || quantity > 100) {
        errors.push(`Quantity for "${title}" must be between 1 and 100.`);
        break;
      }

      items.push({
        title,
        price,
        quantity,
        lineTotal: price * quantity,
      });
    }

    if (errors.length) return { errors, value: null };

    /* Total each line, then sum them */
    const total = items.reduce((sum, item) => sum + item.lineTotal, 0);

    const quantity = items.reduce((sum, item) => sum + item.quantity, 0);

    return {
      errors,
      value: {
        customerName,
        phone,
        address,
        instructions,
        product: items
          .map((item) => `${item.title} x${item.quantity}`)
          .join(", ")
          .slice(0, 300),
        items,
        price: 0,
        quantity,
        total,
        status: "pending",
      },
    };
  }

  /* ---- SINGLE ITEM ORDER ---- */

  const product = clean(body.product, 200);
  const price = Number(body.price);
  const quantity = Number(body.quantity);

  if (!product) errors.push("Product is missing.");

  if (!Number.isFinite(price) || price < 0 || price > 1000000)
    errors.push("Invalid price.");

  if (!Number.isInteger(quantity) || quantity < 1 || quantity > 100)
    errors.push("Quantity must be between 1 and 100.");

  if (errors.length) return { errors, value: null };

  return {
    errors,
    value: {
      customerName,
      phone,
      address,
      instructions,
      product,
      items: [
        {
          title: product,
          price,
          quantity,
          lineTotal: price * quantity,
        },
      ],
      price,
      quantity,
      total: price * quantity,
      status: "pending",
    },
  };
};

/* ===================================== */
/* CREATE ORDER — PUBLIC (rate limited) */
/* ===================================== */

router.post("/", orderLimiter, async (req, res) => {
  try {
    const { errors, value } = validateOrder(req.body);

    if (errors.length) {
      return res.status(400).json({
        success: false,
        message: errors[0],
      });
    }

    const order = new Order(value);

    await order.save();

    res.status(201).json({
      success: true,
      order: {
        id: order._id,
        product: order.product,
        total: order.total,
        status: order.status,
      },
    });
  } catch (error) {
    console.error("[orders:create]", error.message);

    res.status(500).json({
      success: false,
      message: "Could not place the order.",
    });
  }
});

/* ===================================== */
/* GET ORDERS — ADMIN ONLY */
/* ===================================== */

router.get("/", protect, async (req, res) => {
  try {
    const orders = await Order.find().sort({
      createdAt: -1,
    });

    res.json(orders);
  } catch (error) {
    console.error("[orders:list]", error.message);

    res.status(500).json({
      success: false,
      message: "Could not load orders.",
    });
  }
});

/* ===================================== */
/* UPDATE ORDER STATUS — ADMIN ONLY */
/* ===================================== */

router.put("/:id", protect, async (req, res) => {
  try {
    if (!isValidId(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid order id.",
      });
    }

    const status = String(req.body.status || "").toLowerCase();

    if (!["pending", "delivered"].includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status",
      });
    }

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    res.json({
      success: true,
      order,
    });
  } catch (error) {
    console.error("[orders:update]", error.message);

    res.status(500).json({
      success: false,
      message: "Could not update the order.",
    });
  }
});

/* ===================================== */
/* DELETE ORDER — ADMIN ONLY */
/* ===================================== */

router.delete("/:id", protect, async (req, res) => {
  try {
    if (!isValidId(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid order id.",
      });
    }

    const order = await Order.findByIdAndDelete(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    res.json({
      success: true,
      message: "Order Deleted",
    });
  } catch (error) {
    console.error("[orders:delete]", error.message);

    res.status(500).json({
      success: false,
      message: "Could not delete the order.",
    });
  }
});

module.exports = router;
