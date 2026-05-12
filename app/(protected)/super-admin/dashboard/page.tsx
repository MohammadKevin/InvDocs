"use client";

import React, { useEffect, useMemo, useState } from "react";

import { motion, AnimatePresence } from "framer-motion";

import {
  Building2,
  Server,
  Archive,
  FileText,
  Search,
  ArrowLeft,
  Eye,
  Download,
  Loader2,
  X,
  BarChart3,
  Home,
  ChevronRight,
  FolderOpen,
} from "lucide-react";

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";

import { api } from "@/lib/api";

interface Rack {
  id: string;
  kode_rack: string;
  divisi: string;
  status?: string;
}

interface Box {
  id: string;
  kode_box: string;
  rackId: string;
  name_box?: string;
  description?: string;
}

interface FileDoc {
  id: string;
  title: string;
  fileUrl: string;
  boxId: string;
  createdAt?: string;
}

const ACCENTS = [
  "from-cyan-500 to-blue-500",
  "from-fuchsia-500 to-pink-500",
  "from-emerald-500 to-green-500",
  "from-orange-500 to-amber-500",
];

export default function DashboardPage() {
  const [loading, setLoading] = useState(true);

  const [view, setView] = useState<
    "divisions" | "racks" | "boxes" | "files"
  >("divisions");

  const [divisions, setDivisions] = useState<string[]>([]);

  const [racks, setRacks] = useState<Rack[]>([]);

  const [boxes, setBoxes] = useState<Box[]>([]);

  const [documents, setDocuments] = useState<FileDoc[]>([]);

  const [selectedDivision, setSelectedDivision] = useState("");

  const [selectedRack, setSelectedRack] = useState<Rack | null>(null);

  const [selectedBox, setSelectedBox] = useState<Box | null>(null);

  const [previewFile, setPreviewFile] = useState<FileDoc | null>(null);

  const [search, setSearch] = useState("");

  const [chartRange, setChartRange] = useState<
    "week" | "month" | "year" | "3year"
  >("month");

  useEffect(() => {
    fetchInitial();
  }, []);

  async function fetchInitial() {
    try {
      setLoading(true);

      const [rackRes, boxRes, docRes] = await Promise.all([
        api.get("/rack"),
        api.get("/boxes"),
        api.get("/documents"),
      ]);

      const racksData: Rack[] = Array.isArray(rackRes.data?.data)
        ? rackRes.data.data
        : Array.isArray(rackRes.data)
          ? rackRes.data
          : [];

      const boxesData: Box[] = Array.isArray(boxRes.data?.data)
        ? boxRes.data.data
        : Array.isArray(boxRes.data)
          ? boxRes.data
          : [];

      const docsData: FileDoc[] = Array.isArray(docRes.data?.data)
        ? docRes.data.data
        : Array.isArray(docRes.data)
          ? docRes.data
          : [];

      setRacks(racksData);

      setBoxes(boxesData);

      setDocuments(docsData);

      const uniqueDivisions = Array.from(
        new Set(racksData.map((r) => r.divisi)),
      );

      setDivisions(uniqueDivisions);
    } catch (err: any) {
      console.error("API ERROR:", err.response?.data);
    } finally {
      setLoading(false);
    }
  }

  function handleBack() {
    if (view === "files") {
      setView("boxes");
      return;
    }

    if (view === "boxes") {
      setView("racks");
      return;
    }

    if (view === "racks") {
      setView("divisions");
    }
  }

  const filteredDivisions = divisions.filter((d) =>
    d.toLowerCase().includes(search.toLowerCase()),
  );

  const filteredRacks = racks.filter(
    (r) =>
      r.divisi === selectedDivision &&
      r.kode_rack.toLowerCase().includes(search.toLowerCase()),
  );

  const filteredBoxes = boxes.filter(
    (b) =>
      b.rackId === selectedRack?.id &&
      b.kode_box.toLowerCase().includes(search.toLowerCase()),
  );

  const filteredFiles = documents.filter(
    (f) =>
      f.boxId === selectedBox?.id &&
      f.title.toLowerCase().includes(search.toLowerCase()),
  );

  const incomingDocsChart = useMemo(() => {
    const now = new Date();

    let labels: string[] = [];

    if (chartRange === "week") {
      labels = ["Sen", "Sel", "Rab", "Kam", "Jum", "Sab", "Min"];
    }

    if (chartRange === "month") {
      labels = Array.from({ length: 30 }, (_, i) => `${i + 1}`);
    }

    if (chartRange === "year") {
      labels = [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "Mei",
        "Jun",
        "Jul",
        "Agu",
        "Sep",
        "Okt",
        "Nov",
        "Des",
      ];
    }

    if (chartRange === "3year") {
      labels = Array.from(
        { length: 3 },
        (_, i) => `${now.getFullYear() - 2 + i}`,
      );
    }

    const grouped: Record<string, number> = {};

    labels.forEach((l) => {
      grouped[l] = 0;
    });

    documents.forEach((doc) => {
      if (!doc.createdAt) return;

      const d = new Date(doc.createdAt);

      let key = "";

      if (chartRange === "week") {
        const days = ["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"];

        key = days[d.getDay()];
      }

      if (chartRange === "month") {
        key = `${d.getDate()}`;
      }

      if (chartRange === "year") {
        const months = [
          "Jan",
          "Feb",
          "Mar",
          "Apr",
          "Mei",
          "Jun",
          "Jul",
          "Agu",
          "Sep",
          "Okt",
          "Nov",
          "Des",
        ];

        key = months[d.getMonth()];
      }

      if (chartRange === "3year") {
        key = `${d.getFullYear()}`;
      }

      if (grouped[key] !== undefined) {
        grouped[key] += 1;
      }
    });

    return labels.map((label) => ({
      name: label,
      total: grouped[label] || 0,
    }));
  }, [documents, chartRange]);

  function EmptyState({
    title,
    desc,
  }: {
    title: string;
    desc: string;
  }) {
    return (
      <div className="col-span-full py-24 flex flex-col items-center justify-center text-center">
        <div className="w-24 h-24 rounded-full bg-slate-100 dark:bg-slate-900 flex items-center justify-center mb-6">
          <FolderOpen size={38} className="text-slate-400" />
        </div>

        <h3 className="text-2xl font-black text-slate-900 dark:text-white">
          {title}
        </h3>

        <p className="mt-3 text-slate-400 max-w-md">
          {desc}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-10">
      <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-8">
        <div>
          <p className="text-cyan-500 text-[11px] uppercase tracking-[0.35em] font-black mb-4">
            Smart Archive Dashboard
          </p>

          <h1 className="text-4xl md:text-6xl font-black tracking-tight text-slate-900 dark:text-white">
            Digital Archive
          </h1>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
          {view !== "divisions" && (
            <button
              onClick={handleBack}
              className="h-14 px-5 rounded-2xl bg-slate-900 text-white flex items-center justify-center gap-2 font-bold hover:scale-105 transition-all"
            >
              <ArrowLeft size={18} />
              Back
            </button>
          )}

          <div className="relative">
            <Search
              className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400"
              size={18}
            />

            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search data..."
              className="w-full sm:w-[320px] h-14 pl-14 pr-5 rounded-2xl bg-white dark:bg-[#081028] border border-slate-200 dark:border-slate-800 outline-none font-semibold"
            />
          </div>
        </div>
      </div>

      <nav className="flex items-center gap-3 overflow-x-auto">
        <button
          onClick={() => {
            setView("divisions");
            setSearch("");
          }}
          className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-cyan-500 text-white font-bold"
        >
          <Home size={16} />
          Home
        </button>

        {selectedDivision && (
          <>
            <ChevronRight size={16} className="text-slate-300" />

            <div className="px-4 py-2 rounded-xl bg-white dark:bg-[#081028] border border-slate-200 dark:border-slate-800 font-bold">
              {selectedDivision}
            </div>
          </>
        )}

        {selectedRack && (
          <>
            <ChevronRight size={16} className="text-slate-300" />

            <div className="px-4 py-2 rounded-xl bg-white dark:bg-[#081028] border border-slate-200 dark:border-slate-800 font-bold">
              {selectedRack.kode_rack}
            </div>
          </>
        )}
      </nav>

      {loading ? (
        <div className="py-40 flex flex-col items-center justify-center gap-6">
          <Loader2 className="animate-spin text-cyan-500" size={50} />

          <p className="uppercase tracking-[0.4em] text-xs font-black text-slate-400">
            Loading Dashboard
          </p>
        </div>
      ) : (
        <>
          <motion.div
            layout
            className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-4 gap-6"
          >
            {view === "divisions" &&
              filteredDivisions.map((d, i) => (
                <Card
                  key={d}
                  icon={Building2}
                  title={d}
                  subtitle="Division"
                  accent={ACCENTS[i % ACCENTS.length]}
                  onClick={() => {
                    setSelectedDivision(d);
                    setView("racks");
                  }}
                />
              ))}

            {view === "racks" &&
              filteredRacks.map((r, i) => (
                <Card
                  key={r.id}
                  icon={Server}
                  title={r.kode_rack}
                  subtitle={r.status || "Storage Rack"}
                  accent={ACCENTS[i % ACCENTS.length]}
                  onClick={() => {
                    setSelectedRack(r);
                    setView("boxes");
                  }}
                />
              ))}

            {view === "boxes" &&
              filteredBoxes.map((b, i) => (
                <Card
                  key={b.id}
                  icon={Archive}
                  title={b.name_box || "Unnamed Box"}
                  code={b.kode_box}
                  subtitle={b.description || "Document Storage"}
                  accent={ACCENTS[i % ACCENTS.length]}
                  onClick={() => {
                    setSelectedBox(b);
                    setView("files");
                  }}
                />
              ))}

            {view === "files" &&
              filteredFiles.map((f, i) => (
                <motion.div
                  key={f.id}
                  whileHover={{ y: -5 }}
                  className="rounded-[2rem] bg-white dark:bg-[#081028] border border-slate-200 dark:border-slate-800 p-6 shadow-sm"
                >
                  <div
                    className={`w-16 h-16 rounded-3xl bg-gradient-to-br ${ACCENTS[i % ACCENTS.length]} text-white flex items-center justify-center mb-6`}
                  >
                    <FileText size={28} />
                  </div>

                  <h3 className="text-xl font-black text-slate-900 dark:text-white line-clamp-2">
                    {f.title}
                  </h3>

                  <p className="mt-2 text-sm text-slate-400">
                    Digital Document
                  </p>

                  <div className="grid grid-cols-2 gap-3 mt-7">
                    <button
                      onClick={() => setPreviewFile(f)}
                      className="h-12 rounded-2xl bg-slate-900 hover:bg-cyan-600 text-white font-bold flex items-center justify-center gap-2 transition-all"
                    >
                      <Eye size={16} />
                      Preview
                    </button>

                    <a
                      href={f.fileUrl}
                      target="_blank"
                      className="h-12 rounded-2xl bg-cyan-500 hover:bg-cyan-400 text-white font-bold flex items-center justify-center gap-2 transition-all"
                    >
                      <Download size={16} />
                      Download
                    </a>
                  </div>
                </motion.div>
              ))}

            {view === "divisions" &&
              filteredDivisions.length === 0 && (
                <EmptyState
                  title="No Division Found"
                  desc="Tidak ada divisi yang cocok dengan pencarian."
                />
              )}

            {view === "racks" &&
              filteredRacks.length === 0 && (
                <EmptyState
                  title="No Rack Found"
                  desc="Rack tidak ditemukan."
                />
              )}

            {view === "boxes" &&
              filteredBoxes.length === 0 && (
                <EmptyState
                  title="No Box Found"
                  desc="Belum ada box di rack ini."
                />
              )}

            {view === "files" &&
              filteredFiles.length === 0 && (
                <EmptyState
                  title="No Document Found"
                  desc="Belum ada dokumen di dalam box."
                />
              )}
          </motion.div>

          {view === "divisions" && (
            <div className="rounded-[2.5rem] bg-white dark:bg-[#081028] border border-slate-200 dark:border-slate-800 p-8">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8 mb-10">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-3xl bg-cyan-500/10 text-cyan-500 flex items-center justify-center">
                    <BarChart3 size={28} />
                  </div>

                  <div>
                    <h2 className="text-3xl font-black text-slate-900 dark:text-white">
                      Incoming Documents
                    </h2>

                    <p className="text-slate-400 mt-1">
                      Statistik dokumen masuk
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-3">
                  {[
                    { key: "week", label: "1 Minggu" },
                    { key: "month", label: "1 Bulan" },
                    { key: "year", label: "1 Tahun" },
                    { key: "3year", label: "3 Tahun" },
                  ].map((item) => (
                    <button
                      key={item.key}
                      onClick={() => setChartRange(item.key as any)}
                      className={`px-5 py-3 rounded-2xl font-bold transition-all ${chartRange === item.key
                          ? "bg-cyan-500 text-white"
                          : "bg-slate-100 dark:bg-slate-900 text-slate-500"
                        }`}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="h-[380px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={incomingDocsChart}>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      strokeOpacity={0.1}
                    />

                    <XAxis dataKey="name" />

                    <YAxis />

                    <Tooltip />

                    <Bar
                      dataKey="total"
                      fill="#06b6d4"
                      radius={[10, 10, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}

          <AnimatePresence>
            {previewFile && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setPreviewFile(null)}
                className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4"
              >
                <motion.div
                  initial={{
                    scale: 0.95,
                    opacity: 0,
                  }}
                  animate={{
                    scale: 1,
                    opacity: 1,
                  }}
                  exit={{
                    scale: 0.95,
                    opacity: 0,
                  }}
                  onClick={(e) => e.stopPropagation()}
                  className="w-full max-w-7xl h-[92vh] rounded-[2rem] overflow-hidden bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 shadow-2xl"
                >
                  <div className="h-20 px-6 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
                    <div>
                      <p className="text-[10px] uppercase tracking-[0.3em] font-black text-cyan-500">
                        Document Preview
                      </p>

                      <h2 className="text-xl font-black text-slate-900 dark:text-white mt-2">
                        {previewFile.title}
                      </h2>
                    </div>

                    <button
                      onClick={() => setPreviewFile(null)}
                      className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-900 flex items-center justify-center"
                    >
                      <X size={18} />
                    </button>
                  </div>

                  <iframe
                    src={previewFile.fileUrl}
                    className="w-full h-[calc(100%-80px)]"
                  />
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </>
      )}
    </div>
  );
}

function Card({
  icon: Icon,
  title,
  subtitle,
  code,
  accent,
  onClick,
}: any) {
  return (
    <motion.button
      whileHover={{ y: -5 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className="group relative overflow-hidden rounded-[2rem] bg-white dark:bg-[#081028] border border-slate-200 dark:border-slate-800 p-7 text-left shadow-sm hover:shadow-2xl transition-all"
    >
      <div
        className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-all duration-500 bg-gradient-to-br ${accent}`}
      />

      <div className="relative z-10">
        <div
          className={`w-16 h-16 rounded-3xl bg-gradient-to-br ${accent} text-white flex items-center justify-center shadow-lg mb-6`}
        >
          <Icon size={30} />
        </div>

        <h3 className="text-2xl font-black text-slate-900 dark:text-white">
          {title}
        </h3>

        {code && (
          <p className="mt-2 text-xs font-black uppercase tracking-[0.25em] text-cyan-500">
            {code}
          </p>
        )}

        <p className="mt-3 text-sm text-slate-400">
          {subtitle}
        </p>
      </div>
    </motion.button>
  );
}