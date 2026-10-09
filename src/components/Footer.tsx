import Link from "next/link";

const explore = [
  { href: "/", label: "Beranda" },
  { href: "/kategori", label: "Kategori" },
  { href: "/search", label: "Cari" },
];

export default function Footer() {
  return (
    <footer className="mt-20 border-t border-line">
      <div className="container-x py-12">
        <div className="grid gap-10 md:grid-cols-[2fr_1fr]">
          <div>
            <Link href="/" className="font-display text-2xl font-semibold tracking-tight">
              Kabar
            </Link>
            <p className="mt-3 max-w-sm text-sm leading-relaxed text-muted">
              Tempat membaca tulisan panjang — catatan, esai, dan laporan.
              Setiap artikel ditulis dan disunting dengan saksama sebelum
              diterbitkan.
            </p>
          </div>

          <FooterCol title="Jelajah" links={explore} />
        </div>

        <div className="mt-12 flex flex-col gap-2 border-t border-line pt-6 font-mono text-[11px] uppercase tracking-eyebrow text-muted sm:flex-row sm:items-center sm:justify-between">
          <span>© {new Date().getFullYear()} Kabar</span>
          <span>Next.js · Neon Postgres</span>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({
  title,
  links,
}: {
  title: string;
  links: { href: string; label: string }[];
}) {
  return (
    <div>
      <h4 className="eyebrow">{title}</h4>
      <ul className="mt-4 space-y-2.5 text-sm">
        {links.map((l) => (
          <li key={l.href}>
            <Link href={l.href} className="text-muted transition-colors hover:text-accent">
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
