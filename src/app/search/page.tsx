import { Suspense } from "react";
import type { Metadata } from "next";
import SearchClient from "@/components/SearchClient";
import { getPublishedArticles } from "@/lib/queries";

// ISR: render sekali, sajikan dari cache, segarkan maks. tiap 60 detik
export const revalidate = 60;
export const metadata: Metadata = { title: "Cari" };

export default async function SearchPage() {
  const articles = await getPublishedArticles();

  return (
    <Suspense
      fallback={
        <div className="container-x pt-12 font-mono text-xs uppercase tracking-eyebrow text-muted">
          Memuat…
        </div>
      }
    >
      <SearchClient initialArticles={articles} />
    </Suspense>
  );
}
