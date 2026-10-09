"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
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

const filters = ["all", "published", "draft"] as const;
type Filter = (typeof filters)[number];
const filterLabel: Record<Filter, string> = {
  all: "Semua",
  published: "Terbit",
  draft: "Draft",
};

export default function ArticleManager({ articles }: { articles: ArticleRow[] }) {
  const router = useRouter();
  const [q, setQ] = useState("");
  const [filter, setFilter] = useState<Filter>("all");
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

  const iconBtn =
    "grid h-9 w-9 place-items-center border border-line text-muted transition-colors disabled:opacity-40";

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="flex flex-1 items-center gap-2 border border-line bg-surface px-3 focus-within:border-accent">
          <Search className="h-4 w-4 text-muted" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Cari artikel…"
            aria-label="Cari artikel"
            className="w-full bg-transparent py-2.5 text-sm outline-none"
          />
        </div>
        <div className="flex gap-1">
          {filters.map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`border px-3 py-2 font-mono text-[11px] uppercase tracking-eyebrow transition-colors ${
                filter === f
                  ? "border-accent bg-accent text-accent-ink"
                  : "border-line text-muted hover:border-ink hover:text-ink"
              }`}
            >
              {filterLabel[f]}
            </button>
          ))}
        </div>
      </div>

      <ul className="divide-y divide-line border-y border-line">
        {list.map((a) => (
          <li key={a.id} className="py-4">
            <div className="flex items-start gap-3">
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span
                    className={`inline-flex items-center gap-1 font-mono text-[10px] uppercase tracking-eyebrow ${
                      a.status === "published" ? "text-accent" : "text-muted"
                    }`}
                  >
                    {a.status === "published" ? (
                      <CheckCircle2 className="h-3 w-3" />
                    ) : (
                      <FileEdit className="h-3 w-3" />
                    )}
                    {a.status === "published" ? "Terbit" : "Draft"}
                  </span>
                  <span className="font-mono text-[10px] uppercase tracking-wide text-muted">
                    {a.category}
                  </span>
                </div>
                <Link
                  href={`/admin/artikel/${a.id}/edit`}
                  className="mt-1 block truncate font-display text-lg font-semibold tracking-tight transition-colors hover:text-accent"
                >
                  {a.title}
                </Link>
                <div className="mt-1 flex items-center gap-3 font-mono text-[11px] uppercase tracking-wide text-muted">
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
                    className={`${iconBtn} hover:border-accent hover:text-accent`}
                    aria-label="Lihat artikel"
                  >
                    <ExternalLink className="h-4 w-4" />
                  </a>
                )}
                <button
                  onClick={() => toggleStatus(a)}
                  disabled={busyId === a.id}
                  className={`${iconBtn} hover:border-accent hover:text-accent`}
                  aria-label="Ubah status"
                  title={a.status === "published" ? "Jadikan draft" : "Terbitkan"}
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
                  href={`/admin/artikel/${a.id}/edit`}
                  className={`${iconBtn} hover:border-accent hover:text-accent`}
                  aria-label="Edit"
                >
                  <Pencil className="h-4 w-4" />
                </Link>
                <button
                  onClick={() => setConfirmId(a.id)}
                  className={`${iconBtn} hover:border-danger hover:text-danger`}
                  aria-label="Hapus"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>

            {confirmId === a.id && (
              <div className="mt-3 flex items-center justify-between gap-3 border border-danger/40 bg-danger/10 px-3 py-2">
                <p className="text-xs text-danger">Hapus artikel ini permanen?</p>
                <div className="flex gap-2">
                  <button
                    onClick={() => setConfirmId(null)}
                    className="border border-line px-3 py-1 font-mono text-[11px] uppercase tracking-eyebrow text-muted hover:border-ink hover:text-ink"
                  >
                    Batal
                  </button>
                  <button
                    onClick={() => remove(a.id)}
                    disabled={busyId === a.id}
                    className="bg-danger px-3 py-1 font-mono text-[11px] uppercase tracking-eyebrow text-paper disabled:opacity-40"
                  >
                    Hapus
                  </button>
                </div>
              </div>
            )}
          </li>
        ))}
      </ul>

      {list.length === 0 && (
        <p className="py-12 text-center text-sm text-muted">
          Tidak ada artikel yang cocok.
        </p>
      )}
    </div>
  );
}
