"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { WagmiProvider, createConfig, http } from "wagmi";
import { polygonMumbai } from "wagmi/chains";
import { RainbowKitProvider, getDefaultConfig } from "@rainbow-me/rainbowkit";
import "@rainbow-me/rainbowkit/styles.css";
import { useState, type ReactNode } from "react";

const config = getDefaultConfig({
  appName: "Sahyogi",
  projectId: "YOUR_WALLETCONNECT_PROJECT_ID", // TODO: replace with real one from cloud.walletconnect.com
  chains: [polygonMumbai],
  transports: {
    [polygonMumbai.id]: http("https://rpc-mumbai.maticvigil.com"),
  },
  ssr: true,
});

const queryClient = new QueryClient();

export function Providers({ children }: { children: ReactNode }) {
  const [qc] = useState(() => queryClient);

  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={qc}>
        <RainbowKitProvider>{children}</RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
