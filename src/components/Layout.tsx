import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';

export default function Layout() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <main className="max-w-7xl mx-auto">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
            <div>
              <h4 className="text-white font-bold text-sm mb-4">ArcPay Shop</h4>
              <p className="text-xs leading-relaxed">Order food & drinks, pay with USDC on Arc Testnet. Fast, cheap, on-chain.</p>
            </div>
            <div>
              <h4 className="text-white font-bold text-sm mb-4">Resources</h4>
              <ul className="space-y-2 text-xs">
                <li><a href="https://docs.arc.io" target="_blank" rel="noreferrer" className="hover:text-white">Arc Docs</a></li>
                <li><a href="https://testnet.arcscan.app" target="_blank" rel="noreferrer" className="hover:text-white">Block Explorer</a></li>
                <li><a href="https://faucet.circle.com" target="_blank" rel="noreferrer" className="hover:text-white">USDC Faucet</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-bold text-sm mb-4">Network</h4>
              <ul className="space-y-2 text-xs">
                <li>Arc Testnet · Chain 5042002</li>
                <li>Sub-second finality</li>
                <li>~$0.01 gas fee</li>
                <li>USDC gas token</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-slate-800 mt-8 pt-6 flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-xs">&copy; 2026 ArcPay Shop. Pay with stablecoins.</p>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-500 pulse-dot" />
              <span className="text-xs">Live on Arc Testnet</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
