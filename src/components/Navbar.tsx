import { NavLink } from 'react-router-dom';
import { useState } from 'react';
import { Search, Bell, Coffee, Menu, X, ClipboardList } from 'lucide-react';
import WalletConnect from './WalletConnect';

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  const navItems = [
    { label: 'Menu', path: '/shop', icon: Coffee },
    { label: 'Orders', path: '/shop/orders', icon: ClipboardList },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-slate-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <NavLink to="/shop" className="flex items-center gap-2.5 flex-shrink-0">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-600 to-cyan-500 flex items-center justify-center shadow-md shadow-blue-200">
              <Coffee className="w-5 h-5 text-white" />
            </div>
            <div className="hidden sm:block">
              <h1 className="text-lg font-extrabold text-slate-900 leading-tight tracking-tight">ArcPay Shop</h1>
            </div>
          </NavLink>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-1">
            {navItems.map(item => (
              <NavLink key={item.path} to={item.path}
                className={({ isActive }) =>
                  `flex items-center gap-1.5 px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                    isActive ? 'text-blue-600 bg-blue-50' : 'text-slate-600 hover:text-blue-600 hover:bg-slate-50'
                  }`}>
                <item.icon className="w-4 h-4" />
                {item.label}
              </NavLink>
            ))}
          </div>

          {/* Right side */}
          <div className="flex items-center gap-2">
            <div className="hidden md:flex items-center bg-slate-50 rounded-xl border border-slate-200 px-3 py-2 w-44">
              <Search className="w-4 h-4 text-slate-400" />
              <input placeholder="Search..." className="flex-1 bg-transparent border-none outline-none text-sm ml-2 text-slate-700 placeholder:text-slate-400 !p-0 !shadow-none" />
            </div>

            <button className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-50 transition-colors relative">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-blue-500 border-2 border-white" />
            </button>

            <WalletConnect />

            <button onClick={() => setMobileOpen(!mobileOpen)}
              className="lg:hidden p-2 rounded-xl text-slate-400 hover:text-slate-600">
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Nav */}
      {mobileOpen && (
        <div className="lg:hidden border-t border-slate-100 bg-white py-2 px-4">
          {navItems.map(item => (
            <NavLink key={item.path} to={item.path} onClick={() => setMobileOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-2 py-2.5 text-sm font-medium border-b border-slate-50 last:border-0 ${
                  isActive ? 'text-blue-600' : 'text-slate-600 hover:text-blue-600'
                }`}>
              <item.icon className="w-4 h-4" />
              {item.label}
            </NavLink>
          ))}
        </div>
      )}
    </nav>
  );
}
