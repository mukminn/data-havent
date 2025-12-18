import { privateKeyToAccount } from 'viem/accounts';
import { Chain, defineChain } from 'viem';
import {
  createPublicClient,
  createWalletClient,
  http,
  WalletClient,
  PublicClient,
} from 'viem';
import { StorageHubClient } from '@storagehub-sdk/core';
import { ApiPromise, WsProvider } from '@polkadot/api';
import { types } from '@storagehub/types-bundle';

// Validasi Private Key - PENTING UNTUK KEAMANAN!
const privateKey = process.env.PRIVATE_KEY;

if (!privateKey) {
  throw new Error(
    '❌ PRIVATE_KEY tidak ditemukan!\n' +
    '📝 Silakan buat file .env dan tambahkan:\n' +
    '   PRIVATE_KEY=0x_your_private_key_here\n\n' +
    '⚠️  JANGAN gunakan wallet dengan dana real untuk testing!\n' +
    '💡 Gunakan: npm run generate-wallet (untuk generate test wallet)'
  );
}

// Validasi format private key
if (!privateKey.startsWith('0x') || privateKey.length !== 66) {
  throw new Error(
    '❌ Format PRIVATE_KEY tidak valid!\n' +
    '✅ Private key harus dimulai dengan 0x dan panjangnya 66 karakter\n' +
    '   Contoh: 0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef'
  );
}

// Validasi bahwa ini bukan default/placeholder key
const defaultKey = '0x0000000000000000000000000000000000000000000000000000000000000000';
if (privateKey === defaultKey) {
  throw new Error(
    '❌ PRIVATE_KEY masih menggunakan nilai default!\n' +
    '⚠️  Ini sangat tidak aman!\n' +
    '📝 Silakan ganti dengan private key yang valid di file .env'
  );
}

const account = privateKeyToAccount(privateKey as `0x${string}`);
const address = account.address;

const NETWORKS = {
  devnet: {
    id: 181222,
    name: 'DataHaven Local Devnet',
    rpcUrl: 'http://127.0.0.1:9666',
    wsUrl: 'wss://127.0.0.1:9666',
    mspUrl: 'http://127.0.0.1:8080/',
    nativeCurrency: { name: 'StorageHub', symbol: 'SH', decimals: 18 },
  },
  testnet: {
    id: 55931,
    name: 'DataHaven Testnet',
    rpcUrl: 'https://services.datahaven-testnet.network/testnet',
    wsUrl: 'wss://services.datahaven-testnet.network/testnet',
    mspUrl: 'https://deo-dh-backend.testnet.datahaven-infra.network/',
    nativeCurrency: { name: 'Mock', symbol: 'MOCK', decimals: 18 },
  },
};

// Select network (change to 'devnet' for local development)
const selectedNetwork = (process.env.NETWORK as 'devnet' | 'testnet') || 'testnet';
const network = NETWORKS[selectedNetwork];

const chain: Chain = defineChain({
  id: network.id,
  name: network.name,
  nativeCurrency: network.nativeCurrency,
  rpcUrls: { default: { http: [network.rpcUrl] } },
});

const walletClient: WalletClient = createWalletClient({
  chain,
  account,
  transport: http(network.rpcUrl),
});

const publicClient: PublicClient = createPublicClient({
  chain,
  transport: http(network.rpcUrl),
});

// Create StorageHub client
const storageHubClient: StorageHubClient = new StorageHubClient({
  rpcUrl: network.rpcUrl,
  chain: chain,
  walletClient: walletClient,
  filesystemContractAddress:
    '0x0000000000000000000000000000000000000404' as `0x${string}`,
});

// Create Polkadot API client
const provider = new WsProvider(network.wsUrl);
let polkadotApi: ApiPromise;

// Initialize Polkadot API asynchronously
const initializePolkadotApi = async (): Promise<ApiPromise> => {
  if (!polkadotApi) {
    polkadotApi = await ApiPromise.create({
      provider,
      typesBundle: types,
      noInitWarn: true,
    });
  }
  return polkadotApi;
};

export {
  account,
  address,
  publicClient,
  walletClient,
  storageHubClient,
  initializePolkadotApi,
  network,
  NETWORKS,
};

