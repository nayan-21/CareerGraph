const express = require('express');
const multer = require('multer');
const path = require('path');
const parseResume = require('../services/resumeParser'); 
const extractSkills = require('../utils/extractSkills'); 
const Resume = require('../models/Resume'); 
const { getResumeById, getAllResumes } = require('../controllers/resumeController'); // Import the new Controller functions
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

// 1. UPLOAD A NEW RESUME (POST)
router.post('/upload', upload.single('resume'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded.' });
        }

        console.log("File saved physically by Multer:", req.file.path);
        
        const extractedText = await parseResume(req.file.path);
        const extractedSkills = extractSkills(extractedText);

        const newResumeDocument = new Resume({
            fileName: req.file.originalname, 
            filePath: req.file.path,         
            extractedText: extractedText,    
            skills: extractedSkills          
        });

        await newResumeDocument.save();
        console.log("Resume successfully saved to MongoDB Atlas:", newResumeDocument._id);

        res.status(200).json({
            message: 'Resume parsed and saved successfully!',
            resumeId: newResumeDocument._id, 
            fileName: newResumeDocument.fileName,
            skills: newResumeDocument.skills
        });

    } catch (error) {
        console.error("Error during upload/parsing/saving:", error);
        res.status(500).json({ message: 'Server error during upload or database operation.' });
    }
});

// 2. GET ALL RESUMES (GET)
// Retrieves a paginated list of all resumes in the database, newest first
router.get('/', getAllResumes);

// 3. GET RESUME BY ID (GET)
// Retrieves a specific candidate's resume data
router.get('/:id', getResumeById);

module.exports = router;
