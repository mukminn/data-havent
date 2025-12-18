'use client';

import { ApiPromise, WsProvider } from '@polkadot/api';
import { types } from '@storagehub/types-bundle';

let polkadotApi: ApiPromise | null = null;

export async function initializePolkadotApi(): Promise<ApiPromise> {
  if (polkadotApi) {
    return polkadotApi;
  }

  const provider = new WsProvider('wss://services.datahaven-testnet.network/testnet');
  
  polkadotApi = await ApiPromise.create({
    provider,
    typesBundle: types as any, // Type compatibility workaround for multiple @polkadot versions
    noInitWarn: true,
  });

  return polkadotApi;
}
