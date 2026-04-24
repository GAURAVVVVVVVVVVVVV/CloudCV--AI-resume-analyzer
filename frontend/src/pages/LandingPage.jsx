import { useNavigate } from 'react-router-dom';
import { Zap, Shield, Target, TrendingUp, FileText, Star, ArrowRight, CheckCircle, Brain } from 'lucide-react';

const features = [
  {
    icon: Brain,
    title: 'AI-Powered Analysis',
    desc: 'Claude AI reads your resume like a senior recruiter — spotting every gap, strength, and opportunity.',
    color: '#8b5cf6',
  },
  {
    icon: Target,
    title: 'ATS Score Check',
    desc: "Know exactly how applicant tracking systems see your resume before you apply.",
    color: '#10b981',
  },
  {
    icon: TrendingUp,
    title: 'Career Insights',
    desc: 'Get matched to ideal roles, detect your experience level, and discover your target industry.',
    color: '#f59e0b',
  },
  {
    icon: FileText,
    title: 'Job Description Match',
    desc: 'Paste a job description and get a tailored compatibility score with specific advice.',
    color: '#f43f5e',
  },
  {
    icon: Shield,
    title: 'Secure & Private',
    desc: 'Your resume data is encrypted and never shared. Full GDPR-compliant data handling.',
    color: '#06b6d4',
  },
  {
    icon: Zap,
    title: 'Instant Results',
    desc: 'Full analysis in under 30 seconds. No waiting, no forms, no consultants needed.',
    color: '#a78bfa',
  },
];

const stats = [
  { value: '94%', label: 'Users improved ATS score' },
  { value: '3x', label: 'More interview callbacks' },
  { value: '<30s', label: 'Analysis time' },
  { value: 'Free', label: 'Always free to start' },
];

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-mesh font-body overflow-x-hidden">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 px-6 py-4"
        style={{ background: 'rgba(8, 2, 18, 0.8)', backdropFilter: 'blur(20px)', borderBottom: '1px solid rgba(139, 92, 246, 0.1)' }}>
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, #7c3aed, #10b981)' }}>
              <Zap size={16} className="text-white" />
            </div>
            <span className="font-display font-bold text-xl text-white">ResumeAI</span>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={() => navigate('/login')}
              className="btn-ghost px-4 py-2 rounded-lg text-sm font-medium">
              Sign in
            </button>
            <button onClick={() => navigate('/register')}
              className="btn-primary px-5 py-2 rounded-lg text-sm font-semibold">
              Get Started Free
            </button>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative pt-32 pb-24 px-6 text-center">
        {/* Glow orbs */}
        <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(139, 92, 246, 0.12) 0%, transparent 70%)' }} />
        <div className="absolute top-40 left-1/4 w-[300px] h-[300px] rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(16, 185, 129, 0.07) 0%, transparent 70%)' }} />

        <div className="max-w-4xl mx-auto relative">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 mb-8 px-4 py-2 rounded-full"
            style={{ background: 'rgba(139, 92, 246, 0.12)', border: '1px solid rgba(139, 92, 246, 0.3)' }}>
            <div className="pulse-dot" style={{ width: 6, height: 6 }} />
            <span className="text-xs font-medium text-violet-300">Powered by Claude AI — Free to use</span>
          </div>

          <h1 className="font-display font-extrabold text-5xl md:text-7xl leading-tight mb-6">
            <span className="text-white">Your resume,</span>
            <br />
            <span className="gradient-text">brutally improved.</span>
          </h1>

          <p className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed font-light">
            Upload your resume. In 30 seconds, AI tells you exactly what's wrong,
            what's great, your ATS score, and how to land that job.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <button
              onClick={() => navigate('/register')}
              className="btn-primary px-8 py-4 rounded-xl text-base font-semibold flex items-center justify-center gap-2 group"
            >
              Analyze My Resume Free
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </button>
            <button
              onClick={() => navigate('/login')}
              className="btn-ghost px-8 py-4 rounded-xl text-base font-medium"
            >
              Sign In
            </button>
          </div>

          {/* Trust badges */}
          <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-2 text-sm text-gray-500">
            {['No credit card required', 'PDF, DOCX & TXT supported', 'Results in 30 seconds'].map(t => (
              <span key={t} className="flex items-center gap-1.5">
                <CheckCircle size={14} className="text-jade-500" />
                {t}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 px-6">
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map(({ value, label }) => (
            <div key={label} className="glass-card p-6 text-center">
              <div className="font-display font-extrabold text-3xl gradient-text mb-2">{value}</div>
              <div className="text-sm text-gray-400">{label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="font-display font-bold text-3xl md:text-4xl text-white mb-4">
              Everything your resume needs
            </h2>
            <p className="text-gray-400 text-lg max-w-xl mx-auto">
              Stop guessing. Get the exact data-driven feedback that hiring managers would give.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map(({ icon: Icon, title, desc, color }) => (
              <div key={title} className="glass-card p-6 group hover:border-opacity-50 transition-all duration-300 hover:-translate-y-1">
                <div className="w-11 h-11 rounded-xl flex items-center justify-center mb-4"
                  style={{ background: `${color}18`, border: `1px solid ${color}30` }}>
                  <Icon size={20} style={{ color }} />
                </div>
                <h3 className="font-display font-semibold text-white text-lg mb-2">{title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="font-display font-bold text-3xl md:text-4xl text-white mb-4">
              Three steps to a better resume
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { step: '01', title: 'Upload Resume', desc: 'Drop your PDF, DOCX, or TXT resume. We extract text instantly.', color: '#8b5cf6' },
              { step: '02', title: 'AI Analyzes', desc: 'Claude AI scores every section, checks ATS compatibility, and finds improvements.', color: '#10b981' },
              { step: '03', title: 'Get Better', desc: 'Follow prioritized action items to dramatically improve your resume.', color: '#f59e0b' },
            ].map(({ step, title, desc, color }) => (
              <div key={step} className="relative text-center">
                <div className="font-mono font-bold text-5xl mb-4 opacity-20" style={{ color }}>{step}</div>
                <h3 className="font-display font-semibold text-white text-xl mb-3">{title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-6">
        <div className="max-w-2xl mx-auto text-center">
          <div className="glass-card p-12 relative overflow-hidden">
            <div className="absolute inset-0 pointer-events-none"
              style={{ background: 'radial-gradient(ellipse at 50% 0%, rgba(139, 92, 246, 0.15) 0%, transparent 70%)' }} />
            <Star className="text-amber-400 mx-auto mb-4" size={28} />
            <h2 className="font-display font-bold text-3xl text-white mb-4">
              Ready to get more interviews?
            </h2>
            <p className="text-gray-400 mb-8">Join thousands who've improved their resume with AI feedback.</p>
            <button
              onClick={() => navigate('/register')}
              className="btn-primary px-10 py-4 rounded-xl text-base font-semibold"
            >
              Analyze My Resume — It's Free
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-ink-900/50 py-8 px-6 text-center text-gray-600 text-sm">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Zap size={14} className="text-violet-500" />
          <span className="font-display font-semibold text-gray-400">ResumeAI</span>
        </div>
        <p>Built with Claude AI · Hosted on Render + Vercel · © 2024</p>
      </footer>
    </div>
  );
}
