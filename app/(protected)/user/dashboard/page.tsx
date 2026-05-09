"use client";

import React, { useEffect, useState } from "react";
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
  Download,
  Search,
  ChevronRight,
  Moon,
  Sun,
} from "lucide-react";
import { api } from "@/lib/api";
import { useTheme } from "next-themes";

type View = "divisions" | "racks" | "boxes" | "files";

type Rack = {
  id: string;
  name_rack: string;
  divisi: string;
  status?: string;
};

type Box = {
  id: string;
  name_box: string;
  kode_box?: string;
  rackId: string;
};

type FileDoc = {
  id: string;
  title: string;
  fileUrl: string;
  boxId: string;
};

const IMAGE_EXTS = ["jpg", "jpeg", "png", "gif", "webp", "bmp", "svg"];

function getFileExt(url: string) {
  return url.split("?")[0].split(".").pop()?.toLowerCase() ?? "";
}

function isImage(url: string) {
  return IMAGE_EXTS.includes(getFileExt(url));
}

function getPreviewUrl(fileUrl: string) {
  if (isImage(fileUrl)) return fileUrl;

  return `https://docs.google.com/viewer?url=${encodeURIComponent(
    fileUrl
  )}&embedded=true`;
}

function handleDownload(fileUrl: string, fileName: string) {
  const link = document.createElement("a");

  link.href = fileUrl;
  link.download = fileName;
  link.target = "_blank";
  link.rel = "noopener noreferrer";

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

const VIEW_META = {
  divisions: {
    icon: Building2,
    accent: "text-violet-500",
    iconBg: "bg-violet-500/10",
    grad: "from-violet-500 to-indigo-500",
  },
  racks: {
    icon: Server,
    accent: "text-cyan-500",
    iconBg: "bg-cyan-500/10",
    grad: "from-cyan-500 to-teal-500",
  },
  boxes: {
    icon: Archive,
    accent: "text-amber-500",
    iconBg: "bg-amber-500/10",
    grad: "from-amber-500 to-orange-500",
  },
  files: {
    icon: FileText,
    accent: "text-emerald-500",
    iconBg: "bg-emerald-500/10",
    grad: "from-emerald-500 to-teal-500",
  },
};

function Card({
  icon: Icon,
  title,
  subtitle,
  accent,
  iconBg,
  grad,
  onClick,
}: any) {
  return (
    <motion.button
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      whileTap={{ scale: 0.97 }}
      onClick={onClick}
      className="group relative bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-xl overflow-hidden flex flex-col gap-5 text-left transition-all duration-300"
    >
      <div
        className={`h-1.5 w-full bg-gradient-to-r ${grad} opacity-0 group-hover:opacity-100 transition-opacity`}
      />

      <div className="px-6 pb-6 flex flex-col gap-4">
        <div
          className={`w-12 h-12 ${iconBg} ${accent} rounded-2xl flex items-center justify-center`}
        >
          <Icon size={22} />
        </div>

        <div className="flex-1">
          <h3 className="font-bold text-slate-800 dark:text-white text-base truncate">
            {title}
          </h3>

          <p className="text-[11px] text-slate-400 mt-1 font-semibold uppercase tracking-wider">
            {subtitle}
          </p>
        </div>

        <div
          className={`self-end opacity-0 group-hover:opacity-100 transition-all ${accent}`}
        >
          <ChevronRight size={16} />
        </div>
      </div>
    </motion.button>
  );
}

function FileCard({
  file,
  onPreview,
  onDownload,
}: {
  file: FileDoc;
  onPreview: () => void;
  onDownload: () => void;
}) {
  const ext = getFileExt(file.fileUrl).toUpperCase() || "FILE";

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className="group bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-xl overflow-hidden flex flex-col transition-all"
    >
      <div className="h-1.5 w-full bg-gradient-to-r from-emerald-500 to-teal-500" />

      <div className="p-5 flex flex-col gap-4 flex-1">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 bg-emerald-500/10 text-emerald-500 rounded-xl flex items-center justify-center">
            <FileText size={18} />
          </div>

          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-slate-800 dark:text-white text-sm line-clamp-2">
              {file.title}
            </h3>

            <span className="inline-block mt-1.5 px-2 py-0.5 bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-300 text-[10px] font-black uppercase rounded-md tracking-widest">
              {ext}
            </span>
          </div>
        </div>

        <div className="flex gap-2 mt-auto">
          <button
            onClick={onPreview}
            className="flex-1 flex items-center justify-center gap-1.5 py-2.5 bg-emerald-600 text-white rounded-xl text-xs font-bold hover:bg-emerald-700 transition-colors"
          >
            <Eye size={14} /> Preview
          </button>

          <button
            onClick={onDownload}
            className="flex items-center justify-center px-3 py-2.5 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-xl hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
          >
            <Download size={14} />
          </button>
        </div>
      </div>
    </motion.div>
  );
}

export default function DashboardPage() {
  const [view, setView] = useState<View>("divisions");
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const [activeDivision, setActiveDivision] = useState<string | null>(null);
  const [activeRack, setActiveRack] = useState<Rack | null>(null);
  const [activeBox, setActiveBox] = useState<Box | null>(null);

  const [allRacks, setAllRacks] = useState<Rack[]>([]);
  const [divisions, setDivisions] = useState<string[]>([]);
  const [boxes, setBoxes] = useState<Box[]>([]);
  const [documents, setDocuments] = useState<FileDoc[]>([]);
  const [previewFile, setPreviewFile] = useState<FileDoc | null>(null);

  const { theme, setTheme } = useTheme();

  useEffect(() => {
    fetchInitial();
  }, []);

  async function fetchInitial() {
    try {
      setLoading(true);

      const res = await api.get("/rack");

      const data: Rack[] = res.data?.data || res.data || [];

      setAllRacks(data);

      setDivisions([...new Set(data.map((r) => r.divisi))]);
    } finally {
      setLoading(false);
    }
  }

  const filteredDivisions = divisions.filter((d) =>
    d.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredRacks = allRacks.filter(
    (r) =>
      r.divisi === activeDivision &&
      r.name_rack.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredBoxes = boxes.filter((b) =>
    b.name_box.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredFiles = documents.filter((f) =>
    f.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const openDivision = (div: string) => {
    setActiveDivision(div);
    setSearchTerm("");
    setView("racks");
  };

  const openRack = async (rack: Rack) => {
    setActiveRack(rack);

    setLoading(true);

    try {
      const res = await api.get("/boxes");

      const data: Box[] = res.data?.data || res.data || [];

      setBoxes(data.filter((b) => b.rackId === rack.id));

      setView("boxes");
    } finally {
      setLoading(false);
    }
  };

  const openBox = async (box: Box) => {
    setActiveBox(box);

    setLoading(true);

    try {
      const res = await api.get("/documents");

      const data: FileDoc[] = res.data?.data || res.data || [];

      setDocuments(data.filter((d) => d.boxId === box.id));

      setView("files");
    } finally {
      setLoading(false);
    }
  };

  const meta = VIEW_META[view];
  const ViewIcon = meta.icon;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#020617] transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">

        {/* HEADER */}
        <header className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
          <div>
            <p
              className={`flex items-center gap-2 text-xs uppercase tracking-[0.2em] font-bold ${meta.accent}`}
            >
              <LayoutGrid size={13} />
              Digital Archive
            </p>

            <div className="flex items-center gap-3 mt-2">
              <div
                className={`w-12 h-12 rounded-2xl flex items-center justify-center ${meta.iconBg} ${meta.accent}`}
              >
                <ViewIcon size={22} />
              </div>

              <h1 className="text-3xl font-black text-slate-900 dark:text-white">
                {view === "divisions" && "Divisions"}
                {view === "racks" && activeDivision}
                {view === "boxes" && activeRack?.name_rack}
                {view === "files" && activeBox?.name_box}
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            {/* SEARCH */}
            <div className="relative">
              <Search
                size={15}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <input
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder={`Search ${view}...`}
                className="pl-10 pr-4 py-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-sm text-slate-800 dark:text-white outline-none focus:ring-4 focus:ring-cyan-500/10 transition-all"
              />
            </div>

            {/* THEME */}
            <button
              onClick={() =>
                setTheme(theme === "dark" ? "light" : "dark")
              }
              className="w-12 h-12 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-300 hover:scale-105 transition-all"
            >
              {theme === "dark" ? (
                <Sun size={18} />
              ) : (
                <Moon size={18} />
              )}
            </button>

            {/* BACK */}
            {view !== "divisions" && (
              <button
                onClick={() => {
                  if (view === "files") setView("boxes");
                  else if (view === "boxes") setView("racks");
                  else if (view === "racks") setView("divisions");
                }}
                className="flex items-center gap-2 px-5 py-3 bg-slate-900 dark:bg-cyan-600 text-white rounded-2xl text-sm font-bold hover:opacity-90 transition-all"
              >
                <ArrowLeft size={16} />
                Back
              </button>
            )}
          </div>
        </header>

        {/* CONTENT */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-40 gap-4">
            <Loader2
              className={`animate-spin ${meta.accent}`}
              size={36}
            />

            <p className="text-xs font-bold uppercase tracking-[0.3em] text-slate-400">
              Loading...
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {view === "divisions" &&
              filteredDivisions.map((d) => (
                <Card
                  key={d}
                  icon={Building2}
                  title={d}
                  subtitle="Division"
                  accent={VIEW_META.divisions.accent}
                  iconBg={VIEW_META.divisions.iconBg}
                  grad={VIEW_META.divisions.grad}
                  onClick={() => openDivision(d)}
                />
              ))}

            {view === "racks" &&
              filteredRacks.map((r) => (
                <Card
                  key={r.id}
                  icon={Server}
                  title={r.name_rack}
                  subtitle={r.status || "Rack"}
                  accent={VIEW_META.racks.accent}
                  iconBg={VIEW_META.racks.iconBg}
                  grad={VIEW_META.racks.grad}
                  onClick={() => openRack(r)}
                />
              ))}

            {view === "boxes" &&
              filteredBoxes.map((b) => (
                <Card
                  key={b.id}
                  icon={Archive}
                  title={b.name_box}
                  subtitle={b.kode_box || "Box"}
                  accent={VIEW_META.boxes.accent}
                  iconBg={VIEW_META.boxes.iconBg}
                  grad={VIEW_META.boxes.grad}
                  onClick={() => openBox(b)}
                />
              ))}

            {view === "files" &&
              filteredFiles.map((f) => (
                <FileCard
                  key={f.id}
                  file={f}
                  onPreview={() => setPreviewFile(f)}
                  onDownload={() =>
                    handleDownload(f.fileUrl, f.title)
                  }
                />
              ))}
          </div>
        )}
      </div>

      {/* MODAL */}
      <AnimatePresence>
        {previewFile && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-6 z-50"
            onClick={() => setPreviewFile(null)}
          >
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              className="bg-white dark:bg-slate-950 w-full max-w-5xl h-[88vh] rounded-3xl overflow-hidden flex flex-col shadow-2xl border border-slate-200 dark:border-slate-800"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center px-6 py-4 border-b border-slate-100 dark:border-slate-800">
                <div>
                  <h2 className="font-bold text-slate-800 dark:text-white">
                    {previewFile.title}
                  </h2>

                  <p className="text-[10px] uppercase tracking-widest text-slate-400 font-bold">
                    {getFileExt(previewFile.fileUrl)}
                  </p>
                </div>

                <button
                  onClick={() => setPreviewFile(null)}
                  className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-rose-500 hover:text-white flex items-center justify-center transition-all"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="flex-1 bg-slate-50 dark:bg-slate-900">
                {isImage(previewFile.fileUrl) ? (
                  <img
                    src={previewFile.fileUrl}
                    alt={previewFile.title}
                    className="w-full h-full object-contain"
                  />
                ) : (
                  <iframe
                    src={getPreviewUrl(previewFile.fileUrl)}
                    className="w-full h-full"
                  />
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}