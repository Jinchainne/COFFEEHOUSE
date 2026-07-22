import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { Search, Bell, Wallet, Menu, X } from 'lucide-react';
import WalletConnect from './WalletConnect';

const navItems = [
  { label: 'Services', path: '/', children: [
    { label: 'Dashboard', path: '/' },
    { label: 'Send Money', path: '/send' },
    { label: 'Receive', path: '/receive' },
    { label: 'Split Bill', path: '/split' },
    { label: 'Remittance', path: '/remit' },
  ]},
  { label: 'About ArcBank', path: '#' },
  { label: 'News', path: '#' },
  { label: 'Help', path: '#' },
  { label: 'Partners', path: '#' },
];

export default function Navbar() {
  useLocation();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      {/* Main Nav Bar */}
      <nav className="sticky top-0 z-50 bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <NavLink to="/" className="flex items-center gap-2.5 flex-shrink-0">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-600 to-cyan-500 flex items-center justify-center shadow-md shadow-blue-200">
                <Wallet className="w-5 h-5 text-white" />
              </div>
              <div className="hidden sm:block">
                <h1 className="text-lg font-extrabold text-slate-900 leading-tight tracking-tight">ArcBank</h1>
              </div>
            </NavLink>

            {/* Desktop Nav Links */}
            <div className="hidden lg:flex items-center gap-1">
              {navItems.map((item) => (
                <button key={item.label}
                  onClick={() => item.children && navigate(item.children[0].path)}
                  className="px-3 py-2 text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors relative group">
                  {item.label}
                  {item.children && (
                    <div className="absolute left-0 top-full mt-1 w-48 bg-white rounded-xl shadow-xl border border-slate-200 py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
                      {item.children.map(child => (
                        <NavLink key={child.path} to={child.path}
                          className="block px-4 py-2 text-sm text-slate-600 hover:text-blue-600 hover:bg-blue-50">
                          {child.label}
                        </NavLink>
                      ))}
                    </div>
                  )}
                </button>
              ))}
            </div>

            {/* Right side */}
            <div className="flex items-center gap-2">
              {/* Search */}
              <div className="hidden md:flex items-center bg-slate-50 rounded-xl border border-slate-200 px-3 py-2 w-52">
                <Search className="w-4 h-4 text-slate-400" />
                <input placeholder="Search..." className="flex-1 bg-transparent border-none outline-none text-sm ml-2 text-slate-700 placeholder:text-slate-400 !p-0 !shadow-none" />
              </div>
              
              {/* Notifications */}
              <button className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-50 transition-colors relative">
                <Bell className="w-5 h-5" />
                <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-blue-500 border-2 border-white" />
              </button>

              {/* Wallet */}
              <WalletConnect />

              {/* Mobile menu */}
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
            {navItems.map(item => item.children?.map(child => (
              <NavLink key={child.path} to={child.path} onClick={() => setMobileOpen(false)}
                className="block py-2.5 text-sm text-slate-600 hover:text-blue-600 border-b border-slate-50 last:border-0">
                {child.label}
              </NavLink>
            )))}
          </div>
        )}
      </nav>
    </>
  );
}
