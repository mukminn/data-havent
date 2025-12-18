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

      // Access bucket data - the structure may vary
      const bucketData = (bucket as any).unwrap?.()?.toHuman?.() || bucket.toHuman?.() || bucket;
      
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

  // Query buckets by wallet address (scan chain for buckets owned by address)
  const queryBucketsByAddress = async (walletAddress: string): Promise<BucketInfo[]> => {
    setLoading(true);
    setError(null);

    try {
      const polkadotApi = await initializePolkadotApi();
      const { storageHubClient } = await getStorageHubClient();
      
      // Note: This is a simplified approach
      // In a real implementation, you would:
      // 1. Query chain events for bucket creation transactions
      // 2. Filter by owner address
      // 3. Or use an indexer/API that tracks buckets by owner
      
      // For now, we'll try to get buckets from MSP if authenticated
      // and also provide a way to manually check known bucket IDs
      
      const buckets: BucketInfo[] = [];
      
      // Try MSP first
      try {
        const { mspClient } = await getMspClient();
        const mspBuckets = await mspClient.buckets.listBuckets();
        
        if (mspBuckets && Array.isArray(mspBuckets)) {
          mspBuckets.forEach((bucket: any) => {
            const bucketOwner = bucket.owner || bucket.userId;
            if (bucketOwner && bucketOwner.toLowerCase() === walletAddress.toLowerCase()) {
              buckets.push({
                bucketId: bucket.id || bucket.bucketId || String(bucket),
                bucketName: bucket.name,
                mspId: bucket.mspId,
                isPrivate: bucket.isPrivate,
              });
            }
          });
        }
      } catch (mspError) {
        console.warn('MSP query failed, will try alternative methods:', mspError);
      }
      
      // If no buckets found, return empty array
      // In production, you might want to query chain events or use an indexer
      
      return buckets;
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to query buckets by address';
      setError(errorMessage);
      return [];
    } finally {
      setLoading(false);
    }
  };

  return { listBuckets, getBucketInfo, queryBucketsByAddress, loading, error };
}
