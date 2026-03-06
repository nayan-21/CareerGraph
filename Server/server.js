// Import required modules
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config(); // Loads environment variables from a .env file into process.env

// Initialize the Express application
const app = express();

// Define the port we want the server to run on
// It uses the PORT from the .env file if available, otherwise defaults to 5000
const PORT = process.env.PORT || 5000;

// Set up Middleware
app.use(cors()); // Enables Cross-Origin Resource Sharing (allows your frontend to communicate with this backend)
app.use(express.json()); // Automatically parses incoming requests with JSON payloads

// Create a basic testing route
// When someone visits the root URL ('/'), this function sends back a simple message
app.get('/', (req, res) => {
    res.send('Hello, the backend server is running successfully!');
});

// Start listening for incoming requests on the specified port
app.listen(PORT, () => {
    console.log(`Server is listening on port: ${PORT}`);
});
