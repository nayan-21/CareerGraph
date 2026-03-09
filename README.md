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

## 🔜 Next Steps
- Implement PDF Parsing to extract data from uploaded resumes.
- Define Mongoose Models (e.g., User, Application) to store parsed data.
- Build RESTful API routes for user authentication and data retrieval.
