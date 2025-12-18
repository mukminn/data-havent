# 🔐 Panduan Keamanan - DataHaven Project

## ⚠️ PERINGATAN PENTING

**JANGAN PERNAH:**
- ❌ Commit file `.env` ke Git
- ❌ Share private key ke siapapun
- ❌ Gunakan wallet dengan dana real untuk testing
- ❌ Hardcode private key di source code
- ❌ Upload private key ke cloud storage tanpa enkripsi

## 📋 Checklist Keamanan

### ✅ Sebelum Memulai

1. **Pastikan `.env` ada di `.gitignore`**
   ```bash
   # Cek apakah .env sudah ada di .gitignore
   cat .gitignore | grep .env
   ```

2. **Jangan gunakan wallet utama**
   - Buat wallet terpisah khusus untuk testing
   - Gunakan testnet untuk development
   - Jangan transfer dana real ke wallet testing

3. **Gunakan environment variables**
   - Simpan semua sensitive data di `.env`
   - Jangan hardcode di source code
   - Gunakan `dotenv` untuk load variables

### ✅ Saat Development

1. **Generate Test Wallet**
   ```bash
   npm run generate-wallet
   ```
   - Script ini akan generate wallet baru untuk testing
   - Copy private key ke file `.env`
   - Jangan commit file `.env`

2. **Validasi Private Key**
   - Pastikan private key dimulai dengan `0x`
   - Panjang private key harus 66 karakter
   - Jangan gunakan default/placeholder key

3. **Network Selection**
   - Gunakan `testnet` untuk testing
   - Gunakan `devnet` untuk local development
   - Jangan gunakan `mainnet` kecuali production

### ✅ Sebelum Commit ke Git

1. **Cek file yang akan di-commit**
   ```bash
   git status
   ```

2. **Pastikan tidak ada file sensitive**
   - ❌ `.env`
   - ❌ `*.key`
   - ❌ `*.pem`
   - ❌ File dengan private key

3. **Verifikasi `.gitignore`**
   ```bash
   git check-ignore .env
   # Harus return: .env
   ```

## 🛡️ Best Practices

### 1. Environment Variables

**✅ BENAR:**
```typescript
// .env file
PRIVATE_KEY=0x1234...
NETWORK=testnet
```

```typescript
// clientService.ts
const privateKey = process.env.PRIVATE_KEY;
```

**❌ SALAH:**
```typescript
// JANGAN hardcode!
const privateKey = '0x1234...';
```

### 2. Private Key Management

**✅ BENAR:**
- Simpan di `.env` (local development)
- Gunakan secret management service (production)
- Enkripsi untuk storage jangka panjang

**❌ SALAH:**
- Hardcode di source code
- Commit ke Git
- Share via email/chat

### 3. Network Selection

**✅ BENAR:**
```env
# .env
NETWORK=testnet  # untuk testing
```

**❌ SALAH:**
```env
NETWORK=mainnet  # jangan untuk development!
```

## 🔒 Production Security

Jika deploy ke production:

1. **Gunakan Secret Management**
   - AWS Secrets Manager
   - HashiCorp Vault
   - Azure Key Vault
   - Environment variables di hosting platform

2. **Access Control**
   - Limit akses ke production secrets
   - Gunakan role-based access
   - Audit log untuk akses secrets

3. **Monitoring**
   - Monitor aktivitas wallet
   - Alert untuk transaksi mencurigakan
   - Log semua operasi penting

## 📚 Resources

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Ethereum Security Best Practices](https://consensys.github.io/smart-contract-best-practices/)
- [Node.js Security Best Practices](https://nodejs.org/en/docs/guides/security/)

## 🆘 Jika Private Key Terbocor

1. **SEGERA transfer semua dana** ke wallet baru
2. **Jangan gunakan wallet tersebut lagi**
3. **Generate wallet baru** untuk project
4. **Update semua environment variables**
5. **Review akses ke repository** (jika key ter-commit)

## ✅ Checklist Final

Sebelum menggunakan project ini, pastikan:

- [ ] File `.env` sudah dibuat
- [ ] Private key sudah di-set (bukan default)
- [ ] File `.env` ada di `.gitignore`
- [ ] Network di-set ke `testnet` atau `devnet`
- [ ] Wallet yang digunakan adalah test wallet (bukan main wallet)
- [ ] Tidak ada hardcoded private key di source code
- [ ] Sudah membaca dan memahami panduan ini

---

**Ingat: Keamanan adalah tanggung jawab Anda!**

