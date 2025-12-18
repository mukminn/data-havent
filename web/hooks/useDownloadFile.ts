'use client';

import { useState } from 'react';
import { useAccount } from 'wagmi';
import { getMspClient } from '@/lib/dataHavenClient';

export function useDownloadFile() {
  const { address } = useAccount();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const downloadFile = async (bucketId: string, fileKey: string) => {
    if (!address) {
      throw new Error('Wallet not connected');
    }

    setLoading(true);
    setError(null);

    try {
      const { mspClient } = await getMspClient();

      // Download file from MSP
      const fileData = await mspClient.storage.downloadFile(
        bucketId as `0x${string}`,
        fileKey
      );

      // Convert to Blob
      const blob = new Blob([fileData], { type: 'application/octet-stream' });

      return {
        success: true,
        blob,
      };
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to download file';
      setError(errorMessage);
      return {
        success: false,
        blob: undefined,
        error: errorMessage,
      };
    } finally {
      setLoading(false);
    }
  };

  return { downloadFile, loading, error };
}
