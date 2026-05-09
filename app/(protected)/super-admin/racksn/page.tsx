"use client";

import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Building2,
  Loader2,
  X,
  UserCircle2,
  Mail,
  Server,
  LayersIcon,
} from "lucide-react";
import { api } from "@/lib/api";

interface Rack {
  id: string;
  name_rack: string;
  divisi: string;
  userId?: string;
  user?: {
    id: string;
    name: string;
    email: string;
  };
}

interface DivisionGroup {
  name: string;
  rackCount: number;
  racks: Rack[];
}

const ACCENTS = [
  {
    bg: "from-cyan-500 to-teal-400",
    hover:
      "hover:from-cyan-500 hover:to-teal-400 dark:hover:from-cyan-500 dark:hover:to-teal-400",
    light:
      "bg-cyan-50 dark:bg-cyan-500/10",
    text:
      "text-cyan-600 dark:text-cyan-400",
  },
  {
    bg: "from-violet-500 to-indigo-400",
    hover:
      "hover:from-violet-500 hover:to-indigo-400 dark:hover:from-violet-500 dark:hover:to-indigo-400",
    light:
      "bg-violet-50 dark:bg-violet-500/10",
    text:
      "text-violet-600 dark:text-violet-400",
  },
  {
    bg: "from-amber-500 to-orange-400",
    hover:
      "hover:from-amber-500 hover:to-orange-400 dark:hover:from-amber-500 dark:hover:to-orange-400",
    light:
      "bg-amber-50 dark:bg-amber-500/10",
    text:
      "text-amber-600 dark:text-amber-400",
  },
  {
    bg: "from-rose-500 to-pink-400",
    hover:
      "hover:from-rose-500 hover:to-pink-400 dark:hover:from-rose-500 dark:hover:to-pink-400",
    light:
      "bg-rose-50 dark:bg-rose-500/10",
    text:
      "text-rose-600 dark:text-rose-400",
  },
  {
    bg: "from-emerald-500 to-green-400",
    hover:
      "hover:from-emerald-500 hover:to-green-400 dark:hover:from-emerald-500 dark:hover:to-green-400",
    light:
      "bg-emerald-50 dark:bg-emerald-500/10",
    text:
      "text-emerald-600 dark:text-emerald-400",
  },
  {
    bg: "from-sky-500 to-blue-400",
    hover:
      "hover:from-sky-500 hover:to-blue-400 dark:hover:from-sky-500 dark:hover:to-blue-400",
    light:
      "bg-sky-50 dark:bg-sky-500/10",
    text:
      "text-sky-600 dark:text-sky-400",
  },
];

export default function DivisionsPage() {
  const [divisions, setDivisions] = useState<DivisionGroup[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<DivisionGroup | null>(null);

  const clickTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const clickCountRef = useRef(0);

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    try {
      setLoading(true);

      const res = await api.get("/rack");

      const racks: Rack[] = Array.isArray(res.data?.data)
        ? res.data.data
        : Array.isArray(res.data)
        ? res.data
        : [];

      const map = new Map<string, Rack[]>();

      racks.forEach((rack) => {
        if (!rack?.divisi) return;

        if (!map.has(rack.divisi)) {
          map.set(rack.divisi, []);
        }

        map.get(rack.divisi)?.push(rack);
      });

      const grouped: DivisionGroup[] = Array.from(map.entries()).map(
        ([name, rackList]) => ({
          name,
          rackCount: rackList.length,
          racks: rackList,
        })
      );

      setDivisions(grouped);
    } catch (error) {
      console.error(error);
      setDivisions([]);
    } finally {
      setLoading(false);
    }
  }

  function handleCardClick(div: DivisionGroup) {
    clickCountRef.current += 1;

    if (clickCountRef.current === 1) {
      clickTimerRef.current = setTimeout(() => {
        clickCountRef.current = 0;
      }, 300);
    } else if (clickCountRef.current === 2) {
      if (clickTimerRef.current) {
        clearTimeout(clickTimerRef.current);
      }

      clickCountRef.current = 0;
      setSelected(div);
    }
  }

  return (
    <div className="space-y-10">
      {/* HEADER */}
      <header className="space-y-2">
        <p className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.3em] text-cyan-500 dark:text-cyan-400">
          <LayersIcon size={12} />
          Organizational Structure
        </p>

        <h1 className="text-4xl font-black tracking-tight text-slate-900 dark:text-white">
          Divisions
        </h1>

        <p className="text-sm font-medium text-slate-400 dark:text-slate-500">
          Double-click kartu untuk melihat pemegang rack di divisi tersebut.
        </p>
      </header>

      {/* LOADING */}
      {loading ? (
        <div className="flex justify-center py-40">
          <Loader2
            className="animate-spin text-cyan-500 dark:text-cyan-400"
            size={38}
          />
        </div>
      ) : (
        <motion.div
          initial="hidden"
          animate="show"
          variants={{
            show: {
              transition: {
                staggerChildren: 0.08,
              },
            },
          }}
          className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3"
        >
          {divisions.map((div, index) => {
            const accent = ACCENTS[index % ACCENTS.length];

            return (
              <motion.div
                key={div.name}
                variants={{
                  hidden: {
                    opacity: 0,
                    y: 24,
                  },
                  show: {
                    opacity: 1,
                    y: 0,
                  },
                }}
                whileHover={{ y: -5 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleCardClick(div)}
                onDoubleClick={() => setSelected(div)}
                className={`
                  group
                  relative
                  overflow-hidden
                  rounded-[2rem]
                  border
                  border-slate-200
                  dark:border-slate-800
                  bg-white
                  dark:bg-slate-900
                  shadow-sm
                  transition-all
                  duration-300
                  hover:shadow-2xl
                  cursor-pointer
                  select-none
                `}
              >
                {/* TOP BAR */}
                <div
                  className={`h-2 w-full bg-gradient-to-r ${accent.bg}`}
                />

                {/* HOVER OVERLAY */}
                <div
                  className={`
                    absolute
                    inset-0
                    opacity-0
                    group-hover:opacity-100
                    transition-opacity
                    duration-300
                    bg-gradient-to-br
                    ${accent.hover}
                  `}
                />

                {/* CONTENT */}
                <div className="relative z-10 p-7 space-y-5">
                  {/* ICON */}
                  <div
                    className={`
                      w-14
                      h-14
                      rounded-2xl
                      flex
                      items-center
                      justify-center
                      transition-all
                      duration-300
                      ${accent.light}
                      ${accent.text}
                      group-hover:bg-white/20
                      group-hover:text-white
                    `}
                  >
                    <Building2 size={26} />
                  </div>

                  {/* TEXT */}
                  <div>
                    <h2 className="text-xl font-black leading-tight text-slate-800 dark:text-white transition-colors duration-300 group-hover:text-white">
                      {div.name}
                    </h2>

                    <div
                      className={`
                        mt-2
                        flex
                        items-center
                        gap-1.5
                        text-xs
                        font-bold
                        transition-colors
                        duration-300
                        ${accent.text}
                        group-hover:text-white/80
                      `}
                    >
                      <Server size={12} />
                      {div.rackCount} Rack
                      {div.rackCount !== 1 ? "s" : ""}
                    </div>
                  </div>

                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-300 dark:text-slate-600 transition-colors duration-300 group-hover:text-white/60">
                    Double-click to view holders
                  </p>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      )}

      {/* MODAL */}
      <AnimatePresence>
        {selected && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelected(null)}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
          >
            <motion.div
              initial={{
                opacity: 0,
                scale: 0.92,
                y: 20,
              }}
              animate={{
                opacity: 1,
                scale: 1,
                y: 0,
              }}
              exit={{
                opacity: 0,
                scale: 0.92,
                y: 20,
              }}
              transition={{
                type: "spring",
                stiffness: 300,
                damping: 28,
              }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-lg overflow-hidden rounded-[2.5rem] bg-white dark:bg-slate-900 shadow-2xl border border-slate-200 dark:border-slate-800"
            >
              {/* HEADER */}
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 px-8 pt-8 pb-5">
                <div>
                  <p className="mb-1 text-[10px] font-black uppercase tracking-[0.3em] text-cyan-500 dark:text-cyan-400">
                    Pemegang Rack
                  </p>

                  <h2 className="text-2xl font-black text-slate-900 dark:text-white">
                    {selected.name}
                  </h2>
                </div>

                <button
                  onClick={() => setSelected(null)}
                  className="rounded-full p-2 text-slate-400 transition-colors hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-700 dark:hover:text-white"
                >
                  <X size={20} />
                </button>
              </div>

              {/* BODY */}
              <div className="max-h-[60vh] space-y-3 overflow-y-auto px-6 py-5">
                {selected.racks.length === 0 ? (
                  <p className="py-10 text-center text-sm text-slate-400">
                    Tidak ada rack.
                  </p>
                ) : (
                  selected.racks.map((rack, index) => (
                    <motion.div
                      key={rack.id}
                      initial={{
                        opacity: 0,
                        x: -12,
                      }}
                      animate={{
                        opacity: 1,
                        x: 0,
                      }}
                      transition={{
                        delay: index * 0.04,
                      }}
                      className="flex items-center gap-4 rounded-2xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 p-4"
                    >
                      {/* ICON */}
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-cyan-50 dark:bg-cyan-500/10 text-cyan-600 dark:text-cyan-400">
                        <Server size={18} />
                      </div>

                      {/* INFO */}
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-black text-slate-800 dark:text-white">
                          {rack.name_rack}
                        </p>

                        {rack.user ? (
                          <div className="mt-1 space-y-1">
                            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-600 dark:text-slate-300">
                              <UserCircle2
                                size={11}
                                className="text-cyan-400"
                              />
                              {rack.user.name}
                            </div>

                            <div className="flex items-center gap-1.5 text-[11px] font-medium text-slate-400 dark:text-slate-500">
                              <Mail size={10} />
                              {rack.user.email}
                            </div>
                          </div>
                        ) : (
                          <p className="mt-1 text-[11px] italic font-bold text-slate-300 dark:text-slate-600">
                            Tidak ada pemegang
                          </p>
                        )}
                      </div>
                    </motion.div>
                  ))
                )}
              </div>

              {/* FOOTER */}
              <div className="border-t border-slate-100 dark:border-slate-800 px-8 py-5">
                <button
                  onClick={() => setSelected(null)}
                  className="w-full rounded-2xl bg-slate-900 dark:bg-cyan-500 py-3 text-xs font-black uppercase tracking-widest text-white transition-colors hover:bg-cyan-600 dark:hover:bg-cyan-400"
                >
                  Tutup
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}