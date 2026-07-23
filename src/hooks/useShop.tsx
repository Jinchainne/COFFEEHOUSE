import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';

export interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  image: string;
  description: string;
  brand: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface DeliveryAddress {
  lat: number;
  lng: number;
  address: string;
  note: string;
}

export interface Order {
  id: string;
  items: CartItem[];
  total: number;
  status: 'pending' | 'confirmed' | 'preparing' | 'shipping' | 'delivered' | 'failed';
  txHash?: string;
  timestamp: number;
  merchantAddress: string;
  delivery?: DeliveryAddress;
  shippingFee: number;
}

export const MERCHANT_ADDRESS = '0x363700d10ca9c4809ad7034f5b21650a9a5e34bd';

const PHO_IMG = 'https://images.unsplash.com/photo-1576577445504-6af96477db52?w=400&h=400&fit=crop';
const BUN_HUE_IMG = 'https://images.unsplash.com/photo-1555126634-323283e090fa?w=400&h=400&fit=crop';
const BUN_RIEU_IMG = 'https://images.unsplash.com/photo-1455619452474-d2be8b1e70cd?w=400&h=400&fit=crop';
const COM_IMG = 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=400&h=400&fit=crop';
const COFFEE_IMG = 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=400&h=400&fit=crop';
const ICED_LATTE_IMG = 'https://images.unsplash.com/photo-1517701604599-bb29b565090c?w=400&h=400&fit=crop';
const TEA_IMG = 'https://images.unsplash.com/photo-1556881286-fc6915169721?w=400&h=400&fit=crop';
const SMOOTHIE_IMG = 'https://images.unsplash.com/photo-1623065422902-30a2d299bbe4?w=400&h=400&fit=crop';
const LEMONADE_IMG = 'https://images.unsplash.com/photo-1621263764928-df1444c5e859?w=400&h=400&fit=crop';
const BUBBLE_TEA_IMG = 'https://images.unsplash.com/photo-1558857563-b371033873b8?w=400&h=400&fit=crop';
const CHEESECAKE_IMG = 'https://images.unsplash.com/photo-1533134242443-d4fd215305ad?w=400&h=400&fit=crop';
const ICE_CREAM_IMG = 'https://images.unsplash.com/photo-1497034825429-c343d7c6a68f?w=400&h=400&fit=crop';
const DONUT_IMG = 'https://images.unsplash.com/photo-1551024506-0bccd828d307?w=400&h=400&fit=crop';

const PRODUCTS: Product[] = [
  // ═══════════ STARBUCKS ═══════════
  { id: 'sb1', name: 'Caffè Latte', price: 5.75, category: 'Hot Coffee', brand: 'Starbucks', image: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400&h=400&fit=crop', description: 'Rich espresso topped with steamed milk and a light layer of foam' },
  { id: 'sb2', name: 'Cappuccino', price: 5.45, category: 'Hot Coffee', brand: 'Starbucks', image: 'https://images.unsplash.com/photo-1572442388796-11668a67e53d?w=400&h=400&fit=crop', description: 'Espresso with steamed milk and a deep layer of foam' },
  { id: 'sb3', name: 'Caramel Macchiato', price: 6.25, category: 'Hot Coffee', brand: 'Starbucks', image: 'https://images.unsplash.com/photo-1485808191679-5f86510681a2?w=400&h=400&fit=crop', description: 'Freshly steamed milk with vanilla-flavored syrup and espresso' },
  { id: 'sb4', name: 'Caffè Mocha', price: 5.95, category: 'Hot Coffee', brand: 'Starbucks', image: 'https://images.unsplash.com/photo-1578314675249-a6910f80cc4e?w=400&h=400&fit=crop', description: 'Espresso with bittersweet mocha sauce and steamed milk' },
  { id: 'sb5', name: 'Flat White', price: 5.95, category: 'Hot Coffee', brand: 'Starbucks', image: 'https://images.unsplash.com/photo-1577968897966-3d4325b36b61?w=400&h=400&fit=crop', description: 'Smooth ristretto shots with velvety steamed milk' },
  { id: 'sb6', name: 'Blonde Vanilla Latte', price: 6.05, category: 'Hot Coffee', brand: 'Starbucks', image: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400&h=400&fit=crop', description: 'Blonde espresso with vanilla syrup and steamed milk' },
  { id: 'sb7', name: 'Iced Brown Sugar Oatmilk Shaken Espresso', price: 6.75, category: 'Cold Coffee', brand: 'Starbucks', image: ICED_LATTE_IMG, description: 'Blonde espresso with brown sugar and cinnamon, shaken with oatmilk' },
  { id: 'sb8', name: 'Cold Brew', price: 4.75, category: 'Cold Coffee', brand: 'Starbucks', image: COFFEE_IMG, description: 'Slow-steeped, super-smooth cold coffee served over ice' },
  { id: 'sb9', name: 'Iced Caramel Macchiato', price: 6.45, category: 'Cold Coffee', brand: 'Starbucks', image: 'https://images.unsplash.com/photo-1511920170033-f8396924c348?w=400&h=400&fit=crop', description: 'Espresso poured over cold milk with vanilla and caramel drizzle' },
  { id: 'sb10', name: 'Mocha Frappuccino', price: 5.95, category: 'Cold Coffee', brand: 'Starbucks', image: 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=400&h=400&fit=crop', description: 'Coffee blended with mocha sauce, milk and ice' },
  { id: 'sb11', name: 'Matcha Latte', price: 5.75, category: 'Tea', brand: 'Starbucks', image: 'https://images.unsplash.com/photo-1536256263959-770b48d82b0a?w=400&h=400&fit=crop', description: 'Smooth and creamy matcha sweetened just right and served with milk' },
  { id: 'sb12', name: 'Chai Latte', price: 5.45, category: 'Tea', brand: 'Starbucks', image: 'https://images.unsplash.com/photo-1558160074-4d7d8bdf4256?w=400&h=400&fit=crop', description: 'Black tea infused with cinnamon, clove and other warming spices' },
  { id: 'sb13', name: 'Pineapple Passionfruit Refresher', price: 5.25, category: 'Refreshers', brand: 'Starbucks', image: LEMONADE_IMG, description: 'Tropical flavors of pineapple and passionfruit combined with coconutmilk' },
  { id: 'sb14', name: 'Butter Croissant', price: 3.75, category: 'Bakery', brand: 'Starbucks', image: 'https://images.unsplash.com/photo-1530610476181-d83430b64dcd?w=400&h=400&fit=crop', description: 'Buttery, flaky, golden croissant baked fresh daily' },
  { id: 'sb15', name: 'Chocolate Chip Cookie', price: 3.25, category: 'Bakery', brand: 'Starbucks', image: 'https://images.unsplash.com/photo-1499636136210-6f4ee915583e?w=400&h=400&fit=crop', description: 'Classic cookie loaded with semi-sweet chocolate chips' },

  // ═══════════ McDONALD'S ═══════════
  { id: 'mc1', name: 'Big Mac', price: 5.99, category: 'Burgers', brand: "McDonald's", image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&h=400&fit=crop', description: 'Two all-beef patties, special sauce, lettuce, cheese, pickles, onions on a sesame seed bun' },
  { id: 'mc2', name: 'Quarter Pounder with Cheese', price: 6.39, category: 'Burgers', brand: "McDonald's", image: 'https://images.unsplash.com/photo-1553979459-d2229ba7433b?w=400&h=400&fit=crop', description: 'Quarter pound of 100% fresh beef with cheese, onions, pickles' },
  { id: 'mc3', name: 'McChicken', price: 3.89, category: 'Burgers', brand: "McDonald's", image: 'https://images.unsplash.com/photo-1606755962773-d324e0a13086?w=400&h=400&fit=crop', description: 'Crispy chicken patty with lettuce and mayo on a toasted bun' },
  { id: 'mc4', name: 'Chicken McNuggets (10pc)', price: 5.99, category: 'Chicken', brand: "McDonald's", image: 'https://images.unsplash.com/photo-1562967914-608f82629710?w=400&h=400&fit=crop', description: 'Tender white meat chicken, seasoned and breaded to perfection' },
  { id: 'mc5', name: 'World Famous Fries (Large)', price: 3.89, category: 'Sides', brand: "McDonald's", image: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=400&h=400&fit=crop', description: 'Golden, crispy fries made from premium potatoes' },
  { id: 'mc6', name: 'Egg McMuffin', price: 4.39, category: 'Breakfast', brand: "McDonald's", image: 'https://images.unsplash.com/photo-1525351484163-7529414344d8?w=400&h=400&fit=crop', description: 'Egg, Canadian bacon and American cheese on an English muffin' },
  { id: 'mc7', name: 'Hotcakes', price: 4.19, category: 'Breakfast', brand: "McDonald's", image: 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=400&h=400&fit=crop', description: 'Three golden brown, fluffy hotcakes served with butter and syrup' },
  { id: 'mc8', name: 'McFlurry with OREO', price: 4.39, category: 'Desserts', brand: "McDonald's", image: ICE_CREAM_IMG, description: 'Vanilla soft serve blended with OREO cookie pieces' },
  { id: 'mc9', name: 'Apple Pie', price: 1.99, category: 'Desserts', brand: "McDonald's", image: 'https://images.unsplash.com/photo-1562376552-0d160a2f238d?w=400&h=400&fit=crop', description: 'Hot, crispy apple pie with a flaky crust and warm apple filling' },
  { id: 'mc10', name: 'Coca-Cola (Large)', price: 2.19, category: 'Drinks', brand: "McDonald's", image: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=400&h=400&fit=crop', description: 'Ice-cold Coca-Cola fountain drink' },
  { id: 'mc11', name: 'McCafé Iced Coffee', price: 2.99, category: 'Cold Coffee', brand: "McDonald's", image: COFFEE_IMG, description: 'Premium roast coffee served over ice with cream and sugar' },
  { id: 'mc12', name: 'Onion Rings', price: 3.29, category: 'Sides', brand: "McDonald's", image: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=400&h=400&fit=crop', description: 'Crispy battered onion rings, golden fried' },

  // ═══════════ DUNKIN' ═══════════
  { id: 'dk1', name: 'Original Blend Coffee', price: 2.59, category: 'Hot Coffee', brand: "Dunkin'", image: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=400&h=400&fit=crop', description: 'Medium roast, smooth and rich signature blend' },
  { id: 'dk2', name: 'Caramel Iced Coffee', price: 3.59, category: 'Cold Coffee', brand: "Dunkin'", image: ICED_LATTE_IMG, description: 'Iced coffee with caramel swirl and cream' },
  { id: 'dk3', name: 'Butter Pecan Iced Coffee', price: 3.59, category: 'Cold Coffee', brand: "Dunkin'", image: 'https://images.unsplash.com/photo-1511920170033-f8396924c348?w=400&h=400&fit=crop', description: 'Iced coffee with butter pecan flavor swirl' },
  { id: 'dk4', name: 'Matcha Latte', price: 4.59, category: 'Tea', brand: "Dunkin'", image: 'https://images.unsplash.com/photo-1536256263959-770b48d82b0a?w=400&h=400&fit=crop', description: 'Sweetened matcha green tea blended with milk' },
  { id: 'dk5', name: 'Glazed Donut', price: 1.49, category: 'Bakery', brand: "Dunkin'", image: DONUT_IMG, description: 'Classic yeast donut with sweet glaze' },
  { id: 'dk6', name: 'Chocolate Frosted Donut', price: 1.69, category: 'Bakery', brand: "Dunkin'", image: DONUT_IMG, description: 'Yeast donut with rich chocolate frosting' },
  { id: 'dk7', name: 'Bacon Egg & Cheese', price: 4.79, category: 'Breakfast', brand: "Dunkin'", image: 'https://images.unsplash.com/photo-1525351484163-7529414344d8?w=400&h=400&fit=crop', description: 'Crispy bacon, egg and American cheese on a croissant' },
  { id: 'dk8', name: 'Blueberry Muffin', price: 2.59, category: 'Bakery', brand: "Dunkin'", image: 'https://images.unsplash.com/photo-1607958996333-41aef7caefaa?w=400&h=400&fit=crop', description: 'Moist muffin packed with wild blueberries' },
  { id: 'dk9', name: 'Hash Browns', price: 1.69, category: 'Sides', brand: "Dunkin'", image: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=400&h=400&fit=crop', description: 'Crispy golden hash brown bites' },

  // ═══════════ JOLLIBEE ═══════════
  { id: 'jb1', name: 'Chickenjoy (2pc)', price: 7.99, category: 'Chicken', brand: 'Jollibee', image: 'https://images.unsplash.com/photo-1562967914-608f82629710?w=400&h=400&fit=crop', description: 'Crispylicious, juicylicious fried chicken' },
  { id: 'jb2', name: 'Jolly Spaghetti', price: 5.49, category: 'Pasta', brand: 'Jollibee', image: 'https://images.unsplash.com/photo-1551183053-bf91a1d81141?w=400&h=400&fit=crop', description: 'Sweet-style spaghetti with sliced hotdogs and ground meat' },
  { id: 'jb3', name: 'Yumburger', price: 2.99, category: 'Burgers', brand: 'Jollibee', image: 'https://images.unsplash.com/photo-1553979459-d2229ba7433b?w=400&h=400&fit=crop', description: 'Beefy, cheesy burger with special dressing' },
  { id: 'jb4', name: 'Chickenjoy Bucket (6pc)', price: 17.99, category: 'Chicken', brand: 'Jollibee', image: 'https://images.unsplash.com/photo-1567620832903-9fc6debc209f?w=400&h=400&fit=crop', description: '6 pieces of signature crispy fried chicken' },
  { id: 'jb5', name: 'Palabok Fiesta', price: 6.49, category: 'Pasta', brand: 'Jollibee', image: 'https://images.unsplash.com/photo-1612874742237-6526221588e3?w=400&h=400&fit=crop', description: 'Rice noodles with garlic shrimp sauce, pork, and egg' },
  { id: 'jb6', name: 'Peach Mango Pie', price: 1.99, category: 'Desserts', brand: 'Jollibee', image: 'https://images.unsplash.com/photo-1562376552-0d160a2f238d?w=400&h=400&fit=crop', description: 'Crispy pie filled with real peach and mango chunks' },
  { id: 'jb7', name: 'Jolly Crispy Fries', price: 2.79, category: 'Sides', brand: 'Jollibee', image: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=400&h=400&fit=crop', description: 'Golden crispy fries with a side of gravy' },

  // ═══════════ PIZZA HUT ═══════════
  { id: 'ph1', name: 'Pepperoni Pizza (Personal)', price: 7.49, category: 'Pizza', brand: 'Pizza Hut', image: 'https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?w=400&h=400&fit=crop', description: 'Classic pepperoni with mozzarella on pan crust' },
  { id: 'ph2', name: 'Margherita Pizza (Personal)', price: 6.99, category: 'Pizza', brand: 'Pizza Hut', image: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=400&h=400&fit=crop', description: 'Fresh mozzarella, basil, and marinara on hand-tossed crust' },
  { id: 'ph3', name: 'Garlic Bread', price: 3.99, category: 'Sides', brand: 'Pizza Hut', image: 'https://images.unsplash.com/photo-1530610476181-d83430b64dcd?w=400&h=400&fit=crop', description: 'Warm breadsticks brushed with garlic butter and parmesan' },

  // ═══════════ SUBWAY ═══════════
  { id: 'sw1', name: 'Italian B.M.T.', price: 7.49, category: 'Sandwiches', brand: 'Subway', image: 'https://images.unsplash.com/photo-1553909489-cd47e0907980?w=400&h=400&fit=crop', description: 'Genoa salami, pepperoni, ham with fresh veggies' },
  { id: 'sw2', name: 'Turkey Breast Sub', price: 6.99, category: 'Sandwiches', brand: 'Subway', image: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=400&h=400&fit=crop', description: 'Sliced turkey breast on freshly baked bread' },
  { id: 'sw3', name: 'Chicken Teriyaki Sub', price: 7.99, category: 'Sandwiches', brand: 'Subway', image: 'https://images.unsplash.com/photo-1553909489-cd47e0907980?w=400&h=400&fit=crop', description: 'Sweet onion chicken teriyaki with fresh vegetables' },
  { id: 'sw4', name: 'Cookie (Chocolate Chip)', price: 1.29, category: 'Bakery', brand: 'Subway', image: 'https://images.unsplash.com/photo-1499636136210-6f4ee915583e?w=400&h=400&fit=crop', description: 'Soft-baked chocolate chip cookie' },

  // ═══════════ SHAKE SHACK ═══════════
  { id: 'ss1', name: 'ShackBurger', price: 7.79, category: 'Burgers', brand: 'Shake Shack', image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&h=400&fit=crop', description: 'Angus beef cheeseburger with lettuce, tomato, ShackSauce' },
  { id: 'ss2', name: 'Chicken Shack', price: 7.99, category: 'Chicken', brand: 'Shake Shack', image: 'https://images.unsplash.com/photo-1606755962773-d324e0a13086?w=400&h=400&fit=crop', description: 'Crispy chicken breast with lettuce, pickles, buttermilk herb mayo' },
  { id: 'ss3', name: 'Cheese Fries', price: 4.99, category: 'Sides', brand: 'Shake Shack', image: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=400&h=400&fit=crop', description: 'Crinkle-cut fries topped with cheese sauce' },
  { id: 'ss4', name: 'Vanilla Shake', price: 5.99, category: 'Drinks', brand: 'Shake Shack', image: 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=400&h=400&fit=crop', description: 'Hand-spun vanilla frozen custard milkshake' },
  { id: 'ss5', name: 'Chocolate Shake', price: 5.99, category: 'Drinks', brand: 'Shake Shack', image: 'https://images.unsplash.com/photo-1578314675249-a6910f80cc4e?w=400&h=400&fit=crop', description: 'Hand-spun chocolate frozen custard milkshake' },

  // ═══════════ COFFEE BEAN ═══════════
  { id: 'cb1', name: 'Vanilla Latte', price: 5.75, category: 'Hot Coffee', brand: 'Coffee Bean', image: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400&h=400&fit=crop', description: 'Espresso with French vanilla and steamed milk' },
  { id: 'cb2', name: 'Ice Blended Mocha', price: 6.25, category: 'Cold Coffee', brand: 'Coffee Bean', image: 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=400&h=400&fit=crop', description: 'Rich chocolate and coffee blended with ice and milk' },
  { id: 'cb3', name: 'English Breakfast Tea', price: 3.50, category: 'Tea', brand: 'Coffee Bean', image: 'https://images.unsplash.com/photo-1597318181409-cf64d0b5d8a2?w=400&h=400&fit=crop', description: 'Full-bodied black tea blend from Assam, Ceylon and Kenya' },
  { id: 'cb4', name: 'Tiramisu', price: 6.50, category: 'Desserts', brand: 'Coffee Bean', image: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=400&h=400&fit=crop', description: 'Classic Italian dessert with espresso-soaked ladyfingers and mascarpone' },
  { id: 'cb5', name: 'Cinnamon Roll', price: 4.25, category: 'Bakery', brand: 'Coffee Bean', image: 'https://images.unsplash.com/photo-1509365390695-33aee754301f?w=400&h=400&fit=crop', description: 'Warm cinnamon swirl with cream cheese frosting' },

  // ═══════════ JUICE BAR ═══════════
  { id: 'js1', name: 'Fresh Orange Juice', price: 4.50, category: 'Juice', brand: 'Fresh Bar', image: 'https://images.unsplash.com/photo-1621506289937-a8e4df240d0b?w=400&h=400&fit=crop', description: 'Freshly squeezed oranges, no added sugar' },
  { id: 'js2', name: 'Mango Tropical Smoothie', price: 6.00, category: 'Juice', brand: 'Fresh Bar', image: SMOOTHIE_IMG, description: 'Mango, pineapple, banana blended with coconut water' },
  { id: 'js3', name: 'Berry Antioxidant Blast', price: 6.50, category: 'Juice', brand: 'Fresh Bar', image: 'https://images.unsplash.com/photo-1553530666-ba11a7da3888?w=400&h=400&fit=crop', description: 'Blueberry, strawberry, acai, and pomegranate blend' },
  { id: 'js4', name: 'Green Detox Smoothie', price: 6.50, category: 'Juice', brand: 'Fresh Bar', image: 'https://images.unsplash.com/photo-1610970881699-44a5587cabec?w=400&h=400&fit=crop', description: 'Spinach, kale, apple, ginger, and lemon' },
  { id: 'js5', name: 'Lemon Mint Cooler', price: 4.00, category: 'Juice', brand: 'Fresh Bar', image: LEMONADE_IMG, description: 'Fresh lemon juice with mint and a hint of honey' },
  { id: 'js6', name: 'Bubble Milk Tea', price: 5.00, category: 'Tea', brand: 'Fresh Bar', image: BUBBLE_TEA_IMG, description: 'Classic milk tea with chewy tapioca pearls' },
  { id: 'js7', name: 'Thai Iced Tea', price: 4.50, category: 'Tea', brand: 'Fresh Bar', image: 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=400&h=400&fit=crop', description: 'Strong brewed Thai tea with sweetened condensed milk over ice' },

  // ═══════════ VIETNAMESE FOOD (VERIFIED IMAGES) ═══════════
  // Phở & Bún
  { id: 'vn1', name: 'Phở Bò Tái', price: 6.50, category: 'Phở & Bún', brand: 'Phở Việt', image: PHO_IMG, description: 'Phở bò với thịt bò tái, nước dùng hầm xương 24 giờ' },
  { id: 'vn2', name: 'Phở Bò Chín', price: 6.50, category: 'Phở & Bún', brand: 'Phở Việt', image: PHO_IMG, description: 'Phở bò với thịt bò chín mềm, hành ngò tươi' },
  { id: 'vn3', name: 'Phở Gà', price: 5.95, category: 'Phở & Bún', brand: 'Phở Việt', image: PHO_IMG, description: 'Phở gà ta nước trong, thịt gà xé phay' },
  { id: 'vn4', name: 'Bún Bò Huế', price: 7.25, category: 'Phở & Bún', brand: 'Phở Việt', image: BUN_HUE_IMG, description: 'Bún bò Huế cay nồng, chả cua, giò heo' },
  { id: 'vn5', name: 'Bún Riêu Cua', price: 6.75, category: 'Phở & Bún', brand: 'Phở Việt', image: BUN_RIEU_IMG, description: 'Bún riêu cua đồng, cà chua, đậu hũ, tôm khô' },
  { id: 'vn6', name: 'Bún Chả Hà Nội', price: 7.50, category: 'Phở & Bún', brand: 'Phở Việt', image: PHO_IMG, description: 'Bún chả Hà Nội — thịt nướng than hoa, nước mắm chua ngọt' },
  { id: 'vn7', name: 'Bún Đậu Mắm Tôm', price: 7.95, category: 'Phở & Bún', brand: 'Phở Việt', image: BUN_HUE_IMG, description: 'Bún đậu mắm tôm — đậu rán giòn, thịt luộc, rau sống' },
  { id: 'vn8', name: 'Bánh Canh Cua', price: 6.95, category: 'Phở & Bún', brand: 'Phở Việt', image: BUN_RIEU_IMG, description: 'Bánh canh cua đặc sánh, tôm, chả cá' },
  { id: 'vn23', name: 'Bò Kho', price: 7.50, category: 'Phở & Bún', brand: 'Phở Việt', image: BUN_HUE_IMG, description: 'Bò kho mềm, cà rốt, sả, ăn với bánh mì hoặc bún' },

  // Cơm
  { id: 'vn9', name: 'Cơm Tấm Sườn Nướng', price: 7.50, category: 'Cơm', brand: 'Cơm Việt', image: COM_IMG, description: 'Cơm tấm sườn nướng than hoa, chả trứng, nước mắm' },
  { id: 'vn10', name: 'Cơm Gà Hội An', price: 6.95, category: 'Cơm', brand: 'Cơm Việt', image: COM_IMG, description: 'Cơm gà Hội An — gà xé phay, rau răm, hành phi' },
  { id: 'vn11', name: 'Cơm Chiên Dương Châu', price: 6.50, category: 'Cơm', brand: 'Cơm Việt', image: COM_IMG, description: 'Cơm chiên dương châu — tôm, lạp xưởng, trứng, đậu Hà Lan' },
  { id: 'vn12', name: 'Cơm Sườn Bì Chả', price: 8.25, category: 'Cơm', brand: 'Cơm Việt', image: COM_IMG, description: 'Cơm tấm đặc biệt — sườn nướng, bì, chả trứng' },

  // Lẩu
  { id: 'vn21', name: 'Lẩu Thái', price: 15.95, category: 'Lẩu', brand: 'Quán Việt', image: BUN_RIEU_IMG, description: 'Lẩu Thái chua cay — tôm, mực, cá, nấm, rau' },
  { id: 'vn22', name: 'Lẩu Bò Nhúng Dấm', price: 14.50, category: 'Lẩu', brand: 'Quán Việt', image: BUN_RIEU_IMG, description: 'Lẩu bò nhúng dấm — bò Mỹ, bún, rau sống, nước chấm' },

  // Đồ Uống Việt
  { id: 'vn24', name: 'Cà Phê Sữa Đá', price: 3.50, category: 'Đồ Uống Việt', brand: 'Cà Phê Việt', image: DONUT_IMG, description: 'Cà phê phin Robusta với sữa đặc, served over ice' },
  { id: 'vn25', name: 'Cà Phê Đen Đá', price: 2.75, category: 'Đồ Uống Việt', brand: 'Cà Phê Việt', image: COFFEE_IMG, description: 'Cà phê phin đen đậm đà, không sữa, served over ice' },
  { id: 'vn26', name: 'Bạc Xỉu', price: 3.75, category: 'Đồ Uống Việt', brand: 'Cà Phê Việt', image: ICED_LATTE_IMG, description: 'Bạc xỉu — sữa nóng với chút cà phê, kiểu Sài Gòn' },
  { id: 'vn27', name: 'Trà Đá', price: 1.00, category: 'Đồ Uống Việt', brand: 'Cà Phê Việt', image: TEA_IMG, description: 'Trà đá Việt Nam — trà xanh ướp lạnh' },
  { id: 'vn28', name: 'Sinh Tố Bơ', price: 4.50, category: 'Đồ Uống Việt', brand: 'Cà Phê Việt', image: SMOOTHIE_IMG, description: 'Sinh tố bơ dẻo mịn với sữa đặc' },
  { id: 'vn29', name: 'Chè Ba Màu', price: 3.50, category: 'Đồ Uống Việt', brand: 'Cà Phê Việt', image: BUBBLE_TEA_IMG, description: 'Chè ba màu — đậu đỏ, đậu xanh, thạch lá nứa, nước cốt dừa' },
  { id: 'vn30', name: 'Nước Mía', price: 2.00, category: 'Đồ Uống Việt', brand: 'Cà Phê Việt', image: LEMONADE_IMG, description: 'Nước mía tươi ép, thêm tắc' },

  // Tráng Miệng Việt
  { id: 'vn31', name: 'Chè Đậu Đỏ', price: 3.00, category: 'Tráng Miệng', brand: 'Quán Việt', image: BUBBLE_TEA_IMG, description: 'Chè đậu đỏ nước cốt dừa, thơm bùi' },
  { id: 'vn32', name: 'Bánh Flan (Caramen)', price: 2.50, category: 'Tráng Miệng', brand: 'Quán Việt', image: CHEESECAKE_IMG, description: 'Bánh flan caramel mềm mịn, cà phê sữa' },
  { id: 'vn33', name: 'Kem Chuối', price: 2.75, category: 'Tráng Miệng', brand: 'Quán Việt', image: ICE_CREAM_IMG, description: 'Kem chuối dừa — chuối, nước cốt dừa, đậu phộng' },
];

export const CATEGORIES = ['All', 'Hot Coffee', 'Cold Coffee', 'Tea', 'Juice', 'Refreshers', 'Burgers', 'Chicken', 'Sandwiches', 'Pizza', 'Pasta', 'Sides', 'Breakfast', 'Bakery', 'Desserts', 'Drinks', 'Phở & Bún', 'Cơm', 'Lẩu', 'Đồ Uống Việt', 'Tráng Miệng'];
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
