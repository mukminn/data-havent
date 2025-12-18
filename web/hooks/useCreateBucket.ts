'use client';

import { useState } from 'react';
import { useAccount } from 'wagmi';
import { getStorageHubClient, getMspClient } from '@/lib/dataHavenClient';
import { initializePolkadotApi } from '@/lib/polkadotClient';

export function useCreateBucket() {
  const { address } = useAccount();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createBucket = async (bucketName: string) => {
    if (!address) {
      throw new Error('Wallet not connected');
    }

    setLoading(true);
    setError(null);

    try {
      // Initialize clients
      const { storageHubClient, publicClient, address: walletAddress } = await getStorageHubClient();
      const { mspClient } = await getMspClient();
      const polkadotApi = await initializePolkadotApi();

      // Get MSP info
      const mspInfo = await mspClient.info.getInfo();
      const mspId = mspInfo.mspId;

      // Get value propositions
      const valueProps = await mspClient.info.getValuePropositions();
      if (!valueProps || valueProps.length === 0) {
        throw new Error('No value propositions found');
      }
      const valuePropId = valueProps[0].id;

      // Derive bucket ID
      const bucketId = (await storageHubClient.deriveBucketId(
        walletAddress as `0x${string}`,
        bucketName
      )) as string;

      // Check if bucket exists
      const existingBucket = await polkadotApi.query.providers.buckets(bucketId);
      if (!existingBucket.isEmpty) {
        throw new Error(`Bucket already exists: ${bucketId}`);
      }

      // Create bucket
      const txHash = await storageHubClient.createBucket(
        mspId as `0x${string}`,
        bucketName,
        false, // isPrivate
        valuePropId
      );

      if (!txHash) {
        throw new Error('Failed to create bucket - no transaction hash');
      }

      // Wait for transaction receipt
      const receipt = await publicClient.waitForTransactionReceipt({
        hash: txHash,
      });

      if (receipt.status !== 'success') {
        throw new Error('Transaction failed');
      }

      return {
        success: true,
        bucketId,
        txHash,
      };
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to create bucket';
      setError(errorMessage);
      return {
        success: false,
        error: errorMessage,
        bucketId: undefined,
      };
    } finally {
      setLoading(false);
    }
  };

  return { createBucket, loading, error };
}
