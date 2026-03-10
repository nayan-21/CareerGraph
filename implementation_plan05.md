# Day 5: Storing Resume Data in MongoDB Implementation Plan

Goal: Take the structured data (filename, filepath, extracted raw text, and deduplicated skills) that we successfully generated in Day 4 and save it permanently into our MongoDB Atlas database using Mongoose.

## Why are we doing this? (Placement Explanation)
Right now, our server accurately parses a resume and returns the JSON data to Postman, but immediately forgets it forever. By saving this parsed data into a MongoDB Document database (NoSQL), we allow our future matching algorithms to query millions of resumes instantly. 

We will use **Mongoose** to enforce a rigid schema onto our flexible MongoDB collections.
- **Validation**: Enforcing `required: true` prevents bad data from ever entering our system (e.g., stopping an empty resume from saving).
- **Indexing**: By adding an `index: true` flag to the `skills` array, we are significantly boosting database read performance. Without an index, querying for "React" requires scanning every single document (O(N)). With an index, MongoDB creates a specialized B-Tree mapping, instantly jumping straight to resumes with "React" (O(log N)).
- **FilePath Storage**: Saving the `filePath` ensures we can easily download or display the original PDF back to the user later.

## Proposed Changes

### 1. New Database Model
- **Create Folder**: `Server/models/`
#### [NEW] [Server/models/Resume.js](file:///c:/Users/Nayan/Downloads/CareerGraph/Server/models/Resume.js)
- **What it will do**:
  1. Define a rigid `Schema` requiring strings for the `fileName`, `filePath` and `extractedText`. Use `required: true` validations.
  2. Implement an array of strings for `skills`, attaching the `index: true` option for lightning-fast queries later.
  3. Export the Mongoose Model.

### 2. Update the Upload Route
#### [MODIFY] [Server/routes/resumeRoutes.js](file:///c:/Users/Nayan/Downloads/CareerGraph/Server/routes/resumeRoutes.js)
- **What it will do**:
  1. Import the [Resume](file:///c:/Users/Nayan/Downloads/CareerGraph/Server/services/resumeParser.js#5-30) Mongoose model.
  2. Inside the `/upload` endpoint, *after* parsing and skill extraction completes, instantiate a `new Resume({...})` object with the fresh data (including `filePath: req.file.path`).
  3. Call `await resume.save()` to write the data asynchronously to MongoDB Atlas.
  4. Return a **clean** JSON response to the API client, specifically just: `{ message, resumeId, fileName, skills }`. We will stop sending back the giant `resumeText` wall of string as it slows down network responses unnecessarily.

## Verification Plan
1. Ensure the server is connected to MongoDB.
2. Open Postman.
3. Make a `POST` request to `http://localhost:5000/api/resume/upload` using a resume.
4. Verify the API response returns a clean, concise JSON block featuring the new MongoDB `resumeId`.
5. Open the **MongoDB Atlas UI** in the browser, navigate to the `careergraph` database, and confirm the document is physically stored in the `resumes` collection, complete with the `filePath`!

## Final Step
Commit the progress to GitHub with the message: `Day 5: Configured advanced Mongoose schema and stored resume data in MongoDB`
