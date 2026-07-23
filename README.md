# ☕ COFFEE HOUSE

> **On-chain coffee shop POS system** — Order food, pay with USDC on Arc Testnet, track delivery in real-time.

![Arc Testnet](https://img.shields.io/badge/Arc%20Testnet-5042002-blue)
![USDC Payment](https://img.shields.io/badge/Payment-USDC%2027b-green)
![Vite](https://img.shields.io/badge/Vite-8-646CFF)
![React](https://img.shields.io/badge/React-19-61DAFB)
![License](https://img.shields.io/badge/License-MIT-green)

**Live:** [coffeehouse-shop.vercel.app](https://coffeehouse-shop.vercel.app/shop)

---

## Purpose

**COFFEE HOUSE** demonstrates how a real-world food ordering business can operate entirely on-chain using **Arc Testnet** — Circle's stablecoin-native Layer 1 blockchain designed for USDC payments.

### Why Arc Testnet?

| Feature | Benefit |
|---------|---------|
| **USDC-native** | Payments in USDC stablecoin — no volatile crypto, $1 = $1 |
| **Low gas fees** | ~$0.01 per transaction — viable for coffee-sized purchases |
| **Fast finality** | Payments confirm in seconds, not minutes |
| **EVM-compatible** | Standard wallet support (MetaMask, OKX, WalletConnect, Coinbase) |
| **Programmable** | Smart contracts enable automated settlement, agent payments, escrow |

### Real-World Use Cases Demonstrated

1. **POS Payments** — Customer scans QR → pays USDC → shop detects payment on-chain → confirms order
2. **Agent Economy** — Autonomous AI agents with wallets make nanopayments for order processing, delivery routing, and recommendations
3. **Transparent Accounting** — Every transaction is on-chain and verifiable via [ArcScan](https://testnet.arcscan.app)
4. **Dual Payment Mode** — Wallet-connected signing OR QR scan without wallet (POS-style)

---

## Architecture

```
COFFEEHOUSE/
├── api/                          # Vercel Serverless Functions
│   ├── auth.ts                   #   Admin password verification
│   └── publish.ts                #   Publish products to GitHub → auto-deploy
│
├── public/
│   ├── agent.png                 #   AI assistant avatar (cyber cat)
│   └── data/
│       └── products.json         #   Product catalog (synced via admin)
│
├── src/
│   ├── main.tsx                  #   App entry point
│   ├── App.tsx                   #   Router + providers
│   │
│   ├── components/
│   │   ├── AIChat.tsx            #   Floating AI assistant (MiMo API)
│   │   ├── ErrorBoundary.tsx     #   Crash recovery
│   │   ├── Layout.tsx            #   Shop layout with navbar + footer
│   │   ├── Navbar.tsx            #   Navigation bar
│   │   ├── WalletConnect.tsx     #   Multi-wallet selector
│   │   └── ...
│   │
│   ├── config/
│   │   ├── wagmi.ts              #   Multi-wallet config (MetaMask, OKX, WalletConnect, Coinbase)
│   │   ├── chains.ts             #   Arc Testnet chain definition
│   │   └── vietnamLocations.ts   #   63 provinces for delivery
│   │
│   ├── hooks/
│   │   ├── useShop.tsx           #   Products, cart, orders, delivery state
│   │   ├── useAdmin.tsx          #   Admin auth, finances, income/expense
│   │   ├── useAgent.tsx          #   Agent economy: wallets, nanopayments
│   │   └── ...
│   │
│   └── pages/
│       ├── Admin/
│       │   ├── AdminLogin.tsx    #   Password-protected login (server-side)
│       │   ├── AdminDashboard.tsx#   Dashboard, orders, finance, tax, products, backup
│       │   └── AgentDashboard.tsx#   Agent economy visualization
│       │
│       └── Shop/
│           ├── ShopMenu.tsx      #   Product grid + category sidebar
│           ├── ShopCheckout.tsx  #   Cart review + crypto payment
│           ├── POSCheckout.tsx   #   QR code payment (no wallet needed)
│           ├── DeliveryPage.tsx  #   Map-based address selection
│           ├── ShopOrders.tsx    #   Order history + tracking
│           └── OrderTracking.tsx #   Real-time delivery progress
│
├── vercel.json                   #   SPA routing + API rewrites
├── package.json
└── tsconfig.json
```

---

## Features

### Shop (`/shop`)
- **92 products** across 21 categories (Starbucks, McDonald's, Jollibee, Pizza Hut, Subway, Vietnamese food)
- Category sidebar with product counts
- Search + wishlist hearts + star ratings
- Cart with quantity controls

### Payment (`/checkout`)
- **Wallet Sign** — Connect wallet → sign USDC transfer on Arc Testnet
- **QR Scan** — POS-style: show QR → customer scans with any wallet → auto-detect payment via blockchain polling
- Merchant address: `0x363700d10ca9c4809ad7034f5b21650a9a5e34bd`

### Delivery (`/delivery`)
- Leaflet/OpenStreetMap interactive map
- Address search with Nominatim geocoding
- Vietnam 63 provinces shipping (Haversine distance calculation)
- Real-time order status tracking

### Admin (`/admin`)
- **Server-side auth** — password stored as Vercel env var, never exposed to client
- **Dashboard** — revenue, expenses, profit, order stats
- **Orders** — full order list with status management
- **Finance** — income/expense tracking with categories
- **Tax** — VAT (10%), corporate tax (20%), Vietnam tax reference
- **Products** — CRUD with local image upload (auto-compressed to 600px JPEG)
- **Backup** — export/import JSON, export CSV, data summary
- **Publish to Site** — commit products.json to GitHub → Vercel auto-deploys

### Agent Economy (`/admin/agents`)
- 4 autonomous agents with blockchain wallets
- Nanopayments between agents for services
- Decision logging with confidence scores
- Order processing, delivery routing, AI recommendations

### AI Assistant
- Floating chat widget with cyber cat avatar
- Powered by MiMo AI API
- Menu recommendations, price lookups, order help

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 19, TypeScript, Vite 8, Tailwind CSS 3 |
| Blockchain | Arc Testnet (Chain ID 5042002), USDC, wagmi v3 |
| Wallets | MetaMask, OKX, WalletConnect, Coinbase, Rabby |
| Maps | Leaflet, OpenStreetMap, Nominatim |
| AI | MiMo v2.5 Pro API |
| Auth | Vercel Serverless Functions |
| Hosting | Vercel (auto-deploy from GitHub) |
| Data | localStorage + GitHub-synced JSON |

---

## Getting Started

```bash
# Clone
git clone https://github.com/Jinchainne/COFFEEHOUSE.git
cd COFFEEHOUSE

# Install
npm install

# Develop
npm run dev        # → http://localhost:5173

# Build
npm run build      # tsc + vite build

# Deploy
git push origin main  # Vercel auto-deploys
```

### Environment Variables (Vercel)

| Variable | Description |
|----------|-------------|
| `ADMIN_PASSWORD` | Admin panel password (server-side only) |
| `GITHUB_TOKEN` | GitHub PAT for publish feature (contents:write) |

---

## Arc Testnet Configuration

```typescript
// Chain ID: 5042002
// RPC: https://rpc.testnet.arc.network
// Explorer: https://testnet.arcscan.app
// USDC Contract: 0x... (native on Arc)
// Gas: ~$0.01 per transaction

// Add to wallet:
await window.ethereum.request({
  method: 'wallet_addEthereumChain',
  params: [{
    chainId: '0x4cf3a2',
    chainName: 'Arc Testnet',
    nativeCurrency: { name: 'USDC', symbol: 'USDC', decimals: 18 },
    rpcUrls: ['https://rpc.testnet.arc.network'],
    blockExplorerUrls: ['https://testnet.arcscan.app'],
  }],
});
```

---

## Payment Flow

```
Customer                    Shop                     Blockchain (Arc Testnet)
   │                          │                              │
   ├─ Browse menu ───────────►│                              │
   ├─ Add to cart ───────────►│                              │
   ├─ Checkout ──────────────►│                              │
   │                          ├─ Generate QR ────────────────┤
   │◄─ Show QR code ─────────┤                              │
   ├─ Scan with wallet ──────►│                              │
   │                          ├─ Send USDC ─────────────────►│
   │                          │                              ├─ Tx confirmed
   │                          │◄─ Poll balance ─────────────┤
   │                          ├─ Payment detected!           │
   │◄─ Order confirmed ──────┤                              │
   │                          ├─ Prepare order               │
   │◄─ Delivery tracking ────┤                              │
```

---

## License

MIT © [Jinchainne](https://github.com/Jinchainne)

Built for the **Circle Encode Club** hackathon on Arc Testnet.
