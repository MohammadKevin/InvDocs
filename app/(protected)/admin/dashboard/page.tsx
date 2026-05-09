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

export default function DashboardPage() {
  const [view, setView] = useState("divisions");
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const [previewOpen, setPreviewOpen] =
    useState(false);

  const [previewFile, setPreviewFile] =
    useState<any>(null);

  const [activeDivision, setActiveDivision] =
    useState<string | null>(null);

  const [activeRack, setActiveRack] =
    useState<any>(null);

  const [activeBox, setActiveBox] =
    useState<any>(null);

  const [allRacks, setAllRacks] =
    useState<any[]>([]);

  const [data, setData] = useState({
    divisions: [],
    racks: [],
    boxes: [],
    files: [],
  });

  useEffect(() => {
    fetchDivisions();
  }, []);

  // =========================
  // FETCH ONLY MY RACKS
  // =========================
  async function fetchDivisions() {
    try {
      setLoading(true);

      // 🔥 endpoint baru
      const res = await api.get("/rack/my");

      const racks =
        res.data?.data || res.data || [];

      setAllRacks(racks);

      const uniqueDivisions = Array.from(
        new Set(
          racks.map(
            (i: any) => i.divisi
          )
        )
      );

      setData((prev) => ({
        ...prev,
        divisions: uniqueDivisions as any,
      }));
    } finally {
      setLoading(false);
    }
  }

  // =========================
  // NAVIGATION
  // =========================
  const navigateTo = async (
    targetView: string,
    item: any
  ) => {
    setLoading(true);

    setSearchTerm("");

    try {
      // =========================
      // DIVISION -> RACKS
      // =========================
      if (targetView === "racks") {
        setActiveDivision(item);

        // 🔥 FILTER DARI RACK MILIK SENDIRI
        const filteredRacks =
          allRacks.filter(
            (r: any) =>
              r.divisi === item
          );

        setData((prev) => ({
          ...prev,
          racks: filteredRacks,
        }));
      }

      // =========================
      // RACK -> BOXES
      // =========================
      else if (
        targetView === "boxes"
      ) {
        setActiveRack(item);

        const res = await api.get(
          "/boxes"
        );

        setData((prev) => ({
          ...prev,
          boxes: (
            res.data?.data || res.data
          ).filter(
            (b: any) =>
              b.rackId === item.id
          ),
        }));
      }

      // =========================
      // BOX -> FILES
      // =========================
      else if (
        targetView === "files"
      ) {
        setActiveBox(item);

        const res = await api.get(
          "/documents"
        );

        setData((prev) => ({
          ...prev,
          files: (
            res.data?.data || res.data
          ).filter(
            (d: any) =>
              d.boxId === item.id
          ),
        }));
      }

      setView(targetView);
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // PREVIEW
  // =========================
  const openPreview = (file: any) => {
    setPreviewFile(file);
    setPreviewOpen(true);
  };

  // =========================
  // DOWNLOAD
  // =========================
  const downloadFile = (
    url: string,
    title: string
  ) => {
    const link =
      document.createElement("a");

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
            <Search
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              size={18}
            />

            <input
              className="pl-12 pr-6 py-4 bg-white border border-slate-200 rounded-[1.5rem] w-full md:w-80 shadow-sm focus:ring-4 focus:ring-blue-50 transition-all outline-none font-bold text-sm"
              placeholder="Filter resources..."
              value={searchTerm}
              onChange={(e) =>
                setSearchTerm(
                  e.target.value
                )
              }
            />
          </div>
        </header>

        {/* BREADCRUMB */}
        <nav className="flex items-center gap-3 p-2 bg-white/50 rounded-2xl w-fit border border-slate-200/60 shadow-sm">
          <button
            onClick={() => {
              setView("divisions");
              fetchDivisions();
            }}
            className="p-2.5 hover:bg-white rounded-xl text-slate-400 hover:text-blue-600 transition-all"
          >
            <Home size={18} />
          </button>

          {activeDivision && (
            <>
              <ChevronRight
                size={14}
                className="text-slate-300"
              />

              <span className="text-xs font-black uppercase text-slate-600 px-2">
                {activeDivision}
              </span>
            </>
          )}

          {view === "boxes" &&
            activeRack && (
              <>
                <ChevronRight
                  size={14}
                  className="text-slate-300"
                />

                <span className="text-xs font-black uppercase text-blue-600 px-3 py-1 bg-white rounded-lg shadow-sm">
                  {activeRack.name_rack}
                </span>
              </>
            )}
        </nav>

        {/* LOADING */}
        {loading ? (
          <div className="py-40 flex flex-col items-center justify-center gap-5">
            <Loader2
              className="animate-spin text-blue-600"
              size={40}
            />

            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400 animate-pulse">
              Fetching Assets...
            </span>
          </div>
        ) : (
          <AnimatePresence mode="wait">
            <motion.div
              key={view}
              initial={{
                opacity: 0,
                y: 10,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              exit={{
                opacity: 0,
                y: -10,
              }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-6"
            >
              {/* DIVISIONS */}
              {view ===
                "divisions" &&
                data.divisions.map(
                  (
                    div,
                    idx
                  ) => (
                    <ResourceCard
                      key={`div-${div}-${idx}`}
                      icon={
                        <Building2 />
                      }
                      title={div}
                      subtitle="Department"
                      onClick={() =>
                        navigateTo(
                          "racks",
                          div
                        )
                      }
                    />
                  )
                )}

              {/* RACKS */}
              {view === "racks" &&
                data.racks.map(
                  (
                    r: any,
                    idx
                  ) => (
                    <ResourceCard
                      key={`rack-${r.id}-${idx}`}
                      icon={<Server />}
                      title={
                        r.name_rack
                      }
                      subtitle={`Status: ${r.status}`}
                      onClick={() =>
                        navigateTo(
                          "boxes",
                          r
                        )
                      }
                    />
                  )
                )}

              {/* BOXES */}
              {view === "boxes" &&
                data.boxes.map(
                  (
                    b: any,
                    idx
                  ) => (
                    <ResourceCard
                      key={`box-${b.id}-${idx}`}
                      icon={<Archive />}
                      title={
                        b.name_box
                      }
                      subtitle={
                        b.kode_box
                      }
                      onClick={() =>
                        navigateTo(
                          "files",
                          b
                        )
                      }
                    />
                  )
                )}

              {/* FILES */}
              {view === "files" &&
                data.files.map(
                  (d: any) => (
                    <div
                      key={d.id}
                      onDoubleClick={() =>
                        openPreview(d)
                      }
                      className="bg-white p-7 rounded-[2.5rem] border border-slate-200/60 shadow-sm flex flex-col gap-6 hover:shadow-2xl hover:shadow-blue-200/40 transition-all group cursor-pointer"
                    >
                      <div className="flex justify-between items-start">
                        <div className="p-4 bg-blue-50 text-blue-600 rounded-2xl group-hover:bg-blue-600 group-hover:text-white transition-all">
                          <FileText
                            size={24}
                          />
                        </div>

                        <span className="px-2.5 py-1 bg-emerald-50 text-emerald-600 text-[9px] font-black uppercase rounded-lg border border-emerald-100">
                          {d.status}
                        </span>
                      </div>

                      <div className="space-y-2">
                        <h4 className="font-black text-slate-900 leading-snug text-lg line-clamp-2">
                          {d.title}
                        </h4>

                        <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">
                          Double click to
                          preview
                        </p>
                      </div>

                      <div className="flex gap-3 mt-auto">
                        <button
                          onClick={() =>
                            openPreview(
                              d
                            )
                          }
                          className="flex-1 py-4 bg-slate-900 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-blue-600 transition-all flex items-center justify-center gap-2"
                        >
                          <Eye
                            size={14}
                          />
                          Preview
                        </button>

                        <button
                          onClick={() =>
                            downloadFile(
                              d.fileUrl,
                              d.title
                            )
                          }
                          className="flex-1 py-4 bg-blue-600 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-blue-700 transition-all flex items-center justify-center gap-2"
                        >
                          <Download
                            size={14}
                          />
                          Download
                        </button>
                      </div>
                    </div>
                  )
                )}
            </motion.div>
          </AnimatePresence>
        )}
      </div>

      {/* PREVIEW MODAL */}
      <AnimatePresence>
        {previewOpen &&
          previewFile && (
            <motion.div
              initial={{
                opacity: 0,
              }}
              animate={{
                opacity: 1,
              }}
              exit={{
                opacity: 0,
              }}
              className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4"
            >
              <motion.div
                initial={{
                  scale: 0.9,
                  opacity: 0,
                }}
                animate={{
                  scale: 1,
                  opacity: 1,
                }}
                exit={{
                  scale: 0.9,
                  opacity: 0,
                }}
                className="w-full max-w-6xl h-[90vh] bg-white rounded-[2rem] overflow-hidden shadow-2xl flex flex-col"
              >
                <div className="flex items-center justify-between px-6 py-5 border-b">
                  <div>
                    <h2 className="font-black text-xl">
                      {
                        previewFile.title
                      }
                    </h2>

                    <p className="text-sm text-slate-400">
                      Document Preview
                    </p>
                  </div>

                  <button
                    onClick={() =>
                      setPreviewOpen(
                        false
                      )
                    }
                    className="w-11 h-11 rounded-xl bg-slate-100 hover:bg-red-500 hover:text-white transition-all flex items-center justify-center"
                  >
                    <X size={20} />
                  </button>
                </div>

                <div className="flex-1 bg-slate-100">
                  <iframe
                    src={previewFile.fileUrl}
                    className="w-full h-full"
                  />
                </div>
              </motion.div>
            </motion.div>
          )}
      </AnimatePresence>
    </>
  );
}

function ResourceCard({
  icon,
  title,
  subtitle,
  onClick,
}: any) {
  return (
    <motion.button
      whileHover={{
        y: -8,
        scale: 1.02,
      }}
      whileTap={{
        scale: 0.98,
      }}
      onClick={onClick}
      className="p-8 bg-white rounded-[2.5rem] border border-slate-200/60 shadow-[0_10px_40px_rgba(0,0,0,0.02)] flex flex-col items-start text-left gap-6 group hover:shadow-[0_25px_60px_rgba(59,130,246,0.12)] hover:border-blue-200 transition-all"
    >
      <div className="p-5 bg-slate-50 text-slate-400 rounded-2xl group-hover:bg-blue-600 group-hover:text-white group-hover:shadow-xl group-hover:shadow-blue-200 transition-all duration-300">
        {React.cloneElement(
          icon as React.ReactElement,
          {
            size: 28,
          }
        )}
      </div>

      <div className="space-y-1">
        <h3 className="font-black text-slate-900 group-hover:text-blue-600 transition-colors text-xl leading-tight truncate w-full">
          {title}
        </h3>

        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
          {subtitle}
        </p>
      </div>

      <div className="mt-2 w-full flex justify-end">
        <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-300 group-hover:bg-blue-600 group-hover:text-white transition-all">
          <ChevronRight
            size={20}
          />
        </div>
      </div>
    </motion.button>
  );
}