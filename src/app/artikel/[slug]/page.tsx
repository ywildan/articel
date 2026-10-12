import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import {
  getArticleBySlug,
  getApprovedComments,
  getCategories,
  getPopularTags,
  getTrendingArticles,
} from "@/lib/queries";
import Markdown from "@/components/Markdown";
import ViewBeacon from "@/components/ViewBeacon";
import SiteSidebar from "@/components/SiteSidebar";
import ShareButtons from "@/components/ShareButtons";
import CommentSection from "@/components/CommentSection";
import { formatDate, readingTime } from "@/lib/utils";
import { ArrowLeft } from "lucide-react";

// ISR: render sekali, sajikan dari cache, segarkan maks. tiap 60 detik
export const revalidate = 60;

type Props = { params: { slug: string } };

// URL kanonik untuk tombol share — halaman ini statis (ISR), jadi tidak
// bisa membaca header host per request.
const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.ywildan.web.id";

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

  const [comments, trending, categories, tags] = await Promise.all([
    getApprovedComments(article.id),
    getTrendingArticles({ limit: 5, excludeSlug: article.slug }),
    getCategories(),
    getPopularTags(),
  ]);

  const url = `${SITE_URL}/artikel/${article.slug}`;

  return (
    <div className="container-x grid gap-12 pt-10 pb-16 lg:grid-cols-[minmax(0,1fr)_280px]">
    <article className="mx-auto w-full min-w-0 max-w-3xl lg:mx-0">
      <Link
        href="/"
        className="inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-eyebrow text-muted transition-colors hover:text-accent"
      >
        <ArrowLeft className="h-3.5 w-3.5" /> Kembali
      </Link>

      <h1 className="mt-8 font-display text-4xl font-semibold leading-[1.1] tracking-tight sm:text-5xl">
        {article.title}
      </h1>

      {article.excerpt && (
        <p className="mt-5 text-xl leading-relaxed text-muted">
          {article.excerpt}
        </p>
      )}

      <div className="mt-7 flex flex-wrap items-center gap-x-4 gap-y-2 border-y border-line py-3 font-mono text-[11px] uppercase tracking-wide text-muted">
        <Link
          href={`/kategori/${encodeURIComponent(article.category)}`}
          className="text-accent transition-colors hover:text-ink"
        >
          {article.category}
        </Link>
        <span aria-hidden>·</span>
        <span>{formatDate(article.created_at)}</span>
        <span aria-hidden>·</span>
        <span>{readingTime(article.content)} menit baca</span>
        <span aria-hidden>·</span>
        <span>{article.views} views</span>
      </div>

      {article.cover_image && (
        <div className="relative mt-8 aspect-[16/9] w-full border border-line">
          <Image
            src={article.cover_image}
            alt=""
            fill
            priority
            sizes="(max-width: 1152px) 100vw, 760px"
            className="object-cover"
          />
        </div>
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

      <ViewBeacon articleId={article.id} />
      <CommentSection articleId={article.id} comments={comments} />
    </article>

    <SiteSidebar
      trending={trending}
      categories={categories}
      tags={tags}
      hideOnMobile
    />
    </div>
  );
}
