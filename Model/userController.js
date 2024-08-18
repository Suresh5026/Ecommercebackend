const express = require("express");
const router = express.Router();
const userModel = require('../Model/userModel')
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const validateToken = require('../middleWares/validateToken')
const productModel = require('./productModel')

router.post("/register", async (req, res) => {
  try {
    let user = await userModel.findOne({ email: req.body.email });
    if (user) {
      return res.status(401).json({ message: "User Already Exists" });
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPwd = await bcrypt.hash(req.body.password, salt);
    req.body.password = hashedPwd;

    await userModel.create(req.body);
    return res.status(201).json({ message: "User Registered Successfully" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

router.post("/login", async (req, res) => {
  try {
    const user = await userModel.findOne({ email: req.body.email });
    
    
    if (!user) {
      return res.status(400).json({ message: "User not Found " });
    }
    const validPwd = await bcrypt.compare(req.body.password, user.password);
    if (!validPwd) {
      return res.status(400).json({ message: "Invalid Password" });
    }
    
      const token = jwt.sign({ userId: user._id, role: user.role }, process.env.TOKEN_SECRET, {
        expiresIn: "1h",
      });
      console.log("Token : ", token);
      
      
      return res
        .status(200)
        .json({ token, role:user.role, userId: user._id, success : true, message: "Login Successful" });
    
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

router.get('/getUser',async(req,res)=>{
  try{
    const user = await userModel.find();
    console.log(user);
    return res.status(200).json({ message : "user fetched successfully", user})
    
  }catch(error){
    return res.status(500).json({ message: error.message });
  }
})

router.get('/getCurrentUser',validateToken,async(req,res)=>{
  try{
    console.log('User from middleware:', req.user);
    if (!req.user) return res.status(401).json({ message: 'User not authenticated' })
    const user = await userModel.findById(req.user.userId).select("-password");
    // console.log('Fetched User', user);
    
    return res.status(200).json({ message : "Current user fetched successfully", user})
  }catch (error){
    return res.status(500).json({ message: error.message });
  }
})

router.post('/addTocart', validateToken, async (req, res) => {
  const { productId, userId  } = req.body;

  try {
    const user = await userModel.findById(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const product = await productModel.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const isUpdate = await userModel.updateOne(
      { _id: userId },
      { $addToSet: { cart: productId } }
    );

    if (isUpdate.nModified === 0) {
      return res.status(500).json({ message: 'Failed to add to cart' });
    } else {
      return res.status(200).json({ message: 'Add to cart success' });
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

router.post('/getCart',validateToken,  async (req, res) => {
  try {
    const userId = req.body.userId; // Get userId from req.user
    console.log(userId,"101");
    if (!userId) {
      return res.status(400).json({ message: 'User ID is required' });
    }
    const cartData = await userModel.findById(userId).populate('cart');
console.log(cartData);

    if (!cartData) {
      return res.status(404).json({ message: 'User not found' });
    }

    return res.status(200).json({ data: cartData.cart, message: 'Cart fetched successfully' });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

router.put('/updateCart',validateToken,async(req,res)=>{
  const { userId, productId, quantity } = req.body;
  try{
    const cart = await userModel.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const cartItemIndex = user.cart.findIndex(item => item.toString() === productId);
    if (cartItemIndex === -1) {
      return res.status(404).json({ success: false, message: 'Item not found in cart' });
    }
    user.cart[cartItemIndex].quantity = quantity;
    await user.save();

    res.status(200).json({ success: true, message: 'Cart updated successfully' });

  }catch (error){
    res.status(500).json({ success: false, error: error.message });
  }

})

router.delete('/removeFromCart',validateToken, async(req,res)=>{
  const { userId, productId } = req.query; // Get parameters from query string

  try {
    if (!userId || !productId) {
      return res.status(400).json({ success: false, message: 'User ID and Product ID are required' });
    }

    const user = await userModel.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    user.cart = user.cart.filter(itemId => itemId.toString() !== productId);
    await user.save();

    res.status(200).json({ success: true, message: 'Item removed from cart successfully' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
})

router.post('/clearCart', async (req, res) => {
  try {
    const { userId } = req.body;
    console.log(userId);
    await userModel.updateOne({ _id: userId }, { $set: { cart: [] } });

    res.status(200).json({ message: 'Cart cleared successfully' });
  } catch (error) {
    console.error('Error clearing cart:', error);
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
});


module.exports = router;
