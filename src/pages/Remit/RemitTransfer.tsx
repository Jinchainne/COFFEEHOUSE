import Header from '../../components/Header';
import { useStore } from '../../hooks/useStore';
import { SuccessModal, useToast } from '../../components/UI';
import { formatCurrency } from '../../utils/format';
import { useState } from 'react';
import { Globe, ArrowRightLeft, Zap, Clock, Shield, TrendingUp } from 'lucide-react';

const COUNTRIES = [
  { code: 'US', name: 'United States', currency: 'USDC', rate: 1.0, flag: '🇺🇸' },
  { code: 'UK', name: 'United Kingdom', currency: 'EURC', rate: 0.917, flag: '🇬🇧' },
  { code: 'DE', name: 'Germany', currency: 'EURC', rate: 0.917, flag: '🇩🇪' },
  { code: 'JP', name: 'Japan', currency: 'USDC', rate: 149.50, flag: '🇯🇵' },
  { code: 'KR', name: 'South Korea', currency: 'USDC', rate: 1320.00, flag: '🇰🇷' },
  { code: 'SG', name: 'Singapore', currency: 'USDC', rate: 1.34, flag: '🇸🇬' },
  { code: 'AU', name: 'Australia', currency: 'USDC', rate: 1.53, flag: '🇦🇺' },
];

export default function RemitTransfer() {
  const { contacts, balance, createRemit } = useStore();
  const { showToast, ToastUI } = useToast();
  const [amount, setAmount] = useState('');
  const [selectedCountry, setSelectedCountry] = useState(COUNTRIES[1]);
  const [recipient, setRecipient] = useState('');
  const [sending, setSending] = useState(false);
  const [success, setSuccess] = useState(false);

  const convertedAmount = amount ? (parseFloat(amount) * selectedCountry.rate).toFixed(2) : '0.00';
  const fee = amount ? Math.max(0.50, parseFloat(amount) * 0.0025).toFixed(2) : '0.00';

  const handleSend = async () => {
    setSending(true);
    try {
      await createRemit('You', recipient, parseFloat(amount), selectedCountry.rate, selectedCountry.name);
      setSuccess(true);
      showToast('Remittance sent successfully!');
    } catch { showToast('Transfer failed', 'error'); }
    setSending(false);
  };

  return (
    <div className="bg-slate-50 min-h-screen">
      <Header title="Cross-Border Transfer" subtitle="Send USDC/EURC worldwide on Arc" />
      <div className="p-4 sm:p-6 max-w-lg mx-auto space-y-4">

        {/* FX Rate Banner */}
        <div className="card p-4 bg-gradient-to-r from-cyan-50 to-blue-50 border border-cyan-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-100 flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-cyan-600" />
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-900">Live Exchange Rate</p>
              <p className="text-[11px] text-slate-500">1 USDC = {selectedCountry.rate} {selectedCountry.currency} · Updated in real-time</p>
            </div>
          </div>
        </div>

        {/* From Amount */}
        <div className="card p-5">
          <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 block">You Send</label>
          <div className="flex items-center gap-3">
            <input type="number" value={amount} onChange={e => setAmount(e.target.value)}
              placeholder="0.00" className="text-2xl font-bold flex-1 !border-0 !bg-slate-50" />
            <div className="flex items-center gap-2 px-3 py-2 bg-blue-50 rounded-xl">
              <span className="text-sm">🇺🇸</span>
              <span className="text-sm font-bold text-blue-600">USDC</span>
            </div>
          </div>
          <p className="text-xs text-slate-400 mt-2">Available: {formatCurrency(balance.usdc)}</p>
        </div>

        {/* Swap Arrow */}
        <div className="flex justify-center -my-2">
          <div className="w-10 h-10 rounded-full bg-white border-2 border-slate-200 flex items-center justify-center shadow-sm z-10">
            <ArrowRightLeft className="w-4 h-4 text-slate-400" />
          </div>
        </div>

        {/* To Amount */}
        <div className="card p-5">
          <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 block">Recipient Gets</label>
          <div className="flex items-center gap-3">
            <div className="flex-1 text-2xl font-bold text-slate-900 bg-slate-50 rounded-xl px-4 py-3">
              {convertedAmount}
            </div>
            <button className="flex items-center gap-2 px-3 py-2 bg-emerald-50 rounded-xl">
              <span className="text-sm">{selectedCountry.flag}</span>
              <span className="text-sm font-bold text-emerald-600">{selectedCountry.currency}</span>
            </button>
          </div>
        </div>

        {/* Destination Country */}
        <div className="card p-4">
          <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 block">Destination</label>
          <div className="grid grid-cols-2 gap-2">
            {COUNTRIES.map(c => (
              <button key={c.code} onClick={() => setSelectedCountry(c)}
                className={`flex items-center gap-2 p-3 rounded-xl border-2 transition-all text-left ${
                  selectedCountry.code === c.code ? 'border-blue-500 bg-blue-50' : 'border-slate-100 hover:border-slate-200'
                }`}>
                <span className="text-lg">{c.flag}</span>
                <div>
                  <p className="text-xs font-semibold text-slate-900">{c.name}</p>
                  <p className="text-[10px] text-slate-400">{c.rate} {c.currency}</p>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Recipient */}
        <div className="card p-4">
          <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 block">Recipient</label>
          <select value={recipient} onChange={e => setRecipient(e.target.value)} className="bg-white">
            <option value="">Select a contact...</option>
            {contacts.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
          </select>
        </div>

        {/* Summary */}
        {amount && parseFloat(amount) > 0 && (
          <div className="card p-4">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Transfer Summary</h3>
            <div className="space-y-2">
              <div className="flex justify-between"><span className="text-xs text-slate-500">You send</span><span className="text-sm font-bold text-slate-900">{formatCurrency(parseFloat(amount))}</span></div>
              <div className="flex justify-between"><span className="text-xs text-slate-500">Exchange rate</span><span className="text-sm text-slate-700">1 USDC = {selectedCountry.rate} {selectedCountry.currency}</span></div>
              <div className="flex justify-between"><span className="text-xs text-slate-500">Transfer fee</span><span className="text-sm text-slate-700">{formatCurrency(parseFloat(fee))}</span></div>
              <div className="border-t border-slate-100 pt-2 flex justify-between">
                <span className="text-xs font-semibold text-slate-900">Recipient gets</span>
                <span className="text-base font-bold text-emerald-600">{convertedAmount} {selectedCountry.currency}</span>
              </div>
              <div className="flex items-center gap-4 mt-2 pt-2 border-t border-slate-100">
                <span className="flex items-center gap-1 text-[10px] text-slate-400"><Zap className="w-3 h-3" /> Instant</span>
                <span className="flex items-center gap-1 text-[10px] text-slate-400"><Clock className="w-3 h-3" /> &lt;1s finality</span>
                <span className="flex items-center gap-1 text-[10px] text-slate-400"><Shield className="w-3 h-3" /> Secure</span>
              </div>
            </div>
          </div>
        )}

        {/* Send Button */}
        <button onClick={handleSend} disabled={!amount || !recipient || sending} className="btn-primary w-full text-base py-4">
          {sending ? '⏳ Processing...' : <><Globe className="w-5 h-5" /> Send International Transfer</>}
        </button>

        <SuccessModal open={success} onClose={() => { setSuccess(false); setAmount(''); setRecipient(''); }}
          amount={`${formatCurrency(parseFloat(amount || '0'))} → ${convertedAmount} ${selectedCountry.currency}`}
          to={`${recipient} (${selectedCountry.name})`} />
        {ToastUI}
      </div>
    </div>
  );
}
