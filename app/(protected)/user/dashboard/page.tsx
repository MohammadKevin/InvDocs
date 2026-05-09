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
} from "lucide-react";
import { api } from "@/lib/api";

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
  return `https://docs.google.com/viewer?url=${encodeURIComponent(fileUrl)}&embedded=true`;
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

const VIEW_META: Record<View, { icon: React.ElementType; accent: string; iconBg: string; grad: string }> = {
  divisions: { icon: Building2, accent: "text-violet-600", iconBg: "bg-violet-50",  grad: "from-violet-400 to-indigo-400" },
  racks:     { icon: Server,    accent: "text-cyan-600",   iconBg: "bg-cyan-50",    grad: "from-cyan-400 to-teal-400"    },
  boxes:     { icon: Archive,   accent: "text-amber-600",  iconBg: "bg-amber-50",   grad: "from-amber-400 to-orange-400" },
  files:     { icon: FileText,  accent: "text-emerald-600",iconBg: "bg-emerald-50", grad: "from-emerald-400 to-teal-400" },
};

function Card({
  icon: Icon, title, subtitle, accent, iconBg, grad, onClick,
}: {
  icon: React.ElementType; title: string; subtitle: string;
  accent: string; iconBg: string; grad: string; onClick: () => void;
}) {
  return (
    <motion.button
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      whileTap={{ scale: 0.97 }}
      onClick={onClick}
      className="group relative bg-white rounded-3xl border border-slate-100 shadow-sm hover:shadow-lg hover:border-transparent flex flex-col gap-5 text-left w-full overflow-hidden transition-all duration-200"
    >
      {/* top accent bar */}
      <div className={`h-1.5 w-full bg-gradient-to-r ${grad} opacity-0 group-hover:opacity-100 transition-opacity duration-200`} />

      <div className="px-6 pb-6 flex flex-col gap-4">
        <div className={`w-12 h-12 ${iconBg} ${accent} rounded-2xl flex items-center justify-center transition-transform duration-200 group-hover:scale-110`}>
          <Icon size={22} />
        </div>
        <div className="flex-1">
          <h3 className="font-bold text-slate-800 text-base leading-snug truncate group-hover:text-slate-900">{title}</h3>
          <p className="text-[11px] text-slate-400 mt-1 font-semibold uppercase tracking-wider">{subtitle}</p>
        </div>
        <div className={`self-end opacity-0 group-hover:opacity-100 transition-all duration-200 translate-x-1 group-hover:translate-x-0 ${accent}`}>
          <ChevronRight size={16} />
        </div>
      </div>
    </motion.button>
  );
}

function FileCard({ file, onPreview, onDownload }: { file: FileDoc; onPreview: () => void; onDownload: () => void }) {
  const ext = getFileExt(file.fileUrl).toUpperCase() || "FILE";
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className="group bg-white rounded-3xl border border-slate-100 shadow-sm hover:shadow-lg hover:border-transparent overflow-hidden flex flex-col transition-all duration-200"
    >
      <div className="h-1.5 w-full bg-gradient-to-r from-emerald-400 to-teal-400" />
      <div className="p-5 flex flex-col gap-4 flex-1">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center shrink-0 group-hover:bg-emerald-100 transition-colors">
            <FileText size={18} />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-slate-800 text-sm leading-snug line-clamp-2">{file.title}</h3>
            <span className="inline-block mt-1.5 px-2 py-0.5 bg-slate-100 text-slate-500 text-[10px] font-black uppercase rounded-md tracking-widest">
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
            className="flex items-center justify-center px-3 py-2.5 bg-slate-100 text-slate-600 rounded-xl hover:bg-slate-200 transition-colors"
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

  useEffect(() => { fetchInitial(); }, []);

  async function fetchInitial() {
    try {
      setLoading(true);
      const res = await api.get("/rack");
      const data: Rack[] = res.data?.data || res.data || [];
      setAllRacks(data);
      setDivisions([...new Set(data.map((r) => r.divisi))]);
    } finally { setLoading(false); }
  }

  const handleBack = () => {
    setSearchTerm("");
    if (view === "files") setView("boxes");
    else if (view === "boxes") setView("racks");
    else if (view === "racks") setView("divisions");
  };

  const filteredDivisions = divisions.filter((d) => d.toLowerCase().includes(searchTerm.toLowerCase()));
  const filteredRacks = allRacks.filter((r) => r.divisi === activeDivision && r.name_rack.toLowerCase().includes(searchTerm.toLowerCase()));
  const filteredBoxes = boxes.filter((b) => b.name_box.toLowerCase().includes(searchTerm.toLowerCase()));
  const filteredFiles = documents.filter((f) => f.title.toLowerCase().includes(searchTerm.toLowerCase()));

  const openDivision = (div: string) => { setActiveDivision(div); setSearchTerm(""); setView("racks"); };
  const openRack = async (rack: Rack) => {
    setActiveRack(rack); setSearchTerm(""); setLoading(true);
    try {
      const res = await api.get("/boxes");
      const data: Box[] = res.data?.data || res.data || [];
      setBoxes(data.filter((b) => b.rackId === rack.id));
      setView("boxes");
    } finally { setLoading(false); }
  };
  const openBox = async (box: Box) => {
    setActiveBox(box); setSearchTerm(""); setLoading(true);
    try {
      const res = await api.get("/documents");
      const data: FileDoc[] = res.data?.data || res.data || [];
      setDocuments(data.filter((d) => d.boxId === box.id));
      setView("files");
    } finally { setLoading(false); }
  };

  const crumbs = [
    { label: "Divisions", onClick: () => { setView("divisions"); setSearchTerm(""); } },
    ...(activeDivision && view !== "divisions" ? [{ label: activeDivision, onClick: () => { setView("racks"); setSearchTerm(""); } }] : []),
    ...(activeRack && (view === "boxes" || view === "files") ? [{ label: activeRack.name_rack, onClick: () => { setView("boxes"); setSearchTerm(""); } }] : []),
    ...(activeBox && view === "files" ? [{ label: activeBox.name_box, onClick: () => {} }] : []),
  ];

  const meta = VIEW_META[view];
  const ViewIcon = meta.icon;

  const isEmpty =
    (view === "divisions" && filteredDivisions.length === 0) ||
    (view === "racks" && filteredRacks.length === 0) ||
    (view === "boxes" && filteredBoxes.length === 0) ||
    (view === "files" && filteredFiles.length === 0);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">

      {/* HEADER */}
      <header className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          {/* Title */}
          <div className="space-y-1.5">
            <p className={`flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.2em] ${meta.accent}`}>
              <LayoutGrid size={12} /> Digital Archive
            </p>
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 ${meta.iconBg} ${meta.accent} rounded-2xl flex items-center justify-center shrink-0`}>
                <ViewIcon size={20} />
              </div>
              <h1 className="text-3xl font-black text-slate-900 tracking-tight leading-none">
                {view === "divisions" && "Divisions"}
                {view === "racks" && activeDivision}
                {view === "boxes" && activeRack?.name_rack}
                {view === "files" && activeBox?.name_box}
              </h1>
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-2 shrink-0">
            <div className="relative group">
              <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-cyan-500 transition-colors" />
              <input
                className="pl-9 pr-8 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-400 outline-none transition-all w-48"
                placeholder={`Search ${view}...`}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              {searchTerm && (
                <button onClick={() => setSearchTerm("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-300 hover:text-slate-500 transition-colors">
                  <X size={13} />
                </button>
              )}
            </div>
            {view !== "divisions" && (
              <button
                onClick={handleBack}
                className="flex items-center gap-1.5 px-4 py-2.5 bg-slate-900 text-white text-sm font-bold rounded-xl hover:bg-cyan-600 transition-colors"
              >
                <ArrowLeft size={15} /> Back
              </button>
            )}
          </div>
        </div>

        {/* Breadcrumb */}
        {view !== "divisions" && (
          <nav className="flex items-center gap-1 text-xs flex-wrap">
            {crumbs.map((c, i) => (
              <React.Fragment key={i}>
                {i > 0 && <ChevronRight size={11} className="text-slate-300" />}
                <button
                  onClick={c.onClick}
                  className={`font-semibold transition-colors ${i === crumbs.length - 1 ? "text-slate-700 pointer-events-none" : "text-slate-400 hover:text-cyan-600"}`}
                >
                  {c.label}
                </button>
              </React.Fragment>
            ))}
          </nav>
        )}
      </header>

      {/* CONTENT */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-40 gap-3">
          <Loader2 className={`animate-spin ${meta.accent}`} size={34} />
          <p className="text-[10px] font-black uppercase tracking-[0.25em] text-slate-400">Loading...</p>
        </div>
      ) : (
        <AnimatePresence mode="wait">
          <motion.div
            key={view}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.15 }}
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5"
          >
            {view === "divisions" && filteredDivisions.map((d) => (
              <Card key={d} icon={Building2} title={d} subtitle="Division"
                accent={VIEW_META.divisions.accent} iconBg={VIEW_META.divisions.iconBg} grad={VIEW_META.divisions.grad}
                onClick={() => openDivision(d)} />
            ))}
            {view === "racks" && filteredRacks.map((r) => (
              <Card key={r.id} icon={Server} title={r.name_rack} subtitle={r.status || "Rack"}
                accent={VIEW_META.racks.accent} iconBg={VIEW_META.racks.iconBg} grad={VIEW_META.racks.grad}
                onClick={() => openRack(r)} />
            ))}
            {view === "boxes" && filteredBoxes.map((b) => (
              <Card key={b.id} icon={Archive} title={b.name_box} subtitle={b.kode_box || "Box"}
                accent={VIEW_META.boxes.accent} iconBg={VIEW_META.boxes.iconBg} grad={VIEW_META.boxes.grad}
                onClick={() => openBox(b)} />
            ))}
            {view === "files" && filteredFiles.map((f) => (
              <FileCard key={f.id} file={f}
                onPreview={() => setPreviewFile(f)}
                onDownload={() => handleDownload(f.fileUrl, f.title)} />
            ))}

            {isEmpty && (
              <div className="col-span-4 py-32 flex flex-col items-center gap-3 text-slate-300">
                <Search size={30} />
                <p className="text-xs font-black uppercase tracking-widest">No results found</p>
                {searchTerm && (
                  <button onClick={() => setSearchTerm("")} className="text-[11px] text-cyan-500 font-bold hover:underline">
                    Clear search
                  </button>
                )}
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      )}

      {/* PREVIEW MODAL */}
      <AnimatePresence>
        {previewFile && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-6 z-50"
            onClick={() => setPreviewFile(null)}
          >
            <motion.div
              initial={{ scale: 0.94, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.94, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 28 }}
              className="bg-white w-full max-w-5xl h-[88vh] rounded-3xl overflow-hidden flex flex-col shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center px-6 py-4 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center">
                    <FileText size={16} />
                  </div>
                  <div>
                    <h2 className="font-bold text-slate-800 text-sm truncate max-w-xs">{previewFile.title}</h2>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                      {getFileExt(previewFile.fileUrl).toUpperCase()}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleDownload(previewFile.fileUrl, previewFile.title)}
                    className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-cyan-600 transition-colors"
                  >
                    <Download size={14} /> Download
                  </button>
                  <button
                    onClick={() => setPreviewFile(null)}
                    className="p-2 hover:bg-slate-100 rounded-xl transition-colors text-slate-400"
                  >
                    <X size={18} />
                  </button>
                </div>
              </div>

              <div className="flex-1 bg-slate-50 overflow-auto flex items-center justify-center">
                {isImage(previewFile.fileUrl) ? (
                  <img src={previewFile.fileUrl} alt={previewFile.title} className="max-w-full max-h-full object-contain p-6" />
                ) : (
                  <iframe src={getPreviewUrl(previewFile.fileUrl)} className="w-full h-full border-none" title="Document Preview" />
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}