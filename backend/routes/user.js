const express = require('express');
const supabase = require('../config/supabase');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// GET /api/user/profile
router.get('/profile', authenticateToken, async (req, res) => {
  try {
    const { data: user, error } = await supabase
      .from('users')
      .select('id, email, full_name, plan, analyses_count, created_at')
      .eq('id', req.user.id)
      .single();

    if (error || !user) return res.status(404).json({ error: 'User not found' });

    // Get recent analyses
    const { data: recentAnalyses } = await supabase
      .from('analyses')
      .select('id, overall_score, grade, created_at, resumes(file_name)')
      .eq('user_id', req.user.id)
      .order('created_at', { ascending: false })
      .limit(5);

    // Get stats
    const { data: statsData } = await supabase
      .from('analyses')
      .select('overall_score, ats_score')
      .eq('user_id', req.user.id);

    const avgScore = statsData?.length
      ? Math.round(statsData.reduce((sum, a) => sum + a.overall_score, 0) / statsData.length)
      : 0;

    const avgATS = statsData?.length
      ? Math.round(statsData.reduce((sum, a) => sum + (a.ats_score || 0), 0) / statsData.length)
      : 0;

    res.json({
      user,
      stats: {
        total_analyses: statsData?.length || 0,
        avg_score: avgScore,
        avg_ats_score: avgATS,
        recent_analyses: recentAnalyses || []
      }
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch profile' });
  }
});

// PUT /api/user/profile
router.put('/profile', authenticateToken, async (req, res) => {
  try {
    const { full_name } = req.body;
    if (!full_name) return res.status(400).json({ error: 'full_name is required' });

    const { data: user, error } = await supabase
      .from('users')
      .update({ full_name: full_name.trim() })
      .eq('id', req.user.id)
      .select('id, email, full_name, plan, analyses_count')
      .single();

    if (error) throw error;
    res.json({ message: 'Profile updated', user });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update profile' });
  }
});

module.exports = router;
