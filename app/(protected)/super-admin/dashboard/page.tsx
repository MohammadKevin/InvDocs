"use client";

import React, { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

import {
  Server,
  Archive,
  FileText,
  ChevronRight,
  Home,
  Search,
  Building2,
  LayoutGrid,
  ArrowRight,
  X,
  Eye,
  Loader2,
  ArrowLeft,
  FileSearch,
  Download,
} from "lucide-react";

import { api } from "@/lib/api";

type View = "divisions" | "racks" | "boxes" | "files";

type Rack = {
  id: string;
  kode_rack: string;
  divisi: string;
  status?: string;
};

type Box = {
  id: string;
  name_box: string;
  kode_box: string;
  description?: string;
  rackId: string;
};

type FileDoc = {
  id: string;
  title: string;
  fileUrl: string;
  status?: string;
  boxId: string;
  createdAt?: string;
};

function Card({
  icon: Icon,
  title,
  subtitle,
  onClick,
}: {
  icon: React.ElementType;
  title: string;
  subtitle: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <motion.button
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5, scale: 1.01 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className="group relative p-6 bg-white dark:bg-[#081028] rounded-3xl border border-slate-200 dark:border-cyan-500/10 shadow-sm flex flex-col gap-4 hover:border-blue-500/30 hover:shadow-xl hover:shadow-blue-500/5 transition-all text-left w-full"
    >
      <div className="flex justify-between items-start">
        <div className="p-3 bg-slate-50 dark:bg-cyan-500/10 rounded-2xl group-hover:bg-blue-600 group-hover:text-white transition-colors">
          <Icon size={24} />
        </div>
        <div className="text-slate-300 group-hover:text-blue-600 transition-transform group-hover:translate-x-1">
          <ArrowRight size={20} />
        </div>
      </div>

      <div className="mt-2">
        <p className="text-[10px] font-bold text-blue-600 uppercase tracking-widest mb-1 opacity-0 group-hover:opacity-100 transition-opacity">
          Open
        </p>

        <h3 className="font-bold text-slate-900 dark:text-white text-lg leading-tight truncate">
          {title}
        </h3>

        <div className="text-sm font-medium text-slate-500 dark:text-slate-400 space-y-1 line-clamp-2">
          {subtitle}
        </div>
      </div>
    </motion.button>
  );
}

const IMAGE_EXTS = ["jpg", "jpeg", "png", "gif", "webp", "bmp", "svg"];

function getFileExt(url: string): string {
  return url.split("?")[0].split(".").pop()?.toLowerCase() ?? "";
}

function isImage(url: string): boolean {
  return IMAGE_EXTS.includes(getFileExt(url));
}

function getPreviewUrl(fileUrl: string): string {
  if (isImage(fileUrl)) return fileUrl;
  return `https://docs.google.com/viewer?url=${encodeURIComponent(fileUrl)}&embedded=true`;
}

function handleDownload(fileUrl: string, fileName: string) {
  const link = document.createElement("a");
  link.href = fileUrl;
  link.download = fileName;
  link.target = "_blank";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
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

  useEffect(() => {
    // eslint-disable-next-line react-hooks/immutability
    fetchInitialData();
  }, []);

  async function fetchInitialData() {
    try {
      setLoading(true);
      const res = await api.get("/rack");
      const data: Rack[] = res.data?.data || res.data || [];
      setAllRacks(data);
      setDivisions(Array.from(new Set(data.map((r) => r.divisi))));
    } finally {
      setLoading(false);
    }
  }

  const handleBack = () => {
    setSearchTerm("");
    if (view === "files") setView("boxes");
    else if (view === "boxes") setView("racks");
    else if (view === "racks") setView("divisions");
  };

  const openDivision = (div: string) => {
    setSearchTerm("");
    setActiveDivision(div);
    setView("racks");
  };

  const openRack = async (rack: Rack) => {
    setSearchTerm("");
    setActiveRack(rack);
    setLoading(true);
    try {
      const res = await api.get(`/boxes/rack/${rack.id}`);
      const data: Box[] = res.data?.data || res.data || [];
      setBoxes(data);
      setView("boxes");
    } finally {
      setLoading(false);
    }
  };

  const openBox = async (box: Box) => {
    setSearchTerm("");
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

  const filteredItems = useMemo(() => {
    const term = searchTerm.toLowerCase().trim();

    if (view === "divisions") {
      return divisions.filter((d) => d.toLowerCase().includes(term));
    }
    if (view === "racks") {
      return allRacks.filter(
        (r) =>
          r.divisi === activeDivision &&
          r.kode_rack?.toLowerCase().includes(term),
      );
    }
    if (view === "boxes") {
      return boxes.filter((b) =>
        `${b.kode_box} ${b.description}`.toLowerCase().includes(term),
      );
    }
    if (view === "files") {
      return documents.filter((d) => d.title?.toLowerCase().includes(term));
    }

    return [];
  }, [searchTerm, view, divisions, allRacks, activeDivision, boxes, documents]);

  // ─── Breadcrumb title ────────────────────────────────────────────────────────
  const pageTitle = {
    divisions: "Explore Library",
    racks: activeDivision ?? "",
    boxes: `${activeRack?.divisi} • ${activeRack?.kode_rack}`,
    files: `${activeRack?.divisi} • ${activeRack?.kode_rack} • ${activeBox?.kode_box}`,
  }[view];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-10">
      {/* ── Header: title + search only ──────────────────────────────────────── */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-cyan-400 font-semibold text-sm">
            <LayoutGrid size={16} />
            <span>Digital Archive</span>
          </div>
          <h1 className="text-4xl font-black tracking-tight text-slate-900 dark:text-white">
            {pageTitle}
          </h1>
        </div>

        {/* Search */}
        <div className="relative group w-full md:w-72">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            size={18}
          />
          <input
            className="pl-10 pr-4 py-3 bg-white dark:bg-[#081028] dark:text-white border border-slate-200 dark:border-cyan-500/10 rounded-2xl w-full outline-none text-sm"
            placeholder={`Search in ${view}...`}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </header>

      {/* ── Breadcrumb nav ────────────────────────────────────────────────────── */}
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

      {/* ── Main content grid ─────────────────────────────────────────────────── */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-40 space-y-4">
          <Loader2 className="animate-spin text-cyan-400" size={48} />
          <p className="text-slate-400 font-medium text-sm">
            Synchronizing data...
          </p>
        </div>
      ) : (
        <div className="min-h-[400px]">
          {filteredItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-slate-400 space-y-4">
              <FileSearch size={64} strokeWidth={1} />
              <p className="font-medium text-center">
                No results found for &quot;{searchTerm}&quot;
              </p>
            </div>
          ) : (
            <motion.div
              layout
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
            >
              <AnimatePresence mode="popLayout">
                {view === "divisions" &&
                  (filteredItems as string[]).map((div) => (
                    <Card
                      key={div}
                      icon={Building2}
                      title={div}
                      subtitle="Division"
                      onClick={() => openDivision(div)}
                    />
                  ))}

                {view === "racks" &&
                  (filteredItems as Rack[]).map((r) => (
                    <Card
                      key={`${r.divisi}-${r.kode_rack}-${r.id}`}
                      icon={Server}
                      title={`${r.divisi} • ${r.kode_rack}`}
                      subtitle={r.status || "Active Rack"}
                      onClick={() => openRack(r)}
                    />
                  ))}

                {view === "boxes" &&
                  (filteredItems as Box[]).map((b) => (
                    <Card
                      key={b.id}
                      icon={Archive}
                      title={b.name_box} // 👈 PALING ATAS (utama)
                      subtitle={
                        <>
                          <div className="font-semibold text-slate-900 dark:text-white">
                            {b.kode_box}
                          </div>
                          <div className="text-sm text-slate-500">
                            {b.description ?? "-"}
                          </div>
                        </>
                      }
                      onClick={() => openBox(b)}
                    />
                  ))}

                {view === "files" &&
                  (filteredItems as FileDoc[]).map((d) => (
                    <motion.div
                      key={d.id}
                      layout
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      className="group p-6 bg-white dark:bg-[#081028] rounded-3xl border border-slate-200 dark:border-cyan-500/10 shadow-sm flex flex-col h-full"
                    >
                      <div className="p-3 bg-cyan-500/10 text-cyan-400 rounded-2xl w-fit mb-4">
                        <FileText size={24} />
                      </div>

                      <h3 className="font-bold mb-6 line-clamp-2 flex-grow text-slate-900 dark:text-white">
                        {d.title}
                      </h3>

                      <div className="flex gap-2 mt-auto">
                        <button
                          onClick={() => setPreviewFile(d)}
                          className="flex-1 flex items-center justify-center gap-2 bg-slate-900 text-white py-2.5 rounded-xl text-xs font-bold"
                        >
                          <Eye size={14} />
                          Preview
                        </button>
                        <button
                          onClick={() => handleDownload(d.fileUrl, d.title)}
                          className="flex-1 flex items-center justify-center gap-2 bg-cyan-500 text-white py-2.5 rounded-xl text-xs font-bold"
                        >
                          <Download size={14} />
                          Download
                        </button>
                      </div>
                    </motion.div>
                  ))}
              </AnimatePresence>
            </motion.div>
          )}
        </div>
      )}

      {/* ── File preview modal ────────────────────────────────────────────────── */}
      <AnimatePresence>
        {previewFile && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-900/90 backdrop-blur-sm flex items-center justify-center z-[100] p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white dark:bg-[#081028] w-full max-w-6xl h-[90vh] rounded-[2rem] overflow-hidden flex flex-col"
            >
              {/* Modal header */}
              <div className="p-4 border-b border-slate-200 dark:border-cyan-500/10 flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-cyan-500/10 text-cyan-400 rounded-lg">
                    <FileText size={18} />
                  </div>
                  <span className="font-bold truncate max-w-[200px] md:max-w-md text-slate-900 dark:text-white">
                    {previewFile.title}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() =>
                      handleDownload(previewFile.fileUrl, previewFile.title)
                    }
                    className="flex items-center gap-2 px-4 py-2 bg-cyan-500 text-white rounded-xl text-sm font-bold"
                  >
                    <Download size={16} />
                    Download
                  </button>
                  <button
                    onClick={() => setPreviewFile(null)}
                    className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full"
                  >
                    <X size={20} />
                  </button>
                </div>
              </div>

              {/* Modal body */}
              <div className="flex-1 bg-slate-100 dark:bg-slate-950 flex items-center justify-center overflow-auto">
                {isImage(previewFile.fileUrl) ? (
                  <img
                    src={previewFile.fileUrl}
                    alt={previewFile.title}
                    className="max-w-full max-h-full object-contain p-4"
                  />
                ) : (
                  <iframe
                    src={getPreviewUrl(previewFile.fileUrl)}
                    className="w-full h-full border-none"
                    title="Document Preview"
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
