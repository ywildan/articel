"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  LayoutDashboard,
  FileText,
  MessageSquare,
  LogOut,
  Plus,
} from "lucide-react";

const tabs = [
  { href: "/dashboard", label: "Ringkasan", icon: LayoutDashboard, exact: true },
  { href: "/dashboard/artikel", label: "Artikel", icon: FileText, exact: false },
  { href: "/dashboard/komentar", label: "Komentar", icon: MessageSquare, exact: false },
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
    <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="glass flex gap-1 rounded-2xl p-1.5">
        {tabs.map((t) => {
          const active = t.exact
            ? pathname === t.href
            : pathname.startsWith(t.href);
          return (
            <Link
              key={t.href}
              href={t.href}
              className={`relative flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium transition-colors ${
                active
                  ? "text-white"
                  : "text-black/60 dark:text-white/60 hover:text-brand-500"
              }`}
            >
              {active && (
                <motion.span
                  layoutId="dash-tab"
                  className="absolute inset-0 rounded-xl bg-gradient-to-r from-brand-600 to-brand-500 shadow-lg shadow-brand-500/30"
                  transition={{ type: "spring", stiffness: 400, damping: 32 }}
                />
              )}
              <t.icon className="relative h-4 w-4" />
              <span className="relative hidden sm:inline">{t.label}</span>
            </Link>
          );
        })}
      </div>

      <div className="flex gap-2">
        <Link href="/dashboard/artikel/baru" className="btn-primary">
          <Plus className="h-4 w-4" /> Tulis
        </Link>
        <button
          onClick={logout}
          disabled={loggingOut}
          className="btn-ghost border border-black/10 dark:border-white/10 text-red-500 hover:bg-red-500/10"
        >
          <LogOut className="h-4 w-4" />
          <span className="hidden sm:inline">Keluar</span>
        </button>
      </div>
    </div>
  );
}
