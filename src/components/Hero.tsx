"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Search, ArrowRight, Sparkles } from "lucide-react";

export default function Hero({ count }: { count: number }) {
  const router = useRouter();
  const [q, setQ] = useState("");

  function submit(e: React.FormEvent) {
    e.preventDefault();
    router.push(q.trim() ? `/search?q=${encodeURIComponent(q.trim())}` : "/search");
  }

  return (
    <section className="relative pt-32 pb-16 sm:pt-40 sm:pb-20">
      <div className="container-x text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mx-auto inline-flex items-center gap-2 rounded-full border border-brand-500/20 bg-brand-500/10 px-4 py-1.5 text-xs font-medium text-brand-600 dark:text-brand-300"
        >
          <Sparkles className="h-3.5 w-3.5" />
          {count} artikel tersedia untuk dibaca
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.05 }}
          className="mx-auto mt-6 max-w-3xl text-4xl font-black leading-tight tracking-tight sm:text-6xl"
        >
          Ide besar dimulai dari{" "}
          <span className="gradient-text">tulisan yang baik</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.12 }}
          className="mx-auto mt-5 max-w-xl text-base text-black/60 dark:text-white/60 sm:text-lg"
        >
          Jelajahi artikel pilihan, filter berdasarkan kategori dan tag, lalu
          bagikan pemikiranmu lewat komentar.
        </motion.p>

        <motion.form
          onSubmit={submit}
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.18 }}
          className="mx-auto mt-8 flex max-w-lg items-center gap-2 rounded-2xl border border-black/10 dark:border-white/10 bg-white/60 dark:bg-white/5 p-2 backdrop-blur-xl focus-within:border-brand-500 focus-within:ring-4 focus-within:ring-brand-500/20"
        >
          <Search className="ml-2 h-4 w-4 shrink-0 text-black/40 dark:text-white/40" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Cari artikel, topik, atau penulis..."
            className="w-full bg-transparent px-1 text-sm outline-none placeholder:text-black/40 dark:placeholder:text-white/40"
          />
          <button type="submit" className="btn-primary shrink-0 !py-2">
            Cari
            <ArrowRight className="h-4 w-4" />
          </button>
        </motion.form>
      </div>
    </section>
  );
}
