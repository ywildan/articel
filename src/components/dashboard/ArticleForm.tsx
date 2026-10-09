"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Save,
  Loader2,
  Eye,
  Code2,
  ArrowLeft,
  CheckCircle2,
  Send,
} from "lucide-react";
import Markdown from "@/components/Markdown";
import { slugify } from "@/lib/utils";
import type { Article } from "@/lib/db";

type Tab = "edit" | "preview";

export default function ArticleForm({ article }: { article?: Article }) {
  const router = useRouter();
  const isEdit = Boolean(article);

  const [title, setTitle] = useState(article?.title ?? "");
  const [slug, setSlug] = useState(article?.slug ?? "");
  const [slugTouched, setSlugTouched] = useState(isEdit);
  const [excerpt, setExcerpt] = useState(article?.excerpt ?? "");
  const [category, setCategory] = useState(article?.category ?? "");
  const [tags, setTags] = useState((article?.tags ?? []).join(", "));
  const [coverImage, setCoverImage] = useState(article?.cover_image ?? "");
  const [content, setContent] = useState(article?.content ?? "");
  const [status, setStatus] = useState(article?.status ?? "draft");
  const [tab, setTab] = useState<Tab>("edit");

  const [saving, setSaving] = useState<"draft" | "published" | null>(null);
  const [message, setMessage] = useState<{ type: "ok" | "err"; text: string } | null>(null);

  const effectiveSlug = slugTouched ? slug : slugify(title);

  async function save(nextStatus: "draft" | "published") {
    setSaving(nextStatus);
    setMessage(null);
    const payload = {
      title,
      slug: effectiveSlug,
      excerpt,
      content,
      cover_image: coverImage,
      category: category || "umum",
      tags,
      status: nextStatus,
    };

    try {
      const res = await fetch(
        isEdit ? `/api/articles/${article!.id}` : "/api/articles",
        {
          method: isEdit ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || "Gagal menyimpan");

      setStatus(nextStatus);
      setMessage({
        type: "ok",
        text: nextStatus === "published" ? "Artikel dipublikasikan!" : "Draft tersimpan.",
      });
      if (!isEdit && data.slug) {
        router.replace(`/dashboard/artikel`);
      }
      router.refresh();
    } catch (err) {
      setMessage({
        type: "err",
        text: err instanceof Error ? err.message : "Gagal menyimpan",
      });
    } finally {
      setSaving(null);
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Link
          href="/dashboard/artikel"
          className="btn-ghost -ml-3 text-sm text-black/60 dark:text-white/60"
        >
          <ArrowLeft className="h-4 w-4" /> Kembali
        </Link>
        <div className="flex gap-2">
          <button
            onClick={() => save("draft")}
            disabled={saving !== null}
            className="btn-ghost border border-black/10 dark:border-white/10"
          >
            {saving === "draft" ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Save className="h-4 w-4" />
            )}
            <span className="hidden sm:inline">Simpan Draft</span>
          </button>
          <button
            onClick={() => save("published")}
            disabled={saving !== null}
            className="btn-primary"
          >
            {saving === "published" ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
            Publikasikan
          </button>
        </div>
      </div>

      {message && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm ${
            message.type === "ok"
              ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
              : "bg-red-500/10 text-red-500"
          }`}
        >
          {message.type === "ok" ? (
            <CheckCircle2 className="h-4 w-4" />
          ) : null}
          {message.text}
        </motion.div>
      )}

      <div className="grid gap-4 lg:grid-cols-[1fr_320px]">
        <div className="space-y-4">
          <div className="glass rounded-2xl p-5">
            <label className="text-xs font-semibold text-black/60 dark:text-white/60">
              Judul
            </label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Judul artikel..."
              className="input mt-1.5 text-lg font-semibold"
            />

            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              <div>
                <label className="text-xs font-semibold text-black/60 dark:text-white/60">
                  Slug
                </label>
                <input
                  value={effectiveSlug}
                  onChange={(e) => {
                    setSlugTouched(true);
                    setSlug(e.target.value);
                  }}
                  placeholder="slug-artikel"
                  className="input mt-1.5 font-mono text-xs"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-black/60 dark:text-white/60">
                  Kategori
                </label>
                <input
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  placeholder="teknologi"
                  className="input mt-1.5"
                />
              </div>
            </div>
          </div>

          <div className="glass overflow-hidden rounded-2xl">
            <div className="flex items-center gap-1 border-b border-black/5 dark:border-white/10 p-2">
              <button
                onClick={() => setTab("edit")}
                className={`flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
                  tab === "edit"
                    ? "bg-brand-500/15 text-brand-500"
                    : "text-black/60 dark:text-white/60"
                }`}
              >
                <Code2 className="h-4 w-4" /> Tulis
              </button>
              <button
                onClick={() => setTab("preview")}
                className={`flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
                  tab === "preview"
                    ? "bg-brand-500/15 text-brand-500"
                    : "text-black/60 dark:text-white/60"
                }`}
              >
                <Eye className="h-4 w-4" /> Preview
              </button>
              <span className="ml-auto px-2 text-[11px] text-black/40 dark:text-white/40">
                Markdown didukung
              </span>
            </div>

            {tab === "edit" ? (
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Tulis isi artikel dalam Markdown...&#10;&#10;# Judul&#10;Paragraf dengan **bold**, [link](https://...), dan gambar."
                rows={18}
                className="w-full resize-y bg-transparent p-5 font-mono text-sm outline-none placeholder:text-black/30 dark:placeholder:text-white/30"
              />
            ) : (
              <div className="min-h-[24rem] p-5">
                {content.trim() ? (
                  <Markdown content={content} />
                ) : (
                  <p className="text-sm text-black/40 dark:text-white/40">
                    Belum ada isi untuk dipratinjau.
                  </p>
                )}
              </div>
            )}
          </div>
        </div>

        <aside className="space-y-4">
          <div className="glass rounded-2xl p-5">
            <label className="text-xs font-semibold text-black/60 dark:text-white/60">
              Ringkasan
            </label>
            <textarea
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              rows={3}
              placeholder="Ringkasan singkat untuk kartu & SEO..."
              className="input mt-1.5 resize-y"
            />
          </div>

          <div className="glass rounded-2xl p-5">
            <label className="text-xs font-semibold text-black/60 dark:text-white/60">
              URL Gambar Sampul
            </label>
            <input
              value={coverImage}
              onChange={(e) => setCoverImage(e.target.value)}
              placeholder="https://..."
              className="input mt-1.5"
            />
            {coverImage && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={coverImage}
                alt="Pratinjau sampul"
                className="mt-3 aspect-video w-full rounded-xl object-cover"
              />
            )}
          </div>

          <div className="glass rounded-2xl p-5">
            <label className="text-xs font-semibold text-black/60 dark:text-white/60">
              Tag (pisahkan dengan koma)
            </label>
            <input
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder="nextjs, vercel, web"
              className="input mt-1.5"
            />
          </div>

          <div className="glass rounded-2xl p-5">
            <label className="text-xs font-semibold text-black/60 dark:text-white/60">
              Status
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as "draft" | "published")}
              className="input mt-1.5"
            >
              <option value="draft">Draft</option>
              <option value="published">Published</option>
            </select>
          </div>
        </aside>
      </div>
    </div>
  );
}
