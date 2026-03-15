const jwt = require('jsonwebtoken');
const User = require('../models/User');

/**
 * JWT Protect Middleware
 * Guards route handlers behind Bearer token authentication.
 * Reads the Authorization header, verifies the JWT, and attaches the user to req.
 * 
 * @usage   router.post('/protected-route', protect, handler)
 */
const protect = async (req, res, next) => {
    let token;

    // Extract Bearer token from Authorization header
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
        token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
        return res.status(401).json({
            success: false,
            message: 'Not authorized. No token provided.'
        });
    }

    try {
        // Verify and decode the token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Attach user document to request (excluding password hash)
        req.user = await User.findById(decoded.id).select('-password');

        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: 'Not authorized. User account no longer exists.'
            });
        }

        next();
    } catch (error) {
        console.error('Auth Middleware Error:', error.message);
        return res.status(401).json({
            success: false,
            message: 'Not authorized. Token is invalid or expired.'
        });
    }
};

module.exports = { protect };
