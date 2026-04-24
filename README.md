# 🚀 ResumeAI — AI-Powered Resume Analyzer

> A **cloud-based web application** that uses **Anthropic Claude AI** to analyze resumes and give actionable feedback. Built for college submission with real deployment on free cloud platforms.

[![Live Demo](https://img.shields.io/badge/Live%20Demo-Vercel-black?logo=vercel)](https://ai-resume-analyzer.vercel.app)
[![Backend](https://img.shields.io/badge/Backend-Render-purple?logo=render)](https://ai-resume-analyzer-backend.onrender.com)
[![Database](https://img.shields.io/badge/Database-Supabase-green?logo=supabase)](https://supabase.com)

---

## 📌 Project Overview

**ResumeAI** is a production-grade cloud application that:
- Accepts resume uploads (PDF, DOCX, TXT)
- Extracts text and sends it to Claude AI for deep analysis
- Returns overall score, ATS score, section-by-section breakdown
- Supports job description matching for tailored feedback
- Includes full JWT authentication, user history, and profile management

---

## 🎯 Best Project Idea: AI Resume Analyzer

### Why This Project Scores High:
| Criterion | Details |
|-----------|---------|
| **Real-world utility** | Millions of job seekers need resume feedback |
| **Cloud deployment** | Full stack on Render + Vercel + Supabase |
| **AI integration** | Uses Claude AI (Anthropic) via REST API |
| **Authentication** | JWT-based secure login/register |
| **Database** | Supabase (PostgreSQL) with Row Level Security |
| **File storage** | Supabase Storage for encrypted resume files |
| **Professional UI** | Dark theme, animations, responsive design |
| **Advanced features** | ATS scoring, job match, keyword gap analysis |

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React 18 + Vite + Tailwind CSS + Framer Motion |
| **Backend** | Node.js + Express.js |
| **Database** | Supabase (PostgreSQL) |
| **AI** | Anthropic Claude API (claude-opus-4-5) |
| **Auth** | JWT (JSON Web Tokens) + bcrypt |
| **Storage** | Supabase Storage (encrypted) |
| **Frontend Host** | Vercel (Free) |
| **Backend Host** | Render (Free) |
| **Fonts** | Syne + DM Sans + JetBrains Mono |

---

## 📁 Folder Structure

```
ai-resume-analyzer/
├── backend/
│   ├── config/
│   │   └── supabase.js          # Supabase client setup
│   ├── middleware/
│   │   └── auth.js              # JWT authentication middleware
│   ├── routes/
│   │   ├── auth.js              # Register, login, /me
│   │   ├── resume.js            # Upload, list, delete resumes
│   │   ├── analysis.js          # AI analysis + history
│   │   └── user.js              # User profile management
│   ├── server.js                # Express app entry point
│   ├── package.json
│   ├── .env.example             # Environment variables template
│   └── render.yaml              # Render deployment config
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   └── Layout.jsx       # Sidebar navigation layout
│   │   ├── hooks/
│   │   │   └── useAuth.jsx      # Auth context + React hook
│   │   ├── pages/
│   │   │   ├── LandingPage.jsx  # Public landing/marketing page
│   │   │   ├── LoginPage.jsx    # Sign in page
│   │   │   ├── RegisterPage.jsx # Sign up page
│   │   │   ├── DashboardPage.jsx# Main dashboard with stats
│   │   │   ├── AnalyzePage.jsx  # Upload + analyze flow
│   │   │   ├── ResultsPage.jsx  # Full analysis results display
│   │   │   ├── HistoryPage.jsx  # Past analyses list
│   │   │   └── ProfilePage.jsx  # User profile + settings
│   │   ├── utils/
│   │   │   └── api.js           # Axios API client
│   │   ├── App.jsx              # Routes + Auth provider
│   │   ├── main.jsx             # React entry point
│   │   └── index.css            # Global styles + design tokens
│   ├── index.html
│   ├── vite.config.js
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   ├── vercel.json              # Vercel deployment config
│   └── .env.example
│
├── docs/
│   └── schema.sql               # Full Supabase database schema
├── render.yaml                  # Render deployment config
├── package.json                 # Root scripts
├── .gitignore
└── README.md
```

---

## 🚀 DEPLOYMENT GUIDE

### Prerequisites
- GitHub account (free)
- Supabase account (free) — [supabase.com](https://supabase.com)
- Render account (free) — [render.com](https://render.com)
- Vercel account (free) — [vercel.com](https://vercel.com)
- Anthropic account — [console.anthropic.com](https://console.anthropic.com) (free $5 credits)

---

### STEP 1: Set Up Supabase Database

1. Go to [supabase.com](https://supabase.com) → **New Project**
2. Choose a name (e.g., `resume-analyzer`), set a strong DB password, select **Singapore** region
3. Wait ~2 minutes for project to provision
4. Go to **SQL Editor** → **New Query**
5. Paste the entire contents of `docs/schema.sql` → Click **Run**
6. Go to **Storage** → **New Bucket**:
   - Name: `resumes`
   - Public: **OFF** (private)
   - Click Create
7. Save your credentials (Settings → API):
   - **Project URL** → `SUPABASE_URL`
   - **service_role key** (under "Project API keys") → `SUPABASE_SERVICE_ROLE_KEY`

---

### STEP 2: Get Anthropic API Key

1. Go to [console.anthropic.com](https://console.anthropic.com)
2. Sign up / Sign in
3. Go to **API Keys** → **Create Key**
4. Copy the key → `ANTHROPIC_API_KEY`
   > Note: New accounts get $5 free credit (~500 analyses)

---

### STEP 3: Push to GitHub

```bash
# Clone/download this project, then:
cd ai-resume-analyzer
git init
git add .
git commit -m "Initial commit: AI Resume Analyzer"
git remote add origin https://github.com/YOUR_USERNAME/ai-resume-analyzer.git
git push -u origin main
```

---

### STEP 4: Deploy Backend on Render

1. Go to [render.com](https://render.com) → **New** → **Web Service**
2. Connect your GitHub repo
3. Configure:
   - **Name**: `ai-resume-analyzer-backend`
   - **Root Directory**: `backend`
   - **Runtime**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Plan**: Free
4. Add **Environment Variables**:

   | Key | Value |
   |-----|-------|
   | `NODE_ENV` | `production` |
   | `JWT_SECRET` | (any 64-char random string) |
   | `SUPABASE_URL` | your Supabase project URL |
   | `SUPABASE_SERVICE_ROLE_KEY` | your service role key |
   | `ANTHROPIC_API_KEY` | your Anthropic API key |
   | `FRONTEND_URL` | `https://your-app.vercel.app` (add after Vercel deploy) |

5. Click **Create Web Service** → Wait ~3 minutes
6. Your backend URL: `https://ai-resume-analyzer-backend.onrender.com`
7. Test: Visit `https://ai-resume-analyzer-backend.onrender.com/health`
   - Should return: `{"status":"OK","message":"AI Resume Analyzer API is running"}`

---

### STEP 5: Deploy Frontend on Vercel

1. Go to [vercel.com](https://vercel.com) → **Add New Project**
2. Import your GitHub repo
3. Configure:
   - **Root Directory**: `frontend`
   - **Framework**: `Vite`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
4. Add **Environment Variable**:

   | Key | Value |
   |-----|-------|
   | `VITE_API_URL` | `https://ai-resume-analyzer-backend.onrender.com/api` |

5. Click **Deploy** → Wait ~2 minutes
6. Your frontend URL: `https://ai-resume-analyzer.vercel.app`

---

### STEP 6: Update CORS (Backend)

Go back to Render → Environment Variables → Update:
- `FRONTEND_URL` = `https://ai-resume-analyzer.vercel.app`

Render auto-redeploys. Wait 1 minute.

---

### STEP 7: Test the Full App

1. Visit your Vercel URL
2. Click **Get Started Free** → Register an account
3. Go to **Analyze Resume**
4. Upload a PDF/DOCX resume
5. (Optionally) paste a job description
6. Click **Analyze Resume with AI**
7. View your results page with score, ATS, improvements!

---

## 💻 Local Development Setup

```bash
# 1. Clone the repo
git clone https://github.com/YOUR_USERNAME/ai-resume-analyzer.git
cd ai-resume-analyzer

# 2. Install all dependencies
npm run install:all

# 3. Set up backend environment
cd backend
cp .env.example .env
# Edit .env with your Supabase + Anthropic keys

# 4. Set up frontend environment  
cd ../frontend
cp .env.example .env
# For local dev, VITE_API_URL can be left empty (uses proxy)

# 5. Run backend (Terminal 1)
cd backend
npm run dev
# Backend runs on http://localhost:3001

# 6. Run frontend (Terminal 2)
cd frontend
npm run dev
# Frontend runs on http://localhost:5173

# 7. Open http://localhost:5173 in browser
```

---

## 🔑 API Endpoints

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Create account |
| POST | `/api/auth/login` | Sign in, get JWT |
| GET | `/api/auth/me` | Get current user |

### Resume Management
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/resume/upload` | Upload resume file |
| GET | `/api/resume/list` | List user's resumes |
| GET | `/api/resume/:id` | Get single resume |
| DELETE | `/api/resume/:id` | Delete resume |

### AI Analysis
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/analysis/analyze` | Run AI analysis |
| GET | `/api/analysis/history` | Get all analyses |
| GET | `/api/analysis/:id` | Get single analysis |

### User
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/user/profile` | Full profile + stats |
| PUT | `/api/user/profile` | Update profile |

---

## 📊 Features Breakdown

### ✅ Resume Scoring
- **Overall Score** (0–100) with letter grade (A+, A, B+, B, C, D, F)
- **Section scores**: Contact, Experience, Education, Skills, Formatting, Keywords
- **ATS Compatibility Score** — how well ATS systems can parse it

### ✅ AI Analysis (Claude)
- Resume summary in plain English
- Strength identification
- Prioritized action items (High / Medium / Low)
- Keyword gap analysis (found vs missing)
- Recommended roles based on profile
- Industry and experience level detection

### ✅ Job Match Mode
- Paste any job description
- Get a % match score
- See which required keywords are missing

### ✅ Security
- Passwords hashed with bcrypt (12 rounds)
- JWT tokens (7-day expiry)
- Rate limiting (100 req/15min, 10 analyses/hour)
- Helmet.js security headers
- CORS restricted to frontend URL

---

## 🎓 College Submission Notes

**Platform Used**: Render (Backend) + Vercel (Frontend) + Supabase (Database + Storage)

**Cloud Services Used**:
- ☁️ **Render** — PaaS (Platform as a Service) for Node.js backend
- ☁️ **Vercel** — Edge deployment for React frontend (CDN)
- ☁️ **Supabase** — DBaaS (Database as a Service) — PostgreSQL + Storage
- 🤖 **Anthropic Claude API** — AI/ML inference in the cloud

**Deployment URL**: `https://ai-resume-analyzer.vercel.app`

**Architecture**: Microservices-style with separated frontend/backend, cloud database, and external AI API integration.

---

## 🧑‍💻 Author

Built as a college Cloud Computing project.

**Stack**: React · Node.js · Express · Supabase · Claude AI · Render · Vercel
