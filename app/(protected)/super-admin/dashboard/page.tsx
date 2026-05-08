"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Server,
  Archive,
  FileText,
  ChevronRight,
  Home,
  Loader2,
  Search,
  Download,
  Clock,
  CheckCircle2,
  XCircle,
  User,
  HardDrive,
} from "lucide-react";

import { api } from "@/lib/api";

interface Rack {
  id: string;
  name_rack: string;
  status: "pending" | "active" | "inactive";
  createdAt: string;
}

interface Box {
  id: string;
  kode_box: string;
  name_box: string;
  description?: string;
  rackId?: string;
  createdAt: string;
}

interface DocumentItem {
  id: string;
  title: string;
  description?: string;
  status: "pending" | "approved" | "rejected";
  fileUrl?: string;

  user?: {
    name?: string;
  };

  createdAt: string;
}

type View = "racks" | "boxes" | "files";

const statusConfig = {
  approved: {
    class: "bg-emerald-50 text-emerald-600 border-emerald-100",
    icon: CheckCircle2,
    label: "Approved",
  },

  pending: {
    class: "bg-amber-50 text-amber-600 border-amber-100",
    icon: Clock,
    label: "Pending",
  },

  rejected: {
    class: "bg-red-50 text-red-600 border-red-100",
    icon: XCircle,
    label: "Rejected",
  },
};

function openFile(url: string) {
  window.open(url, "_blank", "noopener,noreferrer");
}

const gridVariants = {
  hidden: {},

  show: {
    transition: {
      staggerChildren: 0.05,
    },
  },
};

const cardVariants = {
  hidden: {
    opacity: 0,
    y: 18,
    scale: 0.96,
  },

  show: {
    opacity: 1,
    y: 0,
    scale: 1,

    transition: {
      duration: 0.28,
      ease: "easeOut",
    },
  },

  exit: {
    opacity: 0,
    y: -10,
    scale: 0.95,

    transition: {
      duration: 0.18,
    },
  },
};

function Breadcrumb({
  view,
  rack,
  box,
  onHome,
  onRack,
}: {
  view: View;
  rack: Rack | null;
  box: Box | null;
  onHome: () => void;
  onRack: () => void;
}) {
  return (
    <nav className="flex items-center gap-1.5 text-xs font-semibold text-slate-400">
      <button
        onClick={onHome}
        className="flex items-center gap-1 hover:text-slate-700 transition-colors"
      >
        <Home size={13} />
        <span>Racks</span>
      </button>

      {(view === "boxes" || view === "files") && rack && (
        <>
          <ChevronRight size={12} className="text-slate-300" />

          <button
            onClick={onRack}
            className="hover:text-slate-700 transition-colors"
          >
            {rack.name_rack}
          </button>
        </>
      )}

      {view === "files" && box && (
        <>
          <ChevronRight size={12} className="text-slate-300" />

          <span className="text-slate-700">
            {box.name_box}
          </span>
        </>
      )}
    </nav>
  );
}

function EmptyState({ label }: { label: string }) {
  return (
    <div className="col-span-full flex flex-col items-center justify-center py-28 text-center">
      <div className="w-16 h-16 rounded-3xl bg-slate-100 flex items-center justify-center mb-4">
        <HardDrive size={28} className="text-slate-300" />
      </div>

      <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">
        {label}
      </p>
    </div>
  );
}

export default function DashboardPage() {
  const [view, setView] = useState<View>("racks");

  const [racks, setRacks] = useState<Rack[]>([]);
  const [boxes, setBoxes] = useState<Box[]>([]);
  const [documents, setDocuments] = useState<DocumentItem[]>([]);

  const [activeRack, setActiveRack] = useState<Rack | null>(null);
  const [activeBox, setActiveBox] = useState<Box | null>(null);

  const [loading, setLoading] = useState(true);

  const [searchTerm, setSearchTerm] = useState("");

  const [clickTimer, setClickTimer] =
    useState<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    fetchRacks();
  }, []);

  async function fetchRacks() {
    try {
      setLoading(true);

      const res = await api.get("/rack");

      const data: Rack[] = Array.isArray(res.data)
        ? res.data
        : res.data?.data ?? [];

      setRacks(data);
    } catch (error: any) {
      console.error("FETCH RACK ERROR");
      console.error("Message:", error.message);
      console.error("Status:", error.response?.status);
      console.error("Data:", error.response?.data);

      setRacks([]);
    } finally {
      setLoading(false);
    }
  }

  function handleRackClick(rack: Rack) {
    if (clickTimer) {
      clearTimeout(clickTimer);
      setClickTimer(null);

      openRack(rack);
    } else {
      const timer = setTimeout(() => {
        setClickTimer(null);
      }, 300);

      setClickTimer(timer);
    }
  }

  function handleBoxClick(box: Box) {
    if (clickTimer) {
      clearTimeout(clickTimer);
      setClickTimer(null);

      openBox(box);
    } else {
      const timer = setTimeout(() => {
        setClickTimer(null);
      }, 300);

      setClickTimer(timer);
    }
  }

  async function openRack(rack: Rack) {
    try {
      setLoading(true);

      setActiveRack(rack);
      setActiveBox(null);
      setView("boxes");

      const res = await api.get("/boxes");

      const data: Box[] = Array.isArray(res.data)
        ? res.data
        : res.data?.data ?? [];

      const rackBoxes = data.filter(
        (box) => box.rackId === rack.id
      );

      setBoxes(rackBoxes);
    } catch (error: any) {
      console.error("FETCH BOX ERROR");
      console.error("Message:", error.message);
      console.error("Status:", error.response?.status);
      console.error("Data:", error.response?.data);

      setBoxes([]);
    } finally {
      setLoading(false);
    }
  }

  async function openBox(box: Box) {
    try {
      setLoading(true);

      setActiveBox(box);
      setView("files");

      const res = await api.get("/documents");

      const data: DocumentItem[] = Array.isArray(res.data)
        ? res.data
        : res.data?.data ?? [];

      const boxDocuments = data.filter(
        (doc: any) => doc.boxId === box.id
      );

      setDocuments(boxDocuments);
    } catch (error: any) {
      console.error("FETCH DOCUMENT ERROR");
      console.error("Message:", error.message);
      console.error("Status:", error.response?.status);
      console.error("Data:", error.response?.data);

      setDocuments([]);
    } finally {
      setLoading(false);
    }
  }

  function goHome() {
    setView("racks");
    setActiveRack(null);
    setActiveBox(null);
    setSearchTerm("");
  }

  function goRack() {
    if (activeRack) {
      openRack(activeRack);
    }
  }

  const kw = searchTerm.toLowerCase();

  const filteredRacks = racks.filter(
    (rack) =>
      rack.name_rack.toLowerCase().includes(kw)
  );

  const filteredBoxes = boxes.filter(
    (box) =>
      box.name_box.toLowerCase().includes(kw) ||
      box.kode_box.toLowerCase().includes(kw)
  );

  const filteredDocs = documents.filter((doc) => {
    const uploader = (
      doc.user?.name ?? ""
    ).toLowerCase();

    return (
      doc.title.toLowerCase().includes(kw) ||
      uploader.includes(kw)
    );
  });

  const viewLabel =
    view === "racks"
      ? "All Racks"
      : view === "boxes"
        ? `Boxes in ${activeRack?.name_rack}`
        : `Files in ${activeBox?.name_box}`;

  const viewCount =
    view === "racks"
      ? filteredRacks.length
      : view === "boxes"
        ? filteredBoxes.length
        : filteredDocs.length;

  return (
    <div className="min-h-screen bg-slate-50/60">
      <div className="max-w-screen-xl mx-auto px-6 py-8 space-y-6">

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <h1 className="text-2xl font-black text-slate-900 tracking-tight uppercase italic flex items-center gap-2">
              <HardDrive size={24} className="text-blue-600" />
              PT. Gudang Baru
            </h1>

            <Breadcrumb
              view={view}
              rack={activeRack}
              box={activeBox}
              onHome={goHome}
              onRack={goRack}
            />
          </div>

          <div className="relative">
            <Search
              size={16}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
            />

            <input
              type="text"
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 pr-4 py-2.5 text-sm font-semibold bg-white border border-slate-200 rounded-2xl outline-none focus:ring-4 focus:ring-blue-500/10 w-64 transition-all"
            />
          </div>
        </div>

        <div className="flex items-center justify-between">
          <p className="text-xs font-black uppercase tracking-widest text-slate-400">
            {viewLabel}

            <span className="ml-2 bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full">
              {viewCount}
            </span>
          </p>

          <p className="text-[10px] text-slate-400 italic">
            Double-click to open
          </p>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-32 gap-4">
            <Loader2 className="w-9 h-9 text-blue-600 animate-spin" />

            <p className="text-[10px] font-black tracking-[0.3em] uppercase text-slate-400 animate-pulse">
              Loading...
            </p>
          </div>
        ) : (
          <AnimatePresence mode="wait">

            {view === "racks" && (
              <motion.div
                key="racks"
                variants={gridVariants}
                initial="hidden"
                animate="show"
                exit="hidden"
                className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4"
              >
                {filteredRacks.length === 0 ? (
                  <EmptyState label="No racks found" />
                ) : (
                  filteredRacks.map((rack) => (
                    <motion.button
                      key={rack.id}
                      variants={cardVariants}
                      onClick={() => handleRackClick(rack)}
                      className="group flex flex-col items-center gap-3 p-5 bg-white border border-slate-200 rounded-3xl shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200"
                    >
                      <div className="w-14 h-14 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-500 group-hover:bg-blue-100 transition-colors">
                        <Server size={28} />
                      </div>

                      <div className="w-full text-center">
                        <p className="text-sm font-black text-slate-800 truncate">
                          {rack.name_rack}
                        </p>

                        <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider mt-0.5">
                          {rack.status}
                        </p>
                      </div>
                    </motion.button>
                  ))
                )}
              </motion.div>
            )}

            {view === "boxes" && (
              <motion.div
                key="boxes"
                variants={gridVariants}
                initial="hidden"
                animate="show"
                exit="hidden"
                className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4"
              >
                {filteredBoxes.length === 0 ? (
                  <EmptyState label="No boxes found" />
                ) : (
                  filteredBoxes.map((box) => (
                    <motion.button
                      key={box.id}
                      variants={cardVariants}
                      onClick={() => handleBoxClick(box)}
                      className="group flex flex-col items-center gap-3 p-5 bg-white border border-slate-200 rounded-3xl shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200"
                    >
                      <div className="w-14 h-14 rounded-2xl bg-amber-50 flex items-center justify-center text-amber-500 group-hover:bg-amber-100 transition-colors">
                        <Archive size={28} />
                      </div>

                      <div className="w-full text-center">
                        <p className="text-sm font-black text-slate-800 truncate">
                          {box.name_box}
                        </p>

                        <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider mt-0.5">
                          {box.kode_box}
                        </p>
                      </div>
                    </motion.button>
                  ))
                )}
              </motion.div>
            )}

            {view === "files" && (
              <motion.div
                key="files"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="bg-white border border-slate-200 rounded-3xl shadow-sm overflow-hidden"
              >
                {filteredDocs.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-24 text-center">
                    <FileText size={44} className="mb-4 text-slate-200" />

                    <p className="text-sm font-black text-slate-400 uppercase tracking-widest">
                      No documents found
                    </p>
                  </div>
                ) : (
                  <table className="w-full text-sm border-collapse">
                    <thead className="border-b border-slate-100 bg-slate-50 text-[10px] font-black tracking-widest uppercase text-slate-400">
                      <tr>
                        <th className="px-6 py-4 text-left">Name</th>
                        <th className="px-6 py-4 text-left">Status</th>
                        <th className="px-6 py-4 text-left">Uploader</th>
                        <th className="px-6 py-4 text-left">Date</th>
                        <th className="px-6 py-4 text-right">File</th>
                      </tr>
                    </thead>

                    <tbody className="divide-y divide-slate-100 text-slate-700 font-semibold">
                      {filteredDocs.map((doc, index) => {
                        const cfg =
                          statusConfig[doc.status] ??
                          statusConfig.pending;

                        const StatusIcon = cfg.icon;

                        return (
                          <motion.tr
                            key={doc.id}
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.03 }}
                            className="hover:bg-slate-50/60 transition-colors"
                          >
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-3">
                                <div className="p-2 rounded-lg bg-slate-100 text-slate-400">
                                  <FileText size={18} />
                                </div>

                                <span className="text-slate-900 font-bold">
                                  {doc.title}
                                </span>
                              </div>
                            </td>

                            <td className="px-6 py-4">
                              <span
                                className={[
                                  "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] uppercase tracking-wider font-black border",
                                  cfg.class,
                                ].join(" ")}
                              >
                                <StatusIcon size={11} />
                                {cfg.label}
                              </span>
                            </td>

                            <td className="px-6 py-4">
                              <div className="flex items-center gap-2 text-slate-500">
                                <User size={13} className="text-slate-300" />

                                <span className="text-xs">
                                  {doc.user?.name ?? "Unknown"}
                                </span>
                              </div>
                            </td>

                            <td className="px-6 py-4 text-xs text-slate-400">
                              {new Date(doc.createdAt).toLocaleDateString(
                                "id-ID",
                                {
                                  day: "numeric",
                                  month: "short",
                                  year: "numeric",
                                }
                              )}
                            </td>

                            <td className="px-6 py-4 text-right">
                              <button
                                disabled={!doc.fileUrl}
                                onClick={() =>
                                  doc.fileUrl && openFile(doc.fileUrl)
                                }
                                className={[
                                  "p-2 rounded-xl transition-all",
                                  doc.fileUrl
                                    ? "bg-blue-600 text-white hover:bg-blue-700"
                                    : "bg-slate-100 text-slate-300 cursor-not-allowed opacity-50",
                                ].join(" ")}
                              >
                                <Download size={16} />
                              </button>
                            </td>
                          </motion.tr>
                        );
                      })}
                    </tbody>
                  </table>
                )}
              </motion.div>
            )}

          </AnimatePresence>
        )}
      </div>
    </div>
  );
}