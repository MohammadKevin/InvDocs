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
  description: any;
  deskripsi: any;
  name_box: any;
  id: string;
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

const ACCENTS = [
  "from-cyan-500 to-blue-500",
  "from-fuchsia-500 to-pink-500",
  "from-emerald-500 to-green-500",
  "from-orange-500 to-amber-500",
];

export default function DashboardPage() {
  const [loading, setLoading] = useState(true);

  const [view, setView] = useState<"divisions" | "racks" | "boxes" | "files">(
    "divisions",
  );

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
    // eslint-disable-next-line react-hooks/immutability
    fetchInitial();
  }, []);

  async function fetchInitial() {
    try {
      setLoading(true);

      const [rackRes, boxRes, docRes] = await Promise.all([
        api.get("/rack/my"),
        api.get("/boxes"),
        api.get("/documents"),
      ]);

      const racksData: Rack[] = rackRes.data?.data || rackRes.data || [];

      const boxesData: Box[] = boxRes.data?.data || boxRes.data || [];

      const docsData: FileDoc[] = docRes.data?.data || docRes.data || [];

      setRacks(racksData);

      setBoxes(boxesData);

      setDocuments(docsData);

      const uniqueDivisions: string[] = Array.from(
        new Set(racksData.map((r) => String(r.divisi))),
      );

      setDivisions(uniqueDivisions);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  function openDivision(division: string) {
    setSelectedDivision(division);

    setView("racks");
  }

  function openRack(rack: Rack) {
    setSelectedRack(rack);

    setView("boxes");
  }

  function openBox(box: Box) {
    setSelectedBox(box);

    setView("files");
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

  return (
    <div className="space-y-10">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
        <div>
          <p className="text-cyan-500 text-[11px] font-black uppercase tracking-[0.3em] mb-3">
            Smart Archive Dashboard
          </p>

          <h1 className="text-5xl font-black tracking-tight text-slate-900 dark:text-white">
            Digital Archive
          </h1>
        </div>
        

        <div className="flex items-center gap-4">
          {view !== "divisions" && (
            <button
              onClick={handleBack}
              className="w-14 h-14 rounded-2xl bg-white dark:bg-[#081028] border border-slate-200 dark:border-slate-800 flex items-center justify-center hover:scale-105 transition-all"
            >
              <ArrowLeft size={22} />
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
              placeholder="Search..."
              className="w-[300px] h-14 pl-14 pr-5 rounded-2xl bg-white dark:bg-[#081028] border border-slate-200 dark:border-slate-800 outline-none font-bold"
            />
          </div>
        </div>
      </div>
      <nav className="flex items-center gap-2 overflow-x-auto">
  <button
    onClick={() => {
      setView("divisions");
      setSearch("");
    }}
    className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all ${
      view === "divisions"
        ? "bg-cyan-500 text-white"
        : "bg-white dark:bg-[#081028] text-slate-500 border border-slate-200 dark:border-slate-800"
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

      {loading ? (
        <div className="flex flex-col items-center justify-center py-40 gap-4">
          <Loader2 className="animate-spin text-cyan-500" size={42} />

          <p className="text-[11px] uppercase tracking-[0.3em] font-black text-slate-300">
            Loading Data
          </p>
        </div>
      ) : (
        <>
          <motion.div
            layout
            className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6"
          >
            {view === "divisions" &&
              filteredDivisions.map((d, i) => (
                <Card
                  key={d}
                  icon={Building2}
                  title={d}
                  subtitle="Division"
                  accent={ACCENTS[i % ACCENTS.length]}
                  onClick={() => openDivision(d)}
                />
              ))}

            {view === "racks" &&
              filteredRacks.map((r, i) => (
                <Card
                  key={r.id}
                  icon={Server}
                  title={r.kode_rack}
                  subtitle={r.status || "Rack"}
                  accent={ACCENTS[i % ACCENTS.length]}
                  onClick={() => openRack(r)}
                />
              ))}

            {view === "boxes" &&
              filteredBoxes.map((b, i) => (
                <Card
                  key={b.id}
                  icon={Archive}
                  title={b.name_box}
                  code={b.kode_box}
                  subtitle={b.description}
                  accent={ACCENTS[i % ACCENTS.length]}
                  onClick={() => openBox(b)}
                />
              ))}

            {view === "files" &&
              filteredFiles.map((f, i) => (
                <motion.div
                  key={f.id}
                  initial={{
                    opacity: 0,
                    y: 20,
                  }}
                  animate={{
                    opacity: 1,
                    y: 0,
                  }}
                  className="group p-6 rounded-[2rem] border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#081028] shadow-sm hover:shadow-xl transition-all"
                >
                  <div
                    className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${
                      ACCENTS[i % ACCENTS.length]
                    } text-white flex items-center justify-center mb-5`}
                  >
                    <FileText size={26} />
                  </div>

                  <h3 className="font-black text-slate-800 dark:text-white line-clamp-2">
                    {f.title}
                  </h3>

                  <p className="mt-2 text-sm text-slate-400">
                    Digital Document
                  </p>

                  <div className="grid grid-cols-2 gap-3 mt-6">
                    <button
                      onClick={() => setPreviewFile(f)}
                      className="flex items-center justify-center gap-2 bg-slate-900 hover:bg-cyan-600 text-white py-3 rounded-2xl text-sm font-bold transition-all"
                    >
                      <Eye size={16} />
                      Preview
                    </button>

                    <a
                      href={f.fileUrl}
                      target="_blank"
                      className="flex items-center justify-center gap-2 bg-cyan-500 hover:bg-cyan-400 text-white py-3 rounded-2xl text-sm font-bold transition-all"
                    >
                      <Download size={16} />
                      Download
                    </a>
                  </div>
                </motion.div>
              ))}
          </motion.div>

          {view === "divisions" && (
            <div className="bg-white dark:bg-[#081028] border border-slate-200 dark:border-slate-800 rounded-[2.5rem] p-8 shadow-sm">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 mb-10">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-cyan-100 dark:bg-cyan-500/10 text-cyan-600 flex items-center justify-center">
                    <BarChart3 size={26} />
                  </div>

                  <div>
                    <h2 className="text-2xl font-black text-slate-900 dark:text-white">
                      Incoming Documents
                    </h2>

                    <p className="text-sm text-slate-400">
                      Statistik jumlah dokumen masuk
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
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
                    {
                      key: "3year",
                      label: "3 Tahun",
                    },
                  ].map((item) => (
                    <button
                      key={item.key}
                      onClick={() => setChartRange(item.key as any)}
                      className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                        chartRange === item.key
                          ? "bg-cyan-500 text-white"
                          : "bg-slate-100 dark:bg-slate-900 text-slate-500 dark:text-slate-400"
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
                    <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.1} />

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
                initial={{
                  opacity: 0,
                }}
                animate={{
                  opacity: 1,
                }}
                exit={{
                  opacity: 0,
                }}
                onClick={() => setPreviewFile(null)}
                className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
              >
                <motion.div
                  initial={{
                    scale: 0.95,
                    opacity: 0,
                    y: 20,
                  }}
                  animate={{
                    scale: 1,
                    opacity: 1,
                    y: 0,
                  }}
                  exit={{
                    scale: 0.95,
                    opacity: 0,
                    y: 20,
                  }}
                  onClick={(e) => e.stopPropagation()}
                  className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 w-full max-w-6xl h-[90vh] rounded-[2rem] overflow-hidden shadow-2xl"
                >
                  <div className="h-20 px-6 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-[0.3em] text-cyan-500 mb-1">
                        Document Preview
                      </p>

                      <h2 className="font-black text-slate-800 dark:text-white truncate max-w-[300px]">
                        {previewFile.title}
                      </h2>
                    </div>

                    <button
                      onClick={() => setPreviewFile(null)}
                      className="w-11 h-11 rounded-2xl bg-slate-100 dark:bg-slate-900 hover:bg-slate-200 dark:hover:bg-slate-800 flex items-center justify-center transition-all"
                    >
                      <X size={18} />
                    </button>
                  </div>

                  <div className="w-full h-[calc(100%-80px)] bg-slate-200 dark:bg-slate-800">
                    <iframe
                      src={previewFile.fileUrl}
                      title="Document Preview"
                      className="w-full h-full"
                    />
                  </div>
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
      whileHover={{
        y: -5,
      }}
      whileTap={{
        scale: 0.98,
      }}
      onClick={onClick}
      className="group relative overflow-hidden rounded-[2rem] border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#081028] p-7 text-left shadow-sm hover:shadow-xl transition-all"
    >
      <div
        className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-all bg-gradient-to-br ${accent}`}
      />

      <div className="relative z-10">
        <div
          className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${accent} text-white flex items-center justify-center mb-6`}
        >
          <Icon size={26} />
        </div>

        <h3 className="text-xl font-black text-slate-900 dark:text-white">
          {title}
        </h3>

        {code && (
          <p className="mt-2 text-xs font-black uppercase tracking-[0.2em] text-cyan-500">
            {code}
          </p>
        )}

        <p className="mt-2 text-sm font-medium text-slate-400">
          {subtitle}
        </p>
      </div>
    </motion.button>
  );
}