import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdmin, EXPENSE_CATEGORIES, INCOME_CATEGORIES } from '../../hooks/useAdmin';
import { useShop } from '../../hooks/useShop';
import { formatCurrency } from '../../utils/format';
import {
  LayoutDashboard, ShoppingCart, Receipt, Calculator, LogOut, Plus, Trash2,
  TrendingUp, TrendingDown, DollarSign, Package, ChefHat, Truck, Clock, Check, X, ExternalLink, MapPin
} from 'lucide-react';

type Tab = 'dashboard' | 'orders' | 'finance' | 'tax' | 'products';

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
              <p className="text-xs text-slate-400">Quản lý Coffee House</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={() => navigate('/shop')} className="text-xs text-slate-400 hover:text-white">Xem Shop →</button>
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
              <StatCard label="Đơn hàng" value={totalOrders.toString()} icon={ShoppingCart} color="purple" />
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
                <p className="text-sm text-slate-500">No orders yet nào</p>
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
                <p className="text-xs text-slate-500 mb-1">TNDN (20%)</p>
                <p className="text-2xl font-extrabold text-slate-900">${corporateTax.toFixed(2)}</p>
                <p className="text-xs text-slate-400 mt-1">Corporate income tax</p>
              </div>
              <div className="card p-5 border-l-4 border-green-500">
                <p className="text-xs text-slate-500 mb-1">Profit sau thuế</p>
                <p className="text-2xl font-extrabold text-green-600">${netProfit.toFixed(2)}</p>
                <p className="text-xs text-slate-400 mt-1">Profit ròng sau thuế</p>
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
                  <span className="text-slate-900 font-medium">Profit trước thuế</span>
                  <span className="font-bold">${profit.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-blue-600">
                  <span>VAT (10% × ${totalRevenue.toFixed(2)})</span>
                  <span className="font-bold">-${vatAmount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-amber-600">
                  <span>TNDN (20% × ${taxableIncome.toFixed(2)})</span>
                  <span className="font-bold">-${corporateTax.toFixed(2)}</span>
                </div>
                <div className="border-t-2 border-slate-900 pt-2 flex justify-between text-lg">
                  <span className="font-extrabold">Profit sau thuế</span>
                  <span className="font-extrabold text-green-600">${netProfit.toFixed(2)}</span>
                </div>
              </div>
            </div>

            {/* Vietnamese Tax Info */}
            <div className="card p-6">
              <h3 className="text-sm font-bold text-slate-900 mb-4">Vietnam Tax Reference Table</h3>
              <div className="space-y-2 text-sm">
                <TaxRow name="VAT (Thuế GTGT)" rate="10%" desc="Standard rate for goods/services" />
                <TaxRow name="Thuế TNDN" rate="20%" desc="Corporate income tax" />
                <TaxRow name="Thuế TNCN (lương)" rate="5%-35%" desc="Progressive, 5% cho thu nhập ≤ 5tr/tháng" />
                <TaxRow name="Thuế môn bài" rate="1-3 triệu/năm" desc="Based on registered capital" />
                <TaxRow name="BHXH (công ty)" rate="17.5%" desc="Social insurance (employer)" />
                <TaxRow name="BHXH (nhân viên)" rate="10.5%" desc="Social insurance (employee)" />
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
          <h3 className="text-sm font-bold text-slate-900">Add Entry thu/chi</h3>
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
            <button type="button" onClick={() => setShowForm(false)} className="btn-secondary flex-1">Hủy</button>
            <button type="submit" disabled={!category || !description || !amount} className="btn-primary flex-1">Lưu</button>
          </div>
        </form>
      )}

      {/* Filter */}
      <div className="flex gap-2">
        {(['all', 'income', 'expense'] as const).map(t => (
          <button key={t} onClick={() => setFilterType(t)}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold ${filterType === t ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600'}`}>
            {t === 'all' ? 'Tất cả' : t === 'income' ? 'Thu' : 'Chi'}
          </button>
        ))}
      </div>

      {/* List */}
      <div className="card overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-slate-50 text-xs text-slate-500 uppercase">
              <th className="text-left p-3">Ngày</th>
              <th className="text-left p-3">Loại</th>
              <th className="text-left p-3">Danh mục</th>
              <th className="text-left p-3">Description</th>
              <th className="text-right p-3">Số tiền</th>
              <th className="p-3 w-10"></th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(f => (
              <tr key={f.id} className="border-t border-slate-100 hover:bg-slate-50">
                <td className="p-3 text-slate-500 text-xs">{f.date}</td>
                <td className="p-3">
                  <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${f.type === 'income' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    {f.type === 'income' ? 'Thu' : 'Chi'}
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
  const [editField, setEditField] = useState<'price' | 'image' | null>(null);
  const [editValue, setEditValue] = useState('');
  const [form, setForm] = useState({ name: '', price: '', category: '', image: '', description: '', brand: '' });
  const [filterCat, setFilterCat] = useState('All');

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

  const startEdit = (id: string, field: 'price' | 'image', current: string) => {
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
            <input value={form.image} onChange={e => setForm(f => ({ ...f, image: e.target.value }))}
              placeholder="Image URL" className="sm:col-span-2" />
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
                    </div>
                  ) : (
                    <img src={p.image} alt={p.name} className="w-10 h-10 rounded object-cover cursor-pointer hover:ring-2 hover:ring-blue-300"
                      onClick={() => startEdit(p.id, 'image', p.image)} title="Click to edit image URL" />
                  )}
                </td>
                {/* Name + Description */}
                <td className="p-3">
                  <p className="font-semibold text-slate-900">{p.name}</p>
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
    pending: { label: 'Chờ', cls: 'bg-amber-50 text-amber-700 border-amber-200' },
    confirmed: { label: 'Xác nhận', cls: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
    preparing: { label: 'Chuẩn bị', cls: 'bg-blue-50 text-blue-700 border-blue-200' },
    shipping: { label: 'Giao hàng', cls: 'bg-purple-50 text-purple-700 border-purple-200' },
    delivered: { label: 'Đã giao', cls: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
    failed: { label: 'Thất bại', cls: 'bg-red-50 text-red-700 border-red-200' },
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