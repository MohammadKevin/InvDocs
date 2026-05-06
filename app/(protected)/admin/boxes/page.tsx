"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Archive,
    Plus,
    Search,
    MoreHorizontal,
    Calendar,
    Loader2,
    Trash2,
    Edit3,
    X
} from "lucide-react";
import { api } from "@/lib/api";

interface Box {
    id: string;
    name: string;
    code: string;
    description: string;
    createdAt: string;
}

export default function BoxesPage() {
    const [boxes, setBoxes] = useState<Box[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);

    // State untuk Form Tambah Boks
    const [formData, setFormData] = useState({ name: "", description: "" });

    // 1. FETCH DATA (Admin Rack hanya melihat boks miliknya)
    const fetchBoxes = async () => {
        try {
            setLoading(true);
            const res = await api.get("/boxes");
            setBoxes(res.data);
        } catch (err) {
            console.error("Gagal sinkronisasi data boks:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBoxes();
    }, []);

    // 2. CREATE BOX
    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await api.post("/boxes", formData);
            setIsModalOpen(false);
            setFormData({ name: "", description: "" });
            fetchBoxes(); // Refresh list
        } catch (err) {
            alert("Gagal membuat boks baru");
        }
    };

    // 3. DELETE BOX
    const handleDelete = async (id: string) => {
        if (!confirm("Hapus boks ini?")) return;
        try {
            await api.delete(`/boxes/${id}`);
            setBoxes(prev => prev.filter(b => b.id !== id));
        } catch (err) {
            alert("Gagal menghapus boks");
        }
    };

    const filteredBoxes = boxes.filter(b =>
        b.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        b.code.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tighter uppercase italic">Box Inventory</h1>
                    <p className="text-slate-500 font-medium mt-1">Manage physical containers in your assigned rack.</p>
                </div>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="flex items-center gap-2 bg-blue-600 text-white px-8 py-4 rounded-[22px] font-bold text-sm shadow-xl shadow-blue-200 hover:bg-blue-700 transition-all active:scale-95"
                >
                    <Plus size={18} /> Create New Box
                </button>
            </div>

            {/* SEARCH BAR */}
            <div className="relative group max-w-md font-bold">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" size={18} />
                <input
                    type="text"
                    placeholder="Filter boxes..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-2xl text-sm focus:ring-4 focus:ring-blue-500/10 outline-none transition-all shadow-sm"
                />
            </div>

            {/* TABLE CONTENT */}
            <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden font-bold">
                {loading ? (
                    <div className="py-32 flex flex-col items-center justify-center space-y-4">
                        <Loader2 className="animate-spin text-blue-600" size={32} />
                        <p className="text-[10px] uppercase tracking-[0.3em] text-slate-400">Syncing with Railway...</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto text-sm">
                        <table className="w-full text-left">
                            <thead className="bg-slate-50/50 text-slate-400 uppercase tracking-widest text-[10px] font-black border-b border-slate-100">
                                <tr>
                                    <th className="px-8 py-6 italic">Identity Code</th>
                                    <th className="px-8 py-6 italic">Box Name</th>
                                    <th className="px-8 py-6 italic">Created Date</th>
                                    <th className="px-8 py-6 text-right">Settings</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 italic">
                                {filteredBoxes.map((box) => (
                                    <tr key={box.id} className="hover:bg-slate-50/50 transition-colors group">
                                        <td className="px-8 py-5">
                                            <span className="text-blue-600 bg-blue-50 px-3 py-1.5 rounded-xl font-black text-xs uppercase tracking-tighter not-italic">{box.code}</span>
                                        </td>
                                        <td className="px-8 py-5">
                                            <p className="text-slate-900 not-italic font-black uppercase tracking-tight">{box.name}</p>
                                            <p className="text-[10px] text-slate-400 font-bold tracking-tight mt-1">{box.description || "No description"}</p>
                                        </td>
                                        <td className="px-8 py-5 text-slate-400 font-medium">
                                            {new Date(box.createdAt).toLocaleDateString('id-ID')}
                                        </td>
                                        <td className="px-8 py-5 text-right">
                                            <div className="flex justify-end gap-2">
                                                <button className="p-2 text-slate-300 hover:text-blue-600 transition-colors"><Edit3 size={18} /></button>
                                                <button onClick={() => handleDelete(box.id)} className="p-2 text-slate-300 hover:text-red-500 transition-colors"><Trash2 size={18} /></button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* CREATE MODAL */}
            <AnimatePresence>
                {isModalOpen && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-900/40 backdrop-blur-sm">
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="bg-white w-full max-w-md rounded-[2.5rem] p-10 shadow-2xl relative"
                        >
                            <button onClick={() => setIsModalOpen(false)} className="absolute top-8 right-8 text-slate-400"><X /></button>
                            <h2 className="text-2xl font-black text-slate-900 mb-8 uppercase italic tracking-tighter">Initialize New Box</h2>
                            <form onSubmit={handleCreate} className="space-y-6 font-bold">
                                <div className="space-y-2">
                                    <label className="text-[10px] uppercase text-slate-400 tracking-widest ml-2">Box Name</label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        placeholder="e.g. Finance 2026"
                                        className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm focus:ring-4 focus:ring-blue-500/10 outline-none transition-all italic"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] uppercase text-slate-400 tracking-widest ml-2">Description</label>
                                    <textarea
                                        value={formData.description}
                                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                        placeholder="Brief details..."
                                        className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm focus:ring-4 focus:ring-blue-500/10 outline-none transition-all italic h-32"
                                    />
                                </div>
                                <button className="w-full py-5 bg-slate-900 text-white rounded-[22px] font-black text-xs uppercase tracking-widest shadow-xl shadow-slate-200">
                                    Register Box
                                </button>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}