# Deploy ke Vercel

## Cara Deploy

### Opsi 1: Deploy via Vercel Dashboard (Recommended)

1. **Buka Vercel Dashboard:**
   - Kunjungi https://vercel.com
   - Login dengan GitHub account Anda

2. **Import Project:**
   - Klik "Add New Project"
   - Pilih repository `mukminn/data-havent`
   - Vercel akan auto-detect Next.js

3. **Configure Project:**
   - **Root Directory:** `web`
   - **Framework Preset:** Next.js
   - **Build Command:** `npm install --legacy-peer-deps && npm run build`
   - **Install Command:** `npm install --legacy-peer-deps`
   - **Output Directory:** `.next`

4. **Environment Variables:**
   - Tidak perlu set PRIVATE_KEY (akan di-handle client-side)
   - Jika perlu, bisa set di Vercel dashboard

5. **Deploy:**
   - Klik "Deploy"
   - Tunggu build selesai

### Opsi 2: Deploy via Vercel CLI

1. **Install Vercel CLI:**
```bash
npm i -g vercel
```

2. **Login:**
```bash
vercel login
```

3. **Deploy:**
```bash
cd web
vercel
```

4. **Follow prompts:**
   - Link to existing project atau create new
   - Set root directory ke `web`
   - Deploy!

## Catatan Penting

⚠️ **Environment Variables:**
- Jangan set PRIVATE_KEY di Vercel
- Private key akan di-handle client-side melalui wallet connection

⚠️ **Build Settings:**
- Gunakan `--legacy-peer-deps` karena ada dependency conflicts
- Root directory harus `web`

⚠️ **WalletConnect:**
- Project ID sudah di-set: `fa10325c22836e4627c2321df96159fd`
- Pastikan domain Vercel di-whitelist di WalletConnect dashboard jika perlu

## Setelah Deploy

1. Buka URL yang diberikan Vercel
2. Test connect wallet
3. Pastikan wallet terhubung ke DataHaven Testnet (Chain ID: 55931)

## Troubleshooting

**Build Error:**
- Pastikan menggunakan `--legacy-peer-deps`
- Check Node.js version (minimal 18)

**Wallet Connect Error:**
- Pastikan Project ID benar
- Check domain di WalletConnect dashboard

**Runtime Error:**
- Check browser console untuk error
- Pastikan semua dependencies terinstall
