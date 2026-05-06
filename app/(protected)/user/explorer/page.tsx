"use client";
import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Search,
  Filter,
  Grid,
  List,
  MoreVertical,
  Download,
  Eye,
  FileText
} from 'lucide-react';

const documents = [
    { id: 1, title: 'Invoices_March_Batch.zip', status: 'approved', date: 'May 04, 2026', size: '12.4 MB' },
    { id: 2, title: 'Legal_Contract_Client_X.pdf', status: 'pending', date: 'May 02, 2026', size: '2.1 MB' },
    { id: 3, title: 'Employee_Payroll_Data.xlsx', status: 'rejected', date: 'April 28, 2026', size: '840 KB' },
];

export default function ExplorerPage() {
    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <h2 className="text-2xl font-black text-slate-900 tracking-tight">Archive Explorer</h2>
                <div className="flex gap-3">
                    <div className="flex bg-white border border-slate-100 p-1 rounded-2xl shadow-sm">
                        <button className="p-2 bg-slate-50 text-blue-600 rounded-xl"><List size={18} /></button>
                        <button className="p-2 text-slate-400 hover:text-slate-600 transition-colors"><Grid size={18} /></button>
                    </div>
                </div>
            </div>

            <div className="bg-white border border-slate-100 rounded-[2rem] overflow-hidden shadow-sm shadow-slate-100/50">
                <div className="p-6 border-b border-slate-50 flex flex-wrap gap-4 items-center justify-between">
                    <div className="relative flex-1 min-w-[300px]">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <input type="text" placeholder="Filter by name, date, or status..." className="w-full bg-slate-50 border-none rounded-xl py-3 pl-12 pr-4 text-sm font-medium outline-none" />
                    </div>
                    <button className="flex items-center gap-2 px-5 py-3 bg-slate-900 text-white rounded-xl text-xs font-bold uppercase tracking-widest">
                        <Filter size={16} /> Filter
                    </button>
                </div>

                <div className="overflow-x-auto">
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
                                    whileHover={{ backgroundColor: '#F8FAFC' }}
                                    key={doc.id} className="group transition-colors"
                                >
                                    <td className="px-8 py-5">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600 font-bold border border-blue-100 group-hover:scale-110 transition-transform">
                                                <FileText size={18} />
                                            </div>
                                            <div>
                                                <p className="font-bold text-slate-800 text-sm">{doc.title}</p>
                                                <p className="text-[10px] font-bold text-slate-400 uppercase">{doc.size}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-5">
                                        <span className="text-xs font-bold text-slate-500 uppercase tracking-tighter">{doc.date}</span>
                                    </td>
                                    <td className="px-6 py-5">
                                        <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${doc.status === 'approved' ? 'bg-emerald-50 text-emerald-600' :
                                                doc.status === 'pending' ? 'bg-amber-50 text-amber-500' : 'bg-rose-50 text-rose-500'
                                            }`}>
                                            {doc.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-5 text-right">
                                        <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button className="p-2 hover:bg-blue-50 text-blue-600 rounded-lg transition-colors"><Eye size={16} /></button>
                                            <button className="p-2 hover:bg-slate-200 text-slate-600 rounded-lg transition-colors"><Download size={16} /></button>
                                        </div>
                                    </td>
                                </motion.tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}