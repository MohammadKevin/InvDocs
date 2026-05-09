"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Search, 
  MoreVertical, 
  ShieldCheck, 
  Loader2, 
  AlertCircle,
  Mail,
  Calendar,
  Filter,
  UserCircle2,
  RefreshCcw
} from "lucide-react";
import { api } from "@/lib/api";

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
      setError(err.response?.data?.message || "Lost connection to Railway API.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const filteredUsers = users.filter((user) =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }} 
      animate={{ opacity: 1, y: 0 }} 
      className="space-y-8"
    >
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tighter uppercase italic">
            Member Registry
          </h1>
          <p className="text-cyan-600 text-xs font-bold uppercase tracking-[0.2em] mt-1 flex items-center gap-2">
            <UserCircle2 size={14} /> Total Personnel: {users.length}
          </p>
        </div>
        
        <button 
          onClick={fetchUsers}
          className="flex items-center gap-2 px-6 py-3 bg-white border border-slate-200 rounded-2xl text-xs font-black uppercase tracking-widest text-slate-500 hover:text-cyan-600 hover:border-cyan-200 transition-all shadow-sm"
        >
          <RefreshCcw size={14} className={loading ? "animate-spin" : ""} />
          Sync Data
        </button>
      </div>

      <div className="bg-white rounded-[3rem] border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-8 border-b border-slate-50 flex flex-wrap items-center justify-between gap-6 bg-slate-50/30">
          <div className="relative flex-1 min-w-[300px] group">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-cyan-500 transition-colors" size={20} />
            <input 
              type="text" 
              placeholder="Search by identity or credentials..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-14 pr-6 py-4 bg-white border border-slate-200 rounded-2xl text-sm font-bold focus:ring-4 focus:ring-cyan-500/10 outline-none transition-all shadow-sm"
            />
          </div>
          <button className="p-4 bg-slate-900 text-white rounded-2xl hover:bg-cyan-600 transition-all shadow-lg shadow-slate-200">
            <Filter size={20} />
          </button>
        </div>

        <div className="overflow-x-auto">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-40 space-y-4">
              <div className="relative">
                <div className="w-12 h-12 border-4 border-cyan-100 rounded-full animate-pulse"></div>
                <Loader2 className="absolute top-0 animate-spin text-cyan-600" size={48} />
              </div>
              <p className="text-slate-400 font-black uppercase tracking-[0.3em] text-[10px] animate-pulse">
                Authorizing Access to Railway...
              </p>
            </div>
          ) : error ? (
            <div className="py-40 flex flex-col items-center justify-center text-rose-500 space-y-4">
              <AlertCircle size={48} className="opacity-20" />
              <p className="font-black uppercase tracking-widest text-xs">{error}</p>
              <button onClick={fetchUsers} className="text-[10px] bg-rose-50 px-6 py-3 rounded-xl font-black uppercase tracking-widest border border-rose-100">Establish Handshake</button>
            </div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50 text-slate-400 border-b border-slate-100 uppercase tracking-[0.15em] text-[10px] font-black">
                  <th className="px-10 py-6">System Member</th>
                  <th className="px-10 py-6">Privilege Level</th>
                  <th className="px-10 py-6">Registration</th>
                  <th className="px-10 py-6 text-right">Settings</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                <AnimatePresence mode="popLayout">
                  {filteredUsers.length > 0 ? (
                    filteredUsers.map((user, i) => (
                      <motion.tr 
                        key={user.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: i * 0.02 }}
                        className="hover:bg-cyan-50/20 transition-colors group"
                      >
                        <td className="px-10 py-6">
                          <div className="flex items-center gap-5">
                            <div className="w-12 h-12 rounded-2xl bg-cyan-50 text-cyan-600 border border-cyan-100 flex items-center justify-center font-black group-hover:bg-cyan-500 group-hover:text-white transition-all duration-300">
                              {user.name.charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <p className="font-black text-slate-900 text-sm group-hover:text-cyan-600 transition-colors uppercase tracking-tight">{user.name}</p>
                              <div className="flex items-center gap-1.5 text-[11px] text-slate-400 lowercase font-bold mt-0.5">
                                <Mail size={10} /> {user.email}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-10 py-6">
                          <span className={`inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border ${
                            user.role === 'admin' 
                            ? 'bg-cyan-50 text-cyan-700 border-cyan-100' 
                            : 'bg-slate-50 text-slate-600 border-slate-100'
                          }`}>
                            <ShieldCheck size={12} strokeWidth={2.5} /> {user.role}
                          </span>
                        </td>
                        <td className="px-10 py-6">
                          <div className="flex items-center gap-2 text-slate-500 font-bold text-xs italic tracking-tighter">
                            <Calendar size={14} className="text-slate-300" />
                            {user.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' }) : "---"}
                          </div>
                        </td>
                        <td className="px-10 py-6 text-right">
                          <button className="p-3 text-slate-300 hover:text-cyan-600 hover:bg-white rounded-xl transition-all shadow-none hover:shadow-sm">
                            <MoreVertical size={20} />
                          </button>
                        </td>
                      </motion.tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={4} className="py-32 text-center">
                        <p className="text-slate-400 uppercase tracking-[0.4em] text-[10px] font-black italic">Null set: No matching profiles</p>
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