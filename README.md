# DataHaven StorageHub SDK Integration

Proyek ini mengintegrasikan [StorageHub SDK](https://docs.datahaven.xyz/store-and-retrieve-data/use-storagehub-sdk/get-started/) dari DataHaven untuk menyimpan dan mengambil data di jaringan DataHaven.

## 🎯 Quick Start (Pemula? Baca [SETUP.md](./SETUP.md))

**Baru pertama kali?** Ikuti panduan lengkap di **[SETUP.md](./SETUP.md)** untuk setup dari dasar.

**Sudah familiar?** Langsung ke bagian [Instalasi](#-instalasi-cepat) di bawah.

## 📋 Prerequisites

Sebelum memulai, pastikan Anda telah menginstal:

- **Node.js** ≥ 22 (versi LTS direkomendasikan)
- **npm**, **pnpm**, atau **yarn** untuk manajemen paket
- **Git** (untuk clone repository)

## 🚀 Instalasi Cepat

1. **Clone repository:**
```bash
git clone https://github.com/mukminn/data-havent.git
cd data-havent
```

2. **Install dependencies:**
```bash
npm install
```

3. **Generate test wallet (AMAN untuk testing):**
```bash
npm run generate-wallet
```

4. **Buat file `.env` dan isi dengan private key:**
```env
PRIVATE_KEY=0x_paste_private_key_dari_generate-wallet
NETWORK=testnet
```

5. **Jalankan aplikasi:**
```bash
npm start
```

**⚠️ PENTING - Keamanan:**
- **JANGAN** commit file `.env` ke repository!
- **JANGAN** gunakan wallet dengan dana real untuk testing!
- Baca **[SECURITY.md](./SECURITY.md)** untuk best practices keamanan
- Baca **[SETUP.md](./SETUP.md)** untuk panduan lengkap

## 📦 Struktur Proyek

```
data-havent/
├── src/
│   ├── services/
│   │   ├── clientService.ts    # Setup wallet, StorageHub client, dan Polkadot API
│   │   └── mspService.ts       # Setup MSP client dan autentikasi
│   └── index.ts                # Entry point utama
├── package.json
├── tsconfig.json
└── README.md
```

## 🔧 Konfigurasi

### Network Configuration

Proyek ini mendukung dua network:

- **Testnet**: Network test DataHaven (default)
- **Devnet**: Network lokal untuk development

Anda dapat mengubah network dengan mengatur environment variable `NETWORK`:

```env
NETWORK=testnet  # atau devnet
```

### Network Details

#### Testnet
- Chain ID: 55931
- RPC URL: `https://services.datahaven-testnet.network/testnet`
- WSS URL: `wss://services.datahaven-testnet.network/testnet`
- MSP URL: `https://deo-dh-backend.testnet.datahaven-infra.network/`

#### Devnet (Local)
- Chain ID: 181222
- RPC URL: `http://127.0.0.1:9666`
- WSS URL: `wss://127.0.0.1:9666`
- MSP URL: `http://127.0.0.1:8080/`

## 🎯 Penggunaan

### Menjalankan Aplikasi

```bash
npm run start
# atau
npm run dev  # untuk watch mode
```

### Build Project

```bash
npm run build
```

## 📚 Fitur yang Tersedia

### Client Services

1. **StorageHub Client** (`storageHubClient`)
   - Interaksi dengan chain DataHaven
   - Membuat bucket
   - Mengeluarkan storage request
   - Upload dan delete file
   - Mengelola storage proofs

2. **Polkadot API** (`polkadotApi`)
   - Membaca data dari Substrate chain
   - Query state dan logic chain

3. **MSP Client** (`mspClient`)
   - Autentikasi via SIWE (Sign-In With Ethereum)
   - Mengambil informasi MSP
   - Check health status MSP
   - Operasi storage melalui REST endpoints

### Contoh Penggunaan

```typescript
import { storageHubClient } from './services/clientService.js';
import { authenticateUser, getMspInfo } from './services/mspService.js';

// Authenticate
await authenticateUser();

// Get MSP info
await getMspInfo();

// Use StorageHub client for chain operations
// (contoh: create bucket, upload file, dll)
```

## 🔐 Autentikasi

Proyek ini menggunakan **SIWE (Sign-In With Ethereum)** untuk autentikasi dengan MSP. Setelah autentikasi berhasil, session token akan disimpan dan digunakan untuk request yang memerlukan autentikasi.

## 📖 Dokumentasi

Untuk dokumentasi lengkap, kunjungi:
- [StorageHub SDK Documentation](https://docs.datahaven.xyz/store-and-retrieve-data/use-storagehub-sdk/get-started/)
- [Create a Bucket](https://docs.datahaven.xyz/store-and-retrieve-data/use-storagehub-sdk/create-a-bucket/)
- [Upload a File](https://docs.datahaven.xyz/store-and-retrieve-data/use-storagehub-sdk/upload-a-file/)
- [Retrieve Your Data](https://docs.datahaven.xyz/store-and-retrieve-data/use-storagehub-sdk/retrieve-your-data/)

## 🛠️ Dependencies

- `@storagehub-sdk/core` - Core SDK untuk interaksi dengan DataHaven
- `@storagehub-sdk/msp-client` - Client untuk MSP backend
- `@storagehub/types-bundle` - Type definitions untuk DataHaven
- `@polkadot/api` - JavaScript library untuk Substrate chains
- `@storagehub/api-augment` - Augmentasi untuk Polkadot API
- `viem` - Library untuk aplikasi Ethereum-compatible

## 🔐 Keamanan

**PENTING!** Baca panduan keamanan lengkap di **[SECURITY.md](./SECURITY.md)**

### Checklist Keamanan Cepat:
- ✅ File `.env` sudah dibuat dan ada di `.gitignore`
- ✅ Private key dari `generate-wallet` (bukan wallet real)
- ✅ Network di-set ke `testnet` atau `devnet` (bukan mainnet)
- ✅ Tidak ada hardcoded private key di source code

### Script yang Tersedia:
- `npm run generate-wallet` - Generate wallet baru untuk testing (AMAN)
- `npm start` - Jalankan aplikasi
- `npm run dev` - Jalankan dengan watch mode
- `npm run build` - Build project ke JavaScript

## 📝 License

MIT

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📧 Support

Untuk pertanyaan atau dukungan, silakan buka issue di repository ini atau kunjungi [DataHaven Documentation](https://docs.datahaven.xyz/).

