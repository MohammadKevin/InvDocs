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
} from "lucide-react";

import { api } from "@/lib/api";

/* =========================
   TYPES
========================= */

type Division = string;

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

type DataState = {
  divisions: Division[];
  racks: Rack[];
  boxes: Box[];
  files: FileDoc[];
};

export default function DashboardPage() {
  const [view, setView] = useState<string>("divisions");
  const [loading, setLoading] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState<string>("");

  const [previewOpen, setPreviewOpen] = useState<boolean>(false);
  const [previewFile, setPreviewFile] = useState<FileDoc | null>(null);

  const [activeDivision, setActiveDivision] = useState<string | null>(null);
  const [activeRack, setActiveRack] = useState<Rack | null>(null);
  const [activeBox, setActiveBox] = useState<Box | null>(null);

  const [allRacks, setAllRacks] = useState<Rack[]>([]);

  const [data, setData] = useState<DataState>({
    divisions: [],
    racks: [],
    boxes: [],
    files: [],
  });

  useEffect(() => {
    fetchDivisions();
  }, []);

  /* =========================
     FETCH DIVISIONS / RACKS
  ========================= */
  async function fetchDivisions() {
    try {
      setLoading(true);

      const res = await api.get("/rack/my");
      const racks: Rack[] = res.data?.data || res.data || [];

      setAllRacks(racks);

      const uniqueDivisions: string[] = Array.from(
        new Set(racks.map((i) => i.divisi))
      );

      setData((prev) => ({
        ...prev,
        divisions: uniqueDivisions,
      }));
    } finally {
      setLoading(false);
    }
  }

  /* =========================
     NAVIGATION
  ========================= */
  const navigateTo = async (targetView: string, item: any) => {
    setLoading(true);
    setSearchTerm("");

    try {
      if (targetView === "racks") {
        setActiveDivision(item);

        const filteredRacks = allRacks.filter(
          (r) => r.divisi === item
        );

        setData((prev) => ({
          ...prev,
          racks: filteredRacks,
        }));
      } 
      
      else if (targetView === "boxes") {
        setActiveRack(item);

        const res = await api.get("/boxes");
        const boxes: Box[] = res.data?.data || res.data || [];

        setData((prev) => ({
          ...prev,
          boxes: boxes.filter((b) => b.rackId === item.id),
        }));
      } 
      
      else if (targetView === "files") {
        setActiveBox(item);

        const res = await api.get("/documents");
        const files: FileDoc[] = res.data?.data || res.data || [];

        setData((prev) => ({
          ...prev,
          files: files.filter((d) => d.boxId === item.id),
        }));
      }

      setView(targetView);
    } finally {
      setLoading(false);
    }
  };

  /* =========================
     PREVIEW
  ========================= */
  const openPreview = (file: FileDoc) => {
    setPreviewFile(file);
    setPreviewOpen(true);
  };

  /* =========================
     DOWNLOAD
  ========================= */
  const downloadFile = (url: string, title: string) => {
    const link = document.createElement("a");
    link.href = url;
    link.download = title;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <>
      <div className="space-y-10">
        {/* HEADER */}
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-[10px] font-black uppercase tracking-widest">
              <LayoutGrid size={12} />
              Resource Navigator
            </div>

            <h1 className="text-4xl font-black text-slate-900 tracking-tighter">
              Inventory Station
            </h1>
          </div>

          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />

            <input
              className="pl-12 pr-6 py-4 bg-white border border-slate-200 rounded-[1.5rem] w-full md:w-80 shadow-sm focus:ring-4 focus:ring-blue-50 transition-all outline-none font-bold text-sm"
              placeholder="Filter resources..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </header>

        {/* LOADING */}
        {loading ? (
          <div className="py-40 flex flex-col items-center justify-center gap-5">
            <Loader2 className="animate-spin text-blue-600" size={40} />
            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400 animate-pulse">
              Fetching Assets...
            </span>
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
              {/* DIVISIONS */}
              {view === "divisions" &&
                data.divisions.map((div, idx) => (
                  <ResourceCard
                    key={idx}
                    icon={<Building2 />}
                    title={div}
                    subtitle="Department"
                    onClick={() => navigateTo("racks", div)}
                  />
                ))}

              {/* RACKS */}
              {view === "racks" &&
                data.racks.map((r, idx) => (
                  <ResourceCard
                    key={r.id || idx}
                    icon={<Server />}
                    title={r.name_rack}
                    subtitle={`Status: ${r.status}`}
                    onClick={() => navigateTo("boxes", r)}
                  />
                ))}

              {/* BOXES */}
              {view === "boxes" &&
                data.boxes.map((b, idx) => (
                  <ResourceCard
                    key={b.id || idx}
                    icon={<Archive />}
                    title={b.name_box}
                    subtitle={b.kode_box}
                    onClick={() => navigateTo("files", b)}
                  />
                ))}

              {/* FILES */}
              {view === "files" &&
                data.files.map((d) => (
                  <div
                    key={d.id}
                    onDoubleClick={() => openPreview(d)}
                    className="bg-white p-7 rounded-[2.5rem] border border-slate-200/60 shadow-sm flex flex-col gap-6 cursor-pointer"
                  >
                    <div className="p-4 bg-blue-50 text-blue-600 rounded-2xl">
                      <FileText size={24} />
                    </div>

                    <h4 className="font-black text-slate-900">{d.title}</h4>

                    <div className="flex gap-3 mt-auto">
                      <button onClick={() => openPreview(d)} className="flex-1 bg-slate-900 text-white py-3 rounded-xl">
                        <Eye size={14} /> Preview
                      </button>

                      <button
                        onClick={() => downloadFile(d.fileUrl, d.title)}
                        className="flex-1 bg-blue-600 text-white py-3 rounded-xl"
                      >
                        <Download size={14} /> Download
                      </button>
                    </div>
                  </div>
                ))}
            </motion.div>
          </AnimatePresence>
        )}
      </div>

      {/* PREVIEW */}
      <AnimatePresence>
        {previewOpen && previewFile && (
          <motion.div className="fixed inset-0 bg-black/70 flex items-center justify-center">
            <div className="w-[90%] h-[90%] bg-white rounded-2xl flex flex-col">
              <div className="p-4 flex justify-between border-b">
                <h2 className="font-bold">{previewFile.title}</h2>
                <button onClick={() => setPreviewOpen(false)}>
                  <X />
                </button>
              </div>

              <iframe src={previewFile.fileUrl} className="flex-1 w-full" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

/* =========================
   CARD COMPONENT
========================= */
function ResourceCard({
  icon,
  title,
  subtitle,
  onClick,
}: any) {
  return (
    <button
      onClick={onClick}
      className="p-6 bg-white rounded-2xl border shadow-sm flex flex-col gap-4"
    >
      <div>{icon}</div>
      <h3 className="font-bold">{title}</h3>
      <p className="text-xs text-gray-400">{subtitle}</p>
    </button>
  );
}