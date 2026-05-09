"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Plus,
    Check,
    X,
    Loader2,
    Layers,
    User,
    Mail,
    Shield,
    Layout,
    Briefcase,
    Zap,
    ShieldCheck,
} from "lucide-react";

import { api } from "@/lib/api";

enum Divisi {
    HR = "HR",
    Finance = "Finance",
    IT = "IT",
    Marketing = "Marketing",
    Sales = "Sales",
    Operations = "Operations",
    Legal = "Legal",
    RnD = "RnD",
    Admin = "Admin",
}

export default function RacksPage() {
    const [form, setForm] = useState({
        name: "",
        email: "",
        password: "",
        name_rack: "",
        divisi: Divisi.IT,
    });

    const [racks, setRacks] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [actionLoading, setActionLoading] = useState<string | null>(null);

    const fetchPendingRacks = async () => {
        try {
            setLoading(true);
            const res = await api.get("/rack/pending");
            const rawData = res?.data?.data || res?.data || [];
            const data = Array.isArray(rawData) ? rawData : [];
            const clean = data.filter((r: any) => r && typeof r === "object" && r.id && r.name_rack);
            setRacks(clean);
        } catch (err) {
            setRacks([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPendingRacks();
    }, []);

    const handleCreateAdmin = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!form.name || !form.email || !form.password || !form.name_rack) {
            return alert("Harap isi semua field!");
        }

        try {
            setIsSubmitting(true);
            const res = await api.post("/auth/register-admin", form);
            const newRack = res?.data?.rack || res?.data;
            if (newRack?.id) setRacks((prev) => [newRack, ...prev]);
            else await fetchPendingRacks();

            setForm({ name: "", email: "", password: "", name_rack: "", divisi: Divisi.IT });
            alert("Admin & Rack Unit diinisialisasi! 🎉");
        } catch (err: any) {
            alert(err?.response?.data?.message || "Gagal registrasi admin");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleStatusUpdate = async (id: string, type: "approve" | "reject") => {
        try {
            setActionLoading(id);
            await api.patch(`/rack/${id}/${type}`);
            setRacks((prev) => prev.filter((r) => r?.id !== id));
        } catch (err: any) {
            alert(err?.response?.data?.message || `Gagal melakukan ${type}`);
        } finally {
            setActionLoading(null);
        }
    };

    return (
        <div className="space-y-10">
            <header className="flex flex-col gap-2">
                <div className="flex items-center gap-2 text-cyan-600 font-black text-[10px] uppercase tracking-[0.3em]">
                    <ShieldCheck size={14} />
                    System Infrastructure
                </div>
                <h1 className="text-4xl font-black text-slate-900 tracking-tight uppercase italic">
                    Rack Provisions
                </h1>
                <p className="text-slate-500 font-medium max-w-2xl">
                    Deploy administrative access and authorize hardware units for decentralized storage.
                </p>
            </header>

            <div className="grid lg:grid-cols-12 gap-8 items-start">
                {/* REGISTRATION FORM */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="lg:col-span-4 bg-white p-10 rounded-[3rem] border border-slate-200 shadow-sm relative overflow-hidden"
                >
                    <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/5 rounded-full -mr-16 -mt-16 blur-3xl pointer-events-none" />
                    
                    <div className="flex items-center gap-3 mb-10">
                        <div className="p-3 bg-cyan-500 rounded-2xl text-white shadow-lg shadow-cyan-200">
                            <Plus size={20} strokeWidth={3} />
                        </div>
                        <h3 className="font-black text-xs uppercase tracking-[0.2em] text-slate-800">
                            Register Unit
                        </h3>
                    </div>

                    <form onSubmit={handleCreateAdmin} className="space-y-5">
                        <InputField icon={<User size={18} />} placeholder="Admin Full Name" value={form.name} onChange={(v: string) => setForm({ ...form, name: v })} />
                        <InputField icon={<Mail size={18} />} type="email" placeholder="Email Address" value={form.email} onChange={(v: string) => setForm({ ...form, email: v })} />
                        <InputField icon={<Shield size={18} />} type="password" placeholder="Root Password" value={form.password} onChange={(v: string) => setForm({ ...form, password: v })} />
                        <InputField icon={<Layout size={18} />} placeholder="Rack Identifier (e.g. R-101)" value={form.name_rack} onChange={(v: string) => setForm({ ...form, name_rack: v })} />

                        <div className="relative group">
                            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-cyan-500 transition-colors">
                                <Briefcase size={18} />
                            </div>
                            <select
                                value={form.divisi}
                                onChange={(e) => setForm({ ...form, divisi: e.target.value as Divisi })}
                                className="w-full pl-12 pr-10 py-4 bg-slate-50 border border-transparent rounded-2xl text-sm font-bold appearance-none focus:ring-4 focus:ring-cyan-500/10 focus:bg-white focus:border-cyan-200 transition-all outline-none"
                            >
                                {Object.values(Divisi).map((dept) => (
                                    <option key={dept} value={dept}>{dept} Department</option>
                                ))}
                            </select>
                        </div>

                        <button
                            disabled={isSubmitting}
                            className="w-full py-5 bg-slate-900 text-white rounded-[2rem] font-black text-[10px] uppercase tracking-[0.2em] hover:bg-cyan-600 transition-all flex items-center justify-center gap-3 disabled:opacity-50 mt-6 shadow-xl shadow-slate-200 active:scale-95"
                        >
                            {isSubmitting ? <Loader2 className="animate-spin" size={18} /> : <>Initialize System Access <Zap size={14} fill="currentColor" /></>}
                        </button>
                    </form>
                </motion.div>

                {/* APPROVALS TABLE */}
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="lg:col-span-8 bg-white rounded-[3rem] border border-slate-200 shadow-sm overflow-hidden"
                >
                    <div className="p-8 border-b border-slate-50 flex items-center justify-between bg-slate-50/30">
                        <h3 className="font-black text-xs uppercase tracking-[0.2em] text-slate-400">
                            Queue Authorization
                        </h3>
                        <span className="px-4 py-1.5 bg-white border border-slate-200 rounded-full text-[9px] font-black text-cyan-600 shadow-sm uppercase">
                            {racks.length} Requests Pending
                        </span>
                    </div>

                    <div className="overflow-x-auto">
                        {loading ? (
                            <div className="py-40 flex flex-col items-center justify-center gap-4">
                                <Loader2 className="animate-spin text-cyan-500" size={48} />
                                <p className="text-[10px] font-black uppercase tracking-widest text-slate-300">Synchronizing Master Data...</p>
                            </div>
                        ) : racks.length === 0 ? (
                            <div className="py-32 text-center">
                                <Layers size={64} className="mx-auto mb-4 text-slate-100" />
                                <p className="font-black uppercase tracking-widest text-[10px] text-slate-400 italic">Static State: No pending units.</p>
                            </div>
                        ) : (
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="text-[10px] font-black uppercase tracking-[0.15em] text-slate-400 border-b border-slate-50">
                                        <th className="px-10 py-6">Unit Identifier</th>
                                        <th className="px-10 py-6">Department Access</th>
                                        <th className="px-10 py-6 text-right">Master Control</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-50">
                                    <AnimatePresence mode="popLayout">
                                        {racks.filter((rack) => rack?.id).map((rack) => (
                                            <motion.tr
                                                key={rack?.id}
                                                layout
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                exit={{ opacity: 0, x: -20 }}
                                                className="group hover:bg-cyan-50/20 transition-colors"
                                            >
                                                <td className="px-10 py-7">
                                                    <div className="flex items-center gap-5">
                                                        <div className="w-12 h-12 rounded-2xl bg-cyan-50 text-cyan-600 flex items-center justify-center group-hover:bg-cyan-500 group-hover:text-white transition-all shadow-sm">
                                                            <Layers size={22} />
                                                        </div>
                                                        <div className="flex flex-col">
                                                            <span className="font-black text-slate-900 text-base uppercase tracking-tight italic">
                                                                {rack?.name_rack || "N/A"}
                                                            </span>
                                                            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                                                                REF: {String(rack?.id || "").slice(0, 8)}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-10 py-7">
                                                    <span className="inline-flex px-4 py-1.5 bg-slate-900 text-white rounded-xl text-[9px] font-black uppercase tracking-widest shadow-sm group-hover:bg-cyan-600 transition-colors">
                                                        {rack?.divisi || "-"} Unit
                                                    </span>
                                                </td>
                                                <td className="px-10 py-7">
                                                    <div className="flex items-center justify-end gap-3">
                                                        <ActionButton loading={actionLoading === rack?.id} variant="success" icon={<Check size={18} />} onClick={() => handleStatusUpdate(rack?.id, "approve")} />
                                                        <ActionButton loading={actionLoading === rack?.id} variant="danger" icon={<X size={18} />} onClick={() => handleStatusUpdate(rack?.id, "reject")} />
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

function InputField({ icon, type = "text", placeholder, value, onChange }: any) {
    return (
        <div className="relative group font-bold">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-cyan-600 transition-colors">
                {icon}
            </div>
            <input
                type={type}
                placeholder={placeholder}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="w-full pl-12 pr-5 py-4 bg-slate-50 border border-transparent rounded-2xl text-sm font-bold placeholder:text-slate-300 placeholder:font-medium focus:ring-4 focus:ring-cyan-500/10 focus:bg-white focus:border-cyan-200 transition-all outline-none"
            />
        </div>
    );
}

function ActionButton({ variant, icon, onClick, loading }: any) {
    const isSuccess = variant === "success";
    return (
        <button
            disabled={loading}
            onClick={onClick}
            className={`w-11 h-11 flex items-center justify-center rounded-xl transition-all active:scale-90 shadow-sm ${
                isSuccess 
                ? "bg-slate-900 text-white hover:bg-emerald-600" 
                : "bg-white border border-slate-200 text-slate-400 hover:text-rose-600 hover:border-rose-200"
            }`}
        >
            {loading ? <Loader2 size={16} className="animate-spin" /> : icon}
        </button>
    );
}