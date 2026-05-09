"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  ShieldCheck,
  Loader2,
  AlertCircle,
  Mail,
  Calendar,
  UserCircle2,
  RefreshCcw,
  ChevronDown,
  X,
} from "lucide-react";

import { api } from "@/lib/api";
import { ThemeToggle } from "@/components/ThemeToggle";

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  createdAt: string;
}

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [error, setError] = useState("");

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError("");

      const res = await api.get("/users");
      const result = res.data.data || res.data;

      if (Array.isArray(result)) {
        setUsers(result);
      } else {
        setError("System encountered an unrecognized data structure.");
      }
    } catch (err: any) {
      setError(
        err.response?.data?.message ||
          "Lost connection to Railway API."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const uniqueRoles = [...new Set(users.map((u) => u.role))].sort();

  const filteredUsers = users.filter((user) => {
    const q = searchTerm.toLowerCase();

    const matchesSearch =
      user.name.toLowerCase().includes(q) ||
      user.email.toLowerCase().includes(q) ||
      user.role.toLowerCase().includes(q);

    const matchesRole =
      roleFilter === "all" ||
      user.role.toLowerCase() === roleFilter.toLowerCase();

    return matchesSearch && matchesRole;
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8"
    >
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-slate-900 dark:text-white font-black text-3xl md:text-4xl tracking-tight">
            Daftar Pengguna
          </h1>

          <p className="text-cyan-600 text-xs font-bold uppercase tracking-[0.2em] mt-2 flex items-center gap-2">
            <UserCircle2 size={14} />
            Total Personnel: {filteredUsers.length}
            {searchTerm || roleFilter !== "all"
              ? ` / ${users.length}`
              : ""}
          </p>
        </div>

        <div className="flex items-center gap-3">

          <button
            onClick={fetchUsers}
            className="flex items-center gap-2 px-6 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl text-xs font-black uppercase tracking-widest text-slate-500 dark:text-slate-300 hover:text-cyan-600 hover:border-cyan-200 dark:hover:border-cyan-700 transition-all shadow-sm"
          >
            <RefreshCcw
              size={14}
              className={loading ? "animate-spin" : ""}
            />
            Sync Data
          </button>
        </div>
      </div>

      {/* CARD */}
      <div className="bg-white dark:bg-slate-900 rounded-[3rem] border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden transition-colors">
        {/* SEARCH & FILTER */}
        <div className="p-8 border-b border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-6 bg-slate-50/50 dark:bg-slate-950/40">
          {/* SEARCH */}
          <div className="relative flex-1 min-w-[260px] group">
            <Search
              className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-cyan-500 transition-colors"
              size={18}
            />

            <input
              type="text"
              placeholder="Search name, email, or role..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-14 pr-10 py-4 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-sm font-bold text-slate-900 dark:text-white focus:ring-4 focus:ring-cyan-500/10 outline-none transition-all shadow-sm"
            />

            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 hover:text-slate-500 dark:hover:text-slate-200 transition-colors"
              >
                <X size={16} />
              </button>
            )}
          </div>

          {/* FILTER */}
          <div className="relative">
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="appearance-none pl-6 pr-12 py-4 bg-slate-900 dark:bg-slate-800 text-white rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-cyan-600 transition-all shadow-lg shadow-slate-200 dark:shadow-none outline-none cursor-pointer"
            >
              <option value="all">All Roles</option>

              {uniqueRoles.map((r) => (
                <option key={r} value={r}>
                  {r.replace(/_/g, " ")}
                </option>
              ))}
            </select>

            <ChevronDown
              size={14}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-white pointer-events-none"
            />
          </div>
        </div>

        {/* TABLE */}
        <div className="overflow-x-auto">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-40 space-y-4">
              <div className="relative">
                <div className="w-12 h-12 border-4 border-cyan-100 rounded-full animate-pulse"></div>

                <Loader2
                  className="absolute top-0 animate-spin text-cyan-600"
                  size={48}
                />
              </div>

              <p className="text-slate-400 font-black uppercase tracking-[0.3em] text-[10px] animate-pulse">
                Authorizing Access...
              </p>
            </div>
          ) : error ? (
            <div className="py-40 flex flex-col items-center justify-center text-rose-500 space-y-4">
              <AlertCircle size={48} className="opacity-20" />

              <p className="font-black uppercase tracking-widest text-xs">
                {error}
              </p>

              <button
                onClick={fetchUsers}
                className="text-[10px] bg-rose-50 dark:bg-rose-950/30 px-6 py-3 rounded-xl font-black uppercase tracking-widest border border-rose-100 dark:border-rose-900"
              >
                Establish Handshake
              </button>
            </div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50 dark:bg-slate-950/50 text-slate-400 border-b border-slate-100 dark:border-slate-800 uppercase tracking-[0.15em] text-[10px] font-black">
                  <th className="px-10 py-6">System Member</th>
                  <th className="px-10 py-6">Privilege Level</th>
                  <th className="px-10 py-6">Registration</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
                <AnimatePresence mode="popLayout">
                  {filteredUsers.length > 0 ? (
                    filteredUsers.map((user, i) => (
                      <motion.tr
                        key={user.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: i * 0.02 }}
                        className="hover:bg-cyan-50/20 dark:hover:bg-cyan-950/10 transition-colors group"
                      >
                        {/* USER */}
                        <td className="px-10 py-6">
                          <div className="flex items-center gap-5">
                            <div className="w-12 h-12 rounded-2xl bg-cyan-50 dark:bg-cyan-950/30 text-cyan-600 border border-cyan-100 dark:border-cyan-900 flex items-center justify-center font-black group-hover:bg-cyan-500 group-hover:text-white transition-all duration-300">
                              {user.name.charAt(0).toUpperCase()}
                            </div>

                            <div>
                              <p className="font-black text-slate-900 dark:text-white text-sm group-hover:text-cyan-600 transition-colors uppercase tracking-tight">
                                {user.name}
                              </p>

                              <div className="flex items-center gap-1.5 text-[11px] text-slate-400 lowercase font-bold mt-0.5">
                                <Mail size={10} />
                                {user.email}
                              </div>
                            </div>
                          </div>
                        </td>

                        {/* ROLE */}
                        <td className="px-10 py-6">
                          <span
                            className={`inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border ${
                              user.role
                                .toLowerCase()
                                .includes("admin")
                                ? "bg-cyan-50 dark:bg-cyan-950/20 text-cyan-700 dark:text-cyan-300 border-cyan-100 dark:border-cyan-900"
                                : "bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-100 dark:border-slate-700"
                            }`}
                          >
                            <ShieldCheck
                              size={12}
                              strokeWidth={2.5}
                            />

                            {user.role.replace(/_/g, " ")}
                          </span>
                        </td>

                        {/* DATE */}
                        <td className="px-10 py-6">
                          <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 font-bold text-xs italic tracking-tighter">
                            <Calendar
                              size={14}
                              className="text-slate-300 dark:text-slate-600"
                            />

                            {user.createdAt
                              ? new Date(
                                  user.createdAt
                                ).toLocaleDateString("en-US", {
                                  day: "numeric",
                                  month: "short",
                                  year: "numeric",
                                })
                              : "---"}
                          </div>
                        </td>
                      </motion.tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan={3}
                        className="py-32 text-center"
                      >
                        <Search
                          size={28}
                          className="mx-auto mb-3 text-slate-200 dark:text-slate-700"
                        />

                        <p className="text-slate-400 uppercase tracking-[0.4em] text-[10px] font-black italic">
                          Null set: No matching profiles
                        </p>

                        {(searchTerm ||
                          roleFilter !== "all") && (
                          <button
                            onClick={() => {
                              setSearchTerm("");
                              setRoleFilter("all");
                            }}
                            className="mt-4 text-[10px] text-cyan-600 font-black uppercase tracking-widest hover:underline"
                          >
                            Clear filters
                          </button>
                        )}
                      </td>
                    </tr>
                  )}
                </AnimatePresence>
              </tbody>
            </table>
          )}
        </div>
      </div>
    </motion.div>
  );
}