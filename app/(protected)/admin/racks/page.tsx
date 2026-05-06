"use client";

import { motion } from "framer-motion";
import { ShieldCheck, Calendar, Settings } from "lucide-react";

export default function RackProfilePage() {
    return (
        <div className="max-w-4xl space-y-10">
            <div>
                <h1 className="text-3xl font-black text-slate-900 tracking-tighter uppercase italic">Rack Configuration</h1>
                <p className="text-slate-500 font-medium pl-1">Personalize your assigned storage identity.</p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
                <div className="md:col-span-1 bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm flex flex-col items-center text-center">
                    <div className="w-20 h-20 bg-blue-50 text-blue-600 rounded-3xl flex items-center justify-center mb-6 shadow-inner shadow-blue-100">
                        <ShieldCheck size={40} />
                    </div>
                    <h2 className="text-2xl font-black text-slate-900 leading-none mb-2 tracking-tighter">Alpha-Sector</h2>
                    <span className="px-3 py-1 bg-emerald-50 text-emerald-600 text-[10px] font-black uppercase tracking-widest rounded-full">Status: Active</span>

                    <div className="mt-8 space-y-4 w-full">
                        <div className="flex justify-between items-center text-[10px] font-black text-slate-400 uppercase tracking-widest border-t border-slate-50 pt-4">
                            <span>Deployed</span>
                            <span className="text-slate-900 italic font-bold tracking-tight text-xs">Jan 12, 2026</span>
                        </div>
                    </div>
                </div>

                <div className="md:col-span-2 bg-white p-10 rounded-[2.5rem] border border-slate-200 shadow-sm">
                    <div className="flex items-center gap-2 mb-8">
                        <Settings className="text-blue-600" size={18} />
                        <h3 className="font-black text-slate-800 uppercase tracking-widest text-xs">Update Rack Details</h3>
                    </div>

                    <form className="space-y-6 font-bold">
                        <div className="space-y-2">
                            <label className="text-[10px] uppercase text-slate-400 tracking-[0.2em] ml-2">New Rack Alias</label>
                            <input
                                type="text"
                                placeholder="e.g. Master Logistics Alpha"
                                className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all italic shadow-inner"
                            />
                        </div>
                        <motion.button
                            whileHover={{ scale: 1.01 }}
                            whileTap={{ scale: 0.98 }}
                            className="w-full py-5 bg-slate-900 text-white rounded-[22px] font-black text-xs uppercase tracking-[0.3em] shadow-xl shadow-slate-200"
                        >
                            Update Configuration
                        </motion.button>
                    </form>
                </div>
            </div>
        </div>
    );
}