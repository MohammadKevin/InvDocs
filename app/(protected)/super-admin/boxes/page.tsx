"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Archive, Search, Filter, Loader2, AlertCircle, Calendar, Layers } from "lucide-react";
import { api } from "@/lib/api";

interface Box {
  id: string;
  name_box: string;
  description: string;
  rackId: string;
  rack?: {
    name: string;
  };
  createdAt: string;
}

export default function BoxesPage() {
  const [boxes, setBoxes] = useState<Box[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchBoxes = async () => {
      try {
        setLoading(true);
        const res = await api.get("/boxes");
        setBoxes(res.data);
      } catch (err) {
        console.error("Gagal mengambil data boks:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchBoxes();
  }, []);

  const filteredBoxes = boxes.filter((box) => {
  const search = searchTerm.toLowerCase();

  const name = (box.name_box || "").toLowerCase();
  const description = (box.description || "").toLowerCase();

  return (
    name.includes(search) ||
    description.includes(search)
  );
});

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight uppercase italic">
            Global Box Inventory
          </h1>
          <p className="text-slate-500 text-sm font-medium italic">
            Monitoring all container distributions across registered racks.
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="relative group font-bold">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" size={18} />
            <input 
              type="text" 
              placeholder="Search code or name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-2xl text-sm focus:ring-4 focus:ring-blue-500/10 outline-none w-64 transition-all"
            />
          </div>
          <button className="p-2.5 bg-white border border-slate-200 rounded-2xl text-slate-600 hover:bg-slate-50 transition-all shadow-sm">
            <Filter size={20} />
          </button>
        </div>
      </div>

      {/* Grid Content */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-32 space-y-4">
          <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
          <p className="text-slate-400 font-black uppercase tracking-[0.3em] text-[10px] animate-pulse">
            Syncing Box Records...
          </p>
        </div>
      ) : filteredBoxes.length === 0 ? (
        <div className="bg-white border-2 border-dashed border-slate-200 rounded-[3rem] py-24 text-center">
          <AlertCircle className="w-12 h-12 text-slate-200 mx-auto mb-4" />
          <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">No boxes found in inventory</p>
        </div>
      ) : (
        <motion.div 
          initial="initial"
          animate="animate"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          <AnimatePresence mode="popLayout">
            {filteredBoxes.map((box, i) => (
              <motion.div 
                key={box.id} 
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ delay: i * 0.05 }}
                className="bg-white p-7 rounded-[2.5rem] border border-slate-200 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group relative overflow-hidden"
              >
                {/* Background Decoration */}
                <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity pointer-events-none">
                  <Archive size={120} />
                </div>

                <div className="flex justify-between items-start mb-6">
                  <div className="w-14 h-14 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform duration-500">
                    <Archive size={28} />
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] font-black text-blue-600 bg-blue-50 px-3 py-1 rounded-full uppercase tracking-tighter">
                      Active Asset
                    </span>
                  </div>
                </div>

                <div className="space-y-1 mb-6">
                  <h2 className="text-lg font-bold text-slate-900 tracking-tight">
                    {box.name_box}
                  </h2>
                </div>

                <div className="space-y-3 pt-5 border-t border-slate-50 font-bold">
                  <div className="flex items-center gap-2 text-slate-500 text-xs">
                    <Layers size={14} className="text-slate-300" />
                    <span>Rack:</span>
                    <span className="text-slate-900 italic">{box.rack?.name || "Unassigned"}</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-500 text-xs">
                    <Calendar size={14} className="text-slate-300" />
                    <span>Deployed:</span>
                    <span className="text-slate-900 font-medium">
                      {new Date(box.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      )}
    </div>
  );
}