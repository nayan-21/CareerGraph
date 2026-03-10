/**
 * Dictionary mapping canonical skill names to their known variations.
 * This ensures "React.js" and "reactjs" both map to the clean "React" array element.
 */
const skillDictionary = {
    "React": ["react", "react.js", "reactjs", "react js"],
    "Node.js": ["node", "nodejs", "node.js", "node js"],
    "JavaScript": ["javascript", "js", "java script"],
    "HTML": ["html", "html5"],
    "CSS": ["css", "css3", "tailwind css", "bootstrap"],
    "Express.js": ["express", "express.js", "expressjs"],
    "MongoDB": ["mongodb", "mongo", "mongo db"],
    "Python": ["python", "py", "python3"],
    "Java": ["java", "core java", "j2ee"],
    "SQL": ["sql", "mysql", "postgresql", "postgres"],
    "Git": ["git", "github", "gitlab"],
    "Docker": ["docker", "containerization"],
    "AWS": ["aws", "amazon web services"],
    "TypeScript": ["typescript", "ts"],
    "C++": ["c++", "cpp", "c/c++"]
};

/**
 * Extracts clean, deduplicated skill names from raw resume text.
 * 
 * @param {string} resumeText - The raw text extracted from the PDF
 * @returns {Array<string>} - A sorted array of extracted Canonical skill names
 */
const extractSkills = (resumeText) => {
    // 1. Text Normalization
    // Convert text to lowercase
    let normalizedText = resumeText.toLowerCase();
    
    // Remove punctuation (keeping alphanumeric and spaces)
    // We replace anything that isn't a letter, number, dot, or plus sign (like C++) with a space
    normalizedText = normalizedText.replace(/[^a-z0-9.+]/g, ' ');
    
    // Normalize spaces (convert multiple spaces into a single space)
    normalizedText = normalizedText.replace(/\s+/g, ' ').trim();

    // 2. Skill Detection (Using the Dictionary)
    const detectedSkills = [];

    // Loop through every official skill inside our dictionary
    for (const [canonicalSkill, variations] of Object.entries(skillDictionary)) {
        // For each official skill, loop through its known variations
        for (const variation of variations) {
            // If the normalized resume text includes the variation string
            // We use word boundaries to avoid false positives (e.g. matching 'js' inside 'ejs')
            // Since we removed most punctuation, we just check .includes on padded text 
            const paddedText = ` ${normalizedText} `;
            if (paddedText.includes(` ${variation} `)) {
                // Add the Canonical name (e.g., "React", not "reactjs") to our list
                detectedSkills.push(canonicalSkill);
                
                // Break out of the inner loop to avoid adding the same skill multiple times 
                // if multiple variations were found (e.g., both "react" and "react.js" in the same resume)
                break;
            }
        }
    }

    // 3. Sort & Deduplicate
    // Even though we break inner loops, using a Set mathematically guarantees no duplicates ever exist
    const uniqueSkills = [...new Set(detectedSkills)];

    // Sort the final array alphabetically for a professional JSON response
    return uniqueSkills.sort();
};

module.exports = extractSkills;
