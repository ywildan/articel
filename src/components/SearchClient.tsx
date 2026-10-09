"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Search, Loader2 } from "lucide-react";
import ArticleCard from "@/components/ArticleCard";
import EmptyState from "@/components/EmptyState";
import type { ArticleRow } from "@/lib/db";

export default function SearchClient() {
  const params = useSearchParams();
  const [q, setQ] = useState(params.get("q") ?? "");
  const [results, setResults] = useState<ArticleRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  useEffect(() => {
    const term = q.trim();
    if (!term) {
      setResults([]);
      setSearched(false);
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
  }, [q]);

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

      <div className="mt-10">
        {!searched && !loading ? (
          <EmptyState
            icon={<Search className="h-6 w-6" />}
            title="Mulai mencari"
            description="Ketik kata kunci untuk menemukan artikel berdasarkan judul, ringkasan, atau isi."
          />
        ) : results.length === 0 && searched && !loading ? (
          <EmptyState
            icon={<Search className="h-6 w-6" />}
            title="Tidak ada hasil"
            description={`Tidak ditemukan artikel untuk "${q}". Coba kata kunci lain.`}
          />
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {results.map((a) => (
              <ArticleCard key={a.id} article={a} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
