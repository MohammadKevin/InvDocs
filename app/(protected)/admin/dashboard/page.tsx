"use client";

import React, {
  useEffect,
  useMemo,
  useState,
} from "react";

import { motion, AnimatePresence } from "framer-motion";

import {
  Server,
  Archive,
  FileText,
  Building2,
  LayoutGrid,
  ArrowLeft,
  Eye,
  Loader2,
  X,
  Search,
  Download,
  BarChart3,
} from "lucide-react";

import { api } from "@/lib/api";

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

type View =
  | "divisions"
  | "racks"
  | "boxes"
  | "files";

type Rack = {
  id: string;
  kode_rack: string;
  divisi: string;
  status?: string;
};

type Box = {
  id: string;
  kode_box: string;
  rackId: string;
};

type FileDoc = {
  id: string;
  title: string;
  fileUrl: string;
  boxId: string;
  createdAt?: string;
};

const ACCENTS = [
  "from-cyan-500 to-sky-500",
  "from-violet-500 to-indigo-500",
  "from-emerald-500 to-teal-500",
  "from-amber-500 to-orange-500",
  "from-rose-500 to-pink-500",
  "from-blue-500 to-cyan-500",
];

function Card({
  icon: Icon,
  title,
  subtitle,
  onClick,
  accent,
}: {
  icon: React.ElementType;
  title: string;
  subtitle: string;
  onClick: () => void;
  accent: string;
}) {
  return (
    <motion.button
      whileHover={{ y: -6 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className="group relative overflow-hidden rounded-[2rem] border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#081028] shadow-sm hover:shadow-xl transition-all duration-300 text-left"
    >
      <div
        className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-br ${accent}`}
      />

      <div className="relative p-6 flex flex-col gap-5">
        <div className="flex items-center justify-between">
          <div className="w-14 h-14 rounded-2xl bg-cyan-50 dark:bg-slate-900 text-cyan-600 dark:text-cyan-400 group-hover:bg-white/20 group-hover:text-white flex items-center justify-center transition-all duration-300">
            <Icon size={26} />
          </div>

          <div className="px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-900 text-[10px] font-black uppercase tracking-widest text-slate-400 group-hover:bg-white/20 group-hover:text-white/80 transition-all">
            Open
          </div>
        </div>

        <div>
          <h3 className="text-lg font-black text-slate-800 dark:text-white truncate group-hover:text-white transition-colors">
            {title}
          </h3>

          <p className="text-sm text-slate-400 group-hover:text-white/80 transition-colors mt-1">
            {subtitle}
          </p>
        </div>
      </div>
    </motion.button>
  );
}

export default function DashboardPage() {
  const [view, setView] =
    useState<View>("divisions");

  const [loading, setLoading] =
    useState(true);

  const [searchTerm, setSearchTerm] =
    useState("");

  const [
    activeDivision,
    setActiveDivision,
  ] = useState<string | null>(null);

  const [activeRack, setActiveRack] =
    useState<Rack | null>(null);

  const [activeBox, setActiveBox] =
    useState<Box | null>(null);

  const [allRacks, setAllRacks] =
    useState<Rack[]>([]);

  const [divisions, setDivisions] =
    useState<string[]>([]);

  const [boxes, setBoxes] =
    useState<Box[]>([]);

  const [documents, setDocuments] =
    useState<FileDoc[]>([]);

  const [previewFile, setPreviewFile] =
    useState<FileDoc | null>(null);

  const [chartRange, setChartRange] =
    useState<
      | "week"
      | "month"
      | "year"
      | "3year"
    >("week");

  useEffect(() => {
    fetchInitial();
  }, []);

  async function fetchInitial() {
    try {
      setLoading(true);

      const rackRes =
        await api.get("/rack");

      const docRes =
        await api.get("/documents");

      const racks =
        rackRes.data?.data ||
        rackRes.data ||
        [];

      const docs =
        docRes.data?.data ||
        docRes.data ||
        [];

      setAllRacks(racks);

      setDocuments(docs);

      setDivisions([
        ...new Set(
          racks.map(
            (r: Rack) =>
              r.divisi
          )
        ),
      ]);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  const handleBack = () => {
    setSearchTerm("");

    if (view === "files") {
      setView("boxes");
    } else if (
      view === "boxes"
    ) {
      setView("racks");
    } else if (
      view === "racks"
    ) {
      setView("divisions");
    }
  };

  const filteredDivisions =
    useMemo(() => {
      return divisions.filter((d) =>
        d
          ?.toLowerCase()
          .includes(
            searchTerm.toLowerCase()
          )
      );
    }, [
      divisions,
      searchTerm,
    ]);

  const filteredRacks =
    useMemo(() => {
      return allRacks.filter(
        (r) =>
          r.divisi ===
            activeDivision &&
          r.kode_rack
            ?.toLowerCase()
            .includes(
              searchTerm.toLowerCase()
            )
      );
    }, [
      allRacks,
      activeDivision,
      searchTerm,
    ]);

  const filteredBoxes =
    useMemo(() => {
      return boxes.filter((b) =>
        b.kode_box
          ?.toLowerCase()
          .includes(
            searchTerm.toLowerCase()
          )
      );
    }, [boxes, searchTerm]);

  const filteredFiles =
    useMemo(() => {
      return documents.filter((f) =>
        f.title
          ?.toLowerCase()
          .includes(
            searchTerm.toLowerCase()
          )
      );
    }, [
      documents,
      searchTerm,
    ]);

  const openDivision = (
    div: string
  ) => {
    setActiveDivision(div);
    setSearchTerm("");
    setView("racks");
  };

  const openRack = async (
    rack: Rack
  ) => {
    try {
      setLoading(true);

      setActiveRack(rack);

      const res =
        await api.get(
          `/boxes/rack/${rack.id}`
        );

      const data =
        res.data?.data ||
        res.data ||
        [];

      setBoxes(data);

      setView("boxes");
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const openBox = (
    box: Box
  ) => {
    setActiveBox(box);

    const filtered =
      documents.filter(
        (d) =>
          d.boxId === box.id
      );

    setDocuments(filtered);

    setView("files");
  };

  const pageTitle =
    view === "divisions"
      ? "Divisions"
      : view === "racks"
      ? activeDivision
      : view === "boxes"
      ? activeRack?.kode_rack
      : activeBox?.kode_box;

  const incomingDocsChart =
    useMemo(() => {
      const now = new Date();

      const result: {
        name: string;
        total: number;
      }[] = [];

      if (
        chartRange === "week"
      ) {
        for (
          let i = 6;
          i >= 0;
          i--
        ) {
          const d =
            new Date();

          d.setDate(
            now.getDate() - i
          );

          const label =
            d.toLocaleDateString(
              "id-ID",
              {
                weekday:
                  "short",
              }
            );

          const total =
            documents.filter(
              (doc) => {
                if (
                  !doc.createdAt
                )
                  return false;

                const docDate =
                  new Date(
                    doc.createdAt
                  );

                return (
                  docDate.toDateString() ===
                  d.toDateString()
                );
              }
            ).length;

          result.push({
            name: label,
            total,
          });
        }
      }

      if (
        chartRange === "month"
      ) {
        for (
          let i = 29;
          i >= 0;
          i--
        ) {
          const d =
            new Date();

          d.setDate(
            now.getDate() - i
          );

          const label =
            d.toLocaleDateString(
              "id-ID",
              {
                day: "2-digit",
                month:
                  "short",
              }
            );

          const total =
            documents.filter(
              (doc) => {
                if (
                  !doc.createdAt
                )
                  return false;

                const docDate =
                  new Date(
                    doc.createdAt
                  );

                return (
                  docDate.toDateString() ===
                  d.toDateString()
                );
              }
            ).length;

          result.push({
            name: label,
            total,
          });
        }
      }

      if (
        chartRange === "year"
      ) {
        for (
          let i = 11;
          i >= 0;
          i--
        ) {
          const d =
            new Date();

          d.setMonth(
            now.getMonth() - i
          );

          const label =
            d.toLocaleDateString(
              "id-ID",
              {
                month:
                  "short",
              }
            );

          const total =
            documents.filter(
              (doc) => {
                if (
                  !doc.createdAt
                )
                  return false;

                const docDate =
                  new Date(
                    doc.createdAt
                  );

                return (
                  docDate.getMonth() ===
                    d.getMonth() &&
                  docDate.getFullYear() ===
                    d.getFullYear()
                );
              }
            ).length;

          result.push({
            name: label,
            total,
          });
        }
      }

      if (
        chartRange === "3year"
      ) {
        for (
          let i = 2;
          i >= 0;
          i--
        ) {
          const d =
            new Date();

          d.setFullYear(
            now.getFullYear() -
              i
          );

          const label =
            d
              .getFullYear()
              .toString();

          const total =
            documents.filter(
              (doc) => {
                if (
                  !doc.createdAt
                )
                  return false;

                const docDate =
                  new Date(
                    doc.createdAt
                  );

                return (
                  docDate.getFullYear() ===
                  d.getFullYear()
                );
              }
            ).length;

          result.push({
            name: label,
            total,
          });
        }
      }

      return result;
    }, [
      documents,
      chartRange,
    ]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-10">
      <header className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 text-cyan-500 text-[11px] font-black uppercase tracking-[0.3em] mb-3">
            <LayoutGrid size={14} />
            Digital Archive
          </div>

          <h1 className="text-4xl font-black tracking-tight text-slate-900 dark:text-white">
            {pageTitle}
          </h1>

          <p className="mt-2 text-sm text-slate-400 font-medium">
            Browse divisions,
            racks, archive boxes,
            and digital files.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative">
            <Search
              size={16}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
            />

            <input
              className="pl-11 pr-4 py-3 w-full sm:w-72 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl outline-none focus:ring-4 focus:ring-cyan-500/10 focus:border-cyan-400 transition-all"
              placeholder={`Search ${view}...`}
              value={searchTerm}
              onChange={(e) =>
                setSearchTerm(
                  e.target.value
                )
              }
            />
          </div>

          {view !==
            "divisions" && (
            <button
              onClick={
                handleBack
              }
              className="flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-slate-900 hover:bg-cyan-600 text-white text-sm font-bold transition-all"
            >
              <ArrowLeft
                size={16}
              />
              Back
            </button>
          )}
        </div>
      </header>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-40 gap-4">
          <Loader2
            className="animate-spin text-cyan-500"
            size={42}
          />

          <p className="text-[11px] uppercase tracking-[0.3em] font-black text-slate-300">
            Loading Data
          </p>
        </div>
      ) : (
        <>
          <motion.div
            layout
            className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6"
          >
            {view ===
              "divisions" &&
              filteredDivisions.map(
                (
                  d,
                  i
                ) => (
                  <Card
                    key={d}
                    icon={
                      Building2
                    }
                    title={d}
                    subtitle="Division"
                    accent={
                      ACCENTS[
                        i %
                          ACCENTS.length
                      ]
                    }
                    onClick={() =>
                      openDivision(
                        d
                      )
                    }
                  />
                )
              )}

            {view ===
              "racks" &&
              filteredRacks.map(
                (
                  r,
                  i
                ) => (
                  <Card
                    key={r.id}
                    icon={
                      Server
                    }
                    title={
                      r.kode_rack
                    }
                    subtitle={
                      r.status ||
                      "Rack"
                    }
                    accent={
                      ACCENTS[
                        i %
                          ACCENTS.length
                      ]
                    }
                    onClick={() =>
                      openRack(
                        r
                      )
                    }
                  />
                )
              )}

            {view ===
              "boxes" &&
              filteredBoxes.map(
                (
                  b,
                  i
                ) => (
                  <Card
                    key={b.id}
                    icon={
                      Archive
                    }
                    title={
                      b.kode_box
                    }
                    subtitle="Archive Box"
                    accent={
                      ACCENTS[
                        i %
                          ACCENTS.length
                      ]
                    }
                    onClick={() =>
                      openBox(
                        b
                      )
                    }
                  />
                )
              )}

            {view ===
              "files" &&
              filteredFiles.map(
                (
                  f,
                  i
                ) => (
                  <motion.div
                    key={f.id}
                    initial={{
                      opacity: 0,
                      y: 20,
                    }}
                    animate={{
                      opacity: 1,
                      y: 0,
                    }}
                    className="group p-6 rounded-[2rem] border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#081028] shadow-sm hover:shadow-xl transition-all"
                  >
                    <div
                      className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${
                        ACCENTS[
                          i %
                            ACCENTS.length
                        ]
                      } text-white flex items-center justify-center mb-5`}
                    >
                      <FileText
                        size={
                          26
                        }
                      />
                    </div>

                    <h3 className="font-black text-slate-800 dark:text-white line-clamp-2">
                      {f.title}
                    </h3>

                    <p className="mt-2 text-sm text-slate-400">
                      Digital
                      Document
                    </p>

                    <div className="grid grid-cols-2 gap-3 mt-6">
                      <button
                        onClick={() =>
                          setPreviewFile(
                            f
                          )
                        }
                        className="flex items-center justify-center gap-2 bg-slate-900 hover:bg-cyan-600 text-white py-3 rounded-2xl text-sm font-bold transition-all"
                      >
                        <Eye
                          size={
                            16
                          }
                        />
                        Preview
                      </button>

                      <a
                        href={
                          f.fileUrl
                        }
                        target="_blank"
                        className="flex items-center justify-center gap-2 bg-cyan-500 hover:bg-cyan-400 text-white py-3 rounded-2xl text-sm font-bold transition-all"
                      >
                        <Download
                          size={
                            16
                          }
                        />
                        Download
                      </a>
                    </div>
                  </motion.div>
                )
              )}
          </motion.div>

          <div className="bg-white dark:bg-[#081028] border border-slate-200 dark:border-slate-800 rounded-[2.5rem] p-8 shadow-sm">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 mb-10">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-cyan-100 dark:bg-cyan-500/10 text-cyan-600 flex items-center justify-center">
                  <BarChart3
                    size={26}
                  />
                </div>

                <div>
                  <h2 className="text-2xl font-black text-slate-900 dark:text-white">
                    Incoming
                    Documents
                  </h2>

                  <p className="text-sm text-slate-400">
                    Statistik
                    jumlah
                    dokumen
                    masuk
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                {[
                  {
                    key: "week",
                    label:
                      "1 Minggu",
                  },
                  {
                    key: "month",
                    label:
                      "1 Bulan",
                  },
                  {
                    key: "year",
                    label:
                      "1 Tahun",
                  },
                  {
                    key:
                      "3year",
                    label:
                      "3 Tahun",
                  },
                ].map(
                  (
                    item
                  ) => (
                    <button
                      key={
                        item.key
                      }
                      onClick={() =>
                        setChartRange(
                          item.key as any
                        )
                      }
                      className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                        chartRange ===
                        item.key
                          ? "bg-cyan-500 text-white"
                          : "bg-slate-100 dark:bg-slate-900 text-slate-500 dark:text-slate-400"
                      }`}
                    >
                      {
                        item.label
                      }
                    </button>
                  )
                )}
              </div>
            </div>

            <div className="h-[380px]">
              <ResponsiveContainer
                width="100%"
                height="100%"
              >
                <BarChart
                  data={
                    incomingDocsChart
                  }
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    strokeOpacity={
                      0.1
                    }
                  />

                  <XAxis dataKey="name" />

                  <YAxis />

                  <Tooltip />

                  <Bar
                    dataKey="total"
                    fill="#06b6d4"
                    radius={[
                      10,
                      10,
                      0,
                      0,
                    ]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </>
      )}

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
            onClick={() =>
              setPreviewFile(
                null
              )
            }
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{
                scale: 0.95,
                opacity: 0,
                y: 20,
              }}
              animate={{
                scale: 1,
                opacity: 1,
                y: 0,
              }}
              exit={{
                scale: 0.95,
                opacity: 0,
                y: 20,
              }}
              onClick={(e) =>
                e.stopPropagation()
              }
              className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 w-full max-w-6xl h-[90vh] rounded-[2rem] overflow-hidden shadow-2xl"
            >
              <div className="h-20 px-6 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-black uppercase tracking-[0.3em] text-cyan-500 mb-1">
                    Document
                    Preview
                  </p>

                  <h2 className="font-black text-slate-800 dark:text-white truncate max-w-[300px]">
                    {
                      previewFile.title
                    }
                  </h2>
                </div>

                <button
                  onClick={() =>
                    setPreviewFile(
                      null
                    )
                  }
                  className="w-11 h-11 rounded-2xl bg-slate-100 dark:bg-slate-900 hover:bg-slate-200 dark:hover:bg-slate-800 flex items-center justify-center transition-all"
                >
                  <X
                    size={18}
                  />
                </button>
              </div>

              <div className="w-full h-[calc(100%-80px)] bg-slate-200 dark:bg-slate-800">
                <iframe
                  src={
                    previewFile.fileUrl
                  }
                  title="Document Preview"
                  className="w-full h-full"
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}