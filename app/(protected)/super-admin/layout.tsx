"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
    LayoutDashboard,
    Users,
    Layers,
    Archive,
    FileText,
    LogOut,
    Menu,
    X,
    Bell,
    Search
} from "lucide-react";

const sidebarItems = [
    { name: "Dashboard", href: "/super-admin/dashboard", icon: LayoutDashboard },
    { name: "Users", href: "/super-admin/users", icon: Users },
    { name: "Racks", href: "/super-admin/racks", icon: Layers },
    { name: "Boxes", href: "/super-admin/boxes", icon: Archive },
    { name: "Documents", href: "/super-admin/documents", icon: FileText },
];

export default function SuperAdminLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const [isMobileOpen, setIsMobileOpen] = useState(false);

    return (
        <div className="min-h-screen bg-[#F8FAFC] flex">
            {/* Desktop Sidebar */}
            <aside className="hidden lg:flex flex-col w-64 bg-white border-r border-slate-200 sticky top-0 h-screen">
                <div className="p-6">
                    <div className="flex items-center gap-3 px-2">
                        <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-blue-200">
                            I
                        </div>
                        <span className="font-bold text-xl tracking-tight text-slate-800">InvDocs</span>
                    </div>
                </div>

                <nav className="flex-1 px-4 space-y-1 mt-4">
                    {sidebarItems.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                            <Link key={item.name} href={item.href}>
                                <motion.div
                                    whileHover={{ x: 4 }}
                                    className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${isActive
                                        ? "bg-blue-50 text-blue-600 shadow-sm shadow-blue-100"
                                        : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                                        }`}
                                >
                                    <item.icon size={20} />
                                    {item.name}
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

            {/* Main Content Area */}
            <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
                {/* Topbar */}
                <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 lg:px-8 sticky top-0 z-30">
                    <button onClick={() => setIsMobileOpen(true)} className="lg:hidden p-2 text-slate-500">
                        <Menu size={24} />
                    </button>

                    <div className="hidden md:flex items-center bg-slate-100 px-3 py-1.5 rounded-lg w-96 border border-slate-200 focus-within:ring-2 focus-within:ring-blue-500/20 focus-within:border-blue-500 transition-all">
                        <Search size={18} className="text-slate-400" />
                        <input
                            type="text"
                            placeholder="Search data..."
                            className="bg-transparent border-none focus:ring-0 text-sm ml-2 w-full outline-none text-slate-600"
                        />
                    </div>

                    <div className="flex items-center gap-4">
                        <button className="p-2 text-slate-400 hover:bg-slate-50 rounded-full relative">
                            <Bell size={20} />
                            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
                        </button>
                        <div className="flex items-center gap-3 pl-4 border-l border-slate-200">
                            <div className="text-right hidden sm:block">
                                <p className="text-sm font-bold text-slate-800">Super Admin</p>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Master Control</p>
                            </div>
                            <div className="w-9 h-9 rounded-full bg-slate-200 border-2 border-white shadow-sm"></div>
                        </div>
                    </div>
                </header>

                {/* Dynamic Page Content */}
                <div className="p-4 lg:p-8 overflow-y-auto">
                    {children}
                </div>
            </main>

            {/* Mobile Sidebar Overlay */}
            <AnimatePresence>
                {isMobileOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            onClick={() => setIsMobileOpen(false)}
                            className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[40] lg:hidden"
                        />
                        <motion.aside
                            initial={{ x: "-100%" }} animate={{ x: 0 }} exit={{ x: "-100%" }}
                            className="fixed inset-y-0 left-0 w-72 bg-white z-[50] p-6 lg:hidden"
                        >
                            <div className="flex justify-between items-center mb-8">
                                <span className="font-bold text-xl">InvDocs</span>
                                <button onClick={() => setIsMobileOpen(false)}><X size={24} /></button>
                            </div>
                            {/* Menu items same as desktop */}
                        </motion.aside>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
}