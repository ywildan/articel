"use client";

import { useState } from "react";
import { Loader2, CheckCircle2, Send } from "lucide-react";
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
    <section className="mt-16 border-t border-line pt-10">
      <h2 className="font-display text-2xl font-semibold tracking-tight">
        Komentar <span className="text-muted">({comments.length})</span>
      </h2>

      <div className="mt-6">
        {comments.length === 0 ? (
          <p className="border border-dashed border-line px-4 py-8 text-center text-sm text-muted">
            Belum ada komentar. Tulis tanggapan pertama di bawah.
          </p>
        ) : (
          <ul className="divide-y divide-line">
            {comments.map((c) => (
              <li key={c.id} className="flex gap-4 py-5">
                <span className="grid h-9 w-9 shrink-0 place-items-center border border-line font-mono text-sm text-accent">
                  {c.author.charAt(0).toUpperCase()}
                </span>
                <div className="min-w-0">
                  <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                    <span className="text-sm font-semibold">{c.author}</span>
                    <span className="font-mono text-[11px] uppercase tracking-wide text-muted">
                      {formatDate(c.created_at)}
                    </span>
                  </div>
                  <p className="mt-2 whitespace-pre-wrap text-sm leading-relaxed text-ink/85">
                    {c.content}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      <form onSubmit={submit} className="mt-10 border border-line bg-surface p-5">
        <h3 className="font-display text-lg font-semibold tracking-tight">
          Tinggalkan komentar
        </h3>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
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
          placeholder="Tulis komentarmu…"
          rows={4}
          maxLength={2000}
          className="input mt-3 resize-y"
        />

        <div className="mt-4 flex items-center justify-between gap-3">
          <p
            className={`text-xs ${
              status === "error" ? "text-danger" : "text-muted"
            }`}
            role={status === "error" ? "alert" : undefined}
          >
            {message}
          </p>
          <button type="submit" disabled={status === "loading"} className="btn shrink-0">
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
