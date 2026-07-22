import { useStore } from '../hooks/useStore';
import { StatusBadge } from '../components/UI';
import { formatTime } from '../utils/format';
import { useNavigate } from 'react-router-dom';
import { useAccount } from 'wagmi';
import { useUSDCBalance, useEURCBalance, useNativeBalance } from '../hooks/useOnChain';
import { useRecentTransactions } from '../hooks/useTransactions';
import { IMAGES } from '../config/images';
import {
  Send, QrCode, ArrowDownLeft, ArrowUpRight, Users, Globe,
  TrendingUp, Activity, CreditCard, Banknote,
  Zap, Shield, Smartphone, Building2, Wallet, Clock, ExternalLink
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
  { label: 'AI Financial Assistant', icon: '🤖', color: 'border-blue-400 text-blue-600', action: 'ai' },
  { label: 'Expense Tracker', icon: '📊', color: 'border-emerald-400 text-emerald-600', action: 'history' },
  { label: 'Savings Goals', icon: '🎯', color: 'border-amber-400 text-amber-600', action: '#' },
  { label: 'Budget Planner', icon: '📋', color: 'border-violet-400 text-violet-600', action: 'history' },
  { label: 'Group Fund', icon: '👥', color: 'border-pink-400 text-pink-600', action: 'split' },
  { label: 'Quick Loan', icon: '💰', color: 'border-orange-400 text-orange-600', action: '#' },
  { label: 'FX Converter', icon: '🌍', color: 'border-cyan-400 text-cyan-600', action: 'remit' },
  { label: 'Payment Reminders', icon: '🔔', color: 'border-indigo-400 text-indigo-600', action: '#' },
  { label: 'Nano Payments', icon: '⚡', color: 'border-sky-400 text-sky-600', action: 'send' },
  { label: 'Bill Payments', icon: '🧾', color: 'border-rose-400 text-rose-600', action: 'send' },
];

const services = [
  { icon: Send, label: 'Send Money', sub: 'Free, instant', color: 'bg-blue-500', path: '/send' },
  { icon: QrCode, label: 'Receive', sub: 'QR & address', color: 'bg-cyan-500', path: '/receive' },
  { icon: Users, label: 'Split Bill', sub: 'Group expenses', color: 'bg-violet-500', path: '/split' },
  { icon: Globe, label: 'Remittance', sub: 'Cross-border FX', color: 'bg-emerald-500', path: '/remit' },
  { icon: CreditCard, label: 'Pay Bills', sub: 'Electricity, Water, Internet', color: 'bg-orange-500', path: '#' },
  { icon: Banknote, label: 'Quick Loan', sub: 'Up to $10,000 USDC', color: 'bg-pink-500', path: '#' },
  { icon: Smartphone, label: 'Mobile Top-up', sub: '4G/5G Data plans', color: 'bg-teal-500', path: '#' },
  { icon: Building2, label: 'Bank Transfer', sub: 'Link bank accounts', color: 'bg-indigo-500', path: '#' },
  { icon: Shield, label: 'Insurance', sub: 'Health, Auto, Travel', color: 'bg-amber-500', path: '#' },
  { icon: TrendingUp, label: 'Savings', sub: 'Earn yield on USDC', color: 'bg-green-500', path: '#' },
  { icon: Zap, label: 'Nano Payments', sub: 'Pay-per-use APIs', color: 'bg-sky-500', path: '#' },
  { icon: Activity, label: 'Analytics', sub: 'Track spending habits', color: 'bg-rose-500', path: '#' },
];

// Real news from Circle blog + CoinDesk (Jul 2026)
const newsItems = [
  { title: 'Introducing Arc: Circle Open Layer-1 Blockchain for Stablecoin Finance', tag: 'Blockchain', image: IMAGES.news1, date: 'Jul 2026' },
  { title: 'Augustus Raises $180M to Build a Clearing Bank for the AI and Stablecoin Era', tag: 'Finance', image: IMAGES.news2, date: 'Jul 2026' },
  { title: 'Visa Launches Stablecoin Platform as Circle Faces Fresh Competition', tag: 'Payments', image: IMAGES.news3, date: 'Jul 2026' },
  { title: 'Agent Stack: Financial Infrastructure for the Agentic Economy', tag: 'Developer', image: IMAGES.news4, date: 'Jul 2026' },
];

export default function Dashboard() {
  const { balance } = useStore();
  const { address, isConnected } = useAccount();
  const { balance: usdcBalance, isLoading: usdcLoading } = useUSDCBalance();
  const { balance: eurcBalance, isLoading: eurcLoading } = useEURCBalance();
  const { balance: nativeBalance } = useNativeBalance();
  const { transactions: onChainTxs, loading: txLoading } = useRecentTransactions(10);
  const navigate = useNavigate();

  // Use real on-chain balance when connected, fallback to mock
  const displayUSDC = isConnected ? usdcBalance : balance.usdc;
  const displayEURC = isConnected ? eurcBalance : balance.eurc;
  const total = displayUSDC + displayEURC;

  return (
    <div className="bg-white min-h-screen">
      {/* Hero Banner with real background image */}
      <div className="relative overflow-hidden" style={{ background: `linear-gradient(135deg, rgba(30,64,175,0.95), rgba(6,182,212,0.9)), url(${IMAGES.heroBg}) center/cover` }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white mb-2">
            Digital Banking Services
          </h1>
          <p className="text-base text-blue-100 max-w-2xl mb-8">
            Global Payments lets you send, receive, split bills, and remit USDC worldwide — all on Arc Testnet with sub-second settlement.
          </p>

          {/* Balance Card - REAL on-chain data */}
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 sm:p-8 text-white border border-white/20 max-w-2xl">
            <div className="flex items-center justify-between mb-1">
              <p className="text-blue-100 text-xs font-medium">Total Balance</p>
              {isConnected && (
                <span className="flex items-center gap-1.5 text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 pulse-dot" />
                  Live from Arc Testnet
                </span>
              )}
            </div>
            <div className="flex items-baseline gap-2">
              <span className="balance-amount">
                {isConnected ? `$${total.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : '--'}
              </span>
              {!isConnected && <span className="text-sm text-blue-200">Connect wallet to view</span>}
            </div>

            {/* Token balances */}
            <div className="flex gap-4 mt-4 mb-5">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-blue-400/30 flex items-center justify-center text-[10px] font-bold">$</div>
                <div>
                  <p className="text-[10px] text-blue-200">USDC</p>
                  <p className="text-sm font-bold">{isConnected ? (usdcLoading ? '...' : displayUSDC.toLocaleString('en-US', { minimumFractionDigits: 2 })) : '--'}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-emerald-400/30 flex items-center justify-center text-[10px] font-bold">€</div>
                <div>
                  <p className="text-[10px] text-blue-200">EURC</p>
                  <p className="text-sm font-bold">{isConnected ? (eurcLoading ? '...' : displayEURC.toLocaleString('en-US', { minimumFractionDigits: 2 })) : '--'}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-cyan-400/30 flex items-center justify-center text-[10px] font-bold">⛽</div>
                <div>
                  <p className="text-[10px] text-blue-200">Gas (native)</p>
                  <p className="text-sm font-bold">{isConnected ? nativeBalance.toFixed(4) : '--'}</p>
                </div>
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex gap-2">
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
      </div>

      {/* Category Tabs */}
      <div className="border-b border-slate-200 bg-white sticky top-16 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex gap-1 overflow-x-auto py-3 scrollbar-hide">
            {categories.map((cat, i) => (
              <button key={i} onClick={() => {
                if (cat.label === 'Payments') navigate('/send');
                else if (cat.label === 'Transfers') navigate('/remit');
                else if (cat.label === 'Travel') navigate('/remit');
              }} className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all cursor-pointer ${
                cat.active ? 'bg-blue-50 text-blue-600 border border-blue-200' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50 hover:border hover:border-slate-200'
              }`}>
                <span>{cat.icon}</span> {cat.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Recommended Service Pills */}
      <div className="px-4 sm:px-6 py-5">
        <div className="max-w-7xl">
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {recommendedServices.map((svc, i) => (
              <button key={i} onClick={() => {
                if (svc.action === 'ai') document.querySelector('[data-ai-chat]')?.dispatchEvent(new MouseEvent('click'));
                else if (svc.action === 'history') navigate('/history');
                else if (svc.action === 'split') navigate('/split');
                else if (svc.action === 'remit') navigate('/remit');
                else if (svc.action === 'send') navigate('/send');
              }} className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-full border-2 bg-white text-sm font-medium whitespace-nowrap hover:shadow-md hover:-translate-y-0.5 transition-all cursor-pointer ${svc.color}`}>
                <span>{svc.icon}</span> {svc.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Promo Banner with real image */}
      <div className="px-4 sm:px-6 pb-6">
        <div className="max-w-7xl">
          <div className="card overflow-hidden">
            <div className="flex flex-col md:flex-row">
              <div className="flex-1 p-6 sm:p-8 bg-gradient-to-br from-blue-50 to-cyan-50">
                <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 mb-3 leading-tight">
                  Not just a wallet — your AI Financial Assistant
                </h2>
                <ul className="space-y-2 mb-5">
                  {[
                    'Powered by Xiaomi MiMo AI — smart spending insights and budget alerts',
                    'Send USDC in under 1 second for ~$0.01 on Arc Testnet',
                    'Split bills, remit cross-border, and track expenses — all from one app'
                  ].map((text, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-slate-600">
                      <span className="text-blue-500 mt-0.5">✓</span> {text}
                    </li>
                  ))}
                </ul>
                <button onClick={() => window.dispatchEvent(new CustomEvent('open-ai-chat'))} className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-sm font-bold transition-colors">
                  TRY AI ASSISTANT
                </button>
              </div>
              <div className="w-full md:w-80 h-48 md:h-auto">
                <img src={IMAGES.aiPromo} alt="AI Financial Assistant" className="w-full h-full object-cover" loading="lazy" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Services Grid */}
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

      {/* What's New with real images */}
      <div className="px-4 sm:px-6 pb-6">
        <div className="max-w-7xl">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-slate-900">What's New?</h2>
            <div className="flex gap-1 bg-slate-100 p-1 rounded-xl">
              {['Latest', 'Arc News', 'Features'].map((tab, i) => (
                <button key={tab} className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${i === 0 ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-900'}`}>
                  {tab}
                </button>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {newsItems.map((item, i) => (
              <div key={i} className="card overflow-hidden cursor-pointer group hover:shadow-lg hover:-translate-y-1 transition-all">
                <div className="h-36 overflow-hidden">
                  <img src={item.image} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" loading="lazy" />
                </div>
                <div className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="inline-block px-2 py-0.5 bg-blue-50 text-blue-600 text-[10px] font-bold rounded-full">{item.tag}</span>
                    <span className="text-[10px] text-slate-400">{item.date}</span>
                  </div>
                  <p className="text-sm font-semibold text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-2">{item.title}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Transactions - REAL on-chain */}
      <div className="px-4 sm:px-6 pb-6">
        <div className="max-w-7xl">
          <div className="card p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <Activity className="w-5 h-5 text-blue-500" />
                Recent Transactions
                {isConnected && <span className="text-[10px] bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full font-medium">On-chain</span>}
              </h2>
              <button onClick={() => navigate('/history')} className="text-sm text-blue-500 font-medium hover:text-blue-600">View all →</button>
            </div>
            
            {!isConnected ? (
              <div className="text-center py-8">
                <Wallet className="w-10 h-10 text-slate-300 mx-auto mb-3" />
                <p className="text-sm text-slate-500">Connect your wallet to see on-chain transactions</p>
              </div>
            ) : txLoading ? (
              <div className="text-center py-8">
                <div className="animate-spin w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full mx-auto mb-3" />
                <p className="text-sm text-slate-500">Loading transactions from Arc Testnet...</p>
              </div>
            ) : onChainTxs.length === 0 ? (
              <div className="text-center py-8">
                <Activity className="w-10 h-10 text-slate-300 mx-auto mb-3" />
                <p className="text-sm text-slate-500">No transactions found on Arc Testnet</p>
                <button onClick={() => navigate('/send')} className="mt-3 btn-primary !text-xs !py-2">Send your first USDC →</button>
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {onChainTxs.slice(0, 8).map(tx => {
                  const isSent = tx.from.toLowerCase() === address?.toLowerCase();
                  return (
                    <div key={tx.hash} className="tx-row">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${isSent ? 'bg-red-50 text-red-500' : 'bg-emerald-50 text-emerald-500'}`}>
                        {isSent ? <ArrowUpRight className="w-5 h-5" /> : <ArrowDownLeft className="w-5 h-5" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[13px] font-semibold text-slate-900 truncate">
                          {isSent ? `To ${tx.to.slice(0, 6)}...${tx.to.slice(-4)}` : `From ${tx.from.slice(0, 6)}...${tx.from.slice(-4)}`}
                        </p>
                        <div className="flex items-center gap-2 mt-0.5">
                          <Clock className="w-3 h-3 text-slate-400" />
                          <span className="text-[11px] text-slate-400">{formatTime(tx.timestamp)}</span>
                          <StatusBadge status={tx.status === 'success' ? 'completed' : tx.status} />
                        </div>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <p className={`text-[13px] font-bold ${isSent ? 'text-slate-900' : 'text-emerald-600'}`}>
                          {isSent ? '-' : '+'}{(Number(tx.value) / 1e18).toFixed(4)} USDC
                        </p>
                        <a href={`https://testnet.arcscan.app/tx/${tx.hash}`} target="_blank" rel="noreferrer"
                          className="text-[10px] text-blue-500 hover:text-blue-600 flex items-center gap-0.5 justify-end mt-0.5">
                          View <ExternalLink className="w-2.5 h-2.5" />
                        </a>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Security & Trust */}
      <div className="px-4 sm:px-6 pb-8">
        <div className="max-w-7xl">
          <h2 className="text-lg font-bold text-slate-900 mb-4 text-center">Secure Payments — Absolute Safety</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { icon: Shield, title: 'Arc L1 Security', desc: 'Sub-second deterministic finality, post-quantum security, permissioned validator set by Circle.' },
              { icon: Zap, title: 'USDC Native Gas', desc: 'Pay ~$0.01 per transaction in USDC — no volatile gas tokens. EIP-1559-style fee smoothing.' },
              { icon: Globe, title: 'Cross-Chain Ready', desc: 'CCTP v2 for native USDC bridging. Gateway for unified balance across Ethereum, Base, Arbitrum.' },
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
