"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

import {
    Search,
    Filter,
    Grid,
    List,
    Download,
    Eye,
    FileText,
    Loader2,
} from "lucide-react";

import { api } from "@/lib/api";

interface DocumentType {
    fileUrl: any;
    id: string;
    title: string;
    status: string;
    createdAt: string;
    fileSize: number;
}

export default function ExplorerPage() {
    const [documents, setDocuments] = useState<DocumentType[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // eslint-disable-next-line react-hooks/immutability
        fetchDocuments();
    }, []);

    const fetchDocuments = async () => {
        try {
            setLoading(true);

            const res = await api.get("/documents");

            const data = Array.isArray(res.data)
                ? res.data
                : res.data?.data || [];

            setDocuments(data);
        } catch (error) {
            console.error("Fetch documents error:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <h2 className="text-2xl font-black text-slate-900 tracking-tight">
                    Archive Explorer
                </h2>

                <div className="flex gap-3">
                    <div className="flex bg-white border border-slate-100 p-1 rounded-2xl shadow-sm">
                        <button className="p-2 bg-slate-50 text-blue-600 rounded-xl">
                            <List size={18} />
                        </button>

                        <button className="p-2 text-slate-400 hover:text-slate-600 transition-colors">
                            <Grid size={18} />
                        </button>
                    </div>
                </div>
            </div>

            <div className="bg-white border border-slate-100 rounded-[2rem] overflow-hidden shadow-sm shadow-slate-100/50">
                <div className="p-6 border-b border-slate-50 flex flex-wrap gap-4 items-center justify-between">
                    <div className="relative flex-1 min-w-[300px]">
                        <Search
                            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                            size={18}
                        />

                        <input
                            type="text"
                            placeholder="Filter by name, date, or status..."
                            className="w-full bg-slate-50 border-none rounded-xl py-3 pl-12 pr-4 text-sm font-medium outline-none"
                        />
                    </div>

                    <button className="flex items-center gap-2 px-5 py-3 bg-slate-900 text-white rounded-xl text-xs font-bold uppercase tracking-widest">
                        <Filter size={16} />
                        Filter
                    </button>
                </div>

                <div className="overflow-x-auto">
                    {loading ? (
                        <div className="flex justify-center py-20">
                            <Loader2 className="animate-spin text-blue-600" size={40} />
                        </div>
                    ) : (
                        <table className="w-full">
                            <thead className="bg-slate-50/50 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 border-b border-slate-50">
                                <tr>
                                    <th className="px-8 py-4 text-left">Document Info</th>
                                    <th className="px-6 py-4 text-left">Upload Date</th>
                                    <th className="px-6 py-4 text-left">Status</th>
                                    <th className="px-6 py-4 text-right">Actions</th>
                                </tr>
                            </thead>

                            <tbody className="divide-y divide-slate-50">
                                {documents.map((doc) => (
                                    <motion.tr
                                        whileHover={{ backgroundColor: "#F8FAFC" }}
                                        key={doc.id}
                                        className="group transition-colors"
                                    >
                                        <td className="px-8 py-5">
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600 font-bold border border-blue-100 group-hover:scale-110 transition-transform">
                                                    <FileText size={18} />
                                                </div>

                                                <div>
                                                    <p className="font-bold text-slate-800 text-sm">
                                                        {doc.title}
                                                    </p>

                                                    <p className="text-[10px] font-bold text-slate-400 uppercase">
                                                        {(doc.fileSize / 1024 / 1024).toFixed(2)} MB
                                                    </p>
                                                </div>
                                            </div>
                                        </td>

                                        <td className="px-6 py-5">
                                            <span className="text-xs font-bold text-slate-500 uppercase tracking-tighter">
                                                {new Date(doc.createdAt).toLocaleDateString()}
                                            </span>
                                        </td>

                                        <td className="px-6 py-5">
                                            <span
                                                className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${doc.status === "approved"
                                                    ? "bg-emerald-50 text-emerald-600"
                                                    : doc.status === "pending"
                                                        ? "bg-amber-50 text-amber-500"
                                                        : "bg-rose-50 text-rose-500"
                                                    }`}
                                            >
                                                {doc.status}
                                            </span>
                                        </td>

                                        <td className="px-6 py-5 text-right">
                                            <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button className="p-2 hover:bg-blue-50 text-blue-600 rounded-lg transition-colors">
                                                    <Eye size={16} />
                                                </button>

                                                {doc.status === "approved" && (
                                                    <a
                                                        href={`https://invdocs-api-production.up.railway.app${doc.fileUrl}`}
                                                        download
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="p-2 hover:bg-slate-200 text-slate-600 rounded-lg transition-colors"
                                                    >
                                                        <Download size={16} />
                                                    </a>
                                                )}
                                            </div>
                                        </td>
                                    </motion.tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
        </div>
    );
}