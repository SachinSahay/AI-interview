# InterviewIQ — AI-Powered Career Intelligence Platform

InterviewIQ is a premium, client-server web application designed to help candidates prepare for interviews, optimize their resumes with ATS-compatible grading, practice with an adaptive AI interviewer, track DSA progress, and follow personalized learning roadmaps.

## 🚀 Project Architecture

The project is structured as a decoupled Client-Server architecture:

```
interviewiq/
├── frontend/          # Next.js Frontend (Runs on port 3001)
│   ├── src/
│   │   ├── app/       # UI routing & dashboard pages
│   │   └── lib/       # SINGLE SOURCE OF TRUTH (Shared types, constants, utilities)
│   └── ...
└── backend/           # Express.js Backend (Runs on port 5000)
    ├── src/
    │   ├── server.ts  # Express server setup
    │   ├── routes/    # REST API endpoints
    │   └── services/  # Mock AI service logic (imports shared resources from frontend)
    └── ...
```

---

## 🛠️ Tech Stack

- **Frontend**: Next.js, React, TailwindCSS, CSS Variables, Lucide Icons, and LocalStorage persistence.
- **Backend**: Node.js, Express, TypeScript, CORS.
- **Shared Code**: Centralized TypeScript types, global constants, and utility helpers residing in `frontend/src/lib/` to avoid code duplication.

---

## 🏃 Getting Started

To run the application locally, you will need to start both the backend server and the frontend Next.js server.

### 1. Start the Backend Server First

```bash
cd backend
npm install
npm run dev
```
The backend service will run on **`http://localhost:5000`** with the following endpoints:
* `GET  /api/health` — API health check
* `POST /api/resume/analyze` — Analyze resume ATS compatibility
* `POST /api/interview/greeting` — Get custom interview opening greeting
* `POST /api/interview/question` — Generate adaptive interview questions
* `POST /api/interview/reaction` — Evaluate interviewer facial reactions
* `POST /api/feedback/generate` — Generate answer breakdown, score, and analytics
* `POST /api/roadmap/generate` — Generate study prep roadmap

### 2. Start the Frontend Next.js Server

```bash
cd frontend
npm install
npm run dev
```
The frontend will run on **`http://localhost:3001`** (or fallback to port `3000`/`3002` if `3001` is occupied).

---

## 💎 Design System & Shared Source of Truth

We use a single-source-of-truth file structure inside the **`frontend/src/lib/`** directory to keep both the client and server synchronized without duplicate code:

1. **Types** (`frontend/src/lib/types.ts`): Holds unified interface definitions for `User`, `Feedback`, `Interview`, `Resume`, and `Roadmap`.
2. **Constants** (`frontend/src/lib/constants.ts`): Houses target roles, difficulty levels, interviewer behaviors, role keywords, and interview question banks.
3. **Utilities** (`frontend/src/lib/utils.ts`): Contains shared helper functions like `clampScore()` and Fisher-Yates `shuffleArray()`.

The backend references these resources directly:
```typescript
import type { Resume, Feedback } from '../../../frontend/src/lib/types';
import { TECHNICAL_QUESTIONS } from '../../../frontend/src/lib/constants';
```
