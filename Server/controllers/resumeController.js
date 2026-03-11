const mongoose = require('mongoose');
const Resume = require('../models/Resume');

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

module.exports = {
    getResumeById,
    getAllResumes
};
