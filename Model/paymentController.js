const express = require("express");
const router = express.Router();
const Razorpay = require("razorpay");
const crypto = require("crypto");
const productModel = require("./productModel");
const orderModel = require("./orderModel");

let instance = new Razorpay({
  key_id: process.env.KEY_ID,
  key_secret: process.env.key_secret,
});

router.post("/orders", async (req, res) => {
  try {
    const { productIds, userId, amount } = req.body; 

    if (!userId || !productIds || productIds.length === 0) {
      return res
        .status(400)
        .json({ message: "User ID and product IDs are required" });
    }

    const options = {
      amount: amount * 100,
      currency: "INR",
      notes: {
        userId: userId,
        productIds: productIds, 
      },
    };
    console.log("Creating Razorpay order with options:", options);

    instance.orders.create(options, async (err, order) => {
      if (err) {
        console.error("Error creating Razorpay order:", err);
        return res.status(500).json({ message: "Server Error", error: err });
      }
      const newOrder = new orderModel({
        orderId: order.id,
        userId: userId,
        productIds: productIds, 
        amount: order.amount/100,
        currency: order.currency,
        notes: order.notes,
      });
      await newOrder.save();
      return res.status(200).json({
        data: order,
        message: "Order Created Successfully",
      });
    });
  } catch (error) {
    console.error("Error processing order request:", error);
    return res
      .status(500)
      .json({ message: "Server Error", error: error.message });
  }
});

router.post("/verify", async (req, res) => {
  const body =
    req.body.response.razorpay_order_id +
    "|" +
    req.body.response.razorpay_payment_id;

  const expectedSignature = crypto
    .createHmac("sha256", process.env.KEY_SECRET)
    .update(body.toString())
    .digest("hex");

  if (expectedSignature === req.body.response.razorpay_signature) {
    res.json({ success: true, message: "Payment verification successful" });
  } else {
    console.log("Invalid signature.");
    res.status(400).json({ message: "Invalid signature" });
  }
});


router.get("/orders/:id", async (req, res) => {
  try {
    const orderId = req.params.id;
    const order = await instance.orders.fetch(orderId);

    if (!order.receipt) {
      return res
        .status(400)
        .json({ message: "Receipt field is missing in the order" });
    }

    const productIds = order.receipt.split(",");

    if (productIds.length === 0) {
      return res
        .status(400)
        .json({ message: "No product IDs found in receipt" });
    }

    const products = await productModel.find({ _id: { $in: productIds } });

    res.status(200).json({
      data: {
        order,
        products,
      },
      message: "Order fetched successfully",
    });
  } catch (error) {
    console.error("Error fetching order:", error);
    res
      .status(500)
      .json({ message: "Error fetching order", error: error.message });
  }
});

router.get("/orders/user/:userId", async (req, res) => {
  try {
    const userId = req.params.userId;
    const orders = await orderModel.find({ userId: userId });

    if (!orders || orders.length === 0) {
      return res.status(404).json({ message: "No orders found for this user" });
    }

    return res.status(200).json({
      data: orders,
      message: "Orders fetched successfully",
    });
  } catch (error) {
    console.error("Error fetching orders:", error);
    return res
      .status(500)
      .json({ message: "Error fetching orders", error: error.message });
  }
});

module.exports = router;
