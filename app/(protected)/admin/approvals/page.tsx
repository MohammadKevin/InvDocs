"use client";

import { motion } from "framer-motion";
import { Check, X, Download, Search, Filter, FileText } from "lucide-react";

const documents = [
    { id: 1, title: "Monthly_Report.pdf", user: "Kevin Mohammad", box: "BOX-Alpha", date: "2026-05-01", status: "pending" },
    { id: 2, title: "Contract_V2.docx", user: "Siska Putri", box: "BOX-Beta", date: "2026-04-28", status: "approved" },
    { id: 3, title: "Identity_Scan.jpg", user: "Andri Wijaya", box: "BOX-Alpha", date: "2026-04-25", status: "rejected" },
];

export default function ApprovalsPage() {
    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tighter uppercase italic">Document Approvals</h1>
                    <p className="text-slate-500 font-medium">Review and verify incoming documents for your rack.</p>
                </div>

                <div className="flex gap-3">
                    <div className="relative group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" size={18} />
                        <input
                            type="text"
                            placeholder="Search documents..."
                            className="pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-[20px] text-sm font-bold shadow-sm focus:ring-4 focus:ring-blue-500/10 outline-none w-64 transition-all"
                        />
                    </div>
                    <button className="p-3 bg-white border border-slate-200 rounded-[18px] text-slate-600 hover:bg-slate-50 transition-all">
                        <Filter size={20} />
                    </button>
                </div>
            </div>

            <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden">
                <div className="overflow-x-auto text-sm font-bold">
                    <table className="w-full text-left">
                        <thead className="bg-slate-50/50 text-slate-400 uppercase tracking-widest text-[10px] border-b border-slate-100 font-black">
                            <tr>
                                <th className="px-8 py-6">Document Title</th>
                                <th className="px-8 py-6">Uploader</th>
                                <th className="px-8 py-6">Storage</th>
                                <th className="px-8 py-6">Status</th>
                                <th className="px-8 py-6 text-center">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 italic">
                            {documents.map((doc) => (
                                <tr key={doc.id} className="hover:bg-slate-50/50 transition-colors">
                                    <td className="px-8 py-5">
                                        <div className="flex items-center gap-3">
                                            <FileText size={18} className="text-slate-300" />
                                            <span className="text-slate-800 not-italic">{doc.title}</span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-5 text-slate-500 font-medium">{doc.user}</td>
                                    <td className="px-8 py-5">
                                        <span className="bg-blue-50 text-blue-600 px-2 py-1 rounded-md text-[10px] uppercase font-black">{doc.box}</span>
                                    </td>
                                    <td className="px-8 py-5">
                                        <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] uppercase font-black tracking-wider ${doc.status === 'approved' ? 'bg-emerald-50 text-emerald-600' :
                                                doc.status === 'pending' ? 'bg-amber-50 text-amber-600' : 'bg-red-50 text-red-600'
                                            }`}>
                                            {doc.status}
                                        </div>
                                    </td>
                                    <td className="px-8 py-5">
                                        <div className="flex justify-center gap-2">
                                            <button className="p-2.5 bg-slate-900 text-white rounded-xl hover:bg-slate-800 transition-all shadow-md active:scale-95"><Check size={16} /></button>
                                            <button className="p-2.5 bg-white border border-slate-200 text-red-500 rounded-xl hover:bg-red-50 transition-all active:scale-95"><X size={16} /></button>
                                            <button className="p-2.5 bg-slate-100 text-slate-600 rounded-xl hover:bg-slate-200 transition-all active:scale-95"><Download size={16} /></button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}