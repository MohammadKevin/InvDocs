"use client";

import {
  useEffect,
  useState,
  cloneElement,
} from "react";

import {
  motion,
  AnimatePresence,
} from "framer-motion";

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
} from "lucide-react";

import { api } from "@/lib/api";

function Card({
  icon,
  title,
  subtitle,
  onClick,
}: {
  icon: any;
  title: string;
  subtitle: string;
  onClick: () => void;
}) {
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
      className="group relative p-7 bg-white rounded-[2.5rem] border border-slate-200/60 shadow-[0_10px_40px_rgba(0,0,0,0.02)] flex flex-col items-start text-left gap-5 transition-all hover:shadow-[0_25px_60px_rgba(59,130,246,0.12)] hover:border-blue-200"
    >
      <div className="p-4 bg-slate-50 text-slate-400 rounded-[1.25rem] group-hover:bg-blue-600 group-hover:text-white group-hover:shadow-xl group-hover:shadow-blue-200 transition-all duration-300">
        {cloneElement(icon, {
          size: 28,
        })}
      </div>

      <div className="space-y-1 w-full">
        <h3 className="font-black text-slate-900 group-hover:text-blue-600 transition-colors leading-tight text-lg truncate">
          {title}
        </h3>

        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
          {subtitle}
        </p>
      </div>

      <div className="absolute bottom-6 right-6 w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-300 group-hover:bg-blue-600 group-hover:text-white transition-all group-hover:rotate-[-45deg]">
        <ArrowRight size={18} />
      </div>
    </motion.button>
  );
}

export default function DashboardPage() {
  const [view, setView] =
    useState("divisions");

  const [loading, setLoading] =
    useState(true);

  const [activeDivision, setActiveDivision] =
    useState<string | null>(null);

  const [activeRack, setActiveRack] =
    useState<any>(null);

  const [activeBox, setActiveBox] =
    useState<any>(null);

  const [searchTerm, setSearchTerm] =
    useState("");

  const [allRacks, setAllRacks] =
    useState<any[]>([]);

  const [divisions, setDivisions] =
    useState<string[]>([]);

  const [boxes, setBoxes] = useState<any[]>(
    []
  );

  const [documents, setDocuments] =
    useState<any[]>([]);

  const [previewFile, setPreviewFile] =
    useState<any>(null);

  useEffect(() => {
    fetchInitialData();
  }, []);

  async function fetchInitialData() {
    try {
      setLoading(true);

      const res = await api.get("/rack");

      const data =
        res.data.data || res.data;

      setAllRacks(data);

      setDivisions([
        ...new Set(
          data.map((r: any) => r.divisi)
        ),
      ] as string[]);
    } finally {
      setLoading(false);
    }
  }

  const openDivision = (div: string) => {
    setActiveDivision(div);

    setView("racks");
  };

  const openRack = async (rack: any) => {
    setActiveRack(rack);

    setLoading(true);

    const res = await api.get("/boxes");

    setBoxes(
      (res.data.data || res.data).filter(
        (b: any) =>
          b.rackId === rack.id
      )
    );

    setView("boxes");

    setLoading(false);
  };

  const openBox = async (box: any) => {
    setActiveBox(box);

    setLoading(true);

    const res = await api.get(
      "/documents"
    );

    setDocuments(
      (res.data.data || res.data).filter(
        (d: any) =>
          d.boxId === box.id
      )
    );

    setView("files");

    setLoading(false);
  };

  const downloadFile = (
    url: string,
    title: string
  ) => {
    const link =
      document.createElement("a");

    link.href = url;

    link.setAttribute(
      "download",
      title
    );

    link.setAttribute(
      "target",
      "_blank"
    );

    document.body.appendChild(link);

    link.click();

    document.body.removeChild(link);
  };

  return (
    <>
      <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <header className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-[10px] font-black uppercase tracking-[0.1em]">
              <LayoutGrid size={12} />
              Master Inventory
            </div>

            <h1 className="text-4xl font-black text-slate-900 tracking-tighter">
              Archive Central
            </h1>

            <p className="text-slate-500 font-medium">
              Monitoring system for PT.
              Gudang Baru Berkah
            </p>
          </div>

          <div className="relative group">
            <Search
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors"
              size={18}
            />

            <input
              className="pl-12 pr-6 py-4 bg-white border border-slate-200 rounded-2xl w-full lg:w-96 shadow-sm focus:ring-4 focus:ring-blue-50 focus:border-blue-200 transition-all outline-none font-bold text-sm"
              placeholder={`Search in ${view}...`}
              onChange={(e) =>
                setSearchTerm(
                  e.target.value
                )
              }
            />
          </div>
        </header>

        <nav className="flex items-center gap-3 p-2 bg-slate-100/50 rounded-2xl w-fit border border-slate-200/50">
          <button
            onClick={() => {
              setView("divisions");

              setActiveDivision(
                null
              );

              setActiveRack(null);

              setActiveBox(null);
            }}
            className="p-2 hover:bg-white rounded-xl text-slate-400 hover:text-blue-600 transition-all"
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

          {activeRack && (
            <>
              <ChevronRight
                size={14}
                className="text-slate-300"
              />

              <span className="text-xs font-black uppercase text-blue-600 px-3 py-1 bg-white rounded-lg shadow-sm">
                {activeRack?.name_rack}
              </span>
            </>
          )}

          {activeBox && (
            <>
              <ChevronRight
                size={14}
                className="text-slate-300"
              />

              <span className="text-xs font-black uppercase text-emerald-600 px-3 py-1 bg-white rounded-lg shadow-sm">
                {activeBox?.name_box}
              </span>
            </>
          )}
        </nav>

        {loading ? (
          <div className="py-40 flex flex-col items-center justify-center gap-5">
            <div className="w-16 h-16 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin" />

            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400 animate-pulse">
              Decrypting Files...
            </span>
          </div>
        ) : (
          <motion.div
            layout
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-6"
          >
            {/* DIVISIONS */}
            {view === "divisions" &&
              divisions
                .filter((div) =>
                  div
                    .toLowerCase()
                    .includes(
                      searchTerm.toLowerCase()
                    )
                )
                .map((div) => (
                  <Card
                    key={div}
                    icon={<Building2 />}
                    title={div}
                    subtitle="Department"
                    onClick={() =>
                      openDivision(div)
                    }
                  />
                ))}

            {/* RACKS */}
            {view === "racks" &&
              allRacks
                .filter(
                  (r) =>
                    r.divisi ===
                      activeDivision &&
                    r.name_rack
                      .toLowerCase()
                      .includes(
                        searchTerm.toLowerCase()
                      )
                )
                .map((r) => (
                  <Card
                    key={r.id}
                    icon={<Server />}
                    title={r.name_rack}
                    subtitle={`Status: ${r.status}`}
                    onClick={() =>
                      openRack(r)
                    }
                  />
                ))}

            {/* BOXES */}
            {view === "boxes" &&
              boxes
                .filter((b) =>
                  b.name_box
                    .toLowerCase()
                    .includes(
                      searchTerm.toLowerCase()
                    )
                )
                .map((b) => (
                  <Card
                    key={b.id}
                    icon={<Archive />}
                    title={b.name_box}
                    subtitle={b.kode_box}
                    onClick={() =>
                      openBox(b)
                    }
                  />
                ))}

            {/* FILES */}
            {view === "files" &&
              documents
                .filter((d) =>
                  d.title
                    ?.toLowerCase()
                    .includes(
                      searchTerm.toLowerCase()
                    )
                )
                .map((d) => (
                  <motion.div
                    key={d.id}
                    whileHover={{
                      y: -8,
                    }}
                    className="bg-white p-6 rounded-[2.5rem] border border-slate-200/60 shadow-sm flex flex-col gap-5 hover:shadow-2xl hover:shadow-blue-200/40 transition-all"
                  >
                    <div className="flex justify-between items-start">
                      <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl">
                        <FileText
                          size={22}
                        />
                      </div>

                      <div
                        className={`px-2 py-1 rounded-lg text-[9px] font-black uppercase tracking-tighter ${
                          d.status ===
                          "approved"
                            ? "bg-emerald-50 text-emerald-600"
                            : "bg-amber-50 text-amber-600"
                        }`}
                      >
                        {d.status}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <h4 className="font-black text-slate-900 leading-snug line-clamp-2">
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
                          setPreviewFile(
                            d
                          )
                        }
                        className="flex-1 py-3 bg-slate-900 text-white rounded-2xl font-bold text-xs hover:bg-blue-600 transition-colors flex items-center justify-center gap-2"
                      >
                        <Eye size={14} />
                        Preview
                      </button>

                      <button
                        onClick={() =>
                          downloadFile(
                            d.fileUrl,
                            d.title
                          )
                        }
                        className="flex-1 py-3 bg-blue-600 text-white rounded-2xl font-bold text-xs hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                      >
                        <Download
                          size={14}
                        />
                        Download
                      </button>
                    </div>
                  </motion.div>
                ))}
          </motion.div>
        )}
      </div>

      {/* PREVIEW MODAL */}
      <AnimatePresence>
        {previewFile && (
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
            className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-5"
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
              className="relative w-full max-w-6xl h-[90vh] bg-white rounded-[2rem] overflow-hidden shadow-2xl"
            >
              <button
                onClick={() =>
                  setPreviewFile(null)
                }
                className="absolute top-5 right-5 z-50 w-12 h-12 rounded-2xl bg-black/70 text-white flex items-center justify-center hover:bg-red-500 transition-all"
              >
                <X size={20} />
              </button>

              <iframe
                src={previewFile.fileUrl}
                className="w-full h-full"
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}