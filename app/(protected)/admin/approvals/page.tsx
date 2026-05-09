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
} from "lucide-react";

import { api } from "@/lib/api";
import { toast } from "sonner";

export default function ApprovalsPage() {
    const [documents, setDocuments] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [actionLoading, setActionLoading] = useState<string | null>(null);

    const [previewOpen, setPreviewOpen] =
        useState(false);

    const [previewFile, setPreviewFile] =
        useState<any>(null);

    useEffect(() => {
        fetchDocs();
    }, []);

    async function fetchDocs() {
        try {
            setLoading(true);

            // ambil rack milik admin
            const rackRes = await api.get("/rack/my");

            const myRack =
                rackRes.data?.data ||
                rackRes.data;

            const rackId = Array.isArray(myRack)
                ? myRack[0]?.id
                : myRack?.id;

            // ambil dokumen
            const docRes = await api.get(
                "/documents"
            );

            const docs = Array.isArray(
                docRes.data
            )
                ? docRes.data
                : docRes.data?.data ?? [];

            // filter berdasarkan rack admin
            const filteredDocs = docs.filter(
                (doc: any) =>
                    doc.box?.rackId === rackId
            );

            setDocuments(filteredDocs);
        } catch (err: any) {
            console.error(err);

            toast.error(
                "Gagal sinkronisasi dokumen"
            );
        } finally {
            setLoading(false);
        }
    }

    const updateStatus = async (
        id: string,
        action: "approve" | "reject"
    ) => {
        try {
            setActionLoading(id);

            const endpoint =
                action === "approve"
                    ? `/documents/${id}/approve`
                    : `/documents/${id}/reject`;

            await api.patch(endpoint);

            toast.success(
                `Document ${action === "approve"
                    ? "approved"
                    : "rejected"
                }`
            );

            fetchDocs();
        } catch (err: any) {
            console.error(
                "PATCH ERROR:",
                err
            );

            toast.error(
                err?.response?.data
                    ?.message ||
                "Operation failed"
            );
        } finally {
            setActionLoading(null);
        }
    };

    const openPreview = (doc: any) => {
        setPreviewFile(doc);
        setPreviewOpen(true);
    };

    const downloadFile = (
        url: string,
        title: string
    ) => {
        const link =
            document.createElement("a");

        link.href = url;
        link.setAttribute(
            "download",
            title
        );

        document.body.appendChild(link);

        link.click();

        document.body.removeChild(link);
    };

    const filtered = Array.isArray(
        documents
    )
        ? documents.filter((d) => {
            const title =
                d.title?.toLowerCase() ||
                "";

            const user =
                (
                    d.user?.fullname ||
                    d.user?.fullName ||
                    ""
                ).toLowerCase();

            return (
                title.includes(
                    search.toLowerCase()
                ) ||
                user.includes(
                    search.toLowerCase()
                )
            );
        })
        : [];

    return (
        <>
            <div className="space-y-10">
                <div className="bg-white p-10 rounded-[3rem] border border-slate-200/60 shadow-[0_20px_50px_rgba(0,0,0,0.02)] flex flex-col md:flex-row justify-between items-center gap-8">
                    <div className="flex items-center gap-6">
                        <div className="w-16 h-16 bg-blue-600 rounded-[1.5rem] flex items-center justify-center text-white shadow-xl shadow-blue-100">
                            <ShieldCheck size={32} />
                        </div>

                        <div>
                            <h1 className="text-3xl font-black text-slate-900 tracking-tighter uppercase italic">
                                Access Control
                            </h1>

                            <p className="text-slate-500 font-medium">
                                Verify and authorize
                                document
                                submissions.
                            </p>
                        </div>
                    </div>

                    <div className="relative group w-full md:w-80">
                        <Search
                            className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors"
                            size={18}
                        />

                        <input
                            value={search}
                            onChange={(e) =>
                                setSearch(
                                    e.target.value
                                )
                            }
                            placeholder="Search by title/user..."
                            className="w-full pl-14 pr-6 py-4 bg-slate-50 border border-slate-100 rounded-[1.25rem] text-sm font-bold focus:ring-4 focus:ring-blue-500/10 focus:bg-white outline-none transition-all shadow-inner"
                        />
                    </div>
                </div>

                <div className="bg-white rounded-[3rem] border border-slate-200/60 shadow-sm overflow-hidden">
                    {loading ? (
                        <div className="py-40 flex flex-col items-center justify-center space-y-4">
                            <Loader2
                                className="animate-spin text-blue-600"
                                size={40}
                            />

                            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 animate-pulse">
                                Scanning
                                Submissions...
                            </p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="bg-slate-50/50 text-slate-400 uppercase tracking-widest text-[10px] font-black border-b border-slate-100">
                                    <tr>
                                        <th className="px-10 py-6">
                                            Resource
                                            Name
                                        </th>

                                        <th className="px-10 py-6">
                                            Contributor
                                        </th>

                                        <th className="px-10 py-6">
                                            Deployment
                                            Area
                                        </th>

                                        <th className="px-10 py-6">
                                            Auth
                                            Status
                                        </th>

                                        <th className="px-10 py-6 text-center">
                                            File
                                        </th>

                                        <th className="px-10 py-6 text-center">
                                            Action
                                        </th>
                                    </tr>
                                </thead>

                                <tbody className="divide-y divide-slate-50">
                                    <AnimatePresence mode="popLayout">
                                        {filtered.map(
                                            (
                                                doc
                                            ) => (
                                                <motion.tr
                                                    layout
                                                    key={
                                                        doc.id
                                                    }
                                                    className="hover:bg-slate-50/30 transition-colors group"
                                                >
                                                    <td className="px-10 py-6">
                                                        <div className="flex items-center gap-4">
                                                            <div className="p-3 bg-blue-50 text-blue-600 rounded-xl group-hover:bg-blue-600 group-hover:text-white transition-all shadow-sm">
                                                                <FileText
                                                                    size={
                                                                        18
                                                                    }
                                                                />
                                                            </div>

                                                            <span className="font-black text-slate-800 tracking-tight uppercase italic">
                                                                {doc.title ||
                                                                    "Unknown File"}
                                                            </span>
                                                        </div>
                                                    </td>

                                                    <td className="px-10 py-6 text-slate-500 font-bold text-xs uppercase tracking-tighter italic">
                                                        <div className="flex items-center gap-2">
                                                            <User
                                                                size={
                                                                    14
                                                                }
                                                                className="text-slate-300"
                                                            />

                                                            {doc
                                                                .user
                                                                ?.fullname ||
                                                                doc
                                                                    .user
                                                                    ?.fullName}
                                                        </div>
                                                    </td>

                                                    <td className="px-10 py-6 text-slate-500 font-bold text-xs uppercase tracking-tighter italic">
                                                        <div className="flex items-center gap-2">
                                                            <Archive
                                                                size={
                                                                    14
                                                                }
                                                                className="text-slate-300"
                                                            />

                                                            {doc
                                                                .box
                                                                ?.name_box ||
                                                                "Unsorted"}
                                                        </div>
                                                    </td>

                                                    <td className="px-10 py-6">
                                                        <span
                                                            className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase border tracking-[0.1em] ${doc.status ===
                                                                    "approved"
                                                                    ? "bg-emerald-50 text-emerald-600 border-emerald-100"
                                                                    : doc.status ===
                                                                        "rejected"
                                                                        ? "bg-rose-50 text-rose-600 border-rose-100"
                                                                        : "bg-amber-50 text-amber-600 border-amber-100"
                                                                }`}
                                                        >
                                                            {doc.status ||
                                                                "pending"}
                                                        </span>
                                                    </td>

                                                    <td className="px-10 py-6">
                                                        <div className="flex justify-center gap-3">
                                                            <button
                                                                onClick={() =>
                                                                    openPreview(
                                                                        doc
                                                                    )
                                                                }
                                                                className="h-11 w-11 flex items-center justify-center rounded-xl bg-slate-900 text-white hover:bg-blue-600 transition-all shadow-sm active:scale-90"
                                                            >
                                                                <Eye
                                                                    size={
                                                                        16
                                                                    }
                                                                />
                                                            </button>

                                                            <button
                                                                onClick={() =>
                                                                    downloadFile(
                                                                        doc.fileUrl,
                                                                        doc.title
                                                                    )
                                                                }
                                                                className="h-11 w-11 flex items-center justify-center rounded-xl bg-blue-600 text-white hover:bg-blue-700 transition-all shadow-sm active:scale-90"
                                                            >
                                                                <Download
                                                                    size={
                                                                        16
                                                                    }
                                                                />
                                                            </button>
                                                        </div>
                                                    </td>

                                                    <td className="px-10 py-6">
                                                        <div className="flex justify-center items-center gap-3">
                                                            <ActionButton
                                                                icon={
                                                                    <Check
                                                                        size={
                                                                            18
                                                                        }
                                                                    />
                                                                }
                                                                onClick={() =>
                                                                    updateStatus(
                                                                        doc.id,
                                                                        "approve"
                                                                    )
                                                                }
                                                                variant="approve"
                                                                loading={
                                                                    actionLoading ===
                                                                    doc.id
                                                                }
                                                                disabled={
                                                                    doc.status ===
                                                                    "approved"
                                                                }
                                                            />

                                                            <ActionButton
                                                                icon={
                                                                    <X
                                                                        size={
                                                                            18
                                                                        }
                                                                    />
                                                                }
                                                                onClick={() =>
                                                                    updateStatus(
                                                                        doc.id,
                                                                        "reject"
                                                                    )
                                                                }
                                                                variant="reject"
                                                                loading={
                                                                    actionLoading ===
                                                                    doc.id
                                                                }
                                                                disabled={
                                                                    doc.status ===
                                                                    "rejected"
                                                                }
                                                            />
                                                        </div>
                                                    </td>
                                                </motion.tr>
                                            )
                                        )}
                                    </AnimatePresence>
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>

            {/* PREVIEW MODAL */}
            <AnimatePresence>
                {previewOpen &&
                    previewFile && (
                        <motion.div
                            initial={{
                                opacity: 0,
                            }}
                            animate={{
                                opacity: 1,
                            }}
                            exit={{
                                opacity: 0,
                            }}
                            className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4"
                        >
                            <motion.div
                                initial={{
                                    scale: 0.9,
                                    opacity: 0,
                                }}
                                animate={{
                                    scale: 1,
                                    opacity: 1,
                                }}
                                exit={{
                                    scale: 0.9,
                                    opacity: 0,
                                }}
                                className="w-full max-w-6xl h-[90vh] bg-white rounded-[2rem] overflow-hidden shadow-2xl flex flex-col"
                            >
                                <div className="flex items-center justify-between px-6 py-5 border-b">
                                    <div>
                                        <h2 className="font-black text-xl">
                                            {
                                                previewFile.title
                                            }
                                        </h2>

                                        <p className="text-sm text-slate-400">
                                            Document
                                            Preview
                                        </p>
                                    </div>

                                    <button
                                        onClick={() =>
                                            setPreviewOpen(
                                                false
                                            )
                                        }
                                        className="w-11 h-11 rounded-xl bg-slate-100 hover:bg-red-500 hover:text-white transition-all flex items-center justify-center"
                                    >
                                        <X
                                            size={20}
                                        />
                                    </button>
                                </div>

                                <div className="flex-1 bg-slate-100">
                                    <iframe
                                        src={
                                            previewFile.fileUrl
                                        }
                                        className="w-full h-full"
                                    />
                                </div>
                            </motion.div>
                        </motion.div>
                    )}
            </AnimatePresence>
        </>
    );
}

function ActionButton({
    icon,
    onClick,
    variant,
    loading,
    disabled,
}: any) {
    const theme =
        variant === "approve"
            ? "bg-slate-900 text-white hover:bg-emerald-600 shadow-slate-200"
            : "bg-white border border-slate-100 text-slate-400 hover:text-rose-600 hover:border-rose-100";

    return (
        <button
            disabled={loading || disabled}
            onClick={onClick}
            className={`h-11 w-11 flex items-center justify-center rounded-xl transition-all shadow-sm active:scale-90 disabled:opacity-20 ${theme}`}
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