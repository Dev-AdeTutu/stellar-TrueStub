# 🎟️ TrueStub 🎟️

**TrueStub** is a decentralized P2P escrow platform for secondary-market ticket sales. Powered by the Stellar blockchain via the TrustlessWork API, it replaces "just send the money and hope" ticket resale with trustless smart contracts that hold the buyer's funds on-chain, release them to the seller automatically once transfer of a verified ticket is confirmed, and route any disagreement through transparent on-chain arbitration — giving both buyers and sellers a secure, verifiable alternative to screenshotting a QR code and wiring money to a stranger. 🌐✨

---
## 🚀 **Why Choose TrueStub?**

🔐 **Trustless Technology**: Buyer funds are locked on-chain — no seller gets paid before the ticket is actually transferred.
💾 **Blockchain-Powered Transparency**: Every escrow, transfer confirmation, and release is immutable, auditable, and verifiable.
💱 **Crypto-Payment Support**: Manage cryptocurrency payments for ticket purchases safely and efficiently.
✅ **Automated Refunds**: If a transfer never completes, funds return to the buyer automatically — no chasing a scalper for a refund.

---

## 🌟 **Key Features**

🛠️ **Trustless Escrow**: Funds are securely held in blockchain-based escrow accounts until transfer terms are met.

🔎 **Blockchain Transparency**: Every transaction is logged on the blockchain for full visibility and accountability. 📜

💰 **Crypto Payments**: Supports irreversible and secure cryptocurrency payments while reducing risks of fraud, no-show sellers, or duplicate-sold tickets.

🔗 **Trustline Process**: Verified trustlines between buyer and seller add an extra layer of transaction security. 🔒

📤 **Automated Refund System**: Ensures funds are automatically released or returned based on the terms of the agreement, with no manual intervention required.

---

## ⚙️ **How It Works**

1. **List a Ticket**: The seller creates a secure escrow account for the ticket they're reselling. 🎫
2. **Fund Escrow**: The buyer funds the escrow with the agreed price. 💵
3. **Transfer Agreement**: Transfer terms (event, seat, deadline) are agreed upon and stored on the blockchain. 📃
4. **Completion or Cancellation**: Funds release to the seller once transfer is confirmed, or return to the buyer if it isn't. 🎯

---

## 📋 **Getting Started**

### **Prerequisites**

- Node.js v18 or later 🖥️
- A Stellar blockchain wallet — **Freighter** is recommended 🔐
- Trustless Work API access ([docs here](https://docs.trustlesswork.com/trustless-work)) 📖
- A Firebase project with **Email/Password** authentication enabled ([Firebase Console](https://console.firebase.google.com)) 🔥

> 🧩 **This repo runs standalone.** `frontend-TrueStub` does **not** require a separate backend service to be running locally. It connects directly to a live Hasura GraphQL endpoint and to Firebase — both are remote services reachable over the network, not local processes you need to start. See [Architecture](#-architecture) below for the full explanation.

---

### **Installation**

**1️⃣ Fork and clone the repository**

```bash
git clone https://github.com/<your_user>/frontend-TrueStub
cd frontend-TrueStub
```

**2️⃣ Install dependencies**

```bash
npm install
```

**3️⃣ Set up environment variables**

```bash
cp .env.example .env.local
```

Then open `.env.local` and fill in each value — follow the **Environment Variables** section below step by step. Do not commit `.env.local`; it is already covered by `.gitignore`.

**4️⃣ Start the development server**

```bash
npm run dev
```

```
   ▲ Next.js 15.5.15
   - Local:        http://localhost:3000
   - Network:      http://192.168.x.x:3000
   - Environments: .env

 ✓ Starting...
 ✓ Ready in 4s
```

This repo runs on **port 3000 by default**.

---

### **Environment Variables**

Every environment variable lives in `.env.local` (never committed to git). Use `.env.example` as the template — copy it first, then fill in each block below one at a time.

#### 🔥 1. Firebase Client SDK

These six values come from **Firebase Console → Project Settings → Your apps → Web app → SDK setup and configuration → Config**, and are required for Login, Register, and session auth to work:

```bash
NEXT_PUBLIC_FIREBASE_API_KEY=<your apiKey>
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=<your-project-id>.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=<your-project-id>
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=<your-project-id>.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=<your messagingSenderId>
NEXT_PUBLIC_FIREBASE_APP_ID=<your appId>
```

> ℹ️ These are public, browser-safe values — Firebase ships them to the client by design, and the `NEXT_PUBLIC_` prefix is what makes Next.js expose them to the bundle. The real security boundary is **Firebase Security Rules**, not secrecy of these values. They are **not** the Firebase Admin SDK private key, which belongs only in a server-side backend and must never appear here.

Make sure **Email/Password** sign-in is enabled in **Authentication → Sign-in method** for Register and Login to work. 📚 [Firebase Auth docs](https://firebase.google.com/docs/auth)

---

#### 🌐 2. TrustlessWork API (Optional, don't need it yet)

```bash
NEXT_PUBLIC_API_URL=https://api.trustlesswork.com
NEXT_PUBLIC_API_KEY=<your_trustlesswork_api_key>
NEXT_PUBLIC_TRUSTLESS_API_URL=https://api.trustlesswork.com
NEXT_PUBLIC_TRUSTLESS_API_URL_DEV=https://dev.api.trustlesswork.com
NEXT_PUBLIC_TRUSTLESS_NETWORK=testnet
```

- Obtain `NEXT_PUBLIC_API_KEY` from your [TrustlessWork dashboard](https://docs.trustlesswork.com/trustless-work)
- Always use `testnet` for `NEXT_PUBLIC_TRUSTLESS_NETWORK` in local development — never point local dev at `mainnet`

---

#### 🗄️ 3. Hasura GraphQL

```bash
NEXT_PUBLIC_HASURA_GRAPHQL_URL=<your Hasura GraphQL endpoint>/v1/graphql
```

This points to a **Hasura GraphQL endpoint**, reachable over the network. You do **not** need to run a local backend to develop on this repo; just point this variable at a working Hasura URL and the frontend talks to it directly.

> 🔒 **`HASURA_GRAPHQL_ADMIN_SECRET` must never be set in this repository.** The frontend authenticates against Hasura via a **Firebase JWT**, not the admin secret. The admin secret grants unrestricted read/write access to the entire database and belongs **only** in a backend's server-side environment — never in a `NEXT_PUBLIC_*` variable, never in `.env.local` here, and never committed anywhere. See `src/config/apollo.ts` for how the JWT-based auth header is attached to GraphQL requests.
>
> If you ever see `NEXT_PUBLIC_HASURA_ADMIN_SECRET` or similar in a `.env` file in this repo, treat it as a security incident — remove it and rotate the secret immediately.

---

### **Complete `.env.local` example**

```bash
# Firebase Client SDK (public, browser-safe — see section 1 above)
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSy...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project-id.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project-id.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789012
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789012:web:abcdef123456

# TrustlessWork API  (Optional, don't need it yet)
NEXT_PUBLIC_API_URL=https://api.trustlesswork.com
NEXT_PUBLIC_API_KEY=your_trustlesswork_api_key
NEXT_PUBLIC_TRUSTLESS_API_URL=https://api.trustlesswork.com
NEXT_PUBLIC_TRUSTLESS_API_URL_DEV=https://dev.api.trustlesswork.com
NEXT_PUBLIC_TRUSTLESS_NETWORK=testnet

# Hasura GraphQL (a reachable endpoint; NO admin secret here, ever)
NEXT_PUBLIC_HASURA_GRAPHQL_URL=https://your-hasura-instance.example.com/v1/graphql
```

---

### **🧩 Architecture**

This repo (`frontend-TrueStub`) runs **standalone**: `npm run dev` here connects to a remote/shared Hasura GraphQL endpoint and Firebase — no local backend, no Docker required for UI work.

If you later add a companion backend (Hasura + Postgres + webhook service, e.g. `backend-TrueStub`) or a marketing site (`landing-TrueStub`), point `NEXT_PUBLIC_HASURA_GRAPHQL_URL` at whichever instance you want this frontend talking to — shared, or your own local one at `http://localhost:8080/v1/graphql`.

---

## 🛠️ **Tech Stack**

- **Frontend**: TypeScript, Next.js 15, Tailwind CSS
- **Auth**: Firebase Authentication (Email/Password, Google OAuth)
- **GraphQL**: Apollo Client 4, Hasura GraphQL Engine
- **Blockchain**: Stellar, TrustlessWork API
- **Wallet**: Freighter, Albedo, LOBSTR

---

## 🧪 **Testing Infrastructure**

This project uses Jest, React Testing Library, and Cypress for comprehensive testing.

### **Running Tests**

```bash
npm test              # unit and integration tests
npm run test:e2e      # E2E tests (Cypress)
npm run test:coverage # coverage report
```

### **Test Structure**

- Unit and integration tests live in `__tests__` directories or as `.test.ts(x)` files next to the code they test
- E2E tests live in `cypress/e2e/`
- API requests are mocked via Mock Service Worker (MSW) — handlers in `mocks/handlers.ts`

---

## 🙏 **Credits**

TrueStub started as a personalized fork of [SafeTrust](https://github.com/safetrustcr/frontend-SafeTrust), a decentralized P2P escrow platform for the hospitality and tourism sector. All credit for the original architecture, escrow integration, and wallet tooling goes to the SafeTrust team — this fork repoints that same trustless-escrow foundation at a different problem: secondary-market ticket resale.

---

🌟 **Join TrueStub today and never wire money to a stranger for a ticket again!** 🌟

---
