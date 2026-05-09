"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Server, Archive, FileText, ChevronRight, Home, Loader2, 
  Search, Download, HardDrive, Building2, LayoutGrid, ArrowLeft 
} from "lucide-react";
import { api } from "@/lib/api";

// Definisi Tipe Data
type View = "divisions" | "racks" | "boxes" | "files";

export default function DashboardPage() {
  const [view, setView] = useState<View>("divisions");
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  
  // State untuk Hirarki Navigasi
  const [activeDivision, setActiveDivision] = useState<string | null>(null);
  const [activeRack, setActiveRack] = useState<any>(null);
  const [activeBox, setActiveBox] = useState<any>(null);

  // State Penyimpanan Data
  const [data, setData] = useState({
    divisions: [] as string[],
    racks: [] as any[],
    boxes: [] as any[],
    files: [] as any[]
  });

  /* ================= FETCH LOGIC ================= */

  useEffect(() => {
    fetchInitialDivisions();
  }, []);

  async function fetchInitialDivisions() {
    try {
      setLoading(true);
      const res = await api.get("/rack");
      const allData = Array.isArray(res.data) ? res.data : res.data?.data ?? [];
      
      // Ambil divisi unik untuk tampilan awal
      const uniqueDivisions = Array.from(new Set(allData.map((item: any) => item.divisi)));
      setData(prev => ({ ...prev, divisions: uniqueDivisions as string[] }));
    } catch (err) {
      console.error("Failed to fetch divisions", err);
    } finally {
      setLoading(false);
    }
  }

  const navigateTo = async (targetView: View, item: any) => {
    setLoading(true);
    setSearchTerm("");
    try {
      if (targetView === "racks") {
        setActiveDivision(item);
        const res = await api.get(`/rack/divisi/${item}`);
        setData(prev => ({ ...prev, racks: res.data?.data || res.data || [] }));
      } 
      else if (targetView === "boxes") {
        setActiveRack(item);
        const res = await api.get("/boxes");
        const boxList = Array.isArray(res.data) ? res.data : res.data?.data ?? [];
        setData(prev => ({ ...prev, boxes: boxList.filter((b: any) => b.rackId === item.id) }));
      } 
      else if (targetView === "files") {
        setActiveBox(item);
        const res = await api.get("/documents");
        const docList = Array.isArray(res.data) ? res.data : res.data?.data ?? [];
        setData(prev => ({ ...prev, files: docList.filter((d: any) => d.boxId === item.id) }));
      }
      setView(targetView);
    } catch (err) {
      console.error(`Navigation to ${targetView} failed`, err);
    } finally {
      setLoading(false);
    }
  };

  const resetToHome = () => {
    setView("divisions");
    setActiveDivision(null);
    setActiveRack(null);
    setActiveBox(null);
    fetchInitialDivisions();
  };

  /* ================= UI RENDER ================= */

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* HEADER & SEARCH */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
            <div className="p-2 bg-blue-600 rounded-xl text-white shadow-lg shadow-blue-100">
              <LayoutGrid size={20} />
            </div>
            Archive Navigator
          </h1>
          <p className="text-slate-500 font-medium">PT. Gudang Baru Berkah Inventory System</p>
        </div>

        <div className="relative group w-full md:w-80">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors" size={18} />
          <input 
            type="text"
            placeholder={`Search ${view}...`}
            className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-50 focus:border-blue-200 outline-none transition-all font-bold text-sm shadow-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </header>

      {/* BREADCRUMB NAVIGATION */}
      <nav className="flex items-center gap-2 p-1.5 bg-white border border-slate-200 rounded-2xl w-fit shadow-sm overflow-x-auto max-w-full">
        <button onClick={resetToHome} className="p-2 hover:bg-slate-50 rounded-xl text-slate-400 hover:text-blue-600 transition-all">
          <Home size={18} />
        </button>
        
        {activeDivision && (
          <>
            <ChevronRight size={14} className="text-slate-300 shrink-0" />
            <button onClick={() => setView("racks")} className={`px-3 py-1.5 rounded-lg text-xs font-black uppercase tracking-wider transition-all ${view === "racks" ? "bg-blue-600 text-white shadow-md shadow-blue-100" : "text-slate-600 hover:bg-slate-50"}`}>
              {activeDivision}
            </button>
          </>
        )}

        {activeRack && view !== "racks" && (
          <>
            <ChevronRight size={14} className="text-slate-300 shrink-0" />
            <button onClick={() => setView("boxes")} className={`px-3 py-1.5 rounded-lg text-xs font-black uppercase tracking-wider transition-all ${view === "boxes" ? "bg-blue-600 text-white shadow-md shadow-blue-100" : "text-slate-600 hover:bg-slate-50"}`}>
              {activeRack.name_rack}
            </button>
          </>
        )}

        {activeBox && view === "files" && (
          <>
            <ChevronRight size={14} className="text-slate-300 shrink-0" />
            <span className="px-3 py-1.5 bg-blue-600 text-white rounded-lg text-xs font-black uppercase tracking-wider shadow-md shadow-blue-100">
              {activeBox.name_box}
            </span>
          </>
        )}
      </nav>

      {/* MAIN CONTENT AREA */}
      <div className="relative min-h-[400px]">
        {loading ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
            <Loader2 className="animate-spin text-blue-600" size={40} />
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 animate-pulse">Syncing Resources...</p>
          </div>
        ) : (
          <AnimatePresence mode="wait">
            <motion.div 
              key={view}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-6"
            >
              {/* VIEW: DIVISIONS */}
              {view === "divisions" && data.divisions.map((div, idx) => (
                <ResourceCard 
                  key={`div-${div}-${idx}`} 
                  icon={<Building2 />} 
                  title={div} 
                  subtitle="Division" 
                  onClick={() => navigateTo("racks", div)} 
                />
              ))}

              {/* VIEW: RACKS */}
              {view === "racks" && data.racks.map((rack, idx) => (
                <ResourceCard 
                  key={`rack-${rack.id}-${idx}`} 
                  icon={<Server />} 
                  title={rack.name_rack} 
                  subtitle={`Status: ${rack.status}`} 
                  onClick={() => navigateTo("boxes", rack)} 
                />
              ))}

              {/* VIEW: BOXES */}
              {view === "boxes" && data.boxes.map((box, idx) => (
                <ResourceCard 
                  key={`box-${box.id}-${idx}`} 
                  icon={<Archive />} 
                  title={box.name_box} 
                  subtitle={box.kode_box || "Standard Container"} 
                  onClick={() => navigateTo("files", box)} 
                />
              ))}

              {/* VIEW: FILES */}
              {view === "files" && (
                data.files.length === 0 ? (
                  <div className="col-span-full py-20 text-center text-slate-400 font-bold italic">No documents found in this box.</div>
                ) : (
                  data.files.map((file) => (
                    <div key={file.id} className="bg-white p-6 rounded-[2.5rem] border border-slate-200 shadow-sm flex flex-col gap-4 group hover:shadow-xl hover:shadow-blue-500/10 transition-all">
                      <div className="flex justify-between items-start">
                        <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl group-hover:bg-blue-600 group-hover:text-white transition-all">
                          <FileText size={24} />
                        </div>
                        <span className={`px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest ${file.status === 'approved' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-amber-50 text-amber-600 border border-amber-100'}`}>
                          {file.status}
                        </span>
                      </div>
                      <div>
                        <h4 className="font-black text-slate-900 leading-tight line-clamp-2 uppercase italic tracking-tighter">{file.title}</h4>
                        <p className="text-[10px] text-slate-400 mt-1 font-bold">{new Date(file.createdAt).toLocaleDateString()}</p>
                      </div>
                      <button 
                        onClick={() => window.open(file.fileUrl, '_blank')}
                        className="mt-auto w-full py-3.5 bg-slate-900 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-blue-600 transition-all flex items-center justify-center gap-2"
                      >
                        <Download size={14} /> Open Archive
                      </button>
                    </div>
                  ))
                )
              )}
            </motion.div>
          </AnimatePresence>
        )}
      </div>
    </div>
  );
}

/* ================= COMPONENT ATOM ================= */

function ResourceCard({ icon, title, subtitle, onClick }: any) {
  return (
    <motion.button
      whileHover={{ y: -8, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className="p-8 bg-white rounded-[2.5rem] border border-slate-200 shadow-[0_8px_30px_rgb(0,0,0,0.02)] flex flex-col items-start text-left gap-6 group hover:shadow-xl hover:shadow-blue-500/10 hover:border-blue-200 transition-all"
    >
      <div className="p-4 bg-slate-50 text-slate-400 rounded-2xl group-hover:bg-blue-600 group-hover:text-white group-hover:shadow-lg group-hover:shadow-blue-200 transition-all duration-300">
        {React.cloneElement(icon as React.ReactElement, { size: 28 })}
      </div>
      <div className="space-y-1">
        <h3 className="font-black text-slate-900 group-hover:text-blue-600 transition-colors text-xl leading-tight truncate w-full uppercase italic tracking-tighter">
          {title}
        </h3>
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
          {subtitle}
        </p>
      </div>
      <div className="mt-2 w-full flex justify-end">
        <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-300 group-hover:bg-blue-600 group-hover:text-white transition-all group-hover:rotate-[-45deg]">
          <ChevronRight size={20} />
        </div>
      </div>
    </motion.button>
  );
}