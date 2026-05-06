"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Search, 
  UserPlus, 
  MoreVertical, 
  ShieldCheck, 
  Loader2, 
  AlertCircle,
  Mail,
  Calendar,
  Filter
} from "lucide-react";
import { api } from "@/lib/api";

// Interface berdasarkan data dari Railway API
interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  createdAt: string; // Menggunakan stempel waktu asli dari database
}

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [error, setError] = useState("");

  // 🔥 1. FETCH DATA DARI RAILWAY API
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        setError("");
        
        // Memanggil endpoint https://invdocs-api-production.up.railway.app/api/users
        const res = await api.get("/users");
        
        // Menangani struktur response data
        const result = res.data.data || res.data;
        
        if (Array.isArray(result)) {
          setUsers(result);
        } else {
          setError("Format data dari server tidak dikenali.");
        }
      } catch (err: any) {
        console.error("Fetch Error:", err);
        setError(err.response?.data?.message || "Koneksi ke Railway API terputus.");
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  // 🔍 2. SEARCH LOGIC
  const filteredUsers = users.filter((user) =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }} 
      animate={{ opacity: 1, y: 0 }} 
      className="space-y-6"
    >
      {/* SECTION: HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tighter uppercase italic">
            User Directory
          </h1>
          <p className="text-slate-500 text-sm font-medium italic">
            Monitoring {users.length} registered system accounts.
          </p>
        </div>
        <motion.button 
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="flex items-center justify-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-[20px] font-bold text-sm shadow-xl shadow-blue-100 hover:bg-blue-700 transition-all"
        >
          <UserPlus size={18} />
          Invite Member
        </motion.button>
      </div>

      {/* SECTION: TABLE CONTAINER */}
      <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden">
        {/* Toolbar */}
        <div className="p-6 border-b border-slate-100 flex flex-wrap items-center justify-between gap-4">
          <div className="relative flex-1 max-w-sm font-medium group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" size={18} />
            <input 
              type="text" 
              placeholder="Filter by name or email..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm focus:ring-4 focus:ring-blue-500/10 outline-none transition-all"
            />
          </div>
          <button className="p-3 text-slate-400 hover:bg-slate-50 rounded-xl transition-all">
            <Filter size={20} />
          </button>
        </div>

        {/* Content Table */}
        <div className="overflow-x-auto">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-32 space-y-4">
              <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
              <p className="text-slate-400 font-black uppercase tracking-[0.3em] text-[10px] animate-pulse">
                Synchronizing with Railway...
              </p>
            </div>
          ) : error ? (
            <div className="py-32 flex flex-col items-center justify-center text-red-500 space-y-3">
              <AlertCircle size={40} className="opacity-50" />
              <p className="font-bold text-sm">{error}</p>
              <button onClick={() => window.location.reload()} className="text-xs bg-red-50 px-4 py-2 rounded-lg font-black uppercase">Retry Connection</button>
            </div>
          ) : (
            <table className="w-full text-left text-sm font-bold border-collapse">
              <thead className="bg-slate-50/50 text-slate-400 border-b border-slate-100 uppercase tracking-widest text-[10px]">
                <tr>
                  <th className="px-8 py-5">System Member</th>
                  <th className="px-8 py-5">Role Authority</th>
                  <th className="px-8 py-5">Joined Date</th>
                  <th className="px-8 py-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                <AnimatePresence>
                  {filteredUsers.length > 0 ? (
                    filteredUsers.map((user, i) => (
                      <motion.tr 
                        key={user.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: i * 0.03 }}
                        className="hover:bg-slate-50/50 transition-colors group"
                      >
                        <td className="px-8 py-5">
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-2xl bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-400 font-black">
                              {user.name.charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <p className="font-black text-slate-900 leading-none mb-1">{user.name}</p>
                              <div className="flex items-center gap-1.5 text-[11px] text-slate-400 lowercase font-medium">
                                <Mail size={10} /> {user.email}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-8 py-5">
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-600 text-[10px] uppercase tracking-wider font-black border border-blue-100">
                            <ShieldCheck size={12} /> {user.role}
                          </span>
                        </td>
                        <td className="px-8 py-5">
                          <div className="flex items-center gap-2 text-slate-500 font-medium text-xs italic">
                            <Calendar size={14} className="text-slate-300" />
                            {user.createdAt ? (
                              new Date(user.createdAt).toLocaleDateString('id-ID', {
                                day: 'numeric',
                                month: 'short',
                                year: 'numeric'
                              })
                            ) : "---"}
                          </div>
                        </td>
                        <td className="px-8 py-5 text-right">
                          <button className="p-2.5 text-slate-300 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-all">
                            <MoreVertical size={20} />
                          </button>
                        </td>
                      </motion.tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={4} className="py-20 text-center text-slate-400 uppercase tracking-widest text-[10px] font-black italic">
                        No matching members found
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