import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';

export interface FinanceEntry {
  id: string;
  type: 'income' | 'expense';
  category: string;
  description: string;
  amount: number;
  date: string;
  note: string;
}

interface AdminCtx {
  isAdmin: boolean;
  login: (password: string) => Promise<boolean>;
  logout: () => void;
  finances: FinanceEntry[];
  addFinance: (entry: Omit<FinanceEntry, 'id'>) => void;
  removeFinance: (id: string) => void;
  totalIncome: number;
  totalExpense: number;
  profit: number;
}

const AdminContext = createContext<AdminCtx | null>(null);

const EXPENSE_CATEGORIES = ['Ingredients', 'Staff Salary', 'Rent', 'Utilities', 'Shipping', 'Marketing', 'Equipment', 'Tax', 'Other'];
const INCOME_CATEGORIES = ['Sales', 'Shipping Fee', 'Tips', 'Other'];

export { EXPENSE_CATEGORIES, INCOME_CATEGORIES };

export function AdminProvider({ children }: { children: ReactNode }) {
  const [isAdmin, setIsAdmin] = useState(() => {
    return sessionStorage.getItem('arcbank_admin') === 'true';
  });

  const [finances, setFinances] = useState<FinanceEntry[]>(() => {
    try {
      const saved = localStorage.getItem('arcbank_finances');
      return saved ? JSON.parse(saved) : getDefaultFinances();
    } catch { return getDefaultFinances(); }
  });

  const login = useCallback(async (password: string): Promise<boolean> => {
    try {
      const resp = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });
      if (resp.ok) {
        setIsAdmin(true);
        sessionStorage.setItem('arcbank_admin', 'true');
        return true;
      }
      return false;
    } catch {
      return false;
    }
  }, []);

  const logout = useCallback(() => {
    setIsAdmin(false);
    sessionStorage.removeItem('arcbank_admin');
  }, []);

  const addFinance = useCallback((entry: Omit<FinanceEntry, 'id'>) => {
    setFinances(prev => {
      const newEntry = { ...entry, id: `FIN-${Date.now().toString(36)}` };
      const updated = [newEntry, ...prev];
      localStorage.setItem('arcbank_finances', JSON.stringify(updated));
      return updated;
    });
  }, []);

  const removeFinance = useCallback((id: string) => {
    setFinances(prev => {
      const updated = prev.filter(f => f.id !== id);
      localStorage.setItem('arcbank_finances', JSON.stringify(updated));
      return updated;
    });
  }, []);

  const totalIncome = finances.filter(f => f.type === 'income').reduce((s, f) => s + f.amount, 0);
  const totalExpense = finances.filter(f => f.type === 'expense').reduce((s, f) => s + f.amount, 0);
  const profit = totalIncome - totalExpense;

  return (
    <AdminContext.Provider value={{ isAdmin, login, logout, finances, addFinance, removeFinance, totalIncome, totalExpense, profit }}>
      {children}
    </AdminContext.Provider>
  );
}

export function useAdmin() {
  const ctx = useContext(AdminContext);
  if (!ctx) throw new Error('useAdmin must be used within AdminProvider');
  return ctx;
}

function getDefaultFinances(): FinanceEntry[] {
  const today = new Date();
  const d = (daysAgo: number) => {
    const dt = new Date(today);
    dt.setDate(dt.getDate() - daysAgo);
    return dt.toISOString().split('T')[0];
  };
  return [
    { id: 'f1', type: 'income', category: 'Sales', description: 'Daily revenue Jul 23', amount: 245.50, date: d(0), note: '15 orders' },
    { id: 'f2', type: 'income', category: 'Sales', description: 'Daily revenue Jul 22', amount: 189.25, date: d(1), note: '12 orders' },
    { id: 'f3', type: 'income', category: 'Sales', description: 'Daily revenue Jul 21', amount: 312.00, date: d(2), note: '20 orders' },
    { id: 'f4', type: 'income', category: 'Shipping Fee', description: 'Weekly shipping income', amount: 87.50, date: d(0), note: 'Total delivery fees' },
    { id: 'f5', type: 'expense', category: 'Ingredients', description: 'Coffee beans purchase', amount: 120.00, date: d(1), note: '5kg robusta + 3kg arabica' },
    { id: 'f6', type: 'expense', category: 'Ingredients', description: 'Fresh produce', amount: 85.00, date: d(1), note: 'Vegetables, meat, seafood' },
    { id: 'f7', type: 'expense', category: 'Staff Salary', description: 'Weekly salary Staff #1', amount: 150.00, date: d(0), note: 'Part-time' },
    { id: 'f8', type: 'expense', category: 'Utilities', description: 'Electricity bill July', amount: 95.00, date: d(5), note: '' },
    { id: 'f9', type: 'expense', category: 'Rent', description: 'Rent payment July', amount: 500.00, date: d(7), note: 'Prepaid' },
    { id: 'f10', type: 'expense', category: 'Marketing', description: 'Facebook ads', amount: 50.00, date: d(3), note: 'Boost post' },
    { id: 'f11', type: 'expense', category: 'Shipping', description: 'Third-party delivery', amount: 35.00, date: d(2), note: 'External orders' },
    { id: 'f12', type: 'income', category: 'Tips', description: 'Customer tips', amount: 15.00, date: d(0), note: 'Tips' },
  ];
}
