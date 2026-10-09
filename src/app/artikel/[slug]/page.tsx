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
import { ArrowLeft } from "lucide-react";

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
    <article className="container-x max-w-3xl pt-10 pb-16">
      <Link
        href="/"
        className="inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-eyebrow text-muted transition-colors hover:text-accent"
      >
        <ArrowLeft className="h-3.5 w-3.5" /> Kembali
      </Link>

      <Link
        href={`/kategori/${encodeURIComponent(article.category)}`}
        className="eyebrow mt-8 inline-block text-accent"
      >
        {article.category}
      </Link>

      <h1 className="mt-3 font-display text-4xl font-semibold leading-[1.1] tracking-tight sm:text-5xl">
        {article.title}
      </h1>

      {article.excerpt && (
        <p className="mt-5 text-xl leading-relaxed text-muted">
          {article.excerpt}
        </p>
      )}

      <div className="mt-7 flex flex-wrap items-center gap-x-4 gap-y-2 border-y border-line py-3 font-mono text-[11px] uppercase tracking-wide text-muted">
        <span>{formatDate(article.created_at)}</span>
        <span aria-hidden>·</span>
        <span>{readingTime(article.content)} menit baca</span>
        <span aria-hidden>·</span>
        <span>{article.views} views</span>
      </div>

      {article.cover_image && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={article.cover_image}
          alt=""
          className="mt-8 aspect-[16/9] w-full border border-line object-cover"
        />
      )}

      <div className="mt-10">
        <Markdown content={article.content} />
      </div>

      {article.tags?.length > 0 && (
        <div className="mt-12 flex flex-wrap items-center gap-2">
          {article.tags.map((t) => (
            <Link key={t} href={`/tag/${encodeURIComponent(t)}`} className="tag-mark">
              #{t}
            </Link>
          ))}
        </div>
      )}

      <div className="mt-10 border-t border-line pt-6">
        <ShareButtons url={url} title={article.title} />
      </div>

      <CommentSection articleId={article.id} comments={comments} />
    </article>
  );
}
