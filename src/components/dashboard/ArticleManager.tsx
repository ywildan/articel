"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Pencil,
  Trash2,
  Eye,
  CheckCircle2,
  FileEdit,
  Loader2,
  ExternalLink,
} from "lucide-react";
import { formatDate } from "@/lib/utils";
import type { ArticleRow } from "@/lib/db";

export default function ArticleManager({
  articles,
}: {
  articles: ArticleRow[];
}) {
  const router = useRouter();
  const [q, setQ] = useState("");
  const [filter, setFilter] = useState<"all" | "published" | "draft">("all");
  const [busyId, setBusyId] = useState<number | null>(null);
  const [confirmId, setConfirmId] = useState<number | null>(null);

  const list = useMemo(() => {
    return articles.filter((a) => {
      const matchQ =
        !q ||
        a.title.toLowerCase().includes(q.toLowerCase()) ||
        a.category.toLowerCase().includes(q.toLowerCase());
      const matchF = filter === "all" || a.status === filter;
      return matchQ && matchF;
    });
  }, [articles, q, filter]);

  async function toggleStatus(a: ArticleRow) {
    setBusyId(a.id);
    const next = a.status === "published" ? "draft" : "published";
    await fetch(`/api/articles/${a.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: next }),
    });
    setBusyId(null);
    router.refresh();
  }

  async function remove(id: number) {
    setBusyId(id);
    await fetch(`/api/articles/${id}`, { method: "DELETE" });
    setBusyId(null);
    setConfirmId(null);
    router.refresh();
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="flex flex-1 items-center gap-2 rounded-xl border border-black/10 dark:border-white/10 bg-white/60 dark:bg-white/5 px-3 focus-within:border-brand-500">
          <Search className="h-4 w-4 text-black/40 dark:text-white/40" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Cari artikel..."
            className="w-full bg-transparent py-2.5 text-sm outline-none"
          />
        </div>
        <div className="glass flex gap-1 rounded-xl p-1">
          {(["all", "published", "draft"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`relative rounded-lg px-3 py-1.5 text-xs font-medium capitalize transition-colors ${
                filter === f ? "text-white" : "text-black/60 dark:text-white/60"
              }`}
            >
              {filter === f && (
                <motion.span
                  layoutId="filter-pill"
                  className="absolute inset-0 rounded-lg bg-brand-600"
                />
              )}
              <span className="relative">
                {f === "all" ? "Semua" : f === "published" ? "Rilis" : "Draft"}
              </span>
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        <AnimatePresence initial={false}>
          {list.map((a) => (
            <motion.div
              key={a.id}
              layout
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.98 }}
              className="glass rounded-2xl p-4"
            >
              <div className="flex items-start gap-3">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span
                      className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                        a.status === "published"
                          ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400"
                          : "bg-amber-500/15 text-amber-600 dark:text-amber-400"
                      }`}
                    >
                      {a.status === "published" ? (
                        <CheckCircle2 className="h-3 w-3" />
                      ) : (
                        <FileEdit className="h-3 w-3" />
                      )}
                      {a.status === "published" ? "Published" : "Draft"}
                    </span>
                    <span className="text-[10px] text-black/50 dark:text-white/50">
                      {a.category}
                    </span>
                  </div>
                  <Link
                    href={`/dashboard/artikel/${a.id}/edit`}
                    className="mt-1 block truncate font-semibold hover:text-brand-500"
                  >
                    {a.title}
                  </Link>
                  <div className="mt-1 flex items-center gap-3 text-[11px] text-black/50 dark:text-white/50">
                    <span>{formatDate(a.created_at)}</span>
                    <span className="inline-flex items-center gap-1">
                      <Eye className="h-3 w-3" /> {a.views}
                    </span>
                  </div>
                </div>

                <div className="flex shrink-0 items-center gap-1">
                  {a.status === "published" && (
                    <a
                      href={`/artikel/${a.slug}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="grid h-9 w-9 place-items-center rounded-xl border border-black/10 dark:border-white/10 text-black/50 dark:text-white/50 transition-colors hover:border-brand-500/50 hover:text-brand-500"
                      aria-label="Lihat artikel"
                    >
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  )}
                  <button
                    onClick={() => toggleStatus(a)}
                    disabled={busyId === a.id}
                    className="grid h-9 w-9 place-items-center rounded-xl border border-black/10 dark:border-white/10 text-black/50 dark:text-white/50 transition-colors hover:border-emerald-500/50 hover:text-emerald-500 disabled:opacity-50"
                    aria-label="Ubah status"
                    title={a.status === "published" ? "Jadikan draft" : "Publikasikan"}
                  >
                    {busyId === a.id ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : a.status === "published" ? (
                      <FileEdit className="h-4 w-4" />
                    ) : (
                      <CheckCircle2 className="h-4 w-4" />
                    )}
                  </button>
                  <Link
                    href={`/dashboard/artikel/${a.id}/edit`}
                    className="grid h-9 w-9 place-items-center rounded-xl border border-black/10 dark:border-white/10 text-black/50 dark:text-white/50 transition-colors hover:border-brand-500/50 hover:text-brand-500"
                    aria-label="Edit"
                  >
                    <Pencil className="h-4 w-4" />
                  </Link>
                  <button
                    onClick={() => setConfirmId(a.id)}
                    className="grid h-9 w-9 place-items-center rounded-xl border border-black/10 dark:border-white/10 text-black/50 dark:text-white/50 transition-colors hover:border-red-500/50 hover:text-red-500"
                    aria-label="Hapus"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <AnimatePresence>
                {confirmId === a.id && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="mt-3 flex items-center justify-between rounded-xl bg-red-500/10 px-3 py-2">
                      <p className="text-xs text-red-500">
                        Hapus artikel ini permanen?
                      </p>
                      <div className="flex gap-2">
                        <button
                          onClick={() => setConfirmId(null)}
                          className="rounded-lg px-3 py-1 text-xs hover:bg-black/5 dark:hover:bg-white/10"
                        >
                          Batal
                        </button>
                        <button
                          onClick={() => remove(a.id)}
                          disabled={busyId === a.id}
                          className="rounded-lg bg-red-500 px-3 py-1 text-xs text-white disabled:opacity-50"
                        >
                          Hapus
                        </button>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </AnimatePresence>

        {list.length === 0 && (
          <p className="py-12 text-center text-sm text-black/50 dark:text-white/50">
            Tidak ada artikel yang cocok.
          </p>
        )}
      </div>
    </div>
  );
}
