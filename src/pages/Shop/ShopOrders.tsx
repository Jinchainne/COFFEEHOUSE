import { useNavigate } from 'react-router-dom';
import { useShop } from '../../hooks/useShop';
import { ExternalLink, Clock, Check, X, ShoppingBag, Coffee, MapPin, Truck, Package, ChefHat } from 'lucide-react';

export default function ShopOrders() {
  const navigate = useNavigate();
  const { orders } = useShop();

  const statusConfig: Record<string, { icon: any; color: string; bg: string; label: string }> = {
    confirmed: { icon: Check, color: 'text-emerald-500', bg: 'bg-emerald-50 border-emerald-200', label: 'Confirmed' },
    pending: { icon: Clock, color: 'text-amber-500', bg: 'bg-amber-50 border-amber-200', label: 'Pending' },
    preparing: { icon: ChefHat, color: 'text-blue-500', bg: 'bg-blue-50 border-blue-200', label: 'Preparing' },
    shipping: { icon: Truck, color: 'text-purple-500', bg: 'bg-purple-50 border-purple-200', label: 'On the Way' },
    delivered: { icon: Package, color: 'text-emerald-600', bg: 'bg-emerald-50 border-emerald-200', label: 'Delivered' },
    failed: { icon: X, color: 'text-red-500', bg: 'bg-red-50 border-red-200', label: 'Failed' },
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
            {orders.map(order => {
              const sc = statusConfig[order.status] || statusConfig.pending;
              const StatusIcon = sc.icon;
              return (
                <div key={order.id} className="card p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <StatusIcon className={`w-4 h-4 ${sc.color}`} />
                      <span className="font-mono text-xs text-slate-500">{order.id}</span>
                    </div>
                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${sc.bg} ${sc.color}`}>
                      {sc.label}
                    </span>
                  </div>

                  {/* Items */}
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

                  {/* Delivery address */}
                  {order.delivery && (
                    <div className="flex items-start gap-2 mb-3 p-2 bg-slate-50 rounded-lg">
                      <MapPin className="w-3 h-3 text-blue-500 mt-0.5 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-[11px] text-slate-600 truncate">{order.delivery.address}</p>
                        {order.delivery.note && <p className="text-[10px] text-slate-400">📝 {order.delivery.note}</p>}
                      </div>
                    </div>
                  )}

                  {/* Delivery progress */}
                  {order.delivery && order.status !== 'failed' && (
                    <div className="flex items-center gap-1 mb-3">
                      {['confirmed', 'preparing', 'shipping', 'delivered'].map((s, i) => {
                        const steps = ['confirmed', 'preparing', 'shipping', 'delivered'];
                        const currentIdx = steps.indexOf(order.status);
                        const active = i <= currentIdx;
                        return (
                          <div key={s} className="flex-1 flex flex-col items-center">
                            <div className={`h-1.5 w-full rounded-full ${active ? 'bg-emerald-400' : 'bg-slate-200'} ${i > 0 ? '' : ''}`} />
                            <span className={`text-[9px] mt-0.5 ${active ? 'text-emerald-600 font-bold' : 'text-slate-400'}`}>
                              {s === 'confirmed' ? '✓' : s === 'preparing' ? '👨‍🍳' : s === 'shipping' ? '🛵' : '📦'}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  )}

                  <div className="border-t border-slate-100 pt-2 flex items-center justify-between">
                    <span className="text-xs text-slate-400">
                      {new Date(order.timestamp).toLocaleString()}
                    </span>
                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <span className="text-sm font-extrabold text-slate-900">${order.total.toFixed(2)} USDC</span>
                        {order.shippingFee > 0 && (
                          <p className="text-[10px] text-slate-400">incl. ${order.shippingFee.toFixed(2)} shipping</p>
                        )}
                      </div>
                      {order.txHash && (
                        <a href={`https://testnet.arcscan.app/tx/${order.txHash}`} target="_blank" rel="noreferrer"
                          className="text-blue-500 hover:text-blue-700">
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
