# 🎯 Langkah Selanjutnya - Apa yang Bisa Dilakukan?

Setelah setup selesai, berikut adalah langkah-langkah yang bisa Anda lakukan:

## 📚 1. Pelajari Dokumentasi Resmi

Baca dokumentasi lengkap DataHaven:
- [Get Started](https://docs.datahaven.xyz/store-and-retrieve-data/use-storagehub-sdk/get-started/)
- [Create a Bucket](https://docs.datahaven.xyz/store-and-retrieve-data/use-storagehub-sdk/create-a-bucket/)
- [Upload a File](https://docs.datahaven.xyz/store-and-retrieve-data/use-storagehub-sdk/upload-a-file/)
- [Retrieve Your Data](https://docs.datahaven.xyz/store-and-retrieve-data/use-storagehub-sdk/retrieve-your-data/)
- [End-to-End Workflow](https://docs.datahaven.xyz/store-and-retrieve-data/use-storagehub-sdk/end-to-end-storage-workflow/)

## 🛠️ 2. Coba Fitur-Fitur SDK

### A. Query Chain Data
Gunakan `polkadotApi` untuk membaca data dari chain:
```typescript
// Contoh: Get block number
const blockNumber = await polkadotApi.rpc.chain.getBlockNumber();
console.log('Current block:', blockNumber.toString());
```

### B. Interact dengan StorageHub Client
Gunakan `storageHubClient` untuk operasi chain:
```typescript
// Contoh: Check balance
// (implementasi sesuai dokumentasi)
```

### C. MSP Operations
Gunakan `mspClient` untuk operasi storage:
```typescript
// Contoh: List buckets
// (implementasi sesuai dokumentasi)
```

## 📝 3. Buat File Contoh

Saya sudah membuat file contoh di `src/examples/`:
- `createBucket.ts` - Contoh membuat bucket
- `uploadFile.ts` - Contoh upload file
- `retrieveFile.ts` - Contoh retrieve file

Jalankan contoh-contoh tersebut untuk belajar!

## 🔧 4. Customize Aplikasi Anda

Edit file `src/index.ts` untuk:
- Menambahkan logic aplikasi Anda
- Mengintegrasikan dengan aplikasi lain
- Membuat API endpoint
- Membuat CLI tool

## 🧪 5. Testing

Buat test untuk memastikan kode Anda bekerja:
```bash
# Install testing framework (opsional)
npm install --save-dev jest @types/jest
```

## 📦 6. Build untuk Production

Ketika siap untuk production:
```bash
npm run build
# Output akan ada di folder dist/
```

## 🚀 7. Deploy

Deploy aplikasi Anda ke:
- Vercel
- AWS Lambda
- Docker container
- Server sendiri

## 💡 Tips

1. **Gunakan Testnet** untuk development dan testing
2. **Jangan commit** file `.env` ke Git
3. **Backup private key** dengan aman
4. **Monitor** penggunaan storage dan costs
5. **Baca dokumentasi** sebelum implementasi fitur baru

## 🆘 Butuh Bantuan?

- Baca dokumentasi: https://docs.datahaven.xyz/
- Cek FAQ: https://docs.datahaven.xyz/store-and-retrieve-data/use-storagehub-sdk/faqs-troubleshooting/
- Buat issue di GitHub repository

---

**Selamat coding! 🎉**

