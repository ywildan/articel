"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Search, Loader2, FileText } from "lucide-react";
import ArticleCard from "@/components/ArticleCard";
import EmptyState from "@/components/EmptyState";
import type { ArticleRow } from "@/lib/db";

const sorts = [
  { key: "latest", label: "Latest" },
  { key: "trending", label: "Trending" },
  { key: "reading", label: "Menit Baca" },
] as const;

type SortKey = (typeof sorts)[number]["key"];

function sortArticles(articles: ArticleRow[], sort: SortKey): ArticleRow[] {
  const byLatest = (a: ArticleRow, b: ArticleRow) =>
    new Date(b.created_at).getTime() - new Date(a.created_at).getTime();

  return [...articles].sort((a, b) => {
    if (sort === "trending") {
      return b.views - a.views || byLatest(a, b);
    }
    if (sort === "reading") {
      return (b.word_count ?? 0) - (a.word_count ?? 0) || byLatest(a, b);
    }
    return byLatest(a, b);
  });
}

export default function SearchClient({
  initialArticles,
}: {
  initialArticles: ArticleRow[];
}) {
  const params = useSearchParams();
  const initialQ = params.get("q") ?? "";
  const [q, setQ] = useState(initialQ);
  const [sort, setSort] = useState<SortKey>("latest");
  const [results, setResults] = useState<ArticleRow[]>(
    initialQ ? [] : initialArticles
  );
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  useEffect(() => {
    const term = q.trim();
    if (!term) {
      setResults(initialArticles);
      setSearched(false);
      setLoading(false);
      return;
    }

    let cancelled = false;
    setLoading(true);
    const timer = setTimeout(async () => {
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(term)}`);
        const data = await res.json();
        if (!cancelled) {
          setResults(data.results ?? []);
          setSearched(true);
        }
      } catch {
        /* jaringan gagal; biarkan hasil sebelumnya */
      } finally {
        if (!cancelled) setLoading(false);
      }
    }, 350);

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [q, initialArticles]);

  const sorted = useMemo(() => sortArticles(results, sort), [results, sort]);

  return (
    <div className="container-x pt-12 pb-16">
      <p className="eyebrow">Arsip</p>
      <h1 className="mt-2 font-display text-4xl font-semibold tracking-tight">
        Cari artikel
      </h1>

      <div className="mt-8 flex items-center gap-3 border-b border-ink pb-2">
        <Search className="h-4 w-4 shrink-0 text-muted" />
        <input
          autoFocus
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Ketik kata kunci…"
          aria-label="Kata kunci pencarian"
          className="w-full bg-transparent py-1 text-base outline-none placeholder:text-muted/60"
        />
        {loading && <Loader2 className="h-4 w-4 animate-spin text-accent" />}
      </div>

      <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
        <div className="flex gap-1" role="group" aria-label="Urutkan artikel">
          {sorts.map((s) => (
            <button
              key={s.key}
              onClick={() => setSort(s.key)}
              aria-pressed={sort === s.key}
              className={`border px-3 py-2 font-mono text-[11px] uppercase tracking-eyebrow transition-colors ${
                sort === s.key
                  ? "border-accent bg-accent text-accent-ink"
                  : "border-line text-muted hover:border-ink hover:text-ink"
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>
        <p className="font-mono text-[11px] uppercase tracking-wide text-muted">
          {sorted.length} artikel
          {searched && q.trim() ? ` untuk "${q.trim()}"` : ""}
        </p>
      </div>

      <div className="mt-8">
        {sorted.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {sorted.map((a) => (
              <ArticleCard key={a.id} article={a} />
            ))}
          </div>
        ) : loading ? (
          <p className="py-12 text-center font-mono text-xs uppercase tracking-eyebrow text-muted">
            Mencari…
          </p>
        ) : searched ? (
          <EmptyState
            icon={<Search className="h-6 w-6" />}
            title="Tidak ada hasil"
            description={`Tidak ditemukan artikel untuk "${q}". Coba kata kunci lain.`}
          />
        ) : (
          <EmptyState
            icon={<FileText className="h-6 w-6" />}
            title="Belum ada artikel"
            description="Artikel yang diterbitkan akan tampil di sini."
          />
        )}
      </div>
    </div>
  );
}
