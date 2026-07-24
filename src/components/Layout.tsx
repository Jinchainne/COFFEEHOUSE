import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import AIChat from './AIChat';
import SocialShare from './SocialShare';

export default function Layout() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <main className="max-w-7xl mx-auto">
        <Outlet />
      </main>
      <AIChat />
      <SocialShare />

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 rounded-lg overflow-hidden">
                <img src="/logo.png" alt="Coffee House" className="w-full h-full object-cover" />
                </div>
                <span className="text-white font-extrabold text-sm">COFFEE HOUSE</span>
              </div>
              <p className="text-xs text-slate-500 leading-relaxed">The Coffee of the World. Pay with USDC on Arc Testnet.</p>
            </div>
            <div>
              <h4 className="text-white font-bold text-xs uppercase tracking-wider mb-3">Shop</h4>
              <ul className="space-y-2 text-xs">
                <li><a href="/shop" className="hover:text-white transition-colors">Menu</a></li>
                <li><a href="/shop/orders" className="hover:text-white transition-colors">My Orders</a></li>
                <li><a href="/shop/track" className="hover:text-white transition-colors">Track Order</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-bold text-xs uppercase tracking-wider mb-3">Payment</h4>
              <ul className="space-y-2 text-xs">
                <li>USDC on Arc Testnet</li>
                <li>Chain ID: 5042002</li>
                <li>~$0.01 gas fee</li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-bold text-xs uppercase tracking-wider mb-3">Resources</h4>
              <ul className="space-y-2 text-xs">
                <li><a href="https://docs.arc.io" target="_blank" rel="noreferrer" className="hover:text-white transition-colors">Arc Docs</a></li>
                <li><a href="https://testnet.arcscan.app" target="_blank" rel="noreferrer" className="hover:text-white transition-colors">Block Explorer</a></li>
                <li><a href="https://faucet.circle.com" target="_blank" rel="noreferrer" className="hover:text-white transition-colors">USDC Faucet</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-slate-800 pt-6 text-center">
            <p className="text-xs text-slate-500">&copy; 2026 Coffee House. All rights reserved. Built on Arc Testnet.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
