import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdmin, EXPENSE_CATEGORIES, INCOME_CATEGORIES } from '../../hooks/useAdmin';
import { useShop } from '../../hooks/useShop';
import { formatCurrency } from '../../utils/format';
import {
  LayoutDashboard, ShoppingCart, Receipt, Calculator, LogOut, Plus, Trash2,
  TrendingUp, TrendingDown, DollarSign, Package, ChefHat, Truck, Clock, Check, X, ExternalLink, MapPin,
  Download, Upload, HardDrive, Brain
} from 'lucide-react';

import { AdminAgentPanel } from './AgentDashboard';

type Tab = 'dashboard' | 'orders' | 'finance' | 'tax' | 'products' | 'ai-agent' | 'backup';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const { isAdmin, logout, totalExpense, profit } = useAdmin();
  const { orders, products, addProduct, updateProduct, deleteProduct } = useShop();
  const [tab, setTab] = useState<Tab>('dashboard');

  if (!isAdmin) {
    navigate('/admin');
    return null;
  }

  // Stats
  const totalOrders = orders.length;
  const confirmedOrders = orders.filter(o => o.status === 'confirmed' || o.status === 'preparing' || o.status === 'shipping' || o.status === 'delivered');
  const totalRevenue = confirmedOrders.reduce((s, o) => s + o.total, 0);
  const totalShippingRevenue = confirmedOrders.reduce((s, o) => s + o.shippingFee, 0);
  const avgOrderValue = confirmedOrders.length > 0 ? totalRevenue / confirmedOrders.length : 0;

  // Tax calculations
  const VAT_RATE = 0.10; // 10% VAT
  const CORPORATE_TAX_RATE = 0.20; // 20% Corporate Income Tax
  const vatAmount = totalRevenue * VAT_RATE;
  const taxableIncome = profit > 0 ? profit : 0;
  const corporateTax = taxableIncome * CORPORATE_TAX_RATE;
  const netProfit = taxableIncome - corporateTax;

  const handleLogout = () => {
    logout();
    navigate('/admin');
  };

  const tabs = [
    { id: 'dashboard' as Tab, label: 'Dashboard', icon: LayoutDashboard },
    { id: 'orders' as Tab, label: 'Orders', icon: ShoppingCart },
    { id: 'finance' as Tab, label: 'Finance', icon: Receipt },
    { id: 'tax' as Tab, label: 'Tax', icon: Calculator },
    { id: 'products' as Tab, label: 'Products', icon: Package },
    { id: 'ai-agent' as Tab, label: 'AI Agent', icon: Brain },
    { id: 'backup' as Tab, label: 'Backup', icon: HardDrive },
  ];

  return (
    <div className="bg-slate-50 min-h-screen">
      {/* Admin Header */}
      <div className="bg-slate-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
              <LayoutDashboard className="w-4 h-4 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold">Admin Panel</h1>
              <p className="text-xs text-slate-400">Coffee House Management</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <PublishButton products={products} />
            <button onClick={() => navigate('/shop')} className="text-xs text-slate-400 hover:text-white">View Shop →</button>
            <button onClick={handleLogout} className="flex items-center gap-1.5 text-xs bg-slate-700 hover:bg-slate-600 px-3 py-1.5 rounded-lg transition-colors">
              <LogOut className="w-3.5 h-3.5" /> Logout
            </button>
          </div>
        </div>
      </div>

      {/* Tab Nav */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex gap-1 overflow-x-auto">
          {tabs.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)}
              className={`flex items-center gap-1.5 px-4 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                tab === t.id ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-700'
              }`}>
              <t.icon className="w-4 h-4" /> {t.label}
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        {/* ═══════ DASHBOARD ═══════ */}
        {tab === 'dashboard' && (
          <div className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <StatCard label="Total Revenue" value={formatCurrency(totalRevenue)} icon={DollarSign} color="blue" />
              <StatCard label="Total Expenses" value={formatCurrency(totalExpense)} icon={TrendingDown} color="red" />
              <StatCard label="Profit" value={formatCurrency(profit)} icon={TrendingUp} color={profit >= 0 ? 'green' : 'red'} />
              <StatCard label="Total Orders" value={totalOrders.toString()} icon={ShoppingCart} color="purple" />
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
              <StatCard label="Confirmed" value={confirmedOrders.length.toString()} icon={Check} color="green" />
              <StatCard label="Avg Order Value" value={`$${avgOrderValue.toFixed(2)}`} icon={Receipt} color="orange" />
              <StatCard label="Shipping Revenue" value={formatCurrency(totalShippingRevenue)} icon={Truck} color="cyan" />
            </div>

            {/* Revenue by category */}
            <div className="card p-6">
              <h3 className="text-sm font-bold text-slate-900 mb-4">Revenue by Category</h3>
              <div className="space-y-3">
                {getCategoryRevenue(orders).map(([cat, rev]) => (
                  <div key={cat} className="flex items-center gap-3">
                    <span className="text-xs text-slate-600 w-28 truncate">{cat}</span>
                    <div className="flex-1 bg-slate-100 rounded-full h-3 overflow-hidden">
                      <div className="h-full bg-blue-500 rounded-full" style={{ width: `${(rev / totalRevenue * 100)}%` }} />
                    </div>
                    <span className="text-xs font-bold text-slate-900 w-20 text-right">${rev.toFixed(2)}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent orders */}
            <div className="card p-6">
              <h3 className="text-sm font-bold text-slate-900 mb-4">Recent Orders</h3>
              <div className="space-y-2">
                {orders.slice(0, 5).map(order => (
                  <div key={order.id} className="flex items-center justify-between p-2 hover:bg-slate-50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <StatusIcon status={order.status} />
                      <span className="font-mono text-xs text-slate-500">{order.id}</span>
                    </div>
                    <span className="text-sm font-bold">${order.total.toFixed(2)}</span>
                  </div>
                ))}
                {orders.length === 0 && <p className="text-sm text-slate-400">No orders yet</p>}
              </div>
            </div>
          </div>
        )}

        {/* ═══════ ORDERS ═══════ */}
        {tab === 'orders' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-slate-900">All Orders ({orders.length})</h2>
            </div>
            {orders.length === 0 ? (
              <div className="card p-8 text-center">
                <Package className="w-10 h-10 text-slate-300 mx-auto mb-3" />
                <p className="text-sm text-slate-500">No orders yet</p>
              </div>
            ) : (
              <div className="space-y-3">
                {orders.map(order => (
                  <div key={order.id} className="card p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <StatusIcon status={order.status} />
                        <span className="font-mono text-xs text-slate-500">{order.id}</span>
                        <span className="text-xs text-slate-400">{new Date(order.timestamp).toLocaleString()}</span>
                      </div>
                      <StatusBadge status={order.status} />
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-3">
                      {order.items.map(item => (
                        <div key={item.product.id} className="flex items-center gap-2 p-1.5 bg-slate-50 rounded-lg">
                          <img src={item.product.image} alt="" className="w-8 h-8 rounded object-cover" />
                          <div className="min-w-0">
                            <p className="text-[11px] font-semibold truncate">{item.product.name}</p>
                            <p className="text-[10px] text-slate-400">×{item.quantity} · ${(item.product.price * item.quantity).toFixed(2)}</p>
                          </div>
                        </div>
                      ))}
                    </div>

                    {order.delivery && (
                      <div className="flex items-start gap-2 mb-2 p-2 bg-blue-50 rounded-lg">
                        <MapPin className="w-3.5 h-3.5 text-blue-500 mt-0.5" />
                        <div>
                          <p className="text-xs text-blue-900">{order.delivery.address}</p>
                          {order.delivery.note && <p className="text-[10px] text-blue-600">📝 {order.delivery.note}</p>}
                        </div>
                      </div>
                    )}

                    <div className="flex items-center justify-between border-t border-slate-100 pt-2">
                      <div className="flex items-center gap-4 text-xs text-slate-500">
                        <span>Items: ${order.total - order.shippingFee}</span>
                        <span>Ship: ${order.shippingFee.toFixed(2)}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-extrabold">${order.total.toFixed(2)} USDC</span>
                        {order.txHash && (
                          <a href={`https://testnet.arcscan.app/tx/${order.txHash}`} target="_blank" rel="noreferrer"
                            className="text-blue-500 hover:text-blue-700">
                            <ExternalLink className="w-3.5 h-3.5" />
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ═══════ FINANCE (THU CHI) ═══════ */}
        {tab === 'finance' && <FinanceTab />}

        {/* ═══════ TAX ═══════ */}
        {tab === 'tax' && (
          <div className="space-y-6">
            <h2 className="text-lg font-bold text-slate-900">Current Tax Rates</h2>

            {/* Tax Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="card p-5 border-l-4 border-blue-500">
                <p className="text-xs text-slate-500 mb-1">VAT (10%)</p>
                <p className="text-2xl font-extrabold text-slate-900">${vatAmount.toFixed(2)}</p>
                <p className="text-xs text-slate-400 mt-1">Value-added tax on revenue</p>
              </div>
              <div className="card p-5 border-l-4 border-amber-500">
                <p className="text-xs text-slate-500 mb-1">Corporate Tax (20%)</p>
                <p className="text-2xl font-extrabold text-slate-900">${corporateTax.toFixed(2)}</p>
                <p className="text-xs text-slate-400 mt-1">Corporate income tax</p>
              </div>
              <div className="card p-5 border-l-4 border-green-500">
                <p className="text-xs text-slate-500 mb-1">Net Profit</p>
                <p className="text-2xl font-extrabold text-green-600">${netProfit.toFixed(2)}</p>
                <p className="text-xs text-slate-400 mt-1">After tax deduction</p>
              </div>
            </div>

            {/* Tax Breakdown */}
            <div className="card p-6">
              <h3 className="text-sm font-bold text-slate-900 mb-4">Tax Calculation Breakdown</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-600">Total Revenue</span>
                  <span className="font-bold">${totalRevenue.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Total Expenses</span>
                  <span className="font-bold text-red-600">-${totalExpense.toFixed(2)}</span>
                </div>
                <div className="border-t border-slate-200 pt-2 flex justify-between">
                  <span className="text-slate-900 font-medium">Profit Before Tax</span>
                  <span className="font-bold">${profit.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-blue-600">
                  <span>VAT (10% × ${totalRevenue.toFixed(2)})</span>
                  <span className="font-bold">-${vatAmount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-amber-600">
                  <span>Corporate Tax (20% × ${taxableIncome.toFixed(2)})</span>
                  <span className="font-bold">-${corporateTax.toFixed(2)}</span>
                </div>
                <div className="border-t-2 border-slate-900 pt-2 flex justify-between text-lg">
                  <span className="font-extrabold">Net Profit</span>
                  <span className="font-extrabold text-green-600">${netProfit.toFixed(2)}</span>
                </div>
              </div>
            </div>

            {/* Vietnamese Tax Info */}
            <div className="card p-6">
              <h3 className="text-sm font-bold text-slate-900 mb-4">Vietnam Tax Reference Table</h3>
              <div className="space-y-2 text-sm">
                <TaxRow name="VAT (Thuế GTGT)" rate="10%" desc="Standard rate for goods/services" />
                <TaxRow name="Corporate Income Tax" rate="20%" desc="Corporate income tax" />
                <TaxRow name="Personal Income Tax" rate="5%-35%" desc="Progressive, 5% for income ≤ 5M VND/month" />
                <TaxRow name="License Fee" rate="1-3M VND/year" desc="Based on registered capital" />
                <TaxRow name="Social Insurance (Employer)" rate="17.5%" desc="Social insurance (employer)" />
                <TaxRow name="Social Insurance (Employee)" rate="10.5%" desc="Social insurance (employee)" />
                <TaxRow name="BHYT" rate="4.5%" desc="Health insurance (3%+1.5%)" />
                <TaxRow name="BHTN" rate="1%" desc="Unemployment insurance" />
              </div>
            </div>
          </div>
        )}

        {/* ═══════ PRODUCTS ═══════ */}
        {tab === 'products' && (
          <ProductsTab products={products} onAdd={addProduct} onUpdate={updateProduct} onDelete={deleteProduct} />
        )}

        {/* ═══════ BACKUP ═══════ */}
        {tab === 'ai-agent' && <AdminAgentPanel />}
        {tab === 'backup' && <BackupTab products={products} orders={orders} />}
      </div>
    </div>
  );
}

// ═══════ FINANCE TAB ═══════
function FinanceTab() {
  const { finances, addFinance, removeFinance, totalIncome, totalExpense, profit } = useAdmin();
  const [showForm, setShowForm] = useState(false);
  const [type, setType] = useState<'income' | 'expense'>('expense');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [note, setNote] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'income' | 'expense'>('all');

  const categories = type === 'income' ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;
  const filtered = filterType === 'all' ? finances : finances.filter(f => f.type === filterType);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!category || !description || !amount) return;
    addFinance({ type, category, description, amount: parseFloat(amount), date, note });
    setShowForm(false);
    setCategory(''); setDescription(''); setAmount(''); setNote('');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-slate-900">Income & Expense Management</h2>
        <button onClick={() => setShowForm(!showForm)} className="btn-primary !text-sm">
          <Plus className="w-4 h-4" /> Add Entry
        </button>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-3 gap-4">
        <div className="card p-4 border-l-4 border-green-500">
          <p className="text-xs text-slate-500">Total Income</p>
          <p className="text-xl font-extrabold text-green-600">${totalIncome.toFixed(2)}</p>
        </div>
        <div className="card p-4 border-l-4 border-red-500">
          <p className="text-xs text-slate-500">Total Expense</p>
          <p className="text-xl font-extrabold text-red-600">${totalExpense.toFixed(2)}</p>
        </div>
        <div className="card p-4 border-l-4 border-blue-500">
          <p className="text-xs text-slate-500">Net</p>
          <p className={`text-xl font-extrabold ${profit >= 0 ? 'text-green-600' : 'text-red-600'}`}>${profit.toFixed(2)}</p>
        </div>
      </div>

      {/* Add form */}
      {showForm && (
        <form onSubmit={handleSubmit} className="card p-5 space-y-3 border-2 border-blue-200">
          <h3 className="text-sm font-bold text-slate-900">Add Income / Expense Entry</h3>
          <div className="flex gap-2">
            <button type="button" onClick={() => setType('income')}
              className={`flex-1 py-2 rounded-lg text-sm font-semibold ${type === 'income' ? 'bg-green-100 text-green-700 border-2 border-green-300' : 'bg-slate-100 text-slate-500'}`}>
              Income (+)
            </button>
            <button type="button" onClick={() => setType('expense')}
              className={`flex-1 py-2 rounded-lg text-sm font-semibold ${type === 'expense' ? 'bg-red-100 text-red-700 border-2 border-red-300' : 'bg-slate-100 text-slate-500'}`}>
              Expense (-)
            </button>
          </div>
          <select value={category} onChange={e => setCategory(e.target.value)} className="w-full">
            <option value="">-- Select Category --</option>
            {categories.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
          <input value={description} onChange={e => setDescription(e.target.value)} placeholder="Description" />
          <div className="flex gap-2">
            <input type="number" step="0.01" value={amount} onChange={e => setAmount(e.target.value)} placeholder="Amount ($)" className="flex-1" />
            <input type="date" value={date} onChange={e => setDate(e.target.value)} className="flex-1" />
          </div>
          <input value={note} onChange={e => setNote(e.target.value)} placeholder="Note (optional)" />
          <div className="flex gap-2">
            <button type="button" onClick={() => setShowForm(false)} className="btn-secondary flex-1">Cancel</button>
            <button type="submit" disabled={!category || !description || !amount} className="btn-primary flex-1">Save</button>
          </div>
        </form>
      )}

      {/* Filter */}
      <div className="flex gap-2">
        {(['all', 'income', 'expense'] as const).map(t => (
          <button key={t} onClick={() => setFilterType(t)}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold ${filterType === t ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600'}`}>
            {t === 'all' ? 'All' : t === 'income' ? 'Income' : 'Expense'}
          </button>
        ))}
      </div>

      {/* List */}
      <div className="card overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-slate-50 text-xs text-slate-500 uppercase">
              <th className="text-left p-3">Date</th>
              <th className="text-left p-3">Type</th>
              <th className="text-left p-3">Category</th>
              <th className="text-left p-3">Description</th>
              <th className="text-right p-3">Amount</th>
              <th className="p-3 w-10"></th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(f => (
              <tr key={f.id} className="border-t border-slate-100 hover:bg-slate-50">
                <td className="p-3 text-slate-500 text-xs">{f.date}</td>
                <td className="p-3">
                  <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${f.type === 'income' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    {f.type === 'income' ? 'Income' : 'Expense'}
                  </span>
                </td>
                <td className="p-3 text-slate-700">{f.category}</td>
                <td className="p-3 text-slate-900 font-medium">{f.description}</td>
                <td className={`p-3 text-right font-bold ${f.type === 'income' ? 'text-green-600' : 'text-red-600'}`}>
                  {f.type === 'income' ? '+' : '-'}${f.amount.toFixed(2)}
                </td>
                <td className="p-3">
                  <button onClick={() => removeFinance(f.id)} className="text-slate-300 hover:text-red-500">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <p className="text-center text-sm text-slate-400 py-8">No data</p>
        )}
      </div>
    </div>
  );
}

// ═══════ PRODUCTS TAB ═══════
function ProductsTab({ products, onAdd, onUpdate, onDelete }: {
  products: any[];
  onAdd: (p: Omit<any, 'id'>) => void;
  onUpdate: (id: string, updates: any) => void;
  onDelete: (id: string) => void;
}) {
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editField, setEditField] = useState<'price' | 'image' | 'name' | null>(null);
  const [editValue, setEditValue] = useState('');
  const [form, setForm] = useState({ name: '', price: '', category: '', image: '', description: '', brand: '' });
  const [filterCat, setFilterCat] = useState('All');
  const [uploading, setUploading] = useState(false);

  const allCategories = [...new Set(products.map(p => p.category))].sort();
  const filtered = filterCat === 'All' ? products : products.filter(p => p.category === filterCat);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.price || !form.category) return;
    onAdd({
      name: form.name,
      price: parseFloat(form.price),
      category: form.category,
      image: form.image || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=400&fit=crop',
      description: form.description || '',
      brand: form.brand || 'Custom',
    });
    setForm({ name: '', price: '', category: '', image: '', description: '', brand: '' });
    setShowForm(false);
  };

  const startEdit = (id: string, field: 'price' | 'image' | 'name', current: string) => {
    setEditingId(id);
    setEditField(field);
    setEditValue(current);
  };

  const saveEdit = () => {
    if (!editingId || !editField) return;
    if (editField === 'price') {
      const num = parseFloat(editValue);
      if (isNaN(num) || num < 0) return;
      onUpdate(editingId, { price: num });
    } else if (editField === 'name') {
      if (!editValue.trim()) return;
      onUpdate(editingId, { name: editValue.trim() });
    } else {
      onUpdate(editingId, { image: editValue });
    }
    setEditingId(null);
    setEditField(null);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditField(null);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, productId?: string) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 10 * 1024 * 1024) { alert('Image must be under 10MB'); return; }
    setUploading(true);

    const img = new Image();
    const reader = new FileReader();
    reader.onload = () => {
      img.onload = () => {
        // Resize to max 600px to keep localStorage small
        const MAX = 600;
        let w = img.width, h = img.height;
        if (w > MAX || h > MAX) {
          if (w > h) { h = Math.round(h * MAX / w); w = MAX; }
          else { w = Math.round(w * MAX / h); h = MAX; }
        }
        const canvas = document.createElement('canvas');
        canvas.width = w; canvas.height = h;
        canvas.getContext('2d')!.drawImage(img, 0, 0, w, h);
        const compressed = canvas.toDataURL('image/jpeg', 0.75);
        if (productId) { onUpdate(productId, { image: compressed }); }
        else { setForm(f => ({ ...f, image: compressed })); }
        setUploading(false);
      };
      img.onerror = () => { alert('Invalid image file'); setUploading(false); };
      img.src = reader.result as string;
    };
    reader.onerror = () => { alert('Failed to read file'); setUploading(false); };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <h2 className="text-lg font-bold text-slate-900">Product Management ({products.length})</h2>
        <button onClick={() => setShowForm(!showForm)} className="btn-primary !text-sm">
          <Plus className="w-4 h-4" /> Add Product
        </button>
      </div>

      {/* Category filter */}
      <div className="flex gap-1.5 flex-wrap">
        <button onClick={() => setFilterCat('All')}
          className={`px-2.5 py-1 rounded-full text-xs font-semibold ${filterCat === 'All' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600'}`}>
          All
        </button>
        {allCategories.map(cat => (
          <button key={cat} onClick={() => setFilterCat(cat)}
            className={`px-2.5 py-1 rounded-full text-xs font-semibold ${filterCat === cat ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600'}`}>
            {cat}
          </button>
        ))}
      </div>

      {/* Add form */}
      {showForm && (
        <form onSubmit={handleSubmit} className="card p-5 space-y-3 border-2 border-blue-200">
          <h3 className="text-sm font-bold text-slate-900">Add New Product</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
              placeholder="Product Name *" required />
            <input type="number" step="0.01" value={form.price} onChange={e => setForm(f => ({ ...f, price: e.target.value }))}
              placeholder="Price ($) *" required />
            <input value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))}
              placeholder="Category *" required />
            <input value={form.brand} onChange={e => setForm(f => ({ ...f, brand: e.target.value }))}
              placeholder="Brand" />
            <div className="sm:col-span-2 space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Product Image</label>
              <div className="flex items-start gap-4">
                <label className="flex flex-col items-center justify-center w-28 h-28 border-2 border-dashed border-slate-300 hover:border-blue-400 rounded-xl cursor-pointer bg-slate-50 hover:bg-blue-50 transition-colors">
                  {form.image ? (
                    <img src={form.image} alt="Preview" className="w-full h-full object-cover rounded-xl" />
                  ) : (
                    <>
                      <svg className="w-8 h-8 text-slate-400 mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                      <span className="text-[10px] text-slate-400">{uploading ? 'Uploading...' : 'Click to Upload'}</span>
                    </>
                  )}
                  <input type="file" accept="image/*" className="hidden" onChange={e => handleFileUpload(e)} disabled={uploading} />
                </label>
                <div className="flex-1 space-y-2">
                  <input value={form.image.startsWith('data:') ? '' : form.image} onChange={e => setForm(f => ({ ...f, image: e.target.value }))}
                    placeholder="Or paste image URL here (optional)" className="!text-xs" />
                  <p className="text-[10px] text-slate-400">Upload from computer (JPG, PNG, WebP). Auto-resized to 600px. Max 10MB.</p>
                  {form.image && (
                    <button type="button" onClick={() => setForm(f => ({ ...f, image: '' }))}
                      className="text-[10px] text-red-500 hover:text-red-700">Remove image</button>
                  )}
                </div>
              </div>
            </div>
            <input value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
              placeholder="Description" className="sm:col-span-2" />
          </div>
          <div className="flex gap-2">
            <button type="button" onClick={() => setShowForm(false)} className="btn-secondary flex-1">Cancel</button>
            <button type="submit" disabled={!form.name || !form.price || !form.category} className="btn-primary flex-1">Add Product</button>
          </div>
        </form>
      )}

      {/* Products table */}
      <div className="card overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-slate-50 text-xs text-slate-500 uppercase">
              <th className="text-left p-3 w-14">Image</th>
              <th className="text-left p-3">Name</th>
              <th className="text-left p-3">Category</th>
              <th className="text-left p-3">Brand</th>
              <th className="text-right p-3">Price</th>
              <th className="p-3 w-24">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(p => (
              <tr key={p.id} className="border-t border-slate-100 hover:bg-slate-50">
                {/* Image */}
                <td className="p-2">
                  {editingId === p.id && editField === 'image' ? (
                    <div className="flex gap-1">
                      <input value={editValue} onChange={e => setEditValue(e.target.value)}
                        className="!text-[10px] !p-1 w-28" onKeyDown={e => e.key === 'Enter' && saveEdit()} />
                      <button onClick={saveEdit} className="text-green-600"><Check className="w-3 h-3" /></button>
                      <button onClick={cancelEdit} className="text-slate-400"><X className="w-3 h-3" /></button>
                      <label className="text-blue-500 cursor-pointer" title="Upload from computer">
                        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                        <input type="file" accept="image/*" className="hidden" onChange={e => { handleFileUpload(e, p.id); cancelEdit(); }} />
                      </label>
                    </div>
                  ) : (
                    <img src={p.image} alt={p.name} className="w-10 h-10 rounded object-cover cursor-pointer hover:ring-2 hover:ring-blue-300"
                      onClick={() => startEdit(p.id, 'image', p.image)} title="Click to edit image" />
                  )}
                </td>
                {/* Name + Description */}
                <td className="p-3">
                  {editingId === p.id && editField === 'name' ? (
                    <div className="flex items-center gap-1">
                      <input value={editValue} onChange={e => setEditValue(e.target.value)}
                        className="!text-sm !p-1 flex-1" onKeyDown={e => e.key === 'Enter' && saveEdit()} autoFocus />
                      <button onClick={saveEdit} className="text-green-600"><Check className="w-3.5 h-3.5" /></button>
                      <button onClick={cancelEdit} className="text-slate-400"><X className="w-3.5 h-3.5" /></button>
                    </div>
                  ) : (
                    <p className="font-semibold text-slate-900 cursor-pointer hover:text-blue-600"
                      onClick={() => startEdit(p.id, 'name', p.name)} title="Click to edit name">
                      {p.name}
                    </p>
                  )}
                  <p className="text-[10px] text-slate-400 truncate max-w-[200px]">{p.description}</p>
                </td>
                {/* Category */}
                <td className="p-3">
                  <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">{p.category}</span>
                </td>
                {/* Brand */}
                <td className="p-3 text-xs text-slate-500">{p.brand}</td>
                {/* Price */}
                <td className="p-3 text-right">
                  {editingId === p.id && editField === 'price' ? (
                    <div className="flex items-center justify-end gap-1">
                      <span className="text-xs text-slate-400">$</span>
                      <input type="number" step="0.01" value={editValue} onChange={e => setEditValue(e.target.value)}
                        className="!text-sm !p-1 w-20 text-right" onKeyDown={e => e.key === 'Enter' && saveEdit()} />
                      <button onClick={saveEdit} className="text-green-600"><Check className="w-3.5 h-3.5" /></button>
                      <button onClick={cancelEdit} className="text-slate-400"><X className="w-3.5 h-3.5" /></button>
                    </div>
                  ) : (
                    <span className="font-bold text-slate-900 cursor-pointer hover:text-blue-600"
                      onClick={() => startEdit(p.id, 'price', p.price.toString())}
                      title="Click to edit price">
                      ${p.price.toFixed(2)}
                    </span>
                  )}
                </td>
                {/* Actions */}
                <td className="p-3 text-center">
                  <button onClick={() => { if (window.confirm(`Delete "${p.name}"?`)) onDelete(p.id); }}
                    className="text-slate-300 hover:text-red-500 transition-colors" title="Delete product">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <p className="text-center text-sm text-slate-400 py-8">No products found</p>
        )}
      </div>
    </div>
  );
}

// ═══════ PUBLISH BUTTON ═══════
function PublishButton({ products }: { products: any[] }) {
  const [publishing, setPublishing] = useState(false);
  const [result, setResult] = useState<string | null>(null);

  const handlePublish = async () => {
    if (!confirm(`Publish ${products.length} products to the live shop?\n\nThis will update arcbank.vercel.app/shop for all visitors.`)) return;
    setPublishing(true);
    setResult(null);
    try {
      // Filter out base64 images (too large for GitHub)
      const cleanProducts = products.map(p => ({
        ...p,
        image: p.image?.startsWith('data:') ? '(uploaded-image-needs-url)' : p.image,
      }));
      const resp = await fetch('/api/publish', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ products: cleanProducts }),
      });
      const data = await resp.json();
      if (data.success) {
        setResult(`✅ Published! Deploying in ~30s. Commit: ${data.commit}`);
      } else {
        setResult(`❌ ${data.error}`);
      }
    } catch (err) {
      setResult(`❌ Connection error`);
    }
    setPublishing(false);
    setTimeout(() => setResult(null), 8000);
  };

  return (
    <div className="relative">
      <button onClick={handlePublish} disabled={publishing}
        className="flex items-center gap-1.5 text-xs bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-600 px-3 py-1.5 rounded-lg transition-colors text-white font-semibold">
        {publishing ? (
          <span className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
        ) : (
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>
        )}
        {publishing ? 'Publishing...' : 'Publish to Site'}
      </button>
      {result && (
        <div className="absolute top-full right-0 mt-2 p-2 bg-slate-800 text-white text-[11px] rounded-lg shadow-xl whitespace-nowrap z-50">
          {result}
        </div>
      )}
    </div>
  );
}

// ═══════ BACKUP TAB ═══════
function BackupTab({ products, orders }: { products: any[]; orders: any[] }) {
  const [importing, setImporting] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [publishStatus, setPublishStatus] = useState<string | null>(null);
  const [lastBackup, setLastBackup] = useState<string | null>(() => localStorage.getItem('arcbank_last_backup'));

  const exportBackup = () => {
    const backup = {
      version: '1.0',
      exportedAt: new Date().toISOString(),
      shopName: 'Coffee House',
      products: JSON.parse(localStorage.getItem('arcbank_products') || '[]'),
      orders: JSON.parse(localStorage.getItem('arcbank_orders') || '[]'),
      finances: JSON.parse(localStorage.getItem('arcbank_finances') || '[]'),
    };
    const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `coffee-house-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    const now = new Date().toLocaleString();
    localStorage.setItem('arcbank_last_backup', now);
    setLastBackup(now);
  };

  const exportCSV = () => {
    const prods = JSON.parse(localStorage.getItem('arcbank_products') || '[]');
    const header = 'id,name,price,category,brand,description,image\n';
    const rows = prods.map((p: any) =>
      `"${p.id}","${p.name}",${p.price},"${p.category}","${p.brand}","${(p.description || '').replace(/"/g, '""')}","${p.image?.startsWith('data:') ? '(base64-image)' : p.image}"`
    ).join('\n');
    const blob = new Blob([header + rows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `coffee-house-products-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const importBackup = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImporting(true);
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const data = JSON.parse(reader.result as string);
        if (!data.products || !Array.isArray(data.products)) {
          alert('Invalid backup file: missing products data');
          setImporting(false);
          return;
        }
        const confirmMsg = `Restore backup from ${data.exportedAt || 'unknown date'}?\n\n` +
          `• ${data.products.length} products\n` +
          `• ${data.orders?.length || 0} orders\n` +
          `• ${data.finances?.length || 0} finance entries\n\n` +
          `This will REPLACE all current data. Continue?`;
        if (!window.confirm(confirmMsg)) { setImporting(false); return; }

        localStorage.setItem('arcbank_products', JSON.stringify(data.products));
        if (data.orders) localStorage.setItem('arcbank_orders', JSON.stringify(data.orders));
        if (data.finances) localStorage.setItem('arcbank_finances', JSON.stringify(data.finances));
        alert('Backup restored successfully! The page will reload.');
        window.location.reload();
      } catch (err) {
        alert('Failed to parse backup file: ' + (err as Error).message);
      }
      setImporting(false);
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const publishToSite = async () => {
    const prods = JSON.parse(localStorage.getItem('arcbank_products') || '[]');
    if (!prods.length) { alert('No products to publish'); return; }
    if (!window.confirm(`Publish ${prods.length} products to live site?\n\nThis will update https://arcbank.vercel.app/shop for all visitors.`)) return;

    setPublishing(true);
    setPublishStatus(null);
    try {
      const resp = await fetch('/api/publish', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ products: prods }),
      });
      const data = await resp.json();
      if (data.success) {
        setPublishStatus('Published! Changes will be live in ~30 seconds.');
        localStorage.setItem('arcbank_last_publish', new Date().toLocaleString());
      } else {
        setPublishStatus('Error: ' + (data.error || 'Unknown error'));
      }
    } catch (err) {
      setPublishStatus('Error: ' + (err as Error).message);
    }
    setPublishing(false);
  };

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-bold text-slate-900">Data Backup & Restore</h2>

      {/* Publish to Live Site */}
      <div className="card p-6 border-2 border-green-200 bg-green-50/50">
        <h3 className="text-sm font-bold text-slate-900 mb-2 flex items-center gap-2">
          <svg className="w-4 h-4 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>
          Publish to Live Site
        </h3>
        <p className="text-xs text-slate-500 mb-3">
          Push your current products to <strong>arcbank.vercel.app/shop</strong> so all visitors see the latest changes.
        </p>
        <button onClick={publishToSite} disabled={publishing}
          className="btn-primary !bg-green-600 hover:!bg-green-700 !text-sm">
          {publishing ? (
            <span className="flex items-center gap-2">
              <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Publishing...
            </span>
          ) : 'Publish Products to Site'}
        </button>
        {publishStatus && (
          <p className={`text-xs mt-2 ${publishStatus.startsWith('Error') ? 'text-red-600' : 'text-green-600'}`}>
            {publishStatus}
          </p>
        )}
      </div>

      {/* Export section */}
      <div className="card p-6">
        <h3 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2">
          <Download className="w-4 h-4 text-blue-600" /> Export Backup
        </h3>
        <p className="text-xs text-slate-500 mb-4">
          Download all shop data to your computer. Store this file safely — you can use it to restore everything if browser data is cleared.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <button onClick={exportBackup}
            className="flex items-center gap-3 p-4 bg-blue-50 hover:bg-blue-100 rounded-xl border border-blue-200 transition-colors text-left">
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
              <Download className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-sm font-bold text-blue-900">Full Backup (JSON)</p>
              <p className="text-[10px] text-blue-600">Products, orders, finances — complete data</p>
            </div>
          </button>
          <button onClick={exportCSV}
            className="flex items-center gap-3 p-4 bg-emerald-50 hover:bg-emerald-100 rounded-xl border border-emerald-200 transition-colors text-left">
            <div className="w-10 h-10 bg-emerald-600 rounded-lg flex items-center justify-center flex-shrink-0">
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
            </div>
            <div>
              <p className="text-sm font-bold text-emerald-900">Products (CSV)</p>
              <p className="text-[10px] text-emerald-600">Spreadsheet format — edit in Excel/Google Sheets</p>
            </div>
          </button>
        </div>
        {lastBackup && (
          <p className="text-[10px] text-slate-400 mt-3">Last backup: {lastBackup}</p>
        )}
      </div>

      {/* Import section */}
      <div className="card p-6">
        <h3 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2">
          <Upload className="w-4 h-4 text-amber-600" /> Restore from Backup
        </h3>
        <p className="text-xs text-slate-500 mb-4">
          Upload a previously exported JSON backup file to restore all data. <span className="text-red-500 font-semibold">Warning: This will replace all current data.</span>
        </p>
        <label className="flex items-center gap-3 p-4 bg-amber-50 hover:bg-amber-100 rounded-xl border-2 border-dashed border-amber-300 hover:border-amber-400 cursor-pointer transition-colors">
          <div className="w-10 h-10 bg-amber-500 rounded-lg flex items-center justify-center flex-shrink-0">
            <Upload className="w-5 h-5 text-white" />
          </div>
          <div>
            <p className="text-sm font-bold text-amber-900">{importing ? 'Restoring...' : 'Choose Backup File'}</p>
            <p className="text-[10px] text-amber-600">Select a .json backup file to restore</p>
          </div>
          <input type="file" accept=".json" className="hidden" onChange={importBackup} disabled={importing} />
        </label>
      </div>

      {/* Current data summary */}
      <div className="card p-6">
        <h3 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2">
          <HardDrive className="w-4 h-4 text-slate-600" /> Current Data Summary
        </h3>
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center p-3 bg-slate-50 rounded-xl">
            <p className="text-2xl font-extrabold text-slate-900">{products.length}</p>
            <p className="text-xs text-slate-500">Products</p>
          </div>
          <div className="text-center p-3 bg-slate-50 rounded-xl">
            <p className="text-2xl font-extrabold text-slate-900">{orders.length}</p>
            <p className="text-xs text-slate-500">Orders</p>
          </div>
          <div className="text-center p-3 bg-slate-50 rounded-xl">
            <p className="text-2xl font-extrabold text-slate-900">
              {JSON.parse(localStorage.getItem('arcbank_finances') || '[]').length}
            </p>
            <p className="text-xs text-slate-500">Finance Entries</p>
          </div>
        </div>
        <div className="mt-4 p-3 bg-blue-50 rounded-lg">
          <p className="text-[11px] text-blue-700">
            <strong>Storage used:</strong> ~{(new Blob([JSON.stringify(localStorage)]).size / 1024).toFixed(0)} KB of ~5 MB limit
          </p>
        </div>
      </div>
    </div>
  );
}

// ═══════ HELPERS ═══════
function StatCard({ label, value, icon: Icon, color }: { label: string; value: string; icon: any; color: string }) {
  const colors: Record<string, string> = {
    blue: 'bg-blue-50 text-blue-600',
    red: 'bg-red-50 text-red-600',
    green: 'bg-emerald-50 text-emerald-600',
    purple: 'bg-purple-50 text-purple-600',
    orange: 'bg-orange-50 text-orange-600',
    cyan: 'bg-cyan-50 text-cyan-600',
  };
  return (
    <div className="card p-4">
      <div className="flex items-center gap-2 mb-2">
        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${colors[color] || colors.blue}`}>
          <Icon className="w-4 h-4" />
        </div>
      </div>
      <p className="text-xl font-extrabold text-slate-900">{value}</p>
      <p className="text-xs text-slate-500">{label}</p>
    </div>
  );
}

function StatusIcon({ status }: { status: string }) {
  const icons: Record<string, any> = {
    pending: Clock, confirmed: Check, preparing: ChefHat, shipping: Truck, delivered: Package, failed: X
  };
  const colors: Record<string, string> = {
    pending: 'text-amber-500', confirmed: 'text-emerald-500', preparing: 'text-blue-500',
    shipping: 'text-purple-500', delivered: 'text-emerald-600', failed: 'text-red-500'
  };
  const Icon = icons[status] || Clock;
  return <Icon className={`w-4 h-4 ${colors[status] || 'text-slate-400'}`} />;
}

function StatusBadge({ status }: { status: string }) {
  const config: Record<string, { label: string; cls: string }> = {
    pending: { label: 'Pending', cls: 'bg-amber-50 text-amber-700 border-amber-200' },
    confirmed: { label: 'Confirmed', cls: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
    preparing: { label: 'Preparing', cls: 'bg-blue-50 text-blue-700 border-blue-200' },
    shipping: { label: 'Shipping', cls: 'bg-purple-50 text-purple-700 border-purple-200' },
    delivered: { label: 'Delivered', cls: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
    failed: { label: 'Failed', cls: 'bg-red-50 text-red-700 border-red-200' },
  };
  const c = config[status] || config.pending;
  return <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${c.cls}`}>{c.label}</span>;
}

function TaxRow({ name, rate, desc }: { name: string; rate: string; desc: string }) {
  return (
    <div className="flex items-center justify-between p-2 hover:bg-slate-50 rounded-lg">
      <div>
        <p className="font-medium text-slate-900">{name}</p>
        <p className="text-xs text-slate-400">{desc}</p>
      </div>
      <span className="text-sm font-bold text-blue-600">{rate}</span>
    </div>
  );
}

function getCategoryRevenue(orders: any[]): [string, number][] {
  const catMap: Record<string, number> = {};
  orders.forEach(order => {
    if (order.status === 'failed') return;
    order.items.forEach((item: any) => {
      const cat = item.product.category || 'Other';
      catMap[cat] = (catMap[cat] || 0) + item.product.price * item.quantity;
    });
  });
  return Object.entries(catMap).sort((a, b) => b[1] - a[1]).slice(0, 8);
}