"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
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

export default function CommentManager({ comments }: { comments: Row[] }) {
  const router = useRouter();
  const [filter, setFilter] = useState<"all" | "pending" | "approved">("all");
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

  return (
    <div className="space-y-4">
      <div className="glass flex w-fit gap-1 rounded-xl p-1">
        {(["all", "pending", "approved"] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`relative rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
              filter === f ? "text-white" : "text-black/60 dark:text-white/60"
            }`}
          >
            {filter === f && (
              <motion.span layoutId="cmt-filter" className="absolute inset-0 rounded-lg bg-brand-600" />
            )}
            <span className="relative capitalize">
              {f === "all" ? "Semua" : f === "pending" ? "Menunggu" : "Disetujui"}
            </span>
          </button>
        ))}
      </div>

      <div className="space-y-3">
        <AnimatePresence initial={false}>
          {list.map((c) => (
            <motion.div
              key={c.id}
              layout
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.98 }}
              className="glass rounded-2xl p-4"
            >
              <div className="flex items-start gap-3">
                <div className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-gradient-to-br from-brand-500 to-fuchsia-500 text-sm font-bold text-white">
                  {c.author.charAt(0).toUpperCase()}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-sm font-semibold">{c.author}</span>
                    <span
                      className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                        c.approved
                          ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400"
                          : "bg-amber-500/15 text-amber-600 dark:text-amber-400"
                      }`}
                    >
                      {c.approved ? "Disetujui" : "Menunggu"}
                    </span>
                    <span className="text-[11px] text-black/50 dark:text-white/50">
                      {formatDate(c.created_at)}
                    </span>
                  </div>
                  <p className="mt-1.5 whitespace-pre-wrap text-sm text-black/70 dark:text-white/70">
                    {c.content}
                  </p>
                  <a
                    href={`/artikel/${c.article_slug}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-2 inline-flex items-center gap-1 text-[11px] text-brand-500 hover:underline"
                  >
                    <ExternalLink className="h-3 w-3" />
                    {c.article_title}
                  </a>
                </div>

                <div className="flex shrink-0 items-center gap-1">
                  <button
                    onClick={() => setApproved(c, !c.approved)}
                    disabled={busyId === c.id}
                    className={`grid h-9 w-9 place-items-center rounded-xl border border-black/10 dark:border-white/10 transition-colors disabled:opacity-50 ${
                      c.approved
                        ? "text-amber-500 hover:border-amber-500/50"
                        : "text-emerald-500 hover:border-emerald-500/50"
                    }`}
                    title={c.approved ? "Batalkan persetujuan" : "Setujui"}
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
                    className="grid h-9 w-9 place-items-center rounded-xl border border-black/10 dark:border-white/10 text-black/50 dark:text-white/50 transition-colors hover:border-red-500/50 hover:text-red-500"
                    title="Hapus"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <AnimatePresence>
                {confirmId === c.id && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="mt-3 flex items-center justify-between rounded-xl bg-red-500/10 px-3 py-2">
                      <p className="text-xs text-red-500">Hapus komentar ini?</p>
                      <div className="flex gap-2">
                        <button
                          onClick={() => setConfirmId(null)}
                          className="rounded-lg px-3 py-1 text-xs hover:bg-black/5 dark:hover:bg-white/10"
                        >
                          Batal
                        </button>
                        <button
                          onClick={() => remove(c.id)}
                          disabled={busyId === c.id}
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
          <div className="glass grid place-items-center rounded-2xl py-14 text-center">
            <MessageSquare className="mb-3 h-6 w-6 text-brand-500" />
            <p className="text-sm text-black/50 dark:text-white/50">
              Tidak ada komentar di kategori ini.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
