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
    Hash,
    Info,
} from "lucide-react";

import { api } from "@/lib/api";

interface Box {
    id: string;
    kode_box: string;
    description?: string;
    rackId: string;
    createdAt?: string;
}

interface Rack {
    id: string;
}

export default function BoxesPage() {
    const [boxes, setBoxes] = useState<Box[]>([]);
    const [loading, setLoading] = useState(true);

    const [searchTerm, setSearchTerm] =
        useState("");

    const [isModalOpen, setIsModalOpen] =
        useState(false);

    const [rackId, setRackId] =
        useState("");

    const [deleteLoading, setDeleteLoading] =
        useState<string | null>(null);

    const [editingBox, setEditingBox] =
        useState<Box | null>(null);

    const [updateLoading, setUpdateLoading] =
        useState(false);

    const [formData, setFormData] =
        useState({
            kode_box: "",
            description: "",
            rackId: "",
        });

    useEffect(() => {
        fetchData();
    }, []);

    async function fetchData() {
        try {
            setLoading(true);

            const rackRes =
                await api.get("/rack/my");

            const racks: Rack[] =
                rackRes.data?.data ||
                rackRes.data ||
                [];

            if (racks.length > 0) {
                const firstId = racks[0].id;

                setRackId(firstId);

                setFormData((prev) => ({
                    ...prev,
                    rackId: firstId,
                }));
            }

            const boxRes =
                await api.get("/boxes");

            const allBoxes: Box[] =
                boxRes.data?.data ||
                boxRes.data ||
                [];

            const rackIds = racks.map(
                (r) => r.id
            );

            const filtered =
                allBoxes.filter((b) =>
                    rackIds.includes(
                        b.rackId
                    )
                );

            setBoxes(filtered);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    }

    async function handleCreate(
        e: React.FormEvent
    ) {
        e.preventDefault();

        try {
            await api.post(
                "/boxes",
                formData
            );

            setIsModalOpen(false);

            setFormData({
                kode_box: "",
                description: "",
                rackId,
            });

            fetchData();
        } catch (err: any) {
            alert(
                err?.response?.data
                    ?.message ||
                "Gagal membuat box"
            );
        }
    }

    async function handleUpdate(
        e: React.FormEvent
    ) {
        e.preventDefault();

        if (!editingBox) return;

        try {
            setUpdateLoading(true);

            await api.patch(
                `/boxes/${editingBox.id}`,
                {
                    description:
                        formData.description,
                }
            );

            setBoxes((prev) =>
                prev.map((box) =>
                    box.id === editingBox.id
                        ? {
                            ...box,
                            description:
                                formData.description,
                        }
                        : box
                )
            );

            setEditingBox(null);

            setIsModalOpen(false);

            setFormData({
                kode_box: "",
                description: "",
                rackId,
            });

            alert(
                "Deskripsi berhasil diupdate"
            );
        } catch (err: any) {
            alert(
                err?.response?.data
                    ?.message ||
                "Gagal update"
            );
        } finally {
            setUpdateLoading(false);
        }
    }

    async function handleDelete(
        id: string
    ) {
        const confirmDelete =
            confirm(
                "Yakin ingin menghapus box ini?"
            );

        if (!confirmDelete) return;

        try {
            setDeleteLoading(id);

            await api.delete(
                `/boxes/${id}`
            );

            setBoxes((prev) =>
                prev.filter(
                    (box) =>
                        box.id !== id
                )
            );

            alert(
                "Box berhasil dihapus"
            );
        } catch (err: any) {
            console.error(err);

            alert(
                err?.response?.data
                    ?.message ||
                "Gagal menghapus box"
            );
        } finally {
            setDeleteLoading(null);
        }
    }

    const filteredBoxes =
        boxes.filter((box) =>
            [
                box.kode_box || "",
                box.description || "",
            ].some((value) =>
                value
                    .toLowerCase()
                    .includes(
                        searchTerm.toLowerCase()
                    )
            )
        );

    return (
        <div className="space-y-10">
            <header className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
                <div>
                    <h1 className="text-5xl font-black text-slate-900 dark:text-white tracking-tighter uppercase italic">
                        Unit Inventory
                    </h1>

                    <p className="text-cyan-600 font-bold text-sm tracking-widest mt-2 uppercase flex items-center gap-2">
                        <Info size={16} />
                        My Storage Management
                    </p>
                </div>

                <button
                    onClick={() => {
                        setEditingBox(null);

                        setFormData({
                            kode_box: "",
                            description: "",
                            rackId,
                        });

                        setIsModalOpen(true);
                    }}
                    className="flex items-center gap-3 bg-cyan-500 text-white px-10 py-5 rounded-3xl font-black text-xs uppercase tracking-widest shadow-xl shadow-cyan-200 hover:bg-cyan-600 transition-all active:scale-95"
                >
                    <Plus size={18} />
                    Provision New Box
                </button>
            </header>

            <div className="bg-white dark:bg-slate-950 rounded-[3rem] border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden transition-colors">
                <div className="p-8 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between gap-4 bg-slate-50/40 dark:bg-slate-900/30">
                    <div className="relative group max-w-md w-full">
                        <Search
                            className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-cyan-500 transition-colors"
                            size={20}
                        />

                        <input
                            className="w-full pl-14 pr-10 py-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl text-sm font-bold outline-none focus:ring-4 focus:ring-cyan-500/10 transition-all"
                            placeholder="Search by box code or description..."
                            value={searchTerm}
                            onChange={(e) =>
                                setSearchTerm(
                                    e.target.value
                                )
                            }
                        />

                        {searchTerm && (
                            <button
                                onClick={() =>
                                    setSearchTerm("")
                                }
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 hover:text-slate-500"
                            >
                                <X size={15} />
                            </button>
                        )}
                    </div>

                    {searchTerm && (
                        <p className="text-xs font-bold text-slate-400 whitespace-nowrap">
                            {
                                filteredBoxes.length
                            }{" "}
                            / {boxes.length} results
                        </p>
                    )}
                </div>

                <div className="overflow-x-auto">
                    {loading ? (
                        <div className="py-40 flex flex-col items-center justify-center gap-4">
                            <Loader2
                                className="animate-spin text-cyan-500"
                                size={60}
                            />

                            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">
                                Syncing Assets...
                            </p>
                        </div>
                    ) : (
                        <table className="w-full text-left">
                            <thead className="bg-slate-50/50 dark:bg-slate-900/40 text-slate-400 uppercase tracking-widest text-[10px] font-black border-b border-slate-100 dark:border-slate-800">
                                <tr>
                                    <th className="px-10 py-6">
                                        Box Code
                                    </th>

                                    <th className="px-10 py-6">
                                        Details
                                    </th>

                                    <th className="px-10 py-6">
                                        Date
                                    </th>

                                    <th className="px-10 py-6 text-right">
                                        Actions
                                    </th>
                                </tr>
                            </thead>

                            <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
                                {filteredBoxes.length >
                                    0 ? (
                                    filteredBoxes.map(
                                        (box) => (
                                            <tr
                                                key={box.id}
                                                className="hover:bg-cyan-50/30 dark:hover:bg-cyan-500/5 transition-colors group"
                                            >
                                                <td className="px-10 py-7">
                                                    <span className="px-4 py-2 bg-slate-900 dark:bg-slate-800 text-white rounded-xl font-black text-[10px]">
                                                        <Hash
                                                            size={
                                                                12
                                                            }
                                                            className="inline mr-1"
                                                        />

                                                        {
                                                            box.kode_box
                                                        }
                                                    </span>
                                                </td>

                                                <td className="px-10 py-7">
                                                    <div className="flex items-start gap-4">
                                                        <div className="w-14 h-14 rounded-2xl bg-cyan-50 dark:bg-cyan-500/10 text-cyan-600 flex items-center justify-center shrink-0">
                                                            <Archive
                                                                size={
                                                                    24
                                                                }
                                                            />
                                                        </div>

                                                        <div>
                                                            <p className="font-black text-slate-900 dark:text-white text-lg">
                                                                {
                                                                    box.kode_box
                                                                }
                                                            </p>

                                                            <p className="text-xs text-slate-400 font-medium line-clamp-2 mt-1">
                                                                {box.description ||
                                                                    "No description"}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </td>

                                                <td className="px-10 py-7 text-xs font-bold text-slate-400 whitespace-nowrap">
                                                    <Calendar
                                                        size={14}
                                                        className="inline mr-2"
                                                    />

                                                    {box.createdAt
                                                        ? new Date(
                                                            box.createdAt
                                                        ).toLocaleDateString()
                                                        : "-"}
                                                </td>

                                                <td className="px-10 py-7">
                                                    <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                        <button
                                                            onClick={() => {
                                                                setEditingBox(
                                                                    box
                                                                );

                                                                setFormData({
                                                                    kode_box:
                                                                        box.kode_box,
                                                                    description:
                                                                        box.description ||
                                                                        "",
                                                                    rackId:
                                                                        box.rackId,
                                                                });

                                                                setIsModalOpen(
                                                                    true
                                                                );
                                                            }}
                                                            className="p-3 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-700 rounded-xl text-slate-400 hover:text-cyan-600 hover:border-cyan-100 transition-all"
                                                        >
                                                            <Edit3
                                                                size={
                                                                    16
                                                                }
                                                            />
                                                        </button>

                                                        <button
                                                            onClick={() =>
                                                                handleDelete(
                                                                    box.id
                                                                )
                                                            }
                                                            disabled={
                                                                deleteLoading ===
                                                                box.id
                                                            }
                                                            className="p-3 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-700 rounded-xl text-slate-400 hover:text-rose-600 hover:border-rose-100 transition-all disabled:opacity-50"
                                                        >
                                                            {deleteLoading ===
                                                                box.id ? (
                                                                <Loader2
                                                                    size={
                                                                        16
                                                                    }
                                                                    className="animate-spin"
                                                                />
                                                            ) : (
                                                                <Trash2
                                                                    size={
                                                                        16
                                                                    }
                                                                />
                                                            )}
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        )
                                    )
                                ) : (
                                    <tr>
                                        <td
                                            colSpan={4}
                                            className="py-32 text-center"
                                        >
                                            <Search
                                                size={28}
                                                className="mx-auto mb-3 text-slate-200"
                                            />

                                            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">
                                                No resources
                                                match "
                                                {
                                                    searchTerm
                                                }
                                                "
                                            </p>

                                            <button
                                                onClick={() =>
                                                    setSearchTerm(
                                                        ""
                                                    )
                                                }
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
                            className="bg-white dark:bg-slate-950 w-full max-w-lg rounded-[3rem] p-12 shadow-2xl relative border border-slate-100 dark:border-slate-800"
                        >
                            <button
                                onClick={() => {
                                    setIsModalOpen(
                                        false
                                    );

                                    setEditingBox(
                                        null
                                    );

                                    setFormData({
                                        kode_box: "",
                                        description:
                                            "",
                                        rackId,
                                    });
                                }}
                                className="absolute top-10 right-10 text-slate-400 hover:text-cyan-500 transition-all"
                            >
                                <X />
                            </button>

                            <h2 className="text-3xl font-black text-slate-900 dark:text-white uppercase italic mb-2 tracking-tighter">
                                {editingBox
                                    ? "Update Box"
                                    : "New Box Unit"}
                            </h2>

                            <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mb-10">
                                Hardware
                                provisioning
                            </p>

                            <form
                                onSubmit={
                                    editingBox
                                        ? handleUpdate
                                        : handleCreate
                                }
                                className="space-y-8"
                            >
                                <div className="space-y-3">
                                    <label className="text-[10px] uppercase text-slate-500 font-black tracking-widest ml-4">
                                        Box Code
                                    </label>

                                    <input
                                        required
                                        value={
                                            formData.kode_box
                                        }
                                        onChange={(
                                            e
                                        ) =>
                                            setFormData(
                                                {
                                                    ...formData,
                                                    kode_box:
                                                        e
                                                            .target
                                                            .value,
                                                }
                                            )
                                        }
                                        className="w-full px-8 py-5 bg-slate-50 dark:bg-slate-900 rounded-[2rem] text-sm font-bold border-2 border-transparent focus:border-cyan-500/20 focus:bg-white dark:focus:bg-slate-950 outline-none transition-all"
                                        placeholder="e.g. BOX-001"
                                    />
                                </div>

                                <div className="space-y-3">
                                    <label className="text-[10px] uppercase text-slate-500 font-black tracking-widest ml-4">
                                        Description
                                    </label>

                                    <textarea
                                        value={
                                            formData.description
                                        }
                                        onChange={(
                                            e
                                        ) =>
                                            setFormData(
                                                {
                                                    ...formData,
                                                    description:
                                                        e
                                                            .target
                                                            .value,
                                                }
                                            )
                                        }
                                        className="w-full px-8 py-5 bg-slate-50 dark:bg-slate-900 rounded-[2rem] text-sm font-bold border-2 border-transparent focus:border-cyan-500/20 focus:bg-white dark:focus:bg-slate-950 outline-none transition-all h-32 resize-none"
                                        placeholder="Describe the physical documents..."
                                    />
                                </div>

                                <button
                                    disabled={
                                        updateLoading
                                    }
                                    className="w-full py-6 bg-slate-900 dark:bg-cyan-600 text-white rounded-[2rem] font-black text-xs uppercase tracking-[0.3em] shadow-xl hover:bg-cyan-600 dark:hover:bg-cyan-500 transition-all disabled:opacity-50"
                                >
                                    {updateLoading ? (
                                        <Loader2
                                            size={18}
                                            className="animate-spin mx-auto"
                                        />
                                    ) : editingBox ? (
                                        "Update Box"
                                    ) : (
                                        "Authorize Registration"
                                    )}
                                </button>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}