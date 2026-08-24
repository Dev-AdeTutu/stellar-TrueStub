"use client";

import { ApolloClientProvider } from "@/providers/ApolloProviderWrapper";
import { QueryProvider } from "@/providers/QueryProvider";
import { TrustlessWorkProvider } from "@/providers/TrustlessWorkProvider";
import { WalletProvider } from "@/components/tw-blocks/wallet-kit/WalletProvider";

export function ClientProviders({ children }: { children: React.ReactNode }) {
  return (
    <ApolloClientProvider>
      <QueryProvider>
        <WalletProvider>
          <TrustlessWorkProvider>
            {children}
          </TrustlessWorkProvider>
        </WalletProvider>
      </QueryProvider>
    </ApolloClientProvider>
  );
}