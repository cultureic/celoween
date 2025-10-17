"use client";
import { createContext, useContext, useEffect, useMemo, useState } from "react";

type Theme = "yellow" | "dark";
type Ctx = { theme: Theme; setTheme: (t: Theme) => void; toggle: () => void };
const ThemeCtx = createContext<Ctx | null>(null);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>("dark");

  useEffect(() => {
    const saved = typeof window !== "undefined" ? (localStorage.getItem("theme") as Theme | null) : null;
    if (saved) {
      setTheme(saved);
      const isDark = saved === "dark";
      document.documentElement.classList.toggle("theme-yellow-dark", !isDark);
      document.documentElement.classList.toggle("dark", isDark);
    } else if (typeof window !== "undefined") {
      const prefersDark = window.matchMedia?.("(prefers-color-scheme: dark)").matches;
      const initial: Theme = prefersDark ? "dark" : "yellow";
      setTheme(initial);
      if (initial === "dark") {
        document.documentElement.classList.add("dark");
        document.documentElement.classList.remove("theme-yellow-dark");
      } else {
        document.documentElement.classList.add("theme-yellow-dark");
        document.documentElement.classList.remove("dark");
      }
    }
  }, []);

  useEffect(() => {
    if (typeof document !== "undefined") {
      const isDark = theme === "dark";
      document.documentElement.classList.toggle("theme-yellow-dark", !isDark);
      document.documentElement.classList.toggle("dark", isDark);
    }
    if (typeof localStorage !== "undefined") {
      localStorage.setItem("theme", theme);
    }
  }, [theme]);

  const value = useMemo<Ctx>(() => ({
    theme,
    setTheme,
    toggle: () => setTheme((t) => (t === "dark" ? "yellow" : "dark")),
  }), [theme]);

  return <ThemeCtx.Provider value={value}>{children}</ThemeCtx.Provider>;
}

export const useTheme = () => {
  const ctx = useContext(ThemeCtx);
  if (!ctx) throw new Error("useTheme must be used within ThemeProvider");
  return ctx;
};


