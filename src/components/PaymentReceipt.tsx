import { QRCodeSVG } from 'qrcode.react';
import { Check, ExternalLink, Copy } from 'lucide-react';
import { useState } from 'react';
import { MERCHANT_ADDRESS } from '../hooks/useShop';
import type { Order } from '../hooks/useShop';

interface Props {
  order: Order;
  txHash?: string;
  onClose?: () => void;
  onTrack?: () => void;
}

export default function PaymentReceipt({ order, txHash, onClose, onTrack }: Props) {
  const [copied, setCopied] = useState('');

  const copyText = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopied(label);
    setTimeout(() => setCopied(''), 2000);
  };

  const subtotal = order.items.reduce((s, i) => s + i.product.price * i.quantity, 0);
  const date = new Date(order.timestamp);
  const dateStr = date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  const timeStr = date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' });

  const merchantQR = `ethereum:${MERCHANT_ADDRESS}@5042002`;

  return (
    <div className="bg-slate-50 min-h-screen">
      {/* Header */}
      <div className="bg-emerald-600 text-white text-center py-6 px-4">
        <div className="w-16 h-16 bg-white/20 backdrop-blur rounded-full flex items-center justify-center mx-auto mb-3">
          <Check className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-xl font-extrabold">Payment Successful!</h1>
        <p className="text-emerald-100 text-sm mt-1">Your order has been confirmed</p>
      </div>

      <div className="max-w-md mx-auto px-4 -mt-4 pb-8">
        {/* Invoice Card */}
        <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden">

          {/* Shop Header with Logo */}
          <div className="p-5 border-b border-dashed border-slate-200 relative">
            <img src="/logo.png" alt="COFFEE HOUSE" className="absolute top-3 right-3 w-28 h-28 object-contain rounded-xl opacity-90" />
            <div className="text-center pr-28">
              <h2 className="text-lg font-extrabold text-slate-900 tracking-tight">COFFEE HOUSE</h2>
              <p className="text-[10px] text-slate-400 uppercase tracking-[0.2em]">The Coffee of the World</p>
              <p className="text-[11px] text-slate-400 mt-1">Pay with USDC on Arc Testnet</p>
            </div>
          </div>

          {/* Order Info */}
          <div className="p-5 border-b border-dashed border-slate-200">
            <div className="grid grid-cols-2 gap-y-2 text-xs">
              <span className="text-slate-400">Order Code</span>
              <span className="text-right font-mono font-bold text-slate-900">{order.code}</span>
              <span className="text-slate-400">Order ID</span>
              <span className="text-right font-mono text-slate-700">{order.id}</span>
              <span className="text-slate-400">Date</span>
              <span className="text-right text-slate-700">{dateStr}</span>
              <span className="text-slate-400">Time</span>
              <span className="text-right text-slate-700">{timeStr}</span>
              <span className="text-slate-400">Status</span>
              <span className="text-right">
                <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-200">
                  <Check className="w-2.5 h-2.5" /> Paid
                </span>
              </span>
            </div>
          </div>

          {/* Items Table */}
          <div className="p-5 border-b border-dashed border-slate-200">
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Items Ordered</h3>
            <table className="w-full text-xs">
              <thead>
                <tr className="text-slate-400 border-b border-slate-100">
                  <th className="text-left pb-2 font-medium">Item</th>
                  <th className="text-center pb-2 font-medium">Qty</th>
                  <th className="text-right pb-2 font-medium">Price</th>
                  <th className="text-right pb-2 font-medium">Amount</th>
                </tr>
              </thead>
              <tbody>
                {order.items.map((item, idx) => (
                  <tr key={idx} className="border-b border-slate-50 last:border-0">
                    <td className="py-2 text-slate-800 font-medium">{item.product.name}</td>
                    <td className="py-2 text-center text-slate-600">{item.quantity}</td>
                    <td className="py-2 text-right text-slate-500">${item.product.price.toFixed(2)}</td>
                    <td className="py-2 text-right font-semibold text-slate-900">${(item.product.price * item.quantity).toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Totals */}
          <div className="p-5 border-b border-dashed border-slate-200">
            <div className="space-y-1.5 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-400">Subtotal</span>
                <span className="text-slate-700">${subtotal.toFixed(2)}</span>
              </div>
              {order.shippingFee > 0 && (
                <div className="flex justify-between">
                  <span className="text-slate-400">Shipping</span>
                  <span className="text-slate-700">${order.shippingFee.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-slate-400">Network Fee</span>
                <span className="text-emerald-600">~$0.01</span>
              </div>
              <div className="border-t border-slate-200 pt-2 mt-2 flex justify-between">
                <span className="text-sm font-bold text-slate-900">Total Paid</span>
                <span className="text-lg font-extrabold text-emerald-600">${order.total.toFixed(2)} USDC</span>
              </div>
            </div>
          </div>

          {/* Blockchain Info */}
          <div className="p-5 border-b border-dashed border-slate-200">
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Transaction Details</h3>
            <div className="space-y-2">
              {/* Customer Wallet */}
              <div className="bg-slate-50 rounded-xl p-3">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] text-slate-400 uppercase">From (Customer)</span>
                  <button onClick={() => copyText(order.customerWallet, 'wallet')}
                    className="text-[10px] text-blue-600 hover:underline flex items-center gap-0.5">
                    <Copy className="w-2.5 h-2.5" /> {copied === 'wallet' ? 'Copied!' : 'Copy'}
                  </button>
                </div>
                <p className="text-[11px] font-mono text-slate-700 break-all">{order.customerWallet}</p>
              </div>

              {/* Merchant Wallet */}
              <div className="bg-slate-50 rounded-xl p-3">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] text-slate-400 uppercase">To (Merchant)</span>
                  <button onClick={() => copyText(MERCHANT_ADDRESS, 'merchant')}
                    className="text-[10px] text-blue-600 hover:underline flex items-center gap-0.5">
                    <Copy className="w-2.5 h-2.5" /> {copied === 'merchant' ? 'Copied!' : 'Copy'}
                  </button>
                </div>
                <p className="text-[11px] font-mono text-slate-700 break-all">{MERCHANT_ADDRESS}</p>
              </div>

              {/* TX Hash */}
              {(txHash || order.txHash) && (
                <div className="bg-slate-50 rounded-xl p-3">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] text-slate-400 uppercase">Tx Hash</span>
                    <button onClick={() => copyText(txHash || order.txHash || '', 'tx')}
                      className="text-[10px] text-blue-600 hover:underline flex items-center gap-0.5">
                      <Copy className="w-2.5 h-2.5" /> {copied === 'tx' ? 'Copied!' : 'Copy'}
                    </button>
                  </div>
                  <p className="text-[11px] font-mono text-slate-700 break-all">{txHash || order.txHash}</p>
                  <a href={`https://testnet.arcscan.app/tx/${txHash || order.txHash}`}
                    target="_blank" rel="noreferrer"
                    className="inline-flex items-center gap-1 text-[10px] text-blue-600 hover:underline mt-1">
                    View on ArcScan <ExternalLink className="w-2.5 h-2.5" />
                  </a>
                </div>
              )}

              {/* Network */}
              <div className="flex justify-between text-[11px] mt-2 px-1">
                <span className="text-slate-400">Network</span>
                <span className="text-slate-600 font-medium">Arc Testnet (Chain ID: 5042002)</span>
              </div>
              <div className="flex justify-between text-[11px] px-1">
                <span className="text-slate-400">Token</span>
                <span className="text-slate-600 font-medium">USDC (6 decimals)</span>
              </div>
            </div>
          </div>

          {/* Merchant QR Code */}
          <div className="p-5 text-center">
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Merchant Wallet QR</h3>
            <div className="inline-block p-3 bg-white rounded-2xl border-2 border-slate-200 shadow-sm">
              <QRCodeSVG value={merchantQR} size={160} level="H" includeMargin={true} />
            </div>
            <p className="text-[10px] text-slate-400 mt-2">Scan to send USDC to COFFEE HOUSE</p>
            <p className="text-[10px] font-mono text-slate-500 mt-1 break-all">{MERCHANT_ADDRESS}</p>
          </div>

          {/* Delivery Info */}
          {order.delivery && (
            <div className="px-5 pb-5">
              <div className="bg-blue-50 rounded-xl p-3 border border-blue-200">
                <p className="text-[10px] text-blue-500 uppercase font-bold mb-1">Delivery Address</p>
                <p className="text-xs text-blue-900">{order.delivery.address}</p>
                {order.delivery.note && <p className="text-[10px] text-blue-600 mt-1">📝 {order.delivery.note}</p>}
              </div>
            </div>
          )}

          {/* Footer */}
          <div className="bg-slate-50 px-5 py-3 text-center border-t border-slate-200">
            <p className="text-[10px] text-slate-400">Thank you for your order at COFFEE HOUSE!</p>
            <p className="text-[9px] text-slate-300 mt-0.5">This receipt serves as proof of payment</p>
          </div>
        </div>

        {/* Actions */}
        <div className="mt-4 space-y-2">
          {onTrack && (
            <button onClick={onTrack} className="w-full bg-slate-900 text-white font-bold text-sm py-3 rounded-xl hover:bg-amber-700 transition-colors">
              Track Order
            </button>
          )}
          {onClose && (
            <button onClick={onClose} className="w-full bg-white text-slate-700 font-semibold text-sm py-3 rounded-xl border border-slate-200 hover:bg-slate-50 transition-colors">
              Back to Menu
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
