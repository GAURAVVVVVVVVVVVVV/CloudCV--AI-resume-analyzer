import { useState, useEffect } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { analysisAPI } from '../utils/api';
import { CheckCircle, AlertTriangle, XCircle, ChevronDown, ChevronUp,
  Download, ArrowLeft, Sparkles, Briefcase, Target, Zap, Star } from 'lucide-react';

function ScoreCircle({ score, size = 140 }) {
  const radius = 52;
  const circ = 2 * Math.PI * radius;
  const offset = circ - (score / 100) * circ;
  const color = score >= 80 ? '#10b981' : score >= 60 ? '#f59e0b' : '#f43f5e';
  const grade = score >= 90 ? 'A+' : score >= 80 ? 'A' : score >= 70 ? 'B+' : score >= 60 ? 'B' : score >= 50 ? 'C' : 'D';

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox="0 0 120 120">
        <circle cx="60" cy="60" r={radius} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="10" />
        <circle cx="60" cy="60" r={radius} fill="none" stroke={color} strokeWidth="10"
          strokeDasharray={circ} strokeDashoffset={offset}
          strokeLinecap="round"
          style={{ transform: 'rotate(-90deg)', transformOrigin: 'center', transition: 'stroke-dashoffset 1.5s ease' }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="font-display font-extrabold text-2xl text-white">{score}</span>
        <span className="text-xs font-semibold" style={{ color }}>{grade}</span>
      </div>
    </div>
  );
}

function ScoreBar({ label, score, status }) {
  const color = status === 'good' ? '#10b981' : status === 'warning' ? '#f59e0b' : '#f43f5e';
  const Icon = status === 'good' ? CheckCircle : status === 'warning' ? AlertTriangle : XCircle;
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <span className="text-sm text-gray-300 flex items-center gap-1.5">
          <Icon size={13} style={{ color }} />
          {label}
        </span>
        <span className="font-mono text-sm font-semibold" style={{ color }}>{score}%</span>
      </div>
      <div className="score-bar">
        <div className="score-bar-fill" style={{ width: `${score}%`, background: `linear-gradient(90deg, ${color}aa, ${color})` }} />
      </div>
    </div>
  );
}

function ImprovementCard({ item, index }) {
  const [open, setOpen] = useState(index === 0);
  const cls = `priority-${item.priority}`;
  return (
    <div className="rounded-xl overflow-hidden" style={{ border: '1px solid rgba(255,255,255,0.06)', background: 'rgba(255,255,255,0.02)' }}>
      <button onClick={() => setOpen(o => !o)}
        className="w-full flex items-center gap-3 p-4 text-left hover:bg-white/3 transition-colors">
        <span className={`tag ${cls} flex-shrink-0`}>{item.priority.toUpperCase()}</span>
        <span className="font-medium text-white text-sm flex-1">{item.title}</span>
        {open ? <ChevronUp size={16} className="text-gray-500 flex-shrink-0" /> : <ChevronDown size={16} className="text-gray-500 flex-shrink-0" />}
      </button>
      {open && (
        <div className="px-4 pb-4">
          <p className="text-gray-400 text-sm leading-relaxed">{item.description}</p>
        </div>
      )}
    </div>
  );
}

export default function ResultsPage() {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [result, setResult] = useState(location.state?.result || null);
  const [loading, setLoading] = useState(!result);
  const fileName = location.state?.fileName || 'Resume';

  useEffect(() => {
    if (!result) {
      analysisAPI.get(id)
        .then(res => setResult(res.data.analysis.result_json))
        .catch(() => navigate('/history'))
        .finally(() => setLoading(false));
    }
  }, [id]);

  if (loading) return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="spinner" />
    </div>
  );

  if (!result) return null;

  const sectionNames = {
    contact_info: 'Contact Info',
    work_experience: 'Work Experience',
    education: 'Education',
    skills: 'Skills',
    formatting: 'Formatting',
    keywords: 'Keywords',
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button onClick={() => navigate(-1)} className="btn-ghost p-2 rounded-xl">
          <ArrowLeft size={20} />
        </button>
        <div>
          <h1 className="font-display font-bold text-3xl text-white">Analysis Results</h1>
          <p className="text-gray-400 text-sm mt-0.5">{fileName}</p>
        </div>
      </div>

      {/* Overview card */}
      <div className="glass-card p-8">
        <div className="flex flex-col md:flex-row gap-8 items-start">
          {/* Score */}
          <div className="flex flex-col items-center gap-3 flex-shrink-0">
            <ScoreCircle score={result.overall_score} />
            <div className="text-center">
              <p className="text-white font-semibold font-display">Overall Score</p>
              <p className="text-gray-500 text-xs mt-1">{result.experience_level} · {result.industry}</p>
            </div>
          </div>

          {/* Summary + metrics */}
          <div className="flex-1 min-w-0">
            <p className="text-gray-300 leading-relaxed mb-6">{result.summary}</p>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              {[
                { label: 'ATS Score', value: result.ats_score, icon: Target, color: '#10b981' },
                { label: 'Job Match', value: result.job_match_score ?? '—', icon: Briefcase, color: '#f59e0b' },
                { label: 'Experience', value: result.experience_level, icon: Star, color: '#8b5cf6', isText: true },
                { label: 'Grade', value: result.grade, icon: Zap, color: '#f43f5e', isText: true },
              ].map(({ label, value, icon: Icon, color, isText }) => (
                <div key={label} className="rounded-xl p-4 text-center" style={{ background: `${color}10`, border: `1px solid ${color}20` }}>
                  <Icon size={18} className="mx-auto mb-2" style={{ color }} />
                  <div className="font-display font-bold text-xl text-white">
                    {isText ? value : (typeof value === 'number' ? `${value}%` : value)}
                  </div>
                  <div className="text-xs text-gray-500 mt-0.5">{label}</div>
                </div>
              ))}
            </div>

            {/* Strengths */}
            {result.strengths?.length > 0 && (
              <div>
                <h3 className="text-sm font-semibold text-gray-300 mb-2">Strengths</h3>
                <div className="flex flex-wrap gap-2">
                  {result.strengths.map(s => (
                    <span key={s} className="tag tag-jade">{s}</span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Section scores */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="glass-card p-6">
          <h2 className="font-display font-semibold text-white text-xl mb-5">Section Breakdown</h2>
          <div className="space-y-5">
            {Object.entries(result.sections || {}).map(([key, val]) => (
              <div key={key}>
                <ScoreBar label={sectionNames[key] || key} score={val.score} status={val.status} />
                <p className="text-xs text-gray-500 mt-1 ml-5">{val.feedback}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Keywords */}
        <div className="glass-card p-6">
          <h2 className="font-display font-semibold text-white text-xl mb-5">Keywords Analysis</h2>
          <div className="mb-5">
            <p className="text-xs font-semibold text-jade-400 uppercase tracking-wide mb-3">✓ Found</p>
            <div className="flex flex-wrap gap-2">
              {(result.keywords_found || []).map(k => <span key={k} className="tag tag-jade">{k}</span>)}
              {!result.keywords_found?.length && <span className="text-gray-600 text-sm">None detected</span>}
            </div>
          </div>
          <div className="mb-5">
            <p className="text-xs font-semibold text-rose-400 uppercase tracking-wide mb-3">✗ Missing</p>
            <div className="flex flex-wrap gap-2">
              {(result.keywords_missing || []).map(k => <span key={k} className="tag tag-rose">{k}</span>)}
              {!result.keywords_missing?.length && <span className="text-gray-600 text-sm">None missing!</span>}
            </div>
          </div>
          {result.recommended_roles?.length > 0 && (
            <div>
              <p className="text-xs font-semibold text-violet-400 uppercase tracking-wide mb-3">Recommended Roles</p>
              <div className="flex flex-wrap gap-2">
                {result.recommended_roles.map(r => <span key={r} className="tag tag-purple">{r}</span>)}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ATS feedback */}
      {result.ats_feedback && (
        <div className="glass-card p-6" style={{ borderColor: 'rgba(16, 185, 129, 0.2)' }}>
          <h2 className="font-display font-semibold text-white text-xl mb-3 flex items-center gap-2">
            <Target size={20} className="text-jade-500" />
            ATS Compatibility
          </h2>
          <p className="text-gray-300 text-sm leading-relaxed">{result.ats_feedback}</p>
        </div>
      )}

      {/* Job match */}
      {result.job_match_score && result.job_match_feedback && (
        <div className="glass-card p-6" style={{ borderColor: 'rgba(245, 158, 11, 0.2)' }}>
          <h2 className="font-display font-semibold text-white text-xl mb-3 flex items-center gap-2">
            <Briefcase size={20} className="text-amber-400" />
            Job Match Analysis — {result.job_match_score}%
          </h2>
          <p className="text-gray-300 text-sm leading-relaxed">{result.job_match_feedback}</p>
        </div>
      )}

      {/* Improvements */}
      <div className="glass-card p-6">
        <h2 className="font-display font-semibold text-white text-xl mb-5 flex items-center gap-2">
          <Sparkles size={20} className="text-violet-400" />
          Action Items
        </h2>
        <div className="space-y-3">
          {(result.improvements || []).map((item, i) => (
            <ImprovementCard key={i} item={item} index={i} />
          ))}
        </div>
      </div>

      {/* Analyze another */}
      <div className="flex justify-center pb-8">
        <button onClick={() => navigate('/analyze')}
          className="btn-primary px-8 py-3.5 rounded-xl font-semibold flex items-center gap-2">
          <Sparkles size={18} />
          Analyze Another Resume
        </button>
      </div>
    </div>
  );
}
