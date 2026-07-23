import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useShop } from '../../hooks/useShop';
import { ShoppingBag, Plus, Minus, Search, ShoppingCart, ChevronLeft, ChevronRight, X } from 'lucide-react';

function ProductCard({ product, cartItem, onAdd, onRemove }: any) {
  return (
    <div className="flex-shrink-0 w-48 sm:w-56 group">
      <div className="relative overflow-hidden rounded-2xl bg-white shadow-sm border border-slate-100 hover:shadow-lg hover:border-slate-200 transition-all duration-300 hover:-translate-y-1">
        <div className="aspect-square overflow-hidden bg-slate-50">
          <img src={product.image} alt={product.name} loading="lazy"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
        </div>
        <div className="p-3">
          <h3 className="text-sm font-bold text-slate-900 leading-tight mb-1">{product.name}</h3>
          <p className="text-[11px] text-slate-400 leading-snug mb-2.5 line-clamp-2">{product.description}</p>
          <div className="flex items-center justify-between">
            <span className="text-base font-extrabold text-red-600">${product.price.toFixed(2)}</span>
            {cartItem ? (
              <div className="flex items-center gap-1">
                <button onClick={() => cartItem.quantity <= 1 ? onRemove(product.id) : null}
                  className="w-7 h-7 rounded-lg bg-slate-100 flex items-center justify-center hover:bg-red-50">
                  <Minus className="w-3 h-3 text-slate-600" />
                </button>
                <span className="text-sm font-bold w-6 text-center">{cartItem.quantity}</span>
                <button onClick={() => onAdd(product)}
                  className="w-7 h-7 rounded-lg bg-amber-600 flex items-center justify-center hover:bg-amber-700">
                  <Plus className="w-3 h-3 text-white" />
                </button>
              </div>
            ) : (
              <button onClick={() => onAdd(product)}
                className="w-8 h-8 rounded-lg bg-slate-900 flex items-center justify-center hover:bg-amber-700 transition-colors">
                <Plus className="w-4 h-4 text-white" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function CategorySection({ category, products, cart, onAdd, onRemove }: any) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const scroll = (dir: 'left' | 'right') => {
    scrollRef.current?.scrollBy({ left: dir === 'left' ? -300 : 300, behavior: 'smooth' });
  };

  return (
    <div className="mb-10">
      <div className="bg-slate-50 rounded-2xl p-5 mb-4">
        <h2 className="text-2xl font-extrabold text-slate-900 mb-1">{category}</h2>
        <p className="text-sm text-slate-500">{products.length} items available</p>
      </div>
      <div className="relative group/scroll">
        <button onClick={() => scroll('left')}
          className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-white/90 backdrop-blur rounded-full shadow-lg flex items-center justify-center opacity-0 group-hover/scroll:opacity-100 transition-opacity -ml-2 hover:bg-white">
          <ChevronLeft className="w-5 h-5 text-slate-700" />
        </button>
        <button onClick={() => scroll('right')}
          className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-white/90 backdrop-blur rounded-full shadow-lg flex items-center justify-center opacity-0 group-hover/scroll:opacity-100 transition-opacity -mr-2 hover:bg-white">
          <ChevronRight className="w-5 h-5 text-slate-700" />
        </button>
        <div ref={scrollRef} className="flex gap-4 overflow-x-auto scroll-hide pb-2">
          {products.map((product: any) => (
            <ProductCard key={product.id} product={product}
              cartItem={cart.find((c: any) => c.product.id === product.id)}
              onAdd={onAdd} onRemove={onRemove} />
          ))}
        </div>
      </div>
    </div>
  );
}

import { useRef } from 'react';

export default function ShopMenu() {
  const navigate = useNavigate();
  const { products, cart, cartTotal, cartCount, addToCart, removeFromCart } = useShop();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [showCart, setShowCart] = useState(false);

  const categoryOrder = ['Hot Coffee', 'Cold Coffee', 'Tea', 'Juice', 'Burgers', 'Chicken', 'Pizza', 'Pho & Noodles', 'Rice', 'Desserts', 'Drinks'];
  const grouped = categoryOrder
    .map(cat => ({
      category: cat,
      products: products.filter(p => p.category === cat && (
        !searchQuery || p.name.toLowerCase().includes(searchQuery.toLowerCase())
      ))
    }))
    .filter(g => g.products.length > 0);

  return (
    <div className="bg-white min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        {/* Header with Cart in top right */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <img src="/logo.png" alt="Coffee House" className="w-10 h-10 rounded-xl object-cover shadow-md" />
            <div>
              <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">COFFEE HOUSE</h1>
              <p className="text-[10px] text-slate-400 uppercase tracking-[0.2em]">The Coffee of the World</p>
            </div>
          </div>

          {/* Cart button - TOP RIGHT */}
          <button onClick={() => setShowCart(!showCart)}
            className="relative flex items-center gap-2 px-4 py-2.5 bg-slate-900 text-white rounded-xl hover:bg-slate-800 transition-colors">
            <ShoppingCart className="w-4 h-4" />
            <span className="text-sm font-semibold">Cart</span>
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </button>
        </div>

        {/* Cart Dropdown */}
        {showCart && cartCount > 0 && (
          <div className="fixed inset-0 bg-black/30 z-40" onClick={() => setShowCart(false)}>
            <div className="absolute top-20 right-4 sm:right-8 w-80 bg-white rounded-2xl shadow-2xl border border-slate-200 z-50 overflow-hidden" onClick={e => e.stopPropagation()}>
              <div className="p-4 border-b border-slate-100 flex items-center justify-between">
                <h3 className="text-sm font-bold text-slate-900">Your Cart ({cartCount})</h3>
                <button onClick={() => setShowCart(false)}><X className="w-4 h-4 text-slate-400" /></button>
              </div>
              <div className="p-4 space-y-3 max-h-60 overflow-y-auto scroll-hide">
                {cart.map(item => (
                  <div key={item.product.id} className="flex items-center gap-3">
                    <img src={item.product.image} alt="" className="w-10 h-10 rounded-lg object-cover" />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-slate-900 truncate">{item.product.name}</p>
                      <p className="text-[11px] text-slate-400">${item.product.price.toFixed(2)} x {item.quantity}</p>
                    </div>
                    <span className="text-xs font-bold">${(item.product.price * item.quantity).toFixed(2)}</span>
                    <button onClick={() => removeFromCart(item.product.id)} className="text-slate-300 hover:text-red-500">
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
              <div className="p-4 border-t border-slate-100">
                <div className="flex justify-between mb-3">
                  <span className="text-sm font-medium text-slate-600">Total</span>
                  <span className="text-lg font-extrabold text-slate-900">${cartTotal.toFixed(2)} USDC</span>
                </div>
                <button onClick={() => { setShowCart(false); navigate('/shop/delivery'); }} className="btn-primary w-full">
                  Checkout
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Search */}
        <div className="relative mb-6">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search coffee, food, drinks..." className="pl-12 w-full h-12 rounded-2xl border-slate-200 shadow-sm" />
        </div>

        {/* Category Sections */}
        {grouped.map(({ category, products: prods }) => (
          <CategorySection key={category} category={category} products={prods}
            cart={cart} onAdd={addToCart} onRemove={removeFromCart} />
        ))}

        {grouped.length === 0 && (
          <div className="text-center py-20">
            <ShoppingBag className="w-16 h-16 text-slate-200 mx-auto mb-4" />
            <p className="text-lg font-semibold text-slate-400">No items found</p>
          </div>
        )}

        {/* Mobile Cart Bar */}
        {cartCount > 0 && !showCart && (
          <div className="fixed bottom-0 left-0 right-0 lg:hidden z-30 p-3 bg-white border-t border-slate-200 shadow-lg">
            <button onClick={() => navigate('/shop/delivery')}
              className="w-full bg-slate-900 text-white h-12 rounded-xl flex items-center justify-between px-5 font-bold text-sm">
              <span className="flex items-center gap-2"><ShoppingCart className="w-4 h-4" /> {cartCount} items</span>
              <span>${cartTotal.toFixed(2)} - Checkout</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
