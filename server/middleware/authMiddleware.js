
const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  try {
    // Read the Authorization header
    const authHeader = req.headers['authorization'];

    if (!authHeader) {
      return res.status(401).json({ message: 'Unauthorized: No token provided.' });
    }

    // Expecting format: "Bearer <token>"
    const token = authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({ message: 'Unauthorized: Malformed token.' });
    }

    // Verify the JWT
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach the user ID to the request
    req.userId = decoded.userId;

    // Allow access to protected route
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Unauthorized: Invalid or expired token.' });
  }
};

module.exports = authMiddleware;