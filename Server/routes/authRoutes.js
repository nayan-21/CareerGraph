const express = require('express');
const { registerUser, loginUser } = require('../controllers/authController');

const router = express.Router();

// POST /api/auth/register — Create a new user account
router.post('/register', registerUser);

// POST /api/auth/login — Authenticate and receive JWT token
router.post('/login', loginUser);

module.exports = router;
