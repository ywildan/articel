import Link from "next/link";
import type { Metadata } from "next";
import { getCategories, getPopularTags } from "@/lib/queries";
import EmptyState from "@/components/EmptyState";
import { categoryLabel, formatDate } from "@/lib/utils";
import { ArrowRight, Folder } from "lucide-react";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Kategori" };

export default async function CategoriesPage() {
  const [categories, tags] = await Promise.all([
    getCategories(),
    getPopularTags(),
  ]);

  const totalArticles = categories.reduce((sum, c) => sum + c.count, 0);

  return (
    <div className="container-x pt-12 pb-16">
      <p className="eyebrow">Arsip</p>
      <h1 className="mt-2 font-display text-4xl font-semibold tracking-tight">
        Semua kategori
      </h1>
      <p className="mt-3 max-w-xl text-muted">
        Telusuri artikel berdasarkan topik.
      </p>

      {categories.length === 0 ? (
        <div className="mt-10">
          <EmptyState
            icon={<Folder className="h-6 w-6" />}
            title="Belum ada kategori"
            description="Kategori muncul setelah ada artikel yang diterbitkan."
          />
        </div>
      ) : (
        <>
          <div className="mt-8 flex flex-wrap items-center gap-x-3 border-y border-line py-3 font-mono text-[11px] uppercase tracking-wide text-muted">
            <span>{categories.length} kategori</span>
            <span aria-hidden>·</span>
            <span>{totalArticles} artikel terbit</span>
          </div>

          <ul className="mt-2">
            {categories.map((c, i) => (
              <li key={c.category} className="border-b border-line">
                <Link
                  href={`/kategori/${encodeURIComponent(c.category)}`}
                  className="group flex items-start gap-4 py-6 sm:gap-6 sm:py-7"
                >
                  <span className="pt-2 font-mono text-xs tracking-eyebrow text-accent">
                    {String(i + 1).padStart(2, "0")}
                  </span>

                  <span className="min-w-0 flex-1">
                    <span className="block font-display text-3xl font-semibold tracking-tight transition-colors group-hover:text-accent sm:text-4xl">
                      {categoryLabel(c.category)}
                    </span>
                    {c.latest_title && (
                      <span className="mt-2 block truncate text-sm text-muted">
                        Terbaru:{" "}
                        <span className="text-ink">{c.latest_title}</span>
                        {c.latest_at && (
                          <> · {formatDate(c.latest_at)}</>
                        )}
                      </span>
                    )}
                  </span>

                  <span className="flex shrink-0 items-center gap-3 pt-1.5 sm:gap-4">
                    <span className="text-right">
                      <span className="block font-display text-2xl font-semibold leading-none tracking-tight">
                        {c.count}
                      </span>
                      <span className="mt-1 block font-mono text-[10px] uppercase tracking-eyebrow text-muted">
                        artikel
                      </span>
                    </span>
                    <ArrowRight className="h-5 w-5 text-muted transition-all group-hover:translate-x-1 group-hover:text-accent" />
                  </span>
                </Link>
              </li>
            ))}
          </ul>

          {tags.length > 0 && (
            <section className="mt-14">
              <div className="border-b border-ink pb-2">
                <h2 className="font-mono text-xs uppercase tracking-eyebrow">
                  Tag populer
                </h2>
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
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
          )}
        </>
      )}
    </div>
  );
}
