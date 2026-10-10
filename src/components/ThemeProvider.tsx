"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { flushSync } from "react-dom";

type Theme = "light" | "dark";

type ThemeContextValue = {
  theme: Theme;
  toggleTheme: () => void;
};

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>("light");

  useEffect(() => {
    const stored = localStorage.getItem("theme") as Theme | null;
    const initial: Theme =
      stored ??
      (window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light");
    setTheme(initial);
    applyTheme(initial);
  }, []);

  function applyTheme(next: Theme) {
    const root = document.documentElement;
    root.classList.toggle("dark", next === "dark");
    root.style.colorScheme = next;
  }

  function toggleTheme() {
    const next: Theme = theme === "dark" ? "light" : "dark";

    const apply = () => {
      localStorage.setItem("theme", next);
      applyTheme(next);
      flushSync(() => setTheme(next));
    };

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    // Browser tanpa View Transitions API / user mengurangi motion:
    // ganti tema instan seperti sebelumnya.
    if (!document.startViewTransition || reduceMotion) {
      apply();
      return;
    }

    // Lapisan tema LAMA yang dianimasikan terkelupas pergi, menyingkap
    // tema baru di bawahnya — ke dark terkelupas kanan ke kiri, ke light
    // sebaliknya. Cara ini bebas kedip: frame pertama lapisan lama memang
    // tampil utuh secara alami, tidak seperti meng-clip tema baru yang
    // sempat tampil utuh satu frame sebelum animasinya mulai.
    const transition = document.startViewTransition(apply);
    transition.ready
      .then(() => {
        const to =
          next === "dark" ? "inset(0 100% 0 0)" : "inset(0 0 0 100%)";
        document.documentElement.animate(
          { clipPath: ["inset(0 0 0 0)", to] },
          {
            duration: 550,
            easing: "ease-in-out",
            fill: "forwards",
            pseudoElement: "::view-transition-old(root)",
          }
        );
      })
      .catch(() => {});
  }

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme harus dipakai di dalam ThemeProvider");
  return ctx;
}
