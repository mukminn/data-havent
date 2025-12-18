# Instruksi Setup Web App

## Langkah 1: Install Dependencies

```bash
cd web
npm install
```

## Langkah 2: Setup WalletConnect

1. Daftar di https://cloud.walletconnect.com
2. Buat project baru
3. Copy Project ID
4. Edit file `config/wagmi.ts`
5. Ganti `YOUR_PROJECT_ID` dengan Project ID Anda

## Langkah 3: Run Development Server

```bash
npm run dev
```

Buka http://localhost:3000

## Catatan Penting

⚠️ **Server Actions masih placeholder!**

File `lib/actions.ts` masih berisi placeholder. Untuk implementasi lengkap, Anda perlu:

1. **Client-Side Implementation** (Recommended):
   - Buat hooks di `hooks/useDataHaven.ts`
   - Gunakan StorageHub SDK langsung di client components
   - Private key tetap di client (tidak dikirim ke server)

2. **Atau API Routes**:
   - Buat API routes di `app/api/`
   - Handle SDK calls di server
   - ⚠️ Jangan simpan private key di server!

## Fitur yang Sudah Tersedia

✅ UI Components:
- Connect Wallet
- Wallet Info & Balance
- Faucet Button
- Create Bucket Form
- Upload File Form
- File List

✅ Styling:
- Tailwind CSS
- Responsive design
- Clean UI

⏳ Perlu Implementasi:
- Integrasi StorageHub SDK
- Create bucket logic
- Upload file logic
- Download file logic
- List buckets/files

## Next Steps

1. Implementasi `hooks/useDataHaven.ts` dengan StorageHub SDK
2. Update components untuk menggunakan hooks
3. Test dengan wallet yang sudah punya balance
4. Deploy ke Vercel/Netlify
