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
      // Note: SIWE authentication might require specific wallet format
      // For now, we'll skip authentication and see if upload works
      // In production, proper SIWE authentication should be implemented
      console.log('🔐 Skipping SIWE authentication for now...');
      // TODO: Implement proper SIWE authentication

      // Step 2: Issue storage request on-chain
      console.log('📤 Issuing storage request...');
      
      // Create file location (file name)
      const location = file.name;
      
      // Calculate fingerprint (hash of file content)
      // Use Web Crypto API for browser-compatible hashing
      const hashBuffer = await crypto.subtle.digest('SHA-256', fileBytes);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
      const fingerprint = `0x${hashHex}` as `0x${string}`;
      
      const storageRequestTxHash = await storageHubClient.issueStorageRequest(
        bucketId as `0x${string}`,
        location,
        fingerprint,
        BigInt(fileBytes.length),
        mspId as `0x${string}`,
        [], // peerIds - empty for now
        'Single' as any, // replicationTarget - use 'Single' as default
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
