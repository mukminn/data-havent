'use client';

import { useState } from 'react';
import { useAccount } from 'wagmi';
import { getMspClient } from '@/lib/dataHavenClient';
import { initializePolkadotApi } from '@/lib/polkadotClient';
import { getStorageHubClient } from '@/lib/dataHavenClient';

export interface BucketInfo {
  bucketId: string;
  bucketName?: string;
  mspId?: string;
  isPrivate?: boolean;
}

export function useListBuckets() {
  const { address } = useAccount();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const listBuckets = async (): Promise<BucketInfo[]> => {
    if (!address) {
      throw new Error('Wallet not connected');
    }

    setLoading(true);
    setError(null);

    try {
      // Method 1: Try to get buckets from MSP (requires authentication)
      try {
        const { mspClient } = await getMspClient();
        const buckets = await mspClient.buckets.listBuckets();
        
        if (buckets && Array.isArray(buckets) && buckets.length > 0) {
          return buckets.map((bucket: any) => ({
            bucketId: bucket.id || bucket.bucketId || String(bucket),
            bucketName: bucket.name,
            mspId: bucket.mspId,
            isPrivate: bucket.isPrivate,
          }));
        }
      } catch (mspError) {
        console.warn('Failed to get buckets from MSP, trying chain query:', mspError);
      }

      // Method 2: Query chain directly using Polkadot API
      // This is more reliable but requires knowing bucket IDs
      // For now, we'll return empty array if MSP fails
      // In a real implementation, you might want to store bucket IDs locally
      // or query them from events/transactions
      
      return [];
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to list buckets';
      setError(errorMessage);
      return [];
    } finally {
      setLoading(false);
    }
  };

  // Alternative: Get bucket info by ID (useful if you know the bucket ID)
  const getBucketInfo = async (bucketId: string): Promise<BucketInfo | null> => {
    if (!address) {
      throw new Error('Wallet not connected');
    }

    try {
      const polkadotApi = await initializePolkadotApi();
      const bucket = await polkadotApi.query.providers.buckets(bucketId);

      if (bucket.isEmpty) {
        return null;
      }

      const bucketData = bucket.unwrap().toHuman() as any;
      
      return {
        bucketId,
        mspId: bucketData.mspId,
        isPrivate: bucketData.isPrivate || false,
      };
    } catch (err: any) {
      console.error('Error getting bucket info:', err);
      return null;
    }
  };

  return { listBuckets, getBucketInfo, loading, error };
}
