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
  Building2,
} from "lucide-react";

import { api } from "@/lib/api";

interface Rack {
  id: string;
  name_rack: string;
  divisi: string;
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
  boxId?: string;

  user?: {
    name?: string;
  };

  createdAt: string;
}

type View = "divisions" | "racks" | "boxes" | "files";

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
  division,
  rack,
  box,
  onHome,
  onDivision,
  onRack,
}: {
  view: View;
  division: string | null;
  rack: Rack | null;
  box: Box | null;
  onHome: () => void;
  onDivision: () => void;
  onRack: () => void;
}) {
  return (
    <nav className="flex items-center gap-1.5 text-xs font-semibold text-slate-400">
      <button
        onClick={onHome}
        className="flex items-center gap-1 hover:text-slate-700 transition-colors"
      >
        <Home size={13} />
        <span>Divisions</span>
      </button>

      {view !== "divisions" && division && (
        <>
          <ChevronRight size={12} className="text-slate-300" />

          <button
            onClick={onDivision}
            className="hover:text-slate-700 transition-colors"
          >
            {division}
          </button>
        </>
      )}

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
  const [view, setView] = useState<View>("divisions");

  const [allRacks, setAllRacks] = useState<Rack[]>([]);
  const [racks, setRacks] = useState<Rack[]>([]);
  const [boxes, setBoxes] = useState<Box[]>([]);
  const [documents, setDocuments] = useState<DocumentItem[]>([]);

  const [divisions, setDivisions] = useState<string[]>([]);

  const [activeDivision, setActiveDivision] =
    useState<string | null>(null);

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

      setAllRacks(data);

      const uniqueDivisions = [
        ...new Set(data.map((rack) => rack.divisi)),
      ];

      setDivisions(uniqueDivisions);
    } catch (error: any) {
      console.error("FETCH RACK ERROR");
      console.error(error);

      setAllRacks([]);
      setDivisions([]);
    } finally {
      setLoading(false);
    }
  }

  function openDivision(divisi: string) {
    setActiveDivision(divisi);

    const filteredRacks = allRacks.filter(
      (rack) => rack.divisi === divisi
    );

    setRacks(filteredRacks);

    setView("racks");
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
      console.error(error);

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
        (doc) => doc.boxId === box.id
      );

      setDocuments(boxDocuments);
    } catch (error: any) {
      console.error("FETCH DOCUMENT ERROR");
      console.error(error);

      setDocuments([]);
    } finally {
      setLoading(false);
    }
  }

  function goHome() {
    setView("divisions");

    setActiveDivision(null);
    setActiveRack(null);
    setActiveBox(null);

    setSearchTerm("");

    fetchRacks();
  }

  function goDivision() {
    if (!activeDivision) return;

    const filteredRacks = allRacks.filter(
      (rack) => rack.divisi === activeDivision
    );

    setRacks(filteredRacks);

    setView("racks");
  }

  function goRack() {
    if (activeRack) {
      openRack(activeRack);
    }
  }

  const kw = searchTerm.toLowerCase();

  const filteredDivisions = divisions.filter((divisi) =>
    divisi.toLowerCase().includes(kw)
  );

  const filteredRacks = racks.filter((rack) =>
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
    view === "divisions"
      ? "All Divisions"
      : view === "racks"
      ? `Racks in ${activeDivision}`
      : view === "boxes"
      ? `Boxes in ${activeRack?.name_rack}`
      : `Files in ${activeBox?.name_box}`;

  const viewCount =
    view === "divisions"
      ? filteredDivisions.length
      : view === "racks"
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
              division={activeDivision}
              rack={activeRack}
              box={activeBox}
              onHome={goHome}
              onDivision={goDivision}
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

            {view === "divisions" && (
              <motion.div
                key="divisions"
                variants={gridVariants}
                initial="hidden"
                animate="show"
                exit="hidden"
                className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4"
              >
                {filteredDivisions.length === 0 ? (
                  <EmptyState label="No divisions found" />
                ) : (
                  filteredDivisions.map((divisi) => (
                    <motion.button
                      key={divisi}
                      variants={cardVariants}
                      onClick={() => openDivision(divisi)}
                      className="group flex flex-col items-center gap-3 p-5 bg-white border border-slate-200 rounded-3xl shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200"
                    >
                      <div className="w-14 h-14 rounded-2xl bg-violet-50 flex items-center justify-center text-violet-500 group-hover:bg-violet-100 transition-colors">
                        <Building2 size={28} />
                      </div>

                      <div className="w-full text-center">
                        <p className="text-sm font-black text-slate-800 truncate">
                          {divisi}
                        </p>
                      </div>
                    </motion.button>
                  ))
                )}
              </motion.div>
            )}

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

          </AnimatePresence>
        )}
      </div>
    </div>
  );
}