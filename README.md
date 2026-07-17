# AI Code Auditor 🔍🤖

An AI-powered codebase auditing platform that performs multi-agent technical reviews of GitHub repositories. It evaluates repositories from four specialist perspectives (Security, Architecture, Performance, and Documentation) using **Retrieval-Augmented Generation (RAG)**, **Mongoose**, and **Google Gemini**.

## 🚀 Key Features

* **Multi-Agent Evaluation:** Utilizes coordinated AI agents (Security, Architecture, Performance, and Documentation) to perform deep code analysis.
* **Smart RAG Pipeline:** Chunks, embeds, and retrieves only the most relevant repository files to provide accurate context to the models.
* **Privacy-First History:** Stores audit results permanently in MongoDB but secures history locally in the browser's `localStorage` to ensure user privacy.
* **Dynamic Scoring:** Fair grading rules that scale with project simplicity, preventing false negatives.

---

## 📁 Project Structure

```text
├── backend/               # Express API backend
│   ├── controllers/      # Route controllers (audits, history, reports)
│   ├── database/         # MongoDB Atlas database connection
│   ├── model/            # Mongoose schemas
│   ├── routes/           # API router endpoints
│   └── services/         # RAG pipeline & specialist AI Agents
├── client/                # React (Vite) frontend application
│   ├── src/components/   # Reusable UI elements (Navbar, ScoreRing)
│   ├── src/pages/        # Application views (Home, History, Report)
│   └── src/services/     # Axios client API connection helper
└── README.md              # Project documentation
```

---

## 🛠️ Installation & Setup

### Prerequisites
* [Node.js](https://nodejs.org/) (v18 or higher)
* [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) database account
* [Google AI Studio](https://aistudio.google.com/) API Key (for Gemini)
* GitHub Personal Access Token (classic)

### 1. Backend Configuration
1. Navigate to the `backend` folder:
   ```bash
   cd backend
   ```
2. Create a `.env` file inside the `backend` folder:
   ```env
   PORT=3001
   MONGO_URI=your_mongodb_connection_string
   GITHUB_TOKEN=your_github_access_token
   GEMINI_API_KEY=your_gemini_api_key
   FRONTEND_URL=http://localhost:5173
   ```
3. Install dependencies and start the server:
   ```bash
   npm install --legacy-peer-deps
   node server.js
   ```

### 2. Frontend Configuration
1. Navigate to the `client` folder:
   ```bash
   cd ../client
   ```
2. Install dependencies and start the Vite dev server:
   ```bash
   npm install
   npm run dev
   ```

---

## 🔌 API Documentation

All requests support JSON bodies and CORS authorization.

### `POST /api/audit/`
Starts a new AI audit or updates the existing report for a repository.
* **Request Body:**
  ```json
  { "repoUrl": "https://github.com/username/repository" }
  ```
* **Success Response (201):**
  ```json
  {
    "audit": { "_id": "6a564c41...", "repoName": "...", "status": "completed" },
    "report": { "overallScore": 92, "summary": "...", "security": { ... } }
  }
  ```

### `GET /api/audit/all?ids=id1,id2`
Retrieves a list of past audits matching the comma-separated IDs provided.
* **Success Response (200):**
  ```json
  [
    { "_id": "6a564c41...", "repoName": "...", "status": "completed" }
  ]
  ```

### `GET /api/audit/:id`
Retrieves a single audit report by its database ID.
* **Success Response (200):**
  ```json
  {
    "_id": "6a564c41...",
    "repoName": "...",
    "result": { "overallScore": 92, "security": { ... } }
  }
  ```

---

## 🛡️ License

Distributed under the MIT License. See `LICENSE` for more information.
