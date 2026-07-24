import { http, createConfig } from 'wagmi';
import { injected, walletConnect, coinbaseWallet } from 'wagmi/connectors';
import { arcTestnet } from './chains';

// WalletConnect Project ID (free tier)
const WC_PROJECT_ID = 'c4f79cc821944d9680842e34466bfb';

export const config = createConfig({
  chains: [arcTestnet],
  connectors: [
    injected({ shimDisconnect: true }),
    walletConnect({ projectId: WC_PROJECT_ID, showQrModal: true }),
    coinbaseWallet({ appName: 'Coffee House Shop' }),
  ],
  transports: {
    [arcTestnet.id]: http('https://rpc.testnet.arc.network', {
      batch: { wait: 50 },       // Batch RPC calls within 50ms window
      retryCount: 3,              // Retry up to 3 times on failure
      retryDelay: 2000,           // Wait 2s between retries
      timeout: 15_000,            // 15s timeout per request
    }),
  },
});
