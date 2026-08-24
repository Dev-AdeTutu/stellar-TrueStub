"use client";

import * as React from "react";
import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

/**
 * Type definition for the wallet context
 * Contains wallet address, name, and functions to manage wallet state
 */
type WalletContextType = {
  walletAddress: string | null;
  walletName: string | null;
  setWalletInfo: (address: string, name: string) => void;
  clearWalletInfo: () => void;
};

/**
 * Create the React context for wallet state management
 */
const WalletContext = createContext<WalletContextType | undefined>(undefined);

/**
 * Helper to get wallet from TrueStub's Zustand store (localStorage)
 */
function getTrueStubWallet(): { address: string | null; name: string | null } {
  try {
    const stored = localStorage.getItem("address-wallet");
    if (stored) {
      const parsed = JSON.parse(stored);
      // Zustand persist stores under "state" key
      const state = parsed?.state || parsed;
      return {
        address: state?.address || null,
        name: state?.name || null,
      };
    }
  } catch (e) {
    console.warn("Failed to parse TrueStub wallet from localStorage:", e);
  }
  return { address: null, name: null };
}

/**
 * Wallet Provider component that wraps the application
 * Manages wallet state and provides wallet information to child components
 * Automatically loads saved wallet information from localStorage on initialization
 * 
 * MODIFIED: Also syncs with TrueStub's Zustand store (address-wallet key)
 */
export const WalletProvider = ({ children }: { children: ReactNode }) => {
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [walletName, setWalletName] = useState<string | null>(null);

  /**
   * Load saved wallet information from localStorage when the component mounts
   * This ensures the wallet state persists across browser sessions
   * 
   * MODIFIED: First check tw-blocks keys, then fallback to TrueStub Zustand store
   */
  useEffect(() => {
    // First try tw-blocks localStorage keys
    let storedAddress = localStorage.getItem("walletAddress");
    let storedName = localStorage.getItem("walletName");

    // If not found, try TrueStub's Zustand store
    if (!storedAddress) {
      const trueStubWallet = getTrueStubWallet();
      storedAddress = trueStubWallet.address;
      storedName = trueStubWallet.name;
      
      // Sync to tw-blocks keys for future use
      if (storedAddress) {
        localStorage.setItem("walletAddress", storedAddress);
        if (storedName) localStorage.setItem("walletName", storedName);
      }
    }

    if (storedAddress) setWalletAddress(storedAddress);
    if (storedName) setWalletName(storedName);
  }, []);

  /**
   * Set wallet information and save it to localStorage
   * This function is called when a wallet is successfully connected
   *
   * @param address - The wallet's public address
   * @param name - The name/identifier of the wallet (e.g., "Freighter", "Albedo")
   */
  const setWalletInfo = (address: string, name: string) => {
    setWalletAddress(address);
    setWalletName(name);
    localStorage.setItem("walletAddress", address);
    localStorage.setItem("walletName", name);
  };

  /**
   * Clear wallet information and remove it from localStorage
   * This function is called when disconnecting a wallet
   */
  const clearWalletInfo = () => {
    setWalletAddress(null);
    setWalletName(null);
    localStorage.removeItem("walletAddress");
    localStorage.removeItem("walletName");
  };

  return (
    <WalletContext.Provider
      value={{ walletAddress, walletName, setWalletInfo, clearWalletInfo }}
    >
      {children}
    </WalletContext.Provider>
  );
};

/**
 * Custom hook to access the wallet context
 * Provides wallet state and functions to components
 * Throws an error if used outside of WalletProvider
 */
export const useWalletContext = () => {
  const context = useContext(WalletContext);
  if (!context) {
    throw new Error("useWalletContext must be used within WalletProvider");
  }
  return context;
};
