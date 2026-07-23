import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';

export interface Product {
  id: string;
  name: string;
  price: number; // USDC
  category: string;
  image: string;
  description: string;
  brand: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Order {
  id: string;
  items: CartItem[];
  total: number;
  status: 'pending' | 'confirmed' | 'failed';
  txHash?: string;
  timestamp: number;
  merchantAddress: string;
}

export const MERCHANT_ADDRESS = '0x363700d10ca9c4809ad7034f5b21650a9a5e34bd';

// Real product data from global cafe & fast food chains
const PRODUCTS: Product[] = [
  // ═══════════════════ STARBUCKS ═══════════════════
  { id: 'sb1', name: 'Caffè Latte', price: 5.75, category: 'Hot Coffee', brand: 'Starbucks', image: 'https://images.unsplash.com/photo-1561882468-958319edf79c?w=400&h=400&fit=crop', description: 'Rich espresso topped with steamed milk and a light layer of foam' },
  { id: 'sb2', name: 'Cappuccino', price: 5.45, category: 'Hot Coffee', brand: 'Starbucks', image: 'https://images.unsplash.com/photo-1572442388796-11668a67e53d?w=400&h=400&fit=crop', description: 'Espresso with steamed milk and a deep layer of foam' },
  { id: 'sb3', name: 'Caramel Macchiato', price: 6.25, category: 'Hot Coffee', brand: 'Starbucks', image: 'https://images.unsplash.com/photo-1485808191679-5f86510681a2?w=400&h=400&fit=crop', description: 'Freshly steamed milk with vanilla-flavored syrup and espresso' },
  { id: 'sb4', name: 'Caffè Mocha', price: 5.95, category: 'Hot Coffee', brand: 'Starbucks', image: 'https://images.unsplash.com/photo-1578314675249-a6910f80cc4e?w=400&h=400&fit=crop', description: 'Espresso with bittersweet mocha sauce and steamed milk' },
  { id: 'sb5', name: 'Flat White', price: 5.95, category: 'Hot Coffee', brand: 'Starbucks', image: 'https://images.unsplash.com/photo-1577968897966-3d4325b36b61?w=400&h=400&fit=crop', description: 'Smooth ristretto shots with velvety steamed milk' },
  { id: 'sb6', name: 'Blonde Vanilla Latte', price: 6.05, category: 'Hot Coffee', brand: 'Starbucks', image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefda?w=400&h=400&fit=crop', description: 'Blonde espresso with vanilla syrup and steamed milk' },
  { id: 'sb7', name: 'Iced Brown Sugar Oatmilk Shaken Espresso', price: 6.75, category: 'Cold Coffee', brand: 'Starbucks', image: 'https://images.unsplash.com/photo-1517701604599-bb29b565090c?w=400&h=400&fit=crop', description: 'Blonde espresso with brown sugar and cinnamon, shaken with oatmilk' },
  { id: 'sb8', name: 'Cold Brew', price: 4.75, category: 'Cold Coffee', brand: 'Starbucks', image: 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=400&h=400&fit=crop', description: 'Slow-steeped, super-smooth cold coffee served over ice' },
  { id: 'sb9', name: 'Iced Caramel Macchiato', price: 6.45, category: 'Cold Coffee', brand: 'Starbucks', image: 'https://images.unsplash.com/photo-1511920170033-f8396924c348?w=400&h=400&fit=crop', description: 'Espresso poured over cold milk with vanilla and caramel drizzle' },
  { id: 'sb10', name: 'Mocha Frappuccino', price: 5.95, category: 'Cold Coffee', brand: 'Starbucks', image: 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=400&h=400&fit=crop', description: 'Coffee blended with mocha sauce, milk and ice' },
  { id: 'sb11', name: 'Matcha Latte', price: 5.75, category: 'Tea', brand: 'Starbucks', image: 'https://images.unsplash.com/photo-1536256263959-770b48d82b0a?w=400&h=400&fit=crop', description: 'Smooth and creamy matcha sweetened just right and served with milk' },
  { id: 'sb12', name: 'Chai Latte', price: 5.45, category: 'Tea', brand: 'Starbucks', image: 'https://images.unsplash.com/photo-1558160074-4d7d8bdf4256?w=400&h=400&fit=crop', description: 'Black tea infused with cinnamon, clove and other warming spices' },
  { id: 'sb13', name: 'Pineapple Passionfruit Refresher', price: 5.25, category: 'Refreshers', brand: 'Starbucks', image: 'https://images.unsplash.com/photo-1621263764928-df1444c5e859?w=400&h=400&fit=crop', description: 'Tropical flavors of pineapple and passionfruit combined with coconutmilk' },
  { id: 'sb14', name: 'Butter Croissant', price: 3.75, category: 'Bakery', brand: 'Starbucks', image: 'https://images.unsplash.com/photo-1555507036-ab1f4038024a?w=400&h=400&fit=crop', description: 'Buttery, flaky, golden croissant baked fresh daily' },
  { id: 'sb15', name: 'Chocolate Chip Cookie', price: 3.25, category: 'Bakery', brand: 'Starbucks', image: 'https://images.unsplash.com/photo-1499636136210-6f4ee915583e?w=400&h=400&fit=crop', description: 'Classic cookie loaded with semi-sweet chocolate chips' },

  // ═══════════════════ McDONALD'S ═══════════════════
  { id: 'mc1', name: 'Big Mac', price: 5.99, category: 'Burgers', brand: "McDonald's", image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&h=400&fit=crop', description: 'Two all-beef patties, special sauce, lettuce, cheese, pickles, onions on a sesame seed bun' },
  { id: 'mc2', name: 'Quarter Pounder with Cheese', price: 6.39, category: 'Burgers', brand: "McDonald's", image: 'https://images.unsplash.com/photo-1553979459-d2229ba7433b?w=400&h=400&fit=crop', description: 'Quarter pound of 100% fresh beef with cheese, onions, pickles, ketchup and mustard' },
  { id: 'mc3', name: 'McChicken', price: 3.89, category: 'Burgers', brand: "McDonald's", image: 'https://images.unsplash.com/photo-1606755962773-d324e0a13086?w=400&h=400&fit=crop', description: 'Crispy chicken patty with lettuce and mayo on a toasted bun' },
  { id: 'mc4', name: 'Chicken McNuggets (10pc)', price: 5.99, category: 'Chicken', brand: "McDonald's", image: 'https://images.unsplash.com/photo-1562967914-608f82629710?w=400&h=400&fit=crop', description: 'Tender white meat chicken, seasoned and breaded to perfection' },
  { id: 'mc5', name: 'World Famous Fries (Large)', price: 3.89, category: 'Sides', brand: "McDonald's", image: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=400&h=400&fit=crop', description: 'Golden, crispy fries made from premium potatoes' },
  { id: 'mc6', name: 'Egg McMuffin', price: 4.39, category: 'Breakfast', brand: "McDonald's", image: 'https://images.unsplash.com/photo-1525351484163-7529414344d8?w=400&h=400&fit=crop', description: 'Egg, Canadian bacon and American cheese on an English muffin' },
  { id: 'mc7', name: 'Hotcakes', price: 4.19, category: 'Breakfast', brand: "McDonald's", image: 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=400&h=400&fit=crop', description: 'Three golden brown, fluffy hotcakes served with butter and syrup' },
  { id: 'mc8', name: 'McFlurry with OREO', price: 4.39, category: 'Desserts', brand: "McDonald's", image: 'https://images.unsplash.com/photo-1497034825429-c343d7c6a68f?w=400&h=400&fit=crop', description: 'Vanilla soft serve blended with OREO cookie pieces' },
  { id: 'mc9', name: 'Apple Pie', price: 1.99, category: 'Desserts', brand: "McDonald's", image: 'https://images.unsplash.com/photo-1562376552-0d160a2f238d?w=400&h=400&fit=crop', description: 'Hot, crispy apple pie with a flaky crust and warm apple filling' },
  { id: 'mc10', name: 'Coca-Cola (Large)', price: 2.19, category: 'Drinks', brand: "McDonald's", image: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=400&h=400&fit=crop', description: 'Ice-cold Coca-Cola fountain drink' },
  { id: 'mc11', name: 'McCafé Iced Coffee', price: 2.99, category: 'Cold Coffee', brand: "McDonald's", image: 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=400&h=400&fit=crop', description: 'Premium roast coffee served over ice with cream and sugar' },
  { id: 'mc12', name: 'Onion Rings', price: 3.29, category: 'Sides', brand: "McDonald's", image: 'https://images.unsplash.com/photo-1639024471283-03518883512d?w=400&h=400&fit=crop', description: 'Crispy battered onion rings, golden fried' },

  // ═══════════════════ DUNKIN' ═══════════════════
  { id: 'dk1', name: 'Original Blend Coffee', price: 2.59, category: 'Hot Coffee', brand: "Dunkin'", image: 'https://images.unsplash.com/photo-1459755417340-5ee3a2572279?w=400&h=400&fit=crop', description: 'Medium roast, smooth and rich signature blend' },
  { id: 'dk2', name: 'Caramel Iced Coffee', price: 3.59, category: 'Cold Coffee', brand: "Dunkin'", image: 'https://images.unsplash.com/photo-1517701604599-bb29b565090c?w=400&h=400&fit=crop', description: 'Iced coffee with caramel swirl and cream' },
  { id: 'dk3', name: 'Butter Pecan Iced Coffee', price: 3.59, category: 'Cold Coffee', brand: "Dunkin'", image: 'https://images.unsplash.com/photo-1511920170033-f8396924c348?w=400&h=400&fit=crop', description: 'Iced coffee with butter pecan flavor swirl' },
  { id: 'dk4', name: 'Matcha Latte', price: 4.59, category: 'Tea', brand: "Dunkin'", image: 'https://images.unsplash.com/photo-1536256263959-770b48d82b0a?w=400&h=400&fit=crop', description: 'Sweetened matcha green tea blended with milk' },
  { id: 'dk5', name: 'Glazed Donut', price: 1.49, category: 'Bakery', brand: "Dunkin'", image: 'https://images.unsplash.com/photo-1551024506-0bccd828d307?w=400&h=400&fit=crop', description: 'Classic yeast donut with sweet glaze' },
  { id: 'dk6', name: 'Chocolate Frosted Donut', price: 1.69, category: 'Bakery', brand: "Dunkin'", image: 'https://images.unsplash.com/photo-1551024506-0bccd828d307?w=400&h=400&fit=crop', description: 'Yeast donut with rich chocolate frosting' },
  { id: 'dk7', name: 'Bacon Egg & Cheese', price: 4.79, category: 'Breakfast', brand: "Dunkin'", image: 'https://images.unsplash.com/photo-1525351484163-7529414344d8?w=400&h=400&fit=crop', description: 'Crispy bacon, egg and American cheese on a croissant' },
  { id: 'dk8', name: 'Blueberry Muffin', price: 2.59, category: 'Bakery', brand: "Dunkin'", image: 'https://images.unsplash.com/photo-1607958996333-41aef7caefaa?w=400&h=400&fit=crop', description: 'Moist muffin packed with wild blueberries' },
  { id: 'dk9', name: 'Hash Browns', price: 1.69, category: 'Sides', brand: "Dunkin'", image: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=400&h=400&fit=crop', description: 'Crispy golden hash brown bites' },

  // ═══════════════════ JOLLIBEE ═══════════════════
  { id: 'jb1', name: 'Chickenjoy (2pc)', price: 7.99, category: 'Chicken', brand: 'Jollibee', image: 'https://images.unsplash.com/photo-1626645738196-c2a7c87a8f58?w=400&h=400&fit=crop', description: 'Crispylicious, juicylicious fried chicken — Filipino-style' },
  { id: 'jb2', name: 'Jolly Spaghetti', price: 5.49, category: 'Pasta', brand: 'Jollibee', image: 'https://images.unsplash.com/photo-1551183053-bf91a1d81141?w=400&h=400&fit=crop', description: 'Sweet-style spaghetti with sliced hotdogs and ground meat' },
  { id: 'jb3', name: 'Yumburger', price: 2.99, category: 'Burgers', brand: 'Jollibee', image: 'https://images.unsplash.com/photo-1553979459-d2229ba7433b?w=400&h=400&fit=crop', description: 'Beefy, cheesy burger with special dressing' },
  { id: 'jb4', name: 'Chickenjoy Bucket (6pc)', price: 17.99, category: 'Chicken', brand: 'Jollibee', image: 'https://images.unsplash.com/photo-1567620832903-9fc6debc209f?w=400&h=400&fit=crop', description: '6 pieces of signature crispy fried chicken' },
  { id: 'jb5', name: 'Palabok Fiesta', price: 6.49, category: 'Pasta', brand: 'Jollibee', image: 'https://images.unsplash.com/photo-1612874742237-6526221588e3?w=400&h=400&fit=crop', description: 'Rice noodles with garlic shrimp sauce, pork, and egg' },
  { id: 'jb6', name: 'Peach Mango Pie', price: 1.99, category: 'Desserts', brand: 'Jollibee', image: 'https://images.unsplash.com/photo-1562376552-0d160a2f238d?w=400&h=400&fit=crop', description: 'Crispy pie filled with real peach and mango chunks' },
  { id: 'jb7', name: 'Jolly Crispy Fries', price: 2.79, category: 'Sides', brand: 'Jollibee', image: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=400&h=400&fit=crop', description: 'Golden crispy fries with a side of gravy' },

  // ═══════════════════ PIZZA HUT ═══════════════════
  { id: 'ph1', name: 'Pepperoni Pizza (Personal)', price: 7.49, category: 'Pizza', brand: 'Pizza Hut', image: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?w=400&h=400&fit=crop', description: 'Classic pepperoni with mozzarella on pan crust' },
  { id: 'ph2', name: 'Margherita Pizza (Personal)', price: 6.99, category: 'Pizza', brand: 'Pizza Hut', image: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=400&h=400&fit=crop', description: 'Fresh mozzarella, basil, and marinara on hand-tossed crust' },
  { id: 'ph3', name: 'Garlic Bread', price: 3.99, category: 'Sides', brand: 'Pizza Hut', image: 'https://images.unsplash.com/photo-1555507036-ab1f4038024a?w=400&h=400&fit=crop', description: 'Warm breadsticks brushed with garlic butter and parmesan' },

  // ═══════════════════ SUBWAY ═══════════════════
  { id: 'sw1', name: 'Italian B.M.T.', price: 7.49, category: 'Sandwiches', brand: 'Subway', image: 'https://images.unsplash.com/photo-1553909489-cd47e0907980?w=400&h=400&fit=crop', description: 'Genoa salami, pepperoni, ham with your choice of fresh veggies' },
  { id: 'sw2', name: 'Turkey Breast Sub', price: 6.99, category: 'Sandwiches', brand: 'Subway', image: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=400&h=400&fit=crop', description: 'Sliced turkey breast on freshly baked bread with veggies' },
  { id: 'sw3', name: 'Chicken Teriyaki Sub', price: 7.99, category: 'Sandwiches', brand: 'Subway', image: 'https://images.unsplash.com/photo-1626700051175-6818013e1d4f?w=400&h=400&fit=crop', description: 'Sweet onion chicken teriyaki with fresh vegetables' },
  { id: 'sw4', name: 'Cookie (Chocolate Chip)', price: 1.29, category: 'Bakery', brand: 'Subway', image: 'https://images.unsplash.com/photo-1499636136210-6f4ee915583e?w=400&h=400&fit=crop', description: 'Soft-baked chocolate chip cookie' },

  // ═══════════════════ SHAKE SHACK ═══════════════════
  { id: 'ss1', name: 'ShackBurger', price: 7.79, category: 'Burgers', brand: 'Shake Shack', image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&h=400&fit=crop', description: 'Angus beef cheeseburger with lettuce, tomato, ShackSauce' },
  { id: 'ss2', name: 'Chicken Shack', price: 7.99, category: 'Chicken', brand: 'Shake Shack', image: 'https://images.unsplash.com/photo-1606755962773-d324e0a13086?w=400&h=400&fit=crop', description: 'Crispy chicken breast with lettuce, pickles, buttermilk herb mayo' },
  { id: 'ss3', name: 'Cheese Fries', price: 4.99, category: 'Sides', brand: 'Shake Shack', image: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=400&h=400&fit=crop', description: 'Crinkle-cut fries topped with cheese sauce' },
  { id: 'ss4', name: 'Vanilla Shake', price: 5.99, category: 'Drinks', brand: 'Shake Shack', image: 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=400&h=400&fit=crop', description: 'Hand-spun vanilla frozen custard milkshake' },
  { id: 'ss5', name: 'Chocolate Shake', price: 5.99, category: 'Drinks', brand: 'Shake Shack', image: 'https://images.unsplash.com/photo-1578314675249-a6910f80cc4e?w=400&h=400&fit=crop', description: 'Hand-spun chocolate frozen custard milkshake' },

  // ═══════════════════ THE COFFEE BEAN ═══════════════════
  { id: 'cb1', name: 'Vanilla Latte', price: 5.75, category: 'Hot Coffee', brand: 'Coffee Bean', image: 'https://images.unsplash.com/photo-1561882468-958319edf79c?w=400&h=400&fit=crop', description: 'Espresso with French vanilla and steamed milk' },
  { id: 'cb2', name: 'Ice Blended Mocha', price: 6.25, category: 'Cold Coffee', brand: 'Coffee Bean', image: 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=400&h=400&fit=crop', description: 'Rich chocolate and coffee blended with ice and milk' },
  { id: 'cb3', name: 'English Breakfast Tea', price: 3.50, category: 'Tea', brand: 'Coffee Bean', image: 'https://images.unsplash.com/photo-1597318181409-cf64d0b5d8a2?w=400&h=400&fit=crop', description: 'Full-bodied black tea blend from Assam, Ceylon and Kenya' },
  { id: 'cb4', name: 'Tiramisu', price: 6.50, category: 'Desserts', brand: 'Coffee Bean', image: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=400&h=400&fit=crop', description: 'Classic Italian dessert with espresso-soaked ladyfingers and mascarpone' },
  { id: 'cb5', name: 'Cinnamon Roll', price: 4.25, category: 'Bakery', brand: 'Coffee Bean', image: 'https://images.unsplash.com/photo-1509365390695-33aee754301f?w=400&h=400&fit=crop', description: 'Warm cinnamon swirl with cream cheese frosting' },

  // ═══════════════════ JUICE & SMOOTHIE BAR ═══════════════════
  { id: 'js1', name: 'Fresh Orange Juice', price: 4.50, category: 'Juice', brand: 'Fresh Bar', image: 'https://images.unsplash.com/photo-1621506289937-a8e4df240d0b?w=400&h=400&fit=crop', description: 'Freshly squeezed oranges, no added sugar' },
  { id: 'js2', name: 'Mango Tropical Smoothie', price: 6.00, category: 'Juice', brand: 'Fresh Bar', image: 'https://images.unsplash.com/photo-1623065422902-30a2d299bbe4?w=400&h=400&fit=crop', description: 'Mango, pineapple, banana blended with coconut water' },
  { id: 'js3', name: 'Berry Antioxidant Blast', price: 6.50, category: 'Juice', brand: 'Fresh Bar', image: 'https://images.unsplash.com/photo-1553530666-ba11a7da3888?w=400&h=400&fit=crop', description: 'Blueberry, strawberry, acai, and pomegranate blend' },
  { id: 'js4', name: 'Green Detox Smoothie', price: 6.50, category: 'Juice', brand: 'Fresh Bar', image: 'https://images.unsplash.com/photo-1610970881699-44a5587cabec?w=400&h=400&fit=crop', description: 'Spinach, kale, apple, ginger, and lemon' },
  { id: 'js5', name: 'Lemon Mint Cooler', price: 4.00, category: 'Juice', brand: 'Fresh Bar', image: 'https://images.unsplash.com/photo-1621263764928-df1444c5e859?w=400&h=400&fit=crop', description: 'Fresh lemon juice with mint and a hint of honey' },
  { id: 'js6', name: 'Bubble Milk Tea', price: 5.00, category: 'Tea', brand: 'Fresh Bar', image: 'https://images.unsplash.com/photo-1558857563-b371033873b8?w=400&h=400&fit=crop', description: 'Classic milk tea with chewy tapioca pearls' },
  { id: 'js7', name: 'Thai Iced Tea', price: 4.50, category: 'Tea', brand: 'Fresh Bar', image: 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=400&h=400&fit=crop', description: 'Strong brewed Thai tea with sweetened condensed milk over ice' },
];

export const CATEGORIES = ['All', 'Hot Coffee', 'Cold Coffee', 'Tea', 'Juice', 'Refreshers', 'Burgers', 'Chicken', 'Sandwiches', 'Pizza', 'Pasta', 'Sides', 'Breakfast', 'Bakery', 'Desserts', 'Drinks'];
export const BRANDS = [...new Set(PRODUCTS.map(p => p.brand))];

interface ShopCtx {
  products: Product[];
  categories: string[];
  brands: string[];
  cart: CartItem[];
  orders: Order[];
  cartTotal: number;
  cartCount: number;
  addToCart: (product: Product) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  saveOrder: (order: Order) => void;
  updateOrderStatus: (orderId: string, status: Order['status'], txHash?: string) => void;
}

const ShopContext = createContext<ShopCtx | null>(null);

export function ShopProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [orders, setOrders] = useState<Order[]>(() => {
    try {
      const saved = localStorage.getItem('arcbank_orders');
      return saved ? JSON.parse(saved) : [];
    } catch { return []; }
  });

  const addToCart = useCallback((product: Product) => {
    setCart(prev => {
      const existing = prev.find(item => item.product.id === product.id);
      if (existing) {
        return prev.map(item =>
          item.product.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { product, quantity: 1 }];
    });
  }, []);

  const removeFromCart = useCallback((productId: string) => {
    setCart(prev => prev.filter(item => item.product.id !== productId));
  }, []);

  const updateQuantity = useCallback((productId: string, quantity: number) => {
    if (quantity <= 0) {
      setCart(prev => prev.filter(item => item.product.id !== productId));
    } else {
      setCart(prev => prev.map(item =>
        item.product.id === productId ? { ...item, quantity } : item
      ));
    }
  }, []);

  const clearCart = useCallback(() => setCart([]), []);

  const cartTotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const saveOrder = useCallback((order: Order) => {
    setOrders(prev => {
      const updated = [order, ...prev];
      localStorage.setItem('arcbank_orders', JSON.stringify(updated));
      return updated;
    });
  }, []);

  const updateOrderStatus = useCallback((orderId: string, status: Order['status'], txHash?: string) => {
    setOrders(prev => {
      const updated = prev.map(o => o.id === orderId ? { ...o, status, txHash } : o);
      localStorage.setItem('arcbank_orders', JSON.stringify(updated));
      return updated;
    });
  }, []);

  return (
    <ShopContext.Provider value={{
      products: PRODUCTS, categories: CATEGORIES, brands: BRANDS, cart, orders,
      cartTotal, cartCount, addToCart, removeFromCart, updateQuantity,
      clearCart, saveOrder, updateOrderStatus,
    }}>
      {children}
    </ShopContext.Provider>
  );
}

export function useShop() {
  const ctx = useContext(ShopContext);
  if (!ctx) throw new Error('useShop must be used within ShopProvider');
  return ctx;
}
