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

      // List files in bucket using buckets.getFiles
      const filesData = await mspClient.buckets.getFiles(bucketId as `0x${string}`);
      
      // Extract file keys from the response
      // The response structure may vary, so we'll handle it safely
      const files: string[] = [];
      if (filesData && Array.isArray(filesData)) {
        files.push(...filesData.map((f: any) => f.key || f.name || String(f)));
      } else if (filesData && typeof filesData === 'object') {
        // If it's an object with files array
        if ('files' in filesData && Array.isArray(filesData.files)) {
          files.push(...filesData.files.map((f: any) => f.key || f.name || String(f)));
        }
      }

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
