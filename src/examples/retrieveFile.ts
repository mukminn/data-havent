/**
 * Contoh: Retrieve File dari DataHaven
 * 
 * Setelah file di-upload, Anda bisa retrieve (download) file tersebut.
 * Jalankan file ini untuk melihat contoh retrieve file.
 */

import '@storagehub/api-augment';
import {
  initializePolkadotApi,
  storageHubClient,
  address,
} from '../services/clientService.js';
import { initializeMspClient } from '../services/mspService.js';
import { writeFileSync } from 'fs';
import { join } from 'path';

async function retrieveFileExample() {
  try {
    console.log('🚀 Contoh: Retrieve File\n');
    console.log(`📍 Wallet Address: ${address}\n`);

    // Initialize clients
    console.log('📡 Connecting...');
    const polkadotApi = await initializePolkadotApi();
    const mspClient = await initializeMspClient();
    console.log('✅ Connected\n');

    // TODO: Implementasi retrieve file sesuai dokumentasi
    // Referensi: https://docs.datahaven.xyz/store-and-retrieve-data/use-storagehub-sdk/retrieve-your-data/
    
    console.log('📝 Implementasi retrieve file:');
    console.log('   1. Authenticate dengan SIWE');
    console.log('   2. Gunakan file key untuk retrieve');
    console.log('   3. Download file dari MSP');
    console.log('   4. Simpan file ke local storage\n');

    // Contoh menyimpan file (jika sudah di-download)
    // const filePath = join(process.cwd(), 'downloaded-file.txt');
    // writeFileSync(filePath, fileContent);
    
    console.log('💡 Lihat dokumentasi lengkap di:');
    console.log('   https://docs.datahaven.xyz/store-and-retrieve-data/use-storagehub-sdk/retrieve-your-data/\n');

    // Clean up
    await polkadotApi.disconnect();
    console.log('👋 Disconnected');
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

// Uncomment untuk menjalankan
// retrieveFileExample();

