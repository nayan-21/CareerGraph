/**
 * Calculates a 1-100 ATS (Applicant Tracking System) score based on resume content.
 * 
 * @param {string} text - The raw text extracted from the PDF.
 * @param {Array<string>} skills - The array of normalized skills.
 * @returns {Object} - Contains the unified { atsScore } and analytical { atsBreakdown }
 */
const calculateATSScore = (text, skills) => {
    // 1. Skills Score (Max 40 points)
    // Guarantee uniqueness by casting to lowercase and inserting into a Set
    const uniqueSkills = new Set(skills.map(s => s.toLowerCase()));
    const skillsScore = Math.min(uniqueSkills.size * 5, 40);

    // 2. Depth / Length Score (Max 20 points)
    let depthScore = 0;
    if (text.length > 2000) {
        depthScore = 20;
    } else if (text.length > 1000) {
        depthScore = 10;
    }

    // 3. Structure Score (Max 40 points)
    // Force the massive string to lowercase for case-insensitive section matching
    const lowerText = text.toLowerCase();
    
    let structureScore = 0;
    
    // +20 for Evidence of Education
    if (lowerText.includes("education")) {
        structureScore += 20;
    }
    
    // +20 for Evidence of Execution
    if (lowerText.includes("experience") || lowerText.includes("projects")) {
        structureScore += 20;
    }

    // 4. Mathematical Synthesis
    const totalScore = Math.min(skillsScore + depthScore + structureScore, 100);

    return {
        atsScore: Math.round(totalScore),
        atsBreakdown: {
            skillsScore,
            depthScore,
            structureScore
        }
    };
};

module.exports = calculateATSScore;
