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
      
      // According to docs, getMspInfo() should return { mspId, multiaddresses }
      // Extract multiaddresses from the response
      const multiaddresses = (mspInfo as any).multiaddresses || [];
      
      // Ensure the MSP exposes at least one multiaddress (required to reach it over libp2p)
      if (!multiaddresses?.length) {
        throw new Error('MSP multiaddresses are missing');
      }
      
      // Extract the MSP's libp2p peer IDs from the multiaddresses
      // Each address should contain a `/p2p/<peerId>` segment
      function extractPeerIDs(multiaddresses: string[]): string[] {
        return (multiaddresses ?? [])
          .map((addr) => addr.split('/p2p/').pop())
          .filter((id): id is string => !!id);
      }
      
      const peerIds: string[] = extractPeerIDs(multiaddresses);
      
      // Validate that at least one valid peer ID was found
      if (peerIds.length === 0) {
        throw new Error('MSP multiaddresses had no /p2p/<peerId> segment');
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
      ) as unknown as AccountId20; // Type compatibility workaround for multiple @polkadot versions
      const bucketIdH256 = registry.createType('H256', bucketId) as unknown as H256; // Type compatibility workaround
      const fileKey = await fileManager.computeFileKey(
        owner as any,
        bucketIdH256 as any,
        file.name
      );
      console.log(`File key: ${fileKey.toHex()}`);

      // Step 6: Verify storage request on-chain
      console.log('🔍 Verifying storage request on-chain...');
      
      // Wait a bit for the block to be finalized
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const storageRequest = await polkadotApi.query.fileSystem.storageRequests(
        fileKey
      );
      
      // Check if storage request exists (handle different Codec types)
      const isEmpty = (storageRequest as any).isEmpty !== undefined 
        ? (storageRequest as any).isEmpty 
        : !storageRequest || Object.keys(storageRequest).length === 0;
      
      if (isEmpty) {
        console.warn('⚠️ Storage request not found on chain yet, continuing anyway...');
        console.log('This might be normal if the block is still being finalized');
      } else {
        try {
          const storageRequestData = (storageRequest as any).unwrap?.()?.toHuman?.() 
            || (storageRequest as any).toHuman?.() 
            || storageRequest;
          console.log('Storage request data:', storageRequestData);
          if (storageRequestData && typeof storageRequestData === 'object') {
            console.log(
              'Storage request bucketId matches:',
              storageRequestData.bucketId === bucketId
            );
            console.log(
              'Storage request fingerprint matches:',
              storageRequestData.fingerprint === fingerprint.toString()
            );
          }
        } catch (err) {
          console.warn('Could not parse storage request data:', err);
        }
      }

      // Step 7: Authenticate with MSP (SIWE)
      // Authenticating the bucket owner address with MSP prior to file upload is required
      console.log('🔐 Authenticating with MSP via SIWE...');
      const walletClient = await getWalletClient(config);
      if (!walletClient) {
        throw new Error('Wallet client not available');
      }
      
      try {
        // SIWE signature: SIWE(wallet, signal?)
        const siweSession = await (mspClient.auth.SIWE as any)(walletClient);
        console.log('✅ Authenticated with MSP');
        console.log('SIWE Session:', siweSession);
      } catch (authError: any) {
        console.error('❌ SIWE authentication failed:', authError.message);
        throw new Error(`Authentication required for file upload: ${authError.message}`);
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
