'use client';

import { useAccount, useBalance } from 'wagmi';
import { useState } from 'react';
import { FaucetButton } from './FaucetButton';

export function WalletInfo() {
  const { address } = useAccount();
  const { data: balance, refetch } = useBalance({
    address,
  });

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <h2 className="text-2xl font-semibold mb-4">Wallet Information</h2>
      
      <div className="space-y-4">
        <div>
          <p className="text-sm text-gray-600 mb-1">Address</p>
          <p className="font-mono text-sm bg-gray-100 p-2 rounded break-all">
            {address}
          </p>
        </div>

        <div>
          <p className="text-sm text-gray-600 mb-1">Balance</p>
          <div className="flex items-center gap-4">
            <p className="text-2xl font-bold">
              {balance ? `${parseFloat(balance.formatted).toFixed(4)} ${balance.symbol}` : 'Loading...'}
            </p>
            <button
              onClick={() => refetch()}
              className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded text-sm"
            >
              Refresh
            </button>
          </div>
        </div>

        <FaucetButton onSuccess={() => refetch()} />
      </div>
    </div>
  );
}
