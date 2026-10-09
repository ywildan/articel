import Link from "next/link";

export default function NotFound() {
  return (
    <div className="container-x grid min-h-[60vh] place-items-center py-24 text-center">
      <div>
        <p className="font-display text-7xl font-semibold tracking-tight text-accent">
          404
        </p>
        <h1 className="mt-4 font-display text-2xl font-semibold tracking-tight">
          Halaman tidak ditemukan
        </h1>
        <p className="mx-auto mt-2 max-w-sm text-sm leading-relaxed text-muted">
          Tautan yang kamu buka mungkin salah, atau artikelnya sudah dihapus.
        </p>
        <Link href="/" className="btn mt-8">
          Kembali ke beranda
        </Link>
      </div>
    </div>
  );
}
