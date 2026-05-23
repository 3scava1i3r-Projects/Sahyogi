# Sahyogi

**Secure Document Verification** — Store, verify, and timestamp documents using blockchain + decentralized storage.

This is **v2** — a modern Next.js rewrite of the original Sahyogi project.

## Features

- **Secure Document Vault** (`/app`) — Upload files, anchor their hashes locally (simulated on-chain for demo), verify integrity, and retrieve timestamps.
- **Wallet Connection** — Connect via RainbowKit + Wagmi (works with MetaMask on Polygon).
- **Local-first Demo Mode** — Fully works on `localhost` using browser `localStorage` (no external dependencies required right now).
- **Video Call Demo** (`/video`) — Instant encrypted rooms powered by Jitsi.
- **Beautiful Glassmorphic UI** with 3D hero background.

## Tech Stack

- Next.js 16 (App Router) + TypeScript
- Tailwind + custom glassmorphism design
- Wagmi + RainbowKit (wallet)
- React Three Fiber (hero)
- Sonner (toasts)
- localStorage for document persistence (current demo)

## Getting Started

```bash
# Install dependencies
pnpm install

# Run the development server
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000)

## Current Status (as of 2026)

- The real on-chain + Skynet integration is currently disabled because Polygon Mumbai testnet and Sia Skynet are no longer available.
- The **Secure Document Vault** now runs in a fully local, deterministic mode using `localStorage`.
- All flows (Upload → Verify → Timeline → Open) work end-to-end for demos.
- Wallet connection UI is still fully functional.

When a new storage + chain solution is ready, real on-chain anchoring can be re-enabled easily.

## Project Structure

```
src/app/
├── app/           # Secure Document Vault
├── video/         # Jitsi video call demo
├── faq/
├── layout.tsx
└── page.tsx       # Landing with 3D hero
```

## License

ISC
