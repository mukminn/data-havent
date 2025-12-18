/**
 * DataHaven StorageHub SDK - Main Entry Point
 * 
 * This file demonstrates how to use the StorageHub SDK to interact with DataHaven.
 * Make sure to set your PRIVATE_KEY environment variable before running.
 * 
 * Based on: https://docs.datahaven.xyz/store-and-retrieve-data/use-storagehub-sdk/create-a-bucket/
 */

import '@storagehub/api-augment';
import { initWasm } from '@storagehub-sdk/core';
import {
  initializePolkadotApi,
  address,
} from './services/clientService.js';
import {
  initializeMspClient,
  getMspHealth,
} from './services/mspService.js';
import {
  createBucket,
  verifyBucketCreation,
} from './operations/bucketOperations.js';
import { HealthStatus } from '@storagehub-sdk/msp-client';
import { checkNativeBalance } from './utils/checkBalance.js';

async function main() {
  try {
    // For anything from @storagehub-sdk/core to work, initWasm() is required
    await initWasm();

    console.log('🚀 Initializing DataHaven StorageHub SDK...\n');
    console.log(`📍 Wallet Address: ${address}\n`);

    // Check wallet balance first
    await checkNativeBalance();

    // Initialize Polkadot API
    console.log('📡 Connecting to Polkadot API...');
    const polkadotApi = await initializePolkadotApi();
    console.log('✅ Polkadot API connected\n');

    // Initialize MSP Client
    console.log('🔗 Connecting to MSP (Main Storage Provider)...');
    const mspClient = await initializeMspClient();
    console.log('✅ MSP Client connected\n');

    // --- Bucket creating logic ---

    // Step 1: Check MSP Health Status
    console.log('🏥 Checking MSP Health...');
    const mspHealth: HealthStatus = await mspClient.info.getHealth();
    console.log('MSP Health Status:', mspHealth);
    console.log('');

    // Step 2: Create a bucket
    console.log('🪣 Creating bucket...');
    const bucketName = 'init-bucket';
    const { bucketId, txReceipt } = await createBucket(bucketName);
    console.log(`✅ Created Bucket ID: ${bucketId}`);
    console.log(`📝 Transaction Receipt:`, txReceipt);
    console.log('');

    // Step 3: Verify bucket exists on chain
    console.log('🔍 Verifying bucket on chain...');
    const bucketData = await verifyBucketCreation(bucketId);
    console.log('✅ Bucket data:', bucketData);
    console.log('');

    console.log('✨ Bucket creation complete!');
    console.log('\nAvailable clients:');
    console.log('  - storageHubClient: For chain interactions');
    console.log('  - polkadotApi: For Substrate chain queries');
    console.log('  - mspClient: For MSP backend operations');

    // Clean up connections
    await polkadotApi.disconnect();
    console.log('\n👋 Disconnected from Polkadot API');
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

// Run the main function
main();

