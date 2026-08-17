const mongoose = require("mongoose");

/* Each line of a cart order gets its own record */

const orderItemSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },

    price: {
      type: Number,
      required: true,
      min: 0,
    },

    quantity: {
      type: Number,
      required: true,
      min: 1,
    },

    lineTotal: {
      type: Number,
      required: true,
      min: 0,
    },
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema({
  customerName: {
    type: String,
    required: true,
  },

  phone: {
    type: String,
    required: true,
  },

  address: {
    type: String,
    required: true,
  },

  instructions: {
    type: String,
    default: "",
  },

  /* Summary text shown in the admin order list */
  product: {
    type: String,
    required: true,
  },

  /* Populated for cart orders, empty otherwise */
  items: {
    type: [orderItemSchema],
    default: [],
  },

  /* Unit price for a single item order (0 for cart orders) */
  price: {
    type: Number,
    required: true,
    min: 0,
  },

  /* Total pieces */
  quantity: {
    type: Number,
    default: 1,
    min: 1,
  },

  /* Always calculated on the server */
  total: {
    type: Number,
    required: true,
    min: 0,
  },

  status: {
    type: String,
    enum: ["pending", "delivered"],
    default: "pending",
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Order", orderSchema);
