const mongoose = require('mongoose');

// Define the absolute structure of a Resume document in our database
const resumeSchema = new mongoose.Schema({
    // Standardizing the original name of the file
    fileName: {
        type: String,
        required: [true, 'fileName is required']
    },
    // The exact physical location on the disk where Multer saved the PDF
    filePath: {
        type: String,
        required: [true, 'filePath is required']
    },
    // The giant string of raw text extracted via pdf-parse
    extractedText: {
        type: String,
        required: [true, 'extractedText is required']
    },
    // The structured array of matched dictionary skills
    skills: {
        type: [String],
        // Indexing this array makes searching (e.g., finding all users who know React) O(log N) instead of O(N)
        index: true
    },
    // The quantitative algorithmic strength of the resume (1-100)
    atsScore: {
        type: Number,
        default: 0
    },
    // The analytical breakdown of the ATS Score
    atsBreakdown: {
        skillsScore: { type: Number, default: 0 },
        experienceScore: { type: Number, default: 0 },
        impactScore: { type: Number, default: 0 },
        projectScore: { type: Number, default: 0 },
        educationScore: { type: Number, default: 0 },
        languageScore: { type: Number, default: 0 },
        structureScore: { type: Number, default: 0 }
    },
    // Reference to the User who uploaded this resume
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    // Automatically stamps the document with the exact time the upload occurred
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Compile the schema into a Model and export it
// 'Resume' will become the 'resumes' collection in MongoDB Atlas
module.exports = mongoose.model("Resume", resumeSchema);
