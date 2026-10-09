"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, Send, Loader2, CheckCircle2 } from "lucide-react";
import { formatDate } from "@/lib/utils";
import type { Comment } from "@/lib/db";

export default function CommentSection({
  articleId,
  comments,
}: {
  articleId: number;
  comments: Comment[];
}) {
  const [author, setAuthor] = useState("");
  const [email, setEmail] = useState("");
  const [content, setContent] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">(
    "idle"
  );
  const [message, setMessage] = useState("");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    setMessage("");
    try {
      const res = await fetch("/api/comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ articleId, author, email, content }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Gagal mengirim komentar");
      setStatus("done");
      setMessage("Komentar terkirim dan menunggu persetujuan admin.");
      setAuthor("");
      setEmail("");
      setContent("");
      setTimeout(() => setStatus("idle"), 4000);
    } catch (err) {
      setStatus("error");
      setMessage(err instanceof Error ? err.message : "Terjadi kesalahan");
    }
  }

  return (
    <section className="mt-14">
      <h2 className="mb-6 flex items-center gap-2 text-xl font-bold">
        <MessageCircle className="h-5 w-5 text-brand-500" />
        Komentar ({comments.length})
      </h2>

      <div className="space-y-4">
        <AnimatePresence initial={false}>
          {comments.map((c) => (
            <motion.div
              key={c.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass rounded-2xl p-4"
            >
              <div className="flex items-center gap-3">
                <div className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-gradient-to-br from-brand-500 to-fuchsia-500 text-sm font-bold text-white">
                  {c.author.charAt(0).toUpperCase()}
                </div>
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold">{c.author}</p>
                  <p className="text-[11px] text-black/50 dark:text-white/50">
                    {formatDate(c.created_at)}
                  </p>
                </div>
              </div>
              <p className="mt-3 whitespace-pre-wrap text-sm text-black/70 dark:text-white/70">
                {c.content}
              </p>
            </motion.div>
          ))}
        </AnimatePresence>

        {comments.length === 0 && (
          <p className="rounded-2xl border border-dashed border-black/10 dark:border-white/10 p-6 text-center text-sm text-black/50 dark:text-white/50">
            Belum ada komentar. Jadilah yang pertama!
          </p>
        )}
      </div>

      <form onSubmit={submit} className="glass mt-8 rounded-2xl p-5">
        <h3 className="mb-4 font-semibold">Tinggalkan komentar</h3>
        <div className="grid gap-3 sm:grid-cols-2">
          <input
            required
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            placeholder="Nama *"
            maxLength={80}
            className="input"
          />
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email (opsional, tidak ditampilkan)"
            maxLength={120}
            className="input"
          />
        </div>
        <textarea
          required
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Tulis komentarmu..."
          rows={4}
          maxLength={2000}
          className="input mt-3 resize-y"
        />

        <div className="mt-3 flex items-center justify-between gap-3">
          <p
            className={`text-xs ${
              status === "error"
                ? "text-red-500"
                : "text-black/50 dark:text-white/50"
            }`}
          >
            {message}
          </p>
          <button type="submit" disabled={status === "loading"} className="btn-primary shrink-0">
            {status === "loading" ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : status === "done" ? (
              <CheckCircle2 className="h-4 w-4" />
            ) : (
              <Send className="h-4 w-4" />
            )}
            Kirim
          </button>
        </div>
      </form>
    </section>
  );
}
