import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { defineChain } from 'viem';
import { http } from 'wagmi';

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
  blockExplorers: {
    default: {
      name: 'DataHaven Explorer',
      url: 'https://testnet.dhscan.io',
    },
  },
});

export const config = getDefaultConfig({
  appName: 'DataHaven Storage Manager',
  projectId: 'fa10325c22836e4627c2321df96159fd',
  chains: [dataHavenTestnet],
  transports: {
    [dataHavenTestnet.id]: http(),
  },
  ssr: false,
});
