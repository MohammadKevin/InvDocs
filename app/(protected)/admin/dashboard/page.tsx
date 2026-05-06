"use client";

import { motion } from "framer-motion";
import { Archive, FileText, Clock, CheckCircle, ArrowRight } from "lucide-react";

const stats = [
    { label: "Total Boxes", value: "24", icon: Archive, color: "blue" },
    { label: "Total Documents", value: "842", icon: FileText, color: "slate" },
    { label: "Pending", value: "12", icon: Clock, color: "amber" },
    { label: "Approved", value: "790", icon: CheckCircle, color: "emerald" },
];

export default function AdminDashboard() {
    return (
        <div className="space-y-10">
            <div>
                <h1 className="text-3xl font-black text-slate-900 tracking-tight italic uppercase">Dashboard</h1>
                <p className="text-slate-500 font-medium mt-1">Overview of your assigned rack performance.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, i) => (
                    <motion.div
                        key={stat.label}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm group hover:shadow-md transition-all"
                    >
                        <div className={`w-12 h-12 rounded-2xl bg-${stat.color}-50 text-${stat.color}-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                            <stat.icon size={24} />
                        </div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">{stat.label}</p>
                        <h3 className="text-3xl font-black text-slate-900 mt-1">{stat.value}</h3>
                    </motion.div>
                ))}
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 bg-white rounded-[2.5rem] border border-slate-200 p-8 shadow-sm">
                    <div className="flex justify-between items-center mb-8">
                        <h3 className="font-black text-slate-800 uppercase tracking-widest text-xs">Recent Activities</h3>
                        <button className="text-blue-600 text-xs font-bold flex items-center gap-1 hover:underline">
                            View All <ArrowRight size={14} />
                        </button>
                    </div>
                    <div className="space-y-6">
                        {[1, 2, 3].map((_, i) => (
                            <div key={i} className="flex gap-4 items-start pb-6 border-b border-slate-50 last:border-0">
                                <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 shrink-0">
                                    <FileText size={18} />
                                </div>
                                <div>
                                    <p className="text-sm font-bold text-slate-800 italic">"Invoice_March_2026.pdf" was uploaded</p>
                                    <p className="text-xs text-slate-400 mt-1">Uploaded by User 02 • In Box-A1</p>
                                </div>
                                <div className="ml-auto text-[10px] font-bold text-slate-300 uppercase">2m ago</div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white relative overflow-hidden flex flex-col justify-center text-center">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl" />
                    <h4 className="text-xs font-black uppercase tracking-[0.3em] text-slate-500 mb-6">Quick Status</h4>
                    <div className="text-5xl font-black text-blue-400 mb-2">98%</div>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Efficiency Rate</p>
                </div>
            </div>
        </div>
    );
}