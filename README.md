# 💍 Wedding Digital Invitation

Undangan Pernikahan Digital yang dibangun dengan **Express.js + Vue.js 3 + MySQL + Tailwind CSS**.

Konversi dari proyek Laravel asli ([ikblmhndra/wedding-digital-invitation](https://github.com/ikblmhndra/wedding-digital-invitation)).

---

## ✨ Fitur

| Fitur | Deskripsi |
|---|---|
| 🎴 Kartu Pembuka | Animasi cover dengan nama tamu dari URL |
| ⏳ Countdown Timer | Hitung mundur ke hari pernikahan secara real-time |
| 👫 Profil Mempelai | Detail kedua mempelai dan orang tua |
| 💕 Cerita Cinta | Narasi singkat kisah cinta |
| 📅 Info Acara | Detail akad + resepsi dengan link Google Maps |
| 📷 Galeri Foto | Masonry gallery dengan lightbox |
| 💌 Buku Tamu | Form ucapan dengan pilihan kehadiran |
| 🎁 Hadiah | QR Code transfer bank + e-wallet (GoPay, OVO) |
| 🎵 Musik Latar | Floating music player |
| ⚙️ Admin Panel | Dashboard lengkap untuk kelola semua konten |

---

## 🗂 Struktur Proyek

```
wedding-invitation/
├── backend/                   # Express.js API
│   ├── config/
│   │   └── database.js        # Konfigurasi Sequelize + MySQL
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── guestBookController.js
│   │   ├── galleryController.js
│   │   └── weddingConfigController.js
│   ├── middleware/
│   │   └── auth.js            # JWT middleware
│   ├── models/
│   │   ├── GuestBook.js
│   │   ├── Gallery.js
│   │   ├── WeddingConfig.js
│   │   └── index.js
│   ├── routes/
│   │   └── api.js
│   ├── scripts/
│   │   ├── migrate.js         # Buat tabel
│   │   └── seed.js            # Isi data awal
│   ├── uploads/               # Folder upload foto (auto-created)
│   ├── server.js              # Entry point
│   ├── .env.example
│   └── package.json
│
├── frontend/                  # Vue.js 3 SPA
│   ├── src/
│   │   ├── api/index.js       # Axios instance
│   │   ├── assets/main.css    # Tailwind + custom styles
│   │   ├── components/
│   │   │   ├── CountdownTimer.vue
│   │   │   ├── FloatingMusic.vue
│   │   │   ├── GiftCard.vue
│   │   │   ├── GuestBook.vue
│   │   │   └── PhotoGallery.vue
│   │   ├── layouts/
│   │   │   └── AdminLayout.vue
│   │   ├── router/index.js
│   │   ├── views/
│   │   │   ├── HomeView.vue   # Halaman undangan utama
│   │   │   └── admin/
│   │   │       ├── LoginView.vue
│   │   │       ├── DashboardView.vue
│   │   │       ├── GuestBookView.vue
│   │   │       ├── GalleryView.vue
│   │   │       └── ConfigView.vue
│   │   ├── App.vue
│   │   └── main.js
│   ├── index.html
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── package.json
│
├── docker-compose.yml
└── README.md
```

---

## 🚀 Cara Menjalankan

### Opsi 1: Manual (Development)

**1. Siapkan Database MySQL**
```bash
mysql -u root -p
CREATE DATABASE wedding_invitation;
EXIT;
```

**2. Setup Backend**
```bash
cd backend
cp .env.example .env
# Edit .env sesuai konfigurasi Anda

npm install
npm run migrate    # Buat tabel
npm run seed       # Isi data awal
npm run dev        # Jalankan server (port 3000)
```

**3. Setup Frontend**
```bash
cd frontend
npm install
npm run dev        # Jalankan frontend (port 5173)
```

**4. Akses Aplikasi**
- 🌐 Undangan: http://localhost:5173
- 🌐 Undangan (dengan nama tamu): http://localhost:5173?to=Nama+Tamu
- ⚙️ Admin: http://localhost:5173/admin/login
- 🔧 API: http://localhost:3000/api/health

---

### Opsi 2: Docker Compose (Production)

```bash
# Clone repo & masuk folder
cd wedding-invitation

# Jalankan semua service
docker-compose up -d

# Akses
# Frontend: http://localhost
# Backend API: http://localhost:3000
```

---

## 🔧 Konfigurasi .env Backend

```env
PORT=3000
NODE_ENV=development

# Database MySQL
DB_HOST=localhost
DB_PORT=3306
DB_NAME=wedding_invitation
DB_USER=root
DB_PASS=

# JWT Authentication
JWT_SECRET=ganti_dengan_string_random_panjang
JWT_EXPIRES=7d

# Admin credentials
ADMIN_USERNAME=admin
# Generate hash: node -e "const b=require('bcryptjs');console.log(b.hashSync('passwordAnda',10))"
ADMIN_PASSWORD_HASH=

# CORS - URL frontend
CORS_ORIGIN=http://localhost:5173

# Info pernikahan (bisa juga diatur via Admin Panel)
GROOM_NAME=Rendi
BRIDE_NAME=Mery
WEDDING_DATE=2024-12-20T08:00:00
```

---

## 📡 API Endpoints

### Public
| Method | Endpoint | Deskripsi |
|---|---|---|
| GET | `/api/config` | Data konfigurasi pernikahan |
| GET | `/api/config/qr-bank` | QR Code transfer bank |
| GET | `/api/gallery` | Daftar foto galeri |
| GET | `/api/guestbook` | Daftar ucapan (paginated) |
| POST | `/api/guestbook` | Kirim ucapan baru |

### Admin (Bearer Token)
| Method | Endpoint | Deskripsi |
|---|---|---|
| POST | `/api/auth/login` | Login admin |
| GET | `/api/auth/me` | Info user login |
| PUT | `/api/admin/config` | Update konfigurasi |
| GET | `/api/admin/guestbook` | Semua ucapan (termasuk hidden) |
| PATCH | `/api/admin/guestbook/:id/toggle` | Tampil/sembunyikan ucapan |
| DELETE | `/api/admin/guestbook/:id` | Hapus ucapan |
| POST | `/api/admin/gallery` | Upload foto |
| PUT | `/api/admin/gallery/:id` | Update info foto |
| DELETE | `/api/admin/gallery/:id` | Hapus foto |

---

## 🎨 Personalisasi

Semua teks pernikahan dapat diubah lewat **Admin Panel** (`/admin/config`) tanpa perlu edit kode:
- Nama mempelai (panggilan & lengkap)
- Data orang tua
- Tanggal & lokasi akad + resepsi
- Link Google Maps & Live Streaming
- Cerita cinta
- Musik latar (URL file MP3)
- Info rekening bank & e-wallet

### Undangan dengan Nama Tamu
Tambahkan query parameter `?to=` pada URL undangan:
```
https://yourdomain.com?to=Bapak+Ahmad+Fauzi
```

---

## 🛠 Tech Stack

| Layer | Teknologi |
|---|---|
| Runtime | Node.js 20 |
| Framework Backend | Express.js 4 |
| ORM | Sequelize 6 |
| Database | MySQL 8 |
| Auth | JWT + bcryptjs |
| Upload | Multer |
| QR Code | qrcode |
| Framework Frontend | Vue.js 3 (Composition API) |
| Routing | Vue Router 4 |
| HTTP Client | Axios |
| Styling | Tailwind CSS 3 |
| Build Tool | Vite 5 |
| Notifications | vue3-toastify |
| Container | Docker + Nginx |

---

## 📄 Lisensi

MIT License — bebas digunakan dan dimodifikasi.

---

Made with 💛 — Converted from Laravel to Node.js/Express.js
