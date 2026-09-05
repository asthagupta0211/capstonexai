# Capstonex AI — Final-Year Project Idea Generator & Mentor

An intelligent, AI-powered platform designed for final-year computer science and engineering students. It synthesizes personalized, academically rigorous capstone proposals, conducts multi-criteria trade-off comparisons, generates tiered MVP feature breakdowns, provides justified technology stack matrices, constructs practical 10-phase roadmaps, and offers an AI Mentor Lab for stress-testing existing project ideas.

> **Notice:** All mock data, fallback stores, and dummy datasets have been completely removed. This platform connects directly to **MongoDB Atlas** for database persistence and **Groq Cloud API (Llama 3.3 70B)** for real-time model inference.

---

## 🚀 Live Connection Setup

To connect your real database and AI API, open the `.env` file in the root directory:

```env
# Server Configuration
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:5173

# 1. Database: MongoDB Atlas
# Paste your Atlas connection URI here:
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/capstonex?retryWrites=true&w=majority

# 2. Authentication Secret
JWT_SECRET=super_secret_capstonex_jwt_key_2026
JWT_EXPIRES_IN=7d

# 3. AI Inference: Groq Cloud API
# Get your free key at: https://console.groq.com/keys
GROQ_API_KEY=gsk_your_groq_api_key_here
GROQ_MODEL=llama-3.3-70b-versatile
```

Once your keys are added to `.env`, restart the server to establish live connections!

---

## 🌟 Key Features

1. **Student Profile Ingestion:**
   - Interactive technical skill tagging.
   - Domain preference selection (AI/ML, Healthcare, Cybersecurity, IoT, FinTech, Distributed Systems).
   - Target difficulty level (Beginner, Intermediate, Advanced).
   - Semester timeline slider (Weeks and Hours/week).
   - Real-world constraints (Zero cloud budget, local model execution, public datasets only).

2. **AI Project Idea Generation (Groq Llama 3.3 70B):**
   - Title, one-line pitch, and real-world problem statement.
   - Concrete proposed solution and target users.
   - Comprehensive score indicators: Feasibility (%), Academic Impact (%), Novelty (%), Skill Match (%), and Live Demo Appeal (%).
   - Recommended technology stack summary.
   - Evaluation risks and pitfalls.

3. **Multi-Idea Comparison Matrix:**
   - Side-by-side comparative table evaluating 2 to 4 project ideas simultaneously.
   - Strategic mentor trade-off insights (e.g. Safest implementation vs Highest presentation appeal).
   - 1-click selection to architect complete project blueprint.

4. **Capstone Architecture Blueprint & 10-Phase Roadmap:**
   - **3-Tiered Feature Scope:** Must-Have MVP features vs Good-to-Have vs Future Scope.
   - **Justified Tech Stack Matrix:** Frontend, Backend, Database, AI Model, APIs, Deployment, and Developer Tools — each with an explicit technical rationale.
   - **System Architecture Summary:** High-level component data flow explanation.
   - **10-Phase Development Roadmap:** Sequential phases from Requirements to Defense Rehearsal, with weekly durations, interactive task checklists, and evaluation deliverables.
   - **1-Click Markdown Export:** Download a complete project blueprint for academic submission.

5. **AI Mentor Lab & Stress-Tester:**
   - Submit your own project ideas from coursework or brainstorms.
   - Objective critique report: Key Strengths, Critical Weaknesses, Missing Features, Technical Pitfalls, and Actionable Recommendations with expected evaluation benefits.
   - Differentiation advice on how to avoid cliché student projects.
   - Review history saved in MongoDB Atlas.

6. **System Diagnostics & Status Monitor:**
   - Real-time verification of MongoDB Atlas connection and Groq LLM API responsiveness.

---

## 🛠️ Technology Stack

- **Frontend:** React 19, TypeScript, Vite, Vanilla CSS Design Tokens (Glassmorphism & dark theme), Lucide Icons, Canvas Confetti.
- **Backend:** Node.js v24, Express, TypeScript, Zod Schema Validation, Helmet, CORS, Rate Limiting.
- **Database:** MongoDB Atlas via Mongoose.
- **AI Provider:** Groq Cloud SDK (`llama-3.3-70b-versatile`).
- **Testing:** Vitest for unit & schema validation testing.

---

## 🏃 Running the Application

### Development Mode (Concurrent Frontend & Backend)
```bash
# In the project root:
npm run dev
```
- Frontend Dev Server: `http://localhost:5173`
- Backend API: `http://localhost:5000/api/v1`

### Production Mode (Single-Port Unified Server)
```bash
# 1. Build frontend and backend
npm run build

# 2. Start unified server
npm start
```
- Access complete app at: `http://localhost:5000`
- Check health diagnostics at: `http://localhost:5000/api/v1/health`

### Running Unit Tests
```bash
cd backend
npm test
```

---

## 📡 API Reference (`/api/v1/`)

- `GET  /api/v1/health` — Real-time database and Groq connection status
- `POST /api/v1/auth/register` — Register new student account
- `POST /api/v1/auth/login` — Sign in with email & password
- `POST /api/v1/auth/demo` — Quick student session initialization
- `GET  /api/v1/profile` — Fetch student profile from MongoDB Atlas
- `POST /api/v1/profile` — Upsert student skills & preferences
- `POST /api/v1/ideas/generate` — Generate ideas via Groq Llama 3.3
- `GET  /api/v1/ideas` — List ideas for current student
- `PATCH /api/v1/ideas/:id/save` — Bookmark idea in MongoDB Atlas
- `DELETE /api/v1/ideas/:id` — Remove idea
- `POST /api/v1/ideas/:id/plan` — Generate 10-phase blueprint & roadmap
- `GET  /api/v1/plans/export/:id` — Download Markdown blueprint file
- `POST /api/v1/mentor/analyze` — Critique custom idea via Groq LLM
- `GET  /api/v1/mentor/reviews` — Fetch past mentor critique reports
