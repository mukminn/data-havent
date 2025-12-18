'use client';

import { useState } from 'react';
import { useAccount } from 'wagmi';
import { getStorageHubClient, getMspClient, MSP_URL } from '@/lib/dataHavenClient';
import { initializePolkadotApi } from '@/lib/polkadotClient';
import { getWalletClient } from '@wagmi/core';
import { config } from '@/config/wagmi';

export function useUploadFile() {
  const { address } = useAccount();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const uploadFile = async (bucketId: string, file: File) => {
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

      // Read file as ArrayBuffer
      const fileBuffer = await file.arrayBuffer();
      const fileBytes = new Uint8Array(fileBuffer);

      // Get MSP info
      const mspInfo = await mspClient.info.getInfo();
      const mspId = mspInfo.mspId;

      // Derive file key from bucket ID and file name
      // File key is typically: hash(owner + bucketId + fileName)
      // For now, we'll use a simple approach - in production, use proper derivation
      const fileKey = `${bucketId}_${file.name}`;
      
      console.log('📝 File key:', fileKey);

      // Step 1: Authenticate with MSP (SIWE) - required for upload
      const walletClient = await getWalletClient(config);
      if (!walletClient) {
        throw new Error('Wallet client not available');
      }

      const mspUrl = new URL(MSP_URL);
      const domain = mspUrl.hostname;
      
      console.log('🔐 Authenticating with MSP via SIWE...');
      // SIWE signature: SIWE(wallet, signal?)
      const siweSession = await mspClient.auth.SIWE(walletClient as any);
      console.log('✅ Authenticated with MSP');

      // Step 2: Issue storage request on-chain
      console.log('📤 Issuing storage request...');
      
      // Create file location (file name)
      const location = file.name;
      
      // Calculate fingerprint (hash of file content)
      // For now, we'll use a simple approach - in production, use proper hashing
      const fingerprint = await storageHubClient.hashFile(fileBytes);
      
      const storageRequestTxHash = await storageHubClient.issueStorageRequest(
        bucketId as `0x${string}`,
        location,
        fingerprint,
        BigInt(fileBytes.length),
        mspId as `0x${string}`,
        [], // peerIds - empty for now
        undefined, // replicationTarget
        undefined, // customReplicationTarget
        {} // options
      );

      if (!storageRequestTxHash) {
        throw new Error('Failed to issue storage request');
      }

      // Wait for storage request transaction
      const storageRequestReceipt = await publicClient.waitForTransactionReceipt({
        hash: storageRequestTxHash,
      });

      if (storageRequestReceipt.status !== 'success') {
        throw new Error('Storage request transaction failed');
      }

      console.log('✅ Storage request confirmed:', storageRequestTxHash);

      // Step 3: Upload file to MSP
      console.log('📤 Uploading file to MSP...');
      
      // Convert fileBytes to a format MSP client can use
      // Create a Blob and then a ReadableStream
      const blob = new Blob([fileBytes]);
      const fileStream = blob.stream();

      await mspClient.files.uploadFile(
        bucketId as `0x${string}`,
        fileKey,
        fileStream as any,
        walletAddress as `0x${string}`,
        location
      );

      console.log('✅ File uploaded to MSP');

      return {
        success: true,
        fileKey,
        txHash: storageRequestTxHash,
        message: `✅ File uploaded successfully! Key: ${fileKey}`,
      };
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to upload file';
      setError(errorMessage);
      return {
        success: false,
        error: errorMessage,
        fileKey: undefined,
      };
    } finally {
      setLoading(false);
    }
  };

  return { uploadFile, loading, error };
}
