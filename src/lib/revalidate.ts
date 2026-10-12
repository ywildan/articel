import { revalidatePath, revalidateTag } from "next/cache";

/**
 * Segarkan semua halaman publik yang menampilkan data artikel ini
 * (beranda, indeks kategori, halaman artikel, kategori & tag terkait)
 * setelah ada perubahan dari dashboard/API admin. Halaman lain yang
 * memuat sidebar akan ikut segar sendiri lewat ISR (maks. 60 detik).
 */
export function revalidateArticlePaths(article: {
  slug: string;
  category: string;
  tags: string[];
}) {
  // Buang cache query baca publik (tag "db" di sqlCached) agar render
  // berikutnya langsung mengambil data terbaru dari database.
  revalidateTag("db");
  revalidatePath("/");
  revalidatePath("/kategori");
  revalidatePath("/search");
  revalidatePath(`/artikel/${article.slug}`);
  revalidatePath(`/kategori/${encodeURIComponent(article.category)}`);
  for (const tag of article.tags) {
    revalidatePath(`/tag/${encodeURIComponent(tag)}`);
  }
}
