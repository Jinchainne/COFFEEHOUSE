import Header from '../components/Header';
import { useStore } from '../hooks/useStore';
import { Avatar, SuccessModal, useToast } from '../components/UI';
import { formatCurrency, shortenAddress } from '../utils/format';
import { Send as SendIcon, ChevronRight, Search, Zap, Clock, Check } from 'lucide-react';
import { useState } from 'react';

export default function Send() {
  const { contacts, balance, sendUSDC } = useStore();
  const { showToast, ToastUI } = useToast();
  const [step, setStep] = useState<'recipient' | 'amount' | 'confirm'>('recipient');
  const [selectedContact, setSelectedContact] = useState<typeof contacts[0] | null>(null);
  const [address, setAddress] = useState('');
  const [amount, setAmount] = useState('');
  const [memo, setMemo] = useState('');
  const [sending, setSending] = useState(false);
  const [success, setSuccess] = useState(false);
  const [txHash, setTxHash] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredContacts = contacts.filter(c =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.address.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSelectContact = (contact: typeof contacts[0]) => {
    setSelectedContact(contact);
    setAddress(contact.address);
    setStep('amount');
  };

  const handleSend = async () => {
    setSending(true);
    try {
      const tx = await sendUSDC(selectedContact?.name || address, parseFloat(amount), memo);
      setTxHash(tx.hash || '');
      setSuccess(true);
      showToast('Payment sent successfully!');
    } catch { showToast('Transaction failed', 'error'); }
    setSending(false);
  };

  const reset = () => { setStep('recipient'); setSelectedContact(null); setAddress(''); setAmount(''); setMemo(''); setSuccess(false); };

  return (
    <div className="bg-slate-50 min-h-screen">
      <Header title="Send Money" subtitle="Transfer USDC instantly on Arc" />
      <div className="p-4 sm:p-6 max-w-lg mx-auto">

        {/* Progress */}
        <div className="flex items-center gap-1 mb-6">
          {['Recipient', 'Amount', 'Confirm'].map((label, i) => {
            const active = i === 0 || (i === 1 && step !== 'recipient') || (i === 2 && step === 'confirm');
            return (
              <div key={label} className="flex items-center flex-1">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${
                  active ? 'bg-blue-600 text-white shadow-md shadow-blue-200' : 'bg-slate-100 text-slate-400'
                }`}>
                  {active && i < (step === 'confirm' ? 3 : step === 'amount' ? 2 : 1) ? <Check className="w-4 h-4" /> : i + 1}
                </div>
                <span className={`text-xs ml-2 font-medium ${active ? 'text-slate-900' : 'text-slate-400'}`}>{label}</span>
                {i < 2 && <div className={`flex-1 h-0.5 mx-2 rounded ${active ? 'bg-blue-200' : 'bg-slate-100'}`} />}
              </div>
            );
          })}
        </div>

        {/* Step 1: Recipient */}
        {step === 'recipient' && (
          <div className="space-y-4">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search contacts or paste address..." className="pl-11" />
            </div>

            <div className="card p-4">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Recent Contacts</p>
              <div className="space-y-1">
                {filteredContacts.map(contact => (
                  <button key={contact.id} onClick={() => handleSelectContact(contact)}
                    className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 transition-colors text-left">
                    <Avatar name={contact.name} />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-slate-900">{contact.name}</p>
                      <p className="text-[11px] text-slate-400 font-mono">{shortenAddress(contact.address)}</p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-300" />
                  </button>
                ))}
              </div>
            </div>

            <div className="card p-4">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Or Enter Manually</p>
              <div className="flex gap-2">
                <input value={address} onChange={e => setAddress(e.target.value)} placeholder="0x..." className="flex-1 font-mono text-sm" />
                <button onClick={() => address && setStep('amount')} disabled={!address}
                  className="btn-primary !px-5">Next</button>
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Amount */}
        {step === 'amount' && (
          <div className="space-y-4">
            <div className="card p-6 text-center">
              <p className="text-xs text-slate-400 mb-2">Sending to</p>
              <div className="flex items-center justify-center gap-2 mb-6">
                <Avatar name={selectedContact?.name || 'Unknown'} size="sm" />
                <p className="text-sm font-semibold text-slate-900">{selectedContact?.name || shortenAddress(address)}</p>
              </div>
              <div className="mb-2">
                <div className="flex items-center justify-center gap-1">
                  <span className="text-4xl font-extrabold text-slate-900">$</span>
                  <input type="number" value={amount} onChange={e => setAmount(e.target.value)}
                    placeholder="0.00"
                    className="!border-0 !bg-transparent !text-center !text-4xl !font-extrabold !text-slate-900 !p-0 !w-48 focus:!shadow-none !ring-0" />
                </div>
                <p className="text-sm text-slate-400 mt-1">USDC</p>
              </div>
              <div className="flex items-center justify-center gap-3 text-xs text-slate-400 mt-4">
                <span>Available: {formatCurrency(balance.usdc)}</span>
                <button onClick={() => setAmount(balance.usdc.toString())}
                  className="text-blue-500 hover:text-blue-600 font-semibold">MAX</button>
              </div>
            </div>

            <input value={memo} onChange={e => setMemo(e.target.value)} placeholder="Add a note (optional)" />

            <div className="flex gap-3">
              <button onClick={() => setStep('recipient')} className="btn-secondary flex-1">Back</button>
              <button onClick={() => setStep('confirm')}
                disabled={!amount || parseFloat(amount) <= 0 || parseFloat(amount) > balance.usdc}
                className="btn-primary flex-1">Continue</button>
            </div>
          </div>
        )}

        {/* Step 3: Confirm */}
        {step === 'confirm' && (
          <div className="space-y-4">
            <div className="card p-5">
              <h3 className="text-sm font-bold text-slate-900 mb-4">Transaction Summary</h3>
              <div className="space-y-3">
                <div className="flex justify-between"><span className="text-xs text-slate-400">Recipient</span><span className="text-sm font-medium text-slate-900">{selectedContact?.name || shortenAddress(address)}</span></div>
                <div className="flex justify-between"><span className="text-xs text-slate-400">Amount</span><span className="text-sm font-bold text-slate-900">{formatCurrency(parseFloat(amount))}</span></div>
                {memo && <div className="flex justify-between"><span className="text-xs text-slate-400">Memo</span><span className="text-sm text-slate-600">{memo}</span></div>}
                <div className="border-t border-slate-100 pt-3 space-y-2">
                  <div className="flex justify-between"><span className="text-xs text-slate-400">Network Fee</span><span className="text-sm text-emerald-600 font-medium flex items-center gap-1"><Zap className="w-3 h-3" /> ~$0.01</span></div>
                  <div className="flex justify-between"><span className="text-xs text-slate-400">Finality</span><span className="text-sm text-slate-600 flex items-center gap-1"><Clock className="w-3 h-3" /> &lt;1 second</span></div>
                  <div className="flex justify-between"><span className="text-xs text-slate-400">Network</span><span className="text-sm text-slate-600">Arc Testnet</span></div>
                </div>
              </div>
            </div>
            <div className="flex gap-3">
              <button onClick={() => setStep('amount')} className="btn-secondary flex-1">Back</button>
              <button onClick={handleSend} disabled={sending} className="btn-primary flex-1">
                {sending ? '⏳ Sending...' : <><SendIcon className="w-4 h-4" /> Send Payment</>}
              </button>
            </div>
          </div>
        )}

        <SuccessModal open={success} onClose={reset} txHash={txHash}
          amount={formatCurrency(parseFloat(amount || '0'))} to={selectedContact?.name || shortenAddress(address)} />
        {ToastUI}
      </div>
    </div>
  );
}
