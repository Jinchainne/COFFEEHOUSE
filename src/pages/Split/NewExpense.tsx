import Header from '../../components/Header';
import { useStore } from '../../hooks/useStore';
import { Avatar, useToast } from '../../components/UI';
import { formatCurrency } from '../../utils/format';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Receipt, Users, DollarSign, Check } from 'lucide-react';

export default function NewExpense() {
  const { groups } = useStore();
  const { showToast, ToastUI } = useToast();
  const navigate = useNavigate();
  const [selectedGroup, setSelectedGroup] = useState(groups[0]?.id || '');
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [splitType, setSplitType] = useState<'equal' | 'custom'>('equal');
  const [creating, setCreating] = useState(false);

  const group = groups.find(g => g.id === selectedGroup);

  const handleCreate = async () => {
    setCreating(true);
    await new Promise(r => setTimeout(r, 1500));
    showToast('Expense created and split!');
    setCreating(false);
    navigate('/split');
  };

  return (
    <div className="bg-slate-50 min-h-screen">
      <Header title="New Expense" subtitle="Split a bill with your group" />
      <div className="p-4 sm:p-6 max-w-lg mx-auto space-y-4">

        {/* Select Group */}
        <div className="card p-4">
          <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 block">Select Group</label>
          <div className="space-y-2">
            {groups.map(g => (
              <button key={g.id} onClick={() => setSelectedGroup(g.id)}
                className={`w-full flex items-center gap-3 p-3 rounded-xl border-2 transition-all ${
                  selectedGroup === g.id ? 'border-blue-500 bg-blue-50' : 'border-slate-100 hover:border-slate-200'
                }`}>
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                  selectedGroup === g.id ? 'bg-blue-100 text-blue-600' : 'bg-slate-100 text-slate-400'
                }`}>
                  <Users className="w-5 h-5" />
                </div>
                <div className="flex-1 text-left">
                  <p className="text-sm font-semibold text-slate-900">{g.name}</p>
                  <p className="text-[11px] text-slate-400">{g.members.length} members</p>
                </div>
                {selectedGroup === g.id && <Check className="w-5 h-5 text-blue-500" />}
              </button>
            ))}
          </div>
        </div>

        {/* Description */}
        <div className="card p-4">
          <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 block">Expense Details</label>
          <div className="space-y-3">
            <div className="relative">
              <Receipt className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input value={description} onChange={e => setDescription(e.target.value)}
                placeholder="What's this for? (e.g., Dinner, Taxi)" className="pl-11" />
            </div>
            <div className="relative">
              <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input type="number" value={amount} onChange={e => setAmount(e.target.value)}
                placeholder="0.00" className="pl-11 text-lg font-bold" />
            </div>
          </div>
        </div>

        {/* Split Type */}
        <div className="card p-4">
          <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 block">Split Method</label>
          <div className="tab-bar mb-4">
            <button onClick={() => setSplitType('equal')} className={`tab-item flex-1 ${splitType === 'equal' ? 'active' : ''}`}>
              Split Equally
            </button>
            <button onClick={() => setSplitType('custom')} className={`tab-item flex-1 ${splitType === 'custom' ? 'active' : ''}`}>
              Custom Amounts
            </button>
          </div>

          {group && amount && (
            <div className="bg-slate-50 rounded-xl p-4">
              <p className="text-xs text-slate-400 mb-3">Each person pays:</p>
              <div className="space-y-2">
                {group.members.map(m => (
                  <div key={m.id} className="flex items-center gap-3">
                    <Avatar name={m.name} size="sm" />
                    <span className="text-sm text-slate-700 flex-1">{m.name}</span>
                    <span className="text-sm font-bold text-slate-900">
                      {formatCurrency(parseFloat(amount) / group.members.length)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Create Button */}
        <button onClick={handleCreate} disabled={!description || !amount || creating}
          className="btn-primary w-full">
          {creating ? '⏳ Creating...' : <><Receipt className="w-4 h-4" /> Create & Split Expense</>}
        </button>
        {ToastUI}
      </div>
    </div>
  );
}
