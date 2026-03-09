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

## 🔜 Next Steps
- Implement AI Integration (e.g., Gemini or OpenAI) to analyze the raw extracted text into structured JSON data (Skills, Education, Experience).
- Define Database Models (User, Job, Application) to permanently store the structured user intelligence.
- Implement user authentication (JWT) to securely associate uploaded resumes with specific accounts.
