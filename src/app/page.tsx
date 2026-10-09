import Link from "next/link";
import { getPublishedArticles, getCategories, getPopularTags } from "@/lib/queries";
import Hero from "@/components/Hero";
import ArticleCard from "@/components/ArticleCard";
import EmptyState from "@/components/EmptyState";
import Reveal from "@/components/Reveal";
import { FileText, Folder, Tag as TagIcon } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [articles, categories, tags] = await Promise.all([
    getPublishedArticles({ limit: 12 }),
    getCategories(),
    getPopularTags(),
  ]);

  return (
    <>
      <Hero count={articles.length} />

      <div className="container-x grid gap-10 pb-10 lg:grid-cols-[1fr_280px]">
        <div>
          <Reveal>
            <div className="mb-6 flex items-end justify-between">
              <h2 className="text-2xl font-bold tracking-tight">
                Artikel Terbaru
              </h2>
              <Link
                href="/search"
                className="text-sm font-medium text-brand-500 hover:underline"
              >
                Lihat semua →
              </Link>
            </div>
          </Reveal>

          {articles.length === 0 ? (
            <EmptyState
              icon={<FileText className="h-6 w-6" />}
              title="Belum ada artikel"
              description="Artikel yang kamu publikasikan dari dashboard akan muncul di sini."
              action={
                <Link href="/dashboard" className="btn-primary">
                  Tulis artikel pertama
                </Link>
              }
            />
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {articles.map((a, i) => (
                <ArticleCard key={a.id} article={a} index={i} />
              ))}
            </div>
          )}
        </div>

        <aside className="space-y-6 lg:sticky lg:top-24 lg:self-start">
          <Reveal delay={0.05}>
            <div className="glass rounded-2xl p-5">
              <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold">
                <Folder className="h-4 w-4 text-brand-500" /> Kategori
              </h3>
              <div className="flex flex-wrap gap-2">
                {categories.length === 0 && (
                  <p className="text-xs text-black/50 dark:text-white/50">
                    Belum ada kategori.
                  </p>
                )}
                {categories.map((c) => (
                  <Link
                    key={c.category}
                    href={`/kategori/${encodeURIComponent(c.category)}`}
                    className="chip"
                  >
                    {c.category}
                    <span className="opacity-60">{c.count}</span>
                  </Link>
                ))}
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <div className="glass rounded-2xl p-5">
              <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold">
                <TagIcon className="h-4 w-4 text-brand-500" /> Tag Populer
              </h3>
              <div className="flex flex-wrap gap-2">
                {tags.length === 0 && (
                  <p className="text-xs text-black/50 dark:text-white/50">
                    Belum ada tag.
                  </p>
                )}
                {tags.map((t) => (
                  <Link
                    key={t.tag}
                    href={`/tag/${encodeURIComponent(t.tag)}`}
                    className="rounded-full bg-black/5 dark:bg-white/10 px-3 py-1 text-xs transition-colors hover:bg-brand-500/15 hover:text-brand-500"
                  >
                    #{t.tag}
                  </Link>
                ))}
              </div>
            </div>
          </Reveal>
        </aside>
      </div>
    </>
  );
}
