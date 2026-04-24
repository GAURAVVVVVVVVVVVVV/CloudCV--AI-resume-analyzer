import { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { userAPI } from '../utils/api';
import toast from 'react-hot-toast';
import { User, Mail, Calendar, TrendingUp, FileText, Target, Edit3, Check, X } from 'lucide-react';

export default function ProfilePage() {
  const { user, setUser } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [newName, setNewName] = useState(user?.full_name || '');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    userAPI.profile()
      .then(res => setProfile(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async () => {
    if (!newName.trim()) return toast.error('Name cannot be empty');
    setSaving(true);
    try {
      const { data } = await userAPI.updateProfile({ full_name: newName.trim() });
      setUser(data.user);
      setProfile(p => ({ ...p, user: data.user }));
      toast.success('Profile updated!');
      setEditing(false);
    } catch {
      toast.error('Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const initials = user?.full_name
    ? user.full_name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    : 'U';

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div>
        <h1 className="font-display font-bold text-3xl text-white mb-1">Profile</h1>
        <p className="text-gray-400">Manage your account settings</p>
      </div>

      {/* Profile card */}
      <div className="glass-card p-8">
        <div className="flex items-start gap-6">
          <div className="w-20 h-20 rounded-2xl flex items-center justify-center text-2xl font-bold text-white flex-shrink-0"
            style={{ background: 'linear-gradient(135deg, #7c3aed, #6d28d9)' }}>
            {initials}
          </div>
          <div className="flex-1 min-w-0">
            {editing ? (
              <div className="flex items-center gap-2 mb-4">
                <input className="input-field text-lg font-semibold max-w-xs"
                  value={newName} onChange={e => setNewName(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleSave()} autoFocus />
                <button onClick={handleSave} disabled={saving}
                  className="w-9 h-9 rounded-lg flex items-center justify-center bg-jade-600 hover:bg-jade-500 text-white transition-colors">
                  {saving ? <div className="spinner" style={{ width: 16, height: 16, borderWidth: 2 }} /> : <Check size={16} />}
                </button>
                <button onClick={() => { setEditing(false); setNewName(user?.full_name || ''); }}
                  className="w-9 h-9 rounded-lg flex items-center justify-center bg-white/10 hover:bg-white/15 text-gray-300 transition-colors">
                  <X size={16} />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3 mb-2">
                <h2 className="font-display font-bold text-2xl text-white">{user?.full_name}</h2>
                <button onClick={() => setEditing(true)}
                  className="text-gray-500 hover:text-violet-400 transition-colors p-1">
                  <Edit3 size={15} />
                </button>
              </div>
            )}
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-gray-400 text-sm">
                <Mail size={14} className="text-gray-600" />
                {user?.email}
              </div>
              <div className="flex items-center gap-2 text-gray-400 text-sm">
                <Calendar size={14} className="text-gray-600" />
                Joined {user?.created_at ? new Date(user.created_at).toLocaleDateString('en-IN', { month: 'long', year: 'numeric' }) : 'recently'}
              </div>
            </div>
            <div className="mt-3">
              <span className="tag tag-jade">{user?.plan === 'free' ? 'Free Plan' : 'Pro Plan'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      {loading ? (
        <div className="grid grid-cols-3 gap-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="glass-card p-5 animate-pulse">
              <div className="h-8 bg-white/5 rounded mb-2 w-12" />
              <div className="h-4 bg-white/5 rounded w-20" />
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-3 gap-4">
          {[
            { icon: FileText, label: 'Total Analyses', value: profile?.stats?.total_analyses || 0, color: '#8b5cf6' },
            { icon: TrendingUp, label: 'Avg Score', value: profile?.stats?.avg_score ? `${profile.stats.avg_score}%` : '—', color: '#10b981' },
            { icon: Target, label: 'Avg ATS', value: profile?.stats?.avg_ats_score ? `${profile.stats.avg_ats_score}%` : '—', color: '#f59e0b' },
          ].map(({ icon: Icon, label, value, color }) => (
            <div key={label} className="glass-card p-5 text-center">
              <Icon size={20} className="mx-auto mb-2" style={{ color }} />
              <div className="font-display font-bold text-2xl text-white mb-1">{value}</div>
              <div className="text-xs text-gray-500">{label}</div>
            </div>
          ))}
        </div>
      )}

      {/* Info */}
      <div className="glass-card p-6" style={{ borderColor: 'rgba(139, 92, 246, 0.2)' }}>
        <h3 className="font-display font-semibold text-white text-lg mb-3">About ResumeAI</h3>
        <div className="space-y-2 text-sm text-gray-400">
          <p>• Your resume data is stored securely and never shared with third parties.</p>
          <p>• Analysis is powered by Anthropic's Claude AI model.</p>
          <p>• Files are stored in encrypted Supabase Storage.</p>
          <p>• Free plan includes up to 10 analyses per hour.</p>
        </div>
      </div>
    </div>
  );
}
