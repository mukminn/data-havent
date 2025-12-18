'use client';

import { useState } from 'react';
import { useAccount } from 'wagmi';
import { FileManager, ReplicationLevel } from '@storagehub-sdk/core';
import { TypeRegistry } from '@polkadot/types';
import { AccountId20, H256 } from '@polkadot/types/interfaces';
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

      // Step 1: Initialize FileManager
      console.log('📁 Initializing FileManager...');
      const fileSize = file.size;
      const fileManager = new FileManager({
        size: fileSize,
        stream: () => {
          // Convert File to ReadableStream
          return file.stream();
        },
      });

      // Step 2: Create fingerprint
      console.log('🔍 Computing file fingerprint...');
      const fingerprint = await fileManager.getFingerprint();
      console.log(`Fingerprint: ${fingerprint.toHex()}`);
      
      const fileSizeBigInt = BigInt(fileManager.getFileSize());
      console.log(`File size: ${fileSize} bytes`);

      // Step 3: Get MSP info and extract peer IDs
      console.log('📡 Fetching MSP details...');
      const mspInfo = await mspClient.info.getInfo();
      const mspId = mspInfo.mspId;
      const multiaddresses = (mspInfo as any).multiaddresses || [];
      
      // Extract peer IDs from multiaddresses
      function extractPeerIDs(multiaddresses: string[]): string[] {
        return (multiaddresses ?? [])
          .map((addr) => addr.split('/p2p/').pop())
          .filter((id): id is string => !!id);
      }
      
      const peerIds = extractPeerIDs(multiaddresses);
      if (peerIds.length === 0) {
        console.warn('⚠️ No peer IDs found in MSP multiaddresses, using empty array');
      }
      console.log(`Found ${peerIds.length} peer IDs`);

      // Set replication policy
      const replicationLevel = ReplicationLevel.Custom;
      const replicas = 1;

      // Step 4: Issue storage request
      console.log('📤 Issuing storage request...');
      const storageRequestTxHash = await storageHubClient.issueStorageRequest(
        bucketId as `0x${string}`,
        file.name,
        fingerprint.toHex() as `0x${string}`,
        fileSizeBigInt,
        mspId as `0x${string}`,
        peerIds,
        replicationLevel,
        replicas
      );
      
      console.log('issueStorageRequest() txHash:', storageRequestTxHash);
      if (!storageRequestTxHash) {
        throw new Error('issueStorageRequest() did not return a transaction hash');
      }

      // Wait for storage request transaction
      const receipt = await publicClient.waitForTransactionReceipt({
        hash: storageRequestTxHash,
      });
      
      if (receipt.status !== 'success') {
        throw new Error(`Storage request failed: ${storageRequestTxHash}`);
      }
      console.log('✅ Storage request confirmed:', storageRequestTxHash);

      // Step 5: Compute file key
      console.log('🔑 Computing file key...');
      const registry = new TypeRegistry();
      const owner = registry.createType(
        'AccountId20',
        walletAddress
      ) as any as AccountId20; // Type compatibility workaround
      const bucketIdH256 = registry.createType('H256', bucketId) as any as H256; // Type compatibility workaround
      const fileKey = await fileManager.computeFileKey(
        owner,
        bucketIdH256,
        file.name
      );
      console.log(`File key: ${fileKey.toHex()}`);

      // Step 6: Verify storage request on-chain
      console.log('🔍 Verifying storage request on-chain...');
      const storageRequest = await polkadotApi.query.fileSystem.storageRequests(
        fileKey
      );
      
      if (!storageRequest.isSome) {
        throw new Error('Storage request not found on chain');
      }
      
      const storageRequestData = storageRequest.unwrap().toHuman();
      console.log('Storage request data:', storageRequestData);
      console.log(
        'Storage request bucketId matches:',
        storageRequestData.bucketId === bucketId
      );
      console.log(
        'Storage request fingerprint matches:',
        storageRequestData.fingerprint === fingerprint.toString()
      );

      // Step 7: Authenticate with MSP (SIWE)
      console.log('🔐 Authenticating with MSP...');
      const walletClient = await getWalletClient(config);
      if (!walletClient) {
        throw new Error('Wallet client not available');
      }
      
      try {
        const mspUrl = new URL(MSP_URL);
        const domain = mspUrl.hostname;
        const siweSession = await mspClient.auth.SIWE(walletClient as any);
        console.log('✅ Authenticated with MSP');
      } catch (authError: any) {
        console.warn('⚠️ SIWE authentication failed:', authError.message);
        // Continue anyway - some operations might work without auth
      }

      // Step 8: Upload file to MSP
      console.log('📤 Uploading file to MSP...');
      const fileBlob = await fileManager.getFileBlob();
      const uploadReceipt = await mspClient.files.uploadFile(
        bucketId as `0x${string}`,
        fileKey.toHex(),
        fileBlob,
        walletAddress as `0x${string}`,
        file.name
      );
      
      console.log('File upload receipt:', uploadReceipt);

      if (uploadReceipt.status !== 'upload_successful') {
        throw new Error(`File upload to MSP failed: ${uploadReceipt.status}`);
      }

      console.log('✅ File uploaded successfully to MSP');

      return {
        success: true,
        fileKey: fileKey.toHex(),
        txHash: storageRequestTxHash,
        uploadReceipt,
        message: `✅ File uploaded successfully! Key: ${fileKey.toHex()}`,
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
