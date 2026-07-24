   <div align="center">

<img src="public/logo.png" alt="COFFEE HOUSE" width="140" />

# ☕ COFFEE HOUSE


**Full-stack e-commerce cafe POS · USDC payments on Arc Testnet**

<br/>

[![Live Demo](https://img.shields.io/badge/LIVE_DEMO-coffeehouse--shop.vercel.app-22c55e?style=for-the-badge&logo=vercel&logoColor=white)](https://coffeehouse-shop.vercel.app)
[![GitHub](https://img.shields.io/badge/GITHUB-COFFEEHOUSE-0d1117?style=for-the-badge&logo=github&logoColor=white)](https://github.com/Jinchainne/COFFEEHOUSE)

<br/>

![React](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-8-646CFF?logo=vite&logoColor=white)
![Tailwind](https://img.shields.io/badge/Tailwind_CSS-3-06B6D4?logo=tailwindcss&logoColor=white)
![Wagmi](https://img.shields.io/badge/Wagmi-2-EA580C?logo=ethereum&logoColor=white)
![Arc](https://img.shields.io/badge/Arc_Testnet-5042002-22c55e)
![USDC](https://img.shields.io/badge/USDC-2775CA)

</div>

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Architecture](#-architecture)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
- [Routes](#-routes)
- [Configuration](#-configuration)
- [Deployment](#-deployment)
- [License](#-license)

---

## 🎯 Overview

**COFFEE HOUSE** is a programmable money e-commerce platform that replaces traditional POS systems with direct USDC stablecoin payments on Arc Testnet. No banks, no payment gateways, no card fees — just wallet-to-wallet settlement on-chain.

| | |
|---|---|
| **Network** | Arc Testnet (Chain ID `5042002`) |
| **Payment** | USDC Stablecoin (6 decimals) |
| **Merchant** | `0x363700d10ca9c4809ad7034f5b21650a9a5e34bd` |
| **Products** | 92 items, 21 categories |
| **Stores** | 63 branches across Vietnam |
| **Languages** | 15 languages with real flag icons |
| **AI** | MiMo v2.5 Pro business intelligence |

> **Built for:** Encode Club × Circle — Programmable Money Hackathon

---

## ✨ Features

### 🛒 E-Commerce

| Feature | Description |
|---------|-------------|
| Product Catalog | 92 products across 21 categories (Starbucks, McDonald's, Dunkin', Vietnamese cuisine) |
| Size & Temperature | M/L size variants with price modifiers, Hot/Iced options |
| Shopping Cart | Add/remove/quantity with real-time total calculation |
| Promo Codes | `WELCOME10` (10%), `SAVE5` ($5), `FREESHIP`, `COFFEE20` (20%) |
| Inventory | Stock tracking with out-of-stock badges, admin-editable |
| Customer Feedback | 1-5 star ratings + text reviews per product |
| Recently Viewed | Track browsing history across sessions |
| Wishlist | Persistent saved products |

### 💳 Blockchain Payments

| Feature | Description |
|---------|-------------|
| USDC Payments | Direct wallet-to-wallet stablecoin transfers |
| Dual Payment | Wallet sign OR QR scan (POS-style, no wallet needed) |
| On-chain Detection | Real-time polling of USDC contract balance to auto-confirm |
| Payment Receipt | Full invoice with TX hash, wallet addresses, merchant QR |
| Auto Chain Switch | `wallet_addEthereumChain` for Arc Testnet |
| Multi-Wallet | MetaMask, OKX, Rabby, Binance, Coinbase |

### 🚚 Delivery & Logistics

| Feature | Description |
|---------|-------------|
| 63 Store Branches | All provinces of Vietnam with Leaflet map integration |
| Smart Shipping | Free ≤10km from nearest store, $0.1/km beyond |
| Admin Config | Adjustable free radius, price/km, max fee cap |
| Order Tracking | 5-step: Pending → Confirmed → Preparing → Shipping → Delivered |
| Kitchen Display | Real-time order view for barista, print-ready layout |

### 👤 Customer System

| Feature | Description |
|---------|-------------|
| Wallet Auth | Connect wallet = customer identity (no email/password) |
| Customer Profile | Loyalty tiers (Bronze/Silver/Gold), order history, total spent |
| Refund Requests | Customers can request refund on delivered orders |

### 🤖 AI Business Intelligence

| Feature | Description |
|---------|-------------|
| AI Business Agent | MiMo v2.5 Pro for profit analysis, order insights, recommendations |
| AI Chat | Customer-facing financial assistant |
| Customer Insights | AI analyzes buying patterns, top products, customer segments |
| Market Trends | AI scans market data, suggests trending products, competitor analysis |
| Agent Economy | 4 autonomous agents with wallets + nanopayments |

### 👨‍💼 Admin Panel (11 Tabs)

| Tab | Description |
|-----|-------------|
| **Dashboard** | Revenue, expenses, profit, orders overview |
| **Orders** | Full order management with status updates |
| **Finance** | Income/expense tracking, P&L statement |
| **Tax** | VAT (10%), corporate tax (20%), reference table |
| **Products** | CRUD, stock management, image upload, pricing |
| **AI Agent** | Business analytics, profit analysis, AI chat |
| **Customer Insights** | Top products, customer segments, rating analysis, AI insights, data export/import JSON |
| **Market Trends** | AI market scanning, competitor analysis, product recommendations |
| **Shipping** | Configurable fee formula, distance-based pricing |
| **POS Terminal** | Terminal connection config, webhook, activity logs |
| **Backup** | Export/import data, publish to live site |

### 🔐 Admin Security

| Feature | Description |
|---------|-------------|
| SHA-256 Hashing | Password hashed before comparison |
| Rate Limiting | Max 5 attempts, then 5min cooldown |
| Session Timeout | Auto-logout after 2 hours inactivity |

### 🌍 Internationalization

**15 Languages** with real country flag icons:

| Language | Code | Flag |
|----------|------|------|
| English | EN | 🇺🇸 |
| Tiếng Việt | VI | 🇻🇳 |
| 中文 | ZH | 🇨🇳 |
| 日本語 | JA | 🇯🇵 |
| 한국어 | KO | 🇰🇷 |
| ภาษาไทย | TH | 🇹🇭 |
| Bahasa Indonesia | ID | 🇮🇩 |
| Español | ES | 🇪🇸 |
| Français | FR | 🇫🇷 |
| Português | PT | 🇧🇷 |
| العربية | AR | 🇸🇦 |
| हिन्दी | HI | 🇮🇳 |
| Deutsch | DE | 🇩🇪 |
| Русский | RU | 🇷🇺 |
| Bahasa Melayu | MS | 🇲🇾 |

### 🎨 UX & PWA

| Feature | Description |
|---------|-------------|
| PWA | Installable as app, offline support |
| Social Sharing | Facebook, Zalo, Twitter/X, Copy Link |
| Error Boundary | Crash recovery with friendly fallback |
| Responsive | Mobile-first, works on all screen sizes |

---

## 🛠️ Tech Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| Framework | React 18 + TypeScript | UI + type safety |
| Build | Vite 8 (Rolldown) | Fast dev + production builds |
| Styling | Tailwind CSS 3 | Utility-first CSS |
| State | React Context + Hooks | Global state management |
| Blockchain | Wagmi + Viem | EVM wallet connection + RPC |
| Network | Arc Testnet (5042002) | Blockchain L1 |
| Payment | USDC Contract | Stablecoin transfers |
| AI | Xiaomi MiMo v2.5 Pro | Business intelligence |
| Maps | Leaflet + OpenStreetMap | Delivery address selection |
| QR Codes | qrcode.react | Payment + merchant QR |
| Hosting | Vercel | Edge deployment |
| Icons | Lucide React | UI icon library |

---

## 🏗️ Architecture

```
┌──────────────────────────────────────────────────────────────────────┐
│                           CLIENT (Browser)                           │
├──────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  ┌─────────────┐  ┌─────────────┐  ┌──────────────┐  ┌───────────┐ │
│  │  Shop Menu   │  │   Cart      │  │  Checkout    │  │  Profile  │ │
│  │  92 products │→ │  size/temp  │→ │  QR + Wallet │→ │  Loyalty  │ │
│  └─────────────┘  └─────────────┘  └──────────────┘  └───────────┘ │
│                                                                      │
├──────────────────────────────────────────────────────────────────────┤
│                        STATE MANAGEMENT                              │
│  useShop · useAdmin · useCustomer · useSocial · useAgent · usePOS   │
├──────────────────────────────────────────────────────────────────────┤
│                        BLOCKCHAIN LAYER                              │
│  ┌──────────┐    ┌──────────┐    ┌──────────────────────────────┐   │
│  │  Wagmi   │───→│  Viem    │───→│  Arc Testnet RPC             │   │
│  │  Connect │    │  Client  │    │  USDC: 0x3600...0000         │   │
│  └──────────┘    └──────────┘    │  Merchant: 0x3637...34bd     │   │
│                                  └──────────────────────────────┘   │
├──────────────────────────────────────────────────────────────────────┤
│                        AI LAYER                                      │
│  MiMo v2.5 Pro ──→ Profit Analysis · Customer Insights · Trends    │
└──────────────────────────────────────────────────────────────────────┘
```

---

## 📁 Project Structure

```
COFFEE HOUSE/
├── public/
│   ├── logo.png                          # COFFEE HOUSE crest logo
│   ├── favicon.png                       # Browser favicon
│   ├── manifest.json                     # PWA manifest
│   └── wallets/                          # Wallet brand logos
│
├── src/
│   ├── components/                       # Reusable UI components
│   │   ├── AIChat.tsx                    # Customer AI assistant
│   │   ├── ErrorBoundary.tsx             # Crash recovery wrapper
│   │   ├── Layout.tsx                    # App shell + footer + social share
│   │   ├── Navbar.tsx                    # Navigation + i18n + wallet connect
│   │   ├── PaymentReceipt.tsx            # Invoice/receipt with TX hash
│   │   ├── SocialShare.tsx               # FB, Zalo, Twitter, Copy Link
│   │   └── WalletConnect.tsx             # Multi-wallet connection
│   │
│   ├── config/                           # Configuration files
│   │   ├── chains.ts                     # Arc Testnet chain definition
│   │   ├── mimo.ts                       # MiMo AI API config
│   │   └── wagmi.ts                      # Wagmi + connector config
│   │
│   ├── data/
│   │   └── storeLocations.ts             # 63 Vietnamese store branches
│   │
│   ├── hooks/                            # Custom React hooks
│   │   ├── useAdmin.tsx                  # Admin auth + finance CRUD
│   │   ├── useAgent.tsx                  # AI agent state management
│   │   ├── useCustomer.tsx               # Customer wallet auth + loyalty
│   │   ├── useOnChain.ts                 # USDC balance + send transactions
│   │   ├── usePOSConfig.ts              # POS terminal configuration
│   │   ├── useShop.tsx                   # Products, cart, orders, promo
│   │   └── useSocial.tsx                 # Comments, ratings, wishlist
│   │
│   ├── i18n/
│   │   └── index.ts                      # 15-language translation system
│   │
│   ├── pages/
│   │   ├── Admin/
│   │   │   ├── AdminDashboard.tsx        # 11-tab management dashboard
│   │   │   ├── AdminLogin.tsx            # Secure login (SHA-256 + rate limit)
│   │   │   ├── AgentDashboard.tsx        # AI agent + business analytics
│   │   │   ├── CustomerInsights.tsx      # AI customer analysis + data export
│   │   │   ├── MarketTrends.tsx          # AI market trends + recommendations
│   │   │   └── RevenueReport.tsx         # Revenue reports + CSV export
│   │   │
│   │   └── Shop/
│   │       ├── CustomerProfile.tsx       # Wallet auth + loyalty + history
│   │       ├── DeliveryPage.tsx          # Address + map + 63 stores
│   │       ├── KitchenView.tsx           # Barista display + print
│   │       ├── OrderTracking.tsx         # Real-time order status
│   │       ├── POSCheckout.tsx           # QR scan payment flow
│   │       ├── ShopCheckout.tsx          # Wallet payment flow
│   │       ├── ShopFeedback.tsx          # Reviews + star ratings
│   │       ├── ShopMenu.tsx              # Product grid + categories
│   │       └── ShopOrders.tsx            # Order history + refund
│   │
│   ├── App.tsx                           # Route definitions
│   ├── main.tsx                          # App entry point
│   └── index.css                         # Global styles + Tailwind
│
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
├── tailwind.config.js
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** ≥ 18
- **npm** (or yarn/pnpm)
- **Web3 Wallet** — MetaMask, OKX, Rabby, Binance, or Coinbase browser extension

### Installation

```bash
# Clone
git clone https://github.com/Jinchainne/COFFEEHOUSE.git
cd COFFEEHOUSE

# Install
npm install

# Dev
npm run dev
```

### Build

```bash
npm run build        # TypeScript check + Vite production build
npm run preview      # Preview production build locally
```

### Add Arc Testnet to Wallet

The app auto-prompts chain switch, but manual config:

| Parameter | Value |
|-----------|-------|
| Network Name | Arc Testnet |
| Chain ID | `5042002` |
| RPC URL | `https://rpc.testnet.arc.network` |
| Currency | USDC |
| Explorer | `https://testnet.arcscan.app` |

---

## 🔗 Routes

### Customer

| Route | Page | Description |
|-------|------|-------------|
| `/shop` | Menu | Product catalog, categories, search, size/temp |
| `/shop/delivery` | Delivery | Address selection, map, 63 stores, shipping calc |
| `/shop/checkout` | POS Checkout | QR scan payment |
| `/shop/wallet-checkout` | Wallet Checkout | Direct wallet payment |
| `/shop/orders` | Orders | Order history, refund requests |
| `/shop/track` | Tracking | Real-time order status |
| `/shop/feedback` | Feedback | Star ratings + text reviews |
| `/shop/profile` | Profile | Customer loyalty, order history |
| `/shop/kitchen` | Kitchen | Barista display, print layout |

### Admin

| Route | Page | Description |
|-------|------|-------------|
| `/admin` | Login | Secure login (SHA-256 + rate limiting) |
| `/admin/dashboard` | Dashboard | 11-tab management panel |
| `/admin/revenue` | Revenue | Reports + CSV export |

---

## 💳 Smart Contract Integration

### USDC Contract (Arc Testnet)

```
Contract: 0x3600000000000000000000000000000000000000
Decimals: 6
Method:   balanceOf(address) → 0x70a08231
```

### Payment Flow

```
Customer Wallet                    Merchant Wallet
   (0xc14E...)                      (0x3637...34bd)
       │                                  │
       │──── USDC Transfer ──────────────→│
       │     (wallet_sendTransaction)      │
       │                                  │
       │◄─── TX Hash ────────────────────│
       │     (on-chain confirmation)       │
       │                                  │
       └── Receipt generated ─────────────┘
           with TX hash + ArcScan link
```

### QR Payment Format (EIP-681)

```
ethereum:0x363700d10ca9c4809ad7034f5b21650a9a5e34bd@5042002
```

---

## ⚙️ Configuration

All config is inline — no `.env` file needed:

| Config | File | Value |
|--------|------|-------|
| RPC Endpoint | `src/config/wagmi.ts` | `https://rpc.testnet.arc.network` |
| Chain ID | `src/config/chains.ts` | `5042002` |
| USDC Contract | `src/hooks/useOnChain.ts` | `0x3600...0000` |
| Merchant Wallet | `src/hooks/useShop.tsx` | `0x3637...34bd` |
| AI API | `src/config/mimo.ts` | `api.xiaomimimo.com` |
| Shipping Formula | `src/hooks/useShop.tsx` | Free ≤10km, $0.1/km after |
| Promo Codes | `src/hooks/useShop.tsx` | WELCOME10, SAVE5, FREESHIP, COFFEE20 |
| Store Locations | `src/data/storeLocations.ts` | 63 provinces of Vietnam |

---

## 🌐 Deployment

### Vercel (Recommended)

```bash
npm i -g vercel
vercel --prod
```

Or connect GitHub at [vercel.com](https://vercel.com) for auto-deploy on push.

### Other Platforms

Static SPA — upload `dist/` to any host: Netlify, Cloudflare Pages, AWS S3, GitHub Pages.

---

## 📄 License

MIT License © 2026 [Jinchainne](https://github.com/Jinchainne)

---

<div align="center">

**☕ COFFEE HOUSE** — Programmable Money on Arc Testnet

*Built with ❤️ for Encode Club × Circle Hackathon*

[![Arc Network](https://img.shields.io/badge/Built_on-Arc_Testnet-22c55e?style=for-the-badge)](https://arc.io)
[![Circle USDC](https://img.shields.io/badge/Pay_with-USDC-2775CA?style=for-the-badge)](https://circle.com)

</div>
