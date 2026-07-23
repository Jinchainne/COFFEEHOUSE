import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import AIChat from './AIChat';

export default function Layout() {
  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <main className="max-w-7xl mx-auto">
        <Outlet />
      </main>
      <AIChat />

      <footer className="bg-slate-900 text-slate-400 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
            <div className="col-span-2 md:col-span-1">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-cyan-500 rounded-lg flex items-center justify-center">
                  <span className="text-white text-sm font-bold">A</span>
                </div>
                <span className="text-white font-bold">ArcPay Shop</span>
              </div>
              <p className="text-xs leading-relaxed text-slate-500">Order food & drinks, pay with USDC on Arc Testnet. Fast, cheap, on-chain payments.</p>
            </div>
            <div>
              <h4 className="text-white font-bold text-sm mb-4">Shop</h4>
              <ul className="space-y-2 text-xs">
                <li><a href="/shop" className="hover:text-white transition-colors">Menu</a></li>
                <li><a href="/shop/orders" className="hover:text-white transition-colors">My Orders</a></li>
                <li><a href="/shop/track" className="hover:text-white transition-colors">Track Order</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-bold text-sm mb-4">Resources</h4>
              <ul className="space-y-2 text-xs">
                <li><a href="https://docs.arc.io" target="_blank" rel="noreferrer" className="hover:text-white transition-colors">Arc Docs</a></li>
                <li><a href="https://testnet.arcscan.app" target="_blank" rel="noreferrer" className="hover:text-white transition-colors">Block Explorer</a></li>
                <li><a href="https://faucet.circle.com" target="_blank" rel="noreferrer" className="hover:text-white transition-colors">USDC Faucet</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-bold text-sm mb-4">Network</h4>
              <ul className="space-y-2 text-xs">
                <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> Arc Testnet</li>
                <li>Chain ID: 5042002</li>
                <li>Sub-second finality</li>
                <li>~$0.01 gas fee</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-slate-800 pt-6 flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-xs text-slate-500">&copy; 2026 ArcPay Shop. Built on Arc Testnet with USDC.</p>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-500 pulse-dot" />
              <span className="text-xs text-slate-500">All systems operational</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
