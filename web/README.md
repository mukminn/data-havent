# DataHaven Web Interface

Simple web interface untuk mengelola storage di DataHaven testnet.

## Fitur

- ✅ Connect Wallet (MetaMask, WalletConnect, dll)
- ✅ Check Balance
- ✅ Get Testnet Tokens (Faucet)
- ✅ Create Bucket
- ✅ Upload File
- ✅ List & Download Files
- ✅ Manage Buckets

## Setup

1. Install dependencies:
```bash
cd web
npm install
```

2. Setup WalletConnect Project ID:
   - Daftar di https://cloud.walletconnect.com
   - Dapatkan Project ID
   - Update `config/wagmi.ts` dengan Project ID Anda

3. Run development server:
```bash
npm run dev
```

4. Buka http://localhost:3000

## Catatan

- Server actions masih placeholder - perlu implementasi menggunakan StorageHub SDK
- Untuk production, pindahkan logic ke API routes atau client-side hooks
- Pastikan wallet terhubung ke DataHaven Testnet (Chain ID: 55931)

## Next Steps

1. Implementasi server actions dengan StorageHub SDK
2. Add error handling yang lebih baik
3. Add loading states
4. Add file preview
5. Add bucket management (delete, rename, dll)
