import Link from "next/link";
import type { Metadata } from "next";
import { getCategories } from "@/lib/queries";
import Reveal from "@/components/Reveal";
import EmptyState from "@/components/EmptyState";
import { Folder } from "lucide-react";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Kategori" };

export default async function CategoriesPage() {
  const categories = await getCategories();

  return (
    <div className="container-x pt-32 pb-10">
      <Reveal>
        <h1 className="text-3xl font-black tracking-tight sm:text-4xl">
          Semua <span className="gradient-text">Kategori</span>
        </h1>
        <p className="mt-2 text-black/60 dark:text-white/60">
          Telusuri artikel berdasarkan topik yang kamu minati.
        </p>
      </Reveal>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {categories.length === 0 ? (
          <div className="sm:col-span-2 lg:col-span-3">
            <EmptyState
              icon={<Folder className="h-6 w-6" />}
              title="Belum ada kategori"
              description="Kategori akan muncul setelah ada artikel yang dipublikasikan."
            />
          </div>
        ) : (
          categories.map((c, i) => (
            <Reveal key={c.category} delay={i * 0.05}>
              <Link
                href={`/kategori/${encodeURIComponent(c.category)}`}
                className="glass card-hover flex items-center gap-4 rounded-2xl p-5"
              >
                <div className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-brand-500 to-fuchsia-500 text-white">
                  <Folder className="h-5 w-5" />
                </div>
                <div className="min-w-0">
                  <p className="truncate font-semibold capitalize">{c.category}</p>
                  <p className="text-xs text-black/50 dark:text-white/50">
                    {c.count} artikel
                  </p>
                </div>
              </Link>
            </Reveal>
          ))
        )}
      </div>
    </div>
  );
}
