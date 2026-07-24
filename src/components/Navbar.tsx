import { NavLink } from 'react-router-dom';
import { useState } from 'react';
import { Bell, Coffee, Menu, X, ClipboardList, Shield, MapPin, ShoppingCart, MessageSquare } from 'lucide-react';
import WalletConnect from './WalletConnect';
import { useShop } from '../hooks/useShop';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from '../i18n';

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { cartCount } = useShop();
  const navigate = useNavigate();
  const { t, lang, toggleLang } = useTranslation();

  const navItems = [
    { label: t('nav.menu'), path: '/shop', icon: Coffee },
    { label: t('nav.orders'), path: '/shop/orders', icon: ClipboardList },
    { label: t('nav.track'), path: '/shop/track', icon: MapPin },
    { label: t('nav.feedback'), path: '/shop/feedback', icon: MessageSquare },
    { label: t('nav.admin'), path: '/admin', icon: Shield },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-slate-200 shadow-sm">
      {/* Top bar */}
      <div className="bg-slate-900 text-white text-center py-1.5 text-[11px]">
        <span className="text-slate-400">{t('banner.official')}</span>
        <span className="font-semibold">{t('banner.payWith')}</span>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-14">
          {/* Logo with real coffee image */}
          <NavLink to="/shop" className="flex items-center gap-2.5 flex-shrink-0">
            <img src="/logo.png" alt="Coffee House" className="w-9 h-9 rounded-xl object-cover shadow-md" />
            <div className="hidden sm:block">
              <h1 className="text-sm font-extrabold text-slate-900 leading-tight tracking-tight">COFFEE HOUSE</h1>
              <p className="text-[8px] text-slate-400 uppercase tracking-[0.2em]">The Coffee of the World</p>
            </div>
          </NavLink>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-1">
            {navItems.map(item => (
              <NavLink key={item.path} to={item.path}
                className={({ isActive }) =>
                  `flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
                    isActive ? 'text-amber-700 bg-amber-50 font-bold' : 'text-slate-500 hover:text-amber-700 hover:bg-slate-50'
                  }`}>
                <item.icon className="w-3.5 h-3.5" />
                {item.label}
              </NavLink>
            ))}
          </div>

          {/* Right side */}
          <div className="flex items-center gap-2">
            {/* Language Switcher */}
            <button
              onClick={toggleLang}
              className="px-2 py-1 text-[10px] font-bold text-slate-500 hover:text-amber-700 hover:bg-amber-50 rounded-md border border-slate-200 transition-colors"
              title={lang === 'en' ? 'Switch to Vietnamese' : 'Chuyển sang English'}
            >
              {lang === 'en' ? 'EN' : 'VI'}
            </button>

            <button className="p-2 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-50 relative">
              <Bell className="w-4 h-4" />
              <span className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-red-500" />
            </button>

            <button onClick={() => navigate('/shop/delivery')} className="lg:hidden p-2 rounded-lg text-slate-400 hover:text-slate-600 relative">
              <ShoppingCart className="w-4 h-4" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center">{cartCount}</span>
              )}
            </button>

            <WalletConnect />

            <button onClick={() => setMobileOpen(!mobileOpen)}
              className="lg:hidden p-2 rounded-lg text-slate-400 hover:text-slate-600">
              {mobileOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
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
                `flex items-center gap-2 py-2.5 px-3 text-sm font-medium rounded-lg mb-0.5 ${
                  isActive ? 'text-amber-700 bg-amber-50' : 'text-slate-600 hover:text-amber-700 hover:bg-slate-50'
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
