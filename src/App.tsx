import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { WagmiProvider } from 'wagmi';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { config } from './config/wagmi';
import { ShopProvider } from './hooks/useShop';
import { AdminProvider } from './hooks/useAdmin';
import { AgentProvider } from './hooks/useAgent';
import { SocialProvider } from './hooks/useSocial';
import Layout from './components/Layout';
import ShopMenu from './pages/Shop/ShopMenu';
import ShopCheckout from './pages/Shop/ShopCheckout';
import ShopOrders from './pages/Shop/ShopOrders';
import OrderTracking from './pages/Shop/OrderTracking';
import DeliveryPage from './pages/Shop/DeliveryPage';
import POSCheckout from './pages/Shop/POSCheckout';
import AdminLogin from './pages/Admin/AdminLogin';
import AdminDashboard from './pages/Admin/AdminDashboard';
import AgentDashboard from './pages/Admin/AgentDashboard';

const queryClient = new QueryClient();

export default function App() {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <ShopProvider>
            <AdminProvider>
              <AgentProvider>
                <SocialProvider>
                <Routes>
                  <Route path="/" element={<Layout />}>
                    <Route index element={<Navigate to="/shop" replace />} />
                    <Route path="shop" element={<ShopMenu />} />
                    <Route path="shop/delivery" element={<DeliveryPage />} />
                    <Route path="shop/checkout" element={<POSCheckout />} />
                    <Route path="shop/wallet-checkout" element={<ShopCheckout />} />
                    <Route path="shop/orders" element={<ShopOrders />} />
                    <Route path="shop/track" element={<OrderTracking />} />
                  </Route>
                  <Route path="/admin" element={<AdminLogin />} />
                  <Route path="/admin/dashboard" element={<AdminDashboard />} />
                  <Route path="/admin/agents" element={<AgentDashboard />} />
                </Routes>
                </SocialProvider>
              </AgentProvider>
            </AdminProvider>
          </ShopProvider>
        </BrowserRouter>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
