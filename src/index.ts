/**
 * DataHaven StorageHub SDK - Main Entry Point
 * 
 * This file demonstrates how to use the StorageHub SDK to interact with DataHaven.
 * Make sure to set your PRIVATE_KEY environment variable before running.
 */

import '@storagehub/api-augment';
import {
  initializePolkadotApi,
  address,
  storageHubClient,
} from './services/clientService.js';
import {
  initializeMspClient,
  getMspInfo,
  getMspHealth,
  authenticateUser,
} from './services/mspService.js';

async function main() {
  try {
    console.log('🚀 Initializing DataHaven StorageHub SDK...\n');
    console.log(`📍 Wallet Address: ${address}\n`);

    // Initialize Polkadot API
    console.log('📡 Connecting to Polkadot API...');
    const polkadotApi = await initializePolkadotApi();
    console.log('✅ Polkadot API connected\n');

    // Initialize MSP Client
    console.log('🔗 Connecting to MSP (Main Storage Provider)...');
    const mspClient = await initializeMspClient();
    console.log('✅ MSP Client connected\n');

    // Get MSP Information
    console.log('📋 Retrieving MSP Information...');
    await getMspInfo();
    console.log('');

    // Get MSP Health Status
    console.log('🏥 Checking MSP Health...');
    await getMspHealth();
    console.log('');

    // Authenticate User (optional - some operations may require auth)
    console.log('🔐 Authenticating user...');
    const authResult = await authenticateUser();
    if (authResult) {
      console.log('✅ Authentication successful!\n');
    }

    console.log('✨ Setup complete! You can now use the StorageHub SDK.');
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

