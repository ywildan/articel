"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2, Eye, EyeOff } from "lucide-react";

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
    <div className="w-full max-w-sm border border-line bg-surface p-8">
      <p className="eyebrow">Admin</p>
      <h1 className="mt-2 font-display text-3xl font-semibold tracking-tight">
        Masuk dashboard
      </h1>
      <p className="mt-2 text-sm text-muted">
        Masukkan password admin untuk mengelola artikel dan komentar.
      </p>

      <form onSubmit={submit} className="mt-7 space-y-3">
        <div className="relative">
          <input
            type={show ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            aria-label="Password admin"
            autoFocus
            className="input pr-11"
          />
          <button
            type="button"
            onClick={() => setShow((v) => !v)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted transition-colors hover:text-accent"
            aria-label={show ? "Sembunyikan password" : "Tampilkan password"}
          >
            {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>

        {error && (
          <p role="alert" className="border border-danger/40 bg-danger/10 px-3 py-2 text-xs text-danger">
            {error}
          </p>
        )}

        <button type="submit" disabled={loading} className="btn w-full">
          {loading && <Loader2 className="h-4 w-4 animate-spin" />}
          Masuk
        </button>
      </form>
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="container-x grid min-h-[calc(100vh-4rem)] place-items-center py-16">
      <Suspense fallback={null}>
        <LoginForm />
      </Suspense>
    </div>
  );
}
