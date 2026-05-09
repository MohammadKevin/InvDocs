"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  FileText,
  UploadCloud,
  Menu,
  LogOut,
  Moon,
  Sun,
} from "lucide-react";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useTheme } from "next-themes";

const sidebarItems = [
  {
    name: "Dashboard",
    icon: LayoutDashboard,
    href: "/user/dashboard",
  },
  {
    name: "Explorer",
    icon: FileText,
    href: "/user/explorer",
  },
  {
    name: "Upload",
    icon: UploadCloud,
    href: "/user/upload",
  },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  const pathname = usePathname();
  const router = useRouter();

  const { theme, setTheme } = useTheme();

  const [mounted, setMounted] = useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    router.replace("/");
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#020617] text-slate-900 dark:text-white font-sans antialiased transition-colors duration-300">
      {/* MOBILE OVERLAY */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSidebarOpen(false)}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* SIDEBAR */}
      <aside
        className={`
          fixed
          top-0
          left-0
          h-full
          w-72
          z-50
          flex
          flex-col
          bg-white
          dark:bg-slate-950
          border-r
          border-slate-200
          dark:border-slate-800
          transition-all
          duration-300
          ${
            isSidebarOpen
              ? "translate-x-0"
              : "-translate-x-full lg:translate-x-0"
          }
        `}
      >
        {/* LOGO */}
        <div className="p-8 flex items-center gap-3 border-b border-slate-100 dark:border-slate-800">
          <div className="w-11 h-11 bg-cyan-500 rounded-2xl flex items-center justify-center shadow-xl shadow-cyan-200 dark:shadow-cyan-950 overflow-hidden">
            <img
              src="/icon.png"
              alt="Logo"
              className="w-7 h-7 object-contain"
            />
          </div>

          <div>
            <p className="text-[15px] font-black uppercase tracking-tight text-slate-900 dark:text-white">
              PT. Gudang Baru Berkah
            </p>

            <p className="text-[10px] uppercase tracking-[0.2em] text-slate-400">
              User Portal
            </p>
          </div>
        </div>

        {/* MENU */}
        <nav className="flex-1 mt-6 px-4 space-y-2">
          {sidebarItems.map((item) => {
            const isActive = pathname === item.href;

            return (
              <Link key={item.name} href={item.href}>
                <motion.div
                  whileHover={{ x: 5 }}
                  className={`
                    flex
                    items-center
                    gap-4
                    px-5
                    py-4
                    rounded-2xl
                    transition-all
                    relative
                    ${
                      isActive
                        ? "bg-cyan-500 text-white shadow-xl shadow-cyan-200 dark:shadow-cyan-950"
                        : "text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-900"
                    }
                  `}
                >
                  {isActive && (
                    <motion.div
                      layoutId="active-pill-user"
                      className="absolute left-0 w-1 h-6 bg-white rounded-r-full"
                    />
                  )}

                  <item.icon
                    size={20}
                    strokeWidth={isActive ? 2.5 : 2}
                  />

                  <span className="text-sm font-black uppercase tracking-widest">
                    {item.name}
                  </span>
                </motion.div>
              </Link>
            );
          })}
        </nav>

        {/* FOOTER */}
        <div className="p-6 border-t border-slate-100 dark:border-slate-800">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-5 py-4 rounded-2xl text-sm font-bold text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 transition-all"
          >
            <LogOut size={20} />
            SIGN OUT
          </button>
        </div>
      </aside>

      {/* CONTENT */}
      <div className="lg:ml-72 flex flex-col min-h-screen">
        {/* HEADER */}
        <header className="sticky top-0 z-30 h-20 bg-white/70 dark:bg-slate-950/70 backdrop-blur-xl border-b border-slate-200 dark:border-slate-800 px-6 lg:px-8 flex items-center justify-between transition-colors duration-300">
          {/* LEFT */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2.5 rounded-xl bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-300"
            >
              <Menu size={22} />
            </button>

            <div className="hidden md:block">
              <h1 className="text-sm font-black uppercase tracking-tight text-slate-900 dark:text-white">
                User Dashboard
              </h1>

              <p className="text-[10px] uppercase tracking-[0.25em] text-slate-400">
                Document Explorer
              </p>
            </div>
          </div>

          {/* RIGHT */}
          <div className="flex items-center gap-3">
            {/* THEME */}
            <button
              onClick={() =>
                setTheme(theme === "dark" ? "light" : "dark")
              }
              className="w-11 h-11 rounded-2xl bg-slate-100 dark:bg-slate-900 hover:bg-slate-200 dark:hover:bg-slate-800 flex items-center justify-center transition-all"
            >
              {mounted ? (
                theme === "dark" ? (
                  <Sun
                    size={18}
                    className="text-amber-400"
                  />
                ) : (
                  <Moon
                    size={18}
                    className="text-slate-600 dark:text-slate-300"
                  />
                )
              ) : (
                <div className="w-[18px] h-[18px]" />
              )}
            </button>

            {/* PROFILE */}
            <div className="flex items-center gap-4 pl-4 border-l border-slate-200 dark:border-slate-800">
              <div className="hidden sm:block text-right">
                <p className="text-sm font-black text-slate-800 dark:text-white leading-none mb-1">
                  User
                </p>

                <p className="text-[10px] font-bold uppercase tracking-widest text-cyan-500">
                  PT. Gudang Baru Berkah
                </p>
              </div>

              <div className="w-11 h-11 rounded-2xl border-2 border-cyan-500/20 p-0.5 shadow-sm">
                <img
                  src="https://ui-avatars.com/api/?name=User&background=06b6d4&color=fff"
                  alt="User"
                  className="w-full h-full rounded-[14px] object-cover"
                />
              </div>
            </div>
          </div>
        </header>

        {/* MAIN */}
        <main className="flex-1 p-6 lg:p-10">
          <div className="max-w-7xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}