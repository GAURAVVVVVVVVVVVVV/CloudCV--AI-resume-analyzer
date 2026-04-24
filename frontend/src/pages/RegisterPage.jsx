import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { authAPI } from '../utils/api';
import toast from 'react-hot-toast';
import { Zap, Eye, EyeOff, ArrowRight, CheckCircle } from 'lucide-react';

const perks = [
  'Unlimited resume uploads',
  'AI-powered analysis with Claude',
  'ATS score & job match checker',
  'Full history & progress tracking',
];

export default function RegisterPage() {
  const [form, setForm] = useState({ full_name: '', email: '', password: '' });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.full_name || !form.email || !form.password) return toast.error('All fields required');
    if (form.password.length < 6) return toast.error('Password must be at least 6 characters');
    setLoading(true);
    try {
      const { data } = await authAPI.register(form);
      login(data.token, data.user);
      toast.success('Account created! Welcome to ResumeAI 🎉');
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-mesh flex items-center justify-center px-4 py-12">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(139, 92, 246, 0.09) 0%, transparent 70%)' }} />

      <div className="w-full max-w-4xl grid md:grid-cols-2 gap-8 items-center relative">
        {/* Left: Perks */}
        <div className="hidden md:block">
          <Link to="/" className="inline-flex items-center gap-2 mb-8">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, #7c3aed, #10b981)' }}>
              <Zap size={18} className="text-white" />
            </div>
            <span className="font-display font-bold text-xl text-white">ResumeAI</span>
          </Link>
          <h2 className="font-display font-bold text-4xl text-white mb-4 leading-tight">
            Land your <span className="gradient-text">dream job</span> faster.
          </h2>
          <p className="text-gray-400 mb-8 leading-relaxed">
            Join thousands of job seekers using AI to craft winning resumes.
          </p>
          <ul className="space-y-4">
            {perks.map(perk => (
              <li key={perk} className="flex items-center gap-3 text-gray-300">
                <CheckCircle size={18} className="text-jade-500 flex-shrink-0" />
                <span className="text-sm">{perk}</span>
              </li>
            ))}
          </ul>
          <div className="mt-10 p-5 glass-card rounded-2xl">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-600 to-violet-800 flex items-center justify-center text-xs font-bold text-white">PK</div>
              <div>
                <p className="text-sm font-medium text-white">Priya K.</p>
                <p className="text-xs text-gray-500">Software Engineer</p>
              </div>
            </div>
            <p className="text-sm text-gray-300 italic leading-relaxed">
              "ResumeAI spotted missing keywords I never thought of. Got 3 interviews in a week!"
            </p>
          </div>
        </div>

        {/* Right: Form */}
        <div>
          <div className="text-center mb-6 md:hidden">
            <Link to="/" className="inline-flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center"
                style={{ background: 'linear-gradient(135deg, #7c3aed, #10b981)' }}>
                <Zap size={15} className="text-white" />
              </div>
              <span className="font-display font-bold text-lg text-white">ResumeAI</span>
            </Link>
          </div>
          <div className="glass-card p-8">
            <h3 className="font-display font-bold text-2xl text-white mb-1">Create free account</h3>
            <p className="text-gray-400 text-sm mb-6">No credit card required</p>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Full name</label>
                <input type="text" className="input-field" placeholder="Arjun Sharma"
                  value={form.full_name} onChange={e => setForm(f => ({ ...f, full_name: e.target.value }))}
                  disabled={loading} autoComplete="name" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Email address</label>
                <input type="email" className="input-field" placeholder="you@example.com"
                  value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                  disabled={loading} autoComplete="email" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Password</label>
                <div className="relative">
                  <input type={showPass ? 'text' : 'password'} className="input-field pr-12"
                    placeholder="Minimum 6 characters"
                    value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                    disabled={loading} autoComplete="new-password" />
                  <button type="button" onClick={() => setShowPass(s => !s)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors">
                    {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>
              <button type="submit" disabled={loading}
                className="btn-primary w-full py-3.5 rounded-xl font-semibold flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed mt-2">
                {loading ? <div className="spinner" style={{ width: 20, height: 20, borderWidth: 2 }} /> : (
                  <>Create Free Account <ArrowRight size={16} /></>
                )}
              </button>
            </form>
            <p className="mt-5 text-center text-xs text-gray-500">
              By registering, you agree to our Terms of Service.
            </p>
            <div className="mt-4 text-center text-sm text-gray-500">
              Already have an account?{' '}
              <Link to="/login" className="text-violet-400 hover:text-violet-300 font-medium transition-colors">Sign in</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
