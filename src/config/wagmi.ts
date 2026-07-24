import { http, createConfig } from 'wagmi';
import { injected, coinbaseWallet } from 'wagmi/connectors';
import { arcTestnet } from './chains';

export const config = createConfig({
  chains: [arcTestnet],
  connectors: [
    injected({ shimDisconnect: true }),
    coinbaseWallet({ appName: 'Coffee House Shop' }),
  ],
  transports: {
    [arcTestnet.id]: http('https://rpc.testnet.arc.network', {
      batch: { wait: 50 },
      retryCount: 3,
      retryDelay: 2000,
      timeout: 15_000,
    }),
  },
});
