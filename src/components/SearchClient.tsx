"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
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
        /* abaikan */
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
    <div className="container-x pt-32 pb-10">
      <motion.h1
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-3xl font-black tracking-tight sm:text-4xl"
      >
        Cari <span className="gradient-text">Artikel</span>
      </motion.h1>

      <div className="mt-6 flex items-center gap-2 rounded-2xl border border-black/10 dark:border-white/10 bg-white/60 dark:bg-white/5 p-2 backdrop-blur-xl focus-within:border-brand-500 focus-within:ring-4 focus-within:ring-brand-500/20">
        <Search className="ml-2 h-4 w-4 shrink-0 text-black/40 dark:text-white/40" />
        <input
          autoFocus
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Ketik kata kunci..."
          className="w-full bg-transparent px-1 py-1.5 text-sm outline-none placeholder:text-black/40 dark:placeholder:text-white/40"
        />
        {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin text-brand-500" />}
      </div>

      <div className="mt-8">
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
            {results.map((a, i) => (
              <ArticleCard key={a.id} article={a} index={i} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
