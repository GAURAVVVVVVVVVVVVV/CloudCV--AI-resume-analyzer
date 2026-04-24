const express = require('express');
const { v4: uuidv4 } = require('uuid');
const supabase = require('../config/supabase');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Core AI analysis function using Groq API
async function analyzeResumeWithAI(resumeText, jobDescription = null) {
  const jobContext = jobDescription
    ? `\n\nTarget Job Description:\n${jobDescription.substring(0, 2000)}`
    : '';

  const prompt = `You are an expert HR professional and resume coach with 15+ years of experience. Analyze the following resume thoroughly and provide detailed, actionable feedback.

Resume Content:
${resumeText.substring(0, 8000)}${jobContext}

Respond ONLY with a valid JSON object in this exact structure (no markdown, no explanation):
{
  "overall_score": <number 0-100>,
  "grade": "<A+|A|B+|B|C+|C|D|F>",
  "summary": "<2-3 sentence overall assessment>",
  "sections": {
    "contact_info": { "score": <0-100>, "status": "<good|warning|missing>", "feedback": "<specific feedback>" },
    "work_experience": { "score": <0-100>, "status": "<good|warning|missing>", "feedback": "<specific feedback>", "years": <number or null> },
    "education": { "score": <0-100>, "status": "<good|warning|missing>", "feedback": "<specific feedback>" },
    "skills": { "score": <0-100>, "status": "<good|warning|missing>", "feedback": "<specific feedback>", "found_skills": ["<skill1>", "<skill2>", "<skill3>"] },
    "formatting": { "score": <0-100>, "status": "<good|warning|missing>", "feedback": "<specific feedback>" },
    "keywords": { "score": <0-100>, "status": "<good|warning|missing>", "feedback": "<specific feedback>" }
  },
  "strengths": ["<strength1>", "<strength2>", "<strength3>"],
  "improvements": [
    { "priority": "high", "title": "<improvement title>", "description": "<detailed actionable advice>" },
    { "priority": "medium", "title": "<improvement title>", "description": "<detailed actionable advice>" },
    { "priority": "low", "title": "<improvement title>", "description": "<detailed actionable advice>" }
  ],
  "ats_score": <number 0-100>,
  "ats_feedback": "<ATS compatibility assessment>",
  "keywords_found": ["<keyword1>", "<keyword2>", "<keyword3>"],
  "keywords_missing": ["<keyword1>", "<keyword2>", "<keyword3>"],
  "job_match_score": ${jobDescription ? '<number 0-100>' : 'null'},
  "job_match_feedback": ${jobDescription ? '"<job match assessment>"' : 'null'},
  "recommended_roles": ["<role1>", "<role2>", "<role3>"],
  "industry": "<detected industry>",
  "experience_level": "<junior|mid|senior|executive>"
}`;

  const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model: 'llama-3.3-70b-versatile',
      max_tokens: 2000,
      temperature: 0.3,
      messages: [{ role: 'user', content: prompt }]
    })
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`AI API error: ${response.status} - ${err}`);
  }

  const data = await response.json();
  const text = data.choices[0].message.content;

  try {
    return JSON.parse(text);
  } catch {
    const match = text.match(/\{[\s\S]*\}/);
    if (match) return JSON.parse(match[0]);
    throw new Error('Failed to parse AI response');
  }
}

// POST /api/analysis/analyze
router.post('/analyze', authenticateToken, async (req, res) => {
  try {
    const { resume_id, job_description } = req.body;

    if (!resume_id) {
      return res.status(400).json({ error: 'resume_id is required' });
    }

    const { data: resume, error: resumeError } = await supabase
      .from('resumes')
      .select('*')
      .eq('id', resume_id)
      .eq('user_id', req.user.id)
      .single();

    if (resumeError || !resume) {
      return res.status(404).json({ error: 'Resume not found' });
    }

    if (!resume.extracted_text) {
      return res.status(422).json({ error: 'Resume has no extractable text' });
    }

    if (!process.env.GROQ_API_KEY) {
      return res.status(503).json({ error: 'AI service not configured. Please add GROQ_API_KEY to .env' });
    }

    let analysisResult;
    try {
      analysisResult = await analyzeResumeWithAI(resume.extracted_text, job_description);
    } catch (aiErr) {
      console.error('AI Error:', aiErr);
      return res.status(502).json({ error: 'AI analysis failed. Please try again.' });
    }

    const analysisId = uuidv4();

    const { data: analysis, error: dbError } = await supabase
      .from('analyses')
      .insert({
        id: analysisId,
        resume_id: resume.id,
        user_id: req.user.id,
        job_description: job_description || null,
        overall_score: analysisResult.overall_score,
        grade: analysisResult.grade,
        ats_score: analysisResult.ats_score,
        job_match_score: analysisResult.job_match_score,
        experience_level: analysisResult.experience_level,
        industry: analysisResult.industry,
        result_json: analysisResult
      })
      .select()
      .single();

    if (dbError) {
      console.error('DB error saving analysis:', dbError);
    }

    await supabase
      .from('users')
      .update({ analyses_count: (req.user.analyses_count || 0) + 1 })
      .eq('id', req.user.id);

    await supabase
      .from('resumes')
      .update({ status: 'analyzed' })
      .eq('id', resume.id);

    res.json({
      message: 'Analysis complete',
      analysis_id: analysisId,
      result: analysisResult
    });

  } catch (err) {
    console.error('Analysis error:', err);
    res.status(500).json({ error: err.message || 'Analysis failed' });
  }
});

// GET /api/analysis/history
router.get('/history', authenticateToken, async (req, res) => {
  try {
    const { data: analyses, error } = await supabase
      .from('analyses')
      .select(`
        id, overall_score, grade, ats_score, job_match_score, 
        experience_level, industry, created_at,
        resumes (file_name)
      `)
      .eq('user_id', req.user.id)
      .order('created_at', { ascending: false })
      .limit(20);

    if (error) throw error;

    res.json({ analyses: analyses || [] });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch analysis history' });
  }
});

// GET /api/analysis/:id
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const { data: analysis, error } = await supabase
      .from('analyses')
      .select('*')
      .eq('id', req.params.id)
      .eq('user_id', req.user.id)
      .single();

    if (error || !analysis) {
      return res.status(404).json({ error: 'Analysis not found' });
    }

    res.json({ analysis });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch analysis' });
  }
});

module.exports = router;