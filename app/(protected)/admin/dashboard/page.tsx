"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Archive,
  FileText,
  Clock,
  CheckCircle,
  ArrowRight,
  Loader2,
} from "lucide-react";

import { api } from "@/lib/api";

const colorClasses = {
  blue: "bg-blue-50 text-blue-600",
  slate: "bg-slate-100 text-slate-700",
  amber: "bg-amber-50 text-amber-600",
  emerald: "bg-emerald-50 text-emerald-600",
};

interface DashboardStat {
  label: string;
  value: string;
  icon: any;
  color: keyof typeof colorClasses;
  key: string;
}

export default function AdminDashboard() {
  const [loading, setLoading] = useState(true);

  const [stats, setStats] = useState<DashboardStat[]>([
    {
      label: "Total Boxes",
      value: "0",
      icon: Archive,
      color: "blue",
      key: "boxes",
    },
    {
      label: "Total Documents",
      value: "0",
      icon: FileText,
      color: "slate",
      key: "documents",
    },
    {
      label: "Pending",
      value: "0",
      icon: Clock,
      color: "amber",
      key: "pending",
    },
    {
      label: "Approved",
      value: "0",
      icon: CheckCircle,
      color: "emerald",
      key: "approved",
    },
  ]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);

        const [boxesRes, documentsRes] = await Promise.all([
          api.get("/boxes"),
          api.get("/documents"),
        ]);

        const boxes = boxesRes.data || [];
        const documents = documentsRes.data || [];

        // contoh filtering status document
        const pendingDocs = documents.filter(
          (doc: any) =>
            doc.status?.toLowerCase() === "pending"
        );

        const approvedDocs = documents.filter(
          (doc: any) =>
            doc.status?.toLowerCase() === "approved"
        );

        setStats((prev) =>
          prev.map((stat) => {
            if (stat.key === "boxes") {
              return {
                ...stat,
                value: boxes.length.toString(),
              };
            }

            if (stat.key === "documents") {
              return {
                ...stat,
                value: documents.length.toString(),
              };
            }

            if (stat.key === "pending") {
              return {
                ...stat,
                value: pendingDocs.length.toString(),
              };
            }

            if (stat.key === "approved") {
              return {
                ...stat,
                value: approvedDocs.length.toString(),
              };
            }

            return stat;
          })
        );
      } catch (err) {
        console.error("Dashboard fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  return (
    <div className="space-y-10">
      <div>
        <h1 className="text-3xl font-black text-slate-900 tracking-tight italic uppercase">
          Dashboard
        </h1>

        <p className="text-slate-500 font-medium mt-1">
          Overview of your assigned rack performance.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm group hover:shadow-md transition-all"
          >
            <div
              className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform ${
                colorClasses[stat.color]
              }`}
            >
              <stat.icon size={24} />
            </div>

            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
              {stat.label}
            </p>

            {loading ? (
              <Loader2 className="w-6 h-6 animate-spin text-slate-300 mt-2" />
            ) : (
              <h3 className="text-3xl font-black text-slate-900 mt-1">
                {stat.value}
              </h3>
            )}
          </motion.div>
        ))}
      </div>

      <div className="grid lg:grid-cols-1 gap-8">
        <div className="lg:col-span-2 bg-white rounded-[2.5rem] border border-slate-200 p-8 shadow-sm">
          <div className="flex justify-between items-center mb-8">
            <h3 className="font-black text-slate-800 uppercase tracking-widest text-xs">
              Recent Activities
            </h3>

            <button className="text-blue-600 text-xs font-bold flex items-center gap-1 hover:underline">
              View All <ArrowRight size={14} />
            </button>
          </div>

          <div className="space-y-6">
            {[1, 2, 3].map((_, i) => (
              <div
                key={i}
                className="flex gap-4 items-start pb-6 border-b border-slate-50 last:border-0"
              >
                <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 shrink-0">
                  <FileText size={18} />
                </div>

                <div>
                  <p className="text-sm font-bold text-slate-800 italic">
                    &quot;Invoice_March_2026.pdf&quot; was uploaded
                  </p>

                  <p className="text-xs text-slate-400 mt-1">
                    Uploaded by User 02 • In Box-A1
                  </p>
                </div>

                <div className="ml-auto text-[10px] font-bold text-slate-300 uppercase">
                  2m ago
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}