const express = require('express');
const multer = require('multer');
const path = require('path');
const router = express.Router();

// ------------------------------------------------------------------
// MULTER CONFIGURATION
// ------------------------------------------------------------------

// Set up where and how the files should be stored
const storage = multer.diskStorage({
    // 1. Destination: Where to put the uploaded files
    destination: function (req, file, cb) {
        // 'cb' is a callback function. The first argument is an error (null here),
        // the second is the path to the folder.
        cb(null, 'uploads/'); 
    },
    // 2. Filename: What to call the file once it's saved
    filename: function (req, file, cb) {
        // We add Date.now() to make sure every file name is totally unique.
        // Otherwise, if two users upload 'resume.pdf', the second one overwrites the first!
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});

// Create the upload middleware using the storage config we just made
const upload = multer({ storage: storage });

// ------------------------------------------------------------------
// API ROUTES
// ------------------------------------------------------------------

// POST /api/resume/upload
// The 'upload.single("resume")' middleware intercepts the request, saves the file
// that was attached to the "resume" field, and THEN passes control to our function.
router.post('/upload', upload.single('resume'), (req, res) => {
    try {
        // If multer failed or no file was uploaded, req.file will be undefined
        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded.' });
        }

        // If we reach here, it means multer successfully saved the file to /uploads!
        console.log("File saved successfully:", req.file);

        // Send a success response back to the frontend
        res.status(200).json({
            message: 'Resume uploaded successfully!',
            fileDetails: {
                filename: req.file.filename,
                path: req.file.path,
                size: req.file.size
            }
        });
    } catch (error) {
        console.error("Error during upload:", error);
        res.status(500).json({ message: 'Server error during upload.' });
    }
});

// Export the router so we can use it in server.js
module.exports = router;
