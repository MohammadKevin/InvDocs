"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

import {
  Check,
  X,
  Download,
  Search,
  Filter,
  FileText,
  Loader2,
} from "lucide-react";

import { api } from "@/lib/api";

interface DocumentItem {
  id: string;
  title?: string;
  file_name?: string;
  user?: {
    fullname?: string;
  };
  box?: {
    name_box?: string;
  };
  createdAt?: string;
  status?: string;
  file_url?: string;
}

export default function ApprovalsPage() {
  const [documents, setDocuments] = useState<DocumentItem[]>([]);

  const [loading, setLoading] = useState(true);

  const [searchTerm, setSearchTerm] = useState("");

  const [actionLoading, setActionLoading] = useState<string | null>(
    null
  );

  // FETCH DOCUMENTS
  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        setLoading(true);

        const res = await api.get("/documents");

        setDocuments(res.data || []);
      } catch (err) {
        console.error("Failed fetch documents:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDocuments();
  }, []);

  // APPROVE
  const handleApprove = async (id: string) => {
    try {
      setActionLoading(id);

      await api.patch(`/documents/${id}/approve`);

      setDocuments((prev) =>
        prev.map((doc) =>
          doc.id === id
            ? {
                ...doc,
                status: "approved",
              }
            : doc
        )
      );
    } catch (err) {
      console.error("Approve failed:", err);
    } finally {
      setActionLoading(null);
    }
  };

  // REJECT
  const handleReject = async (id: string) => {
    try {
      setActionLoading(id);

      await api.patch(`/documents/${id}/reject`);

      setDocuments((prev) =>
        prev.map((doc) =>
          doc.id === id
            ? {
                ...doc,
                status: "rejected",
              }
            : doc
        )
      );
    } catch (err) {
      console.error("Reject failed:", err);
    } finally {
      setActionLoading(null);
    }
  };

  // FILTER
  const filteredDocuments = documents.filter((doc) => {
    const title = (
      doc.title ||
      doc.file_name ||
      ""
    ).toLowerCase();

    const user = (
      doc.user?.fullname || ""
    ).toLowerCase();

    const search = searchTerm.toLowerCase();

    return (
      title.includes(search) ||
      user.includes(search)
    );
  });

  return (
    <div className="space-y-8">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tighter uppercase italic">
            Document Approvals
          </h1>

          <p className="text-slate-500 font-medium">
            Review and verify incoming documents for your rack.
          </p>
        </div>

        <div className="flex gap-3">
          <div className="relative group">
            <Search
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              size={18}
            />

            <input
              type="text"
              value={searchTerm}
              onChange={(e) =>
                setSearchTerm(e.target.value)
              }
              placeholder="Search documents..."
              className="pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-[20px] text-sm font-bold shadow-sm focus:ring-4 focus:ring-blue-500/10 outline-none w-64 transition-all"
            />
          </div>

          <button className="p-3 bg-white border border-slate-200 rounded-[18px] text-slate-600 hover:bg-slate-50 transition-all">
            <Filter size={20} />
          </button>
        </div>
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-24">
            <Loader2 className="w-10 h-10 animate-spin text-blue-600" />
          </div>
        ) : (
          <div className="overflow-x-auto text-sm font-bold">
            <table className="w-full text-left">
              <thead className="bg-slate-50/50 text-slate-400 uppercase tracking-widest text-[10px] border-b border-slate-100 font-black">
                <tr>
                  <th className="px-8 py-6">
                    Document Title
                  </th>

                  <th className="px-8 py-6">
                    Uploader
                  </th>

                  <th className="px-8 py-6">
                    Storage
                  </th>

                  <th className="px-8 py-6">
                    Status
                  </th>

                  <th className="px-8 py-6 text-center">
                    Action
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100 italic">
                {filteredDocuments.map((doc) => (
                  <motion.tr
                    key={doc.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="hover:bg-slate-50/50 transition-colors"
                  >
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-3">
                        <FileText
                          size={18}
                          className="text-slate-300"
                        />

                        <span className="text-slate-800 not-italic">
                          {doc.title ||
                            doc.file_name ||
                            "Untitled"}
                        </span>
                      </div>
                    </td>

                    <td className="px-8 py-5 text-slate-500 font-medium">
                      {doc.user?.fullname ||
                        "Unknown User"}
                    </td>

                    <td className="px-8 py-5">
                      <span className="bg-blue-50 text-blue-600 px-2 py-1 rounded-md text-[10px] uppercase font-black">
                        {doc.box?.name_box ||
                          "No Box"}
                      </span>
                    </td>

                    <td className="px-8 py-5">
                      <div
                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] uppercase font-black tracking-wider ${
                          doc.status === "approved"
                            ? "bg-emerald-50 text-emerald-600"
                            : doc.status === "pending"
                            ? "bg-amber-50 text-amber-600"
                            : "bg-red-50 text-red-600"
                        }`}
                      >
                        {doc.status || "pending"}
                      </div>
                    </td>

                    <td className="px-8 py-5">
                      <div className="flex justify-center gap-2">
                        {/* APPROVE */}
                        <button
                          disabled={
                            actionLoading === doc.id
                          }
                          onClick={() =>
                            handleApprove(doc.id)
                          }
                          className="p-2.5 bg-slate-900 text-white rounded-xl hover:bg-slate-800 transition-all shadow-md active:scale-95 disabled:opacity-50"
                        >
                          {actionLoading === doc.id ? (
                            <Loader2
                              size={16}
                              className="animate-spin"
                            />
                          ) : (
                            <Check size={16} />
                          )}
                        </button>

                        {/* REJECT */}
                        <button
                          disabled={
                            actionLoading === doc.id
                          }
                          onClick={() =>
                            handleReject(doc.id)
                          }
                          className="p-2.5 bg-white border border-slate-200 text-red-500 rounded-xl hover:bg-red-50 transition-all active:scale-95 disabled:opacity-50"
                        >
                          <X size={16} />
                        </button>

                        {/* DOWNLOAD */}
                        <a
                          href={
                            doc.file_url || "#"
                          }
                          target="_blank"
                          className="p-2.5 bg-slate-100 text-slate-600 rounded-xl hover:bg-slate-200 transition-all active:scale-95"
                        >
                          <Download size={16} />
                        </a>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}