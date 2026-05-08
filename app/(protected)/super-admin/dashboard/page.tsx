"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence, easeOut } from "framer-motion";

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

/* ================= ANIMATION ================= */

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
      ease: easeOut,
    },
  },

  exit: {
    opacity: 0,
    y: -10,
    scale: 0.95,

    transition: {
      duration: 0.18,
      ease: easeOut,
    },
  },
};

/* ================= COMPONENT ================= */

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

/* ================= MAIN ================= */

export default function DashboardPage() {
  const [view, setView] = useState<View>("divisions");

  const [allRacks, setAllRacks] = useState<Rack[]>([]);
  const [racks, setRacks] = useState<Rack[]>([]);
  const [boxes, setBoxes] = useState<Box[]>([]);
  const [documents, setDocuments] = useState<DocumentItem[]>([]);
  const [divisions, setDivisions] = useState<string[]>([]);

  const [activeDivision, setActiveDivision] = useState<string | null>(null);
  const [activeRack, setActiveRack] = useState<Rack | null>(null);
  const [activeBox, setActiveBox] = useState<Box | null>(null);

  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const [clickTimer, setClickTimer] =
    useState<ReturnType<typeof setTimeout> | null>(null);

  /* ================= FETCH ================= */

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

      const uniqueDivisions = [...new Set(data.map((r) => r.divisi))];

      setDivisions(uniqueDivisions);
    } catch {
      setAllRacks([]);
      setDivisions([]);
    } finally {
      setLoading(false);
    }
  }

  /* ================= NAV ================= */

  function openDivision(divisi: string) {
    setActiveDivision(divisi);

    const filtered = allRacks.filter((r) => r.divisi === divisi);

    setRacks(filtered);
    setView("racks");
  }

  function handleRackClick(rack: Rack) {
    if (clickTimer) {
      clearTimeout(clickTimer);
      setClickTimer(null);
      openRack(rack);
    } else {
      const t = setTimeout(() => setClickTimer(null), 300);
      setClickTimer(t);
    }
  }

  function handleBoxClick(box: Box) {
    if (clickTimer) {
      clearTimeout(clickTimer);
      setClickTimer(null);
      openBox(box);
    } else {
      const t = setTimeout(() => setClickTimer(null), 300);
      setClickTimer(t);
    }
  }

  async function openRack(rack: Rack) {
    try {
      setLoading(true);
      setActiveRack(rack);
      setView("boxes");

      const res = await api.get("/boxes");

      const data: Box[] = Array.isArray(res.data)
        ? res.data
        : res.data?.data ?? [];

      setBoxes(data.filter((b) => b.rackId === rack.id));
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

      setDocuments(data.filter((d) => d.boxId === box.id));
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

  /* ================= FILTER ================= */

  const kw = searchTerm.toLowerCase();

  const filteredDivisions = divisions.filter((d) =>
    d.toLowerCase().includes(kw)
  );

  const filteredRacks = racks.filter((r) =>
    r.name_rack.toLowerCase().includes(kw)
  );

  const filteredBoxes = boxes.filter(
    (b) =>
      b.name_box.toLowerCase().includes(kw) ||
      b.kode_box.toLowerCase().includes(kw)
  );

  const filteredDocs = documents.filter((d) =>
    d.title.toLowerCase().includes(kw)
  );

  /* ================= UI ================= */

  return (
    <div className="min-h-screen bg-slate-50/60">
      <div className="max-w-screen-xl mx-auto px-6 py-8 space-y-6">

        {/* HEADER */}
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-black flex items-center gap-2">
            <HardDrive className="text-blue-600" />
            PT. Gudang Baru
          </h1>

          <div className="relative">
            <Search className="absolute left-3 top-2.5 text-slate-400" />
            <input
              className="pl-9 pr-4 py-2 border rounded-xl"
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* CONTENT */}
        {loading ? (
          <div className="flex justify-center py-32">
            <Loader2 className="animate-spin" />
          </div>
        ) : (
          <AnimatePresence mode="wait">

            {/* DIVISIONS */}
            {view === "divisions" && (
              <motion.div
                key="divisions"
                variants={gridVariants}
                initial="hidden"
                animate="show"
                className="grid grid-cols-5 gap-4"
              >
                {filteredDivisions.length === 0 ? (
                  <EmptyState label="No divisions found" />
                ) : (
                  filteredDivisions.map((divisi) => (
                    <motion.button
                      key={divisi}
                      variants={cardVariants}
                      onClick={() => openDivision(divisi)}
                      className="p-5 bg-white rounded-2xl shadow"
                    >
                      <Building2 />
                      <p className="font-bold">{divisi}</p>
                    </motion.button>
                  ))
                )}
              </motion.div>
            )}

            {/* RACKS */}
            {view === "racks" && (
              <motion.div
                key="racks"
                variants={gridVariants}
                initial="hidden"
                animate="show"
                className="grid grid-cols-5 gap-4"
              >
                {filteredRacks.map((rack) => (
                  <motion.button
                    key={rack.id}
                    variants={cardVariants}
                    onClick={() => handleRackClick(rack)}
                    className="p-5 bg-white rounded-2xl shadow"
                  >
                    <Server />
                    <p className="font-bold">{rack.name_rack}</p>
                  </motion.button>
                ))}
              </motion.div>
            )}

          </AnimatePresence>
        )}

      </div>
    </div>
  );
}