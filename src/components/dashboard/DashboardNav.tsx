"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LogOut, Plus } from "lucide-react";

const tabs = [
  { href: "/dashboard", label: "Ringkasan", exact: true },
  { href: "/dashboard/artikel", label: "Artikel", exact: false },
  { href: "/dashboard/komentar", label: "Komentar", exact: false },
];

export default function DashboardNav() {
  const pathname = usePathname();
  const router = useRouter();
  const [loggingOut, setLoggingOut] = useState(false);

  async function logout() {
    setLoggingOut(true);
    await fetch("/api/auth/logout", { method: "POST" });
    router.replace("/login");
    router.refresh();
  }

  return (
    <div className="mb-8 flex flex-col gap-4 border-b border-line pb-4 sm:flex-row sm:items-center sm:justify-between">
      <nav className="flex gap-6">
        {tabs.map((t) => {
          const active = t.exact
            ? pathname === t.href
            : pathname.startsWith(t.href);
          return (
            <Link
              key={t.href}
              href={t.href}
              className={`-mb-px border-b-2 pb-3 font-mono text-xs uppercase tracking-eyebrow transition-colors ${
                active
                  ? "border-accent text-accent"
                  : "border-transparent text-muted hover:text-ink"
              }`}
            >
              {t.label}
            </Link>
          );
        })}
      </nav>

      <div className="flex gap-2">
        <Link href="/dashboard/artikel/baru" className="btn">
          <Plus className="h-4 w-4" /> Tulis
        </Link>
        <button
          onClick={logout}
          disabled={loggingOut}
          className="btn-quiet text-danger hover:border-danger hover:text-danger"
        >
          <LogOut className="h-4 w-4" />
          <span className="hidden sm:inline">Keluar</span>
        </button>
      </div>
    </div>
  );
}
