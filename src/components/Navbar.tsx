"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, PenLine, Search } from "lucide-react";
import ThemeToggle from "@/components/ThemeToggle";

const links = [
  { href: "/", label: "Beranda" },
  { href: "/kategori", label: "Kategori" },
  { href: "/search", label: "Cari" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => setOpen(false), [pathname]);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled
          ? "py-2 shadow-lg shadow-black/5"
          : "py-4 shadow-none"
      }`}
    >
      <div className="container-x">
        <nav
          className={`flex items-center justify-between rounded-2xl px-4 py-2.5 transition-all duration-300 ${
            scrolled ? "glass" : "bg-transparent"
          }`}
        >
          <Link href="/" className="group flex items-center gap-2">
            <span className="grid h-8 w-8 place-items-center rounded-lg bg-gradient-to-br from-brand-500 to-fuchsia-500 text-white shadow-lg shadow-brand-500/30 transition-transform group-hover:scale-110 group-hover:rotate-6">
              <PenLine className="h-4 w-4" />
            </span>
            <span className="text-lg font-bold tracking-tight">
              Arti<span className="gradient-text">kel</span>
            </span>
          </Link>

          <div className="hidden items-center gap-1 md:flex">
            {links.map((l) => {
              const active =
                l.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(l.href);
              return (
                <Link
                  key={l.href}
                  href={l.href}
                  className={`relative rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                    active
                      ? "text-brand-600 dark:text-brand-300"
                      : "hover:text-brand-500"
                  }`}
                >
                  {active && (
                    <motion.span
                      layoutId="nav-active"
                      className="absolute inset-0 rounded-lg bg-brand-500/10"
                      transition={{ type: "spring", stiffness: 400, damping: 32 }}
                    />
                  )}
                  <span className="relative">{l.label}</span>
                </Link>
              );
            })}
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/search"
              className="grid h-9 w-9 place-items-center rounded-xl border border-black/10 dark:border-white/10 bg-white/50 dark:bg-white/5 transition-colors hover:border-brand-500/50 md:hidden"
              aria-label="Cari"
            >
              <Search className="h-4 w-4" />
            </Link>
            <ThemeToggle />
            <Link href="/dashboard" className="btn-primary hidden sm:inline-flex">
              <PenLine className="h-4 w-4" />
              Dashboard
            </Link>
            <button
              onClick={() => setOpen((v) => !v)}
              className="grid h-9 w-9 place-items-center rounded-xl border border-black/10 dark:border-white/10 bg-white/50 dark:bg-white/5 md:hidden"
              aria-label="Menu"
            >
              {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </button>
          </div>
        </nav>

        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="glass mt-2 overflow-hidden rounded-2xl md:hidden"
            >
              <div className="flex flex-col p-2">
                {links.map((l) => (
                  <Link
                    key={l.href}
                    href={l.href}
                    className="rounded-lg px-3 py-2.5 text-sm font-medium transition-colors hover:bg-brand-500/10"
                  >
                    {l.label}
                  </Link>
                ))}
                <Link
                  href="/dashboard"
                  className="rounded-lg px-3 py-2.5 text-sm font-medium text-brand-600 dark:text-brand-300 transition-colors hover:bg-brand-500/10"
                >
                  Dashboard
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
}
