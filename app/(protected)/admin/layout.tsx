"use client";

import React, { useState } from "react";
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
  UserCircle,
  Shapes
} from "lucide-react";

const menuItems = [
  { name: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
  { name: "Boxes", href: "/admin/boxes", icon: Archive },
  { name: "Approvals", href: "/admin/approvals", icon: ClipboardCheck },
];

export default function AdminRackLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => {
    localStorage.clear();
    setIsOpen(false);
    router.replace("/");
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex text-slate-900 font-sans selection:bg-cyan-100">
      <aside className="hidden lg:flex flex-col w-72 bg-white border-r border-slate-200/60 sticky top-0 h-screen z-50">
        <div className="p-8">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 bg-cyan-500 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-cyan-100 group transition-transform hover:rotate-12 overflow-hidden">
               <img src="/icon.png" alt="Logo" className="w-7 h-7 object-contain" />
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-black tracking-tighter text-slate-800 leading-none uppercase">PT. Gudang Baru Berkah</span>
            </div>
          </div>
        </div>

        <nav className="flex-1 px-4 space-y-1.5 mt-4">
          {menuItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link key={item.name} href={item.href}>
                <motion.div
                  whileHover={{ x: 5 }}
                  className={`flex items-center gap-3 px-5 py-3.5 rounded-2xl text-sm font-bold transition-all relative ${
                    isActive ? "text-cyan-600 bg-cyan-50/50" : "text-slate-500 hover:bg-slate-50"
                  }`}
                >
                  {isActive && <motion.div layoutId="activePill" className="absolute left-0 w-1 h-6 bg-cyan-600 rounded-r-full" />}
                  <item.icon size={20} strokeWidth={isActive ? 2.5 : 2} />
                  {item.name}
                </motion.div>
              </Link>
            );
          })}
        </nav>

        <div className="p-6 border-t border-slate-100/60">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-5 py-4 text-sm font-bold text-rose-500 hover:bg-rose-50 rounded-2xl transition-all"
          >
            <LogOut size={20} />
            Sign Out
          </button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-20 bg-white/70 backdrop-blur-xl border-b border-slate-200/60 flex items-center justify-between px-8 sticky top-0 z-40">
          <button onClick={() => setIsOpen(true)} className="lg:hidden p-2.5 bg-slate-50 rounded-xl text-slate-600"><Menu size={22} /></button>
          <div className="flex-1" />
          <div className="flex items-center gap-6">
            <button className="relative p-2.5 text-slate-400 hover:bg-slate-50 rounded-full transition-colors">
              <Bell size={20} />
              <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-cyan-500 rounded-full border-2 border-white ring-4 ring-cyan-500/10" />
            </button>
            <div className="flex items-center gap-4 pl-6 border-l border-slate-200/60">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-black text-slate-800 leading-none mb-1">M. Kevin</p>
                <p className="text-[10px] font-bold text-cyan-500 uppercase tracking-widest">Master Admin</p>
              </div>
              <div className="w-11 h-11 rounded-2xl border-2 border-cyan-500/20 p-0.5 shadow-sm">
                <img src={`https://ui-avatars.com/api/?name=Mohammad+Kevin&background=06b6d4&color=fff`} className="w-full h-full rounded-[14px] object-cover" alt="User" />
              </div>
            </div>
          </div>
        </header>

        <main className="p-8 lg:p-12 max-w-7xl mx-auto w-full animate-in fade-in slide-in-from-bottom-4 duration-700">
          {children}
        </main>
      </div>
    </div>
  );
}