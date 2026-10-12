import Link from "next/link";
import { getPublishedArticles } from "@/lib/queries";
import { categoryLabel } from "@/lib/utils";
import ArticleCard from "@/components/ArticleCard";
import EmptyState from "@/components/EmptyState";
import { ArrowLeft, Folder } from "lucide-react";

// ISR: render sekali, sajikan dari cache, segarkan maks. tiap 60 detik
export const revalidate = 60;

type Props = { params: { slug: string } };

// Daftar kosong: kategori dirender saat pertama diminta lalu masuk
// cache ISR. Tanpa fungsi ini route [slug] dianggap dinamis penuh.
export async function generateStaticParams() {
  return [];
}

export async function generateMetadata({ params }: Props) {
  const name = decodeURIComponent(params.slug);
  return { title: `Kategori: ${categoryLabel(name)}` };
}

export default async function CategoryDetailPage({ params }: Props) {
  const name = decodeURIComponent(params.slug);
  const articles = await getPublishedArticles({ category: name });

  return (
    <div className="container-x pt-12 pb-16">
      <Link
        href="/kategori"
        className="inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-eyebrow text-muted transition-colors hover:text-accent"
      >
        <ArrowLeft className="h-3.5 w-3.5" /> Semua kategori
      </Link>

      <p className="eyebrow mt-8">Kategori</p>
      <h1 className="mt-2 font-display text-4xl font-semibold tracking-tight">
        {categoryLabel(name)}
      </h1>
      <p className="mt-3 font-mono text-sm text-muted">
        {articles.length} artikel
      </p>

      <div className="mt-10 border-t border-line pt-10">
        {articles.length === 0 ? (
          <EmptyState
            icon={<Folder className="h-6 w-6" />}
            title="Belum ada artikel di kategori ini"
          />
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {articles.map((a) => (
              <ArticleCard key={a.id} article={a} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
