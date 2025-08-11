const jwt = require('jsonwebtoken');

const JWT_SECRET = 'your_jwt_secret_key'; // use process.env.JWT_SECRET in production

const verifyToken = (req, res, next) => {
 
  const token = req?.cookies?.token; // httpOnly cookie


  
  if (!token) {
   
    return res.status(401).json({ message: 'No token, authorization denied' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded; // attach user info to request
 
    next(); // proceed to the next middleware/route handler
  } catch (err) {
   
    return res.status(401).json({ message: 'Token is not valid' });
  }
};

module.exports = verifyToken;
