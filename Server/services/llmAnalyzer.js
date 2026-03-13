/**
 * Gemini LLM Analysis Service
 * 
 * Takes the raw quantitative ATS metrics and Job Description to generate a concise 
 * AI-powered qualitative review of the candidate.
 */

const generateInsights = async (resumeData, matchData, jobDescriptionText) => {
    try {
        // Safeguard 1: Instant backend validation to prevent silent fetch failure
        if (!process.env.GEMINI_API_KEY) {
            console.warn("⚠️ GEMINI_API_KEY is missing from .env. Skipping AI generation.");
            return { insights: "AI insights temporarily unavailable. Please configure the LLM API Key." };
        }

        // Safeguard 2: Deduplication and Sanitization
        // Mathematical Sets inherently drop duplicate strings. Spread them back into a clean array.
        const uniqueSkills = [...new Set(resumeData.skills)];

        // Safeguard 3: Aggressive Token Slicing
        // Exceptionally large Job Descriptions burn tokens and crash context windows. Map exclusively the first 1500 chars.
        const safeJobDescription = jobDescriptionText.slice(0, 1500);

        // 4. Constructing the rigid AI Prompt Template
        const promptText = `
        You are an expert technical recruiter AI. Analyze this candidate's profile against the job description.
        
        Candidate ATS Score: ${resumeData.atsScore}/100
        Resume Skills: ${uniqueSkills.join(', ')}
        
        Job Match Percent: ${matchData.matchScore}%
        Matched Skills: ${matchData.matchedSkills.join(', ')}
        Missing Skills: ${matchData.missingSkills.join(', ')}
        
        Job Description Snapshot: "${safeJobDescription}"
        
        Provide concise insights (max 150 words). Format your response strictly into these three headers:
        - Strengths
        - Weaknesses / Skill Gaps
        - Recommendations
        `;

        // 5. Network IO (Native Node fetch to Gemini 2.5 Flash)
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                contents: [{
                    parts: [{ text: promptText }]
                }]
            })
        });

        // Parse HTTPS response buffer
        const data = await response.json();

        // Safeguard 4: Defensive Parsing / Optional Chaining
        // Google APIs occasionally mutate structure or return errors. Safely drill down to the String.
        const insights = data?.candidates?.[0]?.content?.parts?.[0]?.text || "No actionable insights generated.";

        return {
            insights
        };

    } catch (error) {
        // Safeguard 5: Graceful Fallover
        // If the Network fails, API is down, or Rate Limits hit, DO NOT CRASH the Express Controller.
        console.error("Gemini API Error:", error.message);
        return {
            insights: "AI insights temporarily unavailable."
        };
    }
};

module.exports = generateInsights;
