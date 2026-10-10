import Link from "next/link";
import type { ArticleRow } from "@/lib/db";
import type { CategorySummary } from "@/lib/queries";
import { categoryLabel, readingMinutes } from "@/lib/utils";
import SearchBox from "@/components/SearchBox";

type Props = {
  trending: ArticleRow[];
  categories: CategorySummary[];
  tags: { tag: string; count: number }[];
  /** true = sidebar hanya tampil di layar besar (mis. halaman artikel). */
  hideOnMobile?: boolean;
};

export default function SiteSidebar({
  trending,
  categories,
  tags,
  hideOnMobile = false,
}: Props) {
  return (
    <aside
      className={`space-y-10 lg:sticky lg:top-24 lg:self-start ${
        hideOnMobile ? "hidden lg:block" : ""
      }`}
    >
      <section>
        <p className="font-mono text-xs uppercase tracking-eyebrow">
          Cari artikel
        </p>
        <div className="mt-3">
          <SearchBox />
        </div>
      </section>

      <section>
        <SidebarHeading title="Sedang trending" href="/search" hrefLabel="Lihat semua" />
        {trending.length === 0 ? (
          <p className="py-3 text-sm text-muted">Belum ada artikel.</p>
        ) : (
          <ul className="divide-y divide-line">
            {trending.map((a, i) => (
              <li key={a.id}>
                <Link
                  href={`/artikel/${a.slug}`}
                  className="group flex gap-3 py-3.5"
                >
                  <span className="font-mono text-sm text-accent">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="min-w-0">
                    <span className="block font-display text-[15px] font-medium leading-snug tracking-tight transition-colors group-hover:text-accent line-clamp-2">
                      {a.title}
                    </span>
                    <span className="mt-1.5 flex items-center gap-2 font-mono text-[11px] uppercase tracking-wide text-muted">
                      <span>{a.views} views</span>
                      <span aria-hidden>·</span>
                      <span>{readingMinutes(a.word_count)} menit baca</span>
                    </span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section>
        <SidebarHeading title="Kategori" href="/kategori" hrefLabel="Semua" />
        <ul className="divide-y divide-line border-b border-line">
          {categories.length === 0 && (
            <li className="py-3 text-sm text-muted">Belum ada kategori.</li>
          )}
          {categories.map((c) => (
            <li key={c.category}>
              <Link
                href={`/kategori/${encodeURIComponent(c.category)}`}
                className="flex items-center justify-between py-3 text-sm transition-colors hover:text-accent"
              >
                <span>{categoryLabel(c.category)}</span>
                <span className="font-mono text-[11px] text-muted">
                  {c.count}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section>
        <SidebarHeading title="Tag populer" />
        <div className="mt-4 flex flex-wrap gap-2">
          {tags.length === 0 && (
            <p className="text-sm text-muted">Belum ada tag.</p>
          )}
          {tags.map((t) => (
            <Link
              key={t.tag}
              href={`/tag/${encodeURIComponent(t.tag)}`}
              className="tag-mark"
            >
              #{t.tag}
            </Link>
          ))}
        </div>
      </section>
    </aside>
  );
}

function SidebarHeading({
  title,
  href,
  hrefLabel,
}: {
  title: string;
  href?: string;
  hrefLabel?: string;
}) {
  return (
    <div className="flex items-end justify-between border-b border-ink pb-2">
      <h2 className="font-mono text-xs uppercase tracking-eyebrow">{title}</h2>
      {href && hrefLabel && (
        <Link
          href={href}
          className="font-mono text-[11px] uppercase tracking-eyebrow text-accent transition-opacity hover:opacity-70"
        >
          {hrefLabel} →
        </Link>
      )}
    </div>
  );
}
