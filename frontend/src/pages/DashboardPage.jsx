import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { userAPI } from '../utils/api';
import { Sparkles, FileText, TrendingUp, Target, ArrowRight, Plus, Clock } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

function StatCard({ icon: Icon, label, value, color, sub }) {
  return (
    <div className="glass-card p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center"
          style={{ background: `${color}18`, border: `1px solid ${color}25` }}>
          <Icon size={20} style={{ color }} />
        </div>
      </div>
      <div className="font-display font-bold text-3xl text-white mb-1">{value}</div>
      <div className="text-sm text-gray-400">{label}</div>
      {sub && <div className="text-xs text-gray-600 mt-1">{sub}</div>}
    </div>
  );
}

function ScoreBadge({ score }) {
  const color = score >= 80 ? '#10b981' : score >= 60 ? '#f59e0b' : '#f43f5e';
  const label = score >= 80 ? 'Great' : score >= 60 ? 'Good' : 'Needs Work';
  return (
    <div className="flex items-center gap-2">
      <div className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold text-white"
        style={{ background: color }}>
        {score}
      </div>
      <span className="text-xs font-medium" style={{ color }}>{label}</span>
    </div>
  );
}

export default function DashboardPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    userAPI.profile()
      .then(res => setProfile(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const firstName = user?.full_name?.split(' ')[0] || 'there';
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

  const stats = profile?.stats;

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display font-bold text-3xl text-white mb-1">
            {greeting}, {firstName} 👋
          </h1>
          <p className="text-gray-400">Here's your resume analysis overview.</p>
        </div>
        <button
          onClick={() => navigate('/analyze')}
          className="btn-primary px-6 py-3 rounded-xl font-semibold flex items-center gap-2 self-start sm:self-auto"
        >
          <Plus size={18} />
          Analyze New Resume
        </button>
      </div>

      {/* Stats */}
      {loading ? (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="glass-card p-6 animate-pulse">
              <div className="w-10 h-10 rounded-xl bg-white/5 mb-4" />
              <div className="h-8 bg-white/5 rounded mb-2 w-16" />
              <div className="h-4 bg-white/5 rounded w-24" />
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard icon={FileText} label="Total Analyses" value={stats?.total_analyses || 0} color="#8b5cf6" />
          <StatCard icon={TrendingUp} label="Average Score" value={stats?.avg_score ? `${stats.avg_score}%` : '—'} color="#10b981" />
          <StatCard icon={Target} label="Avg ATS Score" value={stats?.avg_ats_score ? `${stats.avg_ats_score}%` : '—'} color="#f59e0b" />
          <StatCard icon={Sparkles} label="Plan" value={user?.plan === 'free' ? 'Free' : 'Pro'} color="#f43f5e" sub="Upgrade for unlimited" />
        </div>
      )}

      {/* Main content */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Recent analyses */}
        <div className="lg:col-span-2 glass-card p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-display font-semibold text-white text-xl">Recent Analyses</h2>
            <button onClick={() => navigate('/history')}
              className="text-violet-400 hover:text-violet-300 text-sm flex items-center gap-1 transition-colors">
              View all <ArrowRight size={14} />
            </button>
          </div>
          {loading ? (
            <div className="space-y-3">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="p-4 rounded-xl bg-white/3 animate-pulse flex gap-4">
                  <div className="w-10 h-10 rounded-full bg-white/5 flex-shrink-0" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-white/5 rounded w-3/4" />
                    <div className="h-3 bg-white/5 rounded w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          ) : !stats?.recent_analyses?.length ? (
            <div className="text-center py-12">
              <FileText size={40} className="text-gray-700 mx-auto mb-3" />
              <p className="text-gray-400 mb-4">No analyses yet</p>
              <button onClick={() => navigate('/analyze')}
                className="btn-primary px-6 py-2.5 rounded-lg text-sm font-semibold">
                Analyze your first resume
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {stats.recent_analyses.map((a) => (
                <div key={a.id}
                  className="p-4 rounded-xl flex items-center gap-4 cursor-pointer transition-all hover:bg-white/5 group"
                  style={{ background: 'rgba(255,255,255,0.02)' }}
                  onClick={() => navigate(`/results/${a.id}`)}>
                  <div className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold text-white flex-shrink-0"
                    style={{ background: a.overall_score >= 70 ? '#10b981' : a.overall_score >= 50 ? '#f59e0b' : '#f43f5e' }}>
                    {a.grade}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-white font-medium text-sm truncate">{a.resumes?.file_name || 'Resume'}</p>
                    <p className="text-gray-500 text-xs flex items-center gap-1 mt-0.5">
                      <Clock size={11} />
                      {new Date(a.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </p>
                  </div>
                  <ScoreBadge score={a.overall_score} />
                  <ArrowRight size={16} className="text-gray-600 group-hover:text-violet-400 transition-colors flex-shrink-0" />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Quick actions + tips */}
        <div className="space-y-4">
          <div className="glass-card p-6">
            <h2 className="font-display font-semibold text-white text-xl mb-4">Quick Actions</h2>
            <div className="space-y-3">
              {[
                { label: 'Analyze New Resume', icon: Sparkles, to: '/analyze', primary: true },
                { label: 'View History', icon: Clock, to: '/history', primary: false },
                { label: 'My Profile', icon: FileText, to: '/profile', primary: false },
              ].map(({ label, icon: Icon, to, primary }) => (
                <button key={label} onClick={() => navigate(to)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all text-left
                    ${primary ? 'btn-primary' : 'btn-ghost'}`}>
                  <Icon size={16} />
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Pro tip */}
          <div className="glass-card p-5" style={{ borderColor: 'rgba(245, 158, 11, 0.25)' }}>
            <div className="flex items-center gap-2 mb-3">
              <Sparkles size={16} className="text-amber-400" />
              <span className="text-xs font-semibold text-amber-400 uppercase tracking-wide">Pro Tip</span>
            </div>
            <p className="text-gray-300 text-sm leading-relaxed">
              Paste a job description when analyzing for a <strong className="text-white">job match score</strong> — it boosts your chances significantly.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
