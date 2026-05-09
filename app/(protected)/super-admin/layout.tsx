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
  Bell,
  Search,
  Command
} from "lucide-react";
import Image from "next/image";

const sidebarItems = [
  { name: "Dashboard", href: "/super-admin/dashboard", icon: LayoutDashboard },
  { name: "Users", href: "/super-admin/users", icon: Users },
  { name: "Racks", href: "/super-admin/racks", icon: Layers },
];

export default function SuperAdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const handleLogout = () => {
    localStorage.clear();
    setIsMobileOpen(false);
    router.replace("/");
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex font-sans selection:bg-blue-100 selection:text-blue-700 text-slate-900">
      {/* SIDEBAR DESKTOP */}
      <aside className="hidden lg:flex flex-col w-72 bg-white border-r border-slate-200/60 sticky top-0 h-screen z-50">
        <div className="p-8">
          <div className="flex items-center gap-3 px-2">
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
              <div className="relative flex items-center justify-center w-10 h-10 bg-white rounded-xl shadow-sm border border-slate-100">
                <Command className="text-blue-600" size={22} />
              </div>
            </div>
            <div className="flex flex-col">
              <span className="font-black text-sm tracking-tight text-slate-800 leading-none">InvDocs</span>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Archive System</span>
            </div>
          </div>
        </div>

        <nav className="flex-1 px-4 space-y-1.5 mt-4">
          {sidebarItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link key={item.name} href={item.href}>
                <div className="relative group">
                  {isActive && (
                    <motion.div
                      layoutId="activeNav"
                      className="absolute inset-0 bg-blue-50/80 rounded-2xl border border-blue-100/50"
                    />
                  )}
                  <motion.div
                    whileHover={{ x: 4 }}
                    className={`relative flex items-center gap-3 px-5 py-3.5 rounded-2xl text-sm font-bold transition-all ${isActive ? "text-blue-600" : "text-slate-500 hover:text-slate-900"
                      }`}
                  >
                    <item.icon size={20} strokeWidth={isActive ? 2.5 : 2} />
                    {item.name}
                  </motion.div>
                </div>
              </Link>
            );
          })}
        </nav>

        <div className="p-6 border-t border-slate-100/60">
          <button
            onClick={handleLogout}
            className="group flex items-center gap-3 w-full px-5 py-4 text-sm font-bold text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-2xl transition-all"
          >
            <LogOut size={20} className="group-hover:rotate-180 transition-transform duration-500" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        <header className="h-20 bg-white/80 backdrop-blur-md border-b border-slate-200/60 flex items-center justify-between px-6 lg:px-10 sticky top-0 z-40">
          <button onClick={() => setIsMobileOpen(true)} className="lg:hidden p-2.5 bg-slate-50 text-slate-600 rounded-xl">
            <Menu size={22} />
          </button>

          <div className="hidden md:flex items-center bg-slate-100/80 px-4 py-2.5 rounded-2xl w-96 group focus-within:bg-white focus-within:ring-4 focus-within:ring-blue-50 transition-all border border-transparent focus-within:border-blue-100">
            <Search size={18} className="text-slate-400 group-focus-within:text-blue-600" />
            <input type="text" placeholder="Quick Search..." className="bg-transparent border-none focus:ring-0 text-sm ml-3 w-full outline-none text-slate-600 font-medium" />
          </div>

          <div className="flex items-center gap-5">
            <button className="p-2.5 text-slate-400 hover:bg-slate-50 rounded-xl relative transition-colors">
              <Bell size={20} />
              <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-rose-500 rounded-full border-2 border-white ring-2 ring-rose-500/20"></span>
            </button>

            <div className="flex items-center gap-4 pl-5 border-l border-slate-200">
              <div className="text-right hidden sm:block">
                <p className="text-[13px] font-black text-slate-900 leading-tight">Super Admin</p>
                <p className="text-[10px] font-bold text-blue-500 uppercase tracking-[0.1em]">Network Master</p>
              </div>
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 border-2 border-white shadow-lg shadow-blue-100 overflow-hidden" />
            </div>
          </div>
        </header>

        <div className="p-6 lg:p-10">{children}</div>
      </main>

      {/* MOBILE SIDEBAR OVERLAY & ASIDE (Reuse Logic) */}
      <AnimatePresence>
        {isMobileOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsMobileOpen(false)} className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[60] lg:hidden" />
            <motion.aside initial={{ x: "-100%" }} animate={{ x: 0 }} exit={{ x: "-100%" }} transition={{ type: "spring", damping: 25, stiffness: 200 }} className="fixed inset-y-0 left-0 w-80 bg-white z-[70] flex flex-col lg:hidden p-6 shadow-2xl">
              <div className="flex items-center justify-between mb-10">
                <span className="font-black text-xl text-blue-600 uppercase tracking-tighter italic">InvDocs</span>
                <button onClick={() => setIsMobileOpen(false)} className="p-2 bg-slate-50 rounded-xl text-slate-400"><X size={20} /></button>
              </div>
              <nav className="space-y-2">
                {sidebarItems.map((item) => (
                  <Link key={item.name} href={item.href} onClick={() => setIsMobileOpen(false)}>
                    <div className={`flex items-center gap-4 px-6 py-4 rounded-2xl font-black text-sm transition-all ${pathname === item.href ? "bg-blue-600 text-white shadow-lg shadow-blue-200" : "text-slate-500"}`}>
                      <item.icon size={20} /> {item.name}
                    </div>
                  </Link>
                ))}
              </nav>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}