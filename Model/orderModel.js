const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    orderId: {
      type: String,
      required: true,
      unique: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },
    productIds: [{
      type: [mongoose.Schema.Types.ObjectId],
      ref: "products",
      required: true,
    }],
    amount: {
      type: Number,
      required: true,
    },
    currency: {
      type: String,
      default: "INR",
    },
    status: {
      type: String,
      default: "Ordered"
    },
    created_at: {
      type: Date,
      default: Date.now,
    },
    notes: {
      userId: String,
    productIds: [String], 
    },
  },
  { timestamps: true }
);

const orderModel = mongoose.model("orders", orderSchema);

module.exports = orderModel;
