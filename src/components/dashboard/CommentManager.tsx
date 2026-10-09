"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Check,
  X,
  Trash2,
  Loader2,
  MessageSquare,
  ExternalLink,
} from "lucide-react";
import { formatDate } from "@/lib/utils";
import type { Comment } from "@/lib/db";

type Row = Comment & { article_title: string; article_slug: string };

const filters = ["all", "pending", "approved"] as const;
type Filter = (typeof filters)[number];
const filterLabel: Record<Filter, string> = {
  all: "Semua",
  pending: "Menunggu",
  approved: "Disetujui",
};

export default function CommentManager({ comments }: { comments: Row[] }) {
  const router = useRouter();
  const [filter, setFilter] = useState<Filter>("all");
  const [busyId, setBusyId] = useState<number | null>(null);
  const [confirmId, setConfirmId] = useState<number | null>(null);

  const list = useMemo(
    () =>
      comments.filter((c) =>
        filter === "all"
          ? true
          : filter === "pending"
          ? !c.approved
          : c.approved
      ),
    [comments, filter]
  );

  async function setApproved(c: Row, approved: boolean) {
    setBusyId(c.id);
    await fetch(`/api/comments/${c.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ approved }),
    });
    setBusyId(null);
    router.refresh();
  }

  async function remove(id: number) {
    setBusyId(id);
    await fetch(`/api/comments/${id}`, { method: "DELETE" });
    setBusyId(null);
    setConfirmId(null);
    router.refresh();
  }

  const iconBtn =
    "grid h-9 w-9 place-items-center border border-line transition-colors disabled:opacity-40";

  return (
    <div className="space-y-5">
      <div className="flex w-fit gap-1">
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

      <ul className="divide-y divide-line border-y border-line">
        {list.map((c) => (
          <li key={c.id} className="py-4">
            <div className="flex items-start gap-4">
              <span className="grid h-9 w-9 shrink-0 place-items-center border border-line font-mono text-sm text-accent">
                {c.author.charAt(0).toUpperCase()}
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                  <span className="text-sm font-semibold">{c.author}</span>
                  <span
                    className={`font-mono text-[10px] uppercase tracking-eyebrow ${
                      c.approved ? "text-accent" : "text-muted"
                    }`}
                  >
                    {c.approved ? "Disetujui" : "Menunggu"}
                  </span>
                  <span className="font-mono text-[11px] uppercase tracking-wide text-muted">
                    {formatDate(c.created_at)}
                  </span>
                </div>
                <p className="mt-2 whitespace-pre-wrap text-sm leading-relaxed text-ink/85">
                  {c.content}
                </p>
                <a
                  href={`/artikel/${c.article_slug}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-2 inline-flex items-center gap-1 font-mono text-[11px] uppercase tracking-wide text-accent hover:opacity-70"
                >
                  <ExternalLink className="h-3 w-3" />
                  {c.article_title}
                </a>
              </div>

              <div className="flex shrink-0 items-center gap-1">
                <button
                  onClick={() => setApproved(c, !c.approved)}
                  disabled={busyId === c.id}
                  className={`${iconBtn} ${
                    c.approved
                      ? "text-muted hover:border-danger hover:text-danger"
                      : "text-accent hover:border-accent"
                  }`}
                  title={c.approved ? "Batalkan persetujuan" : "Setujui"}
                  aria-label={c.approved ? "Batalkan persetujuan" : "Setujui"}
                >
                  {busyId === c.id ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : c.approved ? (
                    <X className="h-4 w-4" />
                  ) : (
                    <Check className="h-4 w-4" />
                  )}
                </button>
                <button
                  onClick={() => setConfirmId(c.id)}
                  className={`${iconBtn} text-muted hover:border-danger hover:text-danger`}
                  title="Hapus"
                  aria-label="Hapus"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>

            {confirmId === c.id && (
              <div className="mt-3 flex items-center justify-between gap-3 border border-danger/40 bg-danger/10 px-3 py-2">
                <p className="text-xs text-danger">Hapus komentar ini?</p>
                <div className="flex gap-2">
                  <button
                    onClick={() => setConfirmId(null)}
                    className="border border-line px-3 py-1 font-mono text-[11px] uppercase tracking-eyebrow text-muted hover:border-ink hover:text-ink"
                  >
                    Batal
                  </button>
                  <button
                    onClick={() => remove(c.id)}
                    disabled={busyId === c.id}
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
        <div className="grid place-items-center border border-dashed border-line py-14 text-center">
          <MessageSquare className="mb-3 h-6 w-6 text-accent" />
          <p className="text-sm text-muted">Tidak ada komentar di kategori ini.</p>
        </div>
      )}
    </div>
  );
}
