const extractSkills = require('../utils/extractSkills');

/**
 * Compares an existing candidate's mapped resume skills against a live Job Description text 
 * to output an intelligent Applicant Match Score.
 * 
 * @param {Array<string>} resumeSkills - The array of normalized skills already stored in MongoDB.
 * @param {string} jobDescriptionText - The raw string text provided by the Recruiter.
 * @returns {Object} - Result object containing { matchScore, matchedSkills, missingSkills }
 */
const calculateJobMatch = (resumeSkills, jobDescriptionText) => {
    // 1. Dynamically extract requirements from the raw Job Description
    // extractSkills internally maps to Canonical names, deduplicates, and returns an array of Strings
    const jobSkills = extractSkills(jobDescriptionText);

    // 2. Algorithm Safeguard: Normalization
    // Force absolute lowercase on both arrays to guarantee pristine mathematical Set intersections
    const normalizedJobSkills = jobSkills.map(skill => skill.toLowerCase());
    const normalizedResumeSkills = resumeSkills.map(skill => skill.toLowerCase());

    // 3. Set-Based Initialization
    const jobSkillsSet = new Set(normalizedJobSkills);
    const resumeSkillsSet = new Set(normalizedResumeSkills);

    // 4. Edge Case Interception
    // Prevent NaN (Not a Number) division-by-zero crashes if the JS array length is 0
    if (jobSkillsSet.size === 0) {
        return {
            matchScore: 0,
            matchedSkills: [],
            missingSkills: []
        };
    }

    // 5. Array Deductions & Set Intersections
    const matchedSkills = [];
    const missingSkills = [];

    // The jobSkills array holds the Canonical, properly cased names. We will iterate over it 
    // to preserve beautiful casing in the final JSON response, checking against our lowercase Sets.
    jobSkills.forEach(jobSkill => {
        const lowerJobSkill = jobSkill.toLowerCase();
        
        if (resumeSkillsSet.has(lowerJobSkill)) {
            matchedSkills.push(jobSkill);
        } else {
            missingSkills.push(jobSkill);
        }
    });

    // 6. Mathematical Synthesis
    const rawMatchPercentage = (matchedSkills.length / jobSkillsSet.size) * 100;
    
    // Clamp at 100 and chop off trailing decimals
    const matchScore = Math.min(Math.round(rawMatchPercentage), 100);

    return {
        matchScore,
        matchedSkills,
        missingSkills
    };
};

module.exports = calculateJobMatch;
