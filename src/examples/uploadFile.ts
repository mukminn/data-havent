/**
 * Contoh: Upload File ke DataHaven
 * 
 * Setelah bucket dibuat, Anda bisa upload file ke bucket tersebut.
 * Jalankan file ini untuk melihat contoh upload file.
 */

import '@storagehub/api-augment';
import {
  initializePolkadotApi,
  storageHubClient,
  address,
} from '../services/clientService.js';
import { initializeMspClient } from '../services/mspService.js';
import { readFileSync } from 'fs';
import { join } from 'path';

async function uploadFileExample() {
  try {
    console.log('🚀 Contoh: Upload File\n');
    console.log(`📍 Wallet Address: ${address}\n`);

    // Initialize clients
    console.log('📡 Connecting...');
    const polkadotApi = await initializePolkadotApi();
    const mspClient = await initializeMspClient();
    console.log('✅ Connected\n');

    // TODO: Implementasi upload file sesuai dokumentasi
    // Referensi: https://docs.datahaven.xyz/store-and-retrieve-data/use-storagehub-sdk/upload-a-file/
    
    console.log('📝 Implementasi upload file:');
    console.log('   1. Authenticate dengan SIWE');
    console.log('   2. Buat atau pilih bucket');
    console.log('   3. Baca file yang akan di-upload');
    console.log('   4. Issue storage request');
    console.log('   5. Upload file ke MSP');
    console.log('   6. Verify upload success\n');

    // Contoh membaca file (jika ada)
    // const filePath = join(process.cwd(), 'test-file.txt');
    // const fileContent = readFileSync(filePath);
    
    console.log('💡 Lihat dokumentasi lengkap di:');
    console.log('   https://docs.datahaven.xyz/store-and-retrieve-data/use-storagehub-sdk/upload-a-file/\n');

    // Clean up
    await polkadotApi.disconnect();
    console.log('👋 Disconnected');
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

// Uncomment untuk menjalankan
// uploadFileExample();



