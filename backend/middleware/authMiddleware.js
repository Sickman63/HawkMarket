const jwt = require('jsonwebtoken');
const pool = require('../database/connection');

const authMiddleware = async (req, res, next) => {
  try {
    // Log to see if the middleware is being invoked
    console.log('authMiddleware invoked');

    const authHeader = req.headers.authorization;
    if (!authHeader) {
      console.log('Authorization header missing');
      return res.status(401).json({ message: 'Authorization header missing' });
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
      console.log('Token missing from Authorization header');
      return res.status(401).json({ message: 'Token missing' });
    }

    // Log to see if the token extraction is working
    console.log('Token found:', token);

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Log to confirm if JWT verification succeeded
    console.log('Token verified:', decoded);

    // Fetch user from the database
    const query = 'SELECT * FROM users WHERE user_id = $1';
    const { rows } = await pool.query(query, [decoded.userId]);

    if (rows.length === 0) {
      console.log('No user found with given token');
      return res.status(401).json({ message: 'User not found' });
    }

    // Attach user to request object
    req.user = rows[0];
    
    // Log to confirm user is attached to request
    console.log('User authenticated:', req.user);

    next();
  } catch (error) {
    console.error('Error in authMiddleware:', error);
    res.status(401).json({ message: 'Authentication failed' });
  }
};

module.exports = authMiddleware;
