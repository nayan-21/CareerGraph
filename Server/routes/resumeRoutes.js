const express = require('express');
const multer = require('multer');
const path = require('path');
const parseResume = require('../services/resumeParser'); // Import our new parser service
const extractSkills = require('../utils/extractSkills'); // Import the skill extraction utility
const router = express.Router();

// ------------------------------------------------------------------
// MULTER CONFIGURATION
// ------------------------------------------------------------------

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

router.post('/upload', upload.single('resume'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded.' });
        }

        console.log("File saved successfully:", req.file);

        // 1. Pass the path of the saved file to our new parser service
        const extractedText = await parseResume(req.file.path);

        // 2. Extract structured skills from the raw text
        const extractedSkills = extractSkills(extractedText);

        // 3. Return the success message, text, and skills back to the API client
        res.status(200).json({
            message: 'Resume processed successfully!',
            skills: extractedSkills,
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
