import Header from '../../components/Header';
import { useStore } from '../../hooks/useStore';

import { formatCurrency, formatTime } from '../../utils/format';
import { useNavigate } from 'react-router-dom';
import { Users, Plus, ChevronRight, Receipt } from 'lucide-react';

export default function SplitGroups() {
  const { groups, expenses } = useStore();
  const navigate = useNavigate();

  return (
    <div className="bg-slate-50 min-h-screen">
      <Header title="Split Groups" subtitle="Manage shared expenses" />
      <div className="p-4 sm:p-6">
        {/* Create Group Button */}
        <button onClick={() => navigate('/split/new')} className="btn-primary w-full mb-4">
          <Plus className="w-4 h-4" /> Create New Expense
        </button>

        {/* Groups List */}
        <div className="space-y-3">
          {groups.map(group => {
            const groupExpenses = expenses.filter(e => e.groupId === group.id);
            return (
              <div key={group.id} className="card p-4 cursor-pointer" onClick={() => {}}>
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-xl bg-violet-50 flex items-center justify-center">
                      <Users className="w-5 h-5 text-violet-500" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-slate-900">{group.name}</h3>
                      <p className="text-[11px] text-slate-400">{group.members.length} members · Created {formatTime(group.createdAt)}</p>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-300" />
                </div>

                {/* Members */}
                <div className="flex items-center gap-1 mb-3">
                  {group.members.slice(0, 4).map((m) => (
                    <div key={m.id} className="w-7 h-7 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-[9px] font-bold text-white border-2 border-white -ml-1 first:ml-0">
                      {m.name.split(' ').map(n => n[0]).join('')}
                    </div>
                  ))}
                  {group.members.length > 4 && (
                    <div className="w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center text-[9px] font-bold text-slate-500 border-2 border-white -ml-1">
                      +{group.members.length - 4}
                    </div>
                  )}
                </div>

                {/* Stats */}
                <div className="flex items-center justify-between bg-slate-50 rounded-xl p-3">
                  <div>
                    <p className="text-[10px] text-slate-400">Total Expenses</p>
                    <p className="text-base font-bold text-slate-900">{formatCurrency(group.totalExpenses)}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] text-slate-400">Per Person</p>
                    <p className="text-base font-bold text-blue-600">{formatCurrency(group.totalExpenses / group.members.length)}</p>
                  </div>
                </div>

                {/* Recent Expenses */}
                {groupExpenses.length > 0 && (
                  <div className="mt-3 pt-3 border-t border-slate-100">
                    <p className="text-[10px] text-slate-400 uppercase tracking-wider mb-2">Recent</p>
                    {groupExpenses.slice(0, 2).map(exp => (
                      <div key={exp.id} className="flex items-center gap-2 py-1.5">
                        <Receipt className="w-3.5 h-3.5 text-slate-400" />
                        <span className="text-xs text-slate-700 flex-1">{exp.description}</span>
                        <span className="text-xs font-semibold text-slate-900">{formatCurrency(exp.amount)}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
