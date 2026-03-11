# CareerGraph - Placement Project

This project is a MERN-stack application being developed for placement preparation. It is designed to demonstrate strong backend architecture, separation of concerns, and best practices in Node.js development.

## 🚀 Progress Tracking

### [Day 1] - Initial Setup
- **[x] Step 1: Project Structure Creation** 
  - Separated concerns into `frontend` and `backend` (Server) directories.
- **[x] Step 2: Backend Initialization** 
  - Initialized Node package (`npm init -y`).
  - Installed core dependencies: `express` (routing), `mongoose` (database ODM), `cors` (cross-origin utility), and `dotenv` (environment configuration).
  - Configured `package.json` scripts (`start` and `dev` using `nodemon` for better dev-experience).
- **[x] Step 3: Express Server Boilerplate**
  - Created `server.js` with basic middleware setup (`cors`, `express.json()`).
  - Added a basic test route (`/`).
  - Server successfully runs on port 5000 (configurable via `.env`).
- **[x] Step 4: Version Control (Git) & GitHub**
  - Initialized Git repository.
  - Configured `.gitignore` to secure sensitive files (`.env`) and exclude heavy dependencies (`node_modules/`).
  - Successfully pushed out initial commit to the `main` branch.

### [Day 2] - Resume Upload API (Multer)
- **[x] Step 5: Connect to Database (MongoDB)**
  - Successfully connected the Express server to a MongoDB Atlas cluster using Mongoose.
  - Implemented secure credential management via `.env` variables.
- **[x] Step 6: File Upload Infrastructure (Multer)**
  - Installed `multer` and `pdf-parse`.
  - Created `Server/routes/resumeRoutes.js` to isolate resume API logic.
  - Configured `multer.diskStorage` to reliably save uploaded resumes to `uploads/` directory with unique timestamped filenames.
  - Successfully connected router as middleware in `server.js` (`app.use('/api/resume', resumeRoutes)`).
  - Validated PDF upload functionality using Postman.
  - Secured the repository by adding `uploads/` to `.gitignore`.

### [Day 3] - Resume PDF Parsing API
- **[x] Step 7: Text Extraction Infrastructure**
  - Implemented service-oriented architecture by creating `services/resumeParser.js` to isolate business logic from routing.
  - Configured `pdf-parse@1.1.1` to reliably convert raw PDF buffer data into human-readable text strings.
  - Addressed and documented a real-world library deprecation issue related to Node 22 buffer handling.
  - Updated the `/api/resume/upload` route to asynchronously parse incoming files immediately after Multer saves them to the disk.
  - Successfully returned 1,600+ characters of raw resume text back to the Postman client in real-time.

### [Day 4] - Skill Extraction Utility
- **[x] Step 8: Dictionary-Based Skill Extraction**
  - Created a pure utility function `utils/extractSkills.js` to normalize unstructured resume text.
  - Implemented a canonical dictionary mapping to resolve skill aliases (e.g., `React.js`, `ReactJS` → `React`).
  - Integrated JavaScript `Set` to enforce mathematical deduplication of extracted skills.
  - Connected the extractor into `resumeRoutes.js` to automatically parse and return structured skills upon every successful file upload.
  - Transformed the unstructured PDF data into a polished, sortable JSON array for the frontend.

### [Day 5] - Database Persistence Layer
- **[x] Step 9: Designed Mongoose Schema**
  - Crafted `models/Resume.js` enforcing strict typing for PDF storage.
  - Implemented real-world indexing (`index: true`) on the `skills` array to achieve O(log N) read speeds for future matchmaking algorithms.
  - Added `required: true` validation to the `fileName`, `filePath`, and `extractedText` fields to prevent data corruption.
- **[x] Step 10: Connected Routes to MongoDB**
  - Updated the upload routing logic to asynchronously create Document instances (`new Resume({...})`) post-extraction.
  - Stripped massive text blocks from the API response to save bandwidth, returning only the lean MongoDB Document ID alongside the detected array.

### [Day 6] - Controller Architecture & Fetch API
- **[x] Step 11: Modular Business Logic**
  - Introduced the MVC (Model-View-Controller) pattern, creating `controllers/resumeController.js` to decouple heavy database queries from routing logic.
- **[x] Step 12: Advanced MongoDB Querying**
  - Implemented `router.get('/:id')` with strict `mongoose.Types.ObjectId` validation to intercept malformed requests.
  - Developed `router.get('/')` to return all applicants, integrating mathematical `.skip()` and `.limit()` mechanics for pagination, and `.sort({createdAt: -1})` for reverse-chronological ordering.
  - Employed Database Projection (`.select('-extractedText')`) across all GET routes to violently strip raw PDF text strings from DB responses, optimizing server memory and network bandwidth.
### [Day 7] - The Candidate Intelligence Engine (ATS)
- **[x] Step 13: Mathematical Evaluation Algorithm**
  - Engineered `services/atsScorer.js`, enabling the server to quantitatively score uploaded resumes via rigorous keyword matrices.
  - Deployed defensive programming to map skills arrays to JavaScript `Set()`s for absolute uniqueness, and forcefully applied `.toLowerCase()` across the raw PDF string to neutralize capitalization edge-cases during structural detection (Education, Experience, Projects).
- **[x] Step 14: Analytical Sub-Document Schemas**
  - Updated the Mongoose Schema to permanently trap the Integer `atsScore` and the detailed JSON `atsBreakdown`.
  - Stated the pipeline logic directly inside the `/upload` route *after* extraction but prior to `.save()`, guaranteeing scores are dynamically generated against the fresh payload data every single time.

## 🔜 Next Steps
- Implement Authentication (JWT/Bcrypt) to securely associate uploaded resumes with specific User accounts. 
- Develop Job Posting models for recruiters to upload position requirements.
