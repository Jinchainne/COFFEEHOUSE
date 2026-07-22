import { useStore } from '../hooks/useStore';
import { StatusBadge } from '../components/UI';
import { formatCurrency, formatTime } from '../utils/format';
import { useNavigate } from 'react-router-dom';
import { useAccount } from 'wagmi';

import {
  Send, QrCode, ArrowDownLeft, ArrowUpRight, Users, Globe,
  TrendingUp, Activity, CreditCard, Banknote,
  Zap, Shield, Smartphone, Building2
} from 'lucide-react';

const categories = [
  { label: 'Recommended', icon: '⭐', active: true },
  { label: 'Finance & Insurance', icon: '🛡️' },
  { label: 'Payments', icon: '💳' },
  { label: 'Transfers', icon: '🔄' },
  { label: 'Travel', icon: '✈️' },
  { label: 'Utilities', icon: '⚡' },
  { label: 'Entertainment', icon: '🎬' },
  { label: 'Shopping', icon: '🛒' },
];

const recommendedServices = [
  { label: 'AI Financial Assistant', icon: '🤖', color: 'border-blue-400 text-blue-600' },
  { label: 'Expense Tracker', icon: '📊', color: 'border-emerald-400 text-emerald-600' },
  { label: 'Savings Goals', icon: '🎯', color: 'border-amber-400 text-amber-600' },
  { label: 'Budget Planner', icon: '📋', color: 'border-violet-400 text-violet-600' },
  { label: 'Group Fund', icon: '👥', color: 'border-pink-400 text-pink-600' },
  { label: 'Quick Loan', icon: '💰', color: 'border-orange-400 text-orange-600' },
  { label: 'FX Converter', icon: '🌍', color: 'border-cyan-400 text-cyan-600' },
  { label: 'Payment Reminders', icon: '🔔', color: 'border-indigo-400 text-indigo-600' },
  { label: 'Nano Payments', icon: '⚡', color: 'border-sky-400 text-sky-600' },
  { label: 'Bill Payments', icon: '🧾', color: 'border-rose-400 text-rose-600' },
];

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

const newsItems = [
  { title: 'Send USDC with zero fees this week on Arc Testnet', tag: 'Promotion', image: '💸' },
  { title: 'ArcBank AI Assistant now supports budget tracking', tag: 'New Feature', image: '🤖' },
  { title: 'Cross-border remittance to 7 new countries live', tag: 'Update', image: '🌍' },
  { title: 'Split Bill feature: smart settlement with AI suggestions', tag: 'New Feature', image: '👥' },
];

export default function Dashboard() {
  const { balance, transactions } = useStore();
  useAccount();
  const navigate = useNavigate();
  const total = balance.usdc + balance.eurc;

  return (
    <div className="bg-white min-h-screen">
      {/* Hero Banner (MoMo style) */}
      <div className="bg-gradient-to-r from-blue-50 to-cyan-50 px-4 sm:px-6 py-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mb-2">
            Digital Banking Services
          </h1>
          <p className="text-base text-slate-500 max-w-2xl mb-6">
            ArcBank lets you access diverse financial services with stablecoins at minimal cost — do more with your money on Arc Testnet.
          </p>

          {/* Balance Card */}
          <div className="hero-gradient p-6 sm:p-8 text-white relative max-w-2xl">
            <div className="relative z-10">
              <p className="text-blue-100 text-xs font-medium mb-1">Total Balance</p>
              <div className="flex items-baseline gap-2">
                <span className="balance-amount">${total.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
              </div>
              <p className="text-blue-200 text-[11px] mt-1">Across USDC & EURC on Arc Testnet</p>
              <div className="flex gap-2 mt-5">
                <button onClick={() => navigate('/send')} className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-white/20 hover:bg-white/30 text-white text-sm font-semibold transition-colors">
                  <Send className="w-4 h-4" /> Send
                </button>
                <button onClick={() => navigate('/receive')} className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-white/20 hover:bg-white/30 text-white text-sm font-semibold transition-colors">
                  <QrCode className="w-4 h-4" /> Receive
                </button>
                <button onClick={() => navigate('/split')} className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-white/20 hover:bg-white/30 text-white text-sm font-semibold transition-colors">
                  <Users className="w-4 h-4" /> Split
                </button>
                <button onClick={() => navigate('/remit')} className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-white/20 hover:bg-white/30 text-white text-sm font-semibold transition-colors">
                  <Globe className="w-4 h-4" /> Remit
                </button>
              </div>
            </div>
          </div>

          {/* Token Balances */}
          <div className="grid grid-cols-2 gap-3 mt-4 max-w-2xl">
            <div className="card p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center"><span className="text-blue-600 font-bold text-sm">$</span></div>
                <div><p className="text-[11px] text-slate-400 font-medium">USDC</p><p className="text-lg font-bold text-slate-900">{formatCurrency(balance.usdc)}</p></div>
              </div>
            </div>
            <div className="card p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center"><span className="text-emerald-600 font-bold text-sm">€</span></div>
                <div><p className="text-[11px] text-slate-400 font-medium">EURC</p><p className="text-lg font-bold text-slate-900">{formatCurrency(balance.eurc)}</p></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Category Tabs (MoMo horizontal scroll) */}
      <div className="border-b border-slate-200 bg-white sticky top-16 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex gap-1 overflow-x-auto py-3 scrollbar-hide">
            {categories.map((cat, i) => (
              <button key={i} className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
                cat.active ? 'bg-blue-50 text-blue-600 border border-blue-200' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50'
              }`}>
                <span>{cat.icon}</span> {cat.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Recommended Service Pills (MoMo style) */}
      <div className="px-4 sm:px-6 py-5">
        <div className="max-w-7xl">
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {recommendedServices.map((svc, i) => (
              <button key={i} className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-full border-2 bg-white text-sm font-medium whitespace-nowrap hover:shadow-sm transition-all ${svc.color}`}>
                <span>{svc.icon}</span> {svc.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Promo Banner (MoMo AI assistant style) */}
      <div className="px-4 sm:px-6 pb-6">
        <div className="max-w-7xl">
          <div className="card overflow-hidden">
            <div className="flex flex-col md:flex-row">
              <div className="flex-1 p-6 sm:p-8 bg-gradient-to-br from-blue-50 to-cyan-50">
                <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 mb-3 leading-tight">
                  Not just a wallet — ArcBank is your AI Financial Assistant
                </h2>
                <ul className="space-y-2 mb-5">
                  {[
                    'Access diverse financial services with stablecoins at minimal cost',
                    'Do more with your money — even the smallest transactions are viable on Arc',
                    'AI appears in every interaction to protect your funds, simplify complex tasks, and help you learn personal finance'
                  ].map((text, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-slate-600">
                      <span className="text-blue-500 mt-0.5">✓</span> {text}
                    </li>
                  ))}
                </ul>
                <button className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-sm font-bold transition-colors">
                  TRY NOW
                </button>
              </div>
              <div className="w-full md:w-72 h-48 md:h-auto bg-gradient-to-br from-blue-400 to-cyan-400 flex items-center justify-center relative overflow-hidden">
                <div className="absolute inset-0 opacity-20">
                  <div className="absolute top-4 left-8 w-20 h-20 rounded-full bg-white/30" />
                  <div className="absolute bottom-8 right-12 w-32 h-32 rounded-full bg-white/20" />
                </div>
                <span className="text-7xl relative z-10">🤖</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Services Grid (MoMo style) */}
      <div className="px-4 sm:px-6 pb-6">
        <div className="max-w-7xl">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-slate-900">Services</h2>
            <button className="text-sm text-blue-500 font-medium hover:text-blue-600">View all →</button>
          </div>
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
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

      {/* What's New (MoMo news section) */}
      <div className="px-4 sm:px-6 pb-6">
        <div className="max-w-7xl">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-slate-900">What's New on ArcBank?</h2>
            <div className="flex gap-1 bg-slate-100 p-1 rounded-xl">
              {['Latest', 'Promotions', 'Updates'].map(tab => (
                <button key={tab} className="px-3 py-1.5 rounded-lg text-xs font-medium text-slate-500 hover:text-slate-900 hover:bg-white transition-all first:bg-white first:text-slate-900 first:shadow-sm">
                  {tab}
                </button>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {newsItems.map((item, i) => (
              <div key={i} className="card overflow-hidden cursor-pointer group">
                <div className="h-32 bg-gradient-to-br from-blue-100 to-cyan-100 flex items-center justify-center text-5xl">
                  {item.image}
                </div>
                <div className="p-4">
                  <span className="inline-block px-2 py-0.5 bg-blue-50 text-blue-600 text-[10px] font-bold rounded-full mb-2">{item.tag}</span>
                  <p className="text-sm font-semibold text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-2">{item.title}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="px-4 sm:px-6 pb-6">
        <div className="max-w-7xl">
          <div className="card p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <Activity className="w-5 h-5 text-blue-500" />
                Recent Transactions
              </h2>
              <button onClick={() => navigate('/history')} className="text-sm text-blue-500 font-medium hover:text-blue-600">View all →</button>
            </div>
            <div className="divide-y divide-slate-100">
              {transactions.slice(0, 5).map(tx => (
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
      </div>

      {/* Trust & Security (MoMo style) */}
      <div className="px-4 sm:px-6 pb-8">
        <div className="max-w-7xl">
          <h2 className="text-lg font-bold text-slate-900 mb-4 text-center">Secure Payments — Absolute Safety</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { icon: Shield, title: 'International Security Standard', desc: 'Arc L1 blockchain with sub-second deterministic finality and post-quantum security.' },
              { icon: Zap, title: 'Bank-Grade Reliability', desc: 'Circle-backed USDC stablecoin, 1:1 USD reserves, permissioned validator set.' },
              { icon: Lock, title: 'Encrypted & Compliant', desc: 'Opt-in privacy, selective disclosure, compliance hooks with Elliptic & TRM Labs.' },
            ].map((item, i) => (
              <div key={i} className="card p-5 text-center">
                <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center mx-auto mb-3">
                  <item.icon className="w-6 h-6 text-blue-500" />
                </div>
                <h3 className="text-sm font-bold text-slate-900 mb-1">{item.title}</h3>
                <p className="text-xs text-slate-500 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function Lock(props: any) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
    </svg>
  );
}
