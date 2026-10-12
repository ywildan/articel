import { neon } from "@neondatabase/serverless";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error(
    "DATABASE_URL belum diisi. Tambahkan connection string Neon di environment variable Vercel."
  );
}

// Jangan pasang fetchOptions cache:"no-store" di sini: opsi itu membuat
// Next.js menolak prerender halaman publik (Dynamic server usage) sehingga
// ISR tidak bisa jalan.
export const sql = neon(connectionString);

// Klien khusus query BACA halaman publik: respons fetch-nya disimpan di
// Data Cache Next.js (kedaluwarsa 60 detik, tag "db") agar render ISR
// tidak selalu menembak database. Semua mutasi dan query dashboard/admin
// WAJIB tetap memakai `sql` biasa supaya selalu dieksekusi segar. Tag
// "db" dibersihkan revalidateArticlePaths setiap ada perubahan konten.
export const sqlCached = neon(connectionString, {
  fetchOptions: { next: { revalidate: 60, tags: ["db"] } },
});

export type Article = {
  id: number;
  slug: string;
  title: string;
  excerpt: string | null;
  content: string;
  cover_image: string | null;
  category: string;
  tags: string[];
  status: "draft" | "published";
  views: number;
  created_at: string;
  updated_at: string;
};

export type Comment = {
  id: number;
  article_id: number;
  author: string;
  email: string | null;
  content: string;
  approved: boolean;
  created_at: string;
};

export type ArticleRow = Omit<Article, "content"> & {
  /** Jumlah kata dari `content`, dihitung di SQL — untuk reading time tanpa mengirim isi artikel. */
  word_count: number;
};
