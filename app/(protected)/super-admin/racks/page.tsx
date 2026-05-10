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
    Briefcase,
    Zap,
    ShieldCheck,
    Trash2,
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
        divisi: Divisi.IT,
    });

    const [racks, setRacks] = useState<any[]>([]);

    const [loading, setLoading] =
        useState(true);

    const [isSubmitting, setIsSubmitting] =
        useState(false);

    const [actionLoading, setActionLoading] =
        useState<string | null>(null);

    useEffect(() => {
        fetchPendingRacks();
    }, []);

    const fetchPendingRacks =
        async () => {
            try {
                setLoading(true);

                const res =
                    await api.get(
                        "/rack/admin/all"
                    );

                const rawData =
                    res?.data?.data ||
                    res?.data ||
                    [];

                const data =
                    Array.isArray(
                        rawData
                    )
                        ? rawData
                        : [];

                const clean =
                    data.filter(
                        (r: any) =>
                            r &&
                            typeof r ===
                            "object" &&
                            r.id &&
                            r.kode_rack
                    );

                setRacks(clean);
            } catch (err) {
                console.error(err);

                setRacks([]);
            } finally {
                setLoading(false);
            }
        };

    const handleCreateAdmin =
        async (
            e: React.FormEvent
        ) => {
            e.preventDefault();

            if (
                !form.name ||
                !form.email ||
                !form.password
            ) {
                return alert(
                    "Harap isi semua field!"
                );
            }

            try {
                setIsSubmitting(true);

                await api.post(
                    "/auth/register-admin",
                    form
                );

                await fetchPendingRacks();

                setForm({
                    name: "",
                    email: "",
                    password: "",
                    divisi:
                        Divisi.IT,
                });

                alert(
                    "Admin & Rack berhasil dibuat 🎉"
                );
            } catch (err: any) {
                alert(
                    err?.response
                        ?.data
                        ?.message ||
                    "Gagal registrasi admin"
                );
            } finally {
                setIsSubmitting(false);
            }
        };

    const handleStatusUpdate =
        async (
            id: string,
            type:
                | "approve"
                | "reject"
        ) => {
            try {
                setActionLoading(id);

                await api.patch(
                    `/rack/${id}/${type}`
                );

                await fetchPendingRacks();

            } catch (err: any) {
                alert(
                    err?.response
                        ?.data
                        ?.message ||
                    `Gagal ${type}`
                );
            } finally {
                setActionLoading(
                    null
                );
            }
        };

    const handleDeleteRack =
        async (id: string) => {
            const confirmDelete =
                confirm(
                    "Yakin ingin menghapus rack ini?"
                );

            if (!confirmDelete)
                return;

            try {
                setActionLoading(id);

                await api.delete(
                    `/rack/${id}`
                );

                setRacks((prev) =>
                    prev.filter(
                        (r) =>
                            r.id !==
                            id
                    )
                );

                alert(
                    "Rack berhasil dihapus"
                );
            } catch (err: any) {
                alert(
                    err?.response
                        ?.data
                        ?.message ||
                    "Gagal menghapus rack"
                );
            } finally {
                setActionLoading(
                    null
                );
            }
        };

    return (
        <div className="space-y-10">
            <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-5">
                <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-2 text-cyan-600 dark:text-cyan-400 font-black text-[10px] uppercase tracking-[0.3em]">
                        <ShieldCheck
                            size={14}
                        />

                        System Rack
                    </div>

                    <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight uppercase italic">
                        Register Admin
                        dan Rak
                    </h1>

                    <p className="text-slate-500 dark:text-slate-400 font-medium max-w-2xl">
                        Inisialisasi
                        akses admin baru
                        beserta unit rak
                        yang akan mereka
                        kelola.
                    </p>
                </div>
            </header>

            <div className="grid lg:grid-cols-12 gap-8 items-start">
                {/* FORM */}
                <motion.div
                    initial={{
                        opacity: 0,
                        y: 20,
                    }}
                    animate={{
                        opacity: 1,
                        y: 0,
                    }}
                    className="lg:col-span-4 bg-white dark:bg-slate-900 p-10 rounded-[3rem] border border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden"
                >
                    <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/5 rounded-full -mr-16 -mt-16 blur-3xl pointer-events-none" />

                    <div className="flex items-center gap-3 mb-10">
                        <div className="p-3 bg-cyan-500 rounded-2xl text-white shadow-lg shadow-cyan-200">
                            <Plus
                                size={20}
                                strokeWidth={
                                    3
                                }
                            />
                        </div>

                        <h3 className="font-black text-xs uppercase tracking-[0.2em] text-slate-800 dark:text-slate-100">
                            Register
                            Unit
                        </h3>
                    </div>

                    <form
                        onSubmit={
                            handleCreateAdmin
                        }
                        className="space-y-5"
                    >
                        <InputField
                            icon={
                                <User
                                    size={
                                        18
                                    }
                                />
                            }
                            placeholder="Admin Full Name"
                            value={
                                form.name
                            }
                            onChange={(
                                v: string
                            ) =>
                                setForm(
                                    {
                                        ...form,
                                        name: v,
                                    }
                                )
                            }
                        />

                        <InputField
                            icon={
                                <Mail
                                    size={
                                        18
                                    }
                                />
                            }
                            type="email"
                            placeholder="Email Address"
                            value={
                                form.email
                            }
                            onChange={(
                                v: string
                            ) =>
                                setForm(
                                    {
                                        ...form,
                                        email: v,
                                    }
                                )
                            }
                        />

                        <InputField
                            icon={
                                <Shield
                                    size={
                                        18
                                    }
                                />
                            }
                            type="password"
                            placeholder="Root Password"
                            value={
                                form.password
                            }
                            onChange={(
                                v: string
                            ) =>
                                setForm(
                                    {
                                        ...form,
                                        password:
                                            v,
                                    }
                                )
                            }
                        />

                        <div className="relative group">
                            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                                <Briefcase
                                    size={
                                        18
                                    }
                                />
                            </div>

                            <select
                                value={
                                    form.divisi
                                }
                                onChange={(
                                    e
                                ) =>
                                    setForm(
                                        {
                                            ...form,
                                            divisi:
                                                e
                                                    .target
                                                    .value as Divisi,
                                        }
                                    )
                                }
                                className="w-full pl-12 pr-10 py-4 bg-slate-50 dark:bg-slate-800 border border-transparent rounded-2xl text-sm font-bold appearance-none focus:ring-4 focus:ring-cyan-500/10 focus:bg-white dark:focus:bg-slate-900 transition-all outline-none dark:text-white"
                            >
                                {Object.values(
                                    Divisi
                                ).map(
                                    (
                                        dept
                                    ) => (
                                        <option
                                            key={
                                                dept
                                            }
                                            value={
                                                dept
                                            }
                                        >
                                            {
                                                dept
                                            }{" "}
                                            Department
                                        </option>
                                    )
                                )}
                            </select>
                        </div>

                        <button
                            disabled={
                                isSubmitting
                            }
                            className="w-full py-5 bg-slate-900 dark:bg-cyan-600 text-white rounded-[2rem] font-black text-[10px] uppercase tracking-[0.2em] hover:bg-cyan-600 dark:hover:bg-cyan-500 transition-all flex items-center justify-center gap-3 disabled:opacity-50 mt-6 shadow-xl active:scale-95"
                        >
                            {isSubmitting ? (
                                <Loader2
                                    className="animate-spin"
                                    size={
                                        18
                                    }
                                />
                            ) : (
                                <>
                                    Register

                                    <Zap
                                        size={
                                            14
                                        }
                                        fill="currentColor"
                                    />
                                </>
                            )}
                        </button>
                    </form>
                </motion.div>

                {/* TABLE */}
                <motion.div
                    initial={{
                        opacity: 0,
                        x: 20,
                    }}
                    animate={{
                        opacity: 1,
                        x: 0,
                    }}
                    className="lg:col-span-8 bg-white dark:bg-slate-900 rounded-[3rem] border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden"
                >
                    <div className="p-8 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/30 dark:bg-slate-800/30">
                        <h3 className="font-black text-xs uppercase tracking-[0.2em] text-slate-400">
                            Rack Management
                        </h3>

                        <span className="px-4 py-1.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-full text-[9px] font-black text-cyan-600 shadow-sm uppercase">
                            {
                                racks.length
                            }{" "}
                            Total
                        </span>
                    </div>

                    <div className="overflow-x-auto">
                        {loading ? (
                            <div className="py-40 flex flex-col items-center justify-center gap-4">
                                <Loader2
                                    className="animate-spin text-cyan-500"
                                    size={
                                        48
                                    }
                                />

                                <p className="text-[10px] font-black uppercase tracking-widest text-slate-300">
                                    Synchronizing...
                                </p>
                            </div>
                        ) : racks.length ===
                            0 ? (
                            <div className="py-32 text-center">
                                <Layers
                                    size={
                                        64
                                    }
                                    className="mx-auto mb-4 text-slate-200 dark:text-slate-700"
                                />

                                <p className="font-black uppercase tracking-widest text-[10px] text-slate-400 italic">
                                    No racks
                                    found.
                                </p>
                            </div>
                        ) : (
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="text-[10px] font-black uppercase tracking-[0.15em] text-slate-400 border-b border-slate-100 dark:border-slate-800">
                                        <th className="px-10 py-6">
                                            Unit
                                        </th>

                                        <th className="px-10 py-6">
                                            Division
                                        </th>

                                        <th className="px-10 py-6">
                                            Status
                                        </th>

                                        <th className="px-10 py-6 text-right">
                                            Action
                                        </th>
                                    </tr>
                                </thead>

                                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                                    <AnimatePresence mode="popLayout">
                                        {racks.map((rack) => (
                                            <motion.tr
                                                key={rack.id}
                                                layout
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                exit={{
                                                    opacity: 0,
                                                    x: -20,
                                                }}
                                                className="group hover:bg-cyan-50/20 dark:hover:bg-cyan-500/5 transition-colors"
                                            >
                                                {/* UNIT */}
                                                <td className="px-10 py-7">
                                                    <div className="flex items-center gap-5">
                                                        <div className="w-12 h-12 rounded-2xl bg-cyan-50 dark:bg-cyan-500/10 text-cyan-600 flex items-center justify-center group-hover:bg-cyan-500 group-hover:text-white transition-all shadow-sm">
                                                            <Layers size={22} />
                                                        </div>

                                                        <div className="flex flex-col">
                                                            <span className="font-black text-slate-900 dark:text-white text-base uppercase tracking-tight italic">
                                                                {rack.kode_rack}
                                                            </span>

                                                            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                                                                REF: {String(rack.id).slice(0, 8)}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </td>

                                                {/* DIVISION */}
                                                <td className="px-10 py-7">
                                                    <span className="inline-flex px-4 py-1.5 bg-slate-900 dark:bg-cyan-600 text-white rounded-xl text-[9px] font-black uppercase tracking-widest shadow-sm">
                                                        {rack.divisi}
                                                    </span>
                                                </td>

                                                {/* STATUS */}
                                                <td className="px-10 py-7">
                                                    <span
                                                        className={`inline-flex px-4 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest ${rack.status === "active"
                                                                ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400"
                                                                : rack.status === "inactive"
                                                                    ? "bg-rose-100 text-rose-700 dark:bg-rose-500/10 dark:text-rose-400"
                                                                    : "bg-amber-100 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400"
                                                            }`}
                                                    >
                                                        {rack.status}
                                                    </span>
                                                </td>

                                                {/* ACTION */}
                                                <td className="px-10 py-7">
                                                    <div className="flex items-center justify-end gap-3">

                                                        {rack.status === "pending" && (
                                                            <>
                                                                <ActionButton
                                                                    loading={
                                                                        actionLoading === rack.id
                                                                    }
                                                                    variant="success"
                                                                    icon={<Check size={18} />}
                                                                    onClick={() =>
                                                                        handleStatusUpdate(
                                                                            rack.id,
                                                                            "approve"
                                                                        )
                                                                    }
                                                                />

                                                                <ActionButton
                                                                    loading={
                                                                        actionLoading === rack.id
                                                                    }
                                                                    variant="danger"
                                                                    icon={<X size={18} />}
                                                                    onClick={() =>
                                                                        handleStatusUpdate(
                                                                            rack.id,
                                                                            "reject"
                                                                        )
                                                                    }
                                                                />
                                                            </>
                                                        )}

                                                        <ActionButton
                                                            loading={
                                                                actionLoading === rack.id
                                                            }
                                                            variant="delete"
                                                            icon={<Trash2 size={18} />}
                                                            onClick={() =>
                                                                handleDeleteRack(rack.id)
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
        <div className="relative group font-bold">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                {icon}
            </div>

            <input
                type={type}
                placeholder={placeholder}
                value={value}
                onChange={(e) =>
                    onChange(
                        e.target.value
                    )
                }
                className="w-full pl-12 pr-5 py-4 bg-slate-50 dark:bg-slate-800 border border-transparent rounded-2xl text-sm font-bold placeholder:text-slate-300 dark:placeholder:text-slate-500 focus:ring-4 focus:ring-cyan-500/10 focus:bg-white dark:focus:bg-slate-900 transition-all outline-none dark:text-white"
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
    const isSuccess =
        variant === "success";

    const isDanger =
        variant === "danger";

    return (
        <button
            disabled={loading}
            onClick={onClick}
            className={`w-11 h-11 flex items-center justify-center rounded-xl transition-all active:scale-90 shadow-sm ${isSuccess
                ? "bg-slate-900 dark:bg-cyan-600 text-white hover:bg-emerald-600"
                : isDanger
                    ? "bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-400 hover:text-rose-600 hover:border-rose-200"
                    : "bg-rose-50 dark:bg-rose-500/10 border border-rose-100 dark:border-rose-500/20 text-rose-500 hover:bg-rose-500 hover:text-white"
                }`}
        >
            {loading ? (
                <Loader2
                    size={16}
                    className="animate-spin"
                />
            ) : (
                icon
            )}
        </button>
    );
}