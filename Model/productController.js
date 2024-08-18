const express = require("express");
const router = express.Router();
const productModel = require("./productModel");
const validateToken = require("../middleWares/validateToken");
const admin = require("../middleWares/admin");

router.post("/createProduct", validateToken, admin, async (req, res) => {
  try {
    const {
      name,
      description,
      category,
      size,
      color,
      stock,
      price,
      discount,
      imageUrl,
    } = req.body;
    const userId = req.userId;
    console.log(userId);

    if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
    }

    const newProduct = new productModel({
      name,
      description,
      category,
      size,
      color,
      stock,
      price,
      discount,
      imageUrl,
      userId,
    });

    const savedProduct = await newProduct.save();
    res
      .status(201)
      .json({ message: "Product created successfully", data: savedProduct });
  } catch (error) {
    res.status(500).json({ message: "Error adding product", error });
  }
});

router.get("/getProducts", async (req, res) => {
  try {
    const product = await productModel.find();
    return res
      .status(200)
      .json({ data: product, message: "Products fetched successfully" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});
router.get("/getProduct/:id", validateToken, async (req, res) => {
  try {
    const productId = req.params.id;
    const product = await productModel.findById(productId);
    console.log(product);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    return res
      .status(200)
      .json({ data: product, message: "Products fetched successfully" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

router.delete("/deleteProduct/:id", validateToken, admin, async (req, res) => {
  try {
    const product = await productModel.findByIdAndDelete(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    return res.json({ product, message: "Product Deleted Successfully" });
  } catch {
    console.error("Error deleting product:", error);
    return res.status(500).json({ message: error.message });
  }
});

router.put("/editProduct/:id", validateToken, admin, async (req, res) => {
  try {
    const product = await productModel.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
      }
    );
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    return res
      .status(200)
      .json({ message: "Product Updated Successfully", product });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});
module.exports = router;
