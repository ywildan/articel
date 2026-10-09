import { notFound } from "next/navigation";
import Link from "next/link";
import { headers } from "next/headers";
import type { Metadata } from "next";
import {
  getArticleBySlug,
  getApprovedComments,
  incrementViews,
} from "@/lib/queries";
import Markdown from "@/components/Markdown";
import ShareButtons from "@/components/ShareButtons";
import CommentSection from "@/components/CommentSection";
import { formatDate, readingTime } from "@/lib/utils";
import { Clock, Eye, Folder, Tag as TagIcon, ArrowLeft } from "lucide-react";

export const dynamic = "force-dynamic";

type Props = { params: { slug: string } };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const article = await getArticleBySlug(params.slug);
  if (!article) return { title: "Artikel tidak ditemukan" };
  return {
    title: article.title,
    description: article.excerpt ?? undefined,
    openGraph: {
      title: article.title,
      description: article.excerpt ?? undefined,
      images: article.cover_image ? [article.cover_image] : undefined,
      type: "article",
    },
  };
}

export default async function ArticlePage({ params }: Props) {
  const article = await getArticleBySlug(params.slug);
  if (!article || article.status !== "published") notFound();

  // naikkan views tanpa menunggu (fire and forget)
  incrementViews(article.id).catch(() => {});

  const comments = await getApprovedComments(article.id);

  const h = headers();
  const proto = h.get("x-forwarded-proto") ?? "https";
  const host = h.get("host") ?? "localhost:3000";
  const url = `${proto}://${host}/artikel/${article.slug}`;

  return (
    <article className="container-x max-w-3xl pt-28 pb-10">
      <Link
        href="/"
        className="btn-ghost -ml-4 mb-6 inline-flex text-sm text-black/60 dark:text-white/60"
      >
        <ArrowLeft className="h-4 w-4" /> Kembali
      </Link>

      <Link
        href={`/kategori/${encodeURIComponent(article.category)}`}
        className="chip mb-4 inline-flex"
      >
        <Folder className="h-3 w-3" /> {article.category}
      </Link>

      <h1 className="text-3xl font-black leading-tight tracking-tight sm:text-5xl">
        {article.title}
      </h1>

      {article.excerpt && (
        <p className="mt-4 text-lg text-black/60 dark:text-white/60">
          {article.excerpt}
        </p>
      )}

      <div className="mt-6 flex flex-wrap items-center gap-4 border-y border-black/5 dark:border-white/10 py-4 text-xs text-black/50 dark:text-white/50">
        <span>{formatDate(article.created_at)}</span>
        <span className="inline-flex items-center gap-1">
          <Clock className="h-3.5 w-3.5" /> {readingTime(article.content)} menit baca
        </span>
        <span className="inline-flex items-center gap-1">
          <Eye className="h-3.5 w-3.5" /> {article.views} views
        </span>
      </div>

      {article.cover_image && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={article.cover_image}
          alt={article.title}
          className="mt-8 aspect-[16/9] w-full rounded-3xl object-cover"
        />
      )}

      <div className="mt-8">
        <Markdown content={article.content} />
      </div>

      {article.tags?.length > 0 && (
        <div className="mt-10 flex flex-wrap items-center gap-2">
          <TagIcon className="h-4 w-4 text-brand-500" />
          {article.tags.map((t) => (
            <Link
              key={t}
              href={`/tag/${encodeURIComponent(t)}`}
              className="rounded-full bg-black/5 dark:bg-white/10 px-3 py-1 text-xs transition-colors hover:bg-brand-500/15 hover:text-brand-500"
            >
              #{t}
            </Link>
          ))}
        </div>
      )}

      <div className="mt-8 border-t border-black/5 dark:border-white/10 pt-6">
        <ShareButtons url={url} title={article.title} />
      </div>

      <CommentSection articleId={article.id} comments={comments} />
    </article>
  );
}
