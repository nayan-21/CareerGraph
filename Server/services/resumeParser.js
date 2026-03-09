const fs = require('fs');
const pdf = require('pdf-parse');
const path = require('path'); // Added path module

/**
 * Reads a PDF file from the given path and extracts its raw text content.
 * @param {string} filePath - The absolute or relative path to the PDF file.
 * @returns {Promise<string>} - The extracted text from the PDF.
 */
const parseResume = async (filePath) => {
    try {
        // Resolve the absolute path of the uploaded file
        // `req.file.path` usually comes back as 'uploads\filename.pdf'
        // By using path.resolve(), we ensure Node finds it from the root of our server folder
        const absolutePath = path.resolve(process.cwd(), filePath);

        // 1. Read the physical file from the disk into a data buffer
        const dataBuffer = fs.readFileSync(absolutePath);
        
        // 2. Pass the buffer to pdf-parse to extract the information
        const data = await pdf(dataBuffer);
        
        // 3. Return just the extracted text string
        return data.text;
    } catch (error) {
        console.error("Error parsing the PDF resume:", error);
        throw new Error("Failed to parse the resume file.");
    }
};

module.exports = parseResume;
