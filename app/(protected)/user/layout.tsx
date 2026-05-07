"use client";
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard, FileText, UploadCloud, User,
  Menu, X, Bell, Search, ChevronDown, LogOut
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const sidebarItems = [
  { name: 'Dashboard', icon: LayoutDashboard, href: '/user/dashboard' },
  { name: 'Explorer', icon: FileText, href: '/user/explorer' },
  { name: 'Upload', icon: UploadCloud, href: '/user/upload' },
  { name: 'Profile', icon: User, href: '/user/profile' },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans antialiased">
      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => setSidebarOpen(false)}
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40 lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <aside className={`fixed top-0 left-0 h-full bg-white border-r border-slate-200 z-50 w-72 transition-transform duration-300 transform 
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`}>
        <div className="p-8 flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-blue-200">
            <FileText size={24} strokeWidth={2.5} />
          </div>
          <span className="text-2xl font-black tracking-tighter text-slate-900 uppercase">InvDocs</span>
        </div>

        <nav className="mt-4 px-4 space-y-2">
          {sidebarItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link key={item.name} href={item.href}>
                <motion.div
                  whileHover={{ x: 5 }}
                  className={`flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all duration-200 ${isActive ? 'bg-blue-600 text-white shadow-xl shadow-blue-100' : 'text-slate-500 hover:bg-slate-50'
                    }`}
                >
                  <item.icon size={20} strokeWidth={isActive ? 2.5 : 2} />
                  <span className={`text-sm font-bold uppercase tracking-widest ${isActive ? 'opacity-100' : 'opacity-70'}`}>
                    {item.name}
                  </span>
                  {isActive && <motion.div layoutId="indicator" className="ml-auto w-1.5 h-1.5 bg-white rounded-full" />}
                </motion.div>
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-slate-100">
          <Link
            href="/#"
            className="flex items-center gap-3 w-full px-4 py-3 text-sm font-semibold text-red-500 hover:bg-red-50 rounded-xl transition-colors"
          >
            <LogOut size={20} />
            Sign Out
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <div className="lg:ml-72 flex flex-col min-h-screen">
        {/* Navbar */}
        <header className="sticky top-0 z-30 bg-white/70 backdrop-blur-xl border-b border-slate-100 px-6 py-4 flex items-center justify-between">
          <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-2 text-slate-600">
            <Menu size={24} />
          </button>

          <div className="hidden md:flex items-center gap-3 bg-slate-100/50 border border-slate-100 px-4 py-2 rounded-2xl w-96 group focus-within:ring-4 ring-blue-500/5 transition-all">
            <Search size={18} className="text-slate-400 group-focus-within:text-blue-500" />
            <input type="text" placeholder="Search archive..." className="bg-transparent border-none outline-none text-sm font-medium w-full" />
          </div>

          <div className="flex items-center gap-5">
            <button className="relative p-2 text-slate-500 hover:bg-slate-100 rounded-xl transition-colors">
              <Bell size={20} />
              <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-rose-500 rounded-full border-2 border-white"></span>
            </button>
            <div className="flex items-center gap-3 pl-4 border-l border-slate-100">
              <div className="text-right hidden sm:block">
                <p className="text-xs font-black text-slate-900 uppercase tracking-tighter">User</p>
                <p className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest">User PT. Gudang Baru Jaya</p>
              </div>
              <div className="w-10 h-10 bg-slate-200 rounded-2xl border border-slate-300 overflow-hidden shadow-sm">
                <img src={`https://ui-avatars.com/api/?name=Mohammad+Kevin&background=2563eb&color=fff`} alt="User" />
              </div>
            </div>
          </div>
        </header>

        <main className="p-6 lg:p-10">{children}</main>
      </div>
    </div>
  );
}