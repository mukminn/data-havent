'use client';

import { useState, useCallback } from 'react';
import { useAccount } from 'wagmi';
import { initWasm } from '@storagehub-sdk/core';
import { StorageHubClient } from '@storagehub-sdk/core';
import { MspClient } from '@storagehub-sdk/msp-client';
import { createWalletClient, createPublicClient, http } from 'viem';
import { privateKeyToAccount } from 'viem/accounts';

// Initialize WASM once
let wasmInitialized = false;

export function useDataHaven() {
  const { address, connector } = useAccount();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const initializeSDK = useCallback(async () => {
    if (wasmInitialized) return;
    await initWasm();
    wasmInitialized = true;
  }, []);

  const createBucket = useCallback(async (bucketName: string) => {
    if (!address) throw new Error('Wallet not connected');
    
    setLoading(true);
    setError(null);

    try {
      await initializeSDK();
      
      // TODO: Get signer from wallet connector
      // For now, this is a placeholder
      // You'll need to get the signer from the connected wallet
      
      return {
        success: false,
        error: 'Wallet signer integration needed',
      };
    } catch (err: any) {
      setError(err.message);
      return {
        success: false,
        error: err.message,
      };
    } finally {
      setLoading(false);
    }
  }, [address, initializeSDK]);

  return {
    createBucket,
    loading,
    error,
  };
}
