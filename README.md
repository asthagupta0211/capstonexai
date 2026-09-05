# Capstonex AI — Intelligent Capstone Architect & Faculty Mentor

[![Platform](https://img.shields.io/badge/Platform-Capstonex.AI-6366f1.svg)](https://capstonexai.vercel.app/)
[![AI Engine](https://img.shields.io/badge/AI%20Engine-Groq%20Cloud%20LLaMA--3.3-06b6d4.svg)](https://groq.com/)
[![Database](https://img.shields.io/badge/Database-MongoDB%20Atlas%20Cloud-10b981.svg)](https://www.mongodb.com/atlas)
[![Integrity](https://img.shields.io/badge/Integrity-Zero%20Mock%20Data-f59e0b.svg)]()
[![Tests](https://img.shields.io/badge/Tests-16%20Passed-success.svg)]()
[![License](https://img.shields.io/badge/License-MIT-blue.svg)]()

> **Production Deployment:**
> - **Live Frontend (Vercel):** [https://capstonexai.vercel.app/](https://capstonexai.vercel.app/)
> - **Live API Backend (Render):** [https://capstonexai.onrender.com/api/v1/health](https://capstonexai.onrender.com/api/v1/health)

---

## 🎯 1. Chosen Challenge Vertical

**Vertical:** **Education Technology / Academic Engineering Mentorship & Career Readiness**

### Persona & Problem Context
Final-year engineering and computer science students face recurring roadblocks during their capstone cycle:
1. **Cliché & Rejected Proposals:** Submitting overused ideas (generic e-commerce, movie recommenders, basic chat apps) that faculty committees reject for lack of originality and research value.
2. **Scope Creep & Tech Mismatch:** Selecting technologies beyond the team's skillset or building without tiering features leads to unfinished prototypes before graduation.
3. **Lack of Continuous Faculty Feedback:** University guides manage dozens of teams and cannot provide line-by-line architectural critique until late midterm reviews.

**Capstonex AI** acts as an **always-on Academic Capstone Architect & Faculty Mentor** that bridges student skills and semester deadlines with production-grade engineering proposals, justified technology stacks, multi-criteria trade-off comparisons, and objective stress-testing.

---

## 🧠 2. Approach and Logic

Capstonex AI enforces a **100% Real-Data Policy** (zero mock data, zero hardcoded JSON fallbacks). The system operates on context-aware decision logic:

```
┌─────────────────────────┐     ┌────────────────────────┐     ┌────────────────────────┐
│   Student Input Profile  │ ──> │   Groq Cloud LLaMA-3.3 │ ──> │  Strict Zod Validation │
│ (Skills, Timeline, Budget)│     │  (70B Parameter Engine) │     │  (Anti-Hallucination)  │
└─────────────────────────┘     └────────────────────────┘     └────────────────────────┘
                                                                            │
                                                                            ▼
┌─────────────────────────┐     ┌────────────────────────┐     ┌────────────────────────┐
│  AI Faculty Mentor Lab  │ <── │ 10-Phase Roadmap & MVP │ <── │  MongoDB Atlas Cluster │
│  (Vulnerability Defense)│     │   (Markdown Export)    │     │  (Cloud Persistence)   │
└─────────────────────────┘     └────────────────────────┘     └────────────────────────┘
```

### Contextual Decision-Making Logic
- **Skill Fit vs. Stretch Factor:** Algorithms evaluate student proficiency against recommended technologies (e.g. recommending FastAPI if Python is known, rather than introducing Go unprompted).
- **Temporal Feasibility:** If the student specifies an 8-week mini-project, the engine restricts scope to Core MVP features; for 24-week year-long capstones, it includes advanced CI/CD pipelines and performance testing.
- **Resource Constraints Enforcement:** Strict compliance with student constraints (e.g. "$0 cloud budget" enforces local Docker, Supabase free tier, or SQLite/MongoDB Atlas M0).
- **Anti-Hallucination Guardrails:** AI responses pass through strict Zod schema validation (`backend/src/ai/validator.ts`) with intelligent array unwrapping and type coercion to guarantee 100% schema compliance before saving.

---

## ⚙️ 3. How the Solution Works

### Key Modules & Capabilities

1. **Student Profile Ingestion Cockpit:**
   - Ingests technical languages, frameworks, domain interests (AI/ML, Cybersecurity, HealthTech, IoT, FinTech, Cloud), timeline slider (4–24 weeks), and budget limits.
   - Includes **1-Click Hackathon Presets** (AI & Vision, Cybersecurity SAST, HealthTech, Cloud SaaS) for immediate testing.

2. **Capstone Idea Generation Engine:**
   - Powered live by **Groq Cloud LLM (`llama-3.3-70b-versatile`)**.
   - Outputs complete proposals: Title, pitch, real-world problem, proposed solution, target users, and 5 quantitative metrics (Feasibility %, Skill Fit %, Academic Impact %, Novelty %, Demo Appeal %).

3. **Multi-Criteria Tradeoff Matrix:**
   - Compares 2 to 4 candidate proposals side-by-side.
   - Automatically computes trade-off insights: **Safest Implementation** (highest completion certainty), **Highest Academic Impact** (faculty committee praise), and **Best Demo Value** (visual viva appeal).

4. **Capstone Architecture Blueprint & 10-Phase Roadmap:**
   - **3-Tier Feature Scope:** Must-Have MVP vs Good-to-Have vs Future Vision.
   - **Justified Technology Stack:** Frontend, Backend, Database, AI Engine, Deployment, and Tools — each with an explicit architectural justification.
   - **Interactive Sprint Completion Tracker:** Live progress bar with checkable deliverables and micro-confetti particle bursts upon task completion.
   - **1-Click Markdown Export:** Generates formatted documentation ready for academic thesis submission.

5. **AI Faculty Mentor Lab & Stress-Tester:**
   - Students submit any custom proposal to receive objective, faculty-grade evaluation.
   - Generates: Key Academic Strengths, Critical Vulnerabilities, Missing Features Evaluators Expect, Technical Pitfalls, Actionable Recommendations, and advice on standing out from cliché projects.

---

## 📌 4. Assumptions Made

1. **User Background:** The student user possesses foundational knowledge of software engineering (algorithms, basic syntax, and web concepts).
2. **Connectivity:** The client has internet access to communicate with the Render API backend, Groq Cloud inference, and MongoDB Atlas.
3. **Academic Scope:** The generated proposals are calibrated for undergraduate/graduate engineering curricula adhering to standard university rubrics (Literature Review, System Architecture, Testing, Viva Presentation).
4. **Hardware Environment:** Real-world hardware constraints (e.g., student laptops without dedicated GPUs) are treated as hard boundaries during technology stack justification.

---

## 🛡️ 5. Evaluation Focus Areas

### A. Code Quality (Structure, Readability, Maintainability)
- Modular Monolith architecture separating concerns: `controllers`, `services`, `routes`, `middleware`, `models`, `schemas`, and `tests`.
- 100% TypeScript across backend and frontend with strict type definitions (`frontend/src/types/index.ts`, `backend/src/types/index.ts`).
- Clean Vanilla CSS design system (`tokens.css`, `components.css`) avoiding bulky CSS framework bloat.

### B. Security (Safe and Responsible Implementation)
- **Zero Secrets in Git:** Sensitive keys (`GROQ_API_KEY`, `MONGODB_URI`, `JWT_SECRET`) are secured via `.env` and strictly guarded by `.gitignore`.
- **Authentication:** Salted BCrypt hashing (10 rounds) with encrypted JWT tokens and bearer authorization.
- **Defensive Headers & CORS:** Configured with `helmet` and fine-grained CORS origins.
- **Rate Limiting:** `express-rate-limit` prevents brute force and DDoS on public API routes.
- **Input Sanitization:** All payload parameters are validated against strict Zod schemas before hitting business logic.

### C. Efficiency (Optimal Resource Utilization)
- **Vite Code Splitting:** Split vendor, icon, and utility chunks (`vendor`, `icons`, `fx`, `index`), keeping the main client bundle at 107 kB (22 kB gzipped).
- **Gzip Compression:** Backend applies `compression` middleware across all REST endpoints.
- **MongoDB Query Indexing:** Indexed lookups on `(userId, createdAt)` and `(userId, isSaved)` for sub-5ms lookups.
- **Cloud Keep-Alive:** Render self-ping service (`keepAlive.service.ts`) runs every 10 minutes to prevent cold starts.

### D. Testing & Robustness
- **16 Passing Test Cases** across 3 test suites:
  - `backend/src/tests/validator.test.ts` — Output unwrapping, array unwrapping, and markdown stripping.
  - `backend/src/tests/schemas.test.ts` — Zod schema validation and boundary enforcement.
  - `backend/src/tests/api.test.ts` — Integration tests for validation, auth error handling, and health endpoints.
- Run tests locally with:
  ```bash
  cd backend && npm test
  ```

### E. Accessibility (Inclusive & Usable Design)
- WCAG AA compliant color contrast ratios across dark obsidian backgrounds.
- Screen-reader friendly utility classes (`.sr-only`) and ARIA labels.
- Keyboard navigable controls with custom `:focus-visible` glowing focus rings.

---

## 🚀 6. Local Setup & Installation

### Prerequisites
- Node.js v20+ or v24+
- Git

### Quickstart
```bash
# 1. Clone repository (Single branch 'main')
git clone https://github.com/asthagupta0211/capstonexai.git
cd capstonexai

# 2. Install dependencies
npm run install:all

# 3. Setup Environment Variables
cp .env.example .env
# Fill in your MONGODB_URI and GROQ_API_KEY in .env

# 4. Run Development Servers (Concurrent frontend + backend)
npm run dev
```

- Frontend: `http://localhost:5173`
- Backend API: `http://localhost:5000/api/v1`
- API Health Check: `http://localhost:5000/api/v1/health`

---

## 📄 License
This project is licensed under the MIT License.
