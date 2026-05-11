"use client";

import React, { useEffect, useMemo, useState } from "react";

import { motion } from "framer-motion";

import {
  Building2,
  Server,
  Archive,
  FileText,
  Search,
  Loader2,
  Eye,
  Download,
  BarChart3,
  ArrowLeft,
  ChevronRight,
  Home,
} from "lucide-react";

import { api } from "@/lib/api";

import {
  ResponsiveContainer,
  AreaChart,
  Area,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";

type View = "divisions" | "racks" | "boxes" | "files";

interface Rack {
  id: string;
  kode_rack: string;
  divisi: string;
}

interface Box {
  description: ReactNode;
  id: string;
  name_box: string;
  kode_box: string;
  rackId: string;
}

interface FileDoc {
  id: string;
  title: string;
  fileUrl: string;
  boxId: string;
  createdAt?: string;
}

export default function Page() {
  const [loading, setLoading] = useState(true);

  const [view, setView] = useState<View>("divisions");

  const [searchTerm, setSearchTerm] = useState("");

  const [divisions, setDivisions] = useState<string[]>([]);

  const [allRacks, setAllRacks] = useState<Rack[]>([]);

  const [boxes, setBoxes] = useState<Box[]>([]);

  const [documents, setDocuments] = useState<FileDoc[]>([]);

  const [allDocuments, setAllDocuments] = useState<FileDoc[]>([]);

  const [chartRange, setChartRange] = useState<"week" | "month" | "year">(
    "week",
  );

  useEffect(() => {
    // eslint-disable-next-line react-hooks/immutability
    fetchInitial();
  }, []);

  async function fetchInitial() {
    try {
      setLoading(true);

      const rackRes = await api.get("/rack");

      const rackData: Rack[] = rackRes.data?.data || rackRes.data || [];

      setAllRacks(rackData);

      const uniqueDivisions = [
        ...new Set(rackData.map((r) => r.divisi)),
      ] as string[];

      setDivisions(uniqueDivisions);

      const docsRes = await api.get("/documents");

      const docs: FileDoc[] = docsRes.data?.data || docsRes.data || [];

      setDocuments(docs);

      setAllDocuments(docs);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  const chartData = useMemo(() => {
    const now = new Date();

    const result: {
      name: string;
      total: number;
    }[] = [];

    if (chartRange === "week") {
      for (let i = 6; i >= 0; i--) {
        const d = new Date();

        d.setDate(now.getDate() - i);

        const label = d.toLocaleDateString("id-ID", {
          weekday: "short",
        });

        const total = allDocuments.filter((doc) => {
          if (!doc.createdAt) return false;

          const docDate = new Date(doc.createdAt);

          return docDate.toDateString() === d.toDateString();
        }).length;

        result.push({
          name: label,
          total,
        });
      }
    }

    if (chartRange === "month") {
      for (let i = 29; i >= 0; i--) {
        const d = new Date();

        d.setDate(now.getDate() - i);

        const label = d.toLocaleDateString("id-ID", {
          day: "2-digit",
          month: "short",
        });

        const total = allDocuments.filter((doc) => {
          if (!doc.createdAt) return false;

          const docDate = new Date(doc.createdAt);

          return docDate.toDateString() === d.toDateString();
        }).length;

        result.push({
          name: label,
          total,
        });
      }
    }

    if (chartRange === "year") {
      for (let i = 11; i >= 0; i--) {
        const d = new Date();

        d.setMonth(now.getMonth() - i);

        const label = d.toLocaleDateString("id-ID", {
          month: "short",
        });

        const total = allDocuments.filter((doc) => {
          if (!doc.createdAt) return false;

          const docDate = new Date(doc.createdAt);

          return (
            docDate.getMonth() === d.getMonth() &&
            docDate.getFullYear() === d.getFullYear()
          );
        }).length;

        result.push({
          name: label,
          total,
        });
      }
    }

    return result;
  }, [allDocuments, chartRange]);

  const filteredDivisions = divisions.filter((d) =>
    d.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  async function openDivision(div: string) {
    try {
      setLoading(true);

      const res = await api.get(`/rack/divisi/${div}`);

      setAllRacks(res.data?.data || res.data || []);

      setView("racks");
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  async function openRack(rack: Rack) {
    try {
      setLoading(true);

      const res = await api.get(`/boxes/rack/${rack.id}`);

      setBoxes(res.data?.data || res.data || []);

      setView("boxes");
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  function openBox(box: Box) {
    const filtered = allDocuments.filter((d) => d.boxId === box.id);

    setDocuments(filtered);

    setView("files");
  }

  function handleBack() {
    if (view === "files") {
      setView("boxes");
    } else if (view === "boxes") {
      setView("racks");
    } else if (view === "racks") {
      setView("divisions");
    }
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">
        <div>
          <h1 className="text-4xl font-black text-slate-900 dark:text-white">
            Archive Dashboard
          </h1>

          <p className="text-slate-400 mt-2">
            Smart digital archive monitoring system.
          </p>
        </div>

        <div className="relative">
          <Search
            size={18}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
          />

          <input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search..."
            className="pl-12 pr-5 py-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 outline-none font-semibold"
          />
        </div>
      </div>

      {loading ? (
        <div className="py-40 flex flex-col items-center gap-4">
          <Loader2 className="animate-spin text-cyan-500" size={45} />

          <p className="text-xs font-black uppercase tracking-[0.3em] text-slate-400">
            Loading Data
          </p>
        </div>
      ) : (
        <>
          <nav className="flex items-center gap-2 overflow-x-auto">
            <button
              onClick={() => {
                setView("divisions");
                setSearchTerm("");
              }}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all ${
                view === "divisions"
                  ? "bg-cyan-500 text-white"
                  : "bg-white dark:bg-[#081028] text-slate-500"
              }`}
            >
              <Home size={16} />
              Root
            </button>

            {view !== "divisions" && (
              <>
                <ChevronRight size={16} className="text-slate-300" />
                <button
                  onClick={handleBack}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900 text-white text-sm font-bold"
                >
                  <ArrowLeft size={16} />
                  Back
                </button>
              </>
            )}
          </nav>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
            {view === "divisions" &&
              filteredDivisions.map((div) => (
                <motion.button
                  whileHover={{
                    y: -5,
                  }}
                  key={div}
                  onClick={() => openDivision(div)}
                  className="p-8 rounded-[2rem] bg-white dark:bg-[#081028] border border-slate-200 dark:border-slate-800 text-left shadow-sm"
                >
                  <div className="w-14 h-14 rounded-2xl bg-cyan-500/10 text-cyan-500 flex items-center justify-center mb-5">
                    <Building2 />
                  </div>

                  <h2 className="text-2xl font-black text-slate-900 dark:text-white">
                    {div}
                  </h2>

                  <p className="mt-2 text-sm text-slate-400">
                    Division Archive
                  </p>
                </motion.button>
              ))}

            {view === "racks" &&
              allRacks.map((rack) => (
                <motion.button
                  whileHover={{
                    y: -5,
                  }}
                  key={rack.id}
                  onClick={() => openRack(rack)}
                  className="p-8 rounded-[2rem] bg-white dark:bg-[#081028] border border-slate-200 dark:border-slate-800 text-left shadow-sm"
                >
                  <div className="w-14 h-14 rounded-2xl bg-violet-500/10 text-violet-500 flex items-center justify-center mb-5">
                    <Server />
                  </div>

                  <h2 className="text-2xl font-black text-slate-900 dark:text-white">
                    {rack.kode_rack}
                  </h2>

                  <p className="mt-2 text-sm text-slate-400">{rack.divisi}</p>
                </motion.button>
              ))}

            {view === "boxes" &&
              boxes.map((box) => (
                <motion.button
                  whileHover={{
                    y: -5,
                  }}
                  key={box.id}
                  onClick={() => openBox(box)}
                  className="p-8 rounded-[2rem] bg-white dark:bg-[#081028] border border-slate-200 dark:border-slate-800 text-left shadow-sm"
                >
                  <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center mb-5">
                    <Archive />
                  </div>

                  <h2 className="text-2xl font-black text-slate-900 dark:text-white">
                    {box.name_box}
                  </h2>

                  <p className="mt-2 text-sm font-bold text-slate-500 dark:text-slate-400">
                    {box.kode_box}
                  </p>
                  <p className="mt-2 text-sm font-bold text-slate-500 dark:text-slate-400">
                    {box.description}
                  </p>
                </motion.button>
              ))}

            {view === "files" &&
              documents.map((doc) => (
                <div
                  key={doc.id}
                  className="p-8 rounded-[2rem] bg-white dark:bg-[#081028] border border-slate-200 dark:border-slate-800 shadow-sm"
                >
                  <div className="w-14 h-14 rounded-2xl bg-cyan-500/10 text-cyan-500 flex items-center justify-center mb-5">
                    <FileText />
                  </div>

                  <h2 className="text-xl font-black text-slate-900 dark:text-white line-clamp-2">
                    {doc.title}
                  </h2>

                  <div className="grid grid-cols-2 gap-3 mt-6">
                    <a
                      href={doc.fileUrl}
                      target="_blank"
                      className="h-12 rounded-2xl bg-slate-900 text-white flex items-center justify-center gap-2 font-bold"
                    >
                      <Eye size={16} />
                      View
                    </a>

                    <a
                      href={doc.fileUrl}
                      download
                      className="h-12 rounded-2xl bg-cyan-500 text-white flex items-center justify-center gap-2 font-bold"
                    >
                      <Download size={16} />
                      Download
                    </a>
                  </div>
                </div>
              ))}
          </div>

          {view === "divisions" && (
            <motion.section
              initial={{
                opacity: 0,
                y: 20,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              className="mt-10 rounded-[2.5rem] bg-white dark:bg-[#081028] border border-slate-200 dark:border-slate-800 p-8 shadow-sm"
            >
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 mb-10">
                <div>
                  <div className="flex items-center gap-2 text-cyan-500 text-xs font-black uppercase tracking-[0.3em] mb-3">
                    <BarChart3 size={14} />
                    Analytics
                  </div>

                  <h2 className="text-3xl font-black text-slate-900 dark:text-white">
                    Incoming Documents
                  </h2>

                  <p className="text-slate-400 mt-2 text-sm">
                    Statistik jumlah dokumen masuk ke sistem.
                  </p>
                </div>

                <div className="flex flex-wrap gap-3">
                  {[
                    {
                      key: "week",
                      label: "1 Minggu",
                    },
                    {
                      key: "month",
                      label: "1 Bulan",
                    },
                    {
                      key: "year",
                      label: "1 Tahun",
                    },
                  ].map((item) => (
                    <button
                      key={item.key}
                      onClick={() => setChartRange(item.key as any)}
                      className={`px-5 py-3 rounded-2xl text-xs font-black uppercase tracking-widest transition-all ${
                        chartRange === item.key
                          ? "bg-cyan-500 text-white shadow-lg shadow-cyan-500/30"
                          : "bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400"
                      }`}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height={380}>
                  <AreaChart data={chartData}>
                    <defs>
                      <linearGradient
                        id="analytics"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="5%"
                          stopColor="#06b6d4"
                          stopOpacity={0.4}
                        />

                        <stop
                          offset="95%"
                          stopColor="#06b6d4"
                          stopOpacity={0}
                        />
                      </linearGradient>
                    </defs>

                    <CartesianGrid strokeDasharray="3 3" opacity={0.1} />

                    <XAxis dataKey="name" />

                    <YAxis />

                    <Tooltip />

                    <Area
                      type="monotone"
                      dataKey="total"
                      stroke="#06b6d4"
                      strokeWidth={4}
                      fillOpacity={1}
                      fill="url(#analytics)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </motion.section>
          )}
        </>
      )}
    </div>
  );
}
