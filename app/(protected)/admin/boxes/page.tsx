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
    X,
    Layers
} from "lucide-react";
import { api } from "@/lib/api";

interface Box {
    id: string;
    name_box: string; // Sesuai DTO
    code: string;
    description: string;
    createdAt: string;
}

export default function BoxesPage() {
    const [boxes, setBoxes] = useState<Box[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [rackId, setRackId] = useState<string>("");

    // State untuk Form Tambah Boks sesuai CreateBoxDto
    const [formData, setFormData] = useState({
        name_box: "",
        description: "",
        rackId: ""
    });

    // 1. FETCH DATA RAK & BOKS
    const fetchData = async () => {
        try {
            setLoading(true);
            // Ambil ID rak admin terlebih dahulu untuk keperluan CreateBoxDto
            const rackRes = await api.get("/rack/my");
            const myRack = Array.isArray(rackRes.data) ? rackRes.data[0] : rackRes.data;
            
            if (myRack?.id) {
                setRackId(myRack.id);
                setFormData(prev => ({ ...prev, rackId: myRack.id }));
            }

            const boxRes = await api.get("/boxes");
            setBoxes(boxRes.data);
        } catch (err) {
            console.error("Gagal sinkronisasi data:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        fetchData();
    }, []);

    // 2. CREATE BOX
    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            // Validasi sederhana sebelum kirim
            if (formData.name_box.length < 3) return alert("Nama minimal 3 karakter");
            if (formData.description.length < 10) return alert("Deskripsi minimal 10 karakter");

            await api.post("/boxes", formData);
            
            setIsModalOpen(false);
            setFormData({ name_box: "", description: "", rackId: rackId });
            fetchData(); // Refresh list
        } catch (err: any) {
            alert(err.response?.data?.message || "Gagal membuat boks baru");
        }
    };

    // 3. DELETE BOX
    const handleDelete = async (id: string) => {
        if (!confirm("Hapus boks ini secara permanen?")) return;
        try {
            await api.delete(`/boxes/${id}`);
            setBoxes(prev => prev.filter(b => b.id !== id));
        } catch (err) {
            alert("Gagal menghapus boks");
        }
    };

    const filteredBoxes = boxes.filter(b =>
        b.name_box.toLowerCase().includes(searchTerm.toLowerCase()) ||
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
                    <div className="overflow-x-auto text-sm text-slate-900">
                        <table className="w-full text-left">
                            <thead className="bg-slate-50/50 text-slate-400 uppercase tracking-widest text-[10px] font-black border-b border-slate-100">
                                <tr>
                                    <th className="px-8 py-6 italic text-slate-400">Identity Code</th>
                                    <th className="px-8 py-6 italic text-slate-400">Box Name</th>
                                    <th className="px-8 py-6 italic text-slate-400">Created Date</th>
                                    <th className="px-8 py-6 text-right text-slate-400">Settings</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 italic">
                                {filteredBoxes.map((box) => (
                                    <tr key={box.id} className="hover:bg-slate-50/50 transition-colors group">
                                        <td className="px-8 py-5">
                                            <span className="text-blue-600 bg-blue-50 px-3 py-1.5 rounded-xl font-black text-xs uppercase tracking-tighter not-italic">{box.code}</span>
                                        </td>
                                        <td className="px-8 py-5">
                                            <p className="text-slate-900 not-italic font-black uppercase tracking-tight">{box.name_box}</p>
                                            <p className="text-[10px] text-slate-400 font-bold tracking-tight mt-1 not-italic opacity-70">{box.description}</p>
                                        </td>
                                        <td className="px-8 py-5 text-slate-400 font-medium not-italic">
                                            <div className="flex items-center gap-2">
                                                <Calendar size={14} className="text-slate-200" />
                                                {new Date(box.createdAt).toLocaleDateString('id-ID')}
                                            </div>
                                        </td>
                                        <td className="px-8 py-5 text-right not-italic">
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
                            <button onClick={() => setIsModalOpen(false)} className="absolute top-8 right-8 text-slate-400 hover:text-slate-900"><X /></button>
                            <h2 className="text-2xl font-black text-slate-900 mb-2 uppercase italic tracking-tighter">New Container</h2>
                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-8">Assigning to Rack ID: {rackId.slice(0,8)}...</p>
                            
                            <form onSubmit={handleCreate} className="space-y-6 font-bold">
                                <div className="space-y-2">
                                    <label className="text-[10px] uppercase text-slate-400 tracking-widest ml-2">Box Alias (Min 3)</label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.name_box}
                                        onChange={(e) => setFormData({ ...formData, name_box: e.target.value })}
                                        placeholder="e.g. Legal Documents 2026"
                                        className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm focus:ring-4 focus:ring-blue-500/10 outline-none transition-all italic text-slate-900"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] uppercase text-slate-400 tracking-widest ml-2">Description (Min 10)</label>
                                    <textarea
                                        required
                                        value={formData.description}
                                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                        placeholder="Detailed contents of this box..."
                                        className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm focus:ring-4 focus:ring-blue-500/10 outline-none transition-all italic h-32 text-slate-900"
                                    />
                                </div>
                                
                                <button className="w-full py-5 bg-slate-900 text-white rounded-[22px] font-black text-xs uppercase tracking-widest shadow-xl shadow-slate-200 hover:bg-slate-800 transition-all flex items-center justify-center gap-2">
                                    <Plus size={16} /> Register Box
                                </button>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}