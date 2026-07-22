import Header from '../components/Header';
import { useStore } from '../hooks/useStore';
import { StatusBadge } from '../components/UI';
import { formatCurrency, formatTime, shortenAddress } from '../utils/format';
import { useNavigate } from 'react-router-dom';
import {
  Send, QrCode, ArrowDownLeft, ArrowUpRight, Users, Globe,
  TrendingUp, Activity, CreditCard, Banknote,
  Zap, Shield, Smartphone, Building2
} from 'lucide-react';

export default function Dashboard() {
  const { balance, transactions } = useStore();
  const navigate = useNavigate();
  const total = balance.usdc + balance.eurc;

  const services = [
    { icon: Send, label: 'Send Money', sub: 'Free, instant', color: 'bg-blue-500', path: '/send' },
    { icon: QrCode, label: 'Receive', sub: 'QR & address', color: 'bg-cyan-500', path: '/receive' },
    { icon: Users, label: 'Split Bill', sub: 'Group expenses', color: 'bg-violet-500', path: '/split' },
    { icon: Globe, label: 'Remittance', sub: 'Cross-border', color: 'bg-emerald-500', path: '/remit' },
    { icon: CreditCard, label: 'Pay Bills', sub: 'Utilities', color: 'bg-orange-500', path: '#' },
    { icon: Banknote, label: 'Quick Loan', sub: 'Up to $10,000', color: 'bg-pink-500', path: '#' },
    { icon: Smartphone, label: 'Mobile Top-up', sub: '4G/5G Data', color: 'bg-teal-500', path: '#' },
    { icon: Building2, label: 'Bank Transfer', sub: 'Link accounts', color: 'bg-indigo-500', path: '#' },
    { icon: Shield, label: 'Insurance', sub: 'Protect assets', color: 'bg-amber-500', path: '#' },
    { icon: TrendingUp, label: 'Savings', sub: 'Earn yield', color: 'bg-green-500', path: '#' },
    { icon: Zap, label: 'Nano Payments', sub: 'Micro-txns', color: 'bg-sky-500', path: '#' },
    { icon: Activity, label: 'Analytics', sub: 'Track spending', color: 'bg-rose-500', path: '#' },
  ];

  const quickActions = [
    { icon: '🤖', label: 'AI Financial Assistant' },
    { icon: '💰', label: 'Expense Tracker' },
    { icon: '🎯', label: 'Savings Goals' },
    { icon: '🔔', label: 'Payment Reminders' },
    { icon: '📊', label: 'Budget Planner' },
    { icon: '🌍', label: 'FX Converter' },
  ];

  return (
    <div className="bg-slate-50 min-h-screen">
      <Header title="Dashboard" subtitle="Your digital banking hub" />

      {/* Hero Balance Section */}
      <div className="px-4 sm:px-6 pt-5 pb-3">
        <div className="hero-gradient p-6 text-white relative">
          <div className="relative z-10">
            <p className="text-blue-100 text-xs font-medium mb-1">Total Balance</p>
            <div className="flex items-baseline gap-2">
              <span className="balance-amount">${total.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
            </div>
            <p className="text-blue-200 text-[11px] mt-1">Across USDC & EURC on Arc Testnet</p>

            {/* Quick action buttons */}
            <div className="flex gap-2 mt-5">
              <button onClick={() => navigate('/send')}
                className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white text-sm font-semibold transition-colors">
                <Send className="w-4 h-4" /> Send
              </button>
              <button onClick={() => navigate('/receive')}
                className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white text-sm font-semibold transition-colors">
                <QrCode className="w-4 h-4" /> Receive
              </button>
              <button onClick={() => navigate('/split')}
                className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white text-sm font-semibold transition-colors">
                <Users className="w-4 h-4" /> Split
              </button>
              <button onClick={() => navigate('/remit')}
                className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white text-sm font-semibold transition-colors">
                <Globe className="w-4 h-4" /> Remit
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Token Balances */}
      <div className="px-4 sm:px-6 pb-3">
        <div className="grid grid-cols-2 gap-3">
          <div className="card p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center">
                <span className="text-blue-600 font-bold text-sm">$</span>
              </div>
              <div>
                <p className="text-[11px] text-slate-400 font-medium">USDC Balance</p>
                <p className="text-lg font-bold text-slate-900">{formatCurrency(balance.usdc)}</p>
              </div>
            </div>
          </div>
          <div className="card p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center">
                <span className="text-emerald-600 font-bold text-sm">€</span>
              </div>
              <div>
                <p className="text-[11px] text-slate-400 font-medium">EURC Balance</p>
                <p className="text-lg font-bold text-slate-900">{formatCurrency(balance.eurc)}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions (MoMo pill style) */}
      <div className="px-4 sm:px-6 pb-3">
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {quickActions.map((action, i) => (
            <button key={i} className="quick-pill">
              <span>{action.icon}</span>
              {action.label}
            </button>
          ))}
        </div>
      </div>

      {/* AI Banner (MoMo-style promo) */}
      <div className="px-4 sm:px-6 pb-3">
        <div className="card p-5 flex items-center gap-4 bg-gradient-to-r from-blue-50 to-cyan-50 border border-blue-100">
          <div className="flex-1">
            <h3 className="text-sm font-bold text-slate-900 mb-1">ArcBank AI Financial Assistant</h3>
            <p className="text-xs text-slate-500 mb-3 leading-relaxed">
              Smart spending insights, auto-categorization, budget alerts, and AI-powered financial advice — all on Arc stablecoin rails.
            </p>
            <button className="px-4 py-2 rounded-lg bg-blue-600 text-white text-xs font-semibold hover:bg-blue-500 transition-colors">
              TRY NOW
            </button>
          </div>
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-400 to-cyan-400 flex items-center justify-center flex-shrink-0">
            <span className="text-3xl">🤖</span>
          </div>
        </div>
      </div>

      {/* Services Grid (MoMo-style) */}
      <div className="px-4 sm:px-6 pb-3">
        <div className="card p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-slate-900">Services</h3>
            <button className="text-xs text-blue-500 font-medium hover:text-blue-600">View all →</button>
          </div>
          <div className="grid grid-cols-4 sm:grid-cols-6 gap-1">
            {services.map((svc, i) => (
              <button key={i} className="service-icon" onClick={() => svc.path !== '#' && navigate(svc.path)}>
                <div className={`icon-circle ${svc.color} text-white shadow-sm`}>
                  <svc.icon className="w-5 h-5" />
                </div>
                <div>
                  <p className="label">{svc.label}</p>
                  <p className="sublabel">{svc.sub}</p>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Stats Row */}
      <div className="px-4 sm:px-6 pb-3">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: 'Sent This Month', value: '$2,245.00', icon: ArrowUpRight, color: 'text-blue-600 bg-blue-50', change: '+12%' },
            { label: 'Received This Month', value: '$3,570.00', icon: ArrowDownLeft, color: 'text-emerald-600 bg-emerald-50', change: '+8%' },
            { label: 'Active Splits', value: '3 Groups', icon: Users, color: 'text-violet-600 bg-violet-50', change: '2 settling' },
            { label: 'Remittance Sent', value: '$1,750.00', icon: Globe, color: 'text-cyan-600 bg-cyan-50', change: '-5%' },
          ].map((stat, i) => (
            <div key={i} className="card p-4">
              <div className="flex items-center justify-between mb-2">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${stat.color}`}>
                  <stat.icon className="w-4 h-4" />
                </div>
                <span className="text-[10px] font-semibold text-slate-400">{stat.change}</span>
              </div>
              <p className="text-base font-bold text-slate-900">{stat.value}</p>
              <p className="text-[10px] text-slate-400 mt-0.5">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="px-4 sm:px-6 pb-6">
        <div className="card p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Activity className="w-4 h-4 text-blue-500" />
              Recent Transactions
            </h3>
            <button onClick={() => navigate('/history')} className="text-xs text-blue-500 font-medium hover:text-blue-600">View all →</button>
          </div>
          <div className="divide-y divide-slate-100">
            {transactions.slice(0, 6).map(tx => (
              <div key={tx.id} className="tx-row">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                  tx.type === 'send' ? 'bg-red-50 text-red-500' :
                  tx.type === 'receive' ? 'bg-emerald-50 text-emerald-500' :
                  tx.type === 'split' ? 'bg-violet-50 text-violet-500' :
                  'bg-blue-50 text-blue-500'
                }`}>
                  {tx.type === 'send' ? <ArrowUpRight className="w-5 h-5" /> :
                   tx.type === 'receive' ? <ArrowDownLeft className="w-5 h-5" /> :
                   tx.type === 'split' ? <Users className="w-5 h-5" /> :
                   <Globe className="w-5 h-5" />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[13px] font-semibold text-slate-900 truncate">
                    {tx.type === 'send' ? `To ${tx.to}` : tx.type === 'receive' ? `From ${tx.from}` : tx.type === 'split' ? tx.to : `Remit to ${tx.to}`}
                  </p>
                  <p className="text-[11px] text-slate-400">{formatTime(tx.timestamp)}{tx.memo ? ` · ${tx.memo}` : ''}</p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className={`text-[13px] font-bold ${tx.type === 'receive' ? 'text-emerald-600' : 'text-slate-900'}`}>
                    {tx.type === 'receive' ? '+' : '-'}{formatCurrency(tx.amount)}
                  </p>
                  <StatusBadge status={tx.status} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Network Info Footer */}
      <div className="px-4 sm:px-6 pb-8">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="card p-4 flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-emerald-500 pulse-dot" />
            <div>
              <p className="text-xs font-semibold text-slate-700">Network Status</p>
              <p className="text-[10px] text-slate-400">All systems operational · Finality &lt;1s</p>
            </div>
          </div>
          <div className="card p-4 flex items-center gap-3">
            <Zap className="w-4 h-4 text-amber-500" />
            <div>
              <p className="text-xs font-semibold text-slate-700">Average Fee</p>
              <p className="text-[10px] text-slate-400">~$0.01 per transaction on Arc</p>
            </div>
          </div>
          <div className="card p-4 flex items-center gap-3">
            <Shield className="w-4 h-4 text-blue-500" />
            <div>
              <p className="text-xs font-semibold text-slate-700">Wallet</p>
              <p className="text-[10px] text-slate-400 font-mono">{shortenAddress('0xb3351234567890abcdef1234567890abcdefc544')}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
