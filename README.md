# 🏛️ e-Desa Service

Sistem layanan administrasi desa berbasis web. Pengajuan surat, tracking status, dan pengumuman desa secara online.

---

## ✨ Fitur

### Untuk Warga
- 🔐 Daftar & login akun
- 📝 Ajukan 8 jenis surat (Domisili, Usaha, SKTM, Kelahiran, Kematian, Pindah, KTP/KK, Nikah)
- 📂 Upload dokumen pendukung (KTP/KK) ke S3 dengan signed URL (privasi)
- 📍 Tracking status dengan timeline lengkap
- 👤 Kelola profil & ubah password
- 📋 Riwayat permohonan dengan filter status
- 📢 Baca pengumuman resmi desa

### Untuk Admin
- 🛡️ Dashboard dengan statistik real-time
- 👥 Kelola data warga
- 📋 Verifikasi & ubah status permohonan dengan catatan
- 📢 CRUD pengumuman desa
- 📊 Distribusi status & jenis surat terpopuler
- 🔍 Filter & search permohonan

### Tracking Publik
- Lacak status permohonan tanpa perlu login menggunakan ID

---

## 🏗️ Tech Stack

- **Frontend**: React 18 + React Router v6 + Axios
- **Backend**: Node.js + Express + JWT + bcrypt
- **Database**: MySQL (RDS)
- **Storage**: AWS S3 (signed URL untuk privasi)
- **Deploy**: Docker + ECR + ECS Fargate + ALB
- **CI/CD**: GitHub Actions

---

## 📁 Struktur Project

```
EDESA/
├── .github/workflows/
│   ├── deploy-backend.yml
│   └── deploy-frontend.yml
├── backend/
│   ├── middleware/auth.js          # JWT auth + admin guard
│   ├── routes/
│   │   ├── auth.js                 # register, login, profile
│   │   ├── requests.js             # CRUD permohonan + S3 upload
│   │   ├── announcements.js        # pengumuman
│   │   └── admin.js                # stats & users
│   ├── db.js
│   ├── server.js
│   ├── schema.sql
│   ├── package.json
│   ├── Dockerfile
│   └── .env.example
└── frontend/
    ├── public/index.html
    ├── src/
    │   ├── api/axios.js            # axios + interceptor JWT
    │   ├── context/AuthContext.js
    │   ├── components/             # Navbar, Footer, ProtectedRoute, StatusBadge
    │   ├── pages/                  # 17 halaman (public + user + admin)
    │   ├── App.js                  # router config
    │   ├── index.js
    │   └── index.css               # design system
    ├── package.json
    ├── Dockerfile
    ├── nginx.conf
    └── .env.example
```

---

## 🚀 Setup Lokal

### Backend
```bash
cd backend
cp .env.example .env
# Edit .env: isi DB_*, JWT_SECRET, S3_BUCKET, AWS_REGION
npm install
node server.js
# → Backend running on :3000
```

### Frontend
```bash
cd frontend
cp .env.example .env
# Edit .env: REACT_APP_API_URL=http://localhost:3000
npm install
npm start
# → http://localhost:3000 (atau port lain)
```

## 🔄 Deploy via GitHub Actions

Set GitHub Secrets:
- `AWS_ACCESS_KEY_ID`
- `AWS_SECRET_ACCESS_KEY`

Push ke branch `main` → deploy otomatis. Atau trigger manual via tab "Actions" → workflow → "Run workflow".

> ⚠️ Workflow `deploy-frontend.yml` sudah berisi `API_URL` hardcoded ke ALB DNS. Kalau pindah domain, ubah env `API_URL` di workflow tersebut.
