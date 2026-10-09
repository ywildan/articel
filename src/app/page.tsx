import Link from "next/link";
import { getPublishedArticles, getCategories, getPopularTags } from "@/lib/queries";
import Hero from "@/components/Hero";
import ArticleCard from "@/components/ArticleCard";
import EmptyState from "@/components/EmptyState";
import { formatDate, readingTime } from "@/lib/utils";
import { FileText } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [articles, categories, tags] = await Promise.all([
    getPublishedArticles({ limit: 13 }),
    getCategories(),
    getPopularTags(),
  ]);

  const [lead, ...rest] = articles;

  return (
    <>
      <Hero count={articles.length} />

      <div className="container-x grid gap-12 py-12 lg:grid-cols-[1fr_280px]">
        <div>
          {articles.length === 0 ? (
            <EmptyState
              icon={<FileText className="h-6 w-6" />}
              title="Belum ada artikel"
              description="Artikel yang diterbitkan akan tampil di sini."
            />
          ) : (
            <>
              <Link
                href={`/artikel/${lead.slug}`}
                className="group block border-b border-line pb-10"
              >
                <span className="eyebrow">Utama · {lead.category}</span>
                <h2 className="mt-3 max-w-2xl font-display text-3xl font-semibold leading-tight tracking-tight transition-colors group-hover:text-accent sm:text-4xl">
                  {lead.title}
                </h2>
                {lead.excerpt && (
                  <p className="mt-4 max-w-2xl text-lg leading-relaxed text-muted">
                    {lead.excerpt}
                  </p>
                )}
                <div className="mt-5 flex items-center gap-3 font-mono text-[11px] uppercase tracking-wide text-muted">
                  <span>{formatDate(lead.created_at)}</span>
                  <span aria-hidden>·</span>
                  <span>{readingTime(lead.excerpt ?? lead.title)} menit baca</span>
                </div>
              </Link>

              {rest.length > 0 && (
                <div className="mt-10">
                  <SectionHeading title="Terbaru" href="/search" hrefLabel="Lihat semua" />
                  <div className="mt-6 grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
                    {rest.map((a) => (
                      <ArticleCard key={a.id} article={a} />
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        <aside className="space-y-10 lg:sticky lg:top-24 lg:self-start">
          <div>
            <SectionHeading title="Kategori" />
            <ul className="mt-4 divide-y divide-line border-y border-line">
              {categories.length === 0 && (
                <li className="py-3 text-sm text-muted">Belum ada kategori.</li>
              )}
              {categories.map((c) => (
                <li key={c.category}>
                  <Link
                    href={`/kategori/${encodeURIComponent(c.category)}`}
                    className="flex items-center justify-between py-3 text-sm transition-colors hover:text-accent"
                  >
                    <span className="capitalize">{c.category}</span>
                    <span className="font-mono text-[11px] text-muted">{c.count}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <SectionHeading title="Tag populer" />
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
          </div>
        </aside>
      </div>
    </>
  );
}

function SectionHeading({
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
          className="font-mono text-[11px] uppercase tracking-eyebrow text-accent hover:opacity-70"
        >
          {hrefLabel} →
        </Link>
      )}
    </div>
  );
}
