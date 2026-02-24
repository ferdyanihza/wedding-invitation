# 🚀 Deploy ke Railway (Full Stack) + MongoDB Atlas + Cloudinary

## Arsitektur
```
Frontend (Vue.js)   → Railway Service
Backend (Express)   → Railway Service  
Database            → MongoDB Atlas (gratis, 512MB)
File Upload         → Cloudinary (gratis, 25GB) ← foto & musik permanen
```

---

## Step 1 — Setup MongoDB Atlas

1. Daftar/login di https://cloud.mongodb.com
2. Buat cluster **M0 Free** → region Singapore
3. **Database Access** → Add User → username + password kuat → role: Read/Write
4. **Network Access** → Add IP → **0.0.0.0/0** (allow all)
5. **Connect** → Drivers → copy connection string
   ```
   mongodb+srv://user:password@cluster.mongodb.net/wedding_invitation?retryWrites=true&w=majority
   ```

---

## Step 2 — Setup Cloudinary (untuk foto & musik)

1. Daftar gratis di https://cloudinary.com (25GB free)
2. Dashboard → copy 3 nilai ini:
   - **Cloud Name**
   - **API Key**
   - **API Secret**

---

## Step 3 — Deploy Backend ke Railway

1. Push folder `backend` ke GitHub repository terpisah (atau monorepo)
2. https://railway.app → **New Project** → **Deploy from GitHub**
3. Set **Environment Variables** (Raw Editor):

```
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/wedding_invitation?retryWrites=true&w=majority
CLOUDINARY_CLOUD_NAME=xxxxxxxx
CLOUDINARY_API_KEY=000000000000
CLOUDINARY_API_SECRET=xxxxxxxxxxxxxxxxxxxx
JWT_SECRET=buat_random_string_32_karakter_atau_lebih
JWT_EXPIRES=7d
ADMIN_USERNAME=admin
ADMIN_PASSWORD=passwordmu
CORS_ORIGIN=https://frontend-domain.up.railway.app
NODE_ENV=production
PORT=3000
```

4. **Settings** → **Networking** → **Generate Domain** → copy URL backend
   Contoh: `https://wedding-backend-production.up.railway.app`

---

## Step 4 — Deploy Frontend ke Railway

1. Push folder `frontend` ke GitHub
2. Railway → project yang sama → **New Service** → **GitHub**
3. Set **Environment Variables**:

```
VITE_API_URL=https://wedding-backend-production.up.railway.app/api
```

4. **Settings** → **Networking** → **Generate Domain**
   Contoh: `https://wedding-frontend-production.up.railway.app`

---

## Step 5 — Update CORS Backend

Setelah dapat domain frontend, update variable di backend service:
```
CORS_ORIGIN=https://wedding-frontend-production.up.railway.app
```

Jika punya domain custom:
```
CORS_ORIGIN=https://wedding-frontend-production.up.railway.app,https://www.namaundangan.com
```

---

## Step 6 — Isi Data Awal

```bash
cd backend
MONGODB_URI="mongodb+srv://..." node scripts/seed.js
```

---

## Step 7 — Test

| URL | Keterangan |
|---|---|
| `https://frontend.up.railway.app` | Halaman undangan |
| `https://frontend.up.railway.app?to=Nama+Tamu` | Dengan nama tamu |
| `https://frontend.up.railway.app/admin/login` | Admin panel |
| `https://backend.up.railway.app/api/health` | Cek API |

---

## ✅ Keunggulan Setup Ini

- **Foto & musik permanen** — disimpan di Cloudinary, tidak hilang saat Railway redeploy
- **Database terpusat** — MongoDB Atlas selalu available
- **Gratis semua** — Railway $5 credit/bulan, Atlas 512MB, Cloudinary 25GB
- **Tidak perlu Docker** — Railway build langsung dari GitHub

---

## 🔧 Variable Lengkap Railway Backend

| Key | Value |
|---|---|
| `MONGODB_URI` | Connection string Atlas |
| `CLOUDINARY_CLOUD_NAME` | Dari dashboard Cloudinary |
| `CLOUDINARY_API_KEY` | Dari dashboard Cloudinary |
| `CLOUDINARY_API_SECRET` | Dari dashboard Cloudinary |
| `JWT_SECRET` | String random panjang |
| `JWT_EXPIRES` | `7d` |
| `ADMIN_USERNAME` | `admin` |
| `ADMIN_PASSWORD` | Password pilihan kamu |
| `CORS_ORIGIN` | URL frontend Railway |
| `NODE_ENV` | `production` |
| `PORT` | `3000` |
