"use client";

import React, { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

import {
    Server,
    Archive,
    FileText,
    Building2,
    LayoutGrid,
    ArrowLeft,
    Eye,
    Loader2,
    X,
    Search,
    Download,
} from "lucide-react";

import { api } from "@/lib/api";

import {
    ResponsiveContainer,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    PieChart,
    Pie,
    Cell,
    Tooltip,
} from "recharts";

type View = "divisions" | "racks" | "boxes" | "files";

type Rack = {
    id: string;
    kode_rack?: string;
    divisi?: string;
    status?: string;
};

type Box = {
    id: string;
    kode_box?: string;
    rackId?: string;
};

type FileDoc = {
    id: string;
    title?: string;
    fileUrl: string;
    boxId?: string;
};

const ACCENTS = [
    "from-cyan-500 to-sky-500",
    "from-violet-500 to-indigo-500",
    "from-emerald-500 to-teal-500",
    "from-amber-500 to-orange-500",
    "from-rose-500 to-pink-500",
    "from-blue-500 to-cyan-500",
];

const COLORS = [
    "#06b6d4",
    "#8b5cf6",
    "#10b981",
    "#f59e0b",
    "#ef4444",
    "#3b82f6",
];

function Card({
    icon: Icon,
    title,
    subtitle,
    onClick,
    accent,
}: {
    icon: React.ElementType;
    title: string;
    subtitle: string;
    onClick: () => void;
    accent: string;
}) {
    return (
        <motion.button
            whileHover={{ y: -6 }}
            whileTap={{ scale: 0.98 }}
            onClick={onClick}
            className="group relative overflow-hidden rounded-[2rem] border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#081028] shadow-sm hover:shadow-xl transition-all duration-300 text-left"
        >
            <div
                className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-br ${accent}`}
            />

            <div className="relative p-6 flex flex-col gap-5">
                <div className="flex items-center justify-between">
                    <div className="w-14 h-14 rounded-2xl bg-cyan-50 dark:bg-slate-900 text-cyan-600 dark:text-cyan-400 group-hover:bg-white/20 group-hover:text-white flex items-center justify-center transition-all duration-300">
                        <Icon size={26} />
                    </div>

                    <div className="px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-900 text-[10px] font-black uppercase tracking-widest text-slate-400 group-hover:bg-white/20 group-hover:text-white/80 transition-all">
                        Open
                    </div>
                </div>

                <div>
                    <h3 className="text-lg font-black text-slate-800 dark:text-white truncate group-hover:text-white transition-colors">
                        {title}
                    </h3>

                    <p className="text-sm text-slate-400 group-hover:text-white/80 transition-colors mt-1">
                        {subtitle}
                    </p>
                </div>
            </div>
        </motion.button>
    );
}

export default function DashboardPage() {
    const [view, setView] =
        useState<View>("divisions");

    const [loading, setLoading] =
        useState(true);

    const [searchTerm, setSearchTerm] =
        useState("");

    const [activeDivision, setActiveDivision] =
        useState<string | null>(null);

    const [activeRack, setActiveRack] =
        useState<Rack | null>(null);

    const [activeBox, setActiveBox] =
        useState<Box | null>(null);

    const [allRacks, setAllRacks] = useState<
        Rack[]
    >([]);

    const [divisions, setDivisions] =
        useState<string[]>([]);

    const [boxes, setBoxes] = useState<Box[]>([]);

    const [documents, setDocuments] =
        useState<FileDoc[]>([]);

    const [previewFile, setPreviewFile] =
        useState<FileDoc | null>(null);

    useEffect(() => {
        fetchInitial();
    }, []);

    async function fetchInitial() {
        try {
            setLoading(true);

            const rackRes = await api.get("/rack");

            const rackData: Rack[] =
                rackRes.data?.data ||
                rackRes.data?.racks ||
                rackRes.data ||
                [];

            setAllRacks(rackData);

            const uniqueDivisions = [
                ...new Set(
                    rackData
                        .map((r) => r.divisi)
                        .filter(Boolean)
                ),
            ] as string[];

            setDivisions(uniqueDivisions);
        } catch (err) {
            console.error(
                "FETCH RACK ERROR",
                err
            );
        } finally {
            setLoading(false);
        }
    }

    const handleBack = () => {
        setSearchTerm("");

        if (view === "files") {
            setView("boxes");
        } else if (view === "boxes") {
            setView("racks");
        } else if (view === "racks") {
            setView("divisions");
        }
    };

    const filteredDivisions = useMemo(() => {
        return divisions.filter((d) =>
            d
                ?.toLowerCase()
                .includes(
                    searchTerm.toLowerCase()
                )
        );
    }, [divisions, searchTerm]);

    const filteredRacks = useMemo(() => {
        return allRacks.filter(
            (r) =>
                r.divisi === activeDivision &&
                (r.kode_rack || "")
                    .toLowerCase()
                    .includes(
                        searchTerm.toLowerCase()
                    )
        );
    }, [
        allRacks,
        activeDivision,
        searchTerm,
    ]);

    const filteredBoxes = useMemo(() => {
        return boxes.filter((b) =>
            (b.kode_box || "")
                .toLowerCase()
                .includes(
                    searchTerm.toLowerCase()
                )
        );
    }, [boxes, searchTerm]);

    const filteredFiles = useMemo(() => {
        return documents.filter((f) =>
            (f.title || "")
                .toLowerCase()
                .includes(
                    searchTerm.toLowerCase()
                )
        );
    }, [documents, searchTerm]);

    const openDivision = (div: string) => {
        setActiveDivision(div);

        setSearchTerm("");

        setView("racks");
    };

    const openRack = async (rack: Rack) => {
        try {
            setLoading(true);

            setActiveRack(rack);

            setSearchTerm("");

            const res = await api.get("/boxes");

            const data: Box[] =
                res.data?.data ||
                res.data ||
                [];

            const filtered = data.filter(
                (b) => b.rackId === rack.id
            );

            setBoxes(filtered);

            setView("boxes");
        } catch (err) {
            console.error(
                "OPEN RACK ERROR",
                err
            );
        } finally {
            setLoading(false);
        }
    };

    const openBox = async (box: Box) => {
        try {
            setLoading(true);

            setActiveBox(box);

            setSearchTerm("");

            const res =
                await api.get("/documents");

            const data: FileDoc[] =
                res.data?.data ||
                res.data ||
                [];

            const filtered = data.filter(
                (d) => d.boxId === box.id
            );

            setDocuments(filtered);

            setView("files");
        } catch (err) {
            console.error(
                "OPEN BOX ERROR",
                err
            );
        } finally {
            setLoading(false);
        }
    };

    const pageTitle =
        view === "divisions"
            ? "Divisions"
            : view === "racks"
            ? activeDivision
            : view === "boxes"
            ? activeRack?.kode_rack
            : activeBox?.kode_box;

    const divisionCountData = divisions.map(
        (division) => ({
            name: division,
            value: allRacks.filter(
                (r) => r.divisi === division
            ).length,
        })
    );

    const rackCountData = allRacks.map(
        (rack) => {
            const totalBoxes =
                boxes.filter(
                    (b) =>
                        b.rackId === rack.id
                ).length;

            return {
                name:
                    rack.kode_rack ||
                    "UNKNOWN",
                value: totalBoxes || 0,
            };
        }
    );
    return (
    <div className="min-h-screen w-full space-y-8 pb-10">
        {/* HERO */}
        <section className="relative overflow-hidden rounded-[2.5rem] border border-slate-200/70 dark:border-cyan-500/10 bg-white/80 dark:bg-[#081028]/90 backdrop-blur-xl p-8 lg:p-10 shadow-sm">
            <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 blur-3xl rounded-full -mr-40 -mt-40" />

            <div className="relative z-10 flex flex-col xl:flex-row xl:items-center xl:justify-between gap-8">
                <div className="space-y-4">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 text-[11px] font-black uppercase tracking-[0.3em]">
                        <LayoutGrid size={14} />
                        Enterprise Archive System
                    </div>

                    <div>
                        <h1 className="text-5xl lg:text-6xl font-black tracking-tight text-slate-900 dark:text-white leading-none">
                            {pageTitle}
                        </h1>

                        <p className="mt-4 max-w-2xl text-slate-500 dark:text-slate-400 text-sm lg:text-base">
                            Browse digital archive infrastructure across divisions,
                            storage racks, archive boxes, and enterprise documents.
                        </p>
                    </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                    <div className="relative">
                        <Search
                            size={18}
                            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                        />

                        <input
                            value={searchTerm}
                            onChange={(e) =>
                                setSearchTerm(e.target.value)
                            }
                            placeholder={`Search ${view}...`}
                            className="w-full sm:w-80 h-14 pl-12 pr-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 outline-none focus:ring-4 focus:ring-cyan-500/10 dark:text-white font-semibold transition-all"
                        />
                    </div>

                    {view !== "divisions" && (
                        <button
                            onClick={handleBack}
                            className="h-14 px-6 rounded-2xl bg-slate-900 hover:bg-cyan-600 text-white font-bold flex items-center justify-center gap-2 transition-all"
                        >
                            <ArrowLeft size={18} />
                            Back
                        </button>
                    )}
                </div>
            </div>
        </section>

        {/* STATS */}
        <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
            <div className="rounded-[2rem] bg-white dark:bg-[#081028] border border-slate-200 dark:border-slate-800 p-6">
                <p className="text-xs uppercase tracking-[0.2em] font-black text-slate-400">
                    Divisions
                </p>

                <h2 className="mt-3 text-4xl font-black text-slate-900 dark:text-white">
                    {divisions.length}
                </h2>
            </div>

            <div className="rounded-[2rem] bg-white dark:bg-[#081028] border border-slate-200 dark:border-slate-800 p-6">
                <p className="text-xs uppercase tracking-[0.2em] font-black text-slate-400">
                    Racks
                </p>

                <h2 className="mt-3 text-4xl font-black text-slate-900 dark:text-white">
                    {allRacks.length}
                </h2>
            </div>

            <div className="rounded-[2rem] bg-white dark:bg-[#081028] border border-slate-200 dark:border-slate-800 p-6">
                <p className="text-xs uppercase tracking-[0.2em] font-black text-slate-400">
                    Boxes
                </p>

                <h2 className="mt-3 text-4xl font-black text-slate-900 dark:text-white">
                    {boxes.length}
                </h2>
            </div>

            <div className="rounded-[2rem] bg-white dark:bg-[#081028] border border-slate-200 dark:border-slate-800 p-6">
                <p className="text-xs uppercase tracking-[0.2em] font-black text-slate-400">
                    Documents
                </p>

                <h2 className="mt-3 text-4xl font-black text-slate-900 dark:text-white">
                    {documents.length}
                </h2>
            </div>
        </section>

        {/* CONTENT */}
        {loading ? (
            <div className="h-[400px] flex flex-col items-center justify-center">
                <Loader2
                    className="animate-spin text-cyan-500"
                    size={50}
                />

                <p className="mt-5 text-xs uppercase tracking-[0.3em] font-black text-slate-400">
                    Syncing Archive Infrastructure
                </p>
            </div>
        ) : (
            <>
                <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
                    {view === "divisions" &&
                        filteredDivisions.map((d, i) => (
                            <Card
                                key={d}
                                icon={Building2}
                                title={d}
                                subtitle="Division"
                                accent={
                                    ACCENTS[
                                        i %
                                            ACCENTS.length
                                    ]
                                }
                                onClick={() =>
                                    openDivision(d)
                                }
                            />
                        ))}

                    {view === "racks" &&
                        filteredRacks.map((r, i) => (
                            <Card
                                key={r.id}
                                icon={Server}
                                title={
                                    r.kode_rack ||
                                    "-"
                                }
                                subtitle={
                                    r.status ||
                                    "Rack"
                                }
                                accent={
                                    ACCENTS[
                                        i %
                                            ACCENTS.length
                                    ]
                                }
                                onClick={() =>
                                    openRack(r)
                                }
                            />
                        ))}

                    {view === "boxes" &&
                        filteredBoxes.map((b, i) => (
                            <Card
                                key={b.id}
                                icon={Archive}
                                title={
                                    b.kode_box ||
                                    "-"
                                }
                                subtitle="Archive Box"
                                accent={
                                    ACCENTS[
                                        i %
                                            ACCENTS.length
                                    ]
                                }
                                onClick={() =>
                                    openBox(b)
                                }
                            />
                        ))}

                    {view === "files" &&
                        filteredFiles.map((f, i) => (
                            <Card
                                key={f.id}
                                icon={FileText}
                                title={
                                    f.title ||
                                    "Untitled"
                                }
                                subtitle="Digital File"
                                accent={
                                    ACCENTS[
                                        i %
                                            ACCENTS.length
                                    ]
                                }
                                onClick={() =>
                                    setPreviewFile(f)
                                }
                            />
                        ))}
                </section>

                {/* ANALYTICS */}
                <section className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                    <div className="rounded-[2rem] border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#081028] p-8">
                        <div className="mb-8">
                            <h2 className="text-2xl font-black text-slate-900 dark:text-white">
                                Division Analytics
                            </h2>

                            <p className="mt-2 text-sm text-slate-400">
                                Rack distribution across
                                enterprise divisions.
                            </p>
                        </div>

                        <ResponsiveContainer
                            width="100%"
                            height={320}
                        >
                            <PieChart>
                                <Pie
                                    data={
                                        divisionCountData
                                    }
                                    dataKey="value"
                                    nameKey="name"
                                    outerRadius={110}
                                    label
                                >
                                    {divisionCountData.map(
                                        (
                                            _,
                                            index
                                        ) => (
                                            <Cell
                                                key={`cell-${index}`}
                                                fill={
                                                    COLORS[
                                                        index %
                                                            COLORS.length
                                                    ]
                                                }
                                            />
                                        )
                                    )}
                                </Pie>

                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>

                    <div className="rounded-[2rem] border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#081028] p-8">
                        <div className="mb-8">
                            <h2 className="text-2xl font-black text-slate-900 dark:text-white">
                                Rack Capacity
                            </h2>

                            <p className="mt-2 text-sm text-slate-400">
                                Archive box allocation per
                                rack infrastructure.
                            </p>
                        </div>

                        <ResponsiveContainer
                            width="100%"
                            height={320}
                        >
                            <BarChart
                                data={
                                    rackCountData
                                }
                            >
                                <XAxis dataKey="name" />

                                <YAxis />

                                <Tooltip />

                                <Bar
                                    dataKey="value"
                                    fill="#06b6d4"
                                    radius={[
                                        12,
                                        12,
                                        0,
                                        0,
                                    ]}
                                />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </section>
            </>
        )}
    </div>
);
}