"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Server,
  Archive,
  FileText,
  ChevronRight,
  Home,
  Building2,
  Loader2,
  MoreVertical,
  Download,
  ArrowLeft,
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

export default function DashboardPage() {
  const [view, setView] = useState<View>("divisions");
  const [loading, setLoading] = useState(true);

  const [activeDivision, setActiveDivision] = useState<string | null>(null);
  const [activeRack, setActiveRack] = useState<Rack | null>(null);
  const [activeBox, setActiveBox] = useState<Box | null>(null);

  const [allRacks, setAllRacks] = useState<Rack[]>([]);
  const [divisions, setDivisions] = useState<string[]>([]);
  const [boxes, setBoxes] = useState<Box[]>([]);
  const [documents, setDocuments] = useState<FileDoc[]>([]);

  useEffect(() => {
    fetchInitialData();
  }, []);

  async function fetchInitialData() {
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

  const navigateBack = () => {
    if (view === "files") setView("boxes");
    else if (view === "boxes") setView("racks");
    else if (view === "racks") setView("divisions");
  };

  const openDivision = (div: string) => {
    setActiveDivision(div);
    setView("racks");
  };

  const openRack = async (rack: Rack) => {
    setActiveRack(rack);
    setLoading(true);
    const res = await api.get("/boxes");
    const data: Box[] = res.data?.data || res.data || [];
    setBoxes(data.filter((b) => b.rackId === rack.id));
    setView("boxes");
    setLoading(false);
  };

  const openBox = async (box: Box) => {
    setActiveBox(box);
    setLoading(true);
    const res = await api.get("/documents");
    const data: FileDoc[] = res.data?.data || res.data || [];
    setDocuments(data.filter((d) => d.boxId === box.id));
    setView("files");
    setLoading(false);
  };

  return (
    <div className="space-y-6">
      {/* Breadcrumbs & Navigation Controller */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm font-medium text-slate-400">
          <button 
            onClick={() => setView("divisions")}
            className="hover:text-cyan-600 transition-colors flex items-center gap-1"
          >
            <Home size={14} /> My Storage
          </button>
          {activeDivision && (
            <>
              <ChevronRight size={14} />
              <button onClick={() => setView("racks")} className="hover:text-cyan-600 transition-colors">
                {activeDivision}
              </button>
            </>
          )}
          {activeRack && view !== "racks" && (
            <>
              <ChevronRight size={14} />
              <button onClick={() => setView("boxes")} className="hover:text-cyan-600 transition-colors">
                {activeRack.name_rack}
              </button>
            </>
          )}
        </div>

        {view !== "divisions" && (
          <button 
            onClick={navigateBack}
            className="flex items-center gap-2 text-xs font-bold text-cyan-600 bg-cyan-50 px-4 py-2 rounded-xl hover:bg-cyan-100 transition-all"
          >
            <ArrowLeft size={14} /> Kembali
          </button>
        )}
      </div>

      <h1 className="text-2xl font-black text-slate-800 tracking-tight">
        {view === "divisions" && "Semua Divisi"}
        {view === "racks" && activeDivision}
        {view === "boxes" && activeRack?.name_rack}
        {view === "files" && activeBox?.name_box}
      </h1>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-32 gap-4">
          <Loader2 className="animate-spin text-cyan-500" size={40} />
          <p className="text-slate-400 font-bold text-xs uppercase tracking-widest animate-pulse">Memuat Data...</p>
        </div>
      ) : (
        <motion.div 
          layout
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4"
        >
          <AnimatePresence mode="popLayout">
            {view === "divisions" && divisions.map((div) => (
              <FolderCard key={div} icon={Building2} title={div} subtitle="Divisi" onClick={() => openDivision(div)} />
            ))}

            {view === "racks" && allRacks.filter(r => r.divisi === activeDivision).map((r) => (
              <FolderCard key={r.id} icon={Server} title={r.name_rack} subtitle={r.status || "Aktif"} onClick={() => openRack(r)} />
            ))}

            {view === "boxes" && boxes.map((b) => (
              <FolderCard key={b.id} icon={Archive} title={b.name_box} subtitle={b.kode_box || "Terkunci"} onClick={() => openBox(b)} />
            ))}

            {view === "files" && documents.map((d) => (
              <FileCard key={d.id} title={d.title} url={d.fileUrl} />
            ))}
          </AnimatePresence>
        </motion.div>
      )}
    </div>
  );
}

function FolderCard({ icon: Icon, title, subtitle, onClick }: any) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      onClick={onClick}
      className="p-5 bg-white border border-slate-200 rounded-[2rem] cursor-pointer group flex items-center gap-4 transition-all hover:border-cyan-200 hover:shadow-xl hover:shadow-cyan-500/5"
    >
      <div className="w-12 h-12 bg-cyan-50 text-cyan-500 rounded-2xl flex items-center justify-center group-hover:bg-cyan-500 group-hover:text-white transition-all">
        <Icon size={24} />
      </div>
      <div className="flex-1 min-w-0">
        <h3 className="font-bold text-slate-800 truncate text-sm">{title}</h3>
        <p className="text-[10px] text-slate-400 uppercase font-black tracking-tighter">{subtitle}</p>
      </div>
      <MoreVertical size={16} className="text-slate-300 opacity-0 group-hover:opacity-100 transition-opacity" />
    </motion.div>
  );
}

function FileCard({ title, url }: any) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-white border border-slate-200 rounded-[2rem] overflow-hidden group hover:border-cyan-400 transition-all shadow-sm"
    >
      <div className="h-32 bg-slate-50 flex items-center justify-center border-b border-slate-100 group-hover:bg-cyan-50/30 transition-colors">
        <FileText size={48} className="text-cyan-100 group-hover:text-cyan-300 transition-colors" />
      </div>
      <div className="p-5 flex items-center justify-between">
        <div className="flex items-center gap-3 min-w-0">
          <FileText size={18} className="text-cyan-500 flex-shrink-0" />
          <span className="text-xs font-bold text-slate-700 truncate">{title}</span>
        </div>
        <button 
          onClick={() => window.open(url, "_blank")}
          className="p-2 bg-cyan-50 text-cyan-600 rounded-xl hover:bg-cyan-500 hover:text-white transition-all"
        >
          <Download size={16} />
        </button>
      </div>
    </motion.div>
  );
}