"use client";

import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

export default function ThemeToggle() {
    const { theme, setTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setMounted(true);
    }, []);

    // Hindari hydration mismatch
    if (!mounted) {
        return (
            <div className="w-11 h-11 rounded-2xl bg-slate-100 animate-pulse" />
        );
    }

    const isDark = theme === "dark";

    return (
        <button
            onClick={() => setTheme(isDark ? "light" : "dark")}
            className="w-11 h-11 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-center transition-all hover:scale-105"
        >
            {isDark ? (
                <Sun size={18} className="text-amber-400" />
            ) : (
                <Moon size={18} className="text-slate-600 dark:text-slate-300" />
            )}
        </button>
    );
}