'use client';

import { useState } from 'react';
import { useAccount } from 'wagmi';
import { getMspClient } from '@/lib/dataHavenClient';

export function useListFiles() {
  const { address } = useAccount();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const listFiles = async (bucketId: string) => {
    if (!address) {
      throw new Error('Wallet not connected');
    }

    setLoading(true);
    setError(null);

    try {
      const { mspClient } = await getMspClient();

      // List files in bucket
      const files = await mspClient.files.listFiles(bucketId as `0x${string}`);

      return {
        success: true,
        files: files || [],
      };
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to list files';
      setError(errorMessage);
      return {
        success: false,
        files: [],
        error: errorMessage,
      };
    } finally {
      setLoading(false);
    }
  };

  return { listFiles, loading, error };
}
