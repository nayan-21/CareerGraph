const mongoose = require('mongoose');
const Resume = require('../models/Resume');
const parseResume = require('../services/resumeParser'); 
const extractSkills = require('../utils/extractSkills'); 
const calculateATSScore = require('../services/atsScorer');
const calculateJobMatch = require('../services/jobMatcher');
const generateInsights = require('../services/llmAnalyzer');

/**
 * Handle resume upload, parsing, ATS scoring, and database storage.
 * 
 * @route   POST /api/resume/upload
 * @access  Public (for now)
 */
const uploadResume = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ success: false, message: 'No file uploaded.' });
        }

        console.log("File saved physically by Multer:", req.file.path);
        
        const extractedText = await parseResume(req.file.path);
        const extractedSkills = extractSkills(extractedText);

        // Advanced Multi-Factor ATS Intelligence Score
        const { atsScore, atsBreakdown } = calculateATSScore(extractedText, extractedSkills);

        const newResumeDocument = new Resume({
            fileName: req.file.originalname, 
            filePath: req.file.path,         
            extractedText: extractedText,    
            skills: extractedSkills,
            atsScore,
            atsBreakdown
        });

        await newResumeDocument.save();
        console.log("Resume successfully saved to MongoDB Atlas:", newResumeDocument._id);

        res.status(200).json({
            success: true,
            message: 'Resume parsed and saved successfully!',
            data: {
                resumeId: newResumeDocument._id, 
                fileName: newResumeDocument.fileName,
                skills: newResumeDocument.skills,
                atsScore: newResumeDocument.atsScore,
                atsBreakdown: newResumeDocument.atsBreakdown
            }
        });

    } catch (error) {
        console.error("Error during upload/parsing/saving/scoring:", error);
        res.status(500).json({ success: false, message: 'Server error during upload or database operation.' });
    }
};

/**
 * Fetch a specific resume by its MongoDB ID.
 * Excludes the massive raw text string to save network bandwidth.
 * 
 * @route   GET /api/resume/:id
 * @access  Public (for now)
 */
const getResumeById = async (req, res) => {
    try {
        const { id } = req.params;

        // 1. Validate the ObjectId format to prevent Mongoose cast crashes
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ 
                success: false, 
                message: 'Invalid Resume ID format.' 
            });
        }

        // 2. Query the DB, but explicitly EXCLUDE the extractedText field
        const resume = await Resume.findById(id).select('-extractedText');

        // 3. Handle the 404 Not Found scenario
        if (!resume) {
            return res.status(404).json({ 
                success: false, 
                message: 'Resume not found in the database.' 
            });
        }

        // 4. Return the clean structural response
        res.status(200).json({
            success: true,
            data: resume
        });

    } catch (error) {
        console.error("Error fetching resume by ID:", error);
        res.status(500).json({ 
            success: false, 
            message: 'Server error while fetching the resume.' 
        });
    }
};

/**
 * Fetch all processed resumes from the database.
 * Includes pagination and sorting so the newest applications appear first.
 * 
 * @route   GET /api/resume
 * @access  Public (for now)
 */
const getAllResumes = async (req, res) => {
    try {
        // 1. Pagination Parameters (defaults to page 1, 10 items per page)
        const page = parseInt(req.query.page, 10) || 1;
        const limit = parseInt(req.query.limit, 10) || 10;
        
        // Calculate how many documents to skip
        const skip = (page - 1) * limit;

        // 2. Query the DB: sort by newest, implement pagination, and exclude raw text
        const resumes = await Resume.find()
            .sort({ createdAt: -1 }) // -1 means descending (newest first)
            .skip(skip)
            .limit(limit)
            .select('-extractedText');

        // 3. Get the total mathematical count for frontend pagination UI
        const total = await Resume.countDocuments();

        // 4. Return the comprehensive paginated response payload
        res.status(200).json({
            success: true,
            count: resumes.length,
            totalPages: Math.ceil(total / limit),
            currentPage: page,
            data: resumes
        });

    } catch (error) {
        console.error("Error fetching all resumes:", error);
        res.status(500).json({ 
            success: false, 
            message: 'Server error while retrieving the resume list.' 
        });
    }
};

/**
 * Evaluate an existing resume against a raw Job Description to generate a Match Score.
 * 
 * @route   POST /api/resume/match
 * @access  Public (for now)
 */
const matchResumeWithJob = async (req, res) => {
    try {
        const { resumeId, jobDescription } = req.body;

        // 1. Defensively validate Input payloads
        if (!resumeId || !jobDescription) {
            return res.status(400).json({ 
                success: false, 
                message: 'Both resumeId and jobDescription string are required.' 
            });
        }

        if (!mongoose.Types.ObjectId.isValid(resumeId)) {
            return res.status(400).json({ 
                success: false, 
                message: 'Invalid Resume ID format.' 
            });
        }

        // 2. Fetch the Resume skills 
        const resume = await Resume.findById(resumeId).select('skills');
        
        if (!resume) {
            return res.status(404).json({ 
                success: false, 
                message: 'Resume not found in the database.' 
            });
        }

        // 3. Engage the Job Matching Engine algorithms
        const matchingAnalytics = calculateJobMatch(resume.skills, jobDescription);

        // 4. Return the intelligent Matching Matrix JSON
        res.status(200).json({
            success: true,
            data: matchingAnalytics
        });

    } catch (error) {
        console.error("Error generating Job Match:", error);
        res.status(500).json({ 
            success: false, 
            message: 'Server error while calculating job match mapping.' 
        });
    }
};

/**
 * Execute the comprehensive AI matching pipeline.
 * Fetches Resume DB -> Runs Job Math -> Calls Google Gemini -> Returns JSON.
 * 
 * @route   POST /api/resume/analyze
 * @access  Public (for now)
 */
const analyzeResumeWithLLM = async (req, res) => {
    try {
        const { resumeId, jobDescription } = req.body;

        if (!resumeId || !jobDescription) {
            return res.status(400).json({ success: false, message: 'Both resumeId and jobDescription are required.' });
        }

        if (!mongoose.Types.ObjectId.isValid(resumeId)) {
            return res.status(400).json({ success: false, message: 'Invalid Resume ID format.' });
        }

        // 1. Fetch Resume Data
        const resume = await Resume.findById(resumeId).select('skills atsScore');
        if (!resume) {
            return res.status(404).json({ success: false, message: 'Resume not found.' });
        }

        // 2. Execute Deterministic Job Math
        const matchingAnalytics = calculateJobMatch(resume.skills, jobDescription);

        // 3. Execute Non-Deterministic LLM Pipeline
        const aiResponse = await generateInsights(resume, matchingAnalytics, jobDescription);

        // 4. Return The Unified Analysis
        res.status(200).json({
            success: true,
            data: {
                atsScore: resume.atsScore,
                matchScore: matchingAnalytics.matchScore,
                matchedSkills: matchingAnalytics.matchedSkills,
                missingSkills: matchingAnalytics.missingSkills,
                insights: aiResponse.insights
            }
        });

    } catch (error) {
        console.error("Error generating unified LLM analysis:", error);
        res.status(500).json({ success: false, message: 'Server error during AI analysis pipeline.' });
    }
};

module.exports = {
    uploadResume,
    getResumeById,
    getAllResumes,
    matchResumeWithJob,
    analyzeResumeWithLLM
};
