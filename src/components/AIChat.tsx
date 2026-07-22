import { useState, useRef, useEffect } from 'react';
import { useAccount, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { parseUnits, isAddress } from 'viem';
import { MessageCircle, X, Send, Bot, User, ArrowRightLeft, Check, AlertCircle, Loader2, ExternalLink } from 'lucide-react';
import { chatWithMimo, type MimoMessage } from '../config/mimo';
import { parseIntent, resolveContact, getSwapRate, type TxProposal } from '../config/agent';
import { useContacts } from '../hooks/useContacts';
import { useUSDCBalance, useEURCBalance } from '../hooks/useOnChain';
import { USDC_ADDRESS, EURC_ADDRESS, ERC20_ABI } from '../config/chains';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  proposal?: TxProposal;
}

export default function AIChat() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: `Hi! I'm your AI Financial Assistant powered by MiMo. I can:\n\n• **Send** USDC/EURC to any address\n• **Swap** USDC ↔ EURC at live rates\n• **Check** your on-chain balance\n\nTry: "Send 10 USDC to 0x..." or "Swap 50 USDC to EURC"` }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { address, isConnected } = useAccount();
  const { contacts } = useContacts();
  const { balance: usdcBalance, refetch: refetchUSDC } = useUSDCBalance();
  const { balance: eurcBalance, refetch: refetchEURC } = useEURCBalance();

  // Wagmi write hooks
  const { writeContract, data: txHash, isPending: isWritePending } = useWriteContract();
  const { isLoading: isConfirming, isSuccess: isTxSuccess } = useWaitForTransactionReceipt({ hash: txHash });

  const [activeProposal, setActiveProposal] = useState<TxProposal | null>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Watch for tx success
  useEffect(() => {
    if (isTxSuccess && txHash && activeProposal) {
      const updatedProposal = { ...activeProposal, status: 'success' as const, txHash };
      setActiveProposal(updatedProposal);
      setMessages(prev => {
        const newMsgs = [...prev];
        const lastIdx = newMsgs.length - 1;
        if (newMsgs[lastIdx]?.proposal) {
          newMsgs[lastIdx] = { ...newMsgs[lastIdx], proposal: updatedProposal };
        }
        newMsgs.push({
          role: 'assistant',
          content: `✅ Transaction confirmed! [View on ArcScan](https://testnet.arcscan.app/tx/${txHash})`,
        });
        return newMsgs;
      });
      setActiveProposal(null);
      refetchUSDC();
      refetchEURC();
    }
  }, [isTxSuccess, txHash]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;
    const userMsg = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setLoading(true);

    // Try to parse intent
    const intent = parseIntent(userMsg);

    if (intent?.type === 'send') {
      let to: string | undefined = intent.params.to;
      if (!to && intent.params.toName) {
        to = resolveContact(intent.params.toName, contacts) || undefined;
      }
      if (!to || !isAddress(to)) {
        setMessages(prev => [...prev, { role: 'assistant', content: "I couldn't find that address. Please provide a valid 0x address or a contact name. Example: `Send 10 USDC to 0x742d35Cc6634C0532925a3b844Bc9e7595f2bD18`" }]);
        setLoading(false);
        return;
      }
      const amount = intent.params.amount;
      const proposal: TxProposal = {
        id: Date.now().toString(),
        type: 'send',
        to,
        amount,
        token: 'USDC',
        description: `Send ${amount} USDC to ${to.slice(0, 10)}...`,
        status: 'pending',
      };
      setActiveProposal(proposal);
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: `I'll prepare a **${amount} USDC** transfer to \`${to}\` on Arc Testnet.\n\nPlease review and click **Sign & Send** to confirm via MetaMask.`,
        proposal,
      }]);
      setLoading(false);
      return;
    }

    if (intent?.type === 'swap') {
      const { amount, tokenIn, tokenOut } = intent.params;
      if (tokenIn === tokenOut) {
        setMessages(prev => [...prev, { role: 'assistant', content: "Can't swap the same token! Try: `Swap 100 USDC to EURC`" }]);
        setLoading(false);
        return;
      }
      const rate = getSwapRate(tokenIn, tokenOut);
      const estimatedOut = (parseFloat(amount) * rate).toFixed(2);
      const proposal: TxProposal = {
        id: Date.now().toString(),
        type: 'swap',
        tokenIn: tokenIn as 'USDC' | 'EURC',
        tokenOut: tokenOut as 'USDC' | 'EURC',
        amountIn: amount,
        estimatedOut,
        rate,
        description: `Swap ${amount} ${tokenIn} → ${estimatedOut} ${tokenOut} (rate: ${rate})`,
        status: 'pending',
      };
      setActiveProposal(proposal);
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: `I'll swap **${amount} ${tokenIn}** → **~${estimatedOut} ${tokenOut}** on Arc Testnet.\n\nRate: 1 ${tokenIn} = ${rate} ${tokenOut}\n\nPlease review and click **Sign & Swap** to confirm via MetaMask.`,
        proposal,
      }]);
      setLoading(false);
      return;
    }

    if (intent?.type === 'balance') {
      const msg = isConnected
        ? `Your on-chain balances on Arc Testnet:\n\n• **USDC**: ${usdcBalance.toLocaleString('en-US', { minimumFractionDigits: 2 })}\n• **EURC**: ${eurcBalance.toLocaleString('en-US', { minimumFractionDigits: 2 })}\n\nWallet: \`${address?.slice(0, 10)}...\``
        : 'Please connect your wallet first to check your balance.';
      setMessages(prev => [...prev, { role: 'assistant', content: msg }]);
      setLoading(false);
      return;
    }

    if (intent?.type === 'help') {
      setMessages(prev => [...prev, { role: 'assistant', content: "Here's what I can do:\n\n💸 **Send** — `Send 100 USDC to 0x...`\n🔄 **Swap** — `Swap 50 USDC to EURC`\n💰 **Balance** — `Check my balance`\n📊 **History** — `Show my transactions`\n\nAll transactions are signed by YOU via MetaMask on Arc Testnet." }]);
      setLoading(false);
      return;
    }

    // General question → use MiMo AI
    try {
      const mimoMessages: MimoMessage[] = messages.slice(-6).map(m => ({ role: m.role, content: m.content }));
      mimoMessages.push({ role: 'user', content: userMsg });
      const reply = await chatWithMimo(mimoMessages);
      setMessages(prev => [...prev, { role: 'assistant', content: reply }]);
    } catch {
      setMessages(prev => [...prev, { role: 'assistant', content: "Sorry, I couldn't process that. Try: `Send 10 USDC to 0x...` or `Swap 50 USDC to EURC`" }]);
    }
    setLoading(false);
  };

  // Execute the transaction proposal via wagmi (user signs in MetaMask)
  const executeProposal = (proposal: TxProposal) => {
    if (proposal.type === 'send' && proposal.to && proposal.amount) {
      const tokenAddress = proposal.token === 'EURC' ? EURC_ADDRESS : USDC_ADDRESS;
      writeContract({
        address: tokenAddress,
        abi: ERC20_ABI,
        functionName: 'transfer',
        args: [proposal.to as `0x${string}`, parseUnits(proposal.amount, 6)],
      });
    }
    if (proposal.type === 'swap' && proposal.tokenIn && proposal.tokenOut && proposal.amountIn) {
      // For swap on Arc, we need a swap router. For now, simulate as two-step:
      // 1. Send tokenIn to a swap contract (or use App Kit SDK)
      // This is a placeholder - real swap needs StableFX or DEX contract
      const tokenAddress = proposal.tokenIn === 'EURC' ? EURC_ADDRESS : USDC_ADDRESS;
      writeContract({
        address: tokenAddress,
        abi: ERC20_ABI,
        functionName: 'transfer',
        args: [address as `0x${string}`, parseUnits(proposal.amountIn, 6)],
      });
    }
  };

  return (
    <>
      {/* Floating button */}
      {!open && (
        <button onClick={() => setOpen(true)}
          className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-gradient-to-br from-blue-600 to-cyan-500 text-white shadow-lg shadow-blue-300 flex items-center justify-center hover:shadow-xl hover:-translate-y-1 transition-all">
          <MessageCircle className="w-6 h-6" />
        </button>
      )}

      {/* Chat window */}
      {open && (
        <div className="fixed bottom-6 right-6 z-50 w-[420px] h-[600px] bg-white rounded-2xl shadow-2xl border border-slate-200 flex flex-col overflow-hidden">
          {/* Header */}
          <div className="flex items-center gap-3 px-4 py-3 bg-gradient-to-r from-blue-600 to-cyan-500 text-white">
            <Bot className="w-5 h-5" />
            <div className="flex-1">
              <p className="text-sm font-bold">AI Financial Agent</p>
              <p className="text-[10px] text-blue-100">Powered by MiMo · Can send & swap tokens</p>
            </div>
            <button onClick={() => setOpen(false)} className="p-1 hover:bg-white/20 rounded-lg">
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {messages.map((msg, i) => (
              <div key={i}>
                <div className={`flex gap-2 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  {msg.role === 'assistant' && (
                    <div className="w-7 h-7 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                      <Bot className="w-4 h-4 text-blue-600" />
                    </div>
                  )}
                  <div className={`max-w-[85%] px-3 py-2 rounded-2xl text-sm leading-relaxed ${
                    msg.role === 'user'
                      ? 'bg-blue-600 text-white rounded-br-md'
                      : 'bg-slate-100 text-slate-800 rounded-bl-md'
                  }`} style={{ whiteSpace: 'pre-wrap' }}>
                    {msg.content}
                  </div>
                  {msg.role === 'user' && (
                    <div className="w-7 h-7 rounded-full bg-blue-600 flex items-center justify-center flex-shrink-0">
                      <User className="w-4 h-4 text-white" />
                    </div>
                  )}
                </div>

                {/* Transaction Proposal Card */}
                {msg.proposal && (
                  <div className="ml-9 mt-2">
                    <TxProposalCard
                      proposal={msg.proposal}
                      onConfirm={() => executeProposal(msg.proposal!)}
                      isWritePending={isWritePending}
                      isConfirming={isConfirming}
                      txHash={txHash}
                    />
                  </div>
                )}
              </div>
            ))}
            {loading && (
              <div className="flex gap-2">
                <div className="w-7 h-7 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                  <Bot className="w-4 h-4 text-blue-600" />
                </div>
                <div className="bg-slate-100 px-4 py-3 rounded-2xl rounded-bl-md">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" />
                    <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce [animation-delay:0.1s]" />
                    <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce [animation-delay:0.2s]" />
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-3 border-t border-slate-200">
            {!isConnected ? (
              <p className="text-xs text-center text-slate-400 py-2">Connect wallet to use AI Agent</p>
            ) : (
              <div className="flex gap-2">
                <input
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleSend()}
                  placeholder="Send 10 USDC to 0x... or Swap 50 USDC to EURC"
                  className="flex-1 !py-2.5 !text-sm !rounded-xl"
                />
                <button onClick={handleSend} disabled={!input.trim() || loading}
                  className="w-10 h-10 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white flex items-center justify-center flex-shrink-0 transition-colors">
                  <Send className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}

// Transaction Proposal Card Component
function TxProposalCard({ proposal, onConfirm, isWritePending, isConfirming, txHash }: {
  proposal: TxProposal;
  onConfirm: () => void;
  isWritePending: boolean;
  isConfirming: boolean;
  txHash?: `0x${string}`;
}) {
  const isExecuting = isWritePending || isConfirming;
  const isSuccess = proposal.status === 'success';

  return (
    <div className={`rounded-xl border-2 p-3 transition-all ${
      isSuccess ? 'border-emerald-200 bg-emerald-50' :
      proposal.status === 'failed' ? 'border-red-200 bg-red-50' :
      isExecuting ? 'border-blue-200 bg-blue-50' :
      'border-amber-200 bg-amber-50'
    }`}>
      <div className="flex items-center gap-2 mb-2">
        {proposal.type === 'send' ? (
          <Send className="w-4 h-4 text-blue-500" />
        ) : (
          <ArrowRightLeft className="w-4 h-4 text-violet-500" />
        )}
        <span className="text-xs font-bold text-slate-700 uppercase">{proposal.type === 'send' ? 'Send Transaction' : 'Swap Transaction'}</span>
      </div>

      {proposal.type === 'send' && (
        <div className="text-xs space-y-1 mb-3">
          <div className="flex justify-between"><span className="text-slate-500">Amount</span><span className="font-bold text-slate-900">{proposal.amount} {proposal.token}</span></div>
          <div className="flex justify-between"><span className="text-slate-500">To</span><span className="font-mono text-slate-700">{proposal.to?.slice(0, 10)}...{proposal.to?.slice(-4)}</span></div>
          <div className="flex justify-between"><span className="text-slate-500">Network</span><span className="text-slate-700">Arc Testnet</span></div>
          <div className="flex justify-between"><span className="text-slate-500">Fee</span><span className="text-emerald-600">~$0.01</span></div>
        </div>
      )}

      {proposal.type === 'swap' && (
        <div className="text-xs space-y-1 mb-3">
          <div className="flex justify-between"><span className="text-slate-500">You pay</span><span className="font-bold text-slate-900">{proposal.amountIn} {proposal.tokenIn}</span></div>
          <div className="flex justify-between"><span className="text-slate-500">You get</span><span className="font-bold text-emerald-600">~{proposal.estimatedOut} {proposal.tokenOut}</span></div>
          <div className="flex justify-between"><span className="text-slate-500">Rate</span><span className="text-slate-700">1 {proposal.tokenIn} = {proposal.rate} {proposal.tokenOut}</span></div>
          <div className="flex justify-between"><span className="text-slate-500">Network</span><span className="text-slate-700">Arc Testnet</span></div>
        </div>
      )}

      {/* Status / Actions */}
      {isSuccess ? (
        <div className="flex items-center gap-2 text-xs text-emerald-600 font-medium">
          <Check className="w-4 h-4" />
          Confirmed!
          {txHash && (
            <a href={`https://testnet.arcscan.app/tx/${txHash}`} target="_blank" rel="noreferrer"
              className="text-blue-500 hover:underline flex items-center gap-0.5 ml-auto">
              View <ExternalLink className="w-3 h-3" />
            </a>
          )}
        </div>
      ) : proposal.status === 'failed' ? (
        <div className="flex items-center gap-2 text-xs text-red-600 font-medium">
          <AlertCircle className="w-4 h-4" />
          Failed: {proposal.error}
        </div>
      ) : isExecuting ? (
        <div className="flex items-center gap-2 text-xs text-blue-600 font-medium">
          <Loader2 className="w-4 h-4 animate-spin" />
          {isWritePending ? 'Waiting for MetaMask signature...' : 'Confirming on Arc Testnet...'}
        </div>
      ) : (
        <button onClick={onConfirm}
          className="w-full py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white text-sm font-bold shadow-md shadow-blue-200 transition-all flex items-center justify-center gap-2">
          {proposal.type === 'send' ? <><Send className="w-4 h-4" /> Sign & Send</> : <><ArrowRightLeft className="w-4 h-4" /> Sign & Swap</>}
        </button>
      )}
    </div>
  );
}
