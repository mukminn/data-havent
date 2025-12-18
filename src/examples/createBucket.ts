/**
 * Contoh: Membuat Bucket di DataHaven
 * 
 * Bucket adalah container untuk menyimpan file Anda.
 * Jalankan file ini untuk melihat contoh membuat bucket.
 */

import '@storagehub/api-augment';
import {
  initializePolkadotApi,
  storageHubClient,
  address,
} from '../services/clientService.js';
import { initializeMspClient } from '../services/mspService.js';

async function createBucketExample() {
  try {
    console.log('🚀 Contoh: Membuat Bucket\n');
    console.log(`📍 Wallet Address: ${address}\n`);

    // Initialize clients
    console.log('📡 Connecting...');
    const polkadotApi = await initializePolkadotApi();
    const mspClient = await initializeMspClient();
    console.log('✅ Connected\n');

    // TODO: Implementasi create bucket sesuai dokumentasi
    // Referensi: https://docs.datahaven.xyz/store-and-retrieve-data/use-storagehub-sdk/create-a-bucket/
    
    console.log('📝 Implementasi create bucket:');
    console.log('   1. Pilih atau buat MSP connection');
    console.log('   2. Authenticate dengan SIWE');
    console.log('   3. Create bucket menggunakan storageHubClient');
    console.log('   4. Simpan bucket ID untuk penggunaan selanjutnya\n');

    console.log('💡 Lihat dokumentasi lengkap di:');
    console.log('   https://docs.datahaven.xyz/store-and-retrieve-data/use-storagehub-sdk/create-a-bucket/\n');

    // Clean up
    await polkadotApi.disconnect();
    console.log('👋 Disconnected');
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

// Uncomment untuk menjalankan
// createBucketExample();



