"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

import {
    Check,
    X,
    Search,
    Loader2,
    FileText,
    User,
    Archive,
    ShieldCheck,
    Eye,
    Download,
    Box,
    AlertTriangle,
} from "lucide-react";

import { api } from "@/lib/api";
import { toast } from "sonner";

interface DocumentItem {
    id: string;
    title: string;
    fileUrl: string;
    status?: string;
    user?: {
        name?: string;
        fullname?: string;
        fullName?: string;
    };
    box?: {
        kode_box?: string;
        rackId?: string;
        rack?: {
            kode_rack?: string;
            divisi?: string;
        };
    };
}

const STATUS_CONFIG = {
    approved: {
        label: "APPROVED",
        dot: "bg-emerald-400",
        badge: "bg-emerald-950/60 text-emerald-400 border border-emerald-500/30",
        glow: "shadow-emerald-500/20",
    },
    rejected: {
        label: "REJECTED",
        dot: "bg-rose-400",
        badge: "bg-rose-950/60 text-rose-400 border border-rose-500/30",
        glow: "shadow-rose-500/20",
    },
    pending: {
        label: "PENDING",
        dot: "bg-amber-400 animate-pulse",
        badge: "bg-amber-950/60 text-amber-400 border border-amber-500/30",
        glow: "shadow-amber-500/20",
    },
};

function StatusBadge({ status }: { status?: string }) {
    const key = (status || "pending") as keyof typeof STATUS_CONFIG;
    const cfg = STATUS_CONFIG[key] ?? STATUS_CONFIG.pending;
    return (
        <span className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-md text-[10px] font-mono font-bold tracking-widest shadow-lg ${cfg.badge} ${cfg.glow}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
            {cfg.label}
        </span>
    );
}

function AuthButton({
    type,
    onClick,
    loading,
    disabled,
}: {
    type: "approve" | "reject";
    onClick: () => void;
    loading: boolean;
    disabled: boolean;
}) {
    const isApprove = type === "approve";
    return (
        <motion.button
            whileTap={{ scale: 0.94 }}
            disabled={loading || disabled}
            onClick={onClick}
            className={`
        relative h-9 px-5 rounded-lg font-mono font-bold text-[10px] uppercase tracking-widest
        transition-all duration-200 flex items-center gap-2 overflow-hidden
        disabled:opacity-25 disabled:cursor-not-allowed
        ${isApprove
                    ? "bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500 hover:text-white hover:border-emerald-500 hover:shadow-lg hover:shadow-emerald-500/20"
                    : "bg-rose-500/10 border border-rose-500/30 text-rose-400 hover:bg-rose-500 hover:text-white hover:border-rose-500 hover:shadow-lg hover:shadow-rose-500/20"
                }
      `}
        >
            {loading ? (
                <Loader2 size={12} className="animate-spin" />
            ) : isApprove ? (
                <Check size={12} strokeWidth={3} />
            ) : (
                <X size={12} strokeWidth={3} />
            )}
            {type}
        </motion.button>
    );
}

export default function ApprovalsPage() {
    const [documents, setDocuments] = useState<DocumentItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [actionLoading, setActionLoading] = useState<string | null>(null);
    const [previewFile, setPreviewFile] = useState<DocumentItem | null>(null);

    useEffect(() => { fetchDocs(); }, []);

    async function fetchDocs() {
        try {
            setLoading(true);
            const rackRes = await api.get("/rack/my");
            const myRack = rackRes.data?.data || rackRes.data;
            const rackId = Array.isArray(myRack) ? myRack[0]?.id : myRack?.id;
            const docRes = await api.get("/documents");
            const docs: DocumentItem[] = Array.isArray(docRes.data)
                ? docRes.data
                : docRes.data?.data || [];
            setDocuments(docs.filter((doc) => doc.box?.rackId === rackId));
        } catch (err) {
            console.error(err);
            toast.error("Gagal sinkronisasi dokumen");
        } finally {
            setLoading(false);
        }
    }

    async function updateStatus(id: string, action: "approve" | "reject") {
        try {
            setActionLoading(id);
            await api.patch(`/documents/${id}/${action}`);
            toast.success(`Dokumen berhasil ${action === "approve" ? "disetujui" : "ditolak"}`);
            fetchDocs();
        } catch (err: any) {
            toast.error(err?.response?.data?.message || "Operasi gagal");
        } finally {
            setActionLoading(null);
        }
    }

    const filtered = documents.filter((doc) => {
        const term = search.toLowerCase();
        return (
            doc.title?.toLowerCase().includes(term) ||
            (doc.user?.name || doc.user?.fullname || doc.user?.fullName || "").toLowerCase().includes(term) ||
            doc.box?.kode_box?.toLowerCase().includes(term)
        );
    });

    const stats = {
        total: documents.length,
        pending: documents.filter((d) => !d.status || d.status === "pending").length,
        approved: documents.filter((d) => d.status === "approved").length,
        rejected: documents.filter((d) => d.status === "rejected").length,
    };

    return (
        <div className="min-h-screen bg-[#050d1a] text-white font-mono">
            {/* Subtle grid background */}
            <div
                className="fixed inset-0 pointer-events-none opacity-[0.03]"
                style={{
                    backgroundImage: `linear-gradient(#00e5ff 1px, transparent 1px), linear-gradient(90deg, #00e5ff 1px, transparent 1px)`,
                    backgroundSize: "40px 40px",
                }}
            />

            <div className="relative z-10 max-w-screen-2xl mx-auto px-6 py-10 space-y-8">

                {/* ── Header ─────────────────────────────────────────────── */}
                <motion.header
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="flex flex-col lg:flex-row lg:items-center justify-between gap-6"
                >
                    <div className="flex items-center gap-5">
                        {/* Icon block */}
                        <div className="relative">
                            <div className="absolute inset-0 bg-cyan-500/20 rounded-2xl blur-xl" />
                            <div className="relative w-16 h-16 bg-gradient-to-br from-cyan-400 to-cyan-600 rounded-2xl flex items-center justify-center shadow-2xl shadow-cyan-500/30">
                                <ShieldCheck size={32} strokeWidth={1.5} className="text-white" />
                            </div>
                        </div>
                        <div>
                            <div className="flex items-center gap-3 mb-1">
                                <span className="text-[9px] font-bold tracking-[0.4em] text-cyan-500 uppercase">
                                    Document Control System
                                </span>
                                <span className="w-1.5 h-1.5 rounded-full bg-cyan-500 animate-pulse" />
                                <span className="text-[9px] text-cyan-500/60 tracking-widest">LIVE</span>
                            </div>
                            <h1 className="text-3xl font-black tracking-tight text-white uppercase">
                                Authorization Center
                            </h1>
                            <p className="text-slate-500 text-xs mt-1 tracking-wide">
                                Verify and manage incoming document assets
                            </p>
                        </div>
                    </div>

                    {/* Search */}
                    <div className="relative w-full lg:w-80">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                        <input
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search title, user, box..."
                            className="w-full pl-11 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder-slate-600 font-mono focus:outline-none focus:border-cyan-500/50 focus:bg-white/8 transition-all"
                        />
                    </div>
                </motion.header>

                {/* ── Stat Cards ─────────────────────────────────────────── */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.15, duration: 0.4 }}
                    className="grid grid-cols-2 lg:grid-cols-4 gap-4"
                >
                    {[
                        { label: "Total Assets", value: stats.total, color: "text-slate-300", border: "border-white/10" },
                        { label: "Pending Review", value: stats.pending, color: "text-amber-400", border: "border-amber-500/20" },
                        { label: "Approved", value: stats.approved, color: "text-emerald-400", border: "border-emerald-500/20" },
                        { label: "Rejected", value: stats.rejected, color: "text-rose-400", border: "border-rose-500/20" },
                    ].map((s) => (
                        <div key={s.label} className={`bg-white/[0.03] border ${s.border} rounded-2xl px-6 py-5`}>
                            <p className="text-[9px] font-bold uppercase tracking-[0.3em] text-slate-600 mb-2">{s.label}</p>
                            <p className={`text-3xl font-black ${s.color} tabular-nums`}>{s.value}</p>
                        </div>
                    ))}
                </motion.div>

                {/* ── Table ──────────────────────────────────────────────── */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.25, duration: 0.4 }}
                    className="bg-white/[0.02] border border-white/10 rounded-3xl overflow-hidden"
                >
                    {/* Table header bar */}
                    <div className="flex items-center justify-between px-8 py-4 border-b border-white/10 bg-white/[0.02]">
                        <span className="text-[10px] font-bold tracking-[0.3em] text-slate-500 uppercase">
                            Document Queue — {filtered.length} records
                        </span>
                        {stats.pending > 0 && (
                            <div className="flex items-center gap-2 text-amber-400">
                                <AlertTriangle size={12} />
                                <span className="text-[10px] font-bold tracking-widest">{stats.pending} AWAITING ACTION</span>
                            </div>
                        )}
                    </div>

                    {loading ? (
                        <div className="py-40 flex flex-col items-center justify-center gap-5">
                            <div className="relative w-16 h-16">
                                <div className="absolute inset-0 rounded-full border-2 border-cyan-500/20" />
                                <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-cyan-500 animate-spin" />
                                <ShieldCheck className="absolute inset-0 m-auto text-cyan-500/50" size={24} />
                            </div>
                            <p className="text-[10px] font-bold tracking-[0.4em] text-slate-600 uppercase">Syncing assets...</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="text-[9px] font-bold uppercase tracking-[0.3em] text-slate-600 border-b border-white/5">
                                        {["Resource", "Contributor", "Container", "Status", "Inspect", "Action"].map((h) => (
                                            <th key={h} className="px-8 py-4 text-left last:text-center">{h}</th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    <AnimatePresence mode="popLayout">
                                        {filtered.length > 0 ? (
                                            filtered.map((doc, i) => {
                                                const userName = doc.user?.name || doc.user?.fullname || doc.user?.fullName || "—";
                                                const isActing = actionLoading === doc.id;
                                                return (
                                                    <motion.tr
                                                        key={doc.id}
                                                        layout
                                                        initial={{ opacity: 0, x: -10 }}
                                                        animate={{ opacity: 1, x: 0 }}
                                                        exit={{ opacity: 0, x: 10 }}
                                                        transition={{ delay: i * 0.03 }}
                                                        className="group border-b border-white/5 last:border-0 hover:bg-cyan-500/[0.03] transition-colors relative"
                                                    >
                                                        {/* Left accent bar on hover */}
                                                        <td className="px-8 py-5">
                                                            <div className="flex items-center gap-3">
                                                                <div className="w-9 h-9 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 group-hover:bg-cyan-500 group-hover:text-white group-hover:border-cyan-500 transition-all flex-shrink-0">
                                                                    <FileText size={16} />
                                                                </div>
                                                                <span className="font-bold text-sm text-white tracking-tight line-clamp-1 max-w-[180px]">
                                                                    {doc.title}
                                                                </span>
                                                            </div>
                                                        </td>

                                                        <td className="px-8 py-5">
                                                            <div className="flex items-center gap-2">
                                                                <User size={12} className="text-slate-600 flex-shrink-0" />
                                                                <span className="text-xs text-slate-400 font-medium">{userName}</span>
                                                            </div>
                                                        </td>

                                                        <td className="px-8 py-5">
                                                            <div className="space-y-1.5">
                                                                <div className="flex items-center gap-2">
                                                                    <Archive size={11} className="text-slate-600 flex-shrink-0" />
                                                                    <span className="text-[11px] text-slate-400 font-bold tracking-wider">
                                                                        {doc.box?.rack?.kode_rack || "—"}
                                                                    </span>
                                                                </div>
                                                                <div className="flex items-center gap-2">
                                                                    <Box size={11} className="text-slate-600 flex-shrink-0" />
                                                                    <span className="text-[11px] text-slate-400 font-bold tracking-wider">
                                                                        {doc.box?.kode_box || "—"}
                                                                    </span>
                                                                </div>
                                                            </div>
                                                        </td>

                                                        <td className="px-8 py-5">
                                                            <StatusBadge status={doc.status} />
                                                        </td>

                                                        <td className="px-8 py-5">
                                                            <div className="flex justify-start gap-2">
                                                                <motion.button
                                                                    whileTap={{ scale: 0.9 }}
                                                                    onClick={() => setPreviewFile(doc)}
                                                                    className="w-9 h-9 rounded-lg bg-white/5 border border-white/10 text-slate-400 hover:bg-cyan-500 hover:text-white hover:border-cyan-500 hover:shadow-lg hover:shadow-cyan-500/20 transition-all flex items-center justify-center"
                                                                >
                                                                    <Eye size={15} />
                                                                </motion.button>
                                                                <motion.button
                                                                    whileTap={{ scale: 0.9 }}
                                                                    onClick={() => window.open(doc.fileUrl, "_blank")}
                                                                    className="w-9 h-9 rounded-lg bg-white/5 border border-white/10 text-slate-400 hover:bg-slate-300 hover:text-slate-900 hover:border-slate-300 transition-all flex items-center justify-center"
                                                                >
                                                                    <Download size={15} />
                                                                </motion.button>
                                                            </div>
                                                        </td>

                                                        <td className="px-8 py-5">
                                                            <div className="flex justify-center gap-2">
                                                                <AuthButton
                                                                    type="approve"
                                                                    onClick={() => updateStatus(doc.id, "approve")}
                                                                    loading={isActing}
                                                                    disabled={doc.status === "approved"}
                                                                />
                                                                <AuthButton
                                                                    type="reject"
                                                                    onClick={() => updateStatus(doc.id, "reject")}
                                                                    loading={isActing}
                                                                    disabled={doc.status === "rejected"}
                                                                />
                                                            </div>
                                                        </td>
                                                    </motion.tr>
                                                );
                                            })
                                        ) : (
                                            <tr>
                                                <td colSpan={6} className="py-32 text-center">
                                                    <div className="flex flex-col items-center gap-4">
                                                        <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center">
                                                            <Search size={24} className="text-slate-700" />
                                                        </div>
                                                        <div>
                                                            <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-slate-600">
                                                                No matching documents
                                                            </p>
                                                            <p className="text-[10px] text-slate-700 mt-1">
                                                                {search ? `"${search}" returned 0 results` : "Queue is empty"}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </td>
                                            </tr>
                                        )}
                                    </AnimatePresence>
                                </tbody>
                            </table>
                        </div>
                    )}
                </motion.div>
            </div>

            {/* ── Preview Modal ───────────────────────────────────────── */}
            <AnimatePresence>
                {previewFile && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setPreviewFile(null)}
                        className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-md flex items-center justify-center p-6"
                    >
                        <motion.div
                            initial={{ scale: 0.93, y: 24, opacity: 0 }}
                            animate={{ scale: 1, y: 0, opacity: 1 }}
                            exit={{ scale: 0.93, y: 24, opacity: 0 }}
                            transition={{ type: "spring", stiffness: 300, damping: 28 }}
                            onClick={(e) => e.stopPropagation()}
                            className="w-full max-w-6xl h-[90vh] bg-[#080f20] border border-white/10 rounded-3xl overflow-hidden shadow-2xl flex flex-col"
                        >
                            {/* Modal header */}
                            <div className="flex items-center justify-between px-8 py-5 border-b border-white/10 bg-white/[0.02] flex-shrink-0">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-xl bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                                        <FileText size={18} />
                                    </div>
                                    <div>
                                        <h2 className="font-black text-white tracking-tight text-lg leading-none">
                                            {previewFile.title}
                                        </h2>
                                        <p className="text-[10px] text-cyan-500/70 tracking-[0.3em] uppercase mt-1">
                                            Asset Validation Preview
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <motion.button
                                        whileTap={{ scale: 0.9 }}
                                        onClick={() => window.open(previewFile.fileUrl, "_blank")}
                                        className="flex items-center gap-2 px-4 h-9 rounded-lg bg-white/5 border border-white/10 text-slate-400 hover:bg-slate-300 hover:text-slate-900 hover:border-transparent text-xs font-bold tracking-widest transition-all"
                                    >
                                        <Download size={14} />
                                        DOWNLOAD
                                    </motion.button>
                                    <motion.button
                                        whileTap={{ scale: 0.9 }}
                                        onClick={() => setPreviewFile(null)}
                                        className="w-9 h-9 rounded-lg bg-white/5 border border-white/10 text-slate-400 hover:bg-rose-500 hover:text-white hover:border-rose-500 transition-all flex items-center justify-center"
                                    >
                                        <X size={16} />
                                    </motion.button>
                                </div>
                            </div>

                            {/* iframe */}
                            <div className="flex-1 bg-[#050a15] p-4">
                                <iframe
                                    src={previewFile.fileUrl}
                                    className="w-full h-full rounded-xl border border-white/10"
                                    title="Document Preview"
                                />
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}