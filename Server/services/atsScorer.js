/**
 * Advanced multi-factor ATS scoring engine.
 * Evaluates resume quality based on a 7-factor model resulting in a 1-100 score.
 * 
 * @param {string} text - The full extracted raw text from the resume.
 * @param {Array<string>} skills - Array of extracted skills.
 * @returns {Object} - Result object containing { atsScore, atsBreakdown }
 */
const calculateATSScore = (text, skills) => {
    let score = 0;
    const lowerText = text.toLowerCase();

    // 1. Skill Strength (max 20)
    // Using Set to ensure uniqueness as requested
    const uniqueSkills = new Set(skills.map(s => s.toLowerCase()));
    const numSkills = uniqueSkills.size;
    
    let skillsScore = 5; // default for 0-3 skills
    if (numSkills >= 10) skillsScore = 20;
    else if (numSkills >= 7) skillsScore = 15;
    else if (numSkills >= 4) skillsScore = 10;

    // 2. Experience Quality (max 20)
    let experienceScore = 5; // default (no experience detected)
    const expKeywords = ['experience', 'internship', 'developer', 'engineer', 'worked', 'company'];
    const expMatches = expKeywords.filter(k => lowerText.includes(k)).length;
    
    if (expMatches >= 4) {
        experienceScore = 20;
    } else if (expMatches >= 2) {
        experienceScore = 15;
    } else if (lowerText.includes('internship') || expMatches === 1) {
        experienceScore = 10;
    }

    // 3. Impact / Achievements (max 20)
    let impactScore = 0;
    
    // Safeguard: Prevent duplicate link inflation
    const linksFound = new Set();
    const linkRegexes = [
        /vercel\.app/g,
        /netlify\.app/g,
        /live:/g,
        /demo:/g,
        /github\.com/g
    ];
    
    linkRegexes.forEach(regex => {
        const matches = lowerText.match(regex);
        if (matches) {
            matches.forEach(m => linksFound.add(m));
        }
    });
    
    // +3 points per *unique* deployed/repo link instance type matched
    impactScore += (linksFound.size * 3);

    // Existing metric detection
    const impactRegexes = [
        /\d+%/g,
        /\$\d+/g,
        /\d+\s*(users|clients|projects|customers)/g
    ];
    let totalImpacts = 0;
    impactRegexes.forEach(regex => {
        const matches = lowerText.match(regex);
        if (matches) totalImpacts += matches.length;
    });

    if (totalImpacts >= 5) impactScore += 20;
    else if (totalImpacts >= 3) impactScore += 15;
    else if (totalImpacts >= 1) impactScore += 10;
    
    // Clamp to max 20
    impactScore = Math.min(impactScore, 20);

    // 4. Project Quality (max 15)
    let projectScore = 0;
    // Safeguard: Removed "github" to prevent double-counting with impactScore
    const projectIndicators = ['projects', 'built', 'developed', 'application', 'system'];
    const projMatches = projectIndicators.filter(k => lowerText.includes(k)).length;

    if (projMatches >= 3) projectScore = 15;
    else if (projMatches === 2) projectScore = 10;
    else if (projMatches === 1) projectScore = 5;

    // 5. Education Score (max 10)
    let educationScore = 2; // none
    
    // Safeguard: Lexical separation via word boundaries
    const csItRegex = /\b(computer science|information technology|information & communication technology|ict|software engineering)\b/;
    const otherEngRegex = /\b(engineering|btech|b\.e|mtech|bachelor of technology)\b/;
    const nonTechRegex = /\b(bachelor|bsc|msc|phd|degree|university|college)\b/;

    if (csItRegex.test(lowerText)) {
        educationScore = 10;
    } else if (otherEngRegex.test(lowerText)) {
        educationScore = 7;
    } else if (nonTechRegex.test(lowerText)) {
        educationScore = 4;
    }

    // 6. Language Quality (max 10)
    let languageScore = 2;
    const actionVerbs = ['developed', 'designed', 'implemented', 'built', 'optimized', 'created', 'engineered'];
    const verbMatches = actionVerbs.filter(k => lowerText.includes(k)).length;

    if (verbMatches >= 7) languageScore = 10;
    else if (verbMatches >= 4) languageScore = 8;
    else if (verbMatches >= 1) languageScore = 5;

    // 7. Resume Structure (max 5)
    let structureScore = 0;
    
    // Safeguard: Synonym consolidation using word boundaries
    const sectionGroups = [
        /\b(education)\b/,
        /\b(experience|work history|employment)\b/,
        /\b(projects|portfolio)\b/,
        /\b(skills|technical skills|profile|summary)\b/
    ];
    
    const sectionMatches = sectionGroups.filter(regex => regex.test(lowerText)).length;

    if (sectionMatches >= 3) structureScore = 5;
    else if (sectionMatches === 2) structureScore = 3;
    else if (sectionMatches === 1) structureScore = 1;

    // Final Calculate
    const totalScore = skillsScore + experienceScore + impactScore + projectScore + educationScore + languageScore + structureScore;
    const atsScore = Math.min(totalScore, 100);

    return {
        atsScore,
        atsBreakdown: {
            skillsScore,
            experienceScore,
            impactScore,
            projectScore,
            educationScore,
            languageScore,
            structureScore
        }
    };
};

module.exports = calculateATSScore;
