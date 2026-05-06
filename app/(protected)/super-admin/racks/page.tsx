"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Check, X, Loader2, AlertCircle, Layers } from "lucide-react";
import { api } from "@/lib/api";

export default function RacksPage() {
    const [form, setForm] = useState({
        name: "",
        email: "",
        password: "",
        name_rack: ""
    });

    const [racks, setRacks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [actionLoading, setActionLoading] = useState<string | null>(null);

    // --- 1. FETCH DATA PENDING ---
    const fetchPendingRacks = async () => {
        try {
            setLoading(true);
            const res = await api.get("/rack/pending");
            setRacks(res.data);
        } catch (err) {
            console.error("Gagal load rack:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPendingRacks();
    }, []);

    // --- 2. LOGIKA CREATE ADMIN RACK ---
    const handleCreateAdmin = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            setIsSubmitting(true);
            await api.post("/auth/register-admin", {
                name: form.name,
                email: form.email,
                password: form.password,
                name_rack: form.name_rack
            });

            alert("Admin Rack Berhasil Dibuat! 🎉");
            setForm({ name: "", email: "", password: "", name_rack: "" });
            fetchPendingRacks();
        } catch (err: any) {
            alert(err.response?.data?.message || "Gagal membuat admin rack");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleStatusUpdate = async (id: string, type: 'approve' | 'reject') => {
        try {
            setActionLoading(id); // Set loading spesifik untuk baris ini
            await api.patch(`/rack/${id}/${type}`);
            
            alert(`Rak berhasil di-${type === 'approve' ? 'setujui' : 'tolak'}!`);
            fetchPendingRacks();
        } catch (err: any) {
            alert(err.response?.data?.message || `Gagal melakukan ${type}`);
        } finally {
            setActionLoading(null);
        }
    };

    return (
        <div className="space-y-8">
            <div className="grid lg:grid-cols-3 gap-8 text-slate-900">
                
                {/* FORM CREATE ADMIN */}
                <motion.div 
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="lg:col-span-1 bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm h-fit sticky top-24"
                >
                    <div className="flex items-center gap-2 mb-6">
                        <div className="p-2 bg-blue-50 text-blue-600 rounded-lg"><Plus size={18} /></div>
                        <h3 className="font-bold uppercase text-xs tracking-widest">Register Admin</h3>
                    </div>

                    <form onSubmit={handleCreateAdmin} className="space-y-4 text-sm font-bold">
                        <div className="space-y-1">
                            <label className="text-slate-600 ml-1 uppercase text-[10px]">Full Name</label>
                            <input 
                                type="text" required value={form.name}
                                onChange={(e) => setForm({...form, name: e.target.value})}
                                placeholder="John Doe" 
                                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all" 
                            />
                        </div>
                        <div className="space-y-1">
                            <label className="text-slate-600 ml-1 uppercase text-[10px]">Email Address</label>
                            <input 
                                type="email" required value={form.email}
                                onChange={(e) => setForm({...form, email: e.target.value})}
                                placeholder="john@example.com" 
                                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all" 
                            />
                        </div>
                        <div className="space-y-1">
                            <label className="text-slate-600 ml-1 uppercase text-[10px]">Password</label>
                            <input 
                                type="password" required value={form.password}
                                onChange={(e) => setForm({...form, password: e.target.value})}
                                placeholder="••••••••" 
                                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all" 
                            />
                        </div>
                        <div className="space-y-1 text-slate-600">
                            <label className="font-bold ml-1 uppercase text-[10px]">Rack Name</label>
                            <input 
                                type="text" required value={form.name_rack}
                                onChange={(e) => setForm({...form, name_rack: e.target.value})}
                                placeholder="Warehouse Alpha" 
                                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all" 
                            />
                        </div>
                        <button 
                            type="submit" disabled={isSubmitting}
                            className="w-full py-4 bg-slate-900 text-white rounded-2xl mt-4 shadow-xl shadow-slate-200 hover:bg-slate-800 transition-all flex items-center justify-center gap-2"
                        >
                            {isSubmitting ? <Loader2 className="animate-spin" size={18} /> : "Create Admin Rack"}
                        </button>
                    </form>
                </motion.div>

                {/* TABLE PENDING QUEUE */}
                <motion.div 
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="lg:col-span-2 bg-white rounded-[2rem] border border-slate-200 shadow-sm overflow-hidden"
                >
                    <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                        <h3 className="font-bold uppercase text-xs tracking-widest">Rack Approval Queue</h3>
                        <span className="text-[10px] font-black text-blue-600 bg-blue-50 px-2 py-1 rounded-md">
                            {racks.length} Waiting Requests
                        </span>
                    </div>

                    <div className="overflow-x-auto text-sm">
                        {loading ? (
                            <div className="flex flex-col items-center justify-center py-20 gap-4">
                                <Loader2 className="animate-spin text-blue-600" size={32} />
                                <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">Syncing with Railway API...</p>
                            </div>
                        ) : racks.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-20 text-slate-400">
                                <Check className="w-12 h-12 mb-2 opacity-20" />
                                <p className="font-bold uppercase tracking-widest text-[10px]">Semua antrean bersih</p>
                            </div>
                        ) : (
                            <table className="w-full text-left font-bold">
                                <thead className="bg-slate-50/50 text-slate-400 uppercase tracking-widest text-[10px] border-b border-slate-100">
                                    <tr>
                                        <th className="px-8 py-5 italic">Rack Name</th>
                                        <th className="px-8 py-5 italic text-center">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    <AnimatePresence>
                                        {racks.map((rack: any) => (
                                            <motion.tr 
                                                key={rack.id} layout
                                                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, x: 20 }}
                                                className="hover:bg-slate-50/50 transition-colors"
                                            >
                                                <td className="px-8 py-5">
                                                    <div className="flex items-center gap-3">
                                                        <div className="p-2 bg-slate-100 text-slate-400 rounded-lg">
                                                            <Layers size={18} />
                                                        </div>
                                                        <div>
                                                            <p className="text-slate-900">{rack.name}</p>
                                                            <p className="text-[10px] text-slate-400 uppercase tracking-tighter font-black">ID: {rack.id.slice(0, 8)}</p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-8 py-5">
                                                    <div className="flex justify-center gap-3">
                                                        <button 
                                                            disabled={actionLoading === rack.id}
                                                            onClick={() => handleStatusUpdate(rack.id, 'approve')}
                                                            className="p-2.5 bg-emerald-50 text-emerald-600 rounded-xl hover:bg-emerald-600 hover:text-white transition-all shadow-sm active:scale-90"
                                                        >
                                                            {actionLoading === rack.id ? <Loader2 className="animate-spin" size={18} /> : <Check size={18} />}
                                                        </button>
                                                        <button 
                                                            disabled={actionLoading === rack.id}
                                                            onClick={() => handleStatusUpdate(rack.id, 'reject')}
                                                            className="p-2.5 bg-red-50 text-red-600 rounded-xl hover:bg-red-600 hover:text-white transition-all shadow-sm active:scale-90"
                                                        >
                                                            <X size={18} />
                                                        </button>
                                                    </div>
                                                </td>
                                            </motion.tr>
                                        ))}
                                    </AnimatePresence>
                                </tbody>
                            </table>
                        )}
                    </div>
                </motion.div>
            </div>
        </div>
    );
}