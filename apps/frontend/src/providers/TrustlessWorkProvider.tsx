// frontend-TrueStub/src/providers/TrustlessWorkProvider.tsx

"use client";

import { ReactNode } from "react";

/**
 * Skeleton-mode stub.
 *
 * In dApp-TrueStub this wraps the app with the real
 * @trustless-work/escrow SDK provider. Here it's a
 * pass-through so layout.tsx compiles without pulling
 * in wallet/escrow dependencies.
 */
export function TrustlessWorkProvider({
  children,
}: {
  children: ReactNode;
}) {
  return <>{children}</>;
}