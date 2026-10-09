import Link from "next/link";
import type { Metadata } from "next";
import { getCategories } from "@/lib/queries";
import EmptyState from "@/components/EmptyState";
import { Folder } from "lucide-react";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Kategori" };

export default async function CategoriesPage() {
  const categories = await getCategories();

  return (
    <div className="container-x pt-12 pb-16">
      <p className="eyebrow">Arsip</p>
      <h1 className="mt-2 font-display text-4xl font-semibold tracking-tight">
        Semua kategori
      </h1>
      <p className="mt-3 max-w-xl text-muted">
        Telusuri artikel berdasarkan topik.
      </p>

      {categories.length === 0 ? (
        <div className="mt-10">
          <EmptyState
            icon={<Folder className="h-6 w-6" />}
            title="Belum ada kategori"
            description="Kategori muncul setelah ada artikel yang diterbitkan."
          />
        </div>
      ) : (
        <ul className="mt-10 grid gap-px border border-line bg-line sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((c) => (
            <li key={c.category}>
              <Link
                href={`/kategori/${encodeURIComponent(c.category)}`}
                className="flex h-full items-center justify-between gap-4 bg-surface p-6 transition-colors hover:bg-accent-soft"
              >
                <span className="font-display text-xl font-semibold capitalize tracking-tight">
                  {c.category}
                </span>
                <span className="font-mono text-sm text-muted">{c.count}</span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
