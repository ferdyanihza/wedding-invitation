# 🚂 Railway Environment Variables

## Backend Service Variables

Buka Railway → project → service **backend** → tab **Variables** → **Raw Editor**

```
MONGODB_URI=mongodb+srv://user:password@cluster.mongodb.net/wedding_invitation?retryWrites=true&w=majority
JWT_SECRET=isi_random_string_panjang_minimal_32_karakter
JWT_EXPIRES=7d
NODE_ENV=production
PORT=3000
ADMIN_USERNAME=admin
ADMIN_PASSWORD=passwordmu

# URL public backend (Settings → Networking → Generate Domain)
BACKEND_URL=https://backend-xxx.up.railway.app

# URL public frontend
CORS_ORIGIN=https://frontend-xxx.up.railway.app

# Jika pakai MySQL Railway plugin:
# DB_HOST=${{MySQL.MYSQLHOST}}
# DB_PORT=${{MySQL.MYSQLPORT}}
# DB_NAME=${{MySQL.MYSQLDATABASE}}
# DB_USER=${{MySQL.MYSQLUSER}}
# DB_PASS=${{MySQL.MYSQLPASSWORD}}
```

## Frontend Service Variables

Buka Railway → project → service **frontend** → tab **Variables**

```
# URL public backend
VITE_API_URL=https://backend-xxx.up.railway.app/api
```

## Cara dapat URL public di Railway

1. Klik service (backend atau frontend)
2. Tab **Settings**
3. Scroll ke **Networking**
4. Klik **Generate Domain**
5. Copy URL yang muncul

## Urutan deploy yang benar

1. Deploy backend dulu → generate domain → copy URL
2. Set BACKEND_URL dan CORS_ORIGIN di backend variables
3. Set VITE_API_URL di frontend variables (pakai URL backend dari step 1)
4. Deploy frontend
5. Jalankan seed: Railway CLI → `railway run node scripts/seed.js`
   atau lewat Railway shell di dashboard

## Cek apakah sudah benar

Buka: `https://backend-xxx.up.railway.app/api/health`

Response yang benar:
```json
{
  "success": true,
  "message": "Wedding Invitation API is running 💍",
  "backend_url": "https://backend-xxx.up.railway.app"
}
```

Jika `backend_url` masih "not set", berarti BACKEND_URL belum di-set di variables.
