"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
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
        text: nextStatus === "published" ? "Artikel diterbitkan." : "Draft tersimpan.",
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

  const tabClass = (active: boolean) =>
    `inline-flex items-center gap-2 border-b-2 px-3 py-2 font-mono text-xs uppercase tracking-eyebrow transition-colors ${
      active
        ? "border-accent text-accent"
        : "border-transparent text-muted hover:text-ink"
    }`;

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <Link
          href="/dashboard/artikel"
          className="inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-eyebrow text-muted transition-colors hover:text-accent"
        >
          <ArrowLeft className="h-3.5 w-3.5" /> Kembali
        </Link>
        <div className="flex gap-2">
          <button
            onClick={() => save("draft")}
            disabled={saving !== null}
            className="btn-quiet"
          >
            {saving === "draft" ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Save className="h-4 w-4" />
            )}
            <span className="hidden sm:inline">Simpan draft</span>
          </button>
          <button
            onClick={() => save("published")}
            disabled={saving !== null}
            className="btn"
          >
            {saving === "published" ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
            Terbitkan
          </button>
        </div>
      </div>

      {message && (
        <div
          role="status"
          className={`flex items-center gap-2 border px-4 py-2.5 text-sm ${
            message.type === "ok"
              ? "border-accent/40 bg-accent-soft text-accent"
              : "border-danger/40 bg-danger/10 text-danger"
          }`}
        >
          {message.type === "ok" && <CheckCircle2 className="h-4 w-4" />}
          {message.text}
        </div>
      )}

      <div className="grid gap-5 lg:grid-cols-[1fr_320px]">
        <div className="space-y-5">
          <div className="border border-line bg-surface p-5">
            <label className="eyebrow">Judul</label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Judul artikel…"
              className="input mt-2 font-display text-lg"
            />

            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <div>
                <label className="eyebrow">Slug</label>
                <input
                  value={effectiveSlug}
                  onChange={(e) => {
                    setSlugTouched(true);
                    setSlug(e.target.value);
                  }}
                  placeholder="slug-artikel"
                  className="input mt-2 font-mono text-xs"
                />
              </div>
              <div>
                <label className="eyebrow">Kategori</label>
                <input
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  placeholder="teknologi"
                  className="input mt-2"
                />
              </div>
            </div>
          </div>

          <div className="border border-line bg-surface">
            <div className="flex items-center gap-1 border-b border-line px-2">
              <button onClick={() => setTab("edit")} className={tabClass(tab === "edit")}>
                <Code2 className="h-4 w-4" /> Tulis
              </button>
              <button onClick={() => setTab("preview")} className={tabClass(tab === "preview")}>
                <Eye className="h-4 w-4" /> Preview
              </button>
              <span className="ml-auto px-2 font-mono text-[11px] uppercase tracking-wide text-muted">
                Markdown
              </span>
            </div>

            {tab === "edit" ? (
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder={
                  "Tulis isi artikel dalam Markdown…\n\n# Judul\nParagraf dengan **bold**, [link](https://…), dan gambar."
                }
                rows={18}
                className="w-full resize-y bg-transparent p-5 font-mono text-sm outline-none placeholder:text-muted/50"
              />
            ) : (
              <div className="min-h-[24rem] p-5">
                {content.trim() ? (
                  <Markdown content={content} />
                ) : (
                  <p className="text-sm text-muted">
                    Belum ada isi untuk dipratinjau.
                  </p>
                )}
              </div>
            )}
          </div>
        </div>

        <aside className="space-y-5">
          <div className="border border-line bg-surface p-5">
            <label className="eyebrow">Ringkasan</label>
            <textarea
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              rows={3}
              placeholder="Ringkasan singkat untuk kartu & SEO…"
              className="input mt-2 resize-y"
            />
          </div>

          <div className="border border-line bg-surface p-5">
            <label className="eyebrow">URL gambar sampul</label>
            <input
              value={coverImage}
              onChange={(e) => setCoverImage(e.target.value)}
              placeholder="https://…"
              className="input mt-2"
            />
            {coverImage && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={coverImage}
                alt="Pratinjau sampul"
                className="mt-3 aspect-video w-full border border-line object-cover"
              />
            )}
          </div>

          <div className="border border-line bg-surface p-5">
            <label className="eyebrow">Tag (pisahkan dengan koma)</label>
            <input
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder="nextjs, vercel, web"
              className="input mt-2"
            />
          </div>

          <div className="border border-line bg-surface p-5">
            <label className="eyebrow">Status</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as "draft" | "published")}
              className="input mt-2"
            >
              <option value="draft">Draft</option>
              <option value="published">Terbit</option>
            </select>
          </div>
        </aside>
      </div>
    </div>
  );
}
