"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  Users,
  Layers,
  LogOut,
  Menu,
  X,
  ShieldAlert,
  ChevronRight,
  ClipboardCheck,
} from "lucide-react";

import ThemeToggle from "@/components/ThemeToggle";

const sidebarItems = [
  {
    name: "Dashboard",
    href: "/super-admin/dashboard",
    icon: LayoutDashboard,
  },
  {
    name: "User Control",
    href: "/super-admin/users",
    icon: Users,
  },
  {
    name: "System Racks",
    href: "/super-admin/racks",
    icon: Layers,
  },
  {
    name: "Division Racks",
    href: "/super-admin/divisi",
    icon: ShieldAlert,
  },
  {
    name: "Reports",
    href: "/super-admin/reports",
    icon: ClipboardCheck,
  },
];

export default function SuperAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();

  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const handleLogout = () => {
    localStorage.clear();
    setIsMobileOpen(false);
    router.replace("/");
  };

  return (
    <div className="min-h-screen flex bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white transition-colors">
      
      {/* SIDEBAR DESKTOP */}
      <aside className="hidden lg:flex flex-col w-72 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 sticky top-0 h-screen z-50">
        
        <div className="p-8">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 bg-cyan-500 rounded-2xl flex items-center justify-center shadow-xl shadow-cyan-500/20 overflow-hidden">
              <img
                src="/icon.png"
                alt="Logo"
                className="w-7 h-7 object-contain"
              />
            </div>

            <span className="font-black text-sm tracking-tight uppercase text-slate-800 dark:text-white">
              PT. Gudang Baru Berkah
            </span>
          </div>
        </div>

        {/* NAVIGATION */}
        <nav className="flex-1 px-4 space-y-2">
          {sidebarItems.map((item) => {
            const isActive = pathname === item.href;

            return (
              <Link key={item.name} href={item.href}>
                <div className="relative">
                  {isActive && (
                    <motion.div
                      layoutId="activeNav"
                      className="absolute inset-0 rounded-2xl bg-cyan-500"
                    />
                  )}

                  <motion.div
                    whileHover={{ x: 4 }}
                    className={`relative flex items-center gap-3 px-5 py-3.5 rounded-2xl text-sm font-bold transition-all
                    ${
                      isActive
                        ? "text-white"
                        : "text-slate-500 dark:text-slate-400 hover:text-cyan-500"
                    }`}
                  >
                    <item.icon size={20} />
                    {item.name}

                    {isActive && (
                      <ChevronRight
                        size={14}
                        className="ml-auto opacity-70"
                      />
                    )}
                  </motion.div>
                </div>
              </Link>
            );
          })}
        </nav>

        {/* LOGOUT */}
        <div className="p-6 border-t border-slate-200 dark:border-slate-800">
          <button
            onClick={handleLogout}
            className="group flex items-center gap-3 w-full px-5 py-4 rounded-2xl text-sm font-bold text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 transition-all"
          >
            <LogOut
              size={20}
              className="group-hover:-translate-x-1 transition-transform"
            />
            Sign Out
          </button>
        </div>
      </aside>

      {/* MAIN */}
      <main className="flex-1 flex flex-col min-w-0">

        {/* HEADER */}
        <header className="h-20 sticky top-0 z-40 flex items-center justify-between px-6 lg:px-10 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800">
          
          {/* MOBILE BUTTON */}
          <button
            onClick={() => setIsMobileOpen(true)}
            className="lg:hidden p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800"
          >
            <Menu size={22} />
          </button>

          {/* RIGHT */}
          <div className="flex items-center gap-5 ml-auto">

            <ThemeToggle />

            <div className="flex items-center gap-4 pl-5 border-l border-slate-200 dark:border-slate-700">
              
              <div className="text-right hidden sm:block">
                <p className="text-[13px] font-black">
                  Super Admin
                </p>

                <p className="text-[9px] uppercase tracking-widest text-cyan-500 font-bold">
                  PT. Gudang Baru Berkah
                </p>
              </div>

              <div className="w-11 h-11 rounded-2xl overflow-hidden border-2 border-cyan-500/20">
                <img
                  src="https://ui-avatars.com/api/?name=Super+Admin&background=06b6d4&color=fff&bold=true"
                  alt="Avatar"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </header>

        {/* CONTENT */}
        <div className="p-6 lg:p-10 max-w-7xl mx-auto w-full">
          {children}
        </div>
      </main>

      {/* MOBILE SIDEBAR */}
      <AnimatePresence>
        {isMobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileOpen(false)}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[60] lg:hidden"
            />

            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{
                type: "spring",
                damping: 25,
                stiffness: 200,
              }}
              className="fixed inset-y-0 left-0 w-80 bg-white dark:bg-slate-900 z-[70] p-6 flex flex-col shadow-2xl lg:hidden"
            >
              
              <div className="flex items-center justify-between mb-10">
                
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-cyan-500 flex items-center justify-center text-white">
                    <ShieldAlert size={20} />
                  </div>

                  <span className="font-black text-lg uppercase tracking-tight">
                    PT. Gudang Baru Berkah
                  </span>
                </div>

                <button
                  onClick={() => setIsMobileOpen(false)}
                  className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800"
                >
                  <X size={20} />
                </button>
              </div>

              <nav className="space-y-2">
                {sidebarItems.map((item) => {
                  const isActive = pathname === item.href;

                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      onClick={() => setIsMobileOpen(false)}
                    >
                      <div
                        className={`flex items-center gap-4 px-6 py-4 rounded-2xl text-sm font-bold transition-all
                        ${
                          isActive
                            ? "bg-cyan-500 text-white"
                            : "text-slate-500 dark:text-slate-400"
                        }`}
                      >
                        <item.icon size={20} />
                        {item.name}
                      </div>
                    </Link>
                  );
                })}
              </nav>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}