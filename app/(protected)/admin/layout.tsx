"use client";

import React, { useEffect, useState } from "react";

import Link from "next/link";

import {
  usePathname,
  useRouter,
} from "next/navigation";

import {
  motion,
  AnimatePresence,
} from "framer-motion";

import {
  LayoutDashboard,
  Archive,
  ClipboardCheck,
  LogOut,
  Menu,
  X,
  Shapes,
  Moon,
  Sun,
} from "lucide-react";

import { useTheme } from "next-themes";

import { api } from "@/lib/api";

type Rack = {
  id: string;
  name_rack: string;
  divisi: string;
};

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

  const [isOpen, setIsOpen] =
    useState(false);

  const [mounted, setMounted] =
    useState(false);

  const [rack, setRack] =
    useState<Rack | null>(null);

  const { theme, setTheme } =
    useTheme();

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);

    // eslint-disable-next-line react-hooks/immutability
    fetchRack();
  }, []);

  async function fetchRack() {
    try {
      const res =
        await api.get("/rack/my");

      const data =
        res.data?.data ||
        res.data;

      if (Array.isArray(data)) {
        setRack(data[0] || null);
      } else {
        setRack(data);
      }
    } catch (error) {
      console.error(
        "Fetch rack error:",
        error
      );
    }
  }

  const handleLogout = () => {
    localStorage.clear();

    setIsOpen(false);

    router.replace("/");
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#020617] text-slate-900 dark:text-white flex transition-colors duration-300">
      <aside className="hidden lg:flex flex-col w-72 bg-white dark:bg-slate-950 border-r border-slate-200 dark:border-slate-800 sticky top-0 h-screen z-50">
        <div className="p-8">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 bg-cyan-500 rounded-2xl flex items-center justify-center text-white overflow-hidden">
              <img
                src="/icon.png"
                alt="Logo"
                className="w-7 h-7 object-contain"
              />
            </div>

            <div className="flex flex-col">
              <span className="text-lg font-black tracking-tighter uppercase">
                PT. Gudang Baru
              </span>

              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 mt-1">
                Inventory System
              </span>
            </div>
          </div>
        </div>

        <nav className="flex-1 px-4 space-y-1.5 mt-4">
          {menuItems.map((item) => {
            const isActive =
              pathname === item.href;

            return (
              <Link
                key={item.name}
                href={item.href}
              >
                <motion.div
                  whileHover={{
                    x: 5,
                  }}
                  className={`
                    relative flex items-center gap-3 px-5 py-3.5 rounded-2xl text-sm font-bold transition-all
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

                  <item.icon size={20} />

                  {item.name}
                </motion.div>
              </Link>
            );
          })}
        </nav>

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

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{
                opacity: 0,
              }}
              animate={{
                opacity: 1,
              }}
              exit={{
                opacity: 0,
              }}
              onClick={() =>
                setIsOpen(false)
              }
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 lg:hidden"
            />

            <motion.aside
              initial={{
                x: -320,
              }}
              animate={{
                x: 0,
              }}
              exit={{
                x: -320,
              }}
              transition={{
                type: "spring",
                damping: 24,
                stiffness: 220,
              }}
              className="fixed top-0 left-0 z-[60] h-screen w-[300px] bg-white dark:bg-slate-950 border-r border-slate-200 dark:border-slate-800 flex flex-col lg:hidden"
            >
              <div className="h-20 px-6 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 bg-cyan-500 rounded-2xl flex items-center justify-center overflow-hidden">
                    <img
                      src="/icon.png"
                      alt="Logo"
                      className="w-7 h-7 object-contain"
                    />
                  </div>

                  <div>
                    <p className="font-black text-sm">
                      PT. Gudang Baru Berkah
                    </p>

                    <p className="text-[10px] uppercase tracking-widest text-slate-400">
                      Inventory
                    </p>
                  </div>
                </div>

                <button
                  onClick={() =>
                    setIsOpen(false)
                  }
                  className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-900 flex items-center justify-center"
                >
                  <X size={18} />
                </button>
              </div>

              <nav className="flex-1 p-4 space-y-2">
                {menuItems.map(
                  (item) => {
                    const isActive =
                      pathname ===
                      item.href;

                    return (
                      <Link
                        key={
                          item.name
                        }
                        href={
                          item.href
                        }
                        onClick={() =>
                          setIsOpen(
                            false
                          )
                        }
                      >
                        <div
                          className={`flex items-center gap-3 px-5 py-4 rounded-2xl text-sm font-bold transition-all ${
                            isActive
                              ? "bg-cyan-500 text-white"
                              : "text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-900"
                          }`}
                        >
                          <item.icon
                            size={
                              20
                            }
                          />

                          {
                            item.name
                          }
                        </div>
                      </Link>
                    );
                  }
                )}
              </nav>

              <div className="p-4 border-t border-slate-200 dark:border-slate-800">
                <button
                  onClick={
                    handleLogout
                  }
                  className="w-full flex items-center gap-3 px-5 py-4 rounded-2xl text-sm font-bold text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 transition-all"
                >
                  <LogOut
                    size={20}
                  />
                  Sign Out
                </button>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      <div className="flex-1 flex flex-col min-w-0">
        <header className="sticky top-0 z-40 h-20 bg-white/70 dark:bg-slate-950/70 backdrop-blur-xl border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <button
              onClick={() =>
                setIsOpen(true)
              }
              className="lg:hidden p-2.5 rounded-xl bg-slate-100 dark:bg-slate-900"
            >
              <Menu size={22} />
            </button>

            <div className="hidden md:flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-cyan-500/10 text-cyan-500 flex items-center justify-center">
                <Shapes size={20} />
              </div>

              <div>
                <p className="text-sm font-black text-slate-800 dark:text-white">
                  {rack?.name_rack ||
                    "Rack Administration"}
                </p>

                <p className="text-[10px] uppercase tracking-[0.2em] text-slate-400">
                  {rack?.divisi ||
                    "Control Center"}
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() =>
                setTheme(
                  theme ===
                    "dark"
                    ? "light"
                    : "dark"
                )
              }
              className="w-11 h-11 rounded-2xl bg-slate-100 dark:bg-slate-900 hover:bg-slate-200 dark:hover:bg-slate-800 flex items-center justify-center transition-all"
            >
              {!mounted ? (
                <div className="w-4 h-4 rounded-full bg-slate-300 animate-pulse" />
              ) : theme ===
                "dark" ? (
                <Sun
                  size={18}
                  className="text-amber-400"
                />
              ) : (
                <Moon
                  size={18}
                />
              )}
            </button>

            <div className="flex items-center gap-4 pl-4 border-l border-slate-200 dark:border-slate-800">
              <div className="hidden sm:block text-right">
                <p className="text-sm font-black leading-none mb-1">
                  Admin Rack
                </p>

                <p className="text-[10px] font-bold uppercase tracking-widest text-cyan-500">
                  PT. Gudang Baru Berkah
                </p>
              </div>

              <div className="w-11 h-11 rounded-2xl border-2 border-cyan-500/20 p-0.5">
                <img
                  src="https://ui-avatars.com/api/?name=Admin+Rack&background=06b6d4&color=fff"
                  className="w-full h-full rounded-[14px] object-cover"
                  alt="Admin Rack"
                />
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 p-6 lg:p-10 max-w-7xl mx-auto w-full">
          {children}
        </main>
      </div>
    </div>
  );
}