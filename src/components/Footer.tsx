import Link from "next/link";
import { PenLine, Github, Twitter, Mail } from "lucide-react";

export default function Footer() {
  return (
    <footer className="relative z-10 mt-20 border-t border-black/5 dark:border-white/10">
      <div className="container-x py-12">
        <div className="grid gap-10 md:grid-cols-4">
          <div className="md:col-span-2">
            <Link href="/" className="flex items-center gap-2">
              <span className="grid h-8 w-8 place-items-center rounded-lg bg-gradient-to-br from-brand-500 to-fuchsia-500 text-white">
                <PenLine className="h-4 w-4" />
              </span>
              <span className="text-lg font-bold">
                Arti<span className="gradient-text">kel</span>
              </span>
            </Link>
            <p className="mt-3 max-w-sm text-sm text-black/60 dark:text-white/60">
              Tempat membaca dan mengelola tulisan. Dibangun dengan Next.js,
              Tailwind CSS, dan Neon Postgres.
            </p>
            <div className="mt-4 flex gap-2">
              {[Github, Twitter, Mail].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="grid h-9 w-9 place-items-center rounded-xl border border-black/10 dark:border-white/10 text-black/60 dark:text-white/60 transition-all hover:-translate-y-0.5 hover:border-brand-500/50 hover:text-brand-500"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-sm font-semibold">Jelajah</h4>
            <ul className="mt-3 space-y-2 text-sm text-black/60 dark:text-white/60">
              <li><Link href="/" className="transition-colors hover:text-brand-500">Beranda</Link></li>
              <li><Link href="/kategori" className="transition-colors hover:text-brand-500">Kategori</Link></li>
              <li><Link href="/search" className="transition-colors hover:text-brand-500">Cari</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold">Admin</h4>
            <ul className="mt-3 space-y-2 text-sm text-black/60 dark:text-white/60">
              <li><Link href="/login" className="transition-colors hover:text-brand-500">Login</Link></li>
              <li><Link href="/dashboard" className="transition-colors hover:text-brand-500">Dashboard</Link></li>
            </ul>
          </div>
        </div>

        <div className="mt-10 border-t border-black/5 dark:border-white/10 pt-6 text-center text-xs text-black/50 dark:text-white/50">
          © {new Date().getFullYear()} Artikel. Semua hak dilindungi.
        </div>
      </div>
    </footer>
  );
}
