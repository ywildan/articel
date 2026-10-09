"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight } from "lucide-react";

export default function SearchBox() {
  const router = useRouter();
  const [q, setQ] = useState("");

  function submit(e: React.FormEvent) {
    e.preventDefault();
    router.push(q.trim() ? `/search?q=${encodeURIComponent(q.trim())}` : "/search");
  }

  return (
    <form onSubmit={submit} className="flex items-center gap-3 border-b border-ink pb-2">
      <input
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Cari judul, topik, atau penulis…"
        aria-label="Cari artikel"
        className="w-full bg-transparent text-base outline-none placeholder:text-muted/60"
      />
      <button
        type="submit"
        className="inline-flex shrink-0 items-center gap-1 font-mono text-xs uppercase tracking-eyebrow text-accent transition-opacity hover:opacity-70"
      >
        Telusuri
        <ArrowRight className="h-4 w-4" />
      </button>
    </form>
  );
}
