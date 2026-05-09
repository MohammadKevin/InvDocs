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
} from "lucide-react";

import { api } from "@/lib/api";

/* ================= TYPES ================= */

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

/* ================= CARD ================= */

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
      whileHover={{ y: -8, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className="group p-7 bg-white rounded-[2.5rem] border border-slate-200/60 shadow-sm flex flex-col gap-5 hover:border-blue-200 hover:shadow-xl transition-all"
    >
      <div className="p-4 bg-slate-50 rounded-2xl group-hover:bg-blue-600 text-slate-400 group-hover:text-white transition-all">
        <Icon size={28} />
      </div>

      <div>
        <h3 className="font-black text-slate-900 group-hover:text-blue-600 truncate">
          {title}
        </h3>
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
          {subtitle}
        </p>
      </div>

      <div className="ml-auto text-slate-300 group-hover:text-blue-600 group-hover:rotate-[-45deg] transition-all">
        <ArrowRight size={18} />
      </div>
    </motion.button>
  );
}

/* ================= PAGE ================= */

export default function DashboardPage() {
  const [view, setView] = useState<View>("divisions");
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const [activeDivision, setActiveDivision] = useState<string | null>(null);
  const [activeRack, setActiveRack] = useState<Rack | null>(null);
  const [activeBox, setActiveBox] = useState<Box | null>(null);

  // 🔥 FIX TYPE DI SINI (JANGAN BIAR INFER = never[])
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
    <div className="space-y-8">
      {/* HEADER */}
      <header className="flex justify-between items-end">
        <h1 className="text-3xl font-black flex items-center gap-3">
          <LayoutGrid className="text-blue-600" />
          Archive System
        </h1>

        <div className="relative">
          <Search className="absolute left-3 top-3 text-slate-400" />
          <input
            className="pl-10 pr-4 py-2 border rounded-xl"
            placeholder={`Search ${view}`}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </header>

      {/* LOADING */}
      {loading ? (
        <div className="flex justify-center py-40">
          <Loader2 className="animate-spin text-blue-600" />
        </div>
      ) : (
        <motion.div className="grid grid-cols-4 gap-6">
          {/* DIVISIONS */}
          {view === "divisions" &&
            divisions.map((div) => (
              <Card
                key={div}
                icon={Building2}
                title={div}
                subtitle="Division"
                onClick={() => openDivision(div)}
              />
            ))}

          {/* RACKS */}
          {view === "racks" &&
            allRacks
              .filter((r) => r.divisi === activeDivision)
              .map((r) => (
                <Card
                  key={r.id}
                  icon={Server}
                  title={r.name_rack}
                  subtitle={r.status || "-"}
                  onClick={() => openRack(r)}
                />
              ))}

          {/* BOXES */}
          {view === "boxes" &&
            boxes.map((b) => (
              <Card
                key={b.id}
                icon={Archive}
                title={b.name_box}
                subtitle={b.kode_box || "-"}
                onClick={() => openBox(b)}
              />
            ))}

          {/* FILES */}
          {view === "files" &&
            documents.map((d) => (
              <div key={d.id} className="p-6 bg-white rounded-2xl border">
                <h3 className="font-bold">{d.title}</h3>

                <button
                  onClick={() => window.open(d.fileUrl, "_blank")}
                  className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-xl"
                >
                  Open
                </button>
              </div>
            ))}
        </motion.div>
      )}

      {/* PREVIEW */}
      <AnimatePresence>
        {previewFile && (
          <motion.div className="fixed inset-0 bg-black/70 flex items-center justify-center">
            <div className="bg-white w-[90%] h-[90%] rounded-2xl">
              <button onClick={() => setPreviewFile(null)}>
                <X />
              </button>
              <iframe src={previewFile.fileUrl} className="w-full h-full" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}