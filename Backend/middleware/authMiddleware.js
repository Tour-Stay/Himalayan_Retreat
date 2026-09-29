const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  try {
    // Get token from header
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Access denied. No token provided.' });
    }

    // Extract the token (remove "Bearer " prefix)
    const token = authHeader.split(' ')[1];

    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.admin = decoded; // Attach admin info to the request
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid or expired token.' });
  }
};

module.exports = authMiddleware;
