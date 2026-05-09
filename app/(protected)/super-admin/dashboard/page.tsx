"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Server,
  Archive,
  FileText,
  ChevronRight,
  Home,
  Search,
  Download,
  Building2,
  LayoutGrid,
  ArrowRight,
  X,
  Eye,
  Loader2,
  ArrowLeft,
  FileSearch,
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
  status?: string;
  boxId: string;
};

function Card({
  icon: Icon,
  title,
  subtitle,
  onClick,
}: {
  icon: React.ElementType;
  title: string;
  subtitle: string;
  onClick: () => void;
}) {
  return (
    <motion.button
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5, scale: 1.01 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className="group relative p-6 bg-white rounded-3xl border border-slate-200/60 shadow-sm flex flex-col gap-4 hover:border-blue-500/30 hover:shadow-xl hover:shadow-blue-500/5 transition-all text-left w-full"
    >
      <div className="flex justify-between items-start">
        <div className="p-3 bg-slate-50 rounded-2xl group-hover:bg-blue-600 group-hover:text-white transition-colors">
          <Icon size={24} />
        </div>
        <div className="text-slate-300 group-hover:text-blue-600 transition-transform group-hover:translate-x-1">
          <ArrowRight size={20} />
        </div>
      </div>

      <div className="mt-2">
        <p className="text-[10px] font-bold text-blue-600 uppercase tracking-widest mb-1 opacity-0 group-hover:opacity-100 transition-opacity">
          Open {subtitle}
        </p>
        <h3 className="font-bold text-slate-900 text-lg leading-tight truncate">
          {title}
        </h3>
        <p className="text-sm font-medium text-slate-500">
          {subtitle}
        </p>
      </div>
    </motion.button>
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

  useEffect(() => {
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
    setSearchTerm(""); // Reset search saat navigasi
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
      const res = await api.get("/boxes");
      const data: Box[] = res.data?.data || res.data || [];
      setBoxes(data.filter((b) => b.rackId === rack.id));
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

  const getFilteredItems = () => {
    const term = searchTerm.toLowerCase();
    if (view === "divisions") return divisions.filter(d => d.toLowerCase().includes(term));
    if (view === "racks") return allRacks.filter(r => r.divisi === activeDivision && r.name_rack.toLowerCase().includes(term));
    if (view === "boxes") return boxes.filter(b => b.name_box.toLowerCase().includes(term));
    if (view === "files") return documents.filter(d => d.title.toLowerCase().includes(term));
    return [];
  };

  const filteredItems = getFilteredItems();

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-10">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-blue-600 font-semibold text-sm">
            <LayoutGrid size={16} />
            <span>Digital Archive v1.0</span>
          </div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">
            {view === "divisions" && "Explore Library"}
            {view === "racks" && activeDivision}
            {view === "boxes" && activeRack?.name_rack}
            {view === "files" && activeBox?.name_box}
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors" size={18} />
            <input
              className="pl-10 pr-4 py-2.5 bg-slate-100 border-none rounded-2xl w-full md:w-64 focus:ring-2 focus:ring-blue-500/20 focus:bg-white transition-all outline-none text-sm"
              placeholder={`Search in ${view}...`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </header>

      <nav className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
        <button 
          onClick={() => {
            setView("divisions");
            setSearchTerm("");
          }}
          className={`flex-shrink-0 flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all ${view === "divisions" ? "bg-blue-600 text-white shadow-lg shadow-blue-200" : "bg-slate-100 text-slate-500 hover:bg-slate-200"}`}
        >
          <Home size={16} /> Root
        </button>
        {view !== "divisions" && (
          <>
            <ChevronRight size={16} className="text-slate-300 flex-shrink-0" />
            <button 
              onClick={handleBack}
              className="flex-shrink-0 flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800 text-white text-sm font-bold hover:bg-slate-700 transition-all shadow-md"
            >
              <ArrowLeft size={16} /> Back
            </button>
          </>
        )}
      </nav>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-40 space-y-4">
          <div className="relative">
            <div className="w-12 h-12 border-4 border-blue-100 rounded-full animate-pulse"></div>
            <Loader2 className="absolute top-0 animate-spin text-blue-600" size={48} />
          </div>
          <p className="text-slate-400 font-medium animate-pulse text-sm">Synchronizing data...</p>
        </div>
      ) : (
        <div className="min-h-[400px]">
          {filteredItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-slate-400 space-y-4">
              <FileSearch size={64} strokeWidth={1} />
              <p className="font-medium">No results found for "{searchTerm}"</p>
            </div>
          ) : (
            <motion.div 
              layout
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
            >
              <AnimatePresence mode="popLayout">
                {view === "divisions" && (filteredItems as string[]).map((div) => (
                  <Card key={div} icon={Building2} title={div} subtitle="Division" onClick={() => openDivision(div)} />
                ))}

                {view === "racks" && (filteredItems as Rack[]).map((r) => (
                  <Card key={r.id} icon={Server} title={r.name_rack} subtitle={r.status || "Active Rack"} onClick={() => openRack(r)} />
                ))}

                {view === "boxes" && (filteredItems as Box[]).map((b) => (
                  <Card key={b.id} icon={Archive} title={b.name_box} subtitle={b.kode_box || "Archive Box"} onClick={() => openBox(b)} />
                ))}

                {view === "files" && (filteredItems as FileDoc[]).map((d) => (
                  <motion.div
                    key={d.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="group p-6 bg-white rounded-3xl border border-slate-200/60 shadow-sm hover:border-blue-500/30 transition-all flex flex-col h-full"
                  >
                    <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl w-fit mb-4 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                      <FileText size={24} />
                    </div>
                    <h3 className="font-bold text-slate-900 mb-6 line-clamp-2 flex-grow">{d.title}</h3>
                    <div className="flex gap-2 mt-auto">
                      <button
                        onClick={() => setPreviewFile(d)}
                        className="flex-1 flex items-center justify-center gap-2 bg-slate-900 text-white py-2.5 rounded-xl text-xs font-bold hover:bg-slate-800 transition-colors"
                      >
                        <Eye size={14} /> Preview
                      </button>
                      <button
                        onClick={() => window.open(d.fileUrl, "_blank")}
                        className="p-2.5 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-600 hover:text-white transition-colors"
                      >
                        <Download size={14} />
                      </button>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          )}
        </div>
      )}

      {/* Modal Preview Tetap Sama */}
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
              className="bg-white w-full max-w-6xl h-[90vh] rounded-[2rem] overflow-hidden flex flex-col shadow-2xl"
            >
              <div className="p-4 border-b flex justify-between items-center bg-white">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                    <FileText size={18} />
                  </div>
                  <span className="font-bold text-slate-800 truncate max-w-[200px] md:max-w-md">{previewFile.title}</span>
                </div>
                <button 
                  onClick={() => setPreviewFile(null)}
                  className="p-2 hover:bg-slate-100 rounded-full transition-colors"
                >
                  <X size={20} />
                </button>
              </div>
              <div className="flex-1 bg-slate-100">
                <iframe src={previewFile.fileUrl} className="w-full h-full border-none" title="Document Preview" />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}