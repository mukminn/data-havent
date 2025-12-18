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
      const download = await mspClient.files.downloadFile(fileKey);
      
      // Convert stream to ArrayBuffer
      const reader = download.stream.getReader();
      const chunks: Uint8Array[] = [];
      let done = false;
      
      while (!done) {
        const { value, done: streamDone } = await reader.read();
        done = streamDone;
        if (value) {
          chunks.push(value);
        }
      }
      
      // Combine chunks into single Uint8Array
      const totalLength = chunks.reduce((acc, chunk) => acc + chunk.length, 0);
      const fileData = new Uint8Array(totalLength);
      let offset = 0;
      for (const chunk of chunks) {
        fileData.set(chunk, offset);
        offset += chunk.length;
      }

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
