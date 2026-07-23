import { useState, useRef, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useShop } from '../../hooks/useShop';
import { useAdmin } from '../../hooks/useAdmin';
import {
  Bot, Send, Loader2, ArrowLeft, TrendingUp, TrendingDown, DollarSign,
  ShoppingCart, Package, AlertTriangle, CheckCircle, Clock, Truck,
  BarChart3, Brain, Sparkles
} from 'lucide-react';

const MIMO_API = 'https://api.xiaomimimo.com/v1/chat/completions';
const MIMO_KEY = 'sk-szsjdjw70m8t5bwy8tgx4n0taa4egpnicnidvpt3im9exf3l';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
}

export default function AdminAgentDashboard() {
  const navigate = useNavigate();
  const { products, orders } = useShop();
  const { finances, totalIncome, totalExpense, profit } = useAdmin();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'chat' | 'orders' | 'finance' | 'insights'>('insights');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // ─── Order Analysis ───
  const orderAnalysis = useMemo(() => {
    const byStatus = { pending: 0, confirmed: 0, preparing: 0, shipping: 0, delivered: 0, cancelled: 0 };
    let totalRevenue = 0, totalShipping = 0;
    const productSales: Record<string, { name: string; qty: number; revenue: number }> = {};
    const categorySales: Record<string, number> = {};

    orders.forEach(order => {
      byStatus[order.status as keyof typeof byStatus] = (byStatus[order.status as keyof typeof byStatus] || 0) + 1;
      if (order.status !== 'cancelled') {
        totalRevenue += order.total;
        totalShipping += order.shippingFee;
      }
      order.items.forEach(item => {
        const pid = item.product.id;
        if (!productSales[pid]) productSales[pid] = { name: item.product.name, qty: 0, revenue: 0 };
        productSales[pid].qty += item.quantity;
        productSales[pid].revenue += item.product.price * item.quantity;
        const cat = item.product.category || 'Other';
        categorySales[cat] = (categorySales[cat] || 0) + item.product.price * item.quantity;
      });
    });

    const topProducts = Object.values(productSales).sort((a, b) => b.revenue - a.revenue).slice(0, 5);
    const topCategories = Object.entries(categorySales).sort((a, b) => b[1] - a[1]).slice(0, 5);
    const avgOrderValue = orders.filter(o => o.status !== 'cancelled').length > 0
      ? totalRevenue / orders.filter(o => o.status !== 'cancelled').length : 0;
    const pendingOrders = orders.filter(o => o.status === 'pending');
    const issueOrders = orders.filter(o => o.status === 'cancelled');

    return { byStatus, totalRevenue, totalShipping, topProducts, topCategories, avgOrderValue, pendingOrders, issueOrders, totalOrders: orders.length };
  }, [orders]);

  // ─── Financial Analysis ───
  const financeAnalysis = useMemo(() => {
    const incomeByCategory: Record<string, number> = {};
    const expenseByCategory: Record<string, number> = {};

    finances.forEach(f => {
      if (f.type === 'income') {
        incomeByCategory[f.category] = (incomeByCategory[f.category] || 0) + f.amount;
      } else {
        expenseByCategory[f.category] = (expenseByCategory[f.category] || 0) + f.amount;
      }
    });

    const topExpense = Object.entries(expenseByCategory).sort((a, b) => b[1] - a[1])[0];
    const topIncome = Object.entries(incomeByCategory).sort((a, b) => b[1] - a[1])[0];
    const profitMargin = totalIncome > 0 ? ((profit / totalIncome) * 100) : 0;

    return { incomeByCategory, expenseByCategory, topExpense, topIncome, profitMargin, totalIncome, totalExpense, profit };
  }, [finances, totalIncome, totalExpense, profit]);

  // ─── AI Chat ───
  const buildContext = () => {
    const oa = orderAnalysis;
    const fa = financeAnalysis;
    return `You are an AI business analyst assistant for Coffee House cafe.

CURRENT BUSINESS DATA:
- Total orders: ${oa.totalOrders}
- Revenue: $${oa.totalRevenue.toFixed(2)}
- Avg order value: $${oa.avgOrderValue.toFixed(2)}
- Shipping revenue: $${oa.totalShipping.toFixed(2)}

ORDER STATUS:
- Pending: ${oa.byStatus.pending} (need review)
- Confirmed: ${oa.byStatus.confirmed}
- Preparing: ${oa.byStatus.preparing}
- Shipping: ${oa.byStatus.shipping}
- Delivered: ${oa.byStatus.delivered}
- Cancelled: ${oa.byStatus.cancelled}

TOP PRODUCTS: ${oa.topProducts.map(p => `${p.name} (${p.qty} sold, $${p.revenue.toFixed(2)})`).join(', ')}
TOP CATEGORIES: ${oa.topCategories.map(([c, r]) => `${c}: $${r.toFixed(2)}`).join(', ')}

FINANCE:
- Total income: $${fa.totalIncome.toFixed(2)}
- Total expense: $${fa.totalExpense.toFixed(2)}
- Profit: $${fa.profit.toFixed(2)} (${fa.profitMargin.toFixed(1)}% margin)
- Top expense: ${fa.topExpense ? `${fa.topExpense[0]}: $${fa.topExpense[1].toFixed(2)}` : 'N/A'}
- Top income: ${fa.topIncome ? `${fa.topIncome[0]}: $${fa.topIncome[1].toFixed(2)}` : 'N/A'}

Products available: ${products.length}

Respond as a professional business analyst. Be concise, use bullet points, provide actionable insights. Use $ for amounts.`;
  };

  const sendMessage = async () => {
    if (!input.trim() || loading) return;
    const userMsg = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMsg, timestamp: Date.now() }]);
    setLoading(true);

    try {
      const resp = await fetch(MIMO_API, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${MIMO_KEY}` },
        body: JSON.stringify({
          model: 'mimo-v2.5-pro',
          messages: [
            { role: 'system', content: buildContext() },
            ...messages.slice(-6).map(m => ({ role: m.role, content: m.content })),
            { role: 'user', content: userMsg }
          ],
          temperature: 0.4,
          max_tokens: 600,
        }),
      });
      const data = await resp.json();
      const content = data.choices?.[0]?.message?.content || 'Unable to analyze. Please try again.';
      setMessages(prev => [...prev, { role: 'assistant', content, timestamp: Date.now() }]);
    } catch {
      setMessages(prev => [...prev, { role: 'assistant', content: 'Connection error. Please try again.', timestamp: Date.now() }]);
    }
    setLoading(false);
  };

  const quickQuestions = [
    'Analyze today\'s orders and flag any issues',
    'Which products should I restock?',
    'Summarize this week\'s financial performance',
    'What are my biggest expenses and how to reduce them?',
    'Which menu items are underperforming?',
    'Give me a daily business health report',
  ];

  return (
    <div className="bg-slate-50 min-h-screen">
      {/* Header */}
      <div className="bg-gradient-to-r from-violet-900 via-purple-900 to-indigo-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={() => navigate('/admin/dashboard')} className="p-2 hover:bg-white/10 rounded-lg transition-colors">
              <ArrowLeft className="w-4 h-4" />
            </button>
            <div className="w-10 h-10 bg-gradient-to-br from-violet-500 to-purple-500 rounded-xl flex items-center justify-center">
              <Brain className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-extrabold">AI Admin Assistant</h1>
              <p className="text-xs text-purple-300">Business intelligence · Order analysis · Financial insights</p>
            </div>
          </div>
          <button onClick={() => navigate('/shop')} className="text-xs text-purple-300 hover:text-white">View Shop →</button>
        </div>
      </div>

      {/* Tab Nav */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex gap-1 overflow-x-auto">
          {[
            { id: 'insights' as const, label: 'Insights', icon: Sparkles },
            { id: 'orders' as const, label: 'Orders', icon: ShoppingCart },
            { id: 'finance' as const, label: 'Finance', icon: BarChart3 },
            { id: 'chat' as const, label: 'AI Chat', icon: Bot },
          ].map(t => (
            <button key={t.id} onClick={() => setActiveTab(t.id)}
              className={`flex items-center gap-1.5 px-4 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                activeTab === t.id ? 'border-violet-600 text-violet-600' : 'border-transparent text-slate-500 hover:text-slate-700'
              }`}>
              <t.icon className="w-4 h-4" /> {t.label}
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        {/* ═══════ INSIGHTS TAB ═══════ */}
        {activeTab === 'insights' && (
          <div className="space-y-6">
            {/* Quick Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <QuickStat icon={DollarSign} label="Revenue" value={`$${orderAnalysis.totalRevenue.toFixed(2)}`} color="emerald" />
              <QuickStat icon={ShoppingCart} label="Orders" value={orderAnalysis.totalOrders.toString()} color="blue" />
              <QuickStat icon={TrendingUp} label="Avg Order" value={`$${orderAnalysis.avgOrderValue.toFixed(2)}`} color="violet" />
              <QuickStat icon={TrendingDown} label="Profit Margin" value={`${financeAnalysis.profitMargin.toFixed(1)}%`} color={financeAnalysis.profitMargin >= 0 ? 'emerald' : 'red'} />
            </div>

            {/* AI Quick Analysis */}
            <div className="card p-6">
              <h3 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-violet-600" /> AI Quick Analysis
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Pending orders alert */}
                {orderAnalysis.byStatus.pending > 0 && (
                  <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl">
                    <div className="flex items-center gap-2 mb-2">
                      <Clock className="w-4 h-4 text-amber-600" />
                      <span className="text-sm font-bold text-amber-900">{orderAnalysis.byStatus.pending} Pending Orders</span>
                    </div>
                    <p className="text-xs text-amber-700">Review and confirm these orders to keep customers happy.</p>
                  </div>
                )}
                {/* Cancelled orders alert */}
                {orderAnalysis.byStatus.cancelled > 0 && (
                  <div className="p-4 bg-red-50 border border-red-200 rounded-xl">
                    <div className="flex items-center gap-2 mb-2">
                      <AlertTriangle className="w-4 h-4 text-red-600" />
                      <span className="text-sm font-bold text-red-900">{orderAnalysis.byStatus.cancelled} Cancelled Orders</span>
                    </div>
                    <p className="text-xs text-red-700">Investigate why these orders were cancelled to prevent future losses.</p>
                  </div>
                )}
                {/* Top performer */}
                {orderAnalysis.topProducts[0] && (
                  <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl">
                    <div className="flex items-center gap-2 mb-2">
                      <CheckCircle className="w-4 h-4 text-emerald-600" />
                      <span className="text-sm font-bold text-emerald-900">Top Seller</span>
                    </div>
                    <p className="text-xs text-emerald-700"><strong>{orderAnalysis.topProducts[0].name}</strong> — {orderAnalysis.topProducts[0].qty} sold, ${orderAnalysis.topProducts[0].revenue.toFixed(2)} revenue</p>
                  </div>
                )}
                {/* Profit status */}
                <div className={`p-4 rounded-xl border ${financeAnalysis.profit >= 0 ? 'bg-blue-50 border-blue-200' : 'bg-red-50 border-red-200'}`}>
                  <div className="flex items-center gap-2 mb-2">
                    {financeAnalysis.profit >= 0 ? <TrendingUp className="w-4 h-4 text-blue-600" /> : <TrendingDown className="w-4 h-4 text-red-600" />}
                    <span className={`text-sm font-bold ${financeAnalysis.profit >= 0 ? 'text-blue-900' : 'text-red-900'}`}>
                      {financeAnalysis.profit >= 0 ? 'Profitable' : 'Operating at Loss'}
                    </span>
                  </div>
                  <p className={`text-xs ${financeAnalysis.profit >= 0 ? 'text-blue-700' : 'text-red-700'}`}>
                    Net profit: ${financeAnalysis.profit.toFixed(2)} ({financeAnalysis.profitMargin.toFixed(1)}% margin)
                  </p>
                </div>
              </div>
            </div>

            {/* Top Products */}
            <div className="card p-6">
              <h3 className="text-sm font-bold text-slate-900 mb-4">Top Products by Revenue</h3>
              <div className="space-y-3">
                {orderAnalysis.topProducts.map((p, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <span className="w-6 h-6 bg-violet-100 text-violet-700 rounded-full flex items-center justify-center text-xs font-bold">{i + 1}</span>
                    <span className="flex-1 text-sm font-medium text-slate-900">{p.name}</span>
                    <span className="text-xs text-slate-500">{p.qty} sold</span>
                    <span className="text-sm font-bold text-slate-900">${p.revenue.toFixed(2)}</span>
                  </div>
                ))}
                {orderAnalysis.topProducts.length === 0 && <p className="text-sm text-slate-400">No sales data yet</p>}
              </div>
            </div>

            {/* Quick Questions */}
            <div className="card p-6">
              <h3 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2">
                <Brain className="w-4 h-4 text-violet-600" /> Ask AI Assistant
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {quickQuestions.map((q, i) => (
                  <button key={i} onClick={() => { setInput(q); setActiveTab('chat'); }}
                    className="text-left p-3 bg-slate-50 hover:bg-violet-50 rounded-lg text-xs text-slate-700 hover:text-violet-700 transition-colors border border-slate-200 hover:border-violet-200">
                    {q}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ═══════ ORDERS TAB ═══════ */}
        {activeTab === 'orders' && (
          <div className="space-y-6">
            <h2 className="text-lg font-bold text-slate-900">Order Intelligence</h2>

            {/* Status breakdown */}
            <div className="grid grid-cols-3 lg:grid-cols-6 gap-3">
              {[
                { key: 'pending', label: 'Pending', icon: Clock, color: 'amber' },
                { key: 'confirmed', label: 'Confirmed', icon: CheckCircle, color: 'emerald' },
                { key: 'preparing', label: 'Preparing', icon: Package, color: 'blue' },
                { key: 'shipping', label: 'Shipping', icon: Truck, color: 'purple' },
                { key: 'delivered', label: 'Delivered', icon: CheckCircle, color: 'emerald' },
                { key: 'cancelled', label: 'Cancelled', icon: AlertTriangle, color: 'red' },
              ].map(s => (
                <div key={s.key} className={`card p-4 text-center border-t-4 border-${s.color}-500`}>
                  <s.icon className={`w-5 h-5 text-${s.color}-500 mx-auto mb-1`} />
                  <p className="text-xl font-extrabold text-slate-900">{orderAnalysis.byStatus[s.key as keyof typeof orderAnalysis.byStatus]}</p>
                  <p className="text-[10px] text-slate-500">{s.label}</p>
                </div>
              ))}
            </div>

            {/* Category revenue */}
            <div className="card p-6">
              <h3 className="text-sm font-bold text-slate-900 mb-4">Revenue by Category</h3>
              <div className="space-y-3">
                {orderAnalysis.topCategories.map(([cat, rev]) => (
                  <div key={cat} className="flex items-center gap-3">
                    <span className="text-xs text-slate-600 w-32 truncate">{cat}</span>
                    <div className="flex-1 bg-slate-100 rounded-full h-3 overflow-hidden">
                      <div className="h-full bg-violet-500 rounded-full" style={{ width: `${(rev / orderAnalysis.totalRevenue * 100)}%` }} />
                    </div>
                    <span className="text-xs font-bold text-slate-900 w-20 text-right">${rev.toFixed(2)}</span>
                  </div>
                ))}
                {orderAnalysis.topCategories.length === 0 && <p className="text-sm text-slate-400">No data</p>}
              </div>
            </div>

            {/* Recent orders */}
            <div className="card p-6">
              <h3 className="text-sm font-bold text-slate-900 mb-4">Recent Orders</h3>
              <div className="space-y-2">
                {orders.slice(0, 10).map(order => (
                  <div key={order.id} className="flex items-center justify-between p-3 hover:bg-slate-50 rounded-lg border border-slate-100">
                    <div className="flex items-center gap-3">
                      <StatusDot status={order.status} />
                      <div>
                        <p className="text-xs font-mono text-slate-500">{order.code || order.id}</p>
                        <p className="text-xs text-slate-400">{new Date(order.timestamp).toLocaleString()}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-slate-900">${order.total.toFixed(2)}</p>
                      <p className="text-[10px] text-slate-400">{order.items.length} items</p>
                    </div>
                  </div>
                ))}
                {orders.length === 0 && <p className="text-sm text-slate-400 text-center py-8">No orders yet</p>}
              </div>
            </div>
          </div>
        )}

        {/* ═══════ FINANCE TAB ═══════ */}
        {activeTab === 'finance' && (
          <div className="space-y-6">
            <h2 className="text-lg font-bold text-slate-900">Financial Report</h2>

            {/* Summary cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="card p-5 border-l-4 border-emerald-500">
                <p className="text-xs text-slate-500 mb-1">Total Income</p>
                <p className="text-2xl font-extrabold text-emerald-600">${financeAnalysis.totalIncome.toFixed(2)}</p>
              </div>
              <div className="card p-5 border-l-4 border-red-500">
                <p className="text-xs text-slate-500 mb-1">Total Expenses</p>
                <p className="text-2xl font-extrabold text-red-600">${financeAnalysis.totalExpense.toFixed(2)}</p>
              </div>
              <div className="card p-5 border-l-4 border-blue-500">
                <p className="text-xs text-slate-500 mb-1">Net Profit</p>
                <p className={`text-2xl font-extrabold ${financeAnalysis.profit >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>${financeAnalysis.profit.toFixed(2)}</p>
              </div>
              <div className="card p-5 border-l-4 border-violet-500">
                <p className="text-xs text-slate-500 mb-1">Profit Margin</p>
                <p className="text-2xl font-extrabold text-violet-600">{financeAnalysis.profitMargin.toFixed(1)}%</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Income breakdown */}
              <div className="card p-6">
                <h3 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-emerald-600" /> Income Breakdown
                </h3>
                <div className="space-y-3">
                  {Object.entries(financeAnalysis.incomeByCategory).sort((a, b) => b[1] - a[1]).map(([cat, amt]) => (
                    <div key={cat} className="flex items-center justify-between">
                      <span className="text-sm text-slate-700">{cat}</span>
                      <span className="text-sm font-bold text-emerald-600">+${amt.toFixed(2)}</span>
                    </div>
                  ))}
                  {Object.keys(financeAnalysis.incomeByCategory).length === 0 && <p className="text-sm text-slate-400">No income data</p>}
                </div>
              </div>

              {/* Expense breakdown */}
              <div className="card p-6">
                <h3 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2">
                  <TrendingDown className="w-4 h-4 text-red-600" /> Expense Breakdown
                </h3>
                <div className="space-y-3">
                  {Object.entries(financeAnalysis.expenseByCategory).sort((a, b) => b[1] - a[1]).map(([cat, amt]) => (
                    <div key={cat} className="flex items-center justify-between">
                      <span className="text-sm text-slate-700">{cat}</span>
                      <span className="text-sm font-bold text-red-600">-${amt.toFixed(2)}</span>
                    </div>
                  ))}
                  {Object.keys(financeAnalysis.expenseByCategory).length === 0 && <p className="text-sm text-slate-400">No expense data</p>}
                </div>
              </div>
            </div>

            {/* AI Financial Analysis Button */}
            <button onClick={() => { setInput('Give me a detailed financial health report with recommendations to improve profitability'); setActiveTab('chat'); }}
              className="w-full p-4 bg-gradient-to-r from-violet-600 to-purple-600 text-white rounded-xl hover:from-violet-500 hover:to-purple-500 transition-all flex items-center justify-center gap-2">
              <Sparkles className="w-5 h-5" />
              <span className="font-semibold">Get AI Financial Analysis</span>
            </button>
          </div>
        )}

        {/* ═══════ CHAT TAB ═══════ */}
        {activeTab === 'chat' && (
          <div className="max-w-3xl mx-auto">
            <div className="card overflow-hidden" style={{ height: 'calc(100vh - 260px)' }}>
              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4" style={{ height: 'calc(100% - 70px)' }}>
                {messages.length === 0 && (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 bg-violet-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <Brain className="w-8 h-8 text-violet-600" />
                    </div>
                    <h3 className="text-lg font-bold text-slate-900 mb-2">AI Business Analyst</h3>
                    <p className="text-sm text-slate-500 mb-6">Ask me anything about your business data. I have access to all orders, products, and financial records.</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-w-md mx-auto">
                      {quickQuestions.slice(0, 4).map((q, i) => (
                        <button key={i} onClick={() => setInput(q)}
                          className="text-left p-3 bg-slate-50 hover:bg-violet-50 rounded-lg text-xs text-slate-600 hover:text-violet-600 transition-colors">
                          {q}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
                {messages.map((msg, i) => (
                  <div key={i} className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    {msg.role === 'assistant' && (
                      <div className="w-8 h-8 bg-violet-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Brain className="w-4 h-4 text-violet-600" />
                      </div>
                    )}
                    <div className={`max-w-[80%] px-4 py-3 rounded-2xl text-sm leading-relaxed ${
                      msg.role === 'user'
                        ? 'bg-violet-600 text-white rounded-br-md'
                        : 'bg-slate-100 text-slate-800 rounded-bl-md'
                    }`}>
                      <div className="whitespace-pre-wrap">{msg.content}</div>
                    </div>
                  </div>
                ))}
                {loading && (
                  <div className="flex gap-3">
                    <div className="w-8 h-8 bg-violet-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Brain className="w-4 h-4 text-violet-600" />
                    </div>
                    <div className="bg-slate-100 rounded-2xl rounded-bl-md px-4 py-3">
                      <Loader2 className="w-4 h-4 text-slate-400 animate-spin" />
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Input */}
              <div className="border-t border-slate-200 p-3">
                <div className="flex gap-2">
                  <input
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    onKeyDown={e => { if (e.key === 'Enter') sendMessage(); }}
                    placeholder="Ask about orders, revenue, products, expenses..."
                    className="flex-1 text-sm"
                    disabled={loading}
                  />
                  <button onClick={sendMessage} disabled={!input.trim() || loading}
                    className="w-10 h-10 bg-violet-600 hover:bg-violet-700 disabled:bg-slate-200 rounded-xl flex items-center justify-center transition-colors">
                    <Send className="w-4 h-4 text-white" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Helper Components ───
function QuickStat({ icon: Icon, label, value, color }: { icon: any; label: string; value: string; color: string }) {
  return (
    <div className="card p-4">
      <div className={`w-8 h-8 rounded-lg bg-${color}-50 flex items-center justify-center mb-2`}>
        <Icon className={`w-4 h-4 text-${color}-600`} />
      </div>
      <p className="text-xl font-extrabold text-slate-900">{value}</p>
      <p className="text-xs text-slate-500">{label}</p>
    </div>
  );
}

function StatusDot({ status }: { status: string }) {
  const colors: Record<string, string> = {
    pending: 'bg-amber-500', confirmed: 'bg-emerald-500', preparing: 'bg-blue-500',
    shipping: 'bg-purple-500', delivered: 'bg-emerald-600', cancelled: 'bg-red-500',
  };
  return <div className={`w-2.5 h-2.5 rounded-full ${colors[status] || 'bg-slate-300'}`} />;
}
