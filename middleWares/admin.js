const jwt = require('jsonwebtoken');
const userModel = require('../Model/userModel');

const admin = async (req, res, next) => {
  try {
    
    const token = req.headers.authorization && req.headers.authorization.split(' ')[1];
    // console.log("token", token);

    if (!token) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const decoded = jwt.verify(token, process.env.TOKEN_SECRET);
    // console.log("decoded", decoded);

    const user = await userModel.findById(decoded.userId);
    // console.log("userdata", user); 

    if (!user || user.role !== 'Admin') {
      return res.status(403).json({ message: 'Access denied.' });
    }

    req.user = user;
    next();
  } catch (error) {
    console.log("error", error);
    res.status(401).json({ message: 'Not authorized.' });
  }
};

module.exports = admin;
