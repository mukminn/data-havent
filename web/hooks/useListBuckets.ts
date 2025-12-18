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
      
      const buckets: BucketInfo[] = [];
      
      // Method 1: Try MSP first (if authenticated)
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
        console.warn('MSP query failed, trying chain query:', mspError);
      }
      
      // Method 2: Check localStorage for saved bucket IDs
      try {
        const savedBuckets = localStorage.getItem(`buckets_${walletAddress.toLowerCase()}`);
        if (savedBuckets) {
          const parsed = JSON.parse(savedBuckets);
          parsed.forEach((saved: any) => {
            // Verify bucket exists on chain
            polkadotApi.query.providers.buckets(saved.bucketId).then((bucket) => {
              if (!bucket.isEmpty) {
                const bucketData = (bucket as any).unwrap?.()?.toHuman?.() || bucket.toHuman?.() || bucket;
                const bucketOwner = bucketData.userId || bucketData.owner;
                if (bucketOwner && bucketOwner.toLowerCase() === walletAddress.toLowerCase()) {
                  buckets.push({
                    bucketId: saved.bucketId,
                    bucketName: saved.bucketName,
                    mspId: bucketData.mspId,
                    isPrivate: bucketData.isPrivate || false,
                  });
                }
              }
            }).catch(() => {
              // Bucket doesn't exist, skip
            });
          });
        }
      } catch (localError) {
        console.warn('LocalStorage query failed:', localError);
      }
      
      // Method 3: Try to derive bucket IDs from common bucket names
      // This is a fallback - try some common bucket names
      const commonNames = ['my-bucket', 'test-bucket', 'bucket-1', 'default-bucket'];
      for (const bucketName of commonNames) {
        try {
          const bucketId = (await storageHubClient.deriveBucketId(
            walletAddress as `0x${string}`,
            bucketName
          )) as string;
          
          const bucket = await polkadotApi.query.providers.buckets(bucketId);
          if (!bucket.isEmpty) {
            const bucketData = (bucket as any).unwrap?.()?.toHuman?.() || bucket.toHuman?.() || bucket;
            const bucketOwner = bucketData.userId || bucketData.owner;
            
            if (bucketOwner && bucketOwner.toLowerCase() === walletAddress.toLowerCase()) {
              // Check if already added
              if (!buckets.find(b => b.bucketId === bucketId)) {
                buckets.push({
                  bucketId,
                  bucketName,
                  mspId: bucketData.mspId,
                  isPrivate: bucketData.isPrivate || false,
                });
              }
            }
          }
        } catch (err) {
          // Bucket doesn't exist with this name, continue
        }
      }
      
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
