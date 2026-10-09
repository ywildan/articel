# Kabar — Web Artikel

Situs artikel dan catatan panjang dengan dashboard admin, dibuat dengan **Next.js 14 (App Router) + TypeScript + Tailwind CSS**, siap deploy ke **Vercel**. Data disimpan di **Neon Postgres**. Tampilan bergaya editorial (kertas–tinta, satu aksen warna), tanpa animasi berlebihan.

## Fitur

**Publik**
- Beranda dengan daftar artikel + animasi
- Detail artikel (Markdown), tombol share, dan hitungan views
- Filter **kategori** dan **tag**
- **Pencarian** artikel real-time
- **Komentar** (dengan moderasi admin)
- **Dark mode** dengan toggle animasi

**Dashboard admin**
- Login password sederhana (via env)
- Statistik ringkas + daftar artikel
- Buat / edit / hapus artikel (editor Markdown + preview)
- Ubah status draft/published
- Moderasi komentar (approve / hapus)

## Struktur penting

```
src/
  app/                 # rute (publik + admin + api)
  components/          # komponen UI & animasi
  lib/                 # db, auth, util
  lib/schema.sql       # skema database Neon
middleware.ts          # proteksi /admin
```

## Cara deploy (tanpa install lokal)

### 1. Buat database Neon
1. Daftar di https://neon.tech dan buat project baru.
2. Buka **SQL Editor**, tempel seluruh isi `src/lib/schema.sql`, lalu **Run**.
3. Salin **connection string** (yang ada `-pooler` lebih baik).

### 2. Push ke GitHub
Upload folder ini ke sebuah repository GitHub (Vercel deploy paling mudah lewat Git).

### 3. Deploy di Vercel
1. Buka https://vercel.com → **Add New → Project** → import repo ini.
2. Framework otomatis terdeteksi **Next.js**. Tidak perlu ubah build command.
3. Di bagian **Environment Variables**, tambahkan:

   | Nama | Nilai |
   |------|-------|
   | `DATABASE_URL` | connection string Neon |
   | `ADMIN_PASSWORD` | password login admin pilihanmu |
   | `AUTH_SECRET` | string acak ≥ 32 karakter (mis. hasil `openssl rand -base64 32`) |

4. Klik **Deploy**. Vercel akan meng-install semua dependency saat build.

### 4. Buka dashboard admin
Halaman publik tidak menautkan ke admin. Akses manual `https://<domain-kamu>/login`, masukkan `ADMIN_PASSWORD`, lalu kelola artikel di `/admin`.

## Menjalankan lokal (opsional)

Kalau nanti ingin mencoba di lokal: `npm install`, salin `.env.example` jadi `.env.local` dan isi, lalu `npm run dev`.
