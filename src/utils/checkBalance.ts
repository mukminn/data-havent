/**
 * Utility untuk check balance wallet
 * 
 * Menampilkan balance token yang dimiliki wallet di network yang digunakan.
 */

import { publicClient, address, network } from '../services/clientService.js';
import { initializePolkadotApi } from '../services/clientService.js';

/**
 * Check native token balance (MOCK untuk testnet, SH untuk devnet)
 */
export async function checkNativeBalance() {
  try {
    const balance = await publicClient.getBalance({
      address: address as `0x${string}`,
    });

    // Convert from wei to human readable
    const divisor = 10n ** 18n;
    const balanceInEth = Number(balance) / Number(divisor);
    
    const symbol = network.nativeCurrency.symbol;
    
    console.log('\n💰 Wallet Balance:');
    console.log(`   Address: ${address}`);
    console.log(`   Balance: ${balanceInEth} ${symbol}`);
    console.log(`   Raw: ${balance.toString()} wei`);
    console.log(`   Network: ${network.name}\n`);

    // Check if balance is sufficient (minimal untuk gas fees)
    const minBalance = 0.001; // Minimal 0.001 token untuk gas
    if (balanceInEth < minBalance) {
      console.log('⚠️  WARNING: Balance sangat rendah!');
      console.log(`   Minimal disarankan: ${minBalance} ${symbol}`);
      console.log('   Anda mungkin tidak bisa melakukan transaksi.\n');
    } else {
      console.log('✅ Balance cukup untuk melakukan transaksi.\n');
    }

    return { balance, balanceInEth, symbol };
  } catch (error) {
    console.error('❌ Error checking balance:', error);
    throw error;
  }
}

/**
 * Check balance menggunakan Polkadot API (lebih detail)
 */
export async function checkBalanceFromChain() {
  try {
    const polkadotApi = await initializePolkadotApi();
    
    // Get account info from chain
    const accountInfo = await polkadotApi.query.system.account(address);
    
    if (accountInfo.isEmpty) {
      console.log('⚠️  Account tidak ditemukan di chain (balance = 0)\n');
      return { free: 0n, reserved: 0n, frozen: 0n, total: 0n };
    }

    const data = accountInfo.data;
    const free = data.free.toBigInt();
    const reserved = data.reserved.toBigInt();
    const frozen = data.frozen.toBigInt();
    const total = free + reserved;

    console.log('\n💰 Detailed Balance (from Chain):');
    console.log(`   Address: ${address}`);
    console.log(`   Free: ${Number(free) / 10n ** 18n} ${network.nativeCurrency.symbol}`);
    console.log(`   Reserved: ${Number(reserved) / 10n ** 18n} ${network.nativeCurrency.symbol}`);
    console.log(`   Frozen: ${Number(frozen) / 10n ** 18n} ${network.nativeCurrency.symbol}`);
    console.log(`   Total: ${Number(total) / 10n ** 18n} ${network.nativeCurrency.symbol}\n`);

    return { free, reserved, frozen, total };
  } catch (error) {
    console.error('❌ Error checking balance from chain:', error);
    throw error;
  }
}



