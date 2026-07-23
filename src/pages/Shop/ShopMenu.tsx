import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useShop } from '../../hooks/useShop';
import { ShoppingBag, Plus, Minus, Trash2, Search, ShoppingCart, Coffee, Utensils, Star, Zap } from 'lucide-react';

const CATEGORY_ICONS: Record<string, string> = {
  'All': '🍽️', 'Hot Coffee': '☕', 'Cold Coffee': '🧊', 'Tea': '🍵', 'Juice': '🧃',
  'Refreshers': '🍹', 'Burgers': '🍔', 'Chicken': '🍗', 'Sandwiches': '🥪', 'Pizza': '🍕',
  'Pasta': '🍝', 'Sides': '🍟', 'Breakfast': '🥞', 'Bakery': '🥐', 'Desserts': '🍰',
  'Drinks': '🥤', 'Phở & Bún': '🍜', 'Cơm': '🍚', 'Lẩu': '🫕', 'Đồ Uống Việt': '☕',
  'Tráng Miệng': '🍮',
};

export default function ShopMenu() {
  const navigate = useNavigate();
  const { products, categories, cart, cartTotal, cartCount, addToCart, removeFromCart, updateQuantity } = useShop();
  const [showCart] = useState(true);
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  

  const filtered = products.filter(p => {
    const matchCategory = activeCategory === 'All' || p.category === activeCategory;
    const matchSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || p.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCategory && matchSearch;
  });

  return (
    <div className="bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        {/* ═══════ HERO BANNER ═══════ */}
        <div className="hero-banner mb-8">
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                <Coffee className="w-5 h-5 text-white" />
              </div>
              <span className="text-white/80 text-sm font-medium">ArcPay Shop</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white mb-2 leading-tight">
              Good Food,<br />
              <span className="text-cyan-300">Fast Crypto</span> Payment
            </h1>
            <p className="text-blue-200 text-sm mb-5 max-w-md">
              {products.length} delicious items from world-famous brands. Pay instantly with USDC on Arc Testnet — zero fees, sub-second finality.
            </p>
            <div className="flex flex-wrap gap-3">
              <div className="flex items-center gap-2 bg-white/15 backdrop-blur rounded-full px-4 py-2">
                <Zap className="w-4 h-4 text-cyan-300" />
                <span className="text-white text-xs font-medium">Instant Payment</span>
              </div>
              <div className="flex items-center gap-2 bg-white/15 backdrop-blur rounded-full px-4 py-2">
                <Star className="w-4 h-4 text-amber-300" />
                <span className="text-white text-xs font-medium">{products.length}+ Items</span>
              </div>
              <div className="flex items-center gap-2 bg-white/15 backdrop-blur rounded-full px-4 py-2">
                <Utensils className="w-4 h-4 text-emerald-300" />
                <span className="text-white text-xs font-medium">Delivery Available</span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex gap-6">
          {/* ═══════ MAIN CONTENT ═══════ */}
          <div className="flex-1 min-w-0">
            {/* Search */}
            <div className="relative mb-5">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search for food, drinks, desserts..."
                className="pl-12 w-full h-12 rounded-2xl border-slate-200 shadow-sm text-sm"
              />
            </div>

            {/* Categories */}
            <div className="flex gap-2 mb-6 overflow-x-auto scroll-hide pb-1">
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`category-pill flex items-center gap-1.5 ${activeCategory === cat ? 'active' : ''}`}
                >
                  <span>{CATEGORY_ICONS[cat] || '🍽️'}</span>
                  {cat}
                </button>
              ))}
            </div>

            {/* Results */}
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm text-slate-500">
                <span className="font-bold text-slate-900">{filtered.length}</span> items
                {activeCategory !== 'All' && <span> in <span className="font-semibold text-blue-600">{activeCategory}</span></span>}
              </p>
            </div>

            {/* Product Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5">
              {filtered.map((product, idx) => {
                const cartItem = cart.find(c => c.product.id === product.id);
                return (
                  <div
                    key={product.id}
                    className="product-card animate-slide-up"
                    style={{ animationDelay: `${Math.min(idx * 30, 300)}ms`, animationFillMode: 'backwards' }}
                  >
                    <div className="product-img">
                      <img src={product.image} alt={product.name} loading="lazy" />
                    </div>
                    <div className="p-3.5">
                      <h3 className="text-sm font-bold text-slate-900 leading-tight">{product.name}</h3>
                      <p className="text-[11px] text-slate-400 mb-3 line-clamp-2 leading-snug">{product.description}</p>
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="text-base font-extrabold gradient-text">${product.price.toFixed(2)}</span>
                        </div>
                        {cartItem ? (
                          <div className="flex items-center gap-1.5 bg-slate-50 rounded-xl px-1 py-0.5">
                            <button
                              onClick={() => updateQuantity(product.id, cartItem.quantity - 1)}
                              className="w-7 h-7 rounded-lg bg-white flex items-center justify-center hover:bg-red-50 transition-colors shadow-sm"
                            >
                              <Minus className="w-3 h-3 text-slate-600" />
                            </button>
                            <span className="text-sm font-bold w-6 text-center text-slate-900">{cartItem.quantity}</span>
                            <button
                              onClick={() => addToCart(product)}
                              className="w-7 h-7 rounded-lg bg-blue-500 flex items-center justify-center hover:bg-blue-600 transition-colors shadow-sm"
                            >
                              <Plus className="w-3 h-3 text-white" />
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => addToCart(product)}
                            className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center hover:from-blue-600 hover:to-blue-700 transition-all shadow-md shadow-blue-200 hover:shadow-lg hover:scale-105"
                          >
                            <Plus className="w-4 h-4 text-white" />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {filtered.length === 0 && (
              <div className="text-center py-16">
                <ShoppingBag className="w-16 h-16 text-slate-200 mx-auto mb-4" />
                <p className="text-lg font-semibold text-slate-400">No items found</p>
                <p className="text-sm text-slate-300 mt-1">Try a different search or category</p>
              </div>
            )}
          </div>

          {/* ═══════ CART SIDEBAR ═══════ */}
          {showCart && (
            <div className="w-80 flex-shrink-0 hidden lg:block animate-slide-up">
              <div className="card p-5 sticky top-20 border border-slate-100">
                <h3 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2">
                  <ShoppingCart className="w-4 h-4 text-blue-500" /> Your Order
                  <span className="ml-auto bg-blue-100 text-blue-700 text-xs font-bold px-2 py-0.5 rounded-full">{cartCount}</span>
                </h3>

                {cart.length === 0 ? (
                  <div className="text-center py-8">
                    <ShoppingCart className="w-10 h-10 text-slate-200 mx-auto mb-2" />
                    <p className="text-sm text-slate-400">Your cart is empty</p>
                  </div>
                ) : (
                  <>
                    <div className="space-y-3 max-h-80 overflow-y-auto mb-4 scroll-hide">
                      {cart.map(item => (
                        <div key={item.product.id} className="flex items-center gap-3 p-2 rounded-xl hover:bg-slate-50 transition-colors">
                          <img src={item.product.image} alt={item.product.name} className="w-11 h-11 rounded-xl object-cover" />
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-semibold text-slate-900 truncate">{item.product.name}</p>
                            <p className="text-[11px] text-slate-400">${item.product.price.toFixed(2)} × {item.quantity}</p>
                          </div>
                          <span className="text-xs font-bold text-slate-900">${(item.product.price * item.quantity).toFixed(2)}</span>
                          <button onClick={() => removeFromCart(item.product.id)} className="text-slate-300 hover:text-red-500 transition-colors">
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>

                    <div className="border-t border-slate-100 pt-4 mb-4">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium text-slate-600">Total</span>
                        <span className="text-xl font-extrabold gradient-text">${cartTotal.toFixed(2)}</span>
                      </div>
                      <p className="text-[11px] text-slate-400 text-right">USDC on Arc Testnet</p>
                    </div>

                    <button onClick={() => navigate('/shop/delivery')} className="btn-primary w-full h-12 text-base">
                      Checkout →
                    </button>
                  </>
                )}
              </div>
            </div>
          )}
        </div>

        {/* ═══════ MOBILE CART BAR ═══════ */}
        {cartCount > 0 && (
          <div className="fixed bottom-0 left-0 right-0 lg:hidden z-40 p-4 bg-gradient-to-t from-white via-white to-transparent pt-8">
            <button
              onClick={() => navigate('/shop/delivery')}
              className="w-full btn-primary h-14 text-base !rounded-2xl shadow-xl shadow-blue-200/50"
            >
              <ShoppingCart className="w-5 h-5" />
              <span>View Cart ({cartCount})</span>
              <span className="ml-auto font-extrabold">${cartTotal.toFixed(2)}</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
