import Link from "next/link";
import { FileQuestion } from "lucide-react";

export default function NotFound() {
  return (
    <div className="container-x grid min-h-[70vh] place-items-center pt-24 text-center">
      <div>
        <div className="mx-auto mb-6 grid h-20 w-20 place-items-center rounded-3xl bg-brand-500/10 text-brand-500">
          <FileQuestion className="h-10 w-10" />
        </div>
        <h1 className="text-6xl font-black gradient-text">404</h1>
        <p className="mt-3 text-lg font-semibold">Halaman tidak ditemukan</p>
        <p className="mt-1 text-sm text-black/60 dark:text-white/60">
          Tautan yang kamu buka mungkin salah atau artikelnya sudah dihapus.
        </p>
        <Link href="/" className="btn-primary mt-6">
          Kembali ke beranda
        </Link>
      </div>
    </div>
  );
}
