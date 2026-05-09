"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard, FileText, UploadCloud, User,
  Menu, X, Bell, Search, ChevronDown, LogOut,
  Zap
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const sidebarItems = [
  { name: 'Dashboard', icon: LayoutDashboard, href: '/user/dashboard' },
  { name: 'Explorer', icon: FileText, href: '/user/explorer' },
  { name: 'Upload', icon: UploadCloud, href: '/user/upload' },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-[#F1F5F9] font-sans antialiased">
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => setSidebarOpen(false)}
            className="fixed inset-0 bg-cyan-950/20 backdrop-blur-sm z-40 lg:hidden"
          />
        )}
      </AnimatePresence>

      <aside className={`fixed top-0 left-0 h-full bg-white border-r border-slate-200 z-50 w-72 transition-transform duration-300 transform 
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 flex flex-col`}>

        <div className="p-8 flex items-center gap-3">
          <div className="w-11 h-11 bg-cyan-500 rounded-xl flex items-center justify-center shadow-lg shadow-cyan-200 overflow-hidden">
            <img
              src="/icon.png"
              alt="CyanDrive Logo"
              className="w-7 h-7 object-contain"
            />
          </div>
          <span className="text-[15px] font-black tracking-tighter text-slate-900 uppercase">PT. Gudang Baru Berkah</span>
        </div>

        <nav className="mt-4 px-4 flex-1 space-y-1.5">
          {sidebarItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link key={item.name} href={item.href}>
                <motion.div
                  whileHover={{ x: 5 }}
                  className={`flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all duration-200 ${isActive
                      ? 'bg-cyan-500 text-white shadow-xl shadow-cyan-100'
                      : 'text-slate-500 hover:bg-cyan-50 hover:text-cyan-600'
                    }`}
                >
                  <item.icon size={20} strokeWidth={isActive ? 2.5 : 2} />
                  <span className={`text-sm font-bold uppercase tracking-widest ${isActive ? 'opacity-100' : 'opacity-80'}`}>
                    {item.name}
                  </span>
                  {isActive && (
                    <motion.div
                      layoutId="nav-indicator"
                      className="ml-auto w-1.5 h-1.5 bg-white rounded-full"
                    />
                  )}
                </motion.div>
              </Link>
            );
          })}
        </nav>

        <div className="p-6 border-t border-slate-50">
          <Link
            href="/"
            className="flex items-center gap-3 w-full px-4 py-3.5 text-sm font-bold text-rose-500 hover:bg-rose-50 rounded-2xl transition-colors"
          >
            <LogOut size={20} />
            SIGN OUT
          </Link>
        </div>
      </aside>

      <div className="lg:ml-72 flex flex-col min-h-screen">
        <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-slate-100 px-6 py-4 flex items-center justify-between">
          <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-2 text-slate-600 hover:bg-slate-100 rounded-xl">
            <Menu size={24} />
          </button>

          <div className="hidden md:flex items-center gap-3 bg-slate-100/80 border border-slate-100 px-5 py-2.5 rounded-2xl w-full max-w-md group focus-within:ring-4 ring-cyan-500/10 transition-all">
            <Search size={18} className="text-slate-400 group-focus-within:text-cyan-500" />
            <input
              type="text"
              placeholder="Search documents, racks, or boxes..."
              className="bg-transparent border-none outline-none text-sm font-medium w-full text-slate-700 placeholder:text-slate-400"
            />
          </div>

          <div className="flex items-center gap-4">

            <div className="flex items-center gap-3 pl-4 border-l border-slate-100">
              <div className="text-right hidden sm:block">
                <p className="text-xs font-black text-slate-900 uppercase tracking-tighter">User</p>
                <p className="text-[9px] font-bold text-cyan-600 uppercase tracking-widest">PT. Gudang Baru Berkah</p>
              </div>
              <div className="w-11 h-11 rounded-2xl border-2 border-cyan-500/20 p-0.5 shadow-sm">
                <img
                  src={`https://ui-avatars.com/api/?name=Mohammad+Kevin&background=06b6d4&color=fff`}
                  alt="User"
                  className="w-full h-full rounded-[14px] object-cover"
                />
              </div>
            </div>
          </div>
        </header>

        <main className="p-6 lg:p-10 flex-1">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}