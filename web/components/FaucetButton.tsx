'use client';

import { useState } from 'react';
import { useAccount } from 'wagmi';

interface FaucetButtonProps {
  onSuccess?: () => void;
}

export function FaucetButton({ onSuccess }: FaucetButtonProps) {
  const { address } = useAccount();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleFaucet = async () => {
    if (!address) return;

    setLoading(true);
    setMessage('');

    try {
      // Open faucet in new tab
      window.open(
        `https://apps.datahaven.xyz/testnet/faucet`,
        '_blank'
      );
      setMessage('Faucet page opened in new tab. Request tokens there.');
    } catch (error) {
      setMessage('Error opening faucet');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <button
        onClick={handleFaucet}
        disabled={loading || !address}
        className="px-6 py-2 bg-primary-600 text-white rounded hover:bg-primary-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
      >
        {loading ? 'Loading...' : 'Get Testnet Tokens (Faucet)'}
      </button>
      {message && (
        <p className="mt-2 text-sm text-gray-600">{message}</p>
      )}
    </div>
  );
}
