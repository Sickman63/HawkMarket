const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    // Get the token from the Authorization header
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Access denied, token not provided or malformed' });
    }

    // Extract the token (expected in the format: 'Bearer <token>')
    const token = authHeader.split(' ')[1].trim();
    if (!token) {
        return res.status(401).json({ message: 'Access denied, no token provided' });
    }

    // Verify the token
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // Add decoded token info to the request object
        next(); // Proceed to the next middleware or route handler
    } catch (err) {
        return res.status(403).json({ message: 'Invalid or expired token' }); // Forbidden
    }
};
