"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  Archive,
  ClipboardCheck,
  LogOut,
  Menu,
  X,
  Bell,
  Shapes,
  Moon,
  Sun,
} from "lucide-react";
import { useTheme } from "next-themes";

const menuItems = [
  {
    name: "Dashboard",
    href: "/admin/dashboard",
    icon: LayoutDashboard,
  },
  {
    name: "Boxes",
    href: "/admin/boxes",
    icon: Archive,
  },
  {
    name: "Approvals",
    href: "/admin/approvals",
    icon: ClipboardCheck,
  },
];

export default function AdminRackLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();

  const [isOpen, setIsOpen] = useState(false);

  const { theme, setTheme } = useTheme();

  // FIX HYDRATION
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    setIsOpen(false);
    router.replace("/");
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#020617] text-slate-900 dark:text-white flex transition-colors duration-300">
      {/* SIDEBAR DESKTOP */}
      <aside className="hidden lg:flex flex-col w-72 bg-white dark:bg-slate-950 border-r border-slate-200 dark:border-slate-800 sticky top-0 h-screen z-50 transition-colors duration-300">
        {/* LOGO */}
        <div className="p-8">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 bg-cyan-500 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-cyan-100 dark:shadow-cyan-950 transition-transform hover:rotate-12 overflow-hidden">
              <img
                src="/icon.png"
                alt="Logo"
                className="w-7 h-7 object-contain"
              />
            </div>

            <div className="flex flex-col">
              <span className="text-lg font-black tracking-tighter text-slate-800 dark:text-white leading-none uppercase">
                PT. Gudang Baru Berkah
              </span>

              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500 mt-1">
                Inventory System
              </span>
            </div>
          </div>
        </div>

        {/* MENU */}
        <nav className="flex-1 px-4 space-y-1.5 mt-4">
          {menuItems.map((item) => {
            const isActive = pathname === item.href;

            return (
              <Link key={item.name} href={item.href}>
                <motion.div
                  whileHover={{ x: 5 }}
                  className={`
                    relative
                    flex
                    items-center
                    gap-3
                    px-5
                    py-3.5
                    rounded-2xl
                    text-sm
                    font-bold
                    transition-all
                    ${
                      isActive
                        ? "bg-cyan-50 dark:bg-cyan-500/10 text-cyan-600 dark:text-cyan-400"
                        : "text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-900"
                    }
                  `}
                >
                  {isActive && (
                    <motion.div
                      layoutId="activePill"
                      className="absolute left-0 w-1 h-6 bg-cyan-500 rounded-r-full"
                    />
                  )}

                  <item.icon
                    size={20}
                    strokeWidth={isActive ? 2.5 : 2}
                  />

                  {item.name}
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
            Sign Out
          </button>
        </div>
      </aside>

      {/* MOBILE SIDEBAR */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* OVERLAY */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 lg:hidden"
            />

            {/* DRAWER */}
            <motion.aside
              initial={{ x: -320 }}
              animate={{ x: 0 }}
              exit={{ x: -320 }}
              transition={{ type: "spring", damping: 25 }}
              className="fixed top-0 left-0 bottom-0 w-72 bg-white dark:bg-slate-950 border-r border-slate-200 dark:border-slate-800 z-50 lg:hidden flex flex-col"
            >
              {/* HEADER */}
              <div className="p-6 flex items-center justify-between border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-cyan-500 rounded-2xl flex items-center justify-center overflow-hidden">
                    <img
                      src="/icon.png"
                      alt="Logo"
                      className="w-6 h-6 object-contain"
                    />
                  </div>

                  <div>
                    <p className="text-sm font-black text-slate-800 dark:text-white uppercase">
                      PT. Gudang
                    </p>

                    <p className="text-[10px] uppercase tracking-widest text-slate-400">
                      Inventory
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-900 text-slate-500"
                >
                  <X size={20} />
                </button>
              </div>

              {/* MENU */}
              <nav className="flex-1 p-4 space-y-2">
                {menuItems.map((item) => {
                  const isActive = pathname === item.href;

                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      onClick={() => setIsOpen(false)}
                    >
                      <div
                        className={`
                          flex
                          items-center
                          gap-3
                          px-5
                          py-3.5
                          rounded-2xl
                          text-sm
                          font-bold
                          transition-all
                          ${
                            isActive
                              ? "bg-cyan-50 dark:bg-cyan-500/10 text-cyan-600 dark:text-cyan-400"
                              : "text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-900"
                          }
                        `}
                      >
                        <item.icon size={20} />
                        {item.name}
                      </div>
                    </Link>
                  );
                })}
              </nav>

              {/* LOGOUT */}
              <div className="p-4 border-t border-slate-100 dark:border-slate-800">
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-3 w-full px-5 py-4 rounded-2xl text-sm font-bold text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 transition-all"
                >
                  <LogOut size={20} />
                  Sign Out
                </button>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* CONTENT */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* HEADER */}
        <header className="sticky top-0 z-40 h-20 bg-white/70 dark:bg-slate-950/70 backdrop-blur-xl border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-6 lg:px-8 transition-colors duration-300">
          {/* LEFT */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsOpen(true)}
              className="lg:hidden p-2.5 rounded-xl bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-300"
            >
              <Menu size={22} />
            </button>

            <div className="hidden md:flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-cyan-500/10 text-cyan-500 flex items-center justify-center">
                <Shapes size={20} />
              </div>

              <div>
                <p className="text-sm font-black text-slate-800 dark:text-white">
                  Rack Administration
                </p>

                <p className="text-[10px] uppercase tracking-[0.2em] text-slate-400">
                  Control Center
                </p>
              </div>
            </div>
          </div>

          {/* RIGHT */}
          <div className="flex items-center gap-3">
            {/* THEME BUTTON */}
            <button
              onClick={() =>
                setTheme(theme === "dark" ? "light" : "dark")
              }
              className="w-11 h-11 rounded-2xl bg-slate-100 dark:bg-slate-900 hover:bg-slate-200 dark:hover:bg-slate-800 flex items-center justify-center transition-all"
            >
              {!mounted ? (
                <div className="w-4 h-4 rounded-full bg-slate-300 animate-pulse" />
              ) : theme === "dark" ? (
                <Sun size={18} className="text-amber-400" />
              ) : (
                <Moon
                  size={18}
                  className="text-slate-600 dark:text-slate-300"
                />
              )}
            </button>


            {/* PROFILE */}
            <div className="flex items-center gap-4 pl-4 border-l border-slate-200 dark:border-slate-800">
              <div className="hidden sm:block text-right">
                <p className="text-sm font-black text-slate-800 dark:text-white leading-none mb-1">
                  Admin Rack
                </p>

                <p className="text-[10px] font-bold uppercase tracking-widest text-cyan-500">
                  PT. Gudang Baru Berkah
                </p>
              </div>

              <div className="w-11 h-11 rounded-2xl border-2 border-cyan-500/20 p-0.5 shadow-sm">
                <img
                  src="https://ui-avatars.com/api/?name=Mohammad+Kevin&background=06b6d4&color=fff"
                  className="w-full h-full rounded-[14px] object-cover"
                  alt="User"
                />
              </div>
            </div>
          </div>
        </header>

        {/* MAIN */}
        <main className="flex-1 p-6 lg:p-10 max-w-7xl mx-auto w-full animate-in fade-in slide-in-from-bottom-4 duration-700">
          {children}
        </main>
      </div>
    </div>
  );
}