/**
 * Bucket Operations
 * 
 * Functions for creating and managing buckets on DataHaven.
 * Based on: https://docs.datahaven.xyz/store-and-retrieve-data/use-storagehub-sdk/create-a-bucket/
 */

import {
  storageHubClient,
  address,
  publicClient,
  initializePolkadotApi,
} from '../services/clientService.js';
import { getMspInfo, getValueProps } from '../services/mspService.js';

/**
 * Create a bucket on DataHaven
 * @param bucketName - Name of the bucket to create
 * @returns Object containing bucketId and transaction receipt
 */
export async function createBucket(bucketName: string) {
  // Get basic MSP information from the MSP including its ID
  const { mspId } = await getMspInfo();

  // Choose one of the value props retrieved from the MSP through the helper function
  const valuePropId = await getValueProps();
  console.log(`Value Prop ID: ${valuePropId}`);

  // Initialize Polkadot API
  const polkadotApi = await initializePolkadotApi();

  // Derive bucket ID
  const bucketId = (await storageHubClient.deriveBucketId(
    address,
    bucketName
  )) as string;
  console.log(`Derived bucket ID: ${bucketId}`);

  // Check that the bucket doesn't exist yet
  const bucketBeforeCreation = await polkadotApi.query.providers.buckets(
    bucketId
  );
  console.log('Bucket before creation is empty', bucketBeforeCreation.isEmpty);
  if (!bucketBeforeCreation.isEmpty) {
    throw new Error(`Bucket already exists: ${bucketId}`);
  }

  const isPrivate = false;

  // Create bucket on chain
  const txHash: `0x${string}` | undefined = await storageHubClient.createBucket(
    mspId as `0x${string}`,
    bucketName,
    isPrivate,
    valuePropId
  );

  console.log('createBucket() txHash:', txHash);
  if (!txHash) {
    throw new Error('createBucket() did not return a transaction hash');
  }

  // Wait for transaction receipt
  const txReceipt = await publicClient.waitForTransactionReceipt({
    hash: txHash,
  });
  if (txReceipt.status !== 'success') {
    throw new Error(`Bucket creation failed: ${txHash}`);
  }

  return { bucketId, txReceipt };
}

/**
 * Verify bucket creation on chain and return bucket data
 * @param bucketId - The bucket ID to verify
 * @returns Bucket data from chain
 */
export async function verifyBucketCreation(bucketId: string) {
  const { mspId } = await getMspInfo();
  const polkadotApi = await initializePolkadotApi();

  const bucket = await polkadotApi.query.providers.buckets(bucketId);
  if (bucket.isEmpty) {
    throw new Error('Bucket not found on chain after creation');
  }

  const bucketData = bucket.unwrap().toHuman();
  console.log(
    'Bucket userId matches initial bucket owner address',
    bucketData.userId === address
  );
  console.log(
    `Bucket MSPId matches initial MSPId: ${bucketData.mspId === mspId}`
  );
  return bucketData;
}



