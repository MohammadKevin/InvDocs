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
  ShieldAlert,
  ChevronRight
} from "lucide-react";

const sidebarItems = [
  { name: "Dashboard", href: "/super-admin/dashboard", icon: LayoutDashboard },
  { name: "User Control", href: "/super-admin/users", icon: Users },
  { name: "System Racks", href: "/super-admin/racks", icon: Layers },
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
    <div className="min-h-screen bg-[#F8FAFC] flex font-sans selection:bg-cyan-100 selection:text-cyan-700 text-slate-900">
      <aside className="hidden lg:flex flex-col w-72 bg-white border-r border-slate-200/60 sticky top-0 h-screen z-50">
        <div className="p-8">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 bg-cyan-500 rounded-2xl flex items-center justify-center shadow-xl shadow-cyan-100 group transition-transform hover:rotate-12 overflow-hidden">
              <img src="/icon.png" alt="Logo" className="w-7 h-7 object-contain" />
            </div>
            <div className="flex flex-col">
              <span className="font-black text-sm tracking-tighter text-slate-800 leading-none uppercase">PT. Gudang Baru Berkah</span>
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
                      layoutId="activeNavSuper"
                      className="absolute inset-0 bg-cyan-50 rounded-2xl border border-cyan-100/50"
                    />
                  )}
                  <motion.div
                    whileHover={{ x: 4 }}
                    className={`relative flex items-center gap-3 px-5 py-3.5 rounded-2xl text-sm font-bold transition-all ${
                      isActive ? "text-cyan-600" : "text-slate-500 hover:text-cyan-600"
                    }`}
                  >
                    <item.icon size={20} strokeWidth={isActive ? 2.5 : 2} />
                    {item.name}
                    {isActive && <ChevronRight size={14} className="ml-auto opacity-50" />}
                  </motion.div>
                </div>
              </Link>
            );
          })}
        </nav>

        <div className="p-6 border-t border-slate-50">
          <button
            onClick={handleLogout}
            className="group flex items-center gap-3 w-full px-5 py-4 text-sm font-bold text-rose-500 hover:bg-rose-50 rounded-2xl transition-all"
          >
            <LogOut size={20} className="group-hover:-translate-x-1 transition-transform" />
            Sign Out System
          </button>
        </div>
      </aside>

      <main className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        <header className="h-20 bg-white/80 backdrop-blur-md border-b border-slate-100 flex items-center justify-between px-6 lg:px-10 sticky top-0 z-40">
          <button onClick={() => setIsMobileOpen(true)} className="lg:hidden p-2.5 bg-slate-50 text-slate-600 rounded-xl">
            <Menu size={22} />
          </button>

          <div className="flex items-center gap-5">

            <div className="flex items-center gap-4 pl-5 border-l border-slate-200">
              <div className="text-right hidden sm:block">
                <p className="text-[13px] font-black text-slate-900 leading-tight">Super Admin</p>
                <p className="text-[9px] font-bold text-cyan-600 uppercase tracking-widest">Root Access</p>
              </div>
              <div className="w-11 h-11 rounded-2xl border-2 border-cyan-500/20 p-0.5 shadow-sm overflow-hidden bg-slate-100">
                <img 
                  src={`https://ui-avatars.com/api/?name=Super+Admin&background=06b6d4&color=fff&bold=true`} 
                  alt="Avatar" 
                  className="w-full h-full rounded-[14px] object-cover"
                />
              </div>
            </div>
          </div>
        </header>

        <div className="p-6 lg:p-10 max-w-7xl mx-auto w-full">
          {children}
        </div>
      </main>

      <AnimatePresence>
        {isMobileOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsMobileOpen(false)} className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[60] lg:hidden" />
            <motion.aside initial={{ x: "-100%" }} animate={{ x: 0 }} exit={{ x: "-100%" }} transition={{ type: "spring", damping: 25, stiffness: 200 }} className="fixed inset-y-0 left-0 w-80 bg-white z-[70] flex flex-col lg:hidden p-6 shadow-2xl">
              <div className="flex items-center justify-between mb-10">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-cyan-500 rounded-xl flex items-center justify-center text-white">
                    <ShieldAlert size={20} />
                  </div>
                  <span className="font-black text-xl text-slate-900 uppercase tracking-tighter">PT. Gudang Baru Berkah</span>
                </div>
                <button onClick={() => setIsMobileOpen(false)} className="p-2 bg-slate-50 rounded-xl text-slate-400"><X size={20} /></button>
              </div>
              <nav className="space-y-2">
                {sidebarItems.map((item) => (
                  <Link key={item.name} href={item.href} onClick={() => setIsMobileOpen(false)}>
                    <div className={`flex items-center gap-4 px-6 py-4 rounded-2xl font-black text-sm transition-all ${pathname === item.href ? "bg-cyan-500 text-white shadow-lg shadow-cyan-200" : "text-slate-500"}`}>
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