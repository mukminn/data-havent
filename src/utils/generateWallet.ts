/**
 * Utility untuk generate wallet baru (HANYA UNTUK TESTING!)
 * 
 * ⚠️ PERINGATAN:
 * - Wallet ini HANYA untuk testing di testnet/devnet
 * - JANGAN gunakan untuk mainnet atau dengan dana real
 * - Simpan private key dengan aman jika ingin digunakan kembali
 */

import { generatePrivateKey, privateKeyToAccount } from 'viem/accounts';

function main() {
  console.log('🔐 Generating new wallet for testing...\n');
  
  // Generate private key baru
  const privateKey = generatePrivateKey();
  const account = privateKeyToAccount(privateKey);
  
  console.log('✅ Wallet berhasil dibuat!\n');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('📍 ADDRESS (Public Key):');
  console.log(`   ${account.address}\n`);
  console.log('🔑 PRIVATE KEY (RAHASIA!):');
  console.log(`   ${privateKey}\n`);
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
  
  console.log('📝 LANGKAH SELANJUTNYA:');
  console.log('   1. Copy PRIVATE KEY di atas');
  console.log('   2. Buat file .env di root project');
  console.log('   3. Tambahkan baris berikut:');
  console.log(`      PRIVATE_KEY=${privateKey}\n`);
  console.log('   4. Tambahkan juga:');
  console.log('      NETWORK=testnet\n');
  
  console.log('⚠️  PERINGATAN KEAMANAN:');
  console.log('   - JANGAN commit file .env ke Git!');
  console.log('   - JANGAN share private key ke siapapun!');
  console.log('   - Wallet ini HANYA untuk testing!');
  console.log('   - JANGAN gunakan untuk mainnet atau dana real!\n');
  
  console.log('💡 TIP:');
  console.log('   - Simpan private key di tempat yang aman');
  console.log('   - Gunakan password manager untuk menyimpan');
  console.log('   - File .env sudah ada di .gitignore (aman dari commit)\n');
}

main();

