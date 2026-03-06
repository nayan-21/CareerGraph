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

## 🔜 Next Steps
- Connect to MongoDB database securely using `.env` connection strings.
- Define initial Mongoose Models for the application.
- Build RESTful API routes.
