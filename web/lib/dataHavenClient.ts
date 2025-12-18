'use client';

import { initWasm } from '@storagehub-sdk/core';
import { StorageHubClient } from '@storagehub-sdk/core';
import { MspClient } from '@storagehub-sdk/msp-client';
import { createPublicClient, http, defineChain, type WalletClient } from 'viem';
import { getWalletClient, getPublicClient } from '@wagmi/core';
import { config } from '@/config/wagmi';
import '@storagehub/api-augment';

// Initialize WASM once
let wasmInitialized = false;

// DataHaven Testnet Chain
export const dataHavenTestnet = defineChain({
  id: 55931,
  name: 'DataHaven Testnet',
  nativeCurrency: {
    decimals: 18,
    name: 'MOCK',
    symbol: 'MOCK',
  },
  rpcUrls: {
    default: {
      http: ['https://services.datahaven-testnet.network/testnet'],
    },
  },
});

export const MSP_URL = 'https://deo-dh-backend.testnet.datahaven-infra.network/';

/**
 * Initialize WASM (required for StorageHub SDK)
 */
export async function initializeWasm() {
  if (wasmInitialized) return;
  await initWasm();
  wasmInitialized = true;
}

/**
 * Get StorageHub Client instance
 */
export async function getStorageHubClient() {
  await initializeWasm();
  
  const walletClient = await getWalletClient(config);
  if (!walletClient) {
    throw new Error('Wallet not connected');
  }

  const publicClient = getPublicClient(config) || createPublicClient({
    chain: dataHavenTestnet,
    transport: http(),
  });

  const storageHubClient = new StorageHubClient({
    rpcUrl: 'https://services.datahaven-testnet.network/testnet',
    chain: dataHavenTestnet,
    walletClient: walletClient as WalletClient,
    filesystemContractAddress: '0x0000000000000000000000000000000000000404' as `0x${string}`,
  });

  return { storageHubClient, publicClient, address: walletClient.account.address };
}

/**
 * Get MSP Client instance
 */
export async function getMspClient() {
  await initializeWasm();
  
  const walletClient = await getWalletClient(config);
  if (!walletClient) {
    throw new Error('Wallet not connected');
  }

  const mspClient = await MspClient.connect(
    { baseUrl: MSP_URL },
    async () => {
      // Session provider - return undefined for now (auth can be added later)
      return undefined;
    }
  );

  return { mspClient, address: walletClient.account.address };
}
