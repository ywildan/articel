import { Suspense } from "react";
import type { Metadata } from "next";
import SearchClient from "@/components/SearchClient";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Cari" };

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="container-x pt-32">Memuat...</div>}>
      <SearchClient />
    </Suspense>
  );
}
