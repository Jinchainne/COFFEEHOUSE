import { useAccount, useConnect, useDisconnect, useSwitchChain } from 'wagmi';
import { useState, useRef, useEffect } from 'react';
import { Wallet, ChevronDown, Copy, ExternalLink, LogOut, Check, AlertTriangle, X, Loader2 } from 'lucide-react';
import { arcTestnet } from '../config/chains';

function shortenAddress(addr: string) {
  if (!addr) return '';
  return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
}

const WALLET_ICONS: Record<string, string> = {
  MetaMask: '🦊', 'Coinbase Wallet': '🔵', WalletConnect: '🔗', Injected: '💉',
  'Brave Wallet': '🦁', Rabby: '🐰', 'Trust Wallet': '🛡️',
};

const WALLET_DESC: Record<string, string> = {
  MetaMask: 'Browser extension wallet', 'Coinbase Wallet': 'Coinbase mobile or extension',
  WalletConnect: 'Scan QR with any mobile wallet', Injected: 'Browser injected wallet',
  'Brave Wallet': 'Built into Brave browser', Rabby: 'Rabby browser extension',
  'Trust Wallet': 'Trust Wallet mobile app',
};

async function forceSwitchToArc() {
  const ethereum = (window as any).ethereum;
  if (!ethereum) return;
  const arcChainId = '0x4cf3a2';
  try {
    await ethereum.request({ method: 'wallet_switchEthereumChain', params: [{ chainId: arcChainId }] });
  } catch (e: any) {
    if (e.code === 4902 || e.message?.includes('Unrecognized')) {
      await ethereum.request({
        method: 'wallet_addEthereumChain',
        params: [{ chainId: arcChainId, chainName: 'Arc Testnet', nativeCurrency: { name: 'USDC', symbol: 'USDC', decimals: 18 }, rpcUrls: ['https://rpc.testnet.arc.network'], blockExplorerUrls: ['https://testnet.arcscan.app'] }],
      });
    }
  }
}

export default function WalletConnect() {
  const { address, isConnected, chain } = useAccount();
  const { connect, connectors, isPending } = useConnect();
  const { disconnect } = useDisconnect();
  const { switchChain } = useSwitchChain();
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [switching, setSwitching] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const hasTriedSwitch = useRef(false);

  useEffect(() => {
    if (isConnected && chain && chain.id !== arcTestnet.id && !hasTriedSwitch.current) {
      hasTriedSwitch.current = true;
      setSwitching(true);
      try { switchChain({ chainId: arcTestnet.id }); } catch {}
      forceSwitchToArc().finally(() => {
        setSwitching(false);
        setTimeout(() => { hasTriedSwitch.current = false; }, 3000);
      });
    }
  }, [isConnected, chain, switchChain]);

  useEffect(() => {
    if (!isConnected) hasTriedSwitch.current = false;
  }, [isConnected]);

  useEffect(() => {
    const h = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, []);

  const copyAddress = () => {
    if (address) { navigator.clipboard.writeText(address); setCopied(true); setTimeout(() => setCopied(false), 2000); }
  };

  const isWrongChain = isConnected && chain && chain.id !== arcTestnet.id;

  // MODAL
  if (showModal) {
    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden">
          <div className="px-6 pt-6 pb-4 text-center relative">
            <button onClick={() => setShowModal(false)} className="absolute top-4 right-4 p-1 hover:bg-slate-100 rounded-lg"><X className="w-5 h-5 text-slate-400" /></button>
            <div className="w-14 h-14 bg-gradient-to-br from-blue-600 to-cyan-500 rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-lg shadow-blue-200"><Wallet className="w-7 h-7 text-white" /></div>
            <h2 className="text-xl font-extrabold text-slate-900">Log in or sign up</h2>
            <p className="text-sm text-slate-400 mt-1">Connect wallet to pay with USDC on Arc Testnet</p>
          </div>
          <div className="px-6 pb-4 space-y-2">
            {connectors.map(c => (
              <button key={c.uid} onClick={() => { connect({ connector: c }); setShowModal(false); }} disabled={isPending}
                className="w-full flex items-center gap-4 p-4 rounded-2xl border border-slate-200 hover:border-blue-400 hover:bg-blue-50 transition-all text-left group">
                <div className="w-11 h-11 rounded-xl bg-slate-50 group-hover:bg-blue-100 flex items-center justify-center text-2xl transition-colors">{WALLET_ICONS[c.name] || '👛'}</div>
                <div className="flex-1"><p className="text-sm font-bold text-slate-900">{c.name}</p><p className="text-[11px] text-slate-400">{WALLET_DESC[c.name] || 'Connect wallet'}</p></div>
                {isPending && <span className="w-4 h-4 border-2 border-blue-200 border-t-blue-600 rounded-full animate-spin" />}
              </button>
            ))}
          </div>
          <div className="px-6 pb-6 flex items-center gap-2 justify-center">
            <div className="w-4 h-4 rounded bg-emerald-100 flex items-center justify-center"><Check className="w-3 h-3 text-emerald-600" /></div>
            <p className="text-[11px] text-slate-400">By connecting, you agree to our Terms of Service</p>
          </div>
        </div>
      </div>
    );
  }

  // NOT CONNECTED
  if (!isConnected) {
    return (
      <button onClick={() => setShowModal(true)} className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white text-sm font-semibold shadow-md shadow-blue-200 transition-all">
        <Wallet className="w-4 h-4" /> Connect Wallet
      </button>
    );
  }

  // WRONG CHAIN
  if (isWrongChain) {
    return (
      <button onClick={() => { setSwitching(true); try { switchChain({ chainId: arcTestnet.id }); } catch {} forceSwitchToArc().finally(() => setSwitching(false)); }}
        disabled={switching} className="flex items-center gap-2 px-3 py-2 rounded-xl bg-amber-50 hover:bg-amber-100 border border-amber-300 transition-all">
        {switching ? <Loader2 className="w-4 h-4 text-amber-500 animate-spin" /> : <AlertTriangle className="w-4 h-4 text-amber-500" />}
        <span className="text-xs font-semibold text-amber-700">{switching ? 'Switching...' : `Switch to Arc (on ${chain?.name || 'wrong chain'})`}</span>
      </button>
    );
  }

  // CONNECTED
  return (
    <div className="relative" ref={dropdownRef}>
      <button onClick={() => setOpen(!open)} className="flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 transition-all">
        <div className="w-7 h-7 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-[10px] font-bold text-white">{address ? address.slice(2, 4).toUpperCase() : '??'}</div>
        <span className="text-xs font-semibold text-slate-700">{shortenAddress(address || '')}</span>
        <ChevronDown className={`w-3 h-3 text-slate-400 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && (
        <div className="absolute right-0 top-12 w-72 bg-white rounded-2xl shadow-xl border border-slate-200 z-50 overflow-hidden">
          <div className="p-4 bg-gradient-to-r from-blue-50 to-cyan-50 border-b border-slate-100">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-sm font-bold text-white shadow-md">{address ? address.slice(2, 4).toUpperCase() : '??'}</div>
              <div><p className="text-sm font-bold text-slate-900">Connected</p><p className="text-[11px] text-slate-500">{shortenAddress(address || '')}</p></div>
              <div className="ml-auto flex items-center gap-1 px-2 py-0.5 bg-emerald-100 rounded-full"><div className="w-1.5 h-1.5 rounded-full bg-emerald-500" /><span className="text-[10px] font-semibold text-emerald-700">Active</span></div>
            </div>
            {chain && <div className="flex items-center gap-2 px-3 py-2 bg-white rounded-xl"><div className="w-2 h-2 rounded-full bg-emerald-500" /><span className="text-xs text-slate-600">{chain.name}</span><span className="ml-auto text-[10px] text-slate-400 font-mono">ID {chain.id}</span></div>}
          </div>
          <div className="p-2">
            <button onClick={copyAddress} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-slate-50 text-left">{copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4 text-slate-400" />}<span className="text-sm text-slate-700">{copied ? 'Copied!' : 'Copy Address'}</span></button>
            <a href={`https://testnet.arcscan.app/address/${address}`} target="_blank" rel="noreferrer" className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-slate-50 text-left"><ExternalLink className="w-4 h-4 text-slate-400" /><span className="text-sm text-slate-700">View on ArcScan</span></a>
            <div className="border-t border-slate-100 my-1" />
            <button onClick={() => { disconnect(); setOpen(false); }} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-red-50 text-left"><LogOut className="w-4 h-4 text-red-400" /><span className="text-sm text-red-600 font-medium">Disconnect</span></button>
          </div>
        </div>
      )}
    </div>
  );
}
