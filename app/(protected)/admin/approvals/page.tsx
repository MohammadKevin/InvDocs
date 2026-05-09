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
    Calendar,
    ArrowUpRight,
} from "lucide-react";
import { api } from "@/lib/api";
import { toast } from "sonner";

export default function ApprovalsPage() {
    const [documents, setDocuments] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [actionLoading, setActionLoading] = useState<string | null>(null);
    const [previewOpen, setPreviewOpen] = useState(false);
    const [previewFile, setPreviewFile] = useState<any>(null);

    useEffect(() => {
        fetchDocs();
    }, []);

    async function fetchDocs() {
        try {
            setLoading(true);
            const rackRes = await api.get("/rack/my");
            const myRack = rackRes.data?.data || rackRes.data;
            const rackId = Array.isArray(myRack) ? myRack[0]?.id : myRack?.id;

            const docRes = await api.get("/documents");
            const docs = Array.isArray(docRes.data) ? docRes.data : docRes.data?.data ?? [];

            const filteredDocs = docs.filter((doc: any) => doc.box?.rackId === rackId);
            setDocuments(filteredDocs);
        } catch (err: any) {
            toast.error("Gagal sinkronisasi dokumen");
        } finally {
            setLoading(false);
        }
    }

    const updateStatus = async (id: string, action: "approve" | "reject") => {
        try {
            setActionLoading(id);
            const endpoint = action === "approve" ? `/documents/${id}/approve` : `/documents/${id}/reject`;
            await api.patch(endpoint);
            toast.success(`Dokumen berhasil ${action === "approve" ? "disetujui" : "ditolak"}`);
            fetchDocs();
        } catch (err: any) {
            toast.error(err?.response?.data?.message || "Operasi gagal");
        } finally {
            setActionLoading(null);
        }
    };

    const filtered = documents.filter((d) => {
        const title = d.title?.toLowerCase() || "";
        const user = (d.user?.fullname || d.user?.fullName || "").toLowerCase();
        return title.includes(search.toLowerCase()) || user.includes(search.toLowerCase());
    });

    return (
        <div className="space-y-10">
            {/* EXCLUSIVE HEADER */}
            <header className="bg-white p-10 rounded-[3rem] border border-slate-200/60 shadow-sm flex flex-col lg:flex-row justify-between items-center gap-8 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/5 rounded-full -mr-32 -mt-32 blur-3xl pointer-events-none" />
                
                <div className="flex items-center gap-8 relative z-10">
                    <div className="w-20 h-20 bg-cyan-500 rounded-[2rem] flex items-center justify-center text-white shadow-2xl shadow-cyan-200">
                        <ShieldCheck size={40} strokeWidth={1.5} />
                    </div>
                    <div>
                        <h1 className="text-4xl font-black text-slate-900 tracking-tighter uppercase italic">
                            Authorization Center
                        </h1>
                        <p className="text-slate-400 font-medium mt-1">Verify and manage incoming document assets.</p>
                    </div>
                </div>

                <div className="relative group w-full lg:w-96 relative z-10">
                    <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-cyan-500 transition-colors" size={20} />
                    <input
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search by title or contributor..."
                        className="w-full pl-14 pr-6 py-4 bg-slate-50 border border-transparent rounded-2xl text-sm font-bold focus:ring-4 focus:ring-cyan-500/10 focus:bg-white focus:border-cyan-200 outline-none transition-all shadow-inner"
                    />
                </div>
            </header>

            {/* DATA TABLE */}
            <div className="bg-white rounded-[3rem] border border-slate-200/60 shadow-sm overflow-hidden">
                {loading ? (
                    <div className="py-40 flex flex-col items-center justify-center space-y-4">
                        <div className="relative">
                            <div className="w-16 h-16 border-4 border-cyan-100 rounded-full animate-pulse"></div>
                            <Loader2 className="absolute top-0 animate-spin text-cyan-500" size={64} />
                        </div>
                        <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400">Verifying Assets...</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead className="bg-slate-50/50 text-slate-400 uppercase tracking-widest text-[10px] font-black border-b border-slate-100">
                                <tr>
                                    <th className="px-10 py-6">Resource</th>
                                    <th className="px-10 py-6">Contributor</th>
                                    <th className="px-10 py-6">Container</th>
                                    <th className="px-10 py-6">Status</th>
                                    <th className="px-10 py-6 text-center">Inspection</th>
                                    <th className="px-10 py-6 text-center">Auth Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                <AnimatePresence mode="popLayout">
                                    {filtered.map((doc) => (
                                        <motion.tr
                                            layout
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            exit={{ opacity: 0 }}
                                            key={doc.id}
                                            className="hover:bg-cyan-50/20 transition-colors group"
                                        >
                                            <td className="px-10 py-6">
                                                <div className="flex items-center gap-4">
                                                    <div className="p-3 bg-cyan-50 text-cyan-600 rounded-xl group-hover:bg-cyan-500 group-hover:text-white transition-all">
                                                        <FileText size={20} />
                                                    </div>
                                                    <span className="font-black text-slate-800 tracking-tight uppercase text-sm">
                                                        {doc.title}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-10 py-6">
                                                <div className="flex items-center gap-2 text-slate-500 font-bold text-xs italic">
                                                    <User size={14} className="text-slate-300" />
                                                    {doc.user?.fullname || doc.user?.fullName}
                                                </div>
                                            </td>
                                            <td className="px-10 py-6">
                                                <div className="flex items-center gap-2 text-slate-500 font-bold text-xs uppercase tracking-tighter">
                                                    <Archive size={14} className="text-slate-300" />
                                                    {doc.box?.name_box || "Unsorted"}
                                                </div>
                                            </td>
                                            <td className="px-10 py-6">
                                                <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase border tracking-widest ${
                                                    doc.status === "approved" ? "bg-emerald-50 text-emerald-600 border-emerald-100" :
                                                    doc.status === "rejected" ? "bg-rose-50 text-rose-600 border-rose-100" :
                                                    "bg-amber-50 text-amber-600 border-amber-100"
                                                }`}>
                                                    {doc.status || "pending"}
                                                </span>
                                            </td>
                                            <td className="px-10 py-6">
                                                <div className="flex justify-center gap-2">
                                                    <button onClick={() => setPreviewFile(doc) || setPreviewOpen(true)} className="h-11 w-11 flex items-center justify-center rounded-xl bg-slate-900 text-white hover:bg-cyan-500 transition-all shadow-sm active:scale-90">
                                                        <Eye size={18} />
                                                    </button>
                                                    <button onClick={() => window.open(doc.fileUrl, '_blank')} className="h-11 w-11 flex items-center justify-center rounded-xl bg-cyan-50 text-cyan-600 hover:bg-cyan-600 hover:text-white transition-all shadow-sm active:scale-90">
                                                        <Download size={18} />
                                                    </button>
                                                </div>
                                            </td>
                                            <td className="px-10 py-6">
                                                <div className="flex justify-center gap-3">
                                                    <AuthButton
                                                        type="approve"
                                                        onClick={() => updateStatus(doc.id, "approve")}
                                                        loading={actionLoading === doc.id}
                                                        disabled={doc.status === "approved"}
                                                    />
                                                    <AuthButton
                                                        type="reject"
                                                        onClick={() => updateStatus(doc.id, "reject")}
                                                        loading={actionLoading === doc.id}
                                                        disabled={doc.status === "rejected"}
                                                    />
                                                </div>
                                            </td>
                                        </motion.tr>
                                    ))}
                                </AnimatePresence>
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* PREVIEW MODAL */}
            <AnimatePresence>
                {previewOpen && previewFile && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[100] bg-slate-900/90 backdrop-blur-md flex items-center justify-center p-6">
                        <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} className="w-full max-w-6xl h-[90vh] bg-white rounded-[3rem] overflow-hidden shadow-2xl flex flex-col">
                            <div className="flex items-center justify-between px-8 py-6 border-b border-slate-100">
                                <div>
                                    <h2 className="font-black text-2xl text-slate-900 uppercase italic tracking-tighter">{previewFile.title}</h2>
                                    <p className="text-xs font-bold text-cyan-600 uppercase tracking-[0.2em]">Asset Validation Preview</p>
                                </div>
                                <button onClick={() => setPreviewOpen(false)} className="w-12 h-12 rounded-full bg-slate-100 hover:bg-rose-500 hover:text-white transition-all flex items-center justify-center">
                                    <X size={24} />
                                </button>
                            </div>
                            <div className="flex-1 bg-slate-50 p-4">
                                <iframe src={previewFile.fileUrl} className="w-full h-full rounded-2xl border border-slate-200 shadow-inner" />
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

function AuthButton({ type, onClick, loading, disabled }: { type: "approve" | "reject", onClick: () => void, loading: boolean, disabled: boolean }) {
    const isApprove = type === "approve";
    return (
        <button
            disabled={loading || disabled}
            onClick={onClick}
            className={`h-11 px-6 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all active:scale-95 flex items-center gap-2 shadow-sm ${
                isApprove 
                ? "bg-slate-900 text-white hover:bg-emerald-600 disabled:opacity-20" 
                : "bg-white border border-slate-200 text-slate-400 hover:text-rose-600 hover:border-rose-200 disabled:opacity-20"
            }`}
        >
            {loading ? <Loader2 size={14} className="animate-spin" /> : isApprove ? <Check size={14} /> : <X size={14} />}
            {type}
        </button>
    );
}