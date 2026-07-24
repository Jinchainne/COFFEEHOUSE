import { useAccount, useConnect, useDisconnect, useSwitchChain } from 'wagmi';
import { useState, useRef, useEffect } from 'react';
import { Wallet, ChevronDown, Copy, ExternalLink, LogOut, Check, AlertTriangle, X, Loader2 } from 'lucide-react';
import { arcTestnet } from '../config/chains';

function shortenAddress(addr: string) {
  if (!addr) return '';
  return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
}

async function forceSwitchToArc() {
  const ethereum = (window as any).ethereum;
  if (!ethereum) return;
  const arcChainId = '0x4cf3a2';
  try {
    await ethereum.request({ method: 'wallet_switchEthereumChain', params: [{ chainId: arcChainId }] });
  } catch (e: any) {
    if (e.code === 4902 || e.message?.includes('Unrecognized') || e.message?.includes('not found')) {
      try {
        await ethereum.request({
          method: 'wallet_addEthereumChain',
          params: [{
            chainId: arcChainId,
            chainName: 'Arc Testnet',
            nativeCurrency: { name: 'USDC', symbol: 'USDC', decimals: 18 },
            rpcUrls: ['https://rpc.testnet.arc.network'],
            blockExplorerUrls: ['https://testnet.arcscan.app'],
          }],
        });
      } catch (addErr) {
        console.error('Failed to add Arc Testnet:', addErr);
      }
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
        setTimeout(() => { hasTriedSwitch.current = false; }, 5000);
      });
    }
    if (isConnected && chain && chain.id === arcTestnet.id) {
      setShowModal(false);
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
    if (address) {
      navigator.clipboard.writeText(address);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const isWrongChain = isConnected && chain && chain.id !== arcTestnet.id;

  // Direct connect - no modal, just try to connect
  const handleConnect = () => {
    // Try injected connector first (most common)
    const injectedConnector = connectors.find(c => c.id === 'injected');
    if (injectedConnector) {
      connect({ connector: injectedConnector });
    } else if (connectors.length > 0) {
      connect({ connector: connectors[0] });
    }
  };

  // ═══════ NOT CONNECTED ═══════
  if (!isConnected) {
    return (
      <button onClick={handleConnect}
        className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white text-sm font-semibold shadow-md shadow-blue-200 transition-all hover:shadow-lg hover:-translate-y-0.5">
        <Wallet className="w-4 h-4" />
        Connect Wallet
      </button>
    );
  }

  // ═══════ WRONG CHAIN ═══════
  if (isWrongChain) {
    return (
      <button onClick={() => {
        setSwitching(true);
        try { switchChain({ chainId: arcTestnet.id }); } catch {}
        forceSwitchToArc().finally(() => setSwitching(false));
      }}
        disabled={switching}
        className="flex items-center gap-2 px-3 py-2 rounded-xl bg-amber-50 hover:bg-amber-100 border border-amber-300 transition-all">
        {switching ? <Loader2 className="w-4 h-4 text-amber-500 animate-spin" /> : <AlertTriangle className="w-4 h-4 text-amber-500" />}
        <span className="text-xs font-semibold text-amber-700">
          {switching ? 'Switching to Arc...' : `Switch to Arc (on ${chain?.name})`}
        </span>
      </button>
    );
  }

  // ═══════ CONNECTED ═══════
  return (
    <div className="relative" ref={dropdownRef}>
      <button onClick={() => setOpen(!open)}
        className="flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 transition-all">
        <div className="w-7 h-7 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-[10px] font-bold text-white">
          {address ? address.slice(2, 4).toUpperCase() : '??'}
        </div>
        <span className="text-xs font-semibold text-slate-700">{shortenAddress(address || '')}</span>
        <ChevronDown className={`w-3 h-3 text-slate-400 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div className="absolute right-0 top-12 w-72 bg-white rounded-2xl shadow-xl border border-slate-200 z-50 overflow-hidden">
          <div className="p-4 bg-gradient-to-r from-blue-50 to-cyan-50 border-b border-slate-100">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-sm font-bold text-white shadow-md">
                {address ? address.slice(2, 4).toUpperCase() : '??'}
              </div>
              <div>
                <p className="text-sm font-bold text-slate-900">Connected</p>
                <p className="text-[11px] text-slate-500">{shortenAddress(address || '')}</p>
              </div>
              <div className="ml-auto flex items-center gap-1 px-2 py-0.5 bg-emerald-100 rounded-full">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                <span className="text-[10px] font-semibold text-emerald-700">Active</span>
              </div>
            </div>
            {chain && (
              <div className="flex items-center gap-2 px-3 py-2 bg-white rounded-xl">
                <div className="w-2 h-2 rounded-full bg-emerald-500" />
                <span className="text-xs text-slate-600">{chain.name}</span>
                <span className="ml-auto text-[10px] text-slate-400 font-mono">ID {chain.id}</span>
              </div>
            )}
          </div>

          <div className="p-2">
            <button onClick={copyAddress}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-slate-50 text-left transition-colors">
              {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4 text-slate-400" />}
              <span className="text-sm text-slate-700">{copied ? 'Copied!' : 'Copy Address'}</span>
            </button>
            <a href={`https://testnet.arcscan.app/address/${address}`} target="_blank" rel="noreferrer"
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-slate-50 text-left transition-colors">
              <ExternalLink className="w-4 h-4 text-slate-400" />
              <span className="text-sm text-slate-700">View on ArcScan</span>
            </a>
            <div className="border-t border-slate-100 my-1" />
            <button onClick={() => { disconnect(); setOpen(false); }}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-red-50 text-left transition-colors">
              <LogOut className="w-4 h-4 text-red-400" />
              <span className="text-sm text-red-600 font-medium">Disconnect</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
