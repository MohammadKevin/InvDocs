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
      whileHover={{ y: -5, scale: 1.01 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className="p-6 bg-white rounded-3xl border border-cyan-100 shadow-sm flex flex-col gap-4 text-left w-full hover:shadow-cyan-200/30 hover:border-cyan-400 transition-all"
    >
      <div className="p-3 bg-cyan-50 text-cyan-600 rounded-2xl">
        <Icon size={24} />
      </div>

      <div>
        <h3 className="font-bold text-slate-900 text-lg truncate">
          {title}
        </h3>
        <p className="text-sm text-slate-500">{subtitle}</p>
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

  const handleBack = () => {
    setSearchTerm("");
    if (view === "files") setView("boxes");
    else if (view === "boxes") setView("racks");
    else if (view === "racks") setView("divisions");
  };

  const getBackLabel = () => {
    if (view === "files") return "Back to Boxes";
    if (view === "boxes") return "Back to Racks";
    if (view === "racks") return "Back to Divisions";
    return "";
  };

  const openDivision = (div: string) => {
    setActiveDivision(div);
    setSearchTerm("");
    setView("racks");
  };

  const openRack = async (rack: Rack) => {
    setActiveRack(rack);
    setSearchTerm("");
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
    setSearchTerm("");
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

  const filteredItems = () => {
    const t = searchTerm.toLowerCase();

    if (view === "divisions")
      return divisions.filter((d) => d.toLowerCase().includes(t));

    if (view === "racks")
      return allRacks.filter(
        (r) => r.divisi === activeDivision && r.name_rack.toLowerCase().includes(t)
      );

    if (view === "boxes")
      return boxes.filter((b) => b.name_box.toLowerCase().includes(t));

    if (view === "files")
      return documents.filter((d) => d.title.toLowerCase().includes(t));

    return [];
  };

  const handlePreview = (file: FileDoc) => setPreviewFile(file);
  const closePreview = () => setPreviewFile(null);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-10">

      {/* HEADER */}
      <header className="flex justify-between items-center">
        <div>
          <div className="flex items-center gap-2 text-cyan-600 font-semibold text-sm">
            <LayoutGrid size={16} /> Digital Archive
          </div>

          <h1 className="text-3xl font-black text-slate-900">
            {view === "divisions" && "Divisions"}
            {view === "racks" && activeDivision}
            {view === "boxes" && activeRack?.name_rack}
            {view === "files" && activeBox?.name_box}
          </h1>
        </div>

        <div className="flex gap-3 items-center">
          <input
            className="px-4 py-2 bg-cyan-50 border border-cyan-100 rounded-xl focus:ring-2 focus:ring-cyan-400 outline-none"
            placeholder={`Search ${view}`}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />

          {view !== "divisions" && (
            <button
              onClick={handleBack}
              className="flex items-center gap-2 px-3 py-2 bg-cyan-600 text-white rounded-xl"
            >
              <ArrowLeft size={16} /> {getBackLabel()}
            </button>
          )}
        </div>
      </header>

      {/* CONTENT */}
      {loading ? (
        <div className="flex justify-center py-40">
          <Loader2 className="animate-spin text-cyan-600" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {view === "divisions" && filteredItems().map((d: any) => (
            <Card key={d} icon={Building2} title={d} subtitle="Division" onClick={() => openDivision(d)} />
          ))}

          {view === "racks" && filteredItems().map((r: Rack) => (
            <Card key={r.id} icon={Server} title={r.name_rack} subtitle={r.status || "Rack"} onClick={() => openRack(r)} />
          ))}

          {view === "boxes" && filteredItems().map((b: Box) => (
            <Card key={b.id} icon={Archive} title={b.name_box} subtitle={b.kode_box || "Box"} onClick={() => openBox(b)} />
          ))}

          {view === "files" && filteredItems().map((f: FileDoc) => (
            <div key={f.id} className="p-5 bg-white rounded-2xl border border-cyan-100">
              <FileText className="text-cyan-600" />
              <h3 className="font-bold mt-2">{f.title}</h3>

              <button
                onClick={() => handlePreview(f)}
                className="mt-4 bg-cyan-600 text-white px-4 py-2 rounded-xl flex gap-2"
              >
                <Eye size={16} /> Preview
              </button>
            </div>
          ))}
        </div>
      )}

      {/* PREVIEW MODAL */}
      <AnimatePresence>
        {previewFile && (
          <motion.div
            className="fixed inset-0 bg-black/70 flex items-center justify-center p-6 z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closePreview}
          >
            <div
              className="bg-white w-full max-w-5xl h-[85vh] rounded-2xl overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between p-4 border-b">
                <h2 className="font-bold">{previewFile.title}</h2>
                <button onClick={closePreview}>
                  <X />
                </button>
              </div>

              <div className="h-full">
                {previewFile.fileUrl?.includes(".pdf") ? (
                  <iframe src={previewFile.fileUrl} className="w-full h-full" />
                ) : (
                  <img src={previewFile.fileUrl} className="w-full h-full object-contain" />
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}