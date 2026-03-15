const jwt = require('jsonwebtoken');

/**
 * Generates a signed JWT token for authenticated sessions.
 * 
 * @param {string} userId - MongoDB ObjectId of the authenticated user
 * @returns {string} - Signed JWT token string valid for 7 days
 */
const generateToken = (userId) => {
    return jwt.sign(
        { id: userId },
        process.env.JWT_SECRET,
        { expiresIn: '7d' }
    );
};

module.exports = generateToken;
