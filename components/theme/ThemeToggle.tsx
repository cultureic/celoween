"use client";
import { useTheme } from "./ThemeProvider";
import { Moon, Sun } from "lucide-react";

export default function ThemeToggle() {
  const { theme, toggle } = useTheme();
  const isYellow = theme === "yellow";
  return (
    <button
      type="button"
      onClick={toggle}
      aria-pressed={isYellow}
      aria-label="Cambiar tema amarillo/negro"
      className="inline-flex items-center gap-1.5 rounded-full border-celo-border border-[0.5px] bg-transparent px-3 py-1 text-xs sm:text-sm hover:bg-celo-yellow/10 transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-celo-yellow focus-visible:ring-offset-0"
    >
      {isYellow ? <Sun className="h-4 w-4 text-black" /> : <Moon className="h-4 w-4 text-celo-yellow" />}
      <span className="hidden sm:inline">{isYellow ? "Yellow" : "Dark"}</span>
    </button>
  );
}


