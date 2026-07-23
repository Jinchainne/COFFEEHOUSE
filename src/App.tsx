import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { WagmiProvider } from 'wagmi';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { config } from './config/wagmi';
import { ShopProvider } from './hooks/useShop';
import Layout from './components/Layout';
import ShopMenu from './pages/Shop/ShopMenu';
import ShopCheckout from './pages/Shop/ShopCheckout';
import ShopOrders from './pages/Shop/ShopOrders';

const queryClient = new QueryClient();

export default function App() {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <ShopProvider>
            <Routes>
              <Route path="/" element={<Layout />}>
                <Route index element={<Navigate to="/shop" replace />} />
                <Route path="shop" element={<ShopMenu />} />
                <Route path="shop/checkout" element={<ShopCheckout />} />
                <Route path="shop/orders" element={<ShopOrders />} />
              </Route>
            </Routes>
          </ShopProvider>
        </BrowserRouter>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
