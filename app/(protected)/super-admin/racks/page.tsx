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

            const clean = data.filter(
                (r: any) =>
                    r &&
                    typeof r === "object" &&
                    r.id &&
                    r.name_rack
            );

            setRacks(clean);
        } catch (err) {
            console.error("LOAD ERROR:", err);
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

        if (
            !form.name ||
            !form.email ||
            !form.password ||
            !form.name_rack
        ) {
            return alert("Harap isi semua field!");
        }

        try {
            setIsSubmitting(true);

            const res = await api.post(
                "/auth/register-admin",
                form
            );

            const newRack = res?.data?.rack || res?.data;

            if (newRack?.id) {
                setRacks((prev) => [newRack, ...prev]);
            } else {
                await fetchPendingRacks();
            }

            setForm({
                name: "",
                email: "",
                password: "",
                name_rack: "",
                divisi: Divisi.IT,
            });

            alert("Admin & Rack berhasil didaftarkan! 🎉");
        } catch (err: any) {
            alert(
                err?.response?.data?.message ||
                "Gagal registrasi admin"
            );
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleStatusUpdate = async (
        id: string,
        type: "approve" | "reject"
    ) => {
        try {
            setActionLoading(id);

            await api.patch(`/rack/${id}/${type}`);

            setRacks((prev) =>
                prev.filter((r) => r?.id !== id)
            );
        } catch (err: any) {
            alert(
                err?.response?.data?.message ||
                `Gagal melakukan ${type}`
            );
        } finally {
            setActionLoading(null);
        }
    };

    return (
        <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <header className="flex flex-col gap-2">
                <h1 className="text-3xl font-black text-slate-900 tracking-tight">
                    Rack Provisions
                </h1>

                <p className="text-slate-500 font-medium italic">
                    Manage administrative access and hardware unit approvals.
                </p>
            </header>

            <div className="grid lg:grid-cols-12 gap-8 items-start">
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="lg:col-span-4 bg-white p-8 rounded-[2.5rem] border border-slate-200/60 shadow-[0_10px_40px_rgba(0,0,0,0.02)] sticky top-24"
                >
                    <div className="flex items-center gap-3 mb-8">
                        <div className="p-2.5 bg-blue-600 rounded-2xl text-white shadow-lg shadow-blue-200">
                            <Plus size={20} />
                        </div>

                        <h3 className="font-black text-xs uppercase tracking-[0.2em] text-slate-800">
                            Register Unit
                        </h3>
                    </div>

                    <form
                        onSubmit={handleCreateAdmin}
                        className="space-y-4"
                    >
                        <InputField
                            icon={<User size={18} />}
                            placeholder="Admin Full Name"
                            value={form.name}
                            onChange={(v: string) =>
                                setForm({ ...form, name: v })
                            }
                        />

                        <InputField
                            icon={<Mail size={18} />}
                            type="email"
                            placeholder="Email Address"
                            value={form.email}
                            onChange={(v: string) =>
                                setForm({ ...form, email: v })
                            }
                        />

                        <InputField
                            icon={<Shield size={18} />}
                            type="password"
                            placeholder="Password"
                            value={form.password}
                            onChange={(v: string) =>
                                setForm({ ...form, password: v })
                            }
                        />

                        <InputField
                            icon={<Layout size={18} />}
                            placeholder="Rack Name (e.g. Rack-01)"
                            value={form.name_rack}
                            onChange={(v: string) =>
                                setForm({ ...form, name_rack: v })
                            }
                        />

                        <div className="relative group">
                            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors">
                                <Briefcase size={18} />
                            </div>

                            <select
                                value={form.divisi}
                                onChange={(e) =>
                                    setForm({
                                        ...form,
                                        divisi: e.target.value as Divisi,
                                    })
                                }
                                className="w-full pl-12 pr-10 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold appearance-none focus:ring-4 focus:ring-blue-500/10 focus:bg-white transition-all outline-none"
                            >
                                {Object.values(Divisi).map((dept) => (
                                    <option key={dept} value={dept}>
                                        {dept}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <button
                            disabled={isSubmitting}
                            className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-blue-600 transition-all flex items-center justify-center gap-3 disabled:opacity-50 mt-4 shadow-xl shadow-slate-200 hover:shadow-blue-200"
                        >
                            {isSubmitting ? (
                                <Loader2
                                    className="animate-spin"
                                    size={18}
                                />
                            ) : (
                                "Initialize System Access"
                            )}
                        </button>
                    </form>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="lg:col-span-8 bg-white rounded-[2.5rem] border border-slate-200/60 shadow-[0_10px_40px_rgba(0,0,0,0.02)] overflow-hidden"
                >
                    <div className="p-8 border-b border-slate-50 flex items-center justify-between bg-slate-50/30">
                        <h3 className="font-black text-xs uppercase tracking-[0.2em] text-slate-500">
                            Pending Approvals
                        </h3>

                        <span className="px-3 py-1 bg-white border border-slate-200 rounded-full text-[10px] font-black text-blue-600 shadow-sm">
                            {racks.length} REQUESTS
                        </span>
                    </div>

                    <div className="overflow-x-auto">
                        {loading ? (
                            <div className="py-32 flex flex-col items-center justify-center gap-4">
                                <Loader2
                                    className="animate-spin text-blue-600"
                                    size={32}
                                />

                                <p className="text-[10px] font-black uppercase tracking-widest text-slate-300">
                                    Synchronizing Data...
                                </p>
                            </div>
                        ) : racks.length === 0 ? (
                            <div className="py-32 text-center text-slate-400">
                                <Layers
                                    size={48}
                                    className="mx-auto mb-4 opacity-10"
                                />

                                <p className="font-bold italic text-sm">
                                    No pending rack requests found.
                                </p>
                            </div>
                        ) : (
                            <table className="w-full">
                                <thead>
                                    <tr className="text-[10px] font-black uppercase tracking-widest text-slate-400 border-b border-slate-50">
                                        <th className="px-8 py-5 text-left font-black">
                                            Unit Identity
                                        </th>

                                        <th className="px-8 py-5 text-left font-black">
                                            Department
                                        </th>

                                        <th className="px-8 py-5 text-right font-black">
                                            Control
                                        </th>
                                    </tr>
                                </thead>

                                <tbody className="divide-y divide-slate-50">
                                    <AnimatePresence mode="popLayout">
                                        {racks
                                            .filter((rack) => rack?.id)
                                            .map((rack) => (
                                                <motion.tr
                                                    key={rack?.id}
                                                    layout
                                                    initial={{ opacity: 0 }}
                                                    animate={{ opacity: 1 }}
                                                    exit={{
                                                        opacity: 0,
                                                        scale: 0.95,
                                                    }}
                                                    className="group hover:bg-slate-50/50 transition-colors"
                                                >
                                                    <td className="px-8 py-6">
                                                        <div className="flex items-center gap-4">
                                                            <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-400 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-all shadow-sm">
                                                                <Layers size={18} />
                                                            </div>

                                                            <div className="flex flex-col">
                                                                <span className="font-black text-slate-800 text-sm">
                                                                    {rack?.name_rack ||
                                                                        "Unnamed Rack"}
                                                                </span>

                                                                <span className="text-[10px] text-slate-400 font-medium">
                                                                    ID:{" "}
                                                                    {String(
                                                                        rack?.id || ""
                                                                    ).slice(0, 8)}
                                                                    ...
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </td>

                                                    <td className="px-8 py-6">
                                                        <span className="inline-flex px-3 py-1 bg-blue-50 text-blue-600 rounded-lg text-[10px] font-black uppercase border border-blue-100">
                                                            {rack?.divisi || "-"}
                                                        </span>
                                                    </td>

                                                    <td className="px-8 py-6">
                                                        <div className="flex items-center justify-end gap-2">
                                                            <ActionButton
                                                                loading={
                                                                    actionLoading === rack?.id
                                                                }
                                                                variant="success"
                                                                icon={<Check size={18} />}
                                                                onClick={() =>
                                                                    handleStatusUpdate(
                                                                        rack?.id,
                                                                        "approve"
                                                                    )
                                                                }
                                                            />

                                                            <ActionButton
                                                                loading={
                                                                    actionLoading === rack?.id
                                                                }
                                                                variant="danger"
                                                                icon={<X size={18} />}
                                                                onClick={() =>
                                                                    handleStatusUpdate(
                                                                        rack?.id,
                                                                        "reject"
                                                                    )
                                                                }
                                                            />
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

function InputField({
    icon,
    type = "text",
    placeholder,
    value,
    onChange,
}: any) {
    return (
        <div className="relative group">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors">
                {icon}
            </div>

            <input
                type={type}
                placeholder={placeholder}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="w-full pl-12 pr-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold placeholder:text-slate-300 placeholder:font-medium focus:ring-4 focus:ring-blue-500/10 focus:bg-white focus:border-blue-100 transition-all outline-none"
            />
        </div>
    );
}

function ActionButton({
    variant,
    icon,
    onClick,
    loading,
}: any) {
    const theme =
        variant === "success"
            ? "bg-emerald-50 text-emerald-600 hover:bg-emerald-500"
            : "bg-rose-50 text-rose-600 hover:bg-rose-500";

    return (
        <button
            disabled={loading}
            onClick={onClick}
            className={`p-2.5 rounded-xl transition-all active:scale-90 hover:text-white hover:shadow-lg disabled:opacity-40 ${theme}`}
        >
            {loading ? (
                <Loader2 size={18} className="animate-spin" />
            ) : (
                icon
            )}
        </button>
    );
}