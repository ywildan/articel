"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import type { ReactNode } from "react";

/**
 * Tombol "Kembali" yang benar-benar kembali ke halaman sebelumnya
 * (riwayat browser), dari mana pun pengunjung datang: search, beranda,
 * kategori, tag, atau sidebar. Bila tidak ada riwayat (mis. membuka
 * artikel langsung di tab baru dari Google), jatuh ke `fallback`.
 */
export default function BackButton({
  fallback = "/",
  children = "Kembali",
}: {
  fallback?: string;
  children?: ReactNode;
}) {
  const router = useRouter();

  return (
    <button
      type="button"
      onClick={() => {
        if (window.history.length > 1) {
          router.back();
        } else {
          router.push(fallback);
        }
      }}
      className="inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-eyebrow text-muted transition-colors hover:text-accent"
    >
      <ArrowLeft className="h-3.5 w-3.5" /> {children}
    </button>
  );
}
