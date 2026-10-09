"use client";

import { motion } from "framer-motion";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/components/ThemeProvider";

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";

  return (
    <button
      onClick={toggleTheme}
      aria-label="Ganti tema"
      className="relative h-9 w-9 rounded-xl border border-black/10 dark:border-white/10 bg-white/50 dark:bg-white/5 grid place-items-center overflow-hidden transition-colors hover:border-brand-500/50"
    >
      <motion.span
        key={theme}
        initial={{ y: 14, opacity: 0, rotate: -30 }}
        animate={{ y: 0, opacity: 1, rotate: 0 }}
        exit={{ y: -14, opacity: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
        className="grid place-items-center"
      >
        {isDark ? (
          <Moon className="h-4 w-4 text-brand-300" />
        ) : (
          <Sun className="h-4 w-4 text-amber-500" />
        )}
      </motion.span>
    </button>
  );
}
