import { useNavigate } from 'react-router-dom';
import { useShop } from '../../hooks/useShop';
import { ExternalLink, Clock, Check, X, ShoppingBag, Coffee } from 'lucide-react';

export default function ShopOrders() {
  const navigate = useNavigate();
  const { orders } = useShop();

  const statusIcon = (status: string) => {
    switch (status) {
      case 'confirmed': return <Check className="w-4 h-4 text-emerald-500" />;
      case 'pending': return <Clock className="w-4 h-4 text-amber-500" />;
      case 'failed': return <X className="w-4 h-4 text-red-500" />;
      default: return null;
    }
  };

  const statusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'pending': return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'failed': return 'bg-red-50 text-red-700 border-red-200';
      default: return 'bg-slate-50 text-slate-700 border-slate-200';
    }
  };

  return (
    <div className="bg-white min-h-screen">
      <div className="max-w-lg mx-auto px-4 sm:px-6 py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900">Order History</h1>
            <p className="text-sm text-slate-400">{orders.length} orders</p>
          </div>
          <button onClick={() => navigate('/shop')} className="btn-primary !px-4 !text-sm flex items-center gap-1.5">
            <Coffee className="w-4 h-4" /> New Order
          </button>
        </div>

        {orders.length === 0 ? (
          <div className="card p-8 text-center">
            <ShoppingBag className="w-10 h-10 text-slate-300 mx-auto mb-3" />
            <p className="text-sm text-slate-500 mb-4">No orders yet</p>
            <button onClick={() => navigate('/shop')} className="btn-primary">Browse Menu</button>
          </div>
        ) : (
          <div className="space-y-3">
            {orders.map(order => (
              <div key={order.id} className="card p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    {statusIcon(order.status)}
                    <span className="font-mono text-xs text-slate-500">{order.id}</span>
                  </div>
                  <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${statusColor(order.status)}`}>
                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                  </span>
                </div>

                <div className="space-y-1.5 mb-3">
                  {order.items.map(item => (
                    <div key={item.product.id} className="flex items-center gap-2">
                      <img src={item.product.image} alt={item.product.name} className="w-8 h-8 rounded-lg object-cover" />
                      <span className="text-xs text-slate-700 flex-1 truncate">{item.product.name}</span>
                      <span className="text-xs text-slate-400">×{item.quantity}</span>
                      <span className="text-xs font-semibold">${(item.product.price * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                </div>

                <div className="border-t border-slate-100 pt-2 flex items-center justify-between">
                  <span className="text-xs text-slate-400">
                    {new Date(order.timestamp).toLocaleString()}
                  </span>
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-extrabold text-slate-900">${order.total.toFixed(2)} USDC</span>
                    {order.txHash && (
                      <a href={`https://testnet.arcscan.app/tx/${order.txHash}`} target="_blank" rel="noreferrer"
                        className="text-blue-500 hover:text-blue-700">
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
