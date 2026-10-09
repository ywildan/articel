import Link from "next/link";
import { getPublishedArticles } from "@/lib/queries";
import ArticleCard from "@/components/ArticleCard";
import EmptyState from "@/components/EmptyState";
import { ArrowLeft, Folder } from "lucide-react";

export const dynamic = "force-dynamic";

type Props = { params: { slug: string } };

export async function generateMetadata({ params }: Props) {
  const name = decodeURIComponent(params.slug);
  return { title: `Kategori: ${name}` };
}

export default async function CategoryDetailPage({ params }: Props) {
  const name = decodeURIComponent(params.slug);
  const articles = await getPublishedArticles({ category: name });

  return (
    <div className="container-x pt-32 pb-10">
      <Link
        href="/kategori"
        className="btn-ghost -ml-4 mb-6 inline-flex text-sm text-black/60 dark:text-white/60"
      >
        <ArrowLeft className="h-4 w-4" /> Semua kategori
      </Link>

      <div className="mb-8 flex items-center gap-3">
        <div className="grid h-12 w-12 place-items-center rounded-xl bg-gradient-to-br from-brand-500 to-fuchsia-500 text-white">
          <Folder className="h-5 w-5" />
        </div>
        <div>
          <h1 className="text-3xl font-black tracking-tight capitalize">{name}</h1>
          <p className="text-sm text-black/60 dark:text-white/60">
            {articles.length} artikel
          </p>
        </div>
      </div>

      {articles.length === 0 ? (
        <EmptyState
          icon={<Folder className="h-6 w-6" />}
          title="Belum ada artikel di kategori ini"
        />
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {articles.map((a, i) => (
            <ArticleCard key={a.id} article={a} index={i} />
          ))}
        </div>
      )}
    </div>
  );
}
