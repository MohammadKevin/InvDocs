"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Archive,
  FileText,
  ArrowUpRight,
  Loader2,
} from "lucide-react";

import { api } from "@/lib/api";

export default function DashboardPage() {
  const [stats, setStats] = useState([
    {
      label: "Total Boxes",
      value: "0",
      icon: Archive,
      color: "amber",
      key: "boxes",
    },
    {
      label: "Total Documents",
      value: "0",
      icon: FileText,
      color: "emerald",
      key: "documents",
    },
  ]);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);

        const [boxesRes, documentsRes] = await Promise.all([
          api.get("/boxes"),
          api.get("/documents"),
        ]);

        console.log("BOXES:", boxesRes.data);
        console.log("DOCUMENTS:", documentsRes.data);

        const boxesTotal = Array.isArray(boxesRes.data)
          ? boxesRes.data.length
          : boxesRes.data?.data?.length || 0;

        const documentsTotal = Array.isArray(documentsRes.data)
          ? documentsRes.data.length
          : documentsRes.data?.data?.length || 0;

        setStats((prev) =>
          prev.map((stat) => {
            if (stat.key === "boxes") {
              return {
                ...stat,
                value: boxesTotal.toString(),
              };
            }

            if (stat.key === "documents") {
              return {
                ...stat,
                value: documentsTotal.toString(),
              };
            }

            return stat;
          })
        );
      } catch (err) {
        console.error("Dashboard sync error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight uppercase italic">
          System Overview
        </h1>

        <p className="text-slate-500 text-sm font-medium">
          Real-time data from InvDocs Cloud Server.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm group hover:shadow-md transition-all"
          >
            <div className="flex justify-between items-start mb-4">
              <div
                className={`p-3 rounded-2xl bg-${stat.color}-50 text-${stat.color}-600`}
              >
                <stat.icon size={24} />
              </div>

              {!loading && (
                <span className="text-[10px] font-black text-emerald-500 bg-emerald-50 px-2 py-1 rounded-lg flex items-center">
                  <ArrowUpRight size={12} className="mr-1" />
                  LIVE
                </span>
              )}
            </div>

            <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em]">
              {stat.label}
            </p>

            {loading ? (
              <Loader2 className="w-6 h-6 text-slate-200 animate-spin mt-2" />
            ) : (
              <h3 className="text-3xl font-black text-slate-900 mt-1">
                {stat.value}
              </h3>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
}
