/**
 * Dictionary mapping canonical skill names to their known variations.
 * This ensures "React.js" and "reactjs" both map to the clean "React" array element.
 */
const skillDictionary = {

  // Frontend
  "React": ["react", "react.js", "reactjs", "react js"],
  "Next.js": ["next", "nextjs", "next.js"],
  "Vue.js": ["vue", "vue.js", "vuejs"],
  "Angular": ["angular", "angular.js", "angularjs"],
  "JavaScript": ["javascript", "js", "java script"],
  "TypeScript": ["typescript", "ts"],
  "HTML": ["html", "html5"],
  "CSS": ["css", "css3"],
  "TailwindCSS": ["tailwind", "tailwind css"],
  "Bootstrap": ["bootstrap", "bootstrap5"],
  "Redux": ["redux", "redux toolkit"],

  // Backend
  "Node.js": ["node", "nodejs", "node.js", "node js"],
  "Express.js": ["express", "express.js", "expressjs"],
  "Django": ["django"],
  "Flask": ["flask"],
  "Spring Boot": ["spring boot", "springboot"],
  "ASP.NET": ["asp.net", "aspnet"],

  // Programming Languages
  "Java": ["java", "core java", "j2ee"],
  "Python": ["python", "python3", "py"],
  "C": ["c language", "ansi c"],
  "C++": ["c++", "cpp"],
  "C#": ["c#", "c sharp"],
  "Go": ["golang", "go language", "go"],
  "Rust": ["rust"],
  "Kotlin": ["kotlin"],
  "Swift": ["swift"],

  // Databases
  "MongoDB": ["mongodb", "mongo", "mongo db"],
  "MySQL": ["mysql"],
  "PostgreSQL": ["postgresql", "postgres"],
  "SQL": ["sql"],
  "SQLite": ["sqlite"],
  "Redis": ["redis"],
  "Firebase": ["firebase", "firebase database"],

  // DevOps / Cloud
  "Docker": ["docker", "containerization"],
  "Kubernetes": ["kubernetes", "k8s"],
  "AWS": ["aws", "amazon web services"],
  "Azure": ["azure", "microsoft azure"],
  "Google Cloud": ["gcp", "google cloud"],
  "CI/CD": ["ci/cd", "continuous integration", "continuous deployment"],
  "Jenkins": ["jenkins"],
  "Terraform": ["terraform"],

  // Version Control
  "Git": ["git"],
  "GitHub": ["github"],
  "GitLab": ["gitlab"],
  "Bitbucket": ["bitbucket"],

  // Testing
  "Jest": ["jest"],
  "Mocha": ["mocha"],
  "Chai": ["chai"],
  "Selenium": ["selenium"],
  "Cypress": ["cypress"],

  // API / Networking
  "REST API": ["rest", "rest api", "restful api"],
  "GraphQL": ["graphql"],
  "Postman": ["postman"],
  "Swagger": ["swagger"],

  // Data / AI
  "Machine Learning": ["machine learning", "ml"],
  "Deep Learning": ["deep learning", "dl"],
  "TensorFlow": ["tensorflow"],
  "PyTorch": ["pytorch"],
  "Pandas": ["pandas"],
  "NumPy": ["numpy"],
  "Scikit-learn": ["scikit-learn", "sklearn"],

  // Mobile
  "React Native": ["react native"],
  "Flutter": ["flutter"],
  "Android": ["android"],
  "iOS": ["ios"],

  // Other tools
  "Linux": ["linux", "ubuntu"],
  "Nginx": ["nginx"],
  "Webpack": ["webpack"],
  "Babel": ["babel"],
  "Socket.io": ["socket.io", "socketio"]

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
    // We replace anything that isn't a letter, number, dot, or plus sign (like C++) with a space.
    // However, if a word is immediately followed by a period or comma without a space, we need 
    // to ensure it gets padded correctly so `.includes(' docker ')` doesn't skip it.
    normalizedText = normalizedText.replace(/[^a-z0-9.+]/g, ' ');
    
    // Explicitly replace standalone periods that act as sentence enders, so "docker." becomes "docker "
    // (but preserving . in "node.js")
    normalizedText = normalizedText.replace(/(?<!node)\.(?!\js)/g, ' ');

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
