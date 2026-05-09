"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Server,
  Archive,
  ChevronRight,
  Home,
  Loader2,
  Search,
  Building2,
  LayoutGrid,
  FileText,
  Download,
  Eye,
  X,
  ArrowLeft,
  ArrowUpRight,
} from "lucide-react";
import { api } from "@/lib/api";

export default function DashboardPage() {
  const [view, setView] = useState<string>("divisions");
  const [loading, setLoading] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [previewOpen, setPreviewOpen] = useState<boolean>(false);
  const [previewFile, setPreviewFile] = useState<any | null>(null);
  const [activeDivision, setActiveDivision] = useState<string | null>(null);
  const [activeRack, setActiveRack] = useState<any | null>(null);
  const [activeBox, setActiveBox] = useState<any | null>(null);
  const [allRacks, setAllRacks] = useState<any[]>([]);
  const [data, setData] = useState<any>({ divisions: [], racks: [], boxes: [], files: [] });

  useEffect(() => { fetchDivisions(); }, []);

  async function fetchDivisions() {
    try {
      setLoading(true);
      const res = await api.get("/rack/my");
      const racks = res.data?.data || res.data || [];
      setAllRacks(racks);
      const uniqueDivisions = Array.from(new Set(racks.map((i: any) => i.divisi)));
      setData((prev: any) => ({ ...prev, divisions: uniqueDivisions }));
    } finally { setLoading(false); }
  }

  const navigateTo = async (targetView: string, item: any) => {
    setLoading(true);
    setSearchTerm("");
    try {
      if (targetView === "racks") {
        setActiveDivision(item);
        setData((prev: any) => ({ ...prev, racks: allRacks.filter((r) => r.divisi === item) }));
      } else if (targetView === "boxes") {
        setActiveRack(item);
        const res = await api.get("/boxes");
        const boxes = res.data?.data || res.data || [];
        setData((prev: any) => ({ ...prev, boxes: boxes.filter((b: any) => b.rackId === item.id) }));
      } else if (targetView === "files") {
        setActiveBox(item);
        const res = await api.get("/documents");
        const files = res.data?.data || res.data || [];
        setData((prev: any) => ({ ...prev, files: files.filter((d: any) => d.boxId === item.id) }));
      }
      setView(targetView);
    } finally { setLoading(false); }
  };

  const handleBack = () => {
    if (view === "files") setView("boxes");
    else if (view === "boxes") setView("racks");
    else if (view === "racks") setView("divisions");
  };

  return (
    <div className="space-y-10">
      <header className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 bg-white p-8 rounded-[3rem] border border-slate-100 shadow-sm">
        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-cyan-600 text-white rounded-full text-[10px] font-bold uppercase tracking-[0.2em]">
            <LayoutGrid size={12} /> Raknesia Explorer
          </div>
          <h1 className="text-5xl font-black text-slate-900 tracking-tight">
            {view === "divisions" ? "Central Archives" : view === "racks" ? activeDivision : view === "boxes" ? activeRack?.name_rack : activeBox?.name_box}
          </h1>
          <p className="text-slate-400 font-medium text-sm flex items-center gap-2">
            <Home size={14} /> / {view}
          </p>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-cyan-600 transition-colors" size={20} />
            <input
              className="pl-12 pr-6 py-4 bg-slate-50 border-none rounded-[2rem] w-full md:w-96 shadow-inner focus:ring-2 focus:ring-cyan-600/10 transition-all outline-none font-bold text-slate-700 text-sm"
              placeholder={`Search in ${view}...`}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          {view !== "divisions" && (
            <button onClick={handleBack} className="p-4 bg-slate-900 text-white rounded-full hover:scale-110 active:scale-95 transition-all shadow-lg">
              <ArrowLeft size={24} />
            </button>
          )}
        </div>
      </header>

      {loading ? (
        <div className="py-40 flex flex-col items-center justify-center gap-6">
          <Loader2 className="animate-spin text-cyan-500" size={60} />
          <span className="text-[12px] font-black uppercase tracking-[0.5em] text-slate-300">Synchronizing...</span>
        </div>
      ) : (
        <AnimatePresence mode="wait">
          <motion.div key={view} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {view === "divisions" && data.divisions.map((div: any) => (
              <ResourceCard key={div} icon={<Building2 size={32} />} title={div} subtitle="Division" onClick={() => navigateTo("racks", div)} />
            ))}
            {view === "racks" && data.racks.map((r: any) => (
              <ResourceCard key={r.id} icon={<Server size={32} />} title={r.name_rack} subtitle={`Status: ${r.status}`} onClick={() => navigateTo("boxes", r)} />
            ))}
            {view === "boxes" && data.boxes.map((b: any) => (
              <ResourceCard key={b.id} icon={<Archive size={32} />} title={b.name_box} subtitle={`Code: ${b.kode_box || b.code}`} onClick={() => navigateTo("files", b)} />
            ))}
            {view === "files" && data.files.map((d: any) => (
              <FileCard key={d.id} doc={d} />
            ))}
          </motion.div>
        </AnimatePresence>
      )}
    </div>
  );
}

function ResourceCard({ icon, title, subtitle, onClick }: any) {
  return (
    <motion.button whileHover={{ y: -10 }} onClick={onClick} className="group p-8 bg-white rounded-[2.5rem] border border-slate-100 shadow-sm flex flex-col gap-6 text-left transition-all hover:shadow-xl hover:border-cyan-200">
      <div className="p-4 bg-cyan-50 text-cyan-600 rounded-2xl group-hover:bg-cyan-500 group-hover:text-white transition-all w-fit">{icon}</div>
      <div>
        <h3 className="text-xl font-black text-slate-900 group-hover:text-cyan-600 transition-colors">{title}</h3>
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{subtitle}</p>
      </div>
    </motion.button>
  );
}

function FileCard({ doc }: any) {
  return (
    <motion.div whileHover={{ y: -10 }} className="group bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-xl transition-all">
      <div className="p-4 bg-cyan-50 text-cyan-600 rounded-2xl w-fit mb-4"><FileText size={24} /></div>
      <h4 className="font-black text-slate-900 mb-6 truncate">{doc.title}</h4>
      <div className="grid grid-cols-2 gap-2">
        <button className="bg-slate-900 text-white py-3 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-cyan-600 transition-colors">
          <Eye size={14} /> View
        </button>
        <button className="bg-cyan-50 text-cyan-600 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-cyan-500 hover:text-white transition-colors">
          <Download size={14} /> Get
        </button>
      </div>
    </motion.div>
  );
}