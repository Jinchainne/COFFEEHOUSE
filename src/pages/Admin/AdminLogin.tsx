import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdmin } from '../../hooks/useAdmin';
import { Lock, Eye, EyeOff, Shield, Coffee, BarChart3, Receipt } from 'lucide-react';

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

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const ok = await login(password);
      setLoading(false);
      if (ok) {
        navigate('/admin/dashboard');
      } else {
        setError('Invalid password');
      }
    } catch {
      setLoading(false);
      setError('Connection error. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Left side - branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-slate-900 via-blue-900 to-cyan-900 p-12 flex-col justify-center relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-cyan-500/10 rounded-full blur-3xl" />
        
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-400 rounded-2xl flex items-center justify-center shadow-lg">
              <Coffee className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-white font-extrabold text-xl">Coffee House</h2>
              <p className="text-blue-300 text-xs">Admin Panel</p>
            </div>
          </div>

          <h1 className="text-4xl font-extrabold text-white mb-4 leading-tight">
            Manage your<br />
            <span className="text-cyan-300">business</span> with<br />
            full transparency
          </h1>
          <p className="text-blue-200 text-sm max-w-sm mb-8">
            Track orders, manage finances, view revenue, and handle taxes — all in one place. Every transaction is on-chain and verifiable.
          </p>

          <div className="space-y-4">
            <div className="flex items-center gap-3 bg-white/10 backdrop-blur rounded-xl p-4">
              <BarChart3 className="w-5 h-5 text-cyan-300" />
              <div>
                <p className="text-white text-sm font-semibold">Revenue Analytics</p>
                <p className="text-blue-300 text-xs">Real-time revenue and profit tracking</p>
              </div>
            </div>
            <div className="flex items-center gap-3 bg-white/10 backdrop-blur rounded-xl p-4">
              <Receipt className="w-5 h-5 text-emerald-300" />
              <div>
                <p className="text-white text-sm font-semibold">Finance & Tax</p>
                <p className="text-blue-300 text-xs">Income, expenses, VAT, corporate tax</p>
              </div>
            </div>
            <div className="flex items-center gap-3 bg-white/10 backdrop-blur rounded-xl p-4">
              <Shield className="w-5 h-5 text-amber-300" />
              <div>
                <p className="text-white text-sm font-semibold">Order Management</p>
                <p className="text-blue-300 text-xs">Track every order from payment to delivery</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right side - login form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-sm">
          <div className="lg:hidden flex items-center gap-3 mb-8">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-cyan-500 rounded-xl flex items-center justify-center">
              <Coffee className="w-5 h-5 text-white" />
            </div>
            <h2 className="font-extrabold text-slate-900 text-lg">Coffee House Admin</h2>
          </div>

          <h2 className="text-2xl font-extrabold text-slate-900 mb-1">Welcome back</h2>
          <p className="text-sm text-slate-400 mb-8">Sign in to manage your shop</p>

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block">Admin Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={e => { setPassword(e.target.value); setError(''); }}
                  placeholder="Enter admin password"
                  className="pl-11 pr-11 h-12"
                  autoFocus
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {error && <p className="text-xs text-red-500 mt-2">{error}</p>}
            </div>

            <button type="submit" disabled={loading || !password} className="btn-primary w-full h-12 text-base">
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Signing in...
                </span>
              ) : 'Sign In'}
            </button>
          </form>

          <div className="mt-8 p-4 bg-slate-50 rounded-xl">
            <p className="text-xs text-slate-400 text-center">
              Contact the shop owner for admin access
            </p>
          </div>

          <button onClick={() => navigate('/shop')} className="w-full text-center text-sm text-slate-400 hover:text-slate-600 mt-6 transition-colors">
            ← Back to Shop
          </button>
        </div>
      </div>
    </div>
  );
}
