-- ============================================================
-- ResumeAI — Supabase Database Schema
-- Run this in your Supabase SQL Editor
-- ============================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================
-- USERS TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS public.users (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email       TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  full_name   TEXT NOT NULL,
  plan        TEXT NOT NULL DEFAULT 'free' CHECK (plan IN ('free', 'pro')),
  analyses_count INTEGER NOT NULL DEFAULT 0,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- RESUMES TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS public.resumes (
  id             UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id        UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  file_name      TEXT NOT NULL,
  file_size      INTEGER,
  file_type      TEXT,
  storage_path   TEXT,
  extracted_text TEXT,
  word_count     INTEGER DEFAULT 0,
  status         TEXT NOT NULL DEFAULT 'uploaded' CHECK (status IN ('uploaded', 'analyzing', 'analyzed', 'failed')),
  created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- ANALYSES TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS public.analyses (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  resume_id       UUID NOT NULL REFERENCES public.resumes(id) ON DELETE CASCADE,
  user_id         UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  job_description TEXT,
  overall_score   INTEGER CHECK (overall_score BETWEEN 0 AND 100),
  grade           TEXT,
  ats_score       INTEGER CHECK (ats_score BETWEEN 0 AND 100),
  job_match_score INTEGER CHECK (job_match_score BETWEEN 0 AND 100),
  experience_level TEXT,
  industry        TEXT,
  result_json     JSONB NOT NULL,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- INDEXES
-- ============================================================
CREATE INDEX IF NOT EXISTS idx_resumes_user_id ON public.resumes(user_id);
CREATE INDEX IF NOT EXISTS idx_analyses_user_id ON public.analyses(user_id);
CREATE INDEX IF NOT EXISTS idx_analyses_resume_id ON public.analyses(resume_id);
CREATE INDEX IF NOT EXISTS idx_users_email ON public.users(email);

-- ============================================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================================
-- We use service role key in backend, so RLS is optional.
-- But enable it for safety:
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.resumes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.analyses ENABLE ROW LEVEL SECURITY;

-- Service role bypasses RLS automatically.
-- These policies allow service role full access:
CREATE POLICY "Service role full access on users"
  ON public.users FOR ALL
  USING (true) WITH CHECK (true);

CREATE POLICY "Service role full access on resumes"
  ON public.resumes FOR ALL
  USING (true) WITH CHECK (true);

CREATE POLICY "Service role full access on analyses"
  ON public.analyses FOR ALL
  USING (true) WITH CHECK (true);

-- ============================================================
-- STORAGE BUCKET
-- ============================================================
-- Run this separately if the storage bucket doesn't auto-create:
-- INSERT INTO storage.buckets (id, name, public)
-- VALUES ('resumes', 'resumes', false)
-- ON CONFLICT DO NOTHING;

-- ============================================================
-- AUTO-UPDATE updated_at TRIGGER
-- ============================================================
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER users_updated_at
  BEFORE UPDATE ON public.users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ============================================================
-- VERIFY SETUP
-- ============================================================
SELECT table_name FROM information_schema.tables
WHERE table_schema = 'public'
ORDER BY table_name;
