# 🚀 Panduan Setup dari Dasar - DataHaven Project

Panduan lengkap untuk setup project DataHaven dari awal sampai bisa jalan.

## 📋 Prerequisites (Yang Harus Ada)

Sebelum mulai, pastikan sudah install:

1. **Node.js** (versi 22 atau lebih baru)
   - Download: https://nodejs.org/
   - Cek versi: `node --version`
   - Harus muncul: `v22.x.x` atau lebih baru

2. **npm** (biasanya sudah include dengan Node.js)
   - Cek versi: `npm --version`

3. **Git** (untuk clone repository)
   - Download: https://git-scm.com/
   - Cek versi: `git --version`

## 📦 Langkah 1: Clone Repository

```bash
# Clone repository
git clone https://github.com/mukminn/data-havent.git

# Masuk ke folder project
cd data-havent
```

## 📦 Langkah 2: Install Dependencies

```bash
# Install semua package yang diperlukan
npm install
```

Ini akan install:
- StorageHub SDK packages
- TypeScript dan tools
- Dependencies lainnya

**Tunggu sampai selesai** (bisa beberapa menit pertama kali).

## 🔐 Langkah 3: Setup Keamanan (PENTING!)

### 3.1 Generate Test Wallet

**JANGAN gunakan wallet dengan dana real!** Generate wallet baru untuk testing:

```bash
npm run generate-wallet
```

Ini akan menampilkan:
- **ADDRESS** (public key) - bisa di-share
- **PRIVATE KEY** (rahasia!) - JANGAN di-share!

### 3.2 Buat File .env

Buat file `.env` di root project (folder yang sama dengan `package.json`):

**Windows (PowerShell):**
```powershell
New-Item -Path .env -ItemType File
```

**Windows (CMD):**
```cmd
type nul > .env
```

**Mac/Linux:**
```bash
touch .env
```

### 3.3 Isi File .env

Buka file `.env` dengan text editor (Notepad, VS Code, dll) dan tambahkan:

```env
# Private Key dari generate-wallet (copy dari output sebelumnya)
PRIVATE_KEY=0x_paste_private_key_di_sini

# Network yang digunakan (testnet untuk testing)
NETWORK=testnet
```

**Contoh:**
```env
PRIVATE_KEY=0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef
NETWORK=testnet
```

### 3.4 Verifikasi .env Tidak Ter-commit

Cek apakah `.env` sudah ada di `.gitignore`:

```bash
git check-ignore .env
```

Jika muncul `.env`, berarti sudah aman ✅

Jika tidak muncul, cek file `.gitignore` sudah ada dan berisi `.env`.

## ✅ Langkah 4: Test Setup

Coba jalankan aplikasi:

```bash
npm start
```

**Jika berhasil**, akan muncul:
```
🚀 Initializing DataHaven StorageHub SDK...
📍 Wallet Address: 0x...
📡 Connecting to Polkadot API...
✅ Polkadot API connected
...
```

**Jika error**, cek:
1. Apakah file `.env` sudah dibuat?
2. Apakah `PRIVATE_KEY` sudah diisi?
3. Apakah format private key benar? (harus mulai dengan `0x` dan panjang 66 karakter)

## 🎯 Langkah 5: Siap Digunakan!

Jika semua langkah di atas berhasil, project Anda sudah siap digunakan!

## 🔧 Troubleshooting

### Error: "PRIVATE_KEY tidak ditemukan"

**Solusi:**
1. Pastikan file `.env` ada di root project
2. Pastikan isi file `.env` benar:
   ```
   PRIVATE_KEY=0x...
   NETWORK=testnet
   ```
3. Pastikan tidak ada spasi sebelum/sesudah `=`

### Error: "Format PRIVATE_KEY tidak valid"

**Solusi:**
1. Private key harus dimulai dengan `0x`
2. Panjang harus 66 karakter (termasuk `0x`)
3. Generate wallet baru: `npm run generate-wallet`

### Error: "Cannot find module"

**Solusi:**
```bash
# Install ulang dependencies
rm -rf node_modules
npm install
```

### Error: "Network connection failed"

**Solusi:**
1. Cek koneksi internet
2. Pastikan `NETWORK=testnet` di file `.env`
3. Coba lagi setelah beberapa saat (mungkin server sedang maintenance)

## 📚 Langkah Selanjutnya

Setelah setup berhasil, Anda bisa:

1. **Baca dokumentasi lengkap**: `README.md`
2. **Pelajari keamanan**: `SECURITY.md`
3. **Explore code**: Lihat file di folder `src/`
4. **Baca dokumentasi DataHaven**: https://docs.datahaven.xyz/

## ❓ Pertanyaan?

Jika ada masalah:
1. Cek `SECURITY.md` untuk best practices
2. Cek `README.md` untuk dokumentasi lengkap
3. Buat issue di GitHub repository

---

**Selamat coding! 🎉**

