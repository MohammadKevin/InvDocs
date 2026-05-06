"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Check, X, Loader2, AlertCircle } from "lucide-react";
import { api } from "@/lib/api";

export default function RacksPage() {
    // --- STATE UNTUK FORM ---
    const [form, setForm] = useState({
        name: "",
        email: "",
        password: "",
        name_rack: ""
    });

    const [racks, setRacks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // --- FETCH DATA PENDING ---
    const fetchPendingRacks = async () => {
        try {
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

    // --- LOGIKA CREATE ADMIN RACK ---
    const handleCreateAdmin = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            setIsSubmitting(true);
            
            // Sesuaikan endpoint ini dengan backend kamu
            // Biasanya admin dibuat melalui endpoint /users atau /auth/register
            await api.post("/auth/register-admin", {
                name: form.name,
                email: form.email,
                password: form.password,
                name_rack: form.name_rack // Pastikan backend menerima field ini untuk mengaitkan admin dengan rak
            });

            alert("Admin Rack Berhasil Dibuat! 🎉");
            setForm({ name: "", email: "", password: "", name_rack: "" }); // Reset Form
            fetchPendingRacks(); // Refresh table
        } catch (err: any) {
            alert(err.response?.data?.message || "Gagal membuat admin rack");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="space-y-8">
            <div className="grid lg:grid-cols-3 gap-8">
                {/* FORM CREATE */}
                <motion.div className="lg:col-span-1 bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm h-fit sticky top-24">
                    <div className="flex items-center gap-2 mb-6">
                        <div className="p-2 bg-blue-50 text-blue-600 rounded-lg"><Plus size={18} /></div>
                        <h3 className="font-bold text-slate-800 uppercase text-xs tracking-widest">Register Admin</h3>
                    </div>

                    <form onSubmit={handleCreateAdmin} className="space-y-4 text-sm font-bold">
                        <div className="space-y-1">
                            <label className="text-slate-600 ml-1 uppercase text-[10px]">Full Name</label>
                            <input 
                                type="text" 
                                required
                                value={form.name}
                                onChange={(e) => setForm({...form, name: e.target.value})}
                                placeholder="John Doe" 
                                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all" 
                            />
                        </div>
                        <div className="space-y-1">
                            <label className="text-slate-600 ml-1 uppercase text-[10px]">Email Address</label>
                            <input 
                                type="email" 
                                required
                                value={form.email}
                                onChange={(e) => setForm({...form, email: e.target.value})}
                                placeholder="john@example.com" 
                                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all" 
                            />
                        </div>
                        <div className="space-y-1">
                            <label className="text-slate-600 ml-1 uppercase text-[10px]">Password</label>
                            <input 
                                type="password" 
                                required
                                value={form.password}
                                onChange={(e) => setForm({...form, password: e.target.value})}
                                placeholder="••••••••" 
                                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all" 
                            />
                        </div>
                        <div className="space-y-1">
                            <label className="text-slate-600 ml-1 uppercase text-[10px]">Rack Name</label>
                            <input 
                                type="text" 
                                required
                                value={form.name_rack}
                                onChange={(e) => setForm({...form, name_rack: e.target.value})}
                                placeholder="Warehouse Alpha" 
                                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all" 
                            />
                        </div>
                        <button 
                            type="submit" 
                            disabled={isSubmitting}
                            className="w-full py-4 bg-slate-900 text-white rounded-2xl mt-4 shadow-xl shadow-slate-200 hover:bg-slate-800 transition-all flex items-center justify-center gap-2"
                        >
                            {isSubmitting ? <Loader2 className="animate-spin" size={18} /> : "Create Admin Rack"}
                        </button>
                    </form>
                </motion.div>

                {/* TABLE PENDING (Seperti kode sebelumnya) */}
                {/* ... */}
            </div>
        </div>
    );
}