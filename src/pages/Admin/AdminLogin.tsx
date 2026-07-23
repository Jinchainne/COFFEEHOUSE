import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdmin } from '../../hooks/useAdmin';
import { Lock, Eye, EyeOff, Shield } from 'lucide-react';

export default function AdminLogin() {
  const navigate = useNavigate();
  const { login, isAdmin } = useAdmin();
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (isAdmin) {
    navigate('/admin/dashboard');
    return null;
  }

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setTimeout(() => {
      const ok = login(password);
      setLoading(false);
      if (ok) {
        navigate('/admin/dashboard');
      } else {
        setError('Wrong admin password');
      }
    }, 500);
  };

  return (
    <div className="bg-slate-50 min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="card p-8">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-cyan-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-blue-200">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-extrabold text-slate-900">Admin Panel</h1>
            <p className="text-sm text-slate-400 mt-1">Login to manage the system</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5 block">Admin Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={e => { setPassword(e.target.value); setError(''); }}
                  placeholder="Enter admin password"
                  className="pl-10 pr-10 w-full"
                  autoFocus
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
            </div>

            <button type="submit" disabled={loading || !password} className="btn-primary w-full">
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Authenticating...
                </span>
              ) : 'Login'}
            </button>
          </form>

          <p className="text-center text-xs text-slate-400 mt-6">
            Demo: password = <code className="bg-slate-100 px-1.5 py-0.5 rounded text-slate-600 font-mono">admin123</code>
          </p>
        </div>

        <button onClick={() => navigate('/shop')} className="w-full text-center text-sm text-slate-400 hover:text-slate-600 mt-4">
          ← Back to Shop
        </button>
      </div>
    </div>
  );
}
