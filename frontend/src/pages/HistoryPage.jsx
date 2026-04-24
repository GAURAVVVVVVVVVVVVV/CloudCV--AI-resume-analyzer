import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { analysisAPI } from '../utils/api';
import { Clock, FileText, ArrowRight, Search, TrendingUp } from 'lucide-react';

function GradeBadge({ score, grade }) {
  const color = score >= 80 ? '#10b981' : score >= 60 ? '#f59e0b' : '#f43f5e';
  return (
    <div className="w-10 h-10 rounded-full flex items-center justify-center font-display font-bold text-sm text-white flex-shrink-0"
      style={{ background: color }}>
      {grade}
    </div>
  );
}

export default function HistoryPage() {
  const navigate = useNavigate();
  const [analyses, setAnalyses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    analysisAPI.history()
      .then(res => setAnalyses(res.data.analyses || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const filtered = analyses.filter(a =>
    (a.resumes?.file_name || '').toLowerCase().includes(search.toLowerCase()) ||
    (a.industry || '').toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display font-bold text-3xl text-white mb-1">Analysis History</h1>
          <p className="text-gray-400">{analyses.length} total analyses</p>
        </div>
        <button onClick={() => navigate('/analyze')}
          className="btn-primary px-5 py-2.5 rounded-xl font-semibold text-sm self-start">
          New Analysis
        </button>
      </div>

      {/* Search */}
      {analyses.length > 0 && (
        <div className="relative">
          <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
          <input className="input-field pl-11" placeholder="Search by filename or industry..."
            value={search} onChange={e => setSearch(e.target.value)} />
        </div>
      )}

      {/* List */}
      {loading ? (
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="glass-card p-5 flex gap-4 animate-pulse">
              <div className="w-10 h-10 rounded-full bg-white/5 flex-shrink-0" />
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-white/5 rounded w-3/4" />
                <div className="h-3 bg-white/5 rounded w-1/2" />
              </div>
            </div>
          ))}
        </div>
      ) : !filtered.length ? (
        <div className="text-center py-20">
          <FileText size={48} className="text-gray-700 mx-auto mb-4" />
          <p className="text-gray-400 text-lg mb-2">{analyses.length === 0 ? 'No analyses yet' : 'No results found'}</p>
          <p className="text-gray-600 text-sm mb-6">
            {analyses.length === 0 ? 'Upload and analyze your first resume to see it here' : 'Try a different search term'}
          </p>
          {analyses.length === 0 && (
            <button onClick={() => navigate('/analyze')} className="btn-primary px-6 py-3 rounded-xl font-semibold">
              Analyze First Resume
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map(a => {
            const scoreColor = a.overall_score >= 80 ? '#10b981' : a.overall_score >= 60 ? '#f59e0b' : '#f43f5e';
            return (
              <div key={a.id}
                className="glass-card p-5 flex items-center gap-4 cursor-pointer hover:border-violet-500/30 transition-all group"
                onClick={() => navigate(`/results/${a.id}`)}>
                <GradeBadge score={a.overall_score} grade={a.grade} />
                <div className="flex-1 min-w-0">
                  <p className="text-white font-medium truncate">{a.resumes?.file_name || 'Resume'}</p>
                  <div className="flex items-center gap-3 mt-1 flex-wrap">
                    <span className="text-gray-500 text-xs flex items-center gap-1">
                      <Clock size={11} />
                      {new Date(a.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </span>
                    {a.industry && <span className="tag tag-purple text-[11px] py-0.5">{a.industry}</span>}
                    {a.experience_level && <span className="tag tag-amber text-[11px] py-0.5">{a.experience_level}</span>}
                  </div>
                </div>
                <div className="flex items-center gap-4 flex-shrink-0">
                  <div className="text-right hidden sm:block">
                    <div className="font-display font-bold text-xl" style={{ color: scoreColor }}>{a.overall_score}%</div>
                    <div className="text-xs text-gray-500">Overall</div>
                  </div>
                  {a.ats_score && (
                    <div className="text-right hidden md:block">
                      <div className="font-display font-bold text-xl text-jade-400">{a.ats_score}%</div>
                      <div className="text-xs text-gray-500">ATS</div>
                    </div>
                  )}
                  <ArrowRight size={18} className="text-gray-600 group-hover:text-violet-400 transition-colors" />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
