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
    productIds: {
      type: [String], 
    required: true,
    },
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
    notes: {
      type: {
        userId: String,
        productIds: [String], 
      },
      required: true,
    },
    paymentId: { type: String, required: false },
    paymentStatus: { type: String, required: false },
    created_at: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

const orderModel = mongoose.model("Order", orderSchema);

module.exports = orderModel;
