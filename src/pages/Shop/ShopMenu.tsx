import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useShop } from '../../hooks/useShop';
import { ShoppingBag, Plus, Minus, Trash2, Search, ShoppingCart, Store } from 'lucide-react';

export default function ShopMenu() {
  const navigate = useNavigate();
  const { products, categories, brands, cart, cartTotal, cartCount, addToCart, removeFromCart, updateQuantity } = useShop();
  const [activeCategory, setActiveCategory] = useState('All');
  const [activeBrand, setActiveBrand] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [showCart, setShowCart] = useState(false);

  const filtered = products.filter(p => {
    const matchCategory = activeCategory === 'All' || p.category === activeCategory;
    const matchBrand = activeBrand === 'All' || p.brand === activeBrand;
    const matchSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || p.brand.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCategory && matchBrand && matchSearch;
  });

  return (
    <div className="bg-white min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900">ArcPay Shop</h1>
            <p className="text-sm text-slate-400">{products.length} items · Pay with USDC on Arc Testnet</p>
          </div>
          <button onClick={() => setShowCart(!showCart)} className="relative btn-primary !px-4">
            <ShoppingCart className="w-5 h-5" />
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </button>
        </div>

        <div className="flex gap-6">
          {/* Main Content */}
          <div className="flex-1 min-w-0">
            {/* Search */}
            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search menu or brand..."
                className="pl-10 w-full"
              />
            </div>

            {/* Brand Filter */}
            <div className="flex gap-2 mb-3 overflow-x-auto pb-1">
              <button
                onClick={() => setActiveBrand('All')}
                className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                  activeBrand === 'All'
                    ? 'bg-slate-900 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                <Store className="w-3 h-3" /> All Brands
              </button>
              {brands.map(brand => (
                <button
                  key={brand}
                  onClick={() => setActiveBrand(brand)}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                    activeBrand === brand
                      ? 'bg-slate-900 text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {brand}
                </button>
              ))}
            </div>

            {/* Category Filter */}
            <div className="flex gap-2 mb-6 overflow-x-auto pb-1">
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-all ${
                    activeCategory === cat
                      ? 'bg-blue-600 text-white shadow-md shadow-blue-200'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Results count */}
            <p className="text-xs text-slate-400 mb-4">{filtered.length} items</p>

            {/* Product Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {filtered.map(product => {
                const cartItem = cart.find(c => c.product.id === product.id);
                return (
                  <div key={product.id} className="card overflow-hidden group hover:shadow-lg transition-shadow">
                    <div className="aspect-square overflow-hidden bg-slate-100 relative">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                        loading="lazy"
                      />
                      <span className="absolute top-2 left-2 bg-white/90 backdrop-blur text-[10px] font-bold text-slate-700 px-2 py-0.5 rounded-full">
                        {product.brand}
                      </span>
                    </div>
                    <div className="p-3">
                      <h3 className="text-sm font-bold text-slate-900 truncate">{product.name}</h3>
                      <p className="text-[11px] text-slate-400 mb-2 line-clamp-1">{product.description}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-extrabold text-blue-600">${product.price.toFixed(2)}</span>
                        {cartItem ? (
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => updateQuantity(product.id, cartItem.quantity - 1)}
                              className="w-6 h-6 rounded-lg bg-slate-100 flex items-center justify-center hover:bg-slate-200"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="text-xs font-bold w-5 text-center">{cartItem.quantity}</span>
                            <button
                              onClick={() => addToCart(product)}
                              className="w-6 h-6 rounded-lg bg-blue-100 flex items-center justify-center hover:bg-blue-200"
                            >
                              <Plus className="w-3 h-3 text-blue-600" />
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => addToCart(product)}
                            className="w-7 h-7 rounded-lg bg-blue-600 flex items-center justify-center hover:bg-blue-700 transition-colors"
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
              <div className="text-center py-12 text-slate-400">
                <ShoppingBag className="w-10 h-10 mx-auto mb-2 opacity-40" />
                <p className="text-sm">No items found</p>
              </div>
            )}
          </div>

          {/* Cart Sidebar */}
          {showCart && (
            <div className="w-80 flex-shrink-0 hidden lg:block">
              <div className="card p-4 sticky top-20">
                <h3 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2">
                  <ShoppingCart className="w-4 h-4" /> Your Order ({cartCount})
                </h3>

                {cart.length === 0 ? (
                  <p className="text-sm text-slate-400 text-center py-8">Cart is empty</p>
                ) : (
                  <>
                    <div className="space-y-3 max-h-80 overflow-y-auto mb-4">
                      {cart.map(item => (
                        <div key={item.product.id} className="flex items-center gap-3">
                          <img src={item.product.image} alt={item.product.name} className="w-10 h-10 rounded-lg object-cover" />
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-semibold text-slate-900 truncate">{item.product.name}</p>
                            <p className="text-[11px] text-slate-400">${item.product.price.toFixed(2)} × {item.quantity}</p>
                          </div>
                          <span className="text-xs font-bold text-slate-900">${(item.product.price * item.quantity).toFixed(2)}</span>
                          <button onClick={() => removeFromCart(item.product.id)} className="text-slate-300 hover:text-red-500">
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>

                    <div className="border-t border-slate-100 pt-3 mb-4">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium text-slate-600">Total</span>
                        <span className="text-lg font-extrabold text-slate-900">${cartTotal.toFixed(2)} USDC</span>
                      </div>
                    </div>

                    <button
                      onClick={() => navigate('/shop/checkout')}
                      className="btn-primary w-full"
                    >
                      Checkout
                    </button>
                  </>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Mobile Cart Button */}
        {cartCount > 0 && (
          <div className="fixed bottom-6 left-4 right-4 lg:hidden z-40">
            <button
              onClick={() => navigate('/shop/checkout')}
              className="w-full btn-primary flex items-center justify-between !rounded-2xl shadow-xl"
            >
              <span className="flex items-center gap-2">
                <ShoppingCart className="w-5 h-5" />
                View Cart ({cartCount})
              </span>
              <span className="font-extrabold">${cartTotal.toFixed(2)} USDC</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
