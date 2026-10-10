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

    // Tema baru menyapu masuk menutupi tema lama:
    // ke dark dari kanan ke kiri, ke light dari arah sebaliknya.
    const transition = document.startViewTransition(apply);
    transition.ready
      .then(() => {
        const from =
          next === "dark" ? "inset(0 0 0 100%)" : "inset(0 100% 0 0)";
        document.documentElement.animate(
          { clipPath: [from, "inset(0 0 0 0)"] },
          {
            duration: 550,
            easing: "ease-in-out",
            pseudoElement: "::view-transition-new(root)",
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
