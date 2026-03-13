const express = require('express');
const multer = require('multer');
const path = require('path');
const parseResume = require('../services/resumeParser'); 
const extractSkills = require('../utils/extractSkills'); 
const calculateATSScore = require('../services/atsScorer'); // Import the new ATS Intelligence Engine
const Resume = require('../models/Resume'); 
const { uploadResume, getResumeById, getAllResumes, matchResumeWithJob, analyzeResumeWithLLM } = require('../controllers/resumeController'); // Import the new Controller functions
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
// Upload processing and ATS logic has been moved to resumeController.js for MVC compliance
router.post('/upload', upload.single('resume'), uploadResume);

// 2. GET ALL RESUMES (GET)
// Retrieves a paginated list of all resumes in the database, newest first
router.get('/', getAllResumes);

// 3. GET RESUME BY ID (GET)
// Retrieves a specific candidate's resume data
router.get('/:id', getResumeById);

// 4. GENERATE JOB MATCH (POST)
// Compares a stored resume against a raw Job Description text to yield a match percentage
router.post('/match', matchResumeWithJob);

// 5. GENERATE AI INSIGHTS (POST)
// Feeds ATS metrics and Job Math into Google Gemini for qualitative textual analysis
router.post('/analyze', analyzeResumeWithLLM);

module.exports = router;
