"use client";

import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Check,
  X,
  Download,
  Search,
  Loader2,
  FileText,
  User,
  Archive,
  ExternalLink,
} from "lucide-react";

import { api } from "@/lib/api";
import { toast } from "sonner";

interface DocumentItem {
  id: string;
  title?: string;
  fileUrl?: string;
  status?: "pending" | "approved" | "rejected";
  user?: {
    fullname?: string;
    fullName?: string;
  };
  box?: {
    name_box?: string;
  };
}

export default function ApprovalsPage() {
  const [documents, setDocuments] = useState<DocumentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  useEffect(() => {
    fetchDocs();
  }, []);

  async function fetchDocs() {
    try {
      setLoading(true);
      const res = await api.get("/documents");
      const data = Array.isArray(res.data) ? res.data : res.data?.data ?? [];
      setDocuments(data);
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Gagal fetch documents");
    } finally {
      setLoading(false);
    }
  }

  async function updateStatus(id: string, action: "approve" | "reject") {
    try {
      setActionLoading(id);
      const url = action === "approve" ? `/documents/${id}/approve` : `/documents/${id}/reject`;
      await api.patch(url);

      setDocuments((prev) =>
        prev.map((doc) =>
          doc.id === id
            ? { ...doc, status: action === "approve" ? "approved" : "rejected" }
            : doc
        )
      );

      toast.success(`Document ${action === "approve" ? "approved" : "rejected"}`);
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Action gagal");
    } finally {
      setActionLoading(null);
    }
  }

  const filtered = useMemo(() => {
    const kw = search.toLowerCase();
    return documents.filter((d) => {
      const name = d.user?.fullname || d.user?.fullName || "";
      return d.title?.toLowerCase().includes(kw) || name.toLowerCase().includes(kw);
    });
  }, [documents, search]);

  const statusStyles = {
    approved: "bg-emerald-50 text-emerald-700 border-emerald-200",
    rejected: "bg-rose-50 text-rose-700 border-rose-200",
    pending: "bg-amber-50 text-amber-700 border-amber-200",
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 p-4 md:p-8">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-3xl border shadow-sm">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Approvals</h1>
          <p className="text-slate-500 text-sm">Manage and review document submissions.</p>
        </div>

        <div className="relative group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" size={18} />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search title or user..."
            className="pl-10 pr-4 py-2.5 border rounded-2xl text-sm w-full md:w-72 focus:ring-4 focus:ring-blue-50 outline-none transition-all"
          />
        </div>
      </div>

      {/* TABLE SECTION */}
      <div className="bg-white rounded-[2rem] border shadow-sm overflow-hidden transition-all">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-32 space-y-4">
            <Loader2 className="animate-spin text-blue-500" size={40} />
            <p className="text-slate-400 font-medium animate-pulse">Loading documents...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-32 space-y-3">
            <div className="bg-slate-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto">
              <FileText className="text-slate-300" size={32} />
            </div>
            <p className="text-slate-500 font-medium italic">No documents found matching your criteria</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-50 text-slate-500 font-semibold border-b">
                  <th className="p-5 text-left">Document Info</th>
                  <th className="p-5 text-left">Uploader</th>
                  <th className="p-5 text-left">Location</th>
                  <th className="p-5 text-left">Status</th>
                  <th className="p-5 text-center">Action</th>
                </tr>
              </thead>

              <tbody className="divide-y">
                <AnimatePresence>
                  {filtered.map((doc) => {
                    const isProcessing = actionLoading === doc.id;
                    const status = doc.status || "pending";

                    return (
                      <motion.tr 
                        layout
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        key={doc.id} 
                        className="hover:bg-slate-50/50 transition-colors group"
                      >
                        <td className="p-5">
                          <div className="flex items-center gap-3">
                            <div className="p-2 bg-blue-50 text-blue-600 rounded-xl">
                              <FileText size={18} />
                            </div>
                            <span className="font-bold text-slate-800">{doc.title || "Untitled Document"}</span>
                          </div>
                        </td>

                        <td className="p-5 text-slate-600">
                          <div className="flex items-center gap-2">
                            <User size={14} className="text-slate-400" />
                            {doc.user?.fullname || doc.user?.fullName || "System"}
                          </div>
                        </td>

                        <td className="p-5 text-slate-600">
                          <div className="flex items-center gap-2">
                            <Archive size={14} className="text-slate-400" />
                            {doc.box?.name_box || "Unassigned"}
                          </div>
                        </td>

                        <td className="p-5">
                          <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold border uppercase tracking-wider ${statusStyles[status]}`}>
                            {status}
                          </span>
                        </td>

                        <td className="p-5">
                          <div className="flex justify-center items-center gap-2">
                            {/* APPROVE */}
                            <button
                              disabled={isProcessing || status === "approved"}
                              onClick={() => updateStatus(doc.id, "approve")}
                              className="h-9 w-9 flex items-center justify-center bg-slate-900 text-white rounded-xl hover:bg-emerald-600 disabled:opacity-30 disabled:hover:bg-slate-900 transition-all shadow-sm"
                              title="Approve"
                            >
                              {isProcessing ? <Loader2 size={16} className="animate-spin" /> : <Check size={16} />}
                            </button>

                            {/* REJECT */}
                            <button
                              disabled={isProcessing || status === "rejected"}
                              onClick={() => updateStatus(doc.id, "reject")}
                              className="h-9 w-9 flex items-center justify-center border border-slate-200 bg-white text-slate-400 hover:text-rose-600 hover:border-rose-200 rounded-xl disabled:opacity-30 transition-all shadow-sm"
                              title="Reject"
                            >
                              <X size={16} />
                            </button>

                            {/* VIEW / DOWNLOAD */}
                            <button
                              onClick={() => doc.fileUrl && window.open(doc.fileUrl, "_blank")}
                              className="h-9 w-9 flex items-center justify-center border border-slate-200 bg-white text-slate-400 hover:text-blue-600 hover:border-blue-200 rounded-xl transition-all shadow-sm"
                              title="View Document"
                            >
                              <ExternalLink size={16} />
                            </button>
                          </div>
                        </td>
                      </motion.tr>
                    );
                  })}
                </AnimatePresence>
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}