const jwt = require("jsonwebtoken");

const validateToken = (req, res, next) => {
  try {
    const token =
      req.headers.authorization && req.headers.authorization.split(" ")[1];
      
    // console.log(token);
      
    if (!token) {
      console.log('not working');
      
      return res.status(401).json({ message: "unauthorized" });
      
    }

    const decryptObj = jwt.verify(token, process.env.TOKEN_SECRET);

    
    req.user = decryptObj;
    console.log(decryptObj);
    
    req.userId = decryptObj.userId;
    console.log(req.userId);
    
    req.token = token;
    next();
  } catch (error) {
    console.error("Token validation error:", error.message);
    res.status(400).json({ message: "Invalid Token" });
  }
};

module.exports = validateToken;
