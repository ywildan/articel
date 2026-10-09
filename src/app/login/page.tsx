"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { motion } from "framer-motion";
import { Lock, Loader2, LogIn, Eye, EyeOff } from "lucide-react";

function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const next = params.get("next") || "/dashboard";

  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Login gagal");
      }
      router.replace(next);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login gagal");
      setLoading(false);
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 24, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="glass w-full max-w-sm rounded-3xl p-8"
    >
      <div className="mb-6 grid h-14 w-14 place-items-center rounded-2xl bg-gradient-to-br from-brand-500 to-fuchsia-500 text-white shadow-lg shadow-brand-500/30">
        <Lock className="h-6 w-6" />
      </div>
      <h1 className="text-2xl font-black tracking-tight">Masuk Dashboard</h1>
      <p className="mt-1 text-sm text-black/60 dark:text-white/60">
        Masukkan password admin untuk mengelola artikel.
      </p>

      <form onSubmit={submit} className="mt-6 space-y-3">
        <div className="relative">
          <input
            type={show ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            autoFocus
            className="input pr-11"
          />
          <button
            type="button"
            onClick={() => setShow((v) => !v)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-black/40 dark:text-white/40 hover:text-brand-500"
            aria-label="Tampilkan password"
          >
            {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>

        {error && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="rounded-lg bg-red-500/10 px-3 py-2 text-xs text-red-500"
          >
            {error}
          </motion.p>
        )}

        <button type="submit" disabled={loading} className="btn-primary w-full">
          {loading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <LogIn className="h-4 w-4" />
          )}
          Masuk
        </button>
      </form>
    </motion.div>
  );
}

export default function LoginPage() {
  return (
    <div className="container-x grid min-h-screen place-items-center pt-24 pb-10">
      <Suspense fallback={null}>
        <LoginForm />
      </Suspense>
    </div>
  );
}
