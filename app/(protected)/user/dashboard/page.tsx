"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  FileText,
  Archive,
  Plus,
  Loader2,
} from "lucide-react";

interface User {
  fullName?: string;
  name?: string;
  email?: string;
}

export default function DashboardPage() {
  const [loading, setLoading] = useState(true);

  const [documentsCount, setDocumentsCount] = useState(0);
  const [boxesCount, setBoxesCount] = useState(0);

  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/immutability
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      const token = localStorage.getItem("access_token");

      const headers = {
        Authorization: `Bearer ${token}`,
      };

      // fetch documents
      const documentsRes = await fetch(
        "https://invdocs-api-production.up.railway.app/api/documents",
        {
          headers,
        }
      );

      const documentsData = await documentsRes.json();

      // fetch boxes
      const boxesRes = await fetch(
        "https://invdocs-api-production.up.railway.app/api/boxes",
        {
          headers,
        }
      );

      const boxesData = await boxesRes.json();

      // ambil jumlah
      setDocumentsCount(
        Array.isArray(documentsData)
          ? documentsData.length
          : documentsData.data?.length || 0
      );

      setBoxesCount(
        Array.isArray(boxesData)
          ? boxesData.length
          : boxesData.data?.length || 0
      );

      // ambil user dari localStorage
      const userData = localStorage.getItem("user");

      if (userData) {
        setUser(JSON.parse(userData));
      }
    } catch (error) {
      console.error("Dashboard Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const stats = [
    {
      label: "Total Documents",
      value: documentsCount,
      icon: FileText,
      color: "text-blue-600",
      bg: "bg-blue-50",
    },
    {
      label: "Total Boxes",
      value: boxesCount,
      icon: Archive,
      color: "text-emerald-600",
      bg: "bg-emerald-50",
    },
  ];

  return (
    <div className="space-y-10">
      {/* Welcome Section */}
      <section className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tighter">
            Welcome back, {user?.fullName || user?.name || "User"}!
          </h1>

          <p className="text-slate-500 font-medium">
            Here’s what’s happening with your repository today.
          </p>
        </div>

        <div className="flex gap-3">
          <button className="bg-slate-900 text-white px-6 py-3 rounded-2xl font-bold text-xs uppercase tracking-widest flex items-center gap-2 hover:bg-slate-800 transition-all shadow-xl shadow-slate-200">
            <Plus size={18} />
            Upload New
          </button>
        </div>
      </section>

      {/* Stats Grid */}
      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="animate-spin text-blue-600" size={40} />
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {stats.map((item, i) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ y: -5 }}
              className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm shadow-slate-100/50"
            >
              <div
                className={`w-12 h-12 ${item.bg} ${item.color} rounded-2xl flex items-center justify-center mb-4`}
              >
                <item.icon size={24} />
              </div>

              <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                {item.label}
              </p>

              <h2 className="text-3xl font-black text-slate-900 mt-1 tracking-tighter">
                {item.value}
              </h2>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}