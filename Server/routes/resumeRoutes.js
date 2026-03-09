const express = require('express');
const multer = require('multer');
const path = require('path');
const parseResume = require('../services/resumeParser'); // Import our new parser service
const router = express.Router();

// ------------------------------------------------------------------
// MULTER CONFIGURATION
// ------------------------------------------------------------------

// Set up where and how the files should be stored
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/'); 
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

// ------------------------------------------------------------------
// API ROUTES
// ------------------------------------------------------------------

// POST /api/resume/upload
router.post('/upload', upload.single('resume'), async (req, res) => { // Added 'async' here since PDF parsing takes time
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded.' });
        }

        console.log("File saved successfully:", req.file);

        // --- NEW CODE FOR DAY 3 ---
        // 1. Pass the path of the saved file to our new parser service
        const extractedText = await parseResume(req.file.path);

        // 2. Return the success message AND the extracted text to the frontend
        res.status(200).json({
            message: 'Resume processed successfully!',
            resumeText: extractedText,
            fileDetails: {
                filename: req.file.filename,
                path: req.file.path,
                size: req.file.size
            }
        });
    } catch (error) {
        console.error("Error during upload/parsing:", error);
        res.status(500).json({ message: 'Server error during upload or parsing.' });
    }
});

module.exports = router;
