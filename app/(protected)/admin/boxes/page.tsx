"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Archive,
    Plus,
    Search,
    Calendar,
    Loader2,
    Trash2,
    Edit3,
    X,
    Layers,
    Hash,
} from "lucide-react";

import { api } from "@/lib/api";

export default function BoxesPage() {
    const [boxes, setBoxes] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const [searchTerm, setSearchTerm] =
        useState("");

    const [isModalOpen, setIsModalOpen] =
        useState(false);

    const [rackId, setRackId] =
        useState<string>("");

    const [formData, setFormData] =
        useState({
            name_box: "",
            description: "",
            rackId: "",
        });

    // =========================
    // FETCH DATA
    // =========================
    async function fetchData() {
        try {
            setLoading(true);

            // GET MY RACK
            const rackRes =
                await api.get("/rack/my");

            const racks =
                rackRes.data?.data ||
                rackRes.data ||
                [];

            // ARRAY RACK ID
            const rackIds = Array.isArray(racks)
                ? racks.map((r: any) => r.id)
                : [];

            // DEFAULT FIRST RACK
            if (rackIds.length > 0) {
                setRackId(rackIds[0]);

                setFormData((prev) => ({
                    ...prev,
                    rackId: rackIds[0],
                }));
            }

            // GET BOXES
            const boxRes =
                await api.get("/boxes");

            const allBoxes =
                boxRes.data?.data ||
                boxRes.data ||
                [];

            // FILTER BOX BY MY RACK
            const filtered =
                allBoxes.filter((b: any) =>
                    rackIds.includes(b.rackId)
                );

            setBoxes(filtered);
        } catch (err) {
            console.error(
                "FETCH ERROR:",
                err
            );
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchData();
    }, []);

    // =========================
    // CREATE BOX
    // =========================
    async function handleCreate(
        e: React.FormEvent
    ) {
        e.preventDefault();

        try {
            if (
                formData.name_box.length < 3
            ) {
                return alert(
                    "Nama minimal 3 karakter"
                );
            }

            await api.post(
                "/boxes",
                formData
            );

            setIsModalOpen(false);

            setFormData({
                name_box: "",
                description: "",
                rackId,
            });

            fetchData();
        } catch (err: any) {
            console.error(err);

            alert(
                err?.response?.data
                    ?.message ||
                "Gagal membuat boks"
            );
        }
    }

    // =========================
    // DELETE BOX
    // =========================
    async function handleDelete(
        id: string
    ) {
        const ok = confirm(
            "Hapus boks ini?"
        );

        if (!ok) return;

        try {
            await api.delete(
                `/boxes/${id}`
            );

            setBoxes((prev) =>
                prev.filter(
                    (b) => b.id !== id
                )
            );
        } catch (err: any) {
            alert(
                err?.response?.data
                    ?.message ||
                "Gagal hapus"
            );
        }
    }

    // =========================
    // FILTER SEARCH
    // =========================
    const filteredBoxes =
        boxes.filter((b) => {
            const keyword =
                searchTerm.toLowerCase();

            return (
                b.name_box
                    ?.toLowerCase()
                    .includes(keyword) ||
                b.code
                    ?.toLowerCase()
                    .includes(keyword)
            );
        });

    return (
        <div className="space-y-10">
            {/* HEADER */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="space-y-1">
                    <h1 className="text-4xl font-black text-slate-900 tracking-tighter italic">
                        UNIT INVENTORY
                    </h1>

                    <p className="text-slate-500 font-medium flex items-center gap-2">
                        <Layers size={16} />

                        My Rack Storage
                    </p>
                </div>

                <button
                    onClick={() =>
                        setIsModalOpen(true)
                    }
                    className="flex items-center justify-center gap-3 bg-slate-900 text-white px-10 py-5 rounded-[2rem] font-black text-xs uppercase tracking-widest shadow-2xl shadow-slate-200 hover:bg-blue-600 hover:shadow-blue-200 transition-all active:scale-95"
                >
                    <Plus size={18} />
                    Provision New Box
                </button>
            </div>

            {/* SEARCH */}
            <div className="relative group max-w-md">
                <Search
                    className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400"
                    size={20}
                />

                <input
                    type="text"
                    placeholder="Search by name or serial..."
                    value={searchTerm}
                    onChange={(e) =>
                        setSearchTerm(
                            e.target.value
                        )
                    }
                    className="w-full pl-14 pr-6 py-4 bg-white border border-slate-200 rounded-[1.5rem] text-sm font-bold focus:ring-4 focus:ring-blue-50 focus:border-blue-200 outline-none transition-all shadow-sm"
                />
            </div>

            {/* TABLE */}
            <div className="bg-white rounded-[3rem] border border-slate-200/60 shadow-[0_20px_50px_rgba(0,0,0,0.02)] overflow-hidden">
                {loading ? (
                    <div className="py-40 flex flex-col items-center justify-center space-y-4">
                        <Loader2
                            className="animate-spin text-blue-600"
                            size={40}
                        />

                        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 animate-pulse">
                            Syncing Inventory Assets...
                        </p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-slate-50/50 text-slate-400 uppercase tracking-[0.2em] text-[10px] font-black border-b border-slate-100">
                                <tr>
                                    <th className="px-10 py-6">
                                        Serials
                                    </th>

                                    <th className="px-10 py-6">
                                        Container Details
                                    </th>

                                    <th className="px-10 py-6">
                                        Deployment Date
                                    </th>

                                    <th className="px-10 py-6 text-right">
                                        Settings
                                    </th>
                                </tr>
                            </thead>

                            <tbody className="divide-y divide-slate-50">
                                <AnimatePresence>
                                    {filteredBoxes.map(
                                        (box) => (
                                            <motion.tr
                                                layout
                                                initial={{
                                                    opacity: 0,
                                                }}
                                                animate={{
                                                    opacity: 1,
                                                }}
                                                key={box.id}
                                                className="hover:bg-slate-50/30 transition-colors group"
                                            >
                                                <td className="px-10 py-7">
                                                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-xl font-black text-xs tracking-tighter">
                                                        <Hash size={12} />

                                                        {box.code}
                                                    </div>
                                                </td>

                                                <td className="px-10 py-7">
                                                    <p className="text-slate-900 font-black uppercase text-base tracking-tight">
                                                        {
                                                            box.name_box
                                                        }
                                                    </p>

                                                    <p className="text-xs text-slate-400 font-medium line-clamp-1 mt-1 max-w-xs">
                                                        {
                                                            box.description
                                                        }
                                                    </p>
                                                </td>

                                                <td className="px-10 py-7">
                                                    <div className="flex items-center gap-2 text-slate-400 font-bold text-xs uppercase italic tracking-widest">
                                                        <Calendar
                                                            size={14}
                                                        />

                                                        {new Date(
                                                            box.createdAt
                                                        ).toLocaleDateString()}
                                                    </div>
                                                </td>

                                                <td className="px-10 py-7 text-right">
                                                    <div className="flex justify-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                                                        <button className="p-3 bg-white border border-slate-100 rounded-xl text-slate-400 hover:text-blue-600 hover:border-blue-100 shadow-sm">
                                                            <Edit3
                                                                size={16}
                                                            />
                                                        </button>

                                                        <button
                                                            onClick={() =>
                                                                handleDelete(
                                                                    box.id
                                                                )
                                                            }
                                                            className="p-3 bg-white border border-slate-100 rounded-xl text-slate-400 hover:text-rose-600 hover:border-rose-100 shadow-sm"
                                                        >
                                                            <Trash2
                                                                size={16}
                                                            />
                                                        </button>
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

            {/* MODAL */}
            <AnimatePresence>
                {isModalOpen && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-md">
                        <motion.div
                            initial={{
                                scale: 0.9,
                                opacity: 0,
                            }}
                            animate={{
                                scale: 1,
                                opacity: 1,
                            }}
                            className="bg-white w-full max-w-lg rounded-[3rem] p-12 shadow-2xl relative"
                        >
                            <button
                                onClick={() =>
                                    setIsModalOpen(
                                        false
                                    )
                                }
                                className="absolute top-10 right-10 text-slate-400 hover:bg-slate-50 p-2 rounded-full transition-all"
                            >
                                <X />
                            </button>

                            <h2 className="text-3xl font-black text-slate-900 mb-2 italic tracking-tighter uppercase">
                                New Box Unit
                            </h2>

                            <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.2em] mb-10">
                                Hardware provisioning
                            </p>

                            <form
                                onSubmit={
                                    handleCreate
                                }
                                className="space-y-8"
                            >
                                <div className="space-y-3">
                                    <label className="text-[10px] uppercase text-slate-500 font-black tracking-widest ml-4">
                                        Identifier Name
                                    </label>

                                    <input
                                        value={
                                            formData.name_box
                                        }
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                name_box:
                                                    e.target
                                                        .value,
                                            })
                                        }
                                        className="w-full px-8 py-5 bg-slate-50 rounded-[2rem] text-sm font-bold border-2 border-transparent focus:border-blue-500/20 focus:bg-white outline-none transition-all"
                                        placeholder="e.g. Finance-2026-A"
                                    />
                                </div>

                                <div className="space-y-3">
                                    <label className="text-[10px] uppercase text-slate-500 font-black tracking-widest ml-4">
                                        Content Specification
                                    </label>

                                    <textarea
                                        value={
                                            formData.description
                                        }
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                description:
                                                    e.target
                                                        .value,
                                            })
                                        }
                                        className="w-full px-8 py-5 bg-slate-50 rounded-[2rem] text-sm font-bold border-2 border-transparent focus:border-blue-500/20 focus:bg-white outline-none transition-all h-40 resize-none"
                                        placeholder="Describe the physical documents inside..."
                                    />
                                </div>

                                <button className="w-full py-6 bg-slate-900 text-white rounded-[2rem] font-black text-xs uppercase tracking-[0.3em] shadow-2xl shadow-slate-200 hover:bg-blue-600 transition-all">
                                    Authorize Registration
                                </button>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}