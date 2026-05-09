"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Archive, Plus, Search, Calendar, Loader2, Trash2, Edit3, X, Hash, Info } from "lucide-react";
import { api } from "@/lib/api";

export default function BoxesPage() {
    const [boxes, setBoxes] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [rackId, setRackId] = useState<string>("");
    const [formData, setFormData] = useState({ name_box: "", description: "", rackId: "" as string });

    useEffect(() => { fetchData(); }, []);

    async function fetchData() {
        try {
            setLoading(true);
            const rackRes = await api.get("/rack/my");
            const racks = rackRes.data?.data || rackRes.data || [];
            if (racks.length > 0) {
                const firstId = racks[0].id ?? "";
                setRackId(firstId);
                setFormData(p => ({ ...p, rackId: firstId }));
            }
            const boxRes = await api.get("/boxes");
            const allBoxes = boxRes.data?.data || boxRes.data || [];
            const rackIds = racks.map((r: any) => r.id);
            setBoxes(allBoxes.filter((b: any) => rackIds.includes(b.rackId)));
        } finally { setLoading(false); }
    }

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await api.post("/boxes", formData);
            setIsModalOpen(false);
            setFormData({ name_box: "", description: "", rackId: rackId ?? "" });
            fetchData();
        } catch (err: any) { alert(err?.response?.data?.message || "Gagal membuat boks"); }
    };

    // Filter boxes berdasarkan nama, deskripsi, atau kode
    const filteredBoxes = boxes.filter((box) =>
        [box.name_box ?? "", box.description ?? "", box.code ?? ""]
            .some((v) => v.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    return (
        <div className="space-y-10">
            <header className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
                <div>
                    <h1 className="text-5xl font-black text-slate-900 tracking-tighter uppercase italic">Unit Inventory</h1>
                    <p className="text-cyan-600 font-bold text-sm tracking-widest mt-2 uppercase flex items-center gap-2"><Info size={16} /> My Storage Management</p>
                </div>
                <button onClick={() => setIsModalOpen(true)} className="flex items-center gap-3 bg-cyan-500 text-white px-10 py-5 rounded-3xl font-black text-xs uppercase tracking-widest shadow-xl shadow-cyan-200 hover:bg-cyan-600 transition-all active:scale-95">
                    <Plus size={18} /> Provision New Box
                </button>
            </header>

            <div className="bg-white rounded-[3rem] border border-slate-100 shadow-sm overflow-hidden">
                <div className="p-8 border-b border-slate-50 flex items-center justify-between gap-4 bg-slate-50/30">
                    <div className="relative group max-w-md w-full">
                        <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-cyan-500 transition-colors" size={20} />
                        <input
                            className="w-full pl-14 pr-10 py-4 bg-white border border-slate-200 rounded-2xl text-sm font-bold focus:ring-4 focus:ring-cyan-500/10 outline-none transition-all shadow-sm"
                            placeholder="Search by name, code, or description..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        {searchTerm && (
                            <button
                                onClick={() => setSearchTerm("")}
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 hover:text-slate-500 transition-colors"
                            >
                                <X size={15} />
                            </button>
                        )}
                    </div>
                    {searchTerm && (
                        <p className="text-xs font-bold text-slate-400 whitespace-nowrap">
                            {filteredBoxes.length} / {boxes.length} results
                        </p>
                    )}
                </div>

                <div className="overflow-x-auto">
                    {loading ? (
                        <div className="py-40 flex flex-col items-center justify-center gap-4">
                            <Loader2 className="animate-spin text-cyan-500" size={60} />
                            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Syncing Assets...</p>
                        </div>
                    ) : (
                        <table className="w-full text-left">
                            <thead className="bg-slate-50/50 text-slate-400 uppercase tracking-widest text-[10px] font-black border-b border-slate-100">
                                <tr>
                                    <th className="px-10 py-6">ID Serial</th>
                                    <th className="px-10 py-6">Details</th>
                                    <th className="px-10 py-6">Date</th>
                                    <th className="px-10 py-6 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {filteredBoxes.length > 0 ? (
                                    filteredBoxes.map((box) => (
                                        <tr key={box.id} className="hover:bg-cyan-50/30 transition-colors group">
                                            <td className="px-10 py-7">
                                                <span className="px-4 py-2 bg-slate-900 text-white rounded-xl font-black text-[10px]">
                                                    <Hash size={12} className="inline mr-1" />{box.code ?? "-"}
                                                </span>
                                            </td>
                                            <td className="px-10 py-7">
                                                <p className="font-black text-slate-900 text-lg">{box.name_box ?? "-"}</p>
                                                <p className="text-xs text-slate-400 font-medium line-clamp-1">{box.description ?? ""}</p>
                                            </td>
                                            <td className="px-10 py-7 text-xs font-bold text-slate-400">
                                                <Calendar size={14} className="inline mr-2" />
                                                {box.createdAt ? new Date(box.createdAt).toLocaleDateString() : "-"}
                                            </td>
                                            <td className="px-10 py-7 text-right">
                                                <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <button className="p-3 bg-white border border-slate-100 rounded-xl text-slate-400 hover:text-cyan-600 hover:border-cyan-100 shadow-sm transition-all"><Edit3 size={16} /></button>
                                                    <button className="p-3 bg-white border border-slate-100 rounded-xl text-slate-400 hover:text-rose-600 hover:border-rose-100 shadow-sm transition-all"><Trash2 size={16} /></button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={4} className="py-32 text-center">
                                            <Search size={28} className="mx-auto mb-3 text-slate-200" />
                                            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">
                                                No resources match &quot;{searchTerm}&quot;
                                            </p>
                                            <button
                                                onClick={() => setSearchTerm("")}
                                                className="mt-4 text-[10px] text-cyan-600 font-black uppercase tracking-widest hover:underline"
                                            >
                                                Clear search
                                            </button>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>

            <AnimatePresence>
                {isModalOpen && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-md">
                        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-white w-full max-w-lg rounded-[3rem] p-12 shadow-2xl relative">
                            <button onClick={() => setIsModalOpen(false)} className="absolute top-10 right-10 text-slate-400 hover:text-cyan-500 transition-all"><X /></button>
                            <h2 className="text-3xl font-black text-slate-900 uppercase italic mb-2 tracking-tighter">New Box Unit</h2>
                            <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mb-10">Hardware provisioning</p>
                            <form onSubmit={handleCreate} className="space-y-8">
                                <div className="space-y-3">
                                    <label className="text-[10px] uppercase text-slate-500 font-black tracking-widest ml-4">Identifier Name</label>
                                    <input value={formData.name_box ?? ""} onChange={(e) => setFormData({ ...formData, name_box: e.target.value })} className="w-full px-8 py-5 bg-slate-50 rounded-[2rem] text-sm font-bold border-2 border-transparent focus:border-cyan-500/20 focus:bg-white outline-none transition-all" placeholder="e.g. Finance-2026-A" />
                                </div>
                                <div className="space-y-3">
                                    <label className="text-[10px] uppercase text-slate-500 font-black tracking-widest ml-4">Specification</label>
                                    <textarea value={formData.description ?? ""} onChange={(e) => setFormData({ ...formData, description: e.target.value })} className="w-full px-8 py-5 bg-slate-50 rounded-[2rem] text-sm font-bold border-2 border-transparent focus:border-cyan-500/20 focus:bg-white outline-none transition-all h-32 resize-none" placeholder="Describe the physical documents..." />
                                </div>
                                <button className="w-full py-6 bg-slate-900 text-white rounded-[2rem] font-black text-xs uppercase tracking-[0.3em] shadow-xl hover:bg-cyan-600 transition-all">Authorize Registration</button>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
